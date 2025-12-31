import React from 'react';
import { BrainCircuit, Rocket, Divide, Trophy, Zap, Crown } from 'lucide-react';

export const NeuroRoadmap: React.FC = () => {
  const milestones = [
    {
      day: 1,
      title: "The Awakening",
      desc: "They realize math isn't pain—it's a game. The emotional resistance drops instantly as they create their avatar.",
      icon: <BrainCircuit className="w-6 h-6 text-white" />,
      color: "bg-yellow-500",
      glow: "shadow-yellow-500/50",
      text: "text-yellow-700",
      ring: "ring-yellow-100"
    },
    {
      day: 7,
      title: "Finger Counting Ends",
      desc: "The habit of counting on fingers for 2s, 5s, and 10s is replaced by instant muscle memory.",
      icon: <Rocket className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
      glow: "shadow-orange-500/50",
      text: "text-orange-700",
      ring: "ring-orange-100"
    },
    {
      day: 15,
      title: "The Division Breakthrough",
      desc: "They grasp the 'Fact Family' concept. Division stops being scary and becomes just reverse-multiplication.",
      icon: <Divide className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
      glow: "shadow-indigo-500/50",
      text: "text-indigo-700",
      ring: "ring-indigo-100"
    },
    {
      day: 30,
      title: "Fluency Unlocked",
      desc: "Homework battles end. Answers come in under 3 seconds. Confidence spills over into other subjects.",
      icon: <Trophy className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
      glow: "shadow-emerald-500/50",
      text: "text-emerald-700",
      ring: "ring-emerald-100",
      isFinal: true
    }
  ];

  return (
    <section className="w-full bg-slate-50 py-20 lg:py-32 relative overflow-hidden border-b border-gray-100">
        {/* Background FX */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
            
            <div className="text-center mb-16 lg:mb-24">
                <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-6">
                    <Zap size={14} fill="currentColor"/>
                    <span>Timeline of Results</span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 text-3d leading-tight">
                    From "I Can't" to <br/>"I'm Done" in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">30 Days</span>.
                </h2>
                <p className="text-xl text-gray-600 font-bold max-w-2xl mx-auto">
                    We don't promise "magic". We promise a predictable neurological progression.
                </p>
            </div>

            <div className="relative">
                {/* The Nerve / Line */}
                <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-1 bg-gray-200 lg:-translate-x-1/2 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-transparent via-indigo-500 to-transparent animate-nerve-pulse opacity-50"></div>
                </div>

                <div className="space-y-12 lg:space-y-20">
                    {milestones.map((m, i) => (
                        <div key={i} className={`relative flex flex-col lg:flex-row items-start lg:items-center lg:justify-between ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                            
                            {/* The Node (Center) */}
                            <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 flex items-center justify-center z-20 top-8 lg:top-auto">
                                <div className={`w-6 h-6 rounded-full ${m.color} ring-4 ${m.ring} relative shadow-lg`}>
                                    <div className={`absolute inset-0 rounded-full ${m.color} animate-ping opacity-40 duration-[3s]`}></div>
                                </div>
                            </div>

                            {/* Date Badge (Side) */}
                            <div className={`hidden lg:block w-5/12 text-right ${i % 2 === 0 ? 'pr-16' : 'pl-16 text-left'}`}>
                                <div className="inline-flex flex-col items-center">
                                    <span className={`text-4xl font-black ${m.text} opacity-20`}>DAY</span>
                                    <span className={`text-6xl font-black ${m.text} leading-none`}>{m.day}</span>
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className={`w-full lg:w-5/12 pl-20 lg:pl-0 ${i % 2 === 0 ? 'lg:pl-16' : 'lg:pr-16'}`}>
                                <div className={`group bg-white rounded-3xl p-6 lg:p-8 border-2 border-gray-100 hover:border-indigo-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden transform hover:-translate-y-1 ${m.isFinal ? 'ring-4 ring-yellow-400/50' : ''}`}>
                                    
                                    {/* Hover Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${m.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                    <div className="relative z-10">
                                        {/* Mobile Date Badge */}
                                        <div className="lg:hidden mb-4">
                                            <span className={`inline-block px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest bg-gray-50 border border-gray-100 ${m.text}`}>
                                                Day {m.day}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.color} ${m.glow} group-hover:scale-110 transition-transform duration-300`}>
                                                {m.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
                                                    {m.title}
                                                </h3>
                                                <p className="text-gray-600 font-bold text-sm leading-relaxed">
                                                    {m.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* Final CTA Badge */}
            <div className="mt-20 lg:mt-32 text-center relative z-20">
                <div className="inline-flex items-center gap-3 bg-[#0f172a] text-white px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-gray-800 hover:scale-105 transition-transform cursor-default group">
                    <div className="relative">
                         <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50 animate-pulse"></div>
                         <Crown size={24} className="text-yellow-400 fill-yellow-400 relative z-10" />
                    </div>
                    <span className="font-bold text-sm sm:text-base">Your child is exactly <span className="text-yellow-400">30 days</span> away from this.</span>
                </div>
            </div>

        </div>

        <style>{`
            @keyframes nerve-pulse {
                0% { top: -40%; opacity: 0; }
                50% { opacity: 1; }
                100% { top: 140%; opacity: 0; }
            }
            .animate-nerve-pulse {
                animation: nerve-pulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
        `}</style>
    </section>
  );
};