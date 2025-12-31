
import React from 'react';
import { AlertTriangle, Clock, BrainCircuit, XCircle, Check, Zap, Divide, AlertOctagon, TrendingDown, ArrowRight } from 'lucide-react';

export const Problem: React.FC = () => {
  return (
    <section className="w-full bg-[#0F172A] py-20 lg:py-32 relative overflow-hidden border-t border-slate-900">
      
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header - POINT C: PEACE AT DINNER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-6 animate-pulse">
             <AlertTriangle size={14} /> Diagnostic Report: Family Stress Level Critical
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight text-3d">
            Is Your Child Stuck at the <span className="text-red-500">"Kitchen Table"</span>?
          </h2>
          <p className="text-xl text-slate-400 font-bold leading-relaxed">
            Homework battles are destroying your evenings. Tears are shed. Dinner is ruined. <br className="hidden md:block" />
            <span className="text-white">It's not about math anymore. It's about your peace of mind.</span>
          </p>
        </div>

        {/* The Core Problems Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-24">
          
          {/* Problem 1: POINT B: THE "I'M STUPID" LABEL */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-red-500/30 rounded-3xl p-8 relative group hover:border-red-500/50 transition-colors">
             <div className="absolute -top-6 left-8 bg-red-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 text-2xl font-black rotate-3 group-hover:rotate-6 transition-transform">
                !
             </div>
             
             <div className="mt-4">
                <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                   The "I'm Stupid" Label
                </h3>
                <div className="bg-black/30 rounded-xl p-4 mb-6 font-mono text-sm text-red-300 border-l-4 border-red-500">
                   <div>Internal Monologue:</div>
                   <div className="mt-2 text-white italic">"Everyone else is finished. I'm still counting on my fingers. I must be broken."</div>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed">
                   When recall is slow, kids don't think "I need practice". They think <strong>"I am bad at this"</strong>. 
                   This identity label sticks for life. We have to break the "Finger Counting" habit before it breaks their confidence.
                </p>
             </div>
          </div>

          {/* Problem 2: POINT A: WINDOW OF OPPORTUNITY */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-orange-500/30 rounded-3xl p-8 relative group hover:border-orange-500/50 transition-colors">
             <div className="absolute -top-6 left-8 bg-orange-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-xl font-black -rotate-3 group-hover:-rotate-6 transition-transform">
                <Clock size={28} strokeWidth={3} />
             </div>
             
             <div className="mt-4">
                <h3 className="text-2xl font-black text-white mb-4">
                   The Window is Closing
                </h3>
                <div className="bg-black/30 rounded-xl p-4 mb-6 font-mono text-sm text-orange-300 border-l-4 border-orange-500">
                   <div>Time Remaining:</div>
                   <div className="mt-2 text-white">Before Middle School Algebra begins.</div>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed">
                   If they enter Middle School without automatic multiplication, <strong>Algebra becomes physically impossible</strong>. 
                   The cognitive load is too high. This is the critical window to fix the foundation before the "Division Wall" hits.
                </p>
             </div>
          </div>

        </div>

        {/* The Solution / Comparison */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 lg:p-12 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10"></div>
           
           <div className="relative z-10 text-center mb-12">
              <div className="inline-block bg-indigo-500 text-white font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
                 System Update Available
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-white">
                 We Installed a New Operating System.
              </h3>
           </div>

           <div className="grid md:grid-cols-2 gap-8 lg:gap-16 relative z-10">
              
              {/* Old Way */}
              <div className="space-y-6 opacity-70 hover:opacity-100 transition-opacity">
                 <div className="flex items-center gap-3 text-red-400 font-black uppercase tracking-widest text-sm border-b border-red-500/30 pb-2">
                    <XCircle size={18} /> The Old Way (School)
                 </div>
                 <ul className="space-y-4">
                    <li className="flex gap-4 text-slate-400">
                       <TrendingDown className="shrink-0 text-red-500" />
                       <span>Rote Memorization (Boring)</span>
                    </li>
                    <li className="flex gap-4 text-slate-400">
                       <AlertOctagon className="shrink-0 text-red-500" />
                       <span>Zero Feedback on Mistakes</span>
                    </li>
                    <li className="flex gap-4 text-slate-400">
                       <Clock className="shrink-0 text-red-500" />
                       <span>Takes years to master</span>
                    </li>
                 </ul>
              </div>

              {/* New Way */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 text-green-400 font-black uppercase tracking-widest text-sm border-b border-green-500/30 pb-2">
                    <Check size={18} strokeWidth={4} /> The TimeSplit Protocol
                 </div>
                 <ul className="space-y-4">
                    <li className="flex gap-4 text-white font-bold">
                       <BrainCircuit className="shrink-0 text-green-400" />
                       <span>Inverse Logic (Tri-Link System)</span>
                    </li>
                    <li className="flex gap-4 text-white font-bold">
                       <Zap className="shrink-0 text-green-400" fill="currentColor" />
                       <span>Instant Dopamine Feedback</span>
                    </li>
                    <li className="flex gap-4 text-white font-bold">
                       <ArrowRight className="shrink-0 text-green-400" strokeWidth={3} />
                       <span>Fluency in 30 Days</span>
                    </li>
                 </ul>
              </div>

           </div>
        </div>

      </div>
    </section>
  );
};
