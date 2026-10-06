import React, { useState } from 'react';
import { X, Plus, FolderPlus, Sparkles } from 'lucide-react';

export default function AddExperimentModal({ isOpen, onClose, onAddExperiment }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddExperiment({
      title: title.trim(),
      description: description.trim() || 'Custom Data Science Experiment'
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0b1329] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-[#0b1329] to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Add New Main Experiment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Experiment Title / Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Experiment 6: Time Series Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Description / Objectives
            </label>
            <textarea
              rows="3"
              placeholder="Brief description of lab objectives and algorithms covered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
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
              <span>Create Main Experiment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
