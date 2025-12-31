
import React, { useState, useEffect } from 'react';
import { Trophy, Star, ArrowRight, Lock, Crown, CheckCircle2, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { ParticleSystem } from './ParticleSystem';

interface SeasonCeremonyProps {
  currentDivision: string;
  nextDivision: string;
  onContinue: () => void; // Usually opens Checkout or Closes if Premium
  onClose: () => void; // For free users (demote or stay)
  isPremium?: boolean;
}

export const SeasonCeremony: React.FC<SeasonCeremonyProps> = ({ currentDivision, nextDivision, onContinue, onClose, isPremium }) => {
  const [step, setStep] = useState<'ANIMATION' | 'REWARD' | 'UPSELL'>('ANIMATION');
  const { playWin, playChargeUp, stopChargeUp } = useGameSound();

  useEffect(() => {
    playChargeUp();
    const timer = setTimeout(() => {
        stopChargeUp();
        playWin();
        setStep('REWARD');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
      if (isPremium) {
          // Skip upsell, go directly to continue (close)
          onContinue();
      } else {
          setStep('UPSELL');
      }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center font-nunito overflow-hidden">
        
        {/* Background FX */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black"></div>
        <ParticleSystem variant="trail_rainbow" />

        {step === 'ANIMATION' && (
            <div className="relative z-10 text-center animate-in fade-in zoom-in duration-1000">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-yellow-500 blur-[100px] opacity-20 animate-pulse"></div>
                    <Trophy size={120} className="text-yellow-400 mx-auto drop-shadow-[0_0_50px_rgba(250,204,21,0.8)] animate-bounce-gentle" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest mb-4">
                    Season Complete!
                </h2>
                <p className="text-indigo-300 font-bold text-xl">Calculing final results...</p>
            </div>
        )}

        {step === 'REWARD' && (
            <div className="relative z-10 w-full max-w-md bg-white rounded-[2.5rem] p-8 text-center shadow-[0_0_100px_rgba(255,255,255,0.2)] animate-scale-up-elastic border-[6px] border-yellow-400">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                        <Crown size={48} className="text-white" fill="currentColor" />
                    </div>
                </div>

                <div className="mt-12 mb-6">
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Promotion Successful</h3>
                    <h2 className="text-4xl font-black text-slate-900 leading-none mb-2">
                        {currentDivision} <span className="text-gray-300">➔</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">{nextDivision}</span>
                    </h2>
                    <div className="flex justify-center gap-1 my-4">
                        {[1,2,3,4,5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400 w-6 h-6 animate-pulse" />)}
                    </div>
                    <p className="text-gray-600 font-bold text-sm leading-relaxed">
                        You crushed the competition! Your neural pathways are stronger than 98% of players in your bracket.
                    </p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-8">
                    <div className="text-xs font-black text-yellow-600 uppercase tracking-wider mb-2">Season Reward</div>
                    <div className="flex justify-center items-center gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl">💎</span>
                            <span className="font-black text-slate-900">500 Splitz</span>
                        </div>
                        <div className="w-px h-8 bg-yellow-200"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl">🛡️</span>
                            <span className="font-black text-slate-900">3 Shields</span>
                        </div>
                    </div>
                </div>

                <Button onClick={handleClaim} className="w-full h-16 text-xl bg-yellow-500 hover:bg-yellow-400 border-yellow-700 text-black shadow-lg animate-pulse">
                    Claim & Promote <ArrowRight className="ml-2" />
                </Button>
            </div>
        )}

        {step === 'UPSELL' && (
            <div className="relative z-10 w-full max-w-lg bg-[#0f172a] rounded-[2.5rem] p-8 border-[4px] border-indigo-500 shadow-2xl animate-slide-up">
                
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-400 text-xs font-bold uppercase tracking-widest underline">
                        Decline & Lose Rank
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-wide mb-2">
                        Checkpoint Reached
                    </h2>
                    <p className="text-indigo-200 font-medium">
                        The <span className="text-yellow-400 font-bold">{nextDivision} Division</span> is reserved for Full Access members.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><CheckCircle2 size={20} /></div>
                        <div className="text-left">
                            <div className="text-white font-bold">Keep Your Rank</div>
                            <div className="text-slate-400 text-xs">Don't reset to Bronze</div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400"><Crown size={20} /></div>
                        <div className="text-left">
                            <div className="text-white font-bold">Unlock {nextDivision} Rewards</div>
                            <div className="text-slate-400 text-xs">2x Coin Multiplier active</div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Shield size={20} /></div>
                        <div className="text-left">
                            <div className="text-white font-bold">Ad-Free Experience</div>
                            <div className="text-slate-400 text-xs">Focus on mastery</div>
                        </div>
                    </div>
                </div>

                <Button onClick={onContinue} className="w-full h-20 text-xl bg-green-600 hover:bg-green-500 border-green-800 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-pulse flex flex-col items-center justify-center leading-none gap-1">
                    <span>UNLOCK FULL ACCESS</span>
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest text-green-100">$37 One-Time Payment</span>
                </Button>
                
                <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-6">
                    30-Day Money Back Guarantee • Parents Only
                </p>
            </div>
        )}

    </div>
  );
};
