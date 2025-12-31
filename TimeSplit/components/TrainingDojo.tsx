import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Brain, Sparkles, Zap, RefreshCw, CheckCircle2, Circle, X as XIcon, Divide } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

type MasteryMap = Record<string, number>;

interface DojoProps {
  mastery: MasteryMap;
  onComplete: (results: { mastered: string[], coins: number }) => void;
  onExit: () => void;
}

interface TriLinkProblem {
  id: string;
  top: number; // Product
  left: number; // Factor A
  right: number; // Factor B
  missing: 'top' | 'left' | 'right';
}

export const TrainingDojo: React.FC<DojoProps> = ({ mastery, onComplete, onExit }) => {
  const [problems, setProblems] = useState<TriLinkProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'IDLE' | 'CHARGING' | 'COMPLETE' | 'SUMMARY'>('IDLE');
  
  // Interaction State
  const [activeNodes, setActiveNodes] = useState<string[]>([]); // 'top', 'left', 'right'
  const [isRevealed, setIsRevealed] = useState(false);
  
  const { playCorrect, playWin } = useGameSound();

  // Initialize Session
  useEffect(() => {
    // 1. Identify Weak Spots (Score < 0.8)
    const weakSpots = Object.entries(mastery)
      .filter(([_, score]) => (score as number) < 0.8)
      .map(([key]) => key);
    
    const poolSize = 10;
    const selected: TriLinkProblem[] = [];

    for (let i = 0; i < poolSize; i++) {
        let factorA, factorB;
        
        // Prioritize weak spots
        if (weakSpots.length > 0 && Math.random() < 0.7) {
            const key = weakSpots[Math.floor(Math.random() * weakSpots.length)];
            if (key.includes('x')) {
                [factorA, factorB] = key.split('x').map(Number);
            } else {
                // If stored as division (rare in current mastery map but possible), parse it
                const [num, den] = key.split('/').map(Number);
                factorA = den;
                factorB = num / den;
            }
        } else {
            // Random standard problem (Factors 2-9)
            factorA = Math.floor(Math.random() * 8) + 2;
            factorB = Math.floor(Math.random() * 8) + 2;
        }

        const product = factorA * factorB;
        const missingType = Math.random() > 0.5 ? 'top' : (Math.random() > 0.5 ? 'left' : 'right');

        selected.push({
            id: `${factorA}x${factorB}-${i}`,
            top: product,
            left: factorA,
            right: factorB,
            missing: missingType
        });
    }

    setProblems(selected);
  }, [mastery]);

  const currentProblem = problems[currentIndex];

  const handleNodeClick = (node: 'top' | 'left' | 'right') => {
      if (phase !== 'IDLE' || activeNodes.includes(node)) return;
      if (node === currentProblem.missing) return; // Cannot click the missing one yet

      playCorrect(); // Soft ping
      const newActive = [...activeNodes, node];
      setActiveNodes(newActive);

      // Check if we have activated all known nodes (2 nodes)
      if (newActive.length >= 2) {
          setPhase('CHARGING');
          setTimeout(() => {
              setIsRevealed(true);
              playWin(); // Success sound
              setPhase('COMPLETE');
          }, 800); // Wait for beam animation
      }
  };

  const nextProblem = () => {
      if (currentIndex < problems.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setPhase('IDLE');
          setActiveNodes([]);
          setIsRevealed(false);
      } else {
          setPhase('SUMMARY');
      }
  };

  // Render Logic
  if (!currentProblem && phase !== 'SUMMARY') return <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">Loading Dojo...</div>;

  if (phase === 'SUMMARY') {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(20,184,166,0.3)]">
                  <Brain size={48} className="text-teal-400" />
              </div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-widest uppercase">Training Complete</h2>
              <p className="text-slate-400 font-medium mb-8 max-w-md">
                  Your neural pathways have been reinforced. The logic is now stronger.
              </p>
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 w-full max-w-sm">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 font-bold uppercase text-xs">Problems Solved</span>
                      <span className="text-white font-black text-xl">10/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase text-xs">Reward</span>
                      <span className="text-yellow-400 font-black text-xl flex items-center gap-2">+15 <span className="text-xs">SPLITZ</span></span>
                  </div>
              </div>

              <Button onClick={() => onComplete({ mastered: problems.map(p => `${p.left}x${p.right}`), coins: 15 })} className="w-full max-w-xs h-16 text-lg bg-teal-600 hover:bg-teal-500 border-teal-800">
                  Return to Dashboard
              </Button>
          </div>
      );
  }

  // --- TRI-LINK VISUALS ---
  const POS = {
      top: { x: 50, y: 20 },
      left: { x: 20, y: 80 },
      right: { x: 80, y: 80 }
  };

  const isTopActive = activeNodes.includes('top') || (currentProblem.missing === 'top' && isRevealed);
  const isLeftActive = activeNodes.includes('left') || (currentProblem.missing === 'left' && isRevealed);
  const isRightActive = activeNodes.includes('right') || (currentProblem.missing === 'right' && isRevealed);

  // LOGIC TYPE
  const isMultiplication = currentProblem.missing === 'top';

  return (
    <div className="min-h-screen bg-slate-950 font-mono relative overflow-hidden flex flex-col">
      {/* Zen Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,#020617_100%)]"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-teal-500/10 rounded-full blur-sm animate-float-slow"
                style={{
                    width: Math.random() * 10 + 2 + 'px',
                    height: Math.random() * 10 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDuration: Math.random() * 10 + 10 + 's',
                    animationDelay: Math.random() * 5 + 's'
                }}
              ></div>
          ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
          <button onClick={onExit} className="text-slate-500 hover:text-white transition-colors">
              <ArrowLeft />
          </button>
          <div className="flex gap-1">
              {problems.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-colors ${i < currentIndex ? 'bg-teal-500' : i === currentIndex ? 'bg-white animate-pulse' : 'bg-slate-800'}`}
                  ></div>
              ))}
          </div>
          <div className="w-6"></div> {/* Spacer */}
      </div>

      {/* MAIN HOLO-TRIANGLE AREA */}
      <div className="flex-1 relative flex flex-col items-center justify-center max-w-lg mx-auto w-full p-4">
          
          {/* Mode Indicator */}
          <div className={`mb-8 px-4 py-1.5 rounded-full border bg-opacity-20 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500
              ${isMultiplication ? 'bg-blue-500 border-blue-400/50 text-blue-300' : 'bg-purple-500 border-purple-400/50 text-purple-300'}
          `}>
              <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  {isMultiplication ? <><XIcon size={12} /> Fusion (Multiply)</> : <><Divide size={12} /> Fission (Divide)</>}
              </span>
          </div>

          <div className="relative w-full aspect-square max-h-[500px]">
              
              {/* SVG Connector Layer */}
              <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                  {/* Base Triangle Lines (Dim) */}
                  <line x1="50%" y1="20%" x2="20%" y2="80%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="50%" y1="20%" x2="80%" y2="80%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="20%" y1="80%" x2="80%" y2="80%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Active Beams */}
                  {/* Top-Left Connection */}
                  <line 
                    x1="50%" y1="20%" x2="20%" y2="80%" 
                    stroke={isTopActive && isLeftActive ? "#14b8a6" : "transparent"} 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className={phase === 'CHARGING' ? 'animate-beam' : ''}
                  />
                  {/* Top-Right Connection */}
                  <line 
                    x1="50%" y1="20%" x2="80%" y2="80%" 
                    stroke={isTopActive && isRightActive ? "#14b8a6" : "transparent"} 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className={phase === 'CHARGING' ? 'animate-beam delay-100' : ''}
                  />
                  {/* Bottom Connection */}
                  <line 
                    x1="20%" y1="80%" x2="80%" y2="80%" 
                    stroke={isLeftActive && isRightActive ? "#14b8a6" : "transparent"} 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className={phase === 'CHARGING' ? 'animate-beam delay-200' : ''}
                  />
              </svg>

              {/* NODE: TOP (Product) */}
              <div 
                className={`absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500
                    ${isTopActive 
                        ? 'scale-110 drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]' 
                        : 'opacity-80 hover:opacity-100 hover:scale-105'}
                `}
                onClick={() => handleNodeClick('top')}
              >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-[3px] bg-slate-900 relative z-10
                      ${isTopActive ? 'border-teal-400 text-teal-300' : 'border-slate-700 text-slate-500'}
                  `}>
                      {currentProblem.missing === 'top' && !isRevealed ? (
                          <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse"></div>
                      ) : (
                          <span className="text-4xl font-black font-nunito">{currentProblem.top}</span>
                      )}
                  </div>
              </div>

              {/* NODE: LEFT (Factor A) */}
              <div 
                className={`absolute bottom-[20%] left-[20%] -translate-x-1/2 translate-y-1/2 cursor-pointer transition-all duration-500
                    ${isLeftActive 
                        ? 'scale-110 drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]' 
                        : 'opacity-80 hover:opacity-100 hover:scale-105'}
                `}
                onClick={() => handleNodeClick('left')}
              >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border-[3px] bg-slate-900 relative z-10
                      ${isLeftActive ? 'border-teal-400 text-teal-300' : 'border-slate-700 text-slate-500'}
                  `}>
                      {currentProblem.missing === 'left' && !isRevealed ? (
                          <div className="w-6 h-6 rounded-full bg-slate-800 animate-pulse"></div>
                      ) : (
                          <span className="text-3xl font-black font-nunito">{currentProblem.left}</span>
                      )}
                  </div>
              </div>

              {/* NODE: RIGHT (Factor B) */}
              <div 
                className={`absolute bottom-[20%] right-[20%] translate-x-1/2 translate-y-1/2 cursor-pointer transition-all duration-500
                    ${isRightActive 
                        ? 'scale-110 drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]' 
                        : 'opacity-80 hover:opacity-100 hover:scale-105'}
                `}
                onClick={() => handleNodeClick('right')}
              >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border-[3px] bg-slate-900 relative z-10
                      ${isRightActive ? 'border-teal-400 text-teal-300' : 'border-slate-700 text-slate-500'}
                  `}>
                      {currentProblem.missing === 'right' && !isRevealed ? (
                          <div className="w-6 h-6 rounded-full bg-slate-800 animate-pulse"></div>
                      ) : (
                          <span className="text-3xl font-black font-nunito">{currentProblem.right}</span>
                      )}
                  </div>
              </div>

              {/* Operator Symbol in Center (Dynamic based on type) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 transition-all duration-500">
                  {isMultiplication ? (
                      <XIcon size={80} className={`text-teal-500 ${phase === 'CHARGING' ? 'animate-pulse scale-125' : ''}`} />
                  ) : (
                      <Divide size={80} className={`text-purple-500 ${phase === 'CHARGING' ? 'animate-pulse scale-125' : ''}`} />
                  )}
              </div>

          </div>

          {/* Feedback Text */}
          <div className="h-12 mt-4 text-center">
              {phase === 'IDLE' && (
                  <p className="text-teal-500/50 font-bold uppercase tracking-widest text-sm animate-pulse">
                      {isMultiplication ? 'Tap the 2 Factors to Combine' : 'Tap the Product & Factor to Split'}
                  </p>
              )}
              {phase === 'COMPLETE' && (
                  <div className="flex items-center justify-center gap-2 text-teal-400 animate-pop-in">
                      <CheckCircle2 /> <span className="font-bold uppercase tracking-widest">Neural Link Established</span>
                  </div>
              )}
          </div>

          {/* Next Button */}
          <div className={`mt-8 transition-all duration-500 ${phase === 'COMPLETE' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
              <Button onClick={nextProblem} className="bg-teal-600 hover:bg-teal-500 border-teal-800 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] px-12">
                  Next Sequence
              </Button>
          </div>

      </div>

      <style>{`
        @keyframes beam {
            0% { stroke-dasharray: 0 100; stroke-dashoffset: 0; opacity: 0; }
            50% { opacity: 1; }
            100% { stroke-dasharray: 100 0; stroke-dashoffset: 0; opacity: 1; }
        }
        .animate-beam {
            animation: beam 0.5s ease-out forwards;
        }
        @keyframes float-slow {
            0%, 100% { transform: translateY(0); opacity: 0.2; }
            50% { transform: translateY(-20px); opacity: 0.5; }
        }
        .animate-float-slow {
            animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};