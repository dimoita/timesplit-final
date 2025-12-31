
import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Activity, Cpu, AlertTriangle, Play, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { ParticleSystem } from './ParticleSystem';

interface QuantumArenaProps {
  onExit: () => void;
  onComplete: (score: number) => void;
}

type Operator = '+' | '-' | '×' | '÷';

interface QuantumProblem {
  a: number;
  b: number;
  op: Operator;
  res: number;
}

export const QuantumArena: React.FC<QuantumArenaProps> = ({ onExit, onComplete }) => {
  const [gameState, setGameState] = useState<'BOOT' | 'RUNNING' | 'GLITCH' | 'OVER'>('BOOT');
  const [entropy, setEntropy] = useState(0); // 0 to 100
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<QuantumProblem | null>(null);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  
  const { playCorrect, playDamage, playWin } = useGameSound();

  // --- GAME LOOP ---
  useEffect(() => {
    if (gameState === 'BOOT') {
        const timer = setTimeout(() => {
            setGameState('RUNNING');
            nextProblem();
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [gameState]);

  useEffect(() => {
      if (gameState === 'RUNNING') {
          const interval = setInterval(() => {
              setEntropy(prev => {
                  const next = prev + 0.3 + (score * 0.02); // Gets harder
                  if (next >= 100) {
                      setGameState('OVER');
                      playDamage();
                      return 100;
                  }
                  return next;
              });
          }, 50);
          return () => clearInterval(interval);
      }
  }, [gameState, score, playDamage]);

  // LOCAL GENERATOR
  const generateProblem = (): QuantumProblem => {
      const ops: Operator[] = ['+', '-', '×', '÷'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      
      let a = 0, b = 0, res = 0;

      switch (op) {
          case '+':
              a = Math.floor(Math.random() * 50) + 10;
              b = Math.floor(Math.random() * 50) + 10;
              res = a + b;
              break;
          case '-':
              res = Math.floor(Math.random() * 50) + 10;
              b = Math.floor(Math.random() * 40) + 5;
              a = res + b;
              break;
          case '×':
              a = Math.floor(Math.random() * 11) + 2;
              b = Math.floor(Math.random() * 11) + 2;
              res = a * b;
              break;
          case '÷':
              // Reverse engineered for integer division
              b = Math.floor(Math.random() * 11) + 2;
              res = Math.floor(Math.random() * 11) + 2;
              a = b * res;
              break;
      }
      return { a, b, op, res };
  };

  const nextProblem = () => {
      setProblem(generateProblem());
  };

  const handleInput = (selectedOp: Operator) => {
      if (gameState !== 'RUNNING' || !problem) return;

      if (selectedOp === problem.op) {
          // Correct
          playCorrect('trail_matrix');
          setScore(s => s + 1);
          setEntropy(e => Math.max(0, e - 15)); // Reduce entropy
          setGlitchIntensity(0);
          nextProblem();
      } else {
          // Wrong
          playDamage();
          setEntropy(e => Math.min(100, e + 20)); // Spike entropy
          setGlitchIntensity(1);
          setGameState('GLITCH');
          setTimeout(() => {
              setGameState('RUNNING');
              setGlitchIntensity(0);
          }, 500);
      }
  };

  // --- RENDER ---

  if (gameState === 'BOOT') {
      return (
          <div className="min-h-screen bg-black font-mono flex flex-col items-center justify-center text-cyan-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-50"></div>
              <Cpu size={64} className="animate-pulse mb-6 text-cyan-400" />
              <div className="text-2xl font-black tracking-widest animate-glitch">INITIALIZING QUANTUM CORE...</div>
              <div className="mt-4 w-64 h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-900">
                  <div className="h-full bg-cyan-500 animate-load-bar"></div>
              </div>
          </div>
      );
  }

  if (gameState === 'OVER') {
      return (
          <div className="min-h-screen bg-black font-mono flex flex-col items-center justify-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-red-900/20 z-0 animate-pulse"></div>
              <div className="relative z-10 text-center p-8 border-4 border-red-600 bg-black/80 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.5)] max-w-md w-full">
                  <AlertTriangle size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-4xl font-black text-red-500 mb-2 tracking-widest">SYSTEM FAILURE</h2>
                  <p className="text-gray-400 font-bold mb-6">Entropy Critical. Logic Collapse.</p>
                  
                  <div className="bg-gray-900 border border-gray-800 p-4 mb-8 rounded-lg">
                      <div className="flex justify-between text-sm text-gray-500 uppercase font-bold">
                          <span>Data Recovered</span>
                          <span>{score} Nodes</span>
                      </div>
                      <div className="flex justify-between text-xl text-cyan-400 font-black mt-2">
                          <span>Reward</span>
                          <span className="flex items-center gap-2">+{score * 2} <Zap size={16} fill="currentColor"/></span>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <Button onClick={() => onComplete(score)} className="w-full bg-cyan-600 hover:bg-cyan-500 border-cyan-800 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                          UPLOAD & EXIT
                      </Button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className={`min-h-screen bg-slate-950 font-mono flex flex-col relative overflow-hidden transition-all duration-100 ${glitchIntensity > 0 ? 'animate-shake filter hue-rotate-90' : ''}`}>
        
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-20 opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,black_150%)] pointer-events-none z-20"></div>

        {/* Matrix Rain Effect */}
        <ParticleSystem variant="trail_matrix" />

        {/* HUD */}
        <div className="relative z-30 p-6 flex justify-between items-start">
            <button onClick={onExit} className="text-cyan-700 hover:text-cyan-400 transition-colors">
                <X />
            </button>
            
            <div className="flex flex-col items-center w-full max-w-md mx-auto">
                <div className="flex justify-between w-full text-xs font-bold text-cyan-600 uppercase tracking-widest mb-1">
                    <span>Entropy Level</span>
                    <span>{Math.floor(entropy)}%</span>
                </div>
                <div className="w-full h-4 bg-gray-900 border border-cyan-900 rounded-sm relative overflow-hidden shadow-[0_0_15px_rgba(8,145,178,0.2)]">
                    <div 
                        className={`h-full transition-all duration-100 ease-linear ${entropy > 80 ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`}
                        style={{ width: `${entropy}%` }}
                    ></div>
                </div>
            </div>

            <div className="text-cyan-400 font-black text-xl tabular-nums">
                {score.toString().padStart(3, '0')}
            </div>
        </div>

        {/* MAIN TERMINAL */}
        <div className="flex-1 relative z-30 flex flex-col items-center justify-center p-4">
            
            {problem && (
                <div className="mb-12 relative group">
                    <div className={`text-5xl md:text-7xl font-black text-white tracking-widest flex items-center gap-4 md:gap-8 drop-shadow-[0_0_10px_rgba(8,145,178,0.8)] ${glitchIntensity > 0 ? 'blur-sm' : ''}`}>
                        <span>{problem.a}</span>
                        <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-cyan-500 bg-black flex items-center justify-center text-cyan-400 animate-pulse shadow-[0_0_30px_rgba(8,145,178,0.4)] rounded-lg">
                            ?
                        </div>
                        <span>{problem.b}</span>
                        <span className="text-cyan-600">=</span>
                        <span className="text-cyan-300">{problem.res}</span>
                    </div>
                </div>
            )}

            {/* CONTROL DECK */}
            <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
                {['+', '-', '×', '÷'].map((op) => (
                    <button
                        key={op}
                        onClick={() => handleInput(op as Operator)}
                        className="h-24 bg-slate-900 border-2 border-cyan-900 hover:border-cyan-400 hover:bg-cyan-950 text-cyan-500 hover:text-white rounded-lg text-4xl font-black transition-all active:scale-95 hover:shadow-[0_0_30px_rgba(8,145,178,0.3)] relative overflow-hidden group"
                    >
                        <span className="relative z-10">{op}</span>
                        <div className="absolute inset-0 bg-cyan-400/10 transform scale-0 group-hover:scale-100 transition-transform rounded-full"></div>
                    </button>
                ))}
            </div>

        </div>

        {/* Footer Status */}
        <div className="p-4 text-center text-cyan-900 text-xs font-black uppercase tracking-[0.5em] animate-pulse relative z-30">
            Sector 3: Quantum Logic // Stabilize The Stream
        </div>

        <style>{`
            @keyframes glitch {
                0% { transform: translate(0) }
                20% { transform: translate(-2px, 2px) }
                40% { transform: translate(-2px, -2px) }
                60% { transform: translate(2px, 2px) }
                80% { transform: translate(2px, -2px) }
                100% { transform: translate(0) }
            }
            .animate-glitch { animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite; }
            
            @keyframes load-bar {
                0% { width: 0%; }
                100% { width: 100%; }
            }
            .animate-load-bar { animation: load-bar 2s ease-out forwards; }
        `}</style>
    </div>
  );
};
