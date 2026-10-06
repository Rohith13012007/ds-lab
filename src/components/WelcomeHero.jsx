import React from 'react';
import { Sparkles, Compass, Rocket } from 'lucide-react';

export default function WelcomeHero() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-card border border-cyan-500/20 p-6 lg:p-8 mb-6 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Welcome Copy */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Welcome to</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Data Science Digital Library
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-400">
            <span className="hover:text-white transition-colors">Explore</span>
            <span className="text-slate-600">•</span>
            <span className="hover:text-white transition-colors">Learn</span>
            <span className="text-slate-600">•</span>
            <span className="hover:text-white transition-colors">Build</span>
            <span className="text-slate-600">•</span>
            <span className="hover:text-white transition-colors">Grow</span>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pt-1">
            Your one-stop platform for Data Science learning, experiments and resources.
          </p>
        </div>

        {/* Right 3D Chart Graphic Banner */}
        <div className="relative shrink-0 w-full md:w-72 lg:w-80 h-36 sm:h-44 rounded-xl overflow-hidden border border-cyan-500/30 shadow-xl group">
          <img
            src="/hero_banner.jpg"
            alt="Data Analytics Graphic"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-transparent to-transparent opacity-40"></div>
        </div>
      </div>
    </div>
  );
}
