import React, { useState, useRef, useEffect } from 'react';
import { Brain, Zap, X, Check, ArrowLeftRight } from 'lucide-react';

export const ScienceComparison: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => { isDragging.current = true; };
  const handleTouchMove = (e: React.TouchEvent) => { handleMove(e.touches[0].clientX); };

  // Global event listeners for drag end
  useEffect(() => {
    const stopDrag = () => { isDragging.current = false; };
    const moveDrag = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX);
    };

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', moveDrag);
    return () => {
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('mousemove', moveDrag);
    };
  }, []);

  return (
    <section className="w-full bg-white py-16 lg:py-24 overflow-hidden select-none border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#4F46E5] border border-indigo-100 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-4">
              <Brain size={14} />
              <span>Cognitive Load Theory</span>
           </div>
           <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4 text-3d">
             Not Magic. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">Neuroscience.</span>
           </h2>
           <p className="text-gray-500 font-bold max-w-lg mx-auto">
              Drag the slider to see how we replace "Memorization Anxiety" with "Visual Anchoring".
           </p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-gray-900 cursor-ew-resize group touch-none"
          onMouseDown={handleMouseDown}
          onTouchMove={handleTouchMove}
        >
          {/* RIGHT SIDE (Base Layer) - THE TIME SPLIT WAY */}
          <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center">
             {/* Content Area */}
             <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-200 via-transparent to-transparent"></div>
                
                {/* Visuals */}
                <div className="relative z-10 flex flex-col items-center">
                   <div className="relative w-64 h-64 mb-6 scale-90 md:scale-100">
                      {/* Triangle Connections */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                         <line x1="50" y1="20" x2="20" y2="80" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" className="animate-draw" />
                         <line x1="50" y1="20" x2="80" y2="80" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" className="animate-draw delay-100" />
                         <line x1="20" y1="80" x2="80" y2="80" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" className="animate-draw delay-200" />
                      </svg>
                      {/* Nodes */}
                      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-[#4CAF50] flex items-center justify-center text-2xl font-black text-gray-900 shadow-lg z-20">56</div>
                      <div className="absolute bottom-[20%] left-[20%] -translate-x-1/2 translate-y-1/2 w-14 h-14 bg-white rounded-full border-4 border-[#4CAF50] flex items-center justify-center text-xl font-black text-gray-900 shadow-lg z-20">7</div>
                      <div className="absolute bottom-[20%] right-[20%] translate-x-1/2 translate-y-1/2 w-14 h-14 bg-white rounded-full border-4 border-[#4CAF50] flex items-center justify-center text-xl font-black text-gray-900 shadow-lg z-20">8</div>
                   </div>

                   <div className="bg-white/80 backdrop-blur rounded-xl px-6 py-3 border border-green-200 shadow-sm text-center">
                      <div className="text-[#4CAF50] font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 mb-1">
                         <Check size={20} strokeWidth={4} /> Visual Anchoring
                      </div>
                      <p className="text-gray-500 text-xs font-bold">Long-Term Storage Active</p>
                   </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-10 right-10 text-green-200 opacity-50"><Brain size={120} /></div>
             </div>
          </div>

          {/* LEFT SIDE (Clipped Layer) - THE OLD WAY */}
          <div 
             className="absolute inset-0 bg-[#0f172a] flex items-center justify-center"
             style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
             <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                
                {/* Chaos Visuals */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-64 h-64 mb-6 flex items-center justify-center scale-90 md:scale-100">
                       <div className="absolute animate-bounce text-red-500/30 text-6xl font-black top-0 left-10 rotate-12">7x8?</div>
                       <div className="absolute animate-bounce text-red-500/50 text-4xl font-black bottom-10 right-0 -rotate-12" style={{animationDelay: '0.2s'}}>56/7?</div>
                       <div className="absolute animate-ping text-red-600 opacity-20 w-32 h-32 rounded-full bg-red-500 blur-2xl"></div>
                       
                       <div className="relative z-10 w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500 animate-pulse">
                          <Zap size={48} className="text-red-500 fill-red-500" />
                       </div>
                    </div>

                    <div className="bg-red-900/30 backdrop-blur rounded-xl px-6 py-3 border border-red-500/30 shadow-sm text-center">
                       <div className="text-red-400 font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 mb-1">
                          <X size={20} strokeWidth={4} /> Cognitive Overload
                       </div>
                       <p className="text-red-300/60 text-xs font-bold">Discarded in 24 hours</p>
                    </div>
                </div>
                
                {/* Floating anxiety elements */}
                <div className="absolute top-1/4 left-1/4 text-gray-700 font-black text-xl animate-float opacity-20">Memorize!</div>
                <div className="absolute bottom-1/4 right-1/4 text-gray-700 font-black text-xl animate-float-delayed opacity-20">Fast!</div>
             </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPosition}%` }}
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-gray-100 text-gray-400 transition-transform hover:scale-110">
                <ArrowLeftRight size={20} strokeWidth={3} />
             </div>
          </div>

        </div>

        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mt-4 px-2">
            <span>The Old Way</span>
            <span>The TimeSplit Way</span>
        </div>

      </div>
      <style>{`
        .animate-draw {
           stroke-dasharray: 100;
           stroke-dashoffset: 100;
           animation: dash 2s linear infinite;
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
};