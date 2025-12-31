
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Check, Zap, ScanLine, RotateCcw, Terminal } from 'lucide-react';
import { useGameSound } from '../hooks/useGameSound';

interface NeuralRepairProps {
  factorA: number;
  factorB: number;
  product: number;
  onComplete: () => void;
  mnemonic?: string; // New Prop for "The Neural Surgeon"
}

export const NeuralRepair: React.FC<NeuralRepairProps> = ({ factorA, factorB, product, onComplete, mnemonic }) => {
  const [step, setStep] = useState<'SCAN' | 'DOWNLOAD' | 'INTERACT' | 'SYNCED'>('SCAN');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [typedMnemonic, setTypedMnemonic] = useState('');
  const { playCorrect, playAttack, playChargeUp } = useGameSound();

  // Generate options (correct + 2 distractors)
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    // Generate distractors close to the real answer
    const distractors = new Set<number>();
    distractors.add(product);
    
    while (distractors.size < 3) {
      const dev = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const val = product + dev;
      if (val > 0 && val !== product) distractors.add(val);
    }
    
    setOptions(Array.from(distractors).sort(() => Math.random() - 0.5));
    
    // Auto-advance scan
    const timer = setTimeout(() => {
        if (mnemonic) {
            setStep('DOWNLOAD');
            playChargeUp();
        } else {
            setStep('INTERACT');
        }
    }, 1500);
    return () => clearTimeout(timer);
  }, [product, mnemonic, playChargeUp]);

  // Typewriter effect for Mnemonic
  useEffect(() => {
      if (step === 'DOWNLOAD' && mnemonic) {
          let i = 0;
          const typeTimer = setInterval(() => {
              setTypedMnemonic(mnemonic.slice(0, i + 1));
              i++;
              if (i === mnemonic.length) {
                  clearInterval(typeTimer);
                  setTimeout(() => setStep('INTERACT'), 1500); // Give time to read
              }
          }, 30);
          return () => clearInterval(typeTimer);
      }
  }, [step, mnemonic]);

  const handleSelect = (val: number) => {
    if (step !== 'INTERACT') return;
    
    setSelectedOption(val);
    
    if (val === product) {
      playCorrect();
      setStep('SYNCED');
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
        // Shake effect handled by UI
        playAttack(); // Error sound
        setTimeout(() => setSelectedOption(null), 500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay with CRT Scanlines */}
      <div className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-md overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></div>
         <div className="absolute inset-0 animate-scan-line bg-gradient-to-b from-transparent via-green-500/10 to-transparent h-32 pointer-events-none z-10"></div>
      </div>

      <div className="relative z-20 w-full max-w-md bg-black/80 border-2 border-green-500/50 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-pop-in">
        
        {/* Header HUD */}
        <div className="flex justify-between items-center mb-8 border-b border-green-500/30 pb-4">
            <div className="flex items-center gap-2 text-green-400">
                {step === 'SCAN' ? <ScanLine className="animate-pulse" /> : step === 'DOWNLOAD' ? <Terminal className="animate-pulse" /> : <BrainCircuit />}
                <span className="font-mono font-bold text-xs uppercase tracking-widest animate-pulse">
                    {step === 'SCAN' ? 'DETECTING ERROR PATTERN...' : step === 'DOWNLOAD' ? 'DOWNLOADING MNEMONIC...' : step === 'SYNCED' ? 'NEURAL LINK RESTORED' : 'REPAIR PROTOCOL ACTIVE'}
                </span>
            </div>
            <div className="px-2 py-1 bg-green-900/40 rounded border border-green-500/20 text-[10px] text-green-300 font-mono">
                {mnemonic ? 'MOD: SURGEON' : 'ERR_CODE: 0x7F'}
            </div>
        </div>

        {/* Mnemonic Display (The "Matrix" Moment) */}
        {step === 'DOWNLOAD' || (step === 'INTERACT' && mnemonic) ? (
            <div className="mb-8 min-h-[100px] flex items-center justify-center bg-green-900/10 border border-green-500/30 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <p className="text-green-400 font-mono text-lg font-bold text-center leading-relaxed relative z-10 text-shadow-glow">
                    {typedMnemonic}
                    <span className="animate-pulse inline-block w-2 h-5 bg-green-500 ml-1 align-middle"></span>
                </p>
            </div>
        ) : (
            /* Central Triangle Visualization (Standard Mode) */
            <div className="relative h-64 mb-8">
                <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" viewBox="0 0 100 100">
                    {/* Base Lines */}
                    <line x1="50" y1="15" x2="20" y2="85" stroke={step === 'SYNCED' ? '#4CAF50' : '#1f2937'} strokeWidth="2" strokeDasharray={step !== 'SYNCED' ? "4 2" : ""} className="transition-colors duration-500" />
                    <line x1="50" y1="15" x2="80" y2="85" stroke={step === 'SYNCED' ? '#4CAF50' : '#1f2937'} strokeWidth="2" strokeDasharray={step !== 'SYNCED' ? "4 2" : ""} className="transition-colors duration-500" />
                    <line x1="20" y1="85" x2="80" y2="85" stroke="#4CAF50" strokeWidth="4" />
                    
                    {/* Animated Flow if Synced */}
                    {step === 'SYNCED' && (
                    <>
                        <circle r="2" fill="#fff">
                            <animateMotion dur="1s" repeatCount="indefinite" path="M20,85 L50,15" />
                        </circle>
                        <circle r="2" fill="#fff">
                            <animateMotion dur="1s" repeatCount="indefinite" path="M80,85 L50,15" />
                        </circle>
                    </>
                    )}
                </svg>

                {/* Top Node (Target) */}
                <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-gray-900 z-10
                        ${step === 'SYNCED' ? 'border-green-500 shadow-[0_0_30px_#22c55e] scale-110' : 'border-gray-700 border-dashed animate-pulse'}
                    `}>
                        {step === 'SYNCED' ? (
                            <span className="text-3xl font-black text-white">{product}</span>
                        ) : (
                            <span className="text-3xl font-black text-gray-700">?</span>
                        )}
                    </div>
                </div>

                {/* Left Node */}
                <div className="absolute bottom-[15%] left-[20%] -translate-x-1/2 translate-y-1/2">
                    <div className="w-16 h-16 bg-gray-800 rounded-full border-2 border-green-500/50 flex items-center justify-center shadow-lg z-10">
                        <span className="text-2xl font-black text-white">{factorA}</span>
                    </div>
                </div>

                {/* Right Node */}
                <div className="absolute bottom-[15%] right-[20%] translate-x-1/2 translate-y-1/2">
                    <div className="w-16 h-16 bg-gray-800 rounded-full border-2 border-green-500/50 flex items-center justify-center shadow-lg z-10">
                        <span className="text-2xl font-black text-white">{factorB}</span>
                    </div>
                </div>
                
                {/* Operator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-700 font-black text-4xl opacity-50">
                    ×
                </div>
            </div>
        )}

        {/* Interaction Area */}
        <div className="space-y-4">
            {step === 'SCAN' && (
                <div className="text-center text-green-400 font-mono text-sm animate-pulse">
                    Scanning Logic Pathways...
                </div>
            )}

            {step === 'DOWNLOAD' && (
                <div className="text-center text-green-400 font-mono text-sm animate-pulse">
                    INJECTING KNOWLEDGE...
                </div>
            )}

            {step === 'INTERACT' && (
                <>
                    <p className="text-center text-gray-400 font-bold text-sm mb-4">
                        {mnemonic ? "Type the code (answer) to unlock:" : "Complete the Connection:"}
                    </p>
                    <div className="flex justify-center gap-4">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleSelect(opt)}
                                className={`w-20 h-20 rounded-xl font-black text-3xl transition-all transform hover:scale-105 active:scale-95
                                    ${selectedOption === opt && opt !== product ? 'bg-red-500 text-white animate-shake' : 'bg-gray-800 text-white hover:bg-gray-700 border-b-4 border-gray-950'}
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {step === 'SYNCED' && (
                <div className="text-center animate-pop-in">
                    <div className="inline-flex items-center gap-2 text-green-400 font-black text-xl mb-2">
                        <Zap fill="currentColor" /> SYSTEM UPGRADED
                    </div>
                    <p className="text-gray-400 text-xs font-bold">Resuming simulation with enhanced recall.</p>
                </div>
            )}
        </div>

      </div>

      <style>{`
        @keyframes scan-line {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
        .animate-scan-line {
            animation: scan-line 3s linear infinite;
        }
        .text-shadow-glow { text-shadow: 0 0 10px rgba(74,222,128,0.5); }
      `}</style>
    </div>
  );
};
