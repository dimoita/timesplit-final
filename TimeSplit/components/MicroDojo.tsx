
import React, { useState, useEffect } from 'react';
import { Zap, Check, ArrowRight, BrainCircuit } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

// UPDATED PROBLEMS: The "Aha!" Sequence
// 1. Easy Momentum -> 2. The Hard Fact -> 3. The Inverse Proof (Division)
const PROBLEMS = [
    { q: "2 x 5", options: [10, 7], a: 10 },        // Warm-up
    { q: "7 x 8", options: [56, 15], a: 56 },       // The "Hard" Fact
    { q: "56 ÷ 8", options: [7, 6], a: 7 }          // The Proof: Inverse Logic
];

export const MicroDojo: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<'IDLE' | 'PLAYING' | 'WIN'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(15);
  
  // Hooking up the sound engine
  const { playCorrect, playWrong, playWin } = useGameSound();

  useEffect(() => {
      if (state === 'PLAYING' && timeLeft > 0) {
          const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
          return () => clearInterval(timer);
      }
  }, [state, timeLeft]);

  // Trigger win sound on state change
  useEffect(() => {
      if (state === 'WIN') {
          playWin();
      }
  }, [state, playWin]);

  const handleAnswer = (val: number) => {
      if (val === PROBLEMS[index].a) {
          playCorrect(); // Dopamine hit
          if (index < PROBLEMS.length - 1) {
              setIndex(prev => prev + 1);
          } else {
              setState('WIN');
          }
      } else {
          playWrong(); // Feedback
          // Shake animation
          const btn = document.getElementById('micro-grid');
          btn?.classList.add('animate-shake');
          setTimeout(() => btn?.classList.remove('animate-shake'), 300);
      }
  };

  const handleClaim = () => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (state === 'IDLE') {
      return (
          <section className="w-full bg-[#0f172a] border-y border-white/10 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center border-2 border-indigo-500 animate-pulse">
                          <BrainCircuit className="text-indigo-400" />
                      </div>
                      <div>
                          <h3 className="text-white font-black uppercase tracking-wider text-sm md:text-base">Speed Test: Are you a Founder?</h3>
                          <p className="text-indigo-300 text-xs font-bold">Solve 3 problems in 15s to verify aptitude.</p>
                      </div>
                  </div>
                  <Button onClick={() => setState('PLAYING')} className="bg-indigo-600 hover:bg-indigo-500 border-indigo-800 text-white px-8 h-12 text-sm">
                      START TEST
                  </Button>
              </div>
          </section>
      );
  }

  if (state === 'WIN') {
      return (
          <section className="w-full bg-green-900/30 border-y border-green-500/30 py-8 relative overflow-hidden animate-in fade-in">
              <div className="max-w-4xl mx-auto px-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                      <Check size={12} strokeWidth={4} /> Aptitude Confirmed
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Founder's Access: Approved</h3>
                  <p className="text-green-200 text-sm font-bold mb-6">You qualify for the data-exchange discount.</p>
                  <Button onClick={handleClaim} className="bg-green-500 hover:bg-green-400 text-black border-green-700 h-14 text-lg w-full max-w-xs animate-pulse">
                      Claim Spot <ArrowRight className="ml-2" />
                  </Button>
              </div>
          </section>
      );
  }

  // PLAYING
  return (
      <section className="w-full bg-indigo-900 border-y-4 border-indigo-500 py-12 relative">
          <div className="absolute top-4 right-4 text-indigo-300 font-mono font-black text-xl">
              00:{timeLeft.toString().padStart(2, '0')}
          </div>
          
          <div className="max-w-md mx-auto px-4 text-center">
              <h3 className="text-indigo-200 font-black uppercase tracking-widest text-xs mb-4">Question {index + 1}/3</h3>
              <div className="text-6xl font-black text-white mb-8">{PROBLEMS[index].q}</div>
              
              <div id="micro-grid" className="grid grid-cols-2 gap-4">
                  {PROBLEMS[index].options.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="h-20 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-xl text-3xl font-black text-white transition-all active:scale-95"
                      >
                          {opt}
                      </button>
                  ))}
              </div>
          </div>
          
          <style>{`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            .animate-shake { animation: shake 0.2s ease-in-out; }
          `}</style>
      </section>
  );
};
