import React from 'react';
import { User, Hash, GraduationCap, Layers, UserCheck, Quote } from 'lucide-react';

export default function StudentProfile({ profile }) {
  const details = [
    { label: "Roll No", value: profile.rollNo, icon: Hash },
    { label: "Branch", value: profile.branch, icon: GraduationCap },
    { label: "Section", value: profile.section, icon: Layers },
    { label: "Professor", value: profile.professor, icon: UserCheck }
  ];

  return (
    <div className="w-full rounded-2xl glass-card border border-slate-800 p-5 lg:p-6 mb-6 shadow-xl relative overflow-hidden">
      {/* Decorative accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Profile Image & Name & Details */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Student Photo */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-cyan-400/40 p-1 bg-slate-900 shadow-xl shadow-cyan-500/10">
              <img
                src={profile.photo ? (profile.photo.startsWith('/') ? profile.photo : `/${profile.photo}`) : "/sandya.jpeg"}
                alt={profile.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-cyan-500 text-slate-950 p-1.5 rounded-lg shadow-md">
              <User className="w-4 h-4 font-bold" />
            </div>
          </div>

          {/* Student Info Details Table */}
          <div className="space-y-2.5 text-center sm:text-left flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <span>{profile.name}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1 text-xs sm:text-sm">
              {details.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center space-x-2 text-slate-300">
                    <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-slate-400 font-medium">{item.label}</span>
                    <span className="text-slate-500 font-bold">:</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Quote Card with Accent Line (Matches reference screenshot) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center bg-slate-900/60 rounded-xl p-5 border border-slate-800/80 relative">
          <Quote className="w-6 h-6 text-cyan-400/40 absolute top-3 left-3" />
          <p className="text-sm sm:text-base italic text-slate-200 text-center font-medium px-4 pt-2">
            "{profile.quote || "Small steps every day lead to big results."}"
          </p>

          {/* Glowing accent bar underneath quote */}
          <div className="mt-4 w-32 h-1.5 mx-auto rounded-full bg-slate-800 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-full animate-pulse-glow"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
