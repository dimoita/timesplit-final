import React from 'react';
import { ScanEye, Share2, Flame, BrainCircuit, ScanLine } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="w-full bg-white py-20 lg:py-32 overflow-hidden relative" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
           <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#4F46E5] border border-indigo-100 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-6">
              <BrainCircuit size={14} />
              <span>The Methodology</span>
           </div>
           <h2 className="text-4xl lg:text-6xl font-black text-[#0f172a] mb-6 text-3d leading-tight">
             The 3-Step <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">Neural Repair</span> Protocol
           </h2>
           <p className="text-xl lg:text-2xl text-gray-600 font-bold max-w-2xl mx-auto">
             How we rewire the "math anxiety" pathways in 72 hours.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* VISUAL MOCKUP: THE NEURAL TRIANGLE */}
          <div className="relative mx-auto w-full max-w-[360px] h-[680px] perspective-1000">
             {/* Device Frame */}
             <div className="absolute inset-0 bg-[#0f172a] rounded-[3rem] shadow-2xl border-[8px] border-gray-800 ring-4 ring-black z-20 overflow-hidden transform rotate-[-3deg] transition-transform hover:rotate-0 duration-500">
                
                {/* Screen */}
                <div className="w-full h-full bg-[#1e1b4b] relative flex flex-col font-nunito overflow-hidden">
                   
                   {/* SCANNER OVERLAY */}
                   <div className="absolute top-0 left-0 w-full h-2 bg-green-400/50 blur-sm z-30 animate-scan-down"></div>
                   <div className="absolute inset-0 bg-green-500/5 z-20 animate-scan-pulse pointer-events-none"></div>

                   {/* Game UI Layer */}
                   <div className="p-6 pt-12 flex justify-between items-center bg-black/20 relative z-10">
                      <div className="text-xs font-mono text-green-400 flex items-center gap-1">
                          <ScanLine size={12} /> SCANNING...
                      </div>
                      <div className="text-white font-black text-lg tracking-widest">
                         GAP FOUND
                      </div>
                   </div>

                   <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                      {/* Grid Background */}
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                      {/* THE TRIANGLE VISUALIZATION */}
                      <div className="relative w-64 h-64">
                          {/* Lines */}
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                              <line x1="50" y1="20" x2="20" y2="80" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
                              <line x1="50" y1="20" x2="80" y2="80" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
                              <line x1="20" y1="80" x2="80" y2="80" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
                              
                              {/* Pulsing Active Connections */}
                              <line x1="50" y1="20" x2="20" y2="80" stroke="#4CAF50" strokeWidth="2" className="animate-draw-line" />
                              <line x1="50" y1="20" x2="80" y2="80" stroke="#4CAF50" strokeWidth="2" className="animate-draw-line-delayed" />
                          </svg>

                          {/* Top Node (Product) */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] z-10 relative">
                                  <span className="text-4xl font-black text-gray-900">56</span>
                                  <div className="absolute -right-2 -top-2 w-6 h-6 bg-[#4CAF50] rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                                      <span className="text-[10px] text-white font-bold">✓</span>
                                  </div>
                              </div>
                          </div>

                          {/* Left Node */}
                          <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2">
                               <div className="w-16 h-16 bg-[#1e293b] border-2 border-white/20 rounded-full flex items-center justify-center shadow-xl z-10">
                                  <span className="text-2xl font-black text-white">7</span>
                              </div>
                          </div>

                          {/* Right Node */}
                          <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2">
                               <div className="w-16 h-16 bg-[#1e293b] border-2 border-white/20 rounded-full flex items-center justify-center shadow-xl z-10">
                                  <span className="text-2xl font-black text-white">8</span>
                              </div>
                          </div>
                          
                          {/* Central Logic Symbol */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                              <div className="text-white/20 font-black text-4xl">×</div>
                          </div>
                      </div>

                      <div className="mt-12 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10 w-full text-center">
                          <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Neural Connection Formed</p>
                          <p className="text-white text-sm font-bold">Fact Family: 7 · 8 · 56</p>
                      </div>

                   </div>
                </div>
             </div>
          </div>

          {/* TEXT FEATURES: THE 3 STEPS */}
          <div className="space-y-12">
             
             {/* Step 1 */}
             <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white shrink-0 border-b-4 border-[#312E81] shadow-xl group-hover:scale-110 transition-transform duration-300">
                   <ScanEye size={32} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2">1. The Gap Scan</h3>
                   <p className="text-lg text-gray-600 font-bold leading-relaxed">
                      The app doesn't guess. It scans. In the first 5 minutes, we identify exactly which "wires" are loose (e.g., they know 2x2, but panic at 7x8). We map their unique "Math DNA".
                   </p>
                </div>
             </div>

             {/* Step 2 */}
             <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-[#F59E0B] flex items-center justify-center text-white shrink-0 border-b-4 border-[#B45309] shadow-xl group-hover:scale-110 transition-transform duration-300">
                   <Share2 size={32} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2">2. The Triplet Method</h3>
                   <p className="text-lg text-gray-600 font-bold leading-relaxed">
                      We stop rote memorization. We teach the <i>relationship</i>. If they understand that <span className="text-[#4F46E5] bg-indigo-50 px-1 rounded">7, 8, and 56</span> form a locked triangle, they master multiplication and division simultaneously. It's like a software update for their brain.
                   </p>
                </div>
             </div>

             {/* Step 3 */}
             <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-[#EF4444] flex items-center justify-center text-white shrink-0 border-b-4 border-[#991B1B] shadow-xl group-hover:scale-110 transition-transform duration-300">
                   <Flame size={32} strokeWidth={2.5} fill="currentColor" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2">3. The Dopamine Loop</h3>
                   <p className="text-lg text-gray-600 font-bold leading-relaxed">
                      We swap anxiety for an addiction to winning. Every correct answer triggers immediate rewards (coins, gems, sounds). Your child will ask <i>you</i> to do their homework.
                   </p>
                </div>
             </div>

          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes scan-down {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        @keyframes scan-pulse {
            0% { opacity: 0; }
            50% { opacity: 0.2; }
            100% { opacity: 0; }
        }
        @keyframes draw-line {
            0% { stroke-dasharray: 100; stroke-dashoffset: 100; }
            100% { stroke-dasharray: 100; stroke-dashoffset: 0; }
        }
        .animate-scan-down {
            animation: scan-down 3s linear infinite;
        }
        .animate-scan-pulse {
            animation: scan-pulse 3s linear infinite;
        }
        .animate-draw-line {
            animation: draw-line 2s ease-out infinite;
        }
        .animate-draw-line-delayed {
            animation: draw-line 2s ease-out infinite 1s;
        }
      `}</style>
    </section>
  );
};