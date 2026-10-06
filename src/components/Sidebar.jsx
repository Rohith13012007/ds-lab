import React from 'react';
import { Home, BookOpen, FlaskConical, Info, Sparkles, Database } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between min-h-[calc(100vh-65px)] bg-[#050a16] border-r border-slate-800/80 p-4 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
      {/* Upper Navigation Links */}
      <div className="space-y-2">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center justify-between">
          <span>Navigation</span>
          <Sparkles className="w-3 h-3 text-cyan-400" />
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Lower Tech Visual Card & Quote (As seen in the screenshot bottom left) */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl group">
          <img
            src="/sidebar_graphic.jpg"
            alt="Data Science Tech Visual"
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a16] via-[#050a16]/60 to-transparent flex flex-col justify-end p-4">
            <p className="text-xs italic text-slate-200 font-medium leading-relaxed drop-shadow-md">
              "Data is not just numbers, it's a story waiting to be told."
            </p>
            <p className="text-[11px] font-bold text-cyan-400 mt-1.5 flex items-center justify-end space-x-1">
              <span>- Data Science</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
