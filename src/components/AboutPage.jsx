import React from 'react';
import { Database, UserCheck, GraduationCap, Cpu, Code2, Award, Sparkles, Layers } from 'lucide-react';

export default function AboutPage({ profile }) {
  const techStack = [
    { name: "Python 3.11+", desc: "Core Data Analytics Engine", color: "from-blue-500 to-yellow-400" },
    { name: "Pandas & NumPy", desc: "Data Wrangling & Tensor Ops", color: "from-indigo-500 to-purple-500" },
    { name: "Matplotlib & Seaborn", desc: "Statistical Graphics", color: "from-cyan-500 to-blue-600" },
    { name: "Scikit-Learn", desc: "Supervised & Unsupervised ML", color: "from-emerald-500 to-teal-400" },
    { name: "PyTorch & TensorFlow", desc: "Deep Neural Architectures", color: "from-orange-500 to-red-500" },
    { name: "React 19 & Chart.js", desc: "Interactive Workbench UI", color: "from-pink-500 to-rose-400" }
  ];

  return (
    <div className="w-full space-y-6 mb-10 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-3xl glass-card border border-cyan-500/20 p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data Science Digital Library</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About The Lab Platform
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            The Data Science Digital Library is an interactive, state-of-the-art laboratory portal engineered for undergraduate and graduate Data Science students. Designed to streamline experiment execution, code verification, GitHub repository integration, and module courseware management.
          </p>
        </div>
      </div>

      {/* Student & Professor Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Profile Overview */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Student Information</h3>
              <p className="text-xs text-slate-400">Author & Lab Developer</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Full Name</span>
              <span className="text-white font-bold">{profile.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Roll Number</span>
              <span className="text-cyan-300 font-mono font-bold">{profile.rollNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Branch</span>
              <span className="text-white font-semibold">{profile.branch}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Section</span>
              <span className="text-white font-semibold">{profile.section}</span>
            </div>
          </div>
        </div>

        {/* Professor / Faculty Overview */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Faculty Supervisor</h3>
              <p className="text-xs text-slate-400">Course Instructor & Mentor</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Professor Name</span>
              <span className="text-white font-bold">{profile.professor}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Department</span>
              <span className="text-white font-semibold">Department of Data Science</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Academic Term</span>
              <span className="text-cyan-300 font-semibold">Semester V - DS Lab</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Lab Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Active & Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Core Technology Stack</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {techStack.map((tech, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
              <div className={`w-2.5 h-8 rounded-full bg-gradient-to-b ${tech.color}`}></div>
              <div>
                <div className="text-xs font-bold text-white">{tech.name}</div>
                <div className="text-[11px] text-slate-400">{tech.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
