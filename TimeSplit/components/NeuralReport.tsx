import React, { useEffect, useState } from 'react';
import { BrainCircuit, Check, TrendingUp, Trophy, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

export interface SessionHistoryItem {
  id: string; // "7x8"
  label: string; // "7 x 8"
  result: 'correct' | 'wrong' | 'slow';
  oldScore: number;
  newScore: number;
}

interface NeuralReportProps {
  history: SessionHistoryItem[];
  onContinue: () => void;
}

export const NeuralReport: React.FC<NeuralReportProps> = ({ history, onContinue }) => {
  const [phase, setPhase] = useState<'SYNC' | 'REPORT'>('SYNC');
  
  // Phase 1: Sync Animation Duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('REPORT');
    }, 2500); // 2.5s simulated upload
    return () => clearTimeout(timer);
  }, []);

  if (phase === 'SYNC') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-col items-center justify-center font-nunito">
        <div className="relative mb-8">
          {/* Brain Pulse Animation */}
          <div className="w-32 h-32 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse relative">
             <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
             <BrainCircuit size={64} className="text-indigo-400" />
          </div>
          
          {/* Data Particles */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="absolute top-0 animate-float-delayed text-green-400 text-xs font-mono">10101</div>
             <div className="absolute bottom-0 right-0 animate-float text-blue-400 text-xs font-mono">01011</div>
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-white mb-2 tracking-widest uppercase animate-pulse">
            Neural Uplink Established
        </h2>
        <p className="text-indigo-300 font-bold font-mono text-sm">
            Syncing Short-Term Memory to Long-Term Storage...
        </p>
        
        {/* Loader Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full mt-8 overflow-hidden border border-gray-700">
           <div className="h-full bg-indigo-500 animate-progress-fill"></div>
        </div>

        <style>{`
          @keyframes progress-fill {
             0% { width: 0%; }
             100% { width: 100%; }
          }
          .animate-progress-fill {
             animation: progress-fill 2.4s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Phase 2: The Report
  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] font-nunito flex flex-col overflow-hidden animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="p-6 bg-[#1e1b4b] border-b border-indigo-900/50 flex justify-between items-center shadow-lg z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/50">
                    <TrendingUp className="text-indigo-400" size={24} />
                </div>
                <div>
                    <h2 className="text-white font-black text-xl uppercase tracking-wide">Evolution Report</h2>
                    <p className="text-indigo-300 text-xs font-bold">Session Data Uploaded</p>
                </div>
            </div>
            {/* Brain Power Summary */}
            <div className="bg-indigo-900/50 px-4 py-2 rounded-lg border border-indigo-500/30">
               <span className="text-indigo-200 text-xs font-black uppercase mr-2">Items Synced</span>
               <span className="text-white font-black">{history.length}</span>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            
            {history.map((item, idx) => {
                const isMasteredNow = item.newScore >= 0.8;
                const wasMasteredBefore = item.oldScore >= 0.8;
                const justMastered = isMasteredNow && !wasMasteredBefore;
                const gain = Math.round((item.newScore - item.oldScore) * 100);
                const isPositive = gain >= 0;

                return (
                    <div 
                        key={idx} 
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 animate-pop-in hover:bg-white/10 transition-colors"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        {/* Question Badge */}
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                            <span className="text-white font-black text-lg">{item.label}</span>
                        </div>

                        {/* Progress Bars */}
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className={`text-xs font-black uppercase tracking-wider ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {isPositive ? 'Retention Increasing' : 'Gap Detected'}
                                </span>
                                <span className="text-white font-bold text-xs">
                                    {Math.round(item.newScore * 100)}% Memory
                                </span>
                            </div>
                            
                            {/* Bar Container */}
                            <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative border border-white/10">
                                {/* Base (Old Score) */}
                                <div 
                                    className="absolute top-0 left-0 h-full bg-gray-600 opacity-50 transition-all duration-1000"
                                    style={{ width: `${item.oldScore * 100}%` }}
                                ></div>
                                {/* Growth (New Score) */}
                                <div 
                                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out delay-500 relative
                                        ${item.newScore >= 0.8 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 
                                          item.newScore >= 0.5 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
                                          'bg-gradient-to-r from-red-500 to-pink-500'}
                                    `}
                                    style={{ width: `${item.newScore * 100}%` }}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-white/30 skew-x-[-20deg] animate-shine w-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Result Icon / Gain */}
                        <div className="text-right min-w-[60px]">
                           {justMastered ? (
                               <div className="flex flex-col items-center animate-bounce-gentle">
                                   <Trophy className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" size={28} />
                                   <span className="text-[10px] text-yellow-400 font-black uppercase">Mastered</span>
                               </div>
                           ) : (
                               <div className="flex flex-col items-end">
                                   <span className={`text-xl font-black ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                       {isPositive ? '+' : ''}{gain}%
                                   </span>
                                   {item.result === 'wrong' && <span className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1"><X size={10}/> Miss</span>}
                                   {item.result === 'slow' && <span className="text-[10px] text-orange-400 font-bold uppercase flex items-center gap-1"><AlertCircle size={10}/> Slow</span>}
                               </div>
                           )}
                        </div>
                    </div>
                );
            })}
            
            <div className="h-20"></div> {/* Spacer */}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#1e1b4b] border-t border-indigo-900/50 z-20">
            <Button onClick={onContinue} className="w-full h-16 text-xl shadow-indigo-500/20">
                Return to Base <ArrowRight className="ml-2" />
            </Button>
        </div>

        <style>{`
          @keyframes shine {
             0% { transform: translateX(-150%) skewX(-20deg); }
             100% { transform: translateX(250%) skewX(-20deg); }
          }
          .animate-shine {
             animation: shine 2s infinite linear;
          }
        `}</style>
    </div>
  );
};
