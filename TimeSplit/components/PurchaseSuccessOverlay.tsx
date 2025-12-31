import React, { useEffect, useState } from 'react';
import { Zap, Shield, Check, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { ParticleSystem } from './ParticleSystem';
import { useGameSound } from '../hooks/useGameSound';

interface LootData {
  coins: number;
  items: string[];
}

interface PurchaseSuccessOverlayProps {
  loot: LootData;
  onClose: () => void;
}

// Generate random flight paths for coins
const generateCoins = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        left: 50 + (Math.random() - 0.5) * 20 + '%', // Start near center
        top: 50 + (Math.random() - 0.5) * 10 + '%',
    }));
};

export const PurchaseSuccessOverlay: React.FC<PurchaseSuccessOverlayProps> = ({ loot, onClose }) => {
  const [displayedCoins, setDisplayedCoins] = useState(0);
  const { playWin, playCoinFlight } = useGameSound();
  const [flyingCoins, setFlyingCoins] = useState<any[]>([]);

  useEffect(() => {
    playWin();
    
    // Trigger flying coins visual
    setFlyingCoins(generateCoins(20)); // Spawn 20 visual coins
    
    // Play sound loop
    setTimeout(() => {
        playCoinFlight();
    }, 300);

    // Animate coin counting
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

  }, [loot.coins, playWin, playCoinFlight]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0f172a]/95 backdrop-blur-xl animate-in fade-in duration-300 overflow-hidden">
         
         <ParticleSystem variant="trail_rainbow" />
         
         {/* Background Light Burst */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
         </div>

         {/* FLYING COINS LAYER */}
         {flyingCoins.map(coin => (
             <div 
                key={coin.id}
                className="absolute z-50 text-yellow-400 animate-fly-to-bank pointer-events-none"
                style={{ 
                    left: coin.left, 
                    top: coin.top,
                    animationDelay: `${coin.delay}s`
                }}
             >
                 <Zap size={24} fill="currentColor" />
             </div>
         ))}

         <div className="bg-white rounded-[3rem] p-8 md:p-12 w-full max-w-sm text-center shadow-[0_0_100px_rgba(255,215,0,0.4)] relative z-10 animate-scale-up-elastic border-[6px] border-yellow-400">
            
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded-full font-black uppercase tracking-widest shadow-lg border-2 border-white">
                Payment Verified
            </div>

            <div className="mb-8 mt-4">
                <div className="text-8xl mb-6 animate-bounce-gentle">💎</div>
                
                <div className="flex flex-col items-center mb-6">
                    <div className="text-6xl font-black text-yellow-500 text-3d mb-1 flex items-center gap-2">
                        +{displayedCoins} <Zap size={48} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="text-gray-400 font-bold text-sm uppercase tracking-wide">Splitz Added to Bank</div>
                </div>

                {/* ITEMS DROP */}
                {loot.items.length > 0 && (
                    <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                        {loot.items.map((item, idx) => (
                            <div key={idx} className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-3 flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <Shield size={24} />
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Bonus Item</div>
                                    <div className="text-lg font-black text-gray-900 leading-none">Neural Shield</div>
                                </div>
                                <div className="ml-auto bg-green-500 text-white rounded-full p-1">
                                    <Check size={14} strokeWidth={4} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button onClick={onClose} className="w-full h-16 text-xl shadow-yellow-500/30 animate-pulse bg-green-600 hover:bg-green-500 border-green-800">
                Claim & Continue <ArrowRight className="ml-2" />
            </Button>
         </div>

         <style>{`
            @keyframes scale-up-elastic {
                0% { transform: scale(0.5); opacity: 0; }
                60% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes fly-to-bank {
                0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
                20% { transform: translate(0, -50px) scale(1.2); }
                100% { transform: translate(40vw, -45vh) scale(0.5) rotate(720deg); opacity: 0; }
            }
            .animate-scale-up-elastic {
                animation: scale-up-elastic 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .animate-fly-to-bank {
                animation: fly-to-bank 1.2s ease-in-out forwards;
            }
            @keyframes slide-up {
                0% { transform: translateY(20px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-up {
                animation: slide-up 0.4s ease-out forwards;
            }
            .animate-pulse-slow {
                animation: pulse 3s infinite;
            }
         `}</style>
    </div>
  );
};