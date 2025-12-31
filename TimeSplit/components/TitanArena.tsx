
import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Target, Swords, Users, Crown, Trophy, Timer, WifiOff } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { supabase } from '../lib/supabaseClient';

interface TitanArenaProps {
  onExit: () => void;
  onComplete: (damageDealt: number) => void;
  username: string;
}

interface FloatingDamage {
  id: number;
  x: number;
  y: number;
  val: number;
  isCrit: boolean;
  isOtherPlayer: boolean; 
}

const BOSS_EMOJIS = ['👾', '🦑', '🐉', '👁️‍🗨️', '🌑'];

export const TitanArena: React.FC<TitanArenaProps> = ({ onExit, onComplete, username }) => {
  const [gameState, setGameState] = useState<'INTRO' | 'FIGHT' | 'VICTORY' | 'DEFEAT'>('INTRO');
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalDamage, setTotalDamage] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  
  // Realtime Boss State
  const [bossHp, setBossHp] = useState(1000000);
  const [maxBossHp, setMaxBossHp] = useState(1000000);
  
  // Question State
  const [q, setQ] = useState<{ text: string, ans: number, options: number[] } | null>(null);
  const [floatingText, setFloatingText] = useState<FloatingDamage[]>([]);
  
  // Visual State
  const [bossEmoji] = useState(() => BOSS_EMOJIS[Math.floor(Math.random() * BOSS_EMOJIS.length)]);
  const [bossShake, setBossShake] = useState(false);
  const [flash, setFlash] = useState(false);
  
  const { playAttack, playDamage, playWin, playCorrect } = useGameSound();

  // --- 1. SUPABASE CONNECTION ---
  useEffect(() => {
      if (!supabase) {
          setIsOnline(false);
          return;
      }

      // Initial Fetch
      const fetchBoss = async () => {
          const { data } = await supabase.from('global_boss').select('*').eq('id', 1).single();
          if (data) {
              setBossHp(data.current_hp);
              setMaxBossHp(data.max_hp);
          }
      };
      fetchBoss();

      // Realtime Subscription
      const channel = supabase
        .channel('public:global_boss')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_boss', filter: 'id=eq.1' }, (payload) => {
            const newRow = payload.new as any;
            setBossHp(newRow.current_hp);
            setMaxBossHp(newRow.max_hp);
            
            // Show damage effect if HP dropped significantly (someone else hit)
            if (newRow.current_hp < bossHp - 100) {
                 setBossShake(true);
                 setTimeout(() => setBossShake(false), 100);
            }
        })
        .subscribe();

      return () => {
          supabase.removeChannel(channel);
      };
  }, []); // Run once on mount

  // --- GAME LOOP ---
  useEffect(() => {
      if (gameState === 'FIGHT') {
          const timer = setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 1) {
                      setGameState('VICTORY');
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [gameState]);

  // --- GENERATE QUESTION ---
  const nextQuestion = () => {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      const ans = a * b;
      
      const opts = new Set<number>();
      opts.add(ans);
      while(opts.size < 3) {
          const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
          const val = ans + offset;
          if (val > 0 && val !== ans) opts.add(val);
      }
      
      setQ({
          text: `${a} × ${b}`,
          ans: ans,
          options: Array.from(opts).sort(() => Math.random() - 0.5)
      });
  };

  useEffect(() => {
      if (gameState === 'FIGHT' && !q) nextQuestion();
  }, [gameState, q]);

  const handleAnswer = async (val: number, e: React.MouseEvent) => {
      if (!q) return;

      if (val === q.ans) {
          // HIT
          const isCrit = Math.random() < 0.2;
          const baseDmg = 100 + (combo * 10);
          const dmg = isCrit ? baseDmg * 2 : baseDmg;
          
          // Optimistic UI Update
          setBossHp(prev => Math.max(0, prev - dmg));
          setTotalDamage(prev => prev + dmg);
          setCombo(prev => prev + 1);
          playAttack();
          
          // --- RPC CALL ---
          if (supabase && isOnline) {
              supabase.rpc('inflict_damage', { damage_amount: dmg }).then(({ data, error }) => {
                  if (error) console.error("Hit failed", error);
                  // Optional: Re-sync HP from result data if needed
              });
          }

          // Visuals
          setBossShake(true);
          setTimeout(() => setBossShake(false), 200);
          if (isCrit) {
              setFlash(true);
              setTimeout(() => setFlash(false), 100);
          }

          // Floating Text
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const ft: FloatingDamage = {
              id: Date.now(),
              x: rect.left + rect.width/2,
              y: rect.top,
              val: dmg,
              isCrit,
              isOtherPlayer: false
          };
          setFloatingText(prev => [...prev, ft]);
          setTimeout(() => setFloatingText(prev => prev.filter(f => f.id !== ft.id)), 1000);

          nextQuestion();
      } else {
          // MISS
          playDamage();
          setCombo(0);
      }
  };

  // --- RENDER ---
  const hpPercent = (bossHp / maxBossHp) * 100;
  
  if (gameState === 'INTRO') {
      return (
          <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-6 font-nunito overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
              <div className="relative z-10 text-center animate-pop-in max-w-md w-full">
                  <div className="mb-8 relative">
                      <div className="text-9xl animate-float filter drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">{bossEmoji}</div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                  </div>
                  
                  <h1 className="text-4xl font-black text-white mb-2 text-shadow-glow uppercase tracking-widest">Titan Hunt</h1>
                  <p className="text-purple-300 font-bold mb-8">Join the global raid to defeat the Titan!</p>
                  
                  <div className="bg-slate-900/50 border border-purple-500/30 p-4 rounded-2xl mb-8">
                      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          <span>Global Boss HP</span>
                          <span>{hpPercent.toFixed(2)}%</span>
                      </div>
                      <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                          <div className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-shimmer" style={{ width: `${hpPercent}%` }}></div>
                      </div>
                      {!isOnline && (
                          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-red-400 font-bold">
                              <WifiOff size={12} /> Offline Mode (Simulation Only)
                          </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-4">
                      <Button onClick={() => { playCorrect(); setGameState('FIGHT'); }} className="w-full h-16 text-xl bg-purple-600 hover:bg-purple-500 border-purple-800 shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                          <Swords className="mr-2" /> JOIN RAID
                      </Button>
                      <button onClick={onExit} className="text-slate-500 font-bold hover:text-white transition-colors">RETREAT</button>
                  </div>
              </div>
          </div>
      );
  }

  if (gameState === 'VICTORY') {
      return (
          <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-6 font-nunito">
              <div className="text-center animate-pop-in max-w-md w-full">
                  <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                  <h2 className="text-4xl font-black text-white mb-2 uppercase">Raid Report</h2>
                  <p className="text-slate-400 font-bold mb-8">Great job, {username}!</p>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Your Contribution</div>
                      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400 mb-2">
                          {totalDamage.toLocaleString()}
                      </div>
                      {isOnline && (
                          <div className="text-xs font-bold text-green-400 flex items-center justify-center gap-1">
                              <Zap size={10} /> Uploaded to Leaderboard
                          </div>
                      )}
                  </div>

                  <Button onClick={() => onComplete(totalDamage)} className="w-full h-16 text-xl bg-green-600 hover:bg-green-500 border-green-800">
                      Collect Reward
                  </Button>
              </div>
          </div>
      );
  }

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950 flex flex-col font-nunito overflow-hidden ${flash ? 'bg-purple-900/50' : ''} transition-colors duration-75`}>
        {/* BG Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse-slow"></div>
        
        {/* Floating Text Overlay */}
        {floatingText.map(ft => (
            <div 
                key={ft.id}
                className={`fixed pointer-events-none font-black z-50 ${ft.isOtherPlayer ? 'text-xs opacity-50 text-slate-500' : 'text-3xl text-yellow-400 text-shadow-glow'} animate-float-up`}
                style={{ left: ft.x, top: ft.y }}
            >
                {ft.isOtherPlayer ? `Hero: -${ft.val}` : `-${ft.val}${ft.isCrit ? '!' : ''}`}
            </div>
        ))}

        {/* HUD */}
        <div className="relative z-20 p-4 flex justify-between items-end border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-black uppercase">Damage</div>
                    <div className="text-xl font-black text-white">{totalDamage.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                    <Users size={16} /> <span className="font-bold text-xs">Online</span>
                </div>
            </div>
            
            {/* Boss HP Bar Top */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full max-w-xs md:max-w-md">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 px-1">
                    <span>Titan Health</span>
                    <span>{hpPercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600 shadow-lg">
                    <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${hpPercent}%` }}></div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
                <Timer size={20} className={`${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
                <span className={`text-xl font-black ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
            </div>
        </div>

        {/* BATTLEFIELD */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-4">
            
            {/* Boss */}
            <div className={`text-9xl mb-8 transition-transform duration-100 ${bossShake ? 'scale-110 translate-x-2' : 'animate-float'} filter drop-shadow-[0_0_50px_rgba(139,92,246,0.4)]`}>
                {bossEmoji}
            </div>

            {/* Question Card */}
            {q && (
                <div className="w-full max-w-md relative z-30">
                    <div className="text-center mb-6">
                        <div className="inline-block bg-black/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 shadow-2xl">
                            <span className="text-6xl font-black text-white tracking-widest text-shadow-glow">{q.text}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={(e) => handleAnswer(opt, e)}
                                className="h-20 bg-slate-800/80 hover:bg-purple-600 border-b-4 border-slate-950 hover:border-purple-800 rounded-xl text-3xl font-black text-white transition-all active:scale-95 shadow-lg backdrop-blur-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
        
        {/* Exit Btn */}
        <button onClick={onExit} className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors z-50">
            <X />
        </button>

        <style>{`
            .text-shadow-glow { text-shadow: 0 0 10px rgba(255,255,255,0.8); }
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            .animate-shimmer {
                background: linear-gradient(90deg, #9333ea 25%, #db2777 50%, #9333ea 75%);
                background-size: 200% 100%;
                animation: shimmer 3s infinite linear;
            }
        `}</style>
    </div>
  );
};
