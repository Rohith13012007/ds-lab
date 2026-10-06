import React from 'react';
import { Database, BarChart3, Brain, Network, FileCode, ArrowRight, Layers, Sparkles } from 'lucide-react';

const iconMap = {
  Database: Database,
  BarChart3: BarChart3,
  Brain: Brain,
  Network: Network,
  FileCode: FileCode
};

export default function ModulesSection({ modules, onSelectModule }) {
  return (
    <section className="w-full mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Data Science Modules
          </h3>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{modules.length} Modules</span>
        </div>
      </div>

      {/* 5 Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {modules.map((mod) => {
          const IconComponent = iconMap[mod.icon] || Database;
          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod)}
              className={`group cursor-pointer rounded-2xl glass-card border p-4 flex flex-col justify-between transition-all duration-300 ${mod.borderColor} hover:border-opacity-100 hover:shadow-lg`}
            >
              <div>
                {/* Icon & Module Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${mod.badgeColor} shadow-md`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Module {mod.moduleNumber}
                  </span>
                </div>

                {/* Module Title */}
                <h4 className="text-sm font-bold text-white mb-1.5 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                  {mod.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {mod.description}
                </p>
              </div>

              {/* View Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectModule(mod);
                }}
                className={`w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white transition-all shadow-md ${mod.btnColor}`}
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
