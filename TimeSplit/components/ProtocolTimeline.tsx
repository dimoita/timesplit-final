import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Check, Gift, AlertTriangle, Zap, Crown, Star } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

export type DayStatus = 'LOCKED' | 'PENDING' | 'COMPLETED' | 'MISSED';

interface ProtocolTimelineProps {
  days: DayStatus[];
  currentDayIndex: number;
  onClose: () => void;
}

const MILESTONES = [3, 7, 15, 21, 30];

export const ProtocolTimeline: React.FC<ProtocolTimelineProps> = ({ days, currentDayIndex, onClose }) => {
  const { playWin, playCorrect } = useGameSound();
  const [scrollTarget, setScrollTarget] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [claimedDay, setClaimedDay] = useState<number | null>(null);

  // Auto-scroll to current day
  useEffect(() => {
    if (containerRef.current) {
      const targetNode = document.getElementById(`day-node-${currentDayIndex}`);
      if (targetNode) {
        targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentDayIndex]);

  const handleNodeClick = (index: number, hasReward: boolean) => {
    if (days[index] === 'COMPLETED' && hasReward) {
        setClaimedDay(index);
        playWin();
        // Reset claim visual after a delay
        setTimeout(() => setClaimedDay(null), 3000);
    } else if (days[index] === 'PENDING') {
        // Just play a sound
        playCorrect();
    }
  };

  const getDayIcon = (status: DayStatus, isMilestone: boolean, dayNum: number) => {
      if (status === 'COMPLETED') return <Check size={isMilestone ? 24 : 16} strokeWidth={4} />;
      if (status === 'MISSED') return <AlertTriangle size={isMilestone ? 24 : 16} />;
      if (status === 'PENDING') return <Zap size={isMilestone ? 24 : 16} fill="currentColor" />;
      if (isMilestone) return <Gift size={24} />;
      return <Lock size={14} />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <div className="w-full max-w-lg h-[90vh] flex flex-col relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50">
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider text-shadow-glow">Neural Protocol</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
                    DAY {currentDayIndex + 1} OF 30
                </div>
            </div>
            <button 
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Timeline Scroll Area */}
        <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto p-8 relative no-scrollbar"
        >
            {/* The Path Line (SVG) */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset={`${(currentDayIndex / 30) * 100}%`} stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                </defs>
                {/* We will draw a simple central line for now, complicating curve logic in pure React without libraries is risky */}
                <line 
                    x1="50%" y1="40" x2="50%" y2={30 * 100 + 40} 
                    stroke="url(#lineGradient)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                />
            </svg>

            <div className="space-y-12 relative z-10">
                {days.map((status, index) => {
                    const dayNum = index + 1;
                    const isMilestone = MILESTONES.includes(dayNum);
                    const isLeft = index % 2 === 0;
                    const isCurrent = index === currentDayIndex;
                    
                    // Node Styling
                    let nodeClass = "bg-slate-800 border-slate-600 text-slate-500"; // Locked
                    let glowClass = "";
                    
                    if (status === 'COMPLETED') {
                        nodeClass = "bg-teal-500 border-teal-300 text-white";
                        if (isMilestone) nodeClass += " shadow-[0_0_30px_rgba(20,184,166,0.6)]";
                    } else if (status === 'PENDING') {
                        nodeClass = "bg-amber-500 border-amber-300 text-white animate-pulse";
                        glowClass = "ring-4 ring-amber-500/30";
                    } else if (status === 'MISSED') {
                        nodeClass = "bg-red-500 border-red-300 text-white";
                    }

                    return (
                        <div 
                            id={`day-node-${index}`}
                            key={index} 
                            className={`flex items-center w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                        >
                            {/* The Node */}
                            <div className="w-1/2 flex justify-center relative">
                                <button 
                                    onClick={() => handleNodeClick(index, isMilestone)}
                                    disabled={status === 'LOCKED'}
                                    className={`
                                        relative rounded-full flex items-center justify-center border-[4px] transition-all transform
                                        ${isMilestone ? 'w-20 h-20 text-2xl' : 'w-14 h-14 text-lg'}
                                        ${nodeClass} ${glowClass}
                                        ${status !== 'LOCKED' ? 'hover:scale-110 cursor-pointer' : ''}
                                    `}
                                >
                                    {getDayIcon(status, isMilestone, dayNum)}
                                    
                                    {/* Reward Pop-up */}
                                    {claimedDay === index && (
                                        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                                            <div className="absolute -top-12 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full animate-float-up whitespace-nowrap shadow-lg">
                                                REWARD UNLOCKED!
                                            </div>
                                            <div className="absolute inset-0 bg-white rounded-full animate-ping"></div>
                                        </div>
                                    )}
                                </button>

                                {/* Day Number Label (Absolute to not break flow) */}
                                <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? '-right-6' : '-left-6'} text-xs font-black text-slate-500 uppercase tracking-wider`}>
                                    Day {dayNum}
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className={`w-1/2 ${isLeft ? 'pl-8 text-left' : 'pr-8 text-right'}`}>
                                {isCurrent && (
                                    <div className="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/50 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-1 animate-bounce">
                                        Current Objective
                                    </div>
                                )}
                                {isMilestone && (
                                    <div className={`font-black uppercase tracking-wide text-sm ${status === 'LOCKED' ? 'text-slate-600' : 'text-yellow-400 text-shadow-sm'}`}>
                                        {dayNum === 30 ? "Grandmaster" : dayNum === 3 ? "Habit Forming" : "Milestone Reward"}
                                    </div>
                                )}
                                {status === 'COMPLETED' && (
                                    <div className="text-teal-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                                        Completed <Check size={10} />
                                    </div>
                                )}
                                {status === 'MISSED' && (
                                    <div className="text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                        Missed
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* End Padding */}
            <div className="h-32"></div>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-900 border-t border-white/10 text-center relative z-20">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Protocol Completion: {Math.round(((days.filter(d => d === 'COMPLETED').length) / 30) * 100)}%
            </p>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div 
                    className="h-full bg-teal-500 transition-all duration-1000"
                    style={{ width: `${((days.filter(d => d === 'COMPLETED').length) / 30) * 100}%` }}
                ></div>
            </div>
        </div>

      </div>
      
      <style>{`
        .text-shadow-glow {
            text-shadow: 0 0 20px rgba(45, 212, 191, 0.5);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};
