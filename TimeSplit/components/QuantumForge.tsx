
import React, { useState, useRef } from 'react';
import { Hexagon, Zap, Shield, Sparkles, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

export interface ForgeResult {
  type: 'ITEM' | 'COINS' | 'CONSUMABLE';
  id?: string;
  name: string;
  emoji?: string;
  amount?: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'MYTHIC';
  isDuplicate?: boolean;
}

interface QuantumForgeProps {
  coins: number;
  onSpin: () => ForgeResult;
  onOpenCoinShop: () => void;
}

export const QuantumForge: React.FC<QuantumForgeProps> = ({ coins, onSpin, onOpenCoinShop }) => {
  const [state, setState] = useState<'IDLE' | 'CHARGING' | 'SPINNING' | 'REVEAL'>('IDLE');
  const [result, setResult] = useState<ForgeResult | null>(null);
  const { playChargeUp, stopChargeUp, playWin, playDamage } = useGameSound();

  const COST = 500;

  const handleInitiate = () => {
    if (coins < COST) {
      playDamage(); // Error sound
      onOpenCoinShop();
      return;
    }

    setState('CHARGING');
    playChargeUp();

    // Sequence
    setTimeout(() => {
        setState('SPINNING');
        stopChargeUp(); // Transition to mechanical spin sound
        
        // Spin duration
        setTimeout(() => {
            const spinResult = onSpin();
            setResult(spinResult);
            setState('REVEAL');
            playWin(); // Success sound
        }, 2000);

    }, 1500); // Charge time
  };

  const handleReset = () => {
      setResult(null);
      setState('IDLE');
  };

  const getRarityColor = (rarity?: string) => {
      switch(rarity) {
          case 'MYTHIC': return 'text-purple-500 border-purple-500 bg-purple-500/10';
          case 'EPIC': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
          case 'RARE': return 'text-blue-400 border-blue-400 bg-blue-400/10';
          default: return 'text-slate-400 border-slate-400 bg-slate-400/10';
      }
  };

  const getRarityGlow = (rarity?: string) => {
      switch(rarity) {
          case 'MYTHIC': return 'shadow-[0_0_60px_rgba(168,85,247,0.6)]';
          case 'EPIC': return 'shadow-[0_0_50px_rgba(234,179,8,0.5)]';
          case 'RARE': return 'shadow-[0_0_40px_rgba(96,165,250,0.4)]';
          default: return 'shadow-none';
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center relative overflow-hidden bg-slate-900 rounded-[3rem] border-[4px] border-slate-700 shadow-2xl">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(2,6,23,1)_100%)] pointer-events-none"></div>

        <div className="relative z-10 p-8 md:p-12 min-h-[500px] flex flex-col items-center justify-center">
            
            {/* --- MACHINE CORE --- */}
            <div className="relative mb-12">
                {/* Outer Ring */}
                <div className={`w-64 h-64 border-[12px] border-slate-800 rounded-full flex items-center justify-center relative bg-black shadow-inner
                    ${state === 'CHARGING' ? 'animate-pulse-fast border-purple-500/50' : ''}
                    ${state === 'SPINNING' ? 'animate-spin-fast border-cyan-500' : ''}
                    ${state === 'REVEAL' ? `border-white ${getRarityGlow(result?.rarity)}` : ''}
                `}>
                    {/* Inner Core */}
                    <div className={`w-40 h-40 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500
                        ${state === 'IDLE' ? 'bg-slate-900' : ''}
                        ${state === 'CHARGING' ? 'bg-purple-900 scale-90' : ''}
                        ${state === 'SPINNING' ? 'bg-white scale-50' : ''}
                        ${state === 'REVEAL' ? 'bg-transparent scale-100' : ''}
                    `}>
                        {state === 'IDLE' && <Hexagon size={64} className="text-slate-700" />}
                        {state === 'CHARGING' && <Zap size={64} className="text-purple-400 animate-bounce" />}
                        
                        {state === 'REVEAL' && result && (
                            <div className="animate-scale-up-elastic text-center">
                                <div className="text-6xl mb-2 filter drop-shadow-lg">{result.emoji || '📦'}</div>
                            </div>
                        )}
                    </div>

                    {/* Particle Effects (CSS) */}
                    {state === 'SPINNING' && (
                        <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin"></div>
                    )}
                </div>
            </div>

            {/* --- CONTROLS / RESULT --- */}
            <div className="w-full max-w-md">
                
                {state === 'IDLE' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2 text-shadow-glow">
                            Quantum Forge
                        </h2>
                        <p className="text-slate-400 font-bold mb-8">
                            Insert Splitz to manifest rare matter.
                        </p>
                        
                        <Button 
                            onClick={handleInitiate}
                            className={`w-full h-20 text-2xl font-black shadow-[0_0_30px_rgba(139,92,246,0.3)] border-b-[6px] transition-all
                                ${coins >= COST 
                                    ? 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white animate-pulse-slow' 
                                    : 'bg-slate-700 border-slate-900 text-slate-500'}
                            `}
                        >
                            {coins >= COST ? (
                                <span className="flex items-center gap-3">
                                    INITIATE <span className="text-lg opacity-80 font-normal">({COST} <Zap size={16} fill="currentColor" className="inline"/>)</span>
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <AlertTriangle size={20} /> INSUFFICIENT ENERGY
                                </span>
                            )}
                        </Button>
                    </div>
                )}

                {(state === 'CHARGING' || state === 'SPINNING') && (
                    <div className="text-cyan-400 font-mono font-bold text-lg tracking-widest animate-pulse">
                        {state === 'CHARGING' ? 'DESTABILIZING CORE...' : 'REARRANGING ATOMS...'}
                    </div>
                )}

                {state === 'REVEAL' && result && (
                    <div className="animate-in zoom-in duration-300">
                        <div className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border mb-4 ${getRarityColor(result.rarity)}`}>
                            {result.rarity} {result.type}
                        </div>
                        
                        <h2 className="text-4xl font-black text-white mb-2">{result.name}</h2>
                        
                        {result.isDuplicate ? (
                            <p className="text-yellow-400 font-bold mb-6 flex items-center justify-center gap-2">
                                <Sparkles size={16} /> Duplicate Converted: +{result.amount} Splitz
                            </p>
                        ) : result.type === 'COINS' ? (
                            <p className="text-yellow-400 font-bold mb-6 text-2xl">
                                +{result.amount} Splitz
                            </p>
                        ) : (
                            <p className="text-green-400 font-bold mb-6 flex items-center justify-center gap-2">
                                <Shield size={16} /> Added to Inventory
                            </p>
                        )}

                        <Button onClick={handleReset} className="w-full h-16 bg-slate-800 hover:bg-slate-700 border-slate-950 text-white">
                            Forge Again <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                )}

            </div>

        </div>

        <style>{`
            .text-shadow-glow { text-shadow: 0 0 20px rgba(168,85,247,0.5); }
            @keyframes spin-fast { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .animate-spin-fast { animation: spin-fast 0.5s linear infinite; }
            .animate-pulse-fast { animation: pulse 0.2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}</style>
    </div>
  );
};
