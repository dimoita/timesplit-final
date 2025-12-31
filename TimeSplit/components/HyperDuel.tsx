
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rival } from './LeagueStandings';
import { useGameSound } from '../hooks/useGameSound';
import { Zap, Shield, Skull, Swords, RefreshCw, Trophy } from 'lucide-react';
import { Button } from './ui/Button';

interface HyperDuelProps {
  rival: Rival;
  onExit: () => void;
  onComplete: (result: 'WIN' | 'LOSS') => void;
  playerAvatar: string;
}

export const HyperDuel: React.FC<HyperDuelProps> = ({ rival, onExit, onComplete, playerAvatar }) => {
  // Game State
  const [gameState, setGameState] = useState<'INTRO' | 'FIGHT' | 'VICTORY' | 'DEFEAT'>('INTRO');
  const [balance, setBalance] = useState(0); // -100 (Player Lost) to 100 (Player Won)
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState({ q: 'READY', a: 0 });
  
  // Visual States
  const [enemyAction, setEnemyAction] = useState<'IDLE' | 'ATTACK' | 'HIT'>('IDLE');
  const [playerAction, setPlayerAction] = useState<'IDLE' | 'ATTACK' | 'HIT'>('IDLE');
  const [disruption, setDisruption] = useState<'NONE' | 'BLUR' | 'SHAKE'>('NONE');
  
  const { playLaser, playDamage, playWin, playCorrect, playAttack } = useGameSound();

  // AI Configuration based on Rival Score/Division approximation
  // Higher score = Faster attacks
  const aiSpeed = Math.max(800, 4000 - (rival.score * 2)); 
  const aiAccuracy = Math.min(0.95, 0.5 + (rival.score / 5000));

  // --- GAME LOOP ---
  useEffect(() => {
    if (gameState === 'FIGHT') {
        generateQuestion();
        
        // AI Loop
        const aiInterval = setInterval(() => {
            handleEnemyAttack();
        }, aiSpeed);

        return () => clearInterval(aiInterval);
    }
  }, [gameState]);

  // --- ENEMY LOGIC ---
  const handleEnemyAttack = () => {
      // AI Roll
      const hit = Math.random() < aiAccuracy;
      
      if (hit) {
          setEnemyAction('ATTACK');
          setTimeout(() => setEnemyAction('IDLE'), 500);
          
          setBalance(prev => {
              const newVal = prev - 15; // Push beam towards player
              if (newVal <= -100) {
                  setGameState('DEFEAT');
                  playDamage();
                  return -100;
              }
              return newVal;
          });

          // Chance to disrupt player
          if (Math.random() < 0.2) {
              triggerDisruption();
          }
      }
  };

  const triggerDisruption = () => {
      playDamage();
      const type = Math.random() > 0.5 ? 'BLUR' : 'SHAKE';
      setDisruption(type);
      setTimeout(() => setDisruption('NONE'), 2000);
  };

  // --- PLAYER LOGIC (LOCAL GENERATOR) ---
  const generateQuestion = () => {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      setQuestion({
          q: `${a} × ${b}`,
          a: a * b
      });
  };

  const handleInput = (val: number) => {
      if (gameState !== 'FIGHT') return;
      
      const newVal = input + val.toString();
      
      // Auto-submit if length matches answer length (simple heuristic for speed)
      // Or just check if match immediately
      const numVal = parseInt(newVal);
      const strAns = question.a.toString();
      
      if (newVal === strAns) {
          // HIT
          firePlayerShot();
          setInput('');
      } else if (newVal.length >= strAns.length) {
          // MISS (Wrong input)
          setInput('');
          playDamage();
          setPlayerAction('HIT'); // Feedback
          setTimeout(() => setPlayerAction('IDLE'), 300);
      } else {
          // Typing
          setInput(newVal);
          playCorrect('trail_default');
      }
  };

  const firePlayerShot = () => {
      playLaser();
      setPlayerAction('ATTACK');
      setTimeout(() => setPlayerAction('IDLE'), 300);
      setEnemyAction('HIT'); // Visual feedback on enemy
      setTimeout(() => setEnemyAction('IDLE'), 300);

      generateQuestion();

      setBalance(prev => {
          const newVal = prev + 15; // Push beam towards enemy
          if (newVal >= 100) {
              setGameState('VICTORY');
              playWin();
              return 100;
          }
          return newVal;
      });
  };

  // --- RENDER HELPERS ---
  const beamPos = 50 - (balance / 2); 

  return (
    <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col font-nunito overflow-hidden ${disruption === 'SHAKE' ? 'animate-shake-screen' : ''} ${disruption === 'BLUR' ? 'blur-sm' : ''}`}>
        
        {/* --- ENEMY HALF (TOP) --- */}
        <div className="flex-1 bg-red-950/30 relative flex flex-col items-center pt-8 border-b-4 border-red-500/30 transition-colors duration-300">
            {/* Enemy Status */}
            <div className={`relative transition-transform duration-100 ${enemyAction === 'HIT' ? 'scale-90 brightness-200' : 'animate-float'}`}>
                <div className="text-8xl filter drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                    {rival.avatar}
                </div>
                {enemyAction === 'ATTACK' && (
                    <div className="absolute top-full mt-2 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                        Attacking!
                    </div>
                )}
            </div>
            
            <div className="mt-4 text-center">
                <div className="text-red-400 font-black text-2xl uppercase tracking-widest">{rival.name}</div>
                <div className="text-red-500/50 text-xs font-bold uppercase">Rival Rank: {rival.score}</div>
            </div>

            {/* Enemy Health/Zone Indicator (Visual only) */}
            <div className="absolute top-4 right-4 opacity-50">
               <Skull className="text-red-600 w-12 h-12" />
            </div>
        </div>

        {/* --- BEAM STRUGGLE LAYER (ABSOLUTE CENTER) --- */}
        <div className="absolute inset-0 pointer-events-none z-10">
            {/* The Beam Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-slate-800 -translate-x-1/2"></div>
            
            {/* The Core (Energy Ball) */}
            <div 
                className="absolute left-1/2 -translate-x-1/2 w-16 h-16 transition-all duration-300 ease-out"
                style={{ top: `${beamPos}%` }}
            >
                <div className={`w-full h-full rounded-full blur-md animate-pulse ${balance > 0 ? 'bg-cyan-400' : 'bg-red-500'}`}></div>
                <div className={`absolute inset-0 rounded-full border-4 ${balance > 0 ? 'border-cyan-200 bg-cyan-500' : 'border-red-200 bg-red-500'} flex items-center justify-center shadow-[0_0_40px_currentColor]`}>
                    <Zap size={24} className="text-white fill-white" />
                </div>
            </div>
        </div>

        {/* --- PLAYER HALF (BOTTOM) --- */}
        <div className="flex-1 bg-slate-900 relative flex flex-col justify-end pb-8">
            
            {/* Question Display (Floating above numpad) */}
            <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 z-20">
                <div className={`
                    bg-slate-800/90 border-4 ${input.length > 0 ? 'border-cyan-400' : 'border-slate-600'} 
                    rounded-2xl px-12 py-6 shadow-2xl backdrop-blur-xl transform transition-transform duration-100
                    ${playerAction === 'ATTACK' ? 'scale-110 border-green-400' : ''}
                    ${playerAction === 'HIT' ? 'translate-x-2 border-red-500' : ''}
                `}>
                    <div className="text-center">
                        <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Target Lock</div>
                        <div className="text-5xl font-black text-white font-mono tracking-wider flex items-center gap-4">
                            <span>{question.q}</span>
                            <span className="text-slate-600">=</span>
                            <span className={`${input ? 'text-cyan-400' : 'text-slate-600'}`}>{input || '?'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="max-w-md mx-auto w-full px-4 relative z-20">
                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <button
                            key={n}
                            className="bg-slate-800 hover:bg-slate-700 active:bg-cyan-900 text-cyan-100 font-black text-2xl py-4 rounded-xl border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all"
                            onClick={() => handleInput(n)}
                        >
                            {n}
                        </button>
                    ))}
                    <div className="flex items-center justify-center opacity-50"><Shield className="text-slate-600"/></div>
                    <button 
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-100 font-black text-2xl py-4 rounded-xl border-b-4 border-slate-950 active:border-b-0 active:translate-y-1"
                        onClick={() => handleInput(0)}
                    >
                        0
                    </button>
                    <button 
                        className="bg-red-900/30 hover:bg-red-900/50 text-red-400 font-bold py-4 rounded-xl border-b-4 border-red-950/50 active:border-b-0 active:translate-y-1"
                        onClick={() => setInput('')}
                    >
                        CLR
                    </button>
                </div>
            </div>

            {/* Player Avatar (Bottom Left) */}
            <div className="absolute bottom-4 left-4 opacity-50">
                <div className="text-6xl">{playerAvatar}</div>
            </div>
        </div>

        {/* --- INTRO OVERLAY --- */}
        {gameState === 'INTRO' && (
            <div className="absolute inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center animate-in fade-in">
                <div className="flex items-center gap-8 mb-8">
                    <div className="text-8xl animate-slide-in-left">{playerAvatar}</div>
                    <div className="text-4xl font-black text-white italic animate-pulse">VS</div>
                    <div className="text-8xl animate-slide-in-right">{rival.avatar}</div>
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-widest text-center mb-2 text-shadow-glow">
                    Hyper Duel
                </h1>
                <p className="text-cyan-400 font-bold text-lg mb-8 uppercase tracking-wide">
                    Push the core to the enemy base!
                </p>
                <Button 
                    onClick={() => { playAttack(); setGameState('FIGHT'); }}
                    className="h-16 text-2xl px-12 bg-cyan-600 hover:bg-cyan-500 border-cyan-800 shadow-[0_0_30px_rgba(8,145,178,0.5)]"
                >
                    FIGHT!
                </Button>
            </div>
        )}

        {/* --- END GAME OVERLAYS --- */}
        {(gameState === 'VICTORY' || gameState === 'DEFEAT') && (
            <div className="absolute inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center animate-pop-in">
                <div className="mb-6">
                    {gameState === 'VICTORY' ? (
                        <Trophy size={100} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
                    ) : (
                        <Skull size={100} className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]" />
                    )}
                </div>
                
                <h2 className={`text-6xl font-black uppercase tracking-tighter mb-4 ${gameState === 'VICTORY' ? 'text-yellow-400' : 'text-red-500'}`}>
                    {gameState === 'VICTORY' ? 'YOU WON!' : 'DEFEATED'}
                </h2>
                
                <p className="text-white font-bold text-xl mb-8">
                    {gameState === 'VICTORY' ? `You dominated ${rival.name}!` : `Overwhelmed by ${rival.name}...`}
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Button 
                        onClick={() => onComplete(gameState === 'VICTORY' ? 'WIN' : 'LOSS')}
                        className={`h-16 text-xl ${gameState === 'VICTORY' ? 'bg-yellow-500 hover:bg-yellow-400 border-yellow-700 text-black' : 'bg-slate-700 hover:bg-slate-600 border-slate-900'}`}
                    >
                        {gameState === 'VICTORY' ? 'Claim Victory' : 'Return to Base'}
                    </Button>
                </div>
            </div>
        )}

        <style>{`
            @keyframes shake-screen {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                10%, 30%, 50%, 70%, 90% { transform: translate(-5px, -3px) rotate(-1deg); }
                20%, 40%, 60%, 80% { transform: translate(5px, 3px) rotate(1deg); }
            }
            .animate-shake-screen { animation: shake-screen 0.4s ease-in-out; }
        `}</style>
    </div>
  );
};
