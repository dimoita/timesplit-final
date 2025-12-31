
import React, { useState } from 'react';
import { ArrowLeft, Book, Sparkles, ChevronLeft, ChevronRight, Scroll, History, Shield, Trophy, Star } from 'lucide-react';
import { Chronicle } from '../App';

interface MemoryCodexProps {
  chronicles: Chronicle[];
  onBack: () => void;
}

export const MemoryCodex: React.FC<MemoryCodexProps> = ({ chronicles, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNext = () => {
    if (currentPage < chronicles.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-nunito text-white flex flex-col relative overflow-hidden p-4 md:p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_80%)] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

      {/* Tinta de Luz Styles */}
      <style>{`
        @keyframes light-ink-flow {
          0% { text-shadow: 0 0 0px rgba(168,85,247,0); color: rgba(255,255,255,0.1); }
          50% { text-shadow: 0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.4); color: rgba(255,255,255,1); }
          100% { text-shadow: 0 0 10px rgba(168,85,247,0.4); color: rgba(255,255,255,0.9); }
        }
        .animate-light-ink {
          animation: light-ink-flow 3s ease-out forwards;
        }
        .perspective-2000 {
          perspective: 2000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-left {
          transform: rotateY(-5deg) translateX(-10px);
        }
        .rotate-y-right {
          transform: rotateY(5deg) translateX(10px);
        }
      `}</style>

      <nav className="relative z-20 flex justify-between items-center mb-8 md:mb-12">
        <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
            <ArrowLeft size={20} />
          </div>
          <span className="hidden sm:inline font-bold uppercase tracking-widest text-xs">Voltar à Base</span>
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <Book className="text-purple-400 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.3em] text-center">Códice de Memória</h1>
          </div>
          <div className="text-[8px] md:text-[10px] font-black text-purple-500 uppercase tracking-widest mt-1">Registros Eternos da Resistência</div>
        </div>
        <div className="w-10 md:w-24"></div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center">
        {chronicles.length === 0 ? (
          <div className="text-center animate-pop-in flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-900/50 rounded-full flex items-center justify-center mb-6 border-2 border-slate-800 shadow-xl">
               <History size={60} className="text-slate-700" />
            </div>
            <p className="text-xl font-black uppercase tracking-widest text-slate-500">Sua lenda ainda não foi escrita.</p>
            <p className="text-xs mt-3 text-slate-600 max-w-xs leading-relaxed">Conclua missões táticas para registrar seus feitos heróicos.</p>
          </div>
        ) : (
          <div className="w-full max-w-5xl perspective-2000 relative">
            
            {/* 3D BOOK CONTAINER */}
            <div 
              className={`relative aspect-[16/10] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl border-[4px] border-purple-900/50 shadow-[0_0_80px_rgba(0,0,0,0.8)] transition-all duration-700 ease-in-out transform-style-3d
                ${isFlipping ? 'rotate-y-[-15deg] scale-95 opacity-50 blur-[2px]' : 'rotate-y-0 scale-100 opacity-100 blur-0'}
              `}
            >
              {/* Spine Detail */}
              <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-black/40 -translate-x-1/2 z-20 shadow-inner hidden md:block"></div>

              <div className="absolute inset-0 flex flex-col md:flex-row">
                {/* Left Page (The Narrative) */}
                <div className="flex-1 p-6 md:p-16 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.1),transparent)]"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 md:mb-8">
                            <span className="text-purple-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] bg-purple-950/50 px-3 py-1 rounded-full border border-purple-500/30">
                                Ciclo Solar {chronicles[currentPage].level}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent"></div>
                        </div>

                        <div className="mt-2 md:mt-4">
                            <p key={currentPage} className="text-lg md:text-3xl font-serif italic text-indigo-50 leading-relaxed animate-light-ink selection:bg-purple-500">
                                "{chronicles[currentPage].text}"
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-4 md:pt-6">
                        <div className="text-slate-500 font-mono text-[8px] md:text-[9px] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={12} className="text-purple-500" /> Sincronizado: {chronicles[currentPage].timestamp}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-purple-900/20 border border-purple-500/20 flex items-center justify-center">
                            <span className="text-purple-400 font-black text-xs italic">T</span>
                        </div>
                    </div>
                </div>

                {/* Right Page (The Emblem) */}
                <div className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center bg-black/20 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                    
                    {/* Ornamental Visual */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-dashed border-purple-500/20 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-4 border-2 border-purple-400/30 rounded-full animate-pulse"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-600 to-indigo-900 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] border-4 border-white/10 mb-4">
                                <Trophy size={48} className="text-white drop-shadow-lg" />
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">Selo de Bravura</div>
                                <div className="flex justify-center gap-1">
                                    {[1,2,3].map(i => <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center px-8 hidden md:block">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                            A memória neural do Herói fortalece a malha da realidade. Cada vitória gravada aqui ecoará na eternidade.
                        </p>
                    </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-8 mt-12 relative z-30">
              <button 
                onClick={handlePrev}
                disabled={currentPage === 0 || isFlipping}
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all
                  ${currentPage === 0 ? 'border-white/5 text-slate-700' : 'border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]'}
                `}
              >
                <ChevronLeft size={32} />
              </button>

              <div className="flex flex-col items-center">
                <div className="text-sm font-black text-white bg-slate-900 px-4 py-1 rounded-full border border-white/10">
                  {currentPage + 1} / {chronicles.length}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Página do Destino</div>
              </div>

              <button 
                onClick={handleNext}
                disabled={currentPage === chronicles.length - 1 || isFlipping}
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all
                  ${currentPage === chronicles.length - 1 ? 'border-white/5 text-slate-700' : 'border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]'}
                `}
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto text-center opacity-30">
        <p className="text-[8px] font-bold uppercase tracking-[0.4em]">TimeSplit Legacy System // Verified Records</p>
      </footer>
    </div>
  );
};
