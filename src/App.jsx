import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import WelcomeHero from './components/WelcomeHero';
import StudentProfile from './components/StudentProfile';
import ModulesSection from './components/ModulesSection';
import ExperimentsSection from './components/ExperimentsSection';
import ModuleViewerModal from './components/ModuleViewerModal';
import AddExperimentModal from './components/AddExperimentModal';
import AddSubExperimentModal from './components/AddSubExperimentModal';
import AboutPage from './components/AboutPage';

import { initialProfile, initialModules, initialExperiments } from './data/initialData';
import {
  fetchExperimentsApi,
  createExperimentApi,
  updateExperimentApi,
  deleteExperimentApi,
  deleteSubExperimentApi,
  migrateLocalExperimentsApi
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOffline, setIsOffline] = useState(false);
  const [apiNotice, setApiNotice] = useState('');

  // Persistent local storage profile & modules
  const [profile] = useState(() => {
    const saved = localStorage.getItem('ds_lab_profile');
    const parsed = saved ? JSON.parse(saved) : initialProfile;
    return { ...parsed, photo: initialProfile.photo };
  });

  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('ds_lab_modules');
    const parsed = saved ? JSON.parse(saved) : [];
    return initialModules.map((initMod) => {
      const existing = parsed.find(m => m.id === initMod.id) || {};
      return {
        ...initMod,
        resources: existing.resources || initMod.resources
      };
    });
  });

  // Local fallback / cache getter
  const getMergedExperiments = useCallback(() => {
    const savedStr = localStorage.getItem('ds_lab_experiments');
    const deletedStr = localStorage.getItem('ds_lab_deleted_ids');
    const deletedIds = deletedStr ? JSON.parse(deletedStr) : [];

    if (!savedStr) {
      return initialExperiments.filter(e => !deletedIds.includes(e.id));
    }

    try {
      const saved = JSON.parse(savedStr);
      if (!Array.isArray(saved)) return initialExperiments;

      const mergedMap = new Map();

      saved.forEach(exp => {
        if (!deletedIds.includes(exp.id)) {
          mergedMap.set(exp.id, exp);
        }
      });

      initialExperiments.forEach(initExp => {
        if (!deletedIds.includes(initExp.id)) {
          if (!mergedMap.has(initExp.id)) {
            mergedMap.set(initExp.id, initExp);
          } else {
            const existingExp = mergedMap.get(initExp.id);
            const existingSubMap = new Map();
            (existingExp.subExperiments || []).forEach(sub => existingSubMap.set(sub.id, sub));

            (initExp.subExperiments || []).forEach(initSub => {
              if (!deletedIds.includes(initSub.id) && !existingSubMap.has(initSub.id)) {
                existingSubMap.set(initSub.id, initSub);
              }
            });

            mergedMap.set(initExp.id, {
              ...existingExp,
              subExperiments: Array.from(existingSubMap.values())
            });
          }
        }
      });

      return Array.from(mergedMap.values());
    } catch (err) {
      console.error("Error loading experiments from localStorage:", err);
      return initialExperiments;
    }
  }, []);

  const [experiments, setExperiments] = useState(() => getMergedExperiments());

  // Modal states
  const [selectedModule, setSelectedModule] = useState(null);
  const [isAddExpModalOpen, setIsAddExpModalOpen] = useState(false);
  const [isAddSubExpModalOpen, setIsAddSubExpModalOpen] = useState(false);
  const [targetExpForSub, setTargetExpForSub] = useState(null);

  // Sync state to LocalStorage cache
  useEffect(() => {
    localStorage.setItem('ds_lab_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ds_lab_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('ds_lab_experiments', JSON.stringify(experiments));
  }, [experiments]);

  // Primary Source of Truth: Fetch from MongoDB Backend API on App Mount
  const loadExperimentsFromBackend = useCallback(async () => {
    try {
      const data = await fetchExperimentsApi();
      if (Array.isArray(data) && data.length > 0) {
        setExperiments(data);
        localStorage.setItem('ds_lab_experiments', JSON.stringify(data));
        setIsOffline(false);
        setApiNotice('');

        // One-time local data migration to MongoDB
        const migrationDone = localStorage.getItem('ds_lab_migration_completed');
        if (!migrationDone) {
          const savedStr = localStorage.getItem('ds_lab_experiments');
          if (savedStr) {
            const localSaved = JSON.parse(savedStr);
            const customItems = localSaved.filter(e => e.id && !e.id.startsWith('exp-1') && !e.id.startsWith('exp-2'));
            if (customItems.length > 0) {
              await migrateLocalExperimentsApi(customItems).catch(() => {});
            }
          }
          localStorage.setItem('ds_lab_migration_completed', 'true');
        }
      }
    } catch (err) {
      console.warn("Backend API unavailable. Falling back to local cache.", err.message);
      setIsOffline(true);
      setApiNotice('Database server disconnected. Using local offline cache.');
      setExperiments(getMergedExperiments());
    }
  }, [getMergedExperiments]);

  useEffect(() => {
    loadExperimentsFromBackend();
  }, [loadExperimentsFromBackend]);

  // Sync real-time storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ds_lab_experiments' && e.newValue) {
        try {
          setExperiments(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Error syncing experiments across tabs:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handlers with MongoDB persistence
  const handleAddExperiment = async (newExp) => {
    const expObj = {
      id: `exp-${Date.now()}`,
      title: newExp.title,
      description: newExp.description,
      subExperiments: [
        {
          id: `sub-${Date.now()}-1`,
          codeNum: "1a",
          title: "1a. Initial Script & Ingestion",
          githubUrl: "",
          code: `# ${newExp.title}\nimport pandas as pd\nimport numpy as np\n\nprint("Executing custom experiment script...")`,
          outputType: "console",
          consoleOutput: `Executing custom experiment script...\n[STATUS] Execution Completed (Exit Code: 0)`
        }
      ]
    };

    // Optimistic UI & local cache update
    setExperiments(prev => [...prev, expObj]);

    // Save to MongoDB database
    try {
      const savedInDb = await createExperimentApi(expObj);
      if (savedInDb) {
        setExperiments(prev => prev.map(e => e.id === expObj.id ? savedInDb : e));
        setIsOffline(false);
      }
    } catch (err) {
      console.warn("Failed to persist new experiment to MongoDB:", err.message);
      setIsOffline(true);
      setApiNotice('Saved to local browser cache. Server unavailable.');
    }
  };

  const handleAddSubExperiment = async (expId, newSub) => {
    const targetExp = experiments.find(e => e.id === expId);
    if (!targetExp) return;

    const newSubObj = {
      id: `sub-${Date.now()}`,
      codeNum: newSub.codeNum,
      title: newSub.title,
      githubUrl: newSub.githubUrl || '',
      code: newSub.code,
      outputType: 'console',
      consoleOutput: newSub.consoleOutput
    };

    const updatedSubExps = [...(targetExp.subExperiments || []), newSubObj];
    const updatedExp = { ...targetExp, subExperiments: updatedSubExps };

    // Optimistic update
    setExperiments(prev => prev.map(exp => exp.id === expId ? updatedExp : exp));

    // Save to MongoDB
    try {
      await updateExperimentApi(expId, updatedExp);
      setIsOffline(false);
    } catch (err) {
      console.warn("Failed to save sub-experiment to MongoDB:", err.message);
      setIsOffline(true);
    }
  };

  const handleDeleteExperiment = async (expId) => {
    const deletedStr = localStorage.getItem('ds_lab_deleted_ids');
    const deletedIds = deletedStr ? JSON.parse(deletedStr) : [];
    if (!deletedIds.includes(expId)) {
      deletedIds.push(expId);
      localStorage.setItem('ds_lab_deleted_ids', JSON.stringify(deletedIds));
    }

    setExperiments(prev => prev.filter(exp => exp.id !== expId));

    try {
      await deleteExperimentApi(expId);
      setIsOffline(false);
    } catch (err) {
      console.warn("Failed to delete experiment from MongoDB:", err.message);
    }
  };

  const handleDeleteSubExperiment = async (expId, subExpId) => {
    const deletedStr = localStorage.getItem('ds_lab_deleted_ids');
    const deletedIds = deletedStr ? JSON.parse(deletedStr) : [];
    if (!deletedIds.includes(subExpId)) {
      deletedIds.push(subExpId);
      localStorage.setItem('ds_lab_deleted_ids', JSON.stringify(deletedIds));
    }

    const targetExp = experiments.find(e => e.id === expId);
    if (targetExp) {
      const updatedSubExps = (targetExp.subExperiments || []).filter(sub => sub.id !== subExpId);
      const updatedExp = { ...targetExp, subExperiments: updatedSubExps };

      setExperiments(prev => prev.map(exp => exp.id === expId ? updatedExp : exp));

      try {
        await deleteSubExperimentApi(expId, subExpId);
        setIsOffline(false);
      } catch (err) {
        console.warn("Failed to delete sub-experiment from MongoDB:", err.message);
      }
    }
  };

  const handleUpdateSubExpCode = async (expId, subExpId, newCode, githubUrl, newConsoleOutput) => {
    let updatedExpToSave = null;

    setExperiments(prev => prev.map(exp => {
      if (exp.id === expId) {
        const updatedSubs = exp.subExperiments.map(sub => {
          if (sub.id === subExpId) {
            return {
              ...sub,
              code: newCode !== undefined ? newCode : sub.code,
              githubUrl: githubUrl !== undefined ? githubUrl : sub.githubUrl,
              consoleOutput: newConsoleOutput !== undefined ? newConsoleOutput : sub.consoleOutput
            };
          }
          return sub;
        });
        updatedExpToSave = { ...exp, subExperiments: updatedSubs };
        return updatedExpToSave;
      }
      return exp;
    }));

    if (updatedExpToSave) {
      try {
        await updateExperimentApi(expId, updatedExpToSave);
        setIsOffline(false);
      } catch (_err) {
        // Silent fallback to local cache
      }
    }
  };

  const handleAddModuleResource = (moduleId, newResources) => {
    setModules(prev => prev.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          resources: [...(mod.resources || []), ...newResources]
        };
      }
      return mod;
    }));
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Non-blocking Database Status Banner */}
      {isOffline && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2 text-center text-xs text-amber-200 flex items-center justify-center space-x-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
          <span>{apiNotice || 'Database server is offline. Changes are saved to local browser cache.'}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden min-w-0">
          {/* Active Tab View Rendering */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Hero Banner */}
              <WelcomeHero />

              {/* Student Profile Card (M. Sandya Rani) */}
              <StudentProfile profile={profile} />

              {/* 5 Data Science Modules Section */}
              <ModulesSection
                modules={modules}
                onSelectModule={(mod) => setSelectedModule(mod)}
              />

              {/* Experiments Workbench Section */}
              <ExperimentsSection
                experiments={experiments}
                onOpenAddExpModal={() => setIsAddExpModalOpen(true)}
                onOpenAddSubExpModal={(expId) => {
                  setTargetExpForSub(expId);
                  setIsAddSubExpModalOpen(true);
                }}
                onUpdateSubExpCode={handleUpdateSubExpCode}
                onDeleteExperiment={handleDeleteExperiment}
                onDeleteSubExperiment={handleDeleteSubExperiment}
              />
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Data Science Course Modules</h2>
                  <p className="text-xs text-slate-400">Click any module to inspect syllabus topics, notes, or upload local lab folder files.</p>
                </div>
              </div>
              <ModulesSection
                modules={modules}
                onSelectModule={(mod) => setSelectedModule(mod)}
              />
            </div>
          )}

          {activeTab === 'experiments' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Interactive Experiments Workbench</h2>
                  <p className="text-xs text-slate-400">Manage main experiments, sub-experiments (1a, 1b...), run code, and import GitHub scripts.</p>
                </div>
              </div>
              <ExperimentsSection
                experiments={experiments}
                onOpenAddExpModal={() => setIsAddExpModalOpen(true)}
                onOpenAddSubExpModal={(expId) => {
                  setTargetExpForSub(expId);
                  setIsAddSubExpModalOpen(true);
                }}
                onUpdateSubExpCode={handleUpdateSubExpCode}
                onDeleteExperiment={handleDeleteExperiment}
                onDeleteSubExperiment={handleDeleteSubExperiment}
              />
            </div>
          )}

          {activeTab === 'about' && (
            <AboutPage profile={profile} />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedModule && (
        <ModuleViewerModal
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onAddModuleResource={handleAddModuleResource}
        />
      )}

      <AddExperimentModal
        isOpen={isAddExpModalOpen}
        onClose={() => setIsAddExpModalOpen(false)}
        onAddExperiment={handleAddExperiment}
      />

      <AddSubExperimentModal
        isOpen={isAddSubExpModalOpen}
        onClose={() => setIsAddSubExpModalOpen(false)}
        expId={targetExpForSub}
        onAddSubExperiment={handleAddSubExperiment}
      />
    </div>
  );
}
