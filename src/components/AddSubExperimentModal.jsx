import React, { useState } from 'react';
import { X, Plus, FileCode, Code2, Terminal, RefreshCw, AlertCircle } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

import { executePythonEngine } from '../utils/pythonEngine';

export default function AddSubExperimentModal({ isOpen, onClose, expId, onAddSubExperiment }) {
  const [codeNum, setCodeNum] = useState('1a');
  const [title, setTitle] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [code, setCode] = useState('# Write python script here...\nimport pandas as pd\nprint("Data Science Lab Execution")');
  const [consoleOutput, setConsoleOutput] = useState('Data Science Lab Execution\n[STATUS] Execution Successful (Exit code: 0)');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  if (!isOpen) return null;

  const fetchFromGithub = async (urlToFetch) => {
    const url = urlToFetch || githubUrl;
    if (!url.trim()) return;
    setIsFetching(true);
    setFetchError('');

    try {
      let rawUrl = url.trim();
      if (rawUrl.includes('github.com') && !rawUrl.includes('raw.githubusercontent.com')) {
        rawUrl = rawUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }

      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Unable to fetch raw file`);
      
      const text = await res.text();
      setCode(text);

      const execResult = executePythonEngine(text);
      setConsoleOutput(execResult.outputLogs);
      return text;
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch code from GitHub');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalCode = code;
    if (githubUrl.trim() && (code.startsWith('# Write python script') || !code.trim())) {
      const fetched = await fetchFromGithub(githubUrl);
      if (fetched) finalCode = fetched;
    }

    let finalOutput = consoleOutput;
    if (!finalOutput || finalOutput.includes('Data Science Lab Execution')) {
      const execResult = executePythonEngine(finalCode);
      finalOutput = execResult.outputLogs;
    }

    onAddSubExperiment(expId, {
      codeNum: codeNum.trim() || '1a',
      title: title.trim(),
      githubUrl: githubUrl.trim(),
      code: finalCode,
      consoleOutput: finalOutput,
      outputType: 'console'
    });

    setTitle('');
    setCodeNum('1a');
    setGithubUrl('');
    setCode('# Write python script here...\nimport pandas as pd\nprint("Data Science Lab Execution")');
    setConsoleOutput('Data Science Lab Execution\n[STATUS] Execution Successful (Exit code: 0)');
    setFetchError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0b1329] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-[#0b1329] to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Add Sub-Experiment (e.g., 1a, 1b)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Sub Code (e.g. 1a, 1b)
              </label>
              <input
                type="text"
                required
                placeholder="1a"
                value={codeNum}
                onChange={(e) => setCodeNum(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Sub-Experiment Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1a. Initial Script & Ingestion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>GitHub Repository / File Link (Auto-Fetches Code)</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="https://github.com/username/repo/blob/main/program1A.py"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => fetchFromGithub()}
                disabled={isFetching}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                <span>Fetch Code</span>
              </button>
            </div>
            {fetchError && (
              <div className="mt-1 text-red-400 text-[11px] flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{fetchError}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Python Code Snippet</span>
            </label>
            <textarea
              rows="6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Expected Output Logs</span>
            </label>
            <textarea
              rows="3"
              value={consoleOutput}
              onChange={(e) => setConsoleOutput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sub-Experiment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
