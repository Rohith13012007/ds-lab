import React, { useState } from 'react';
import { X, BookOpen, Download, Upload, FileText, CheckCircle2, Folder, ExternalLink, Sparkles } from 'lucide-react';

export default function ModuleViewerModal({ module, onClose, onAddModuleResource }) {
  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus', 'resources', 'upload'
  const [uploadedFiles, setUploadedFiles] = useState(module.resources || []);
  const [fileInputName, setFileInputName] = useState('');

  if (!module) return null;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newResources = files.map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.name.split('.').pop().toLowerCase(),
      date: new Date().toISOString().split('T')[0]
    }));

    const updated = [...uploadedFiles, ...newResources];
    setUploadedFiles(updated);
    if (onAddModuleResource) {
      onAddModuleResource(module.id, newResources);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0b1329] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-[#0b1329] to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${module.badgeColor} shadow-lg`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Module {module.moduleNumber} Courseware
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {module.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 px-6 pt-4 border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'syllabus'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Syllabus & Curriculum ({module.syllabus?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'resources'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Module Files & Notes ({uploadedFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'upload'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Module Folder</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">Overview: </span>
              {module.summary}
            </div>
          </div>

          {/* Syllabus Tab */}
          {activeTab === 'syllabus' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Detailed Learning Objectives</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {module.syllabus?.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300 hover:border-cyan-500/30 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Module Downloads & Notebooks</span>
              </h4>
              <div className="space-y-2">
                {uploadedFiles.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300 hover:border-slate-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{res.name}</div>
                        <div className="text-[11px] text-slate-500">{res.size} • Uploaded {res.date}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Opening / Downloading ${res.name}`)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600 hover:text-white transition-all text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Folder Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-8 text-center bg-slate-900/40 transition-colors">
                <Folder className="w-12 h-12 text-cyan-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-base font-bold text-white mb-1">
                  Upload Module Materials or Folders
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  Select your module PDFs, Jupyter Notebooks (.ipynb), Python scripts (.py), or raw lab datasets (.csv) to store in this module.
                </p>

                <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg hover:shadow-cyan-500/25 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Choose Files / Folders</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
