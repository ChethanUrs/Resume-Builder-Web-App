import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Sparkles, Shield, Download, ArrowRight, Layout } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      
      {/* Decorative Radial Glowing Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-950/50 border border-primary-500/30 text-xs font-semibold text-primary-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen MERN Resume Builder</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Create a resume that <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">Elevates</span> your career.
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
              Build stunning, ATS-friendly resumes in real-time. Choose professional, high-fidelity templates with autosave, dark mode, and seamless vector PDF exports.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white text-sm font-bold shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Build Your Resume Now"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-6 py-3.5 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white text-sm font-bold transition-all duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Hero Visual Mockup Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-60" />
            
            {/* Visual Card */}
            <div className="relative glass-card border border-white/10 dark:bg-slate-900/50 p-6 rounded-3xl shadow-2xl w-full max-w-[380px] hover:rotate-1 hover:scale-[1.02] transition-all duration-300">
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live Workspace Preview</div>
              </div>
              
              <div className="space-y-4">
                {/* Visual Skeleton representation */}
                <div className="space-y-2">
                  <div className="h-6 bg-slate-800 rounded-lg w-2/3" />
                  <div className="h-3.5 bg-slate-800/60 rounded-md w-1/3" />
                </div>
                <div className="h-1.5 bg-primary-500/50 rounded-full w-full mt-2" />
                
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-slate-800/80 rounded w-full" />
                  <div className="h-3 bg-slate-800/80 rounded w-full" />
                  <div className="h-3 bg-slate-800/80 rounded w-4/5" />
                </div>

                <div className="pt-4 grid grid-cols-2 gap-2">
                  <div className="h-12 bg-slate-800/40 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Templates</span>
                    <span className="text-xs text-primary-400 font-bold mt-0.5">4 Styles</span>
                  </div>
                  <div className="h-12 bg-slate-800/40 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">AutoSave</span>
                    <span className="text-xs text-green-400 font-bold mt-0.5">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-10 border-t border-slate-900">
          <div className="glass-card border-white/5 p-6 rounded-2xl space-y-2.5">
            <div className="p-3 bg-primary-950/60 border border-primary-500/20 text-primary-400 rounded-xl w-fit">
              <Layout className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Dynamic Templates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch between Modern, Minimal, Creative, and Classic designs instantly. Your content automatically fits each layout.
            </p>
          </div>

          <div className="glass-card border-white/5 p-6 rounded-2xl space-y-2.5">
            <div className="p-3 bg-indigo-950/60 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Debounced Autosave</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never worry about losing your edits. Every change is stored safely in MongoDB as you type.
            </p>
          </div>

          <div className="glass-card border-white/5 p-6 rounded-2xl space-y-2.5">
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">High-Fidelity PDF Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export pixel-perfect PDFs utilizing dedicated web print styling. Standard dimensions scale vectors perfectly.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
