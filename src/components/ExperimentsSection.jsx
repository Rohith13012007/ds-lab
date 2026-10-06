import React, { useState, useEffect } from 'react';
import {
  FlaskConical, Search, Plus, Folder, FileCode, Play, Copy, Check,
  RefreshCw, Terminal, Table as TableIcon, BarChart, Code2, AlertCircle, Sparkles, Trash2
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, RadialLinearScale
} from 'chart.js';
import { Line, Bar, Scatter, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, RadialLinearScale, Title, Tooltip, Legend
);

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

import { executePythonEngine } from '../utils/pythonEngine';

export default function ExperimentsSection({
  experiments,
  onOpenAddExpModal,
  onOpenAddSubExpModal,
  onUpdateSubExpCode,
  onDeleteExperiment,
  onDeleteSubExperiment
}) {
  const [selectedExpId, setSelectedExpId] = useState(experiments[0]?.id || null);
  const [selectedSubExpId, setSelectedSubExpId] = useState(
    experiments[0]?.subExperiments[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'output'
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [githubUrlInput, setGithubUrlInput] = useState('');
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Sync selected IDs if experiments change or elements get deleted
  useEffect(() => {
    if (experiments.length > 0) {
      const currentExp = experiments.find(e => e.id === selectedExpId);
      if (!currentExp) {
        setSelectedExpId(experiments[0].id);
        setSelectedSubExpId(experiments[0].subExperiments[0]?.id || null);
      } else if (currentExp.subExperiments && currentExp.subExperiments.length > 0) {
        const currentSub = currentExp.subExperiments.find(s => s.id === selectedSubExpId);
        if (!currentSub) {
          setSelectedSubExpId(currentExp.subExperiments[0].id);
        }
      } else {
        setSelectedSubExpId(null);
      }
    } else {
      setSelectedExpId(null);
      setSelectedSubExpId(null);
    }
  }, [experiments, selectedExpId, selectedSubExpId]);

  // Get active experiment
  const activeExp = experiments.find(e => e.id === selectedExpId) || experiments[0];

  // Get active sub-experiment
  const activeSubExp = activeExp?.subExperiments?.find(s => s.id === selectedSubExpId) || activeExp?.subExperiments[0];

  // Local Code & Custom Output states
  const [editingCode, setEditingCode] = useState(activeSubExp?.code || '');
  const [customConsoleOutput, setCustomConsoleOutput] = useState(activeSubExp?.consoleOutput || '');
  const [customTableData, setCustomTableData] = useState(activeSubExp?.tableData || null);
  const [customChartData, setCustomChartData] = useState(activeSubExp?.chartData || null);

  // Sync code & output whenever active sub-experiment changes
  useEffect(() => {
    if (activeSubExp) {
      setEditingCode(activeSubExp.code || '');
      setGithubUrlInput(activeSubExp.githubUrl || '');
      setCustomConsoleOutput(activeSubExp.consoleOutput || '');
      setCustomTableData(activeSubExp.tableData || null);
      setCustomChartData(activeSubExp.chartData || null);
    }
  }, [selectedSubExpId, activeSubExp]);

  // Execute / Run Python Code Engine
  const handleRunCode = (codeToRun) => {
    const codeStr = codeToRun || editingCode;
    setIsRunning(true);

    setTimeout(() => {
      const result = executePythonEngine(codeStr, activeSubExp?.title || activeExp?.title || '');

      setCustomConsoleOutput(result.outputLogs);
      setCustomTableData(result.tableData || null);
      setCustomChartData(result.chartData || null);

      if (onUpdateSubExpCode && activeSubExp) {
        onUpdateSubExpCode(selectedExpId, selectedSubExpId, codeStr, githubUrlInput, result.outputLogs);
      }
      setIsRunning(false);
      setActiveTab('output');
    }, 400);
  };

  // Handle Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(editingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Fetch Code from GitHub Link
  const handleFetchGithubCode = async () => {
    if (!githubUrlInput.trim()) return;
    setIsFetchingGithub(true);
    setGithubError('');

    try {
      let rawUrl = githubUrlInput.trim();

      if (rawUrl.includes('github.com') && !rawUrl.includes('raw.githubusercontent.com')) {
        rawUrl = rawUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }

      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}: Failed to fetch file`);
      
      const fetchedText = await res.text();
      setEditingCode(fetchedText);
      if (onUpdateSubExpCode && activeSubExp) {
        onUpdateSubExpCode(selectedExpId, selectedSubExpId, fetchedText, githubUrlInput);
      }
      
      // Auto-run fetched code
      handleRunCode(fetchedText);
    } catch (err) {
      setGithubError(err.message || 'Failed to fetch code from GitHub link');
    } finally {
      setIsFetchingGithub(false);
    }
  };

  // Filtered experiments based on search query
  const filteredExperiments = experiments.filter(exp => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesExp = exp.title.toLowerCase().includes(q) || exp.description.toLowerCase().includes(q);
    const matchesSub = (exp.subExperiments || []).some(s => s.title.toLowerCase().includes(q));
    return matchesExp || matchesSub;
  });

  return (
    <section className="w-full mb-10">
      {/* Experiments Section Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-cyan-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Experiments
          </h3>
        </div>

        {/* Right side: Search bar & Add Experiment button */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experiments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b1329] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/60 transition-all"
            />
          </div>

          <button
            onClick={onOpenAddExpModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {experiments.length === 0 ? (
        <div className="w-full rounded-3xl glass-card border border-cyan-500/20 p-12 text-center space-y-4 my-2">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <FlaskConical className="w-8 h-8 animate-pulse" />
          </div>
          <h4 className="text-xl font-extrabold text-white">No Experiments Added Yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Your laboratory workspace is ready. Click the button below to create your first main experiment, sub-experiments (1a, 1b...), and add Python code.
          </p>
          <button
            onClick={onOpenAddExpModal}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Experiment</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[480px]">
          {/* Column 1: Main Experiments Folder List */}
          <div className="lg:col-span-3 glass-card rounded-2xl p-3 border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between border-b border-slate-800/80 mb-2">
                <span>Main Experiments</span>
                <span className="text-cyan-400">{filteredExperiments.length}</span>
              </div>

              <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
                {filteredExperiments.map((exp) => {
                  const isSelected = exp.id === selectedExpId;
                  return (
                    <div key={exp.id} className="group flex items-center justify-between space-x-1">
                      <button
                        onClick={() => {
                          setSelectedExpId(exp.id);
                          if (exp.subExperiments?.length > 0) {
                            setSelectedSubExpId(exp.subExperiments[0].id);
                          } else {
                            setSelectedSubExpId(null);
                          }
                        }}
                        className={`flex-1 flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{exp.title}</span>
                      </button>
                      {onDeleteExperiment && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteExperiment(exp.id);
                          }}
                          title="Delete Main Experiment"
                          className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/60 transition-colors opacity-80 group-hover:opacity-100 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onOpenAddExpModal}
              className="w-full mt-3 flex items-center justify-center space-x-2 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>New Main Experiment</span>
            </button>
          </div>

          {/* Column 2: Sub-Experiments Document List */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-3 border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between border-b border-slate-800/80 mb-2">
                <span>Sub Experiments</span>
                <span className="text-cyan-400">{activeExp?.subExperiments?.length || 0}</span>
              </div>

              <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
                {activeExp?.subExperiments?.map((sub) => {
                  const isSelected = sub.id === selectedSubExpId;
                  return (
                    <div key={sub.id} className="group flex items-center justify-between space-x-1">
                      <button
                        onClick={() => setSelectedSubExpId(sub.id)}
                        className={`flex-1 flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                          isSelected
                            ? 'bg-blue-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                        }`}
                      >
                        <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="truncate">{sub.title}</span>
                      </button>
                      {onDeleteSubExperiment && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteSubExperiment(activeExp.id, sub.id);
                          }}
                          title="Delete Sub-Experiment"
                          className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/60 transition-colors opacity-80 group-hover:opacity-100 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => onOpenAddSubExpModal(selectedExpId || (experiments[0] && experiments[0].id))}
              className="w-full mt-3 flex items-center justify-center space-x-2 py-2 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/60 text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Sub-Experiment (e.g. 1a, 1b)</span>
            </button>
          </div>

          {/* Column 3: Code & Output Workbench */}
          <div className="lg:col-span-5 glass-card rounded-2xl border border-slate-800/90 flex flex-col overflow-hidden">
            {/* GitHub Fetch Bar */}
            <div className="px-3.5 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center space-x-2">
              <GithubIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Paste GitHub repository or file link (e.g. https://github.com/.../program1A.py)"
                value={githubUrlInput}
                onChange={(e) => setGithubUrlInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleFetchGithubCode}
                disabled={isFetchingGithub}
                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold flex items-center space-x-1 shrink-0 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingGithub ? 'animate-spin' : ''}`} />
                <span>Fetch</span>
              </button>
            </div>

            {githubError && (
              <div className="px-3 py-1.5 bg-red-950/40 border-b border-red-500/30 text-red-400 text-[11px] flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{githubError}</span>
              </div>
            )}

            {/* Code vs Output Header Tabs & Run Code Button */}
            <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'code'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>

                <button
                  onClick={() => setActiveTab('output')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'output'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Output</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {/* Run Code Button */}
                <button
                  onClick={() => handleRunCode()}
                  disabled={isRunning}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Workbench Body Content */}
            <div className="flex-1 p-4 bg-[#070d1e] overflow-y-auto max-h-[380px] code-container">
              {activeTab === 'code' ? (
                <div className="relative h-full">
                  <textarea
                    value={editingCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingCode(val);
                      if (onUpdateSubExpCode && activeSubExp) {
                        onUpdateSubExpCode(selectedExpId, selectedSubExpId, val, githubUrlInput);
                      }
                    }}
                    placeholder="# Write Python code here or fetch from GitHub..."
                    className="w-full h-full min-h-[300px] bg-transparent text-cyan-300 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                    spellCheck="false"
                  />
                </div>
              ) : (
                /* Output Panel */
                <div className="space-y-4 text-xs font-mono text-slate-200">
                  {/* Console Log Output */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center space-x-1">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>Console Output</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {customConsoleOutput || '[INFO] Ready to execute code. Click "Run Code" above.'}
                    </pre>
                  </div>

                  {/* Table Data View (if available) */}
                  {customTableData && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center space-x-1">
                        <TableIcon className="w-3 h-3 text-cyan-400" />
                        <span>Dataframe Preview</span>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-900 text-cyan-300 border-b border-slate-800">
                            <tr>
                              {customTableData.headers.map((h, idx) => (
                                <th key={idx} className="p-2 font-bold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 text-slate-300">
                            {customTableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/50">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Interactive Chart View (if available) */}
                  {customChartData && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center space-x-1">
                        <BarChart className="w-3 h-3 text-cyan-400" />
                        <span>Data Science Visualization</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-center">
                        {customChartData.type === 'bar' && (
                          <Bar
                            data={customChartData}
                            options={{
                              responsive: true,
                              plugins: { legend: { labels: { color: '#94a3b8' } } },
                              scales: {
                                x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                                y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                              }
                            }}
                          />
                        )}
                        {customChartData.type === 'line' && (
                          <Line
                            data={customChartData}
                            options={{
                              responsive: true,
                              plugins: { legend: { labels: { color: '#94a3b8' } } },
                              scales: {
                                x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                                y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                              }
                            }}
                          />
                        )}
                        {customChartData.type === 'scatter' && (
                          <Scatter
                            data={customChartData}
                            options={{
                              responsive: true,
                              plugins: { legend: { labels: { color: '#94a3b8' } } },
                              scales: {
                                x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                                y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                              }
                            }}
                          />
                        )}
                        {customChartData.type === 'radar' && (
                          <Radar
                            data={customChartData}
                            options={{
                              responsive: true,
                              plugins: { legend: { labels: { color: '#94a3b8' } } },
                              scales: {
                                r: { angleLines: { color: '#1e293b' }, grid: { color: '#1e293b' }, pointLabels: { color: '#94a3b8' } }
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
