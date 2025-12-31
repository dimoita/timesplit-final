import React, { useState, useEffect } from 'react';
import { Package, Zap, Shield, Hourglass, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { ARSENAL_ITEMS } from './Shop';

interface DailyRewardModalProps {
  onClaim: (coins: number, item: string) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClaim }) => {
  const [state, setState] = useState<'DROP' | 'LANDED' | 'OPENING' | 'REVEALED'>('DROP');
  const [loot, setLoot] = useState<{ coins: number; item: string | null }>({ coins: 0, item: null });
  const { playChainBreak, playWin, playCoinFlight, playDamage } = useGameSound();

  useEffect(() => {
    // Initialize Loot
    const coins = Math.floor(Math.random() * 100) + 50; // 50-150
    const items = ['freeze', 'shield', 'zap'];
    const item = items[Math.floor(Math.random() * items.length)];
    setLoot({ coins, item });

    // Sequence
    setTimeout(() => {
      setState('LANDED');
      playChainBreak(); // Heavy impact sound
    }, 800); // Drop duration
  }, []);

  const handleOpen = () => {
    setState('OPENING');
    playDamage(); // Shake sound
    
    setTimeout(() => {
      setState('REVEALED');
      playWin();
      setTimeout(() => playCoinFlight(), 300);
    }, 1000); // Opening delay
  };

  const itemDef = loot.item ? ARSENAL_ITEMS.find(i => i.id === loot.item) : null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      
      {/* Styles for specific animations */}
      <style>{`
        @keyframes drop-heavy {
          0% { transform: translateY(-120vh) scale(0.8); opacity: 0; }
          70% { transform: translateY(20px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes shake-violent {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg) translate(5px, 5px); }
          75% { transform: rotate(-5deg) translate(-5px, -5px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.2); }
          50% { box-shadow: 0 0 50px rgba(250, 204, 21, 0.6); }
        }
        @keyframes rays {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-drop-heavy { animation: drop-heavy 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .animate-shake-violent { animation: shake-violent 0.1s infinite; }
        .animate-rays { animation: rays 10s linear infinite; }
      `}</style>

      {/* CRATE CONTAINER */}
      <div className={`relative transition-all duration-300 ${state === 'REVEALED' ? 'scale-110' : ''}`}>
        
        {/* LIGHT RAYS (Revealed) */}
        {state === 'REVEALED' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 opacity-50">
             <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,215,0,0.2)_20deg,transparent_40deg)] animate-rays rounded-full"></div>
          </div>
        )}

        {/* THE BOX */}
        {state !== 'REVEALED' && (
          <div 
            className={`
              w-64 h-64 bg-amber-600 rounded-3xl border-[8px] border-amber-800 shadow-2xl relative flex flex-col items-center justify-center
              ${state === 'DROP' ? 'animate-drop-heavy' : ''}
              ${state === 'LANDED' ? 'animate-bounce-gentle' : ''}
              ${state === 'OPENING' ? 'animate-shake-violent' : ''}
            `}
            style={{ 
              boxShadow: state === 'LANDED' ? '0 20px 50px rgba(0,0,0,0.5)' : 'none'
            }}
          > 
            {/* Caution Stripes */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-20 pointer-events-none">
                <div className="w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[repeating-linear-gradient(45deg,#000,#000_20px,transparent_20px,transparent_40px)]"></div>
            </div>
            
            {/* Lid */}
            <div className="absolute top-0 w-full h-1/2 bg-amber-500 rounded-t-2xl border-b-4 border-black/20 z-10"></div>
            
            <Package size={80} className="text-amber-950/50 relative z-20" strokeWidth={1.5} />
            
            {state === 'LANDED' && (
               <div className="absolute -bottom-20 w-full">
                  <Button onClick={handleOpen} className="w-full bg-yellow-500 hover:bg-yellow-400 border-yellow-700 text-black shadow-lg animate-pulse">
                     OPEN SUPPLY DROP
                  </Button>
               </div>
            )}
          </div>
        )}

        {/* REVEALED CONTENT */}
        {state === 'REVEALED' && (
           <div className="bg-white w-80 rounded-[2rem] p-8 text-center shadow-2xl border-[6px] border-yellow-400 animate-scale-up-elastic relative z-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded-full font-black uppercase tracking-widest shadow-lg text-sm whitespace-nowrap">
                  Daily Supply Drop
              </div>

              <div className="mt-6 space-y-6">
                  {/* COINS */}
                  <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
                      <div className="text-yellow-600 font-bold text-xs uppercase mb-1">Currency</div>
                      <div className="text-4xl font-black text-gray-900 flex items-center justify-center gap-2">
                          +{loot.coins} <Zap className="text-yellow-500 fill-yellow-500" />
                      </div>
                  </div>

                  {/* ITEM */}
                  {itemDef && (
                      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
                          <div className="text-indigo-600 font-bold text-xs uppercase mb-2">Tactical Item</div>
                          <div className="flex items-center gap-4 text-left">
                              <div className="text-4xl bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100">
                                  {itemDef.emoji}
                              </div>
                              <div>
                                  <div className="font-black text-gray-900">{itemDef.name}</div>
                                  <div className="text-xs text-gray-500 leading-tight">{itemDef.description}</div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>

              <div className="mt-8">
                  <p className="text-xs font-bold text-gray-400 mb-2">Daily Streak: Active 🔥</p>
                  <Button onClick={() => onClaim(loot.coins, loot.item || '')} className="w-full h-14 text-lg bg-green-600 hover:bg-green-500 border-green-800 shadow-green-500/20">
                      Claim Supplies <Check className="ml-2" />
                  </Button>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};