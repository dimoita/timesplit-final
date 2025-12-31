import React from 'react';
import { Car, FileText, Ban, Zap, Coffee, Check, GraduationCap, School, Smartphone } from 'lucide-react';

export const CompetitorBreakdown: React.FC = () => {
  return (
    <section className="w-full bg-[#0F172A] py-20 lg:py-32 relative overflow-hidden border-t border-gray-900">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
           <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 text-3d">
             The <span className="text-red-500 line-through decoration-4 decoration-white/20">Hidden</span> Cost of Math Help
           </h2>
           <p className="text-gray-400 font-bold text-lg max-w-2xl mx-auto">
             It's not just about money. It's about your time, your energy, and your sanity.
           </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
           
           {/* 1. Private Tutor */}
           <div className="bg-[#1e293b]/50 backdrop-blur border border-gray-800 rounded-3xl p-6 text-center opacity-70 hover:opacity-100 transition-opacity group">
               <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-500 group-hover:scale-110 transition-transform">
                  <GraduationCap size={32} />
               </div>
               <h3 className="text-xl font-black text-gray-400 mb-2">Private Tutor</h3>
               <div className="text-2xl font-black text-white mb-6">~$50<span className="text-sm text-gray-500 font-bold">/hr</span></div>
               
               <div className="space-y-5 text-sm font-bold text-gray-400 border-t border-gray-800 pt-6">
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-red-400 flex items-center gap-1 uppercase tracking-wider text-[10px]"><Car size={12}/> High Effort</div>
                      <span className="text-white">Driving & Scheduling</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-yellow-500 uppercase tracking-wider text-[10px]">Unpredictable</div>
                      <span className="text-white">Depends on chemistry</span>
                   </div>
               </div>
           </div>

           {/* 2. Math Center */}
           <div className="bg-[#1e293b]/50 backdrop-blur border border-gray-800 rounded-3xl p-6 text-center opacity-70 hover:opacity-100 transition-opacity group">
               <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-500 group-hover:scale-110 transition-transform">
                  <School size={32} />
               </div>
               <h3 className="text-xl font-black text-gray-400 mb-2">Math Center</h3>
               <div className="text-2xl font-black text-white mb-6">~$180<span className="text-sm text-gray-500 font-bold">/mo</span></div>
               
               <div className="space-y-5 text-sm font-bold text-gray-400 border-t border-gray-800 pt-6">
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-red-400 flex items-center gap-1 uppercase tracking-wider text-[10px]"><FileText size={12}/> Paperwork</div>
                      <span className="text-white">You grade worksheets</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-red-400 flex items-center gap-1 uppercase tracking-wider text-[10px]"><Car size={12}/> Commute</div>
                      <span className="text-white">2x weekly drop-offs</span>
                   </div>
               </div>
           </div>

           {/* 3. Free Apps */}
           <div className="bg-[#1e293b]/50 backdrop-blur border border-gray-800 rounded-3xl p-6 text-center opacity-70 hover:opacity-100 transition-opacity group">
               <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-500 group-hover:scale-110 transition-transform">
                  <Smartphone size={32} />
               </div>
               <h3 className="text-xl font-black text-gray-400 mb-2">Free Apps</h3>
               <div className="text-2xl font-black text-white mb-6">$0<span className="text-sm text-gray-500 font-bold"></span></div>
               
               <div className="space-y-5 text-sm font-bold text-gray-400 border-t border-gray-800 pt-6">
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-red-400 flex items-center gap-1 uppercase tracking-wider text-[10px]"><Ban size={12}/> Annoying</div>
                      <span className="text-white">Full of Ads</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-gray-500 uppercase tracking-wider text-[10px]">Ineffective</div>
                      <span className="text-white">No structured curriculum</span>
                   </div>
               </div>
           </div>

           {/* 4. TimeSplit (HERO) */}
           <div className="bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] border-[3px] border-[#4F46E5] rounded-3xl p-6 text-center transform scale-105 shadow-[0_0_60px_rgba(79,70,229,0.2)] relative z-10 lg:-translate-y-4">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#4CAF50] text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg border-2 border-[#1e1b4b] tracking-widest">
                   Best ROI
               </div>
               
               <div className="w-16 h-16 bg-[#4F46E5] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-500/50 animate-pulse">
                  <Zap size={32} fill="currentColor" />
               </div>
               <h3 className="text-2xl font-black text-white mb-2">TimeSplit</h3>
               <div className="text-4xl font-black text-[#4CAF50] mb-6 text-3d">$37<span className="text-sm text-gray-400 font-bold"> one-time</span></div>
               
               <div className="space-y-6 text-sm font-bold text-white border-t border-indigo-900/50 pt-6">
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-[#4CAF50] flex items-center gap-2 text-lg uppercase tracking-wide"><Coffee size={18}/> Zero Effort</div>
                      <span className="text-xs text-indigo-200">You relax. They play.</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <div className="text-[#4CAF50] flex items-center gap-1 uppercase tracking-wider text-[10px]"><Check size={12} strokeWidth={4}/> Guaranteed</div>
                      <span className="text-xs text-indigo-200">Results in 30 days or refund</span>
                   </div>
               </div>
           </div>

        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
            <div className="inline-flex flex-col md:flex-row items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-8 py-4 text-gray-400 font-bold text-sm">
                <div className="bg-red-500/20 p-2 rounded-full"><Car size={18} className="text-red-400" /></div>
                <span>Parents save an average of <span className="text-white">10 hours of driving</span> per month switching to TimeSplit.</span>
            </div>
        </div>

      </div>
    </section>
  );
};