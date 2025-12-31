
import React, { useState, useEffect } from 'react';
import { Star, Coins, ArrowRight, Sparkles, Check, Zap, Gem, AlertTriangle, Share2, Copy, Swords } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { ParticleSystem } from './ParticleSystem';
import { ARSENAL_ITEMS } from './Shop';
import { ARTIFACTS } from '../data/Artifacts';

interface LootData {
  coins: number;
  items: string[];
  artifact?: string;
}

interface VictoryChestProps {
  loot: LootData;
  stars: number;
  isBoss: boolean;
  onCollect: () => void;
  usedAssist?: boolean;
  referralCode?: string; // New Prop
}

export const VictoryChest: React.FC<VictoryChestProps> = ({ loot, stars, isBoss, onCollect, usedAssist = false, referralCode }) => {
  const [taps, setTaps] = useState(0);
  const [chestState, setChestState] = useState<'LOCKED' | 'OPENING' | 'REVEALED'>('LOCKED');
  const [displayedCoins, setDisplayedCoins] = useState(0);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  
  const { playDamage, playWin, playCorrect, playChargeUp, stopChargeUp } = useGameSound();

  const artifactDef = loot.artifact ? ARTIFACTS.find(a => a.id === loot.artifact) : null;

  // Handle Tapping logic
  const handleTap = () => {
    if (chestState !== 'LOCKED') return;

    if (taps < 2) {
      // Build up tension
      setTaps(prev => prev + 1);
      playDamage(); // Impact sound
    } else {
      // Open the chest
      setTaps(3);
      setChestState('OPENING');
      
      // Special sound for artifact
      if (loot.artifact) {
          playChargeUp();
          setTimeout(() => {
              stopChargeUp();
              playWin();
          }, 800);
      } else {
          playWin(); // Fanfare
      }
      
      setTimeout(() => {
        setChestState('REVEALED');
        // Animate coin counting
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();
        
        const animateCoins = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            
            setDisplayedCoins(Math.floor(ease * loot.coins));

            if (progress < 1) {
                requestAnimationFrame(animateCoins);
            }
        };
        requestAnimationFrame(animateCoins);

      }, 800); // Delay for explosion animation
    }
  };

  const handleChallenge = async () => {
      // Viral Challenge Mechanic:
      // "I beat Level 5 with 3 Stars. Can you beat my score? Use code AGENT-XXX for free loot!"
      const codeText = referralCode ? ` Use my Agent Code "${referralCode}" for a 500 Coin headstart!` : "";
      const text = `I just CRUSHED the ${isBoss ? 'BOSS' : 'Level'} in TimeSplit! 🏆 Can you beat my streak?${codeText} 🚀`;
      const url = window.location.href;

      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'TimeSplit Challenge!',
                  text: text,
                  url: url
              });
              setShareFeedback('Challenge Sent!');
          } catch (err) {
              console.log('Share dismissed');
          }
      } else {
          navigator.clipboard.writeText(`${text} ${url}`);
          setShareFeedback('Link Copied!');
      }
      
      setTimeout(() => setShareFeedback(null), 2000);
  };

  const getChestColor = () => {
      if (loot.artifact) return 'from-purple-500 to-indigo-700 border-purple-400';
      if (isBoss) return 'from-yellow-400 to-orange-600 border-yellow-200';
      return 'from-amber-700 to-amber-900 border-white/10';
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-nunito select-none">
         {chestState === 'REVEALED' && <ParticleSystem variant={loot.artifact ? 'trail_rainbow' : 'trail_default'} />}
         
         {/* Background Ambience */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${loot.artifact ? 'from-purple-900/60' : isBoss ? 'from-red-900/40' : 'from-indigo-900/40'} to-black transition-colors duration-1000`}></div>
         
         {/* Victory Header (Hidden initially to focus on chest) */}
         <div className={`absolute top-10 md:top-20 text-center w-full transition-all duration-700 ${chestState === 'REVEALED' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-wide text-3d drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                {isBoss ? "BOSS DEFEATED!" : "VICTORY!"}
            </h2>
            <div className="flex justify-center gap-2 items-center">
                {[...Array(3)].map((_, i) => {
                    const isFilled = i < stars;
                    return (
                        <Star 
                            key={i} 
                            size={32} 
                            className={`transition-all ${isFilled ? 'text-yellow-400 fill-yellow-400 animate-bounce' : 'text-slate-700'}`} 
                            style={{ animationDelay: `${i * 100}ms` }} 
                        />
                    );
                })}
            </div>
            {usedAssist && (
                <div className="mt-4 inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 px-4 py-2 rounded-full text-orange-300 text-xs font-bold uppercase tracking-wide animate-pulse">
                    <AlertTriangle size={14} /> 
                    <span>Ajuda do Pet = Ouro Bloqueado</span>
                </div>
            )}
         </div>

         {/* MAIN INTERACTION AREA */}
         <div className="relative z-10 flex flex-col items-center">
            
            {/* INSTRUCTION TEXT */}
            {chestState === 'LOCKED' && (
                <div className="mb-8 animate-pulse">
                    <span className="bg-white/10 text-white px-4 py-2 rounded-full font-black uppercase tracking-widest text-sm border border-white/20">
                        Tap {3 - taps} times to open!
                    </span>
                </div>
            )}

            {/* THE CHEST */}
            <div 
                onClick={handleTap}
                className={`
                    relative cursor-pointer transition-transform duration-100
                    ${chestState === 'LOCKED' && taps === 0 ? 'animate-float' : ''}
                    ${chestState === 'LOCKED' && taps > 0 ? 'scale-110' : ''}
                    ${chestState === 'OPENING' ? 'scale-150 opacity-0 transition-opacity duration-200' : ''}
                    ${chestState === 'REVEALED' ? 'hidden' : ''}
                `}
            >   
                {/* Shake Animation Container */}
                <div className={`${taps > 0 && chestState === 'LOCKED' ? 'animate-shake-hard' : ''}`}>
                    <div className={`w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br ${getChestColor()} flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-[8px] relative group`}>
                        {/* Lid Detail */}
                        <div className="absolute top-0 w-full h-1/3 bg-black/10 border-b-4 border-black/20"></div>
                        
                        {/* Lock */}
                        <div className="w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-lg flex items-center justify-center">
                             <div className="w-8 h-10 bg-black/20 rounded-md"></div>
                        </div>

                        {/* Glow on hover */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
                    </div>
                </div>

                {/* Hit Effects */}
                {taps > 0 && chestState === 'LOCKED' && (
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 text-6xl animate-pop-in">💥</div>
                )}
            </div>

            {/* EXPLOSION FLASH */}
            {chestState === 'OPENING' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full bg-white animate-flash-fade"></div>
                    <div className="text-9xl animate-scale-up">💥</div>
                </div>
            )}

            {/* REVEALED LOOT CARD */}
            {chestState === 'REVEALED' && (
                <div className={`bg-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-sm text-center shadow-[0_0_100px_rgba(255,255,255,0.2)] animate-scale-up-elastic border-[6px] ${loot.artifact ? 'border-purple-500' : 'border-gray-100'}`}>
                    
                    <div className="mb-8">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Loot Acquired</div>
                        
                        {/* ARTIFACT DISPLAY (Hero position) */}
                        {artifactDef && (
                            <div className="mb-8 animate-float">
                                <div className="text-xs font-black text-purple-500 uppercase tracking-widest mb-2 bg-purple-100 inline-block px-3 py-1 rounded-full border border-purple-200">Ancient Artifact Found!</div>
                                <div className="text-2xl font-black text-slate-800 mb-1">{artifactDef.name}</div>
                                <div className="w-32 h-32 mx-auto bg-slate-900 rounded-2xl flex items-center justify-center border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                                    {/* Simplified Icon since full SVG is in ChronoVault */}
                                    <Gem size={64} className="text-purple-400" />
                                </div>
                            </div>
                        )}

                        {/* SPLITZ */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="text-6xl font-black text-yellow-500 text-3d mb-1 flex items-center gap-2">
                                +{displayedCoins} <Zap size={48} className="text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="text-gray-400 font-bold text-sm">Splitz Collected</div>
                        </div>

                        {/* ITEMS DROP */}
                        {loot.items.length > 0 && (
                            <div className="grid gap-3">
                                {loot.items.map((itemId, idx) => {
                                    const itemDef = ARSENAL_ITEMS.find(i => i.id === itemId);
                                    if (!itemDef) return null;
                                    const Icon = itemDef.icon;

                                    return (
                                        <div key={idx} className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-3 flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${idx * 200 + 500}ms` }}>
                                            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                <Icon size={24} />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Item Found!</div>
                                                <div className="text-lg font-black text-gray-900 leading-none">{itemDef.name}</div>
                                            </div>
                                            <div className="ml-auto bg-green-500 text-white rounded-full p-1">
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                         
                         {loot.items.length === 0 && !loot.artifact && (
                             <div className="text-gray-300 font-bold text-xs italic mt-4">
                                No items found this time...
                             </div>
                         )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button onClick={onCollect} className="w-full h-16 text-xl shadow-indigo-500/30 animate-pulse">
                            Collect & Continue <ArrowRight className="ml-2" />
                        </Button>
                        
                        <button 
                            onClick={handleChallenge}
                            className="flex items-center justify-center gap-2 text-indigo-500 font-black uppercase text-xs tracking-widest py-3 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                            {shareFeedback ? (
                                <><Check size={14} /> {shareFeedback}</>
                            ) : (
                                <><Swords size={14} /> Challenge A Friend</>
                            )}
                        </button>
                    </div>
                </div>
            )}

         </div>

         <style>{`
            @keyframes shake-hard {
                0% { transform: translate(1px, 1px) rotate(0deg); }
                10% { transform: translate(-3px, -2px) rotate(-10deg); }
                20% { transform: translate(-3px, 0px) rotate(10deg); }
                30% { transform: translate(3px, 2px) rotate(0deg); }
                40% { transform: translate(1px, -1px) rotate(10deg); }
                50% { transform: translate(-1px, 2px) rotate(-10deg); }
                60% { transform: translate(-3px, 1px) rotate(0deg); }
                70% { transform: translate(3px, 1px) rotate(-10deg); }
                80% { transform: translate(-1px, -1px) rotate(10deg); }
                90% { transform: translate(1px, 2px) rotate(0deg); }
                100% { transform: translate(1px, -2px) rotate(-10deg); }
            }
            .animate-shake-hard {
                animation: shake-hard 0.3s cubic-bezier(.36,.07,.19,.97) both;
            }
            @keyframes scale-up-elastic {
                0% { transform: scale(0.5); opacity: 0; }
                60% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-scale-up-elastic {
                animation: scale-up-elastic 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            @keyframes flash-fade {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
            .animate-flash-fade {
                animation: flash-fade 0.5s ease-out forwards;
            }
            @keyframes slide-up {
                0% { transform: translateY(20px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-up {
                animation: slide-up 0.4s ease-out forwards;
            }
         `}</style>
    </div>
  );
};
