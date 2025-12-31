import React, { useState } from 'react';
import { Gamepad2, LineChart, Zap, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export const TechShowcase: React.FC = () => {
  const [view, setView] = useState<'KID' | 'PARENT'>('KID');

  return (
    <section className="w-full bg-[#0F172A] py-20 lg:py-32 overflow-hidden relative border-b border-gray-800">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
           <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 text-3d leading-tight">
             You Get the Data. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">They Get the Fun.</span>
           </h2>
           <p className="text-gray-400 font-bold text-lg max-w-2xl mx-auto">
             While they are busy saving the universe, our Smart Engine is silently mapping their neural pathways and generating your report.
           </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
            <div className="bg-gray-800/50 p-1 rounded-full flex relative border border-gray-700 backdrop-blur-sm cursor-pointer shadow-2xl">
                <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#4F46E5] rounded-full transition-all duration-300 shadow-lg ${view === 'KID' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                ></div>
                
                <button 
                    onClick={() => setView('KID')}
                    className={`relative z-10 px-6 sm:px-10 py-3 rounded-full flex items-center gap-2 font-black uppercase tracking-wide text-xs sm:text-sm transition-colors ${view === 'KID' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <Gamepad2 size={18} /> Kid's View
                </button>
                <button 
                    onClick={() => setView('PARENT')}
                    className={`relative z-10 px-6 sm:px-10 py-3 rounded-full flex items-center gap-2 font-black uppercase tracking-wide text-xs sm:text-sm transition-colors ${view === 'PARENT' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <LineChart size={18} /> Parent's View
                </button>
            </div>
        </div>

        {/* Laptop Mockup */}
        <div className="relative max-w-4xl mx-auto perspective-1000 transform scale-90 sm:scale-100">
            
            {/* Floating Label */}
            <div className={`absolute -top-16 md:top-10 transition-all duration-500 z-20 w-full md:w-auto text-center md:text-left ${view === 'KID' ? 'md:-left-24' : 'md:-right-24'}`}>
                <div className={`inline-flex bg-white text-gray-900 px-4 py-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] font-bold text-sm items-center gap-3 border-l-4 ${view === 'KID' ? 'border-purple-500' : 'border-blue-500'} animate-float`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${view === 'KID' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                        {view === 'KID' ? <Gamepad2 size={16}/> : <Activity size={16}/>}
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Interface</div>
                        <div>{view === 'KID' ? "Immersive Boss Battles" : "Real-time Neural Analytics"}</div>
                    </div>
                </div>
            </div>

            {/* Lid */}
            <div className="bg-[#1e293b] rounded-t-[2rem] p-3 pb-0 border-[4px] border-gray-700 border-b-0 shadow-2xl relative z-10">
                {/* Camera */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 rounded-full ring-1 ring-gray-600"></div>
                
                {/* Screen */}
                <div className="bg-black aspect-video rounded-t-xl overflow-hidden relative border-[2px] border-gray-800">
                    
                    {/* VIEW A: KID */}
                    <div className={`absolute inset-0 bg-slate-900 flex flex-col transition-opacity duration-500 ${view === 'KID' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        {/* Kid UI Overlay */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        
                        {/* Top Bar */}
                        <div className="p-4 sm:p-6 flex justify-between items-center z-10">
                            <div className="flex gap-1">
                                {[1,2,3].map(i => <div key={i} className="text-red-500 drop-shadow-lg text-lg sm:text-xl">❤️</div>)}
                            </div>
                            <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-pulse">
                                Streak x4 🔥
                            </div>
                        </div>

                        {/* Battle Scene */}
                        <div className="flex-1 flex items-center justify-between px-8 sm:px-16 md:px-24 relative z-10">
                            {/* Hero */}
                            <div className="text-5xl sm:text-7xl animate-float-delayed drop-shadow-2xl grayscale-0">🚀</div>
                            
                            {/* Problem */}
                            <div className="flex flex-col items-center z-20">
                                <div className="text-3xl sm:text-5xl md:text-6xl font-black text-white text-3d mb-6 sm:mb-8 animate-pulse text-shadow-glow">
                                    7 × 8 = ?
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-[200px]">
                                    <div className="bg-white/10 px-4 py-2 sm:py-3 rounded-xl text-white font-black text-lg sm:text-xl border border-white/10 opacity-50">54</div>
                                    <div className="bg-[#4CAF50] px-4 py-2 sm:py-3 rounded-xl text-white font-black text-lg sm:text-xl shadow-[0_0_30px_rgba(76,175,80,0.6)] border border-green-400 transform scale-110">56</div>
                                </div>
                            </div>

                            {/* Villain */}
                            <div className="text-5xl sm:text-7xl animate-float filter hue-rotate-15 drop-shadow-2xl">👹</div>
                        </div>

                        {/* Particles */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>

                    {/* VIEW B: PARENT */}
                    <div className={`absolute inset-0 bg-slate-50 flex transition-opacity duration-500 ${view === 'PARENT' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        
                        {/* Sidebar */}
                        <div className="w-48 bg-white border-r border-gray-200 p-4 hidden md:block">
                            <div className="flex items-center gap-2 mb-8 opacity-50">
                                <div className="w-6 h-6 bg-indigo-600 rounded"></div>
                                <div className="h-2 w-20 bg-gray-200 rounded"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center px-3 text-xs font-bold gap-2"><Activity size={14}/> Live Session</div>
                                <div className="h-8 text-gray-400 flex items-center px-3 text-xs font-bold gap-2"><LineChart size={14}/> Progress</div>
                                <div className="h-8 text-gray-400 flex items-center px-3 text-xs font-bold gap-2"><Zap size={14}/> Weak Spots</div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <div>
                                    <div className="text-base sm:text-lg font-black text-gray-900">Live Analysis</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Session Active • 12 mins</div>
                                </div>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                                {/* Card 1: Live Feed */}
                                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm relative overflow-hidden flex flex-col">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">Neural Feed</div>
                                    <div className="space-y-3 relative z-10">
                                        <div className="flex gap-2 items-start opacity-50">
                                            <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                                            <div className="text-xs text-gray-600"><span className="font-bold">2x2</span> recalled in 0.8s</div>
                                        </div>
                                        <div className="flex gap-2 items-start">
                                            <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                                            <div className="text-xs text-gray-900"><span className="font-bold">7x8</span> failed. Gap Detected.</div>
                                        </div>
                                        <div className="flex gap-2 items-start">
                                            <Zap size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                                            <div className="text-xs text-gray-900 font-bold bg-yellow-50 px-2 py-1 rounded text-yellow-700 leading-snug">Protocol Update: Increasing frequency of 7s</div>
                                        </div>
                                        <div className="flex gap-2 items-start opacity-40">
                                            <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                                            <div className="text-xs text-gray-600">Streak: 4x</div>
                                        </div>
                                    </div>
                                    {/* Fade bottom */}
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-20"></div>
                                </div>

                                {/* Card 2: Heatmap */}
                                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">Curriculum Map</div>
                                    <div className="flex-1 grid grid-cols-5 gap-1.5 content-start">
                                        {Array.from({length: 20}).map((_, i) => {
                                            // Simulate a heatmap pattern
                                            let color = 'bg-green-400';
                                            if (i === 7 || i === 12) color = 'bg-red-400 animate-pulse'; // Weak spots
                                            if (i === 8 || i === 13) color = 'bg-yellow-400';
                                            if (i > 15) color = 'bg-gray-100';
                                            return <div key={i} className={`rounded-md aspect-square ${color}`}></div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>

            {/* Base */}
            <div className="bg-[#0f172a] h-3 sm:h-4 rounded-b-[1rem] mx-4 sm:mx-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-gray-700/50"></div>

        </div>

      </div>
      <style>{`
        .text-shadow-glow {
            text-shadow: 0 0 20px rgba(255,255,255,0.5);
        }
      `}</style>
    </section>
  );
};