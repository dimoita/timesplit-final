import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldAlert, Fingerprint, Zap, Crown, Loader2 } from 'lucide-react';
import { useGameSound } from '../hooks/useGameSound';

interface CoinShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (pack: any) => void;
}

export const CoinShopModal: React.FC<CoinShopModalProps> = ({ isOpen, onClose, onPurchase }) => {
  const [view, setView] = useState<'SHOP' | 'GATE'>('SHOP');
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isShake, setIsShake] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const pressStartTime = useRef<number | null>(null);
  const animationFrame = useRef<number>(0);
  
  const { playDamage, playChargeUp, stopChargeUp, playWin } = useGameSound();

  useEffect(() => {
    if (isOpen) {
      setView('SHOP');
      setProgress(0);
      setIsProcessing(false);
    }
  }, [isOpen]);

  useEffect(() => {
      if (view === 'GATE' && !isProcessing) {
          playDamage(); // Alert sound on gate open
      }
  }, [view, isProcessing, playDamage]);

  if (!isOpen) return null;

  const handlePackClick = (pack: any) => {
    setSelectedPack(pack);
    setView('GATE');
  };

  const startHold = (e: React.TouchEvent | React.MouseEvent) => {
    if (isProcessing) return;
    setIsShake(false);
    pressStartTime.current = Date.now();
    
    // Start rising pitch sound
    playChargeUp();
    
    const tick = () => {
      const elapsed = Date.now() - (pressStartTime.current || 0);
      const p = Math.min(100, (elapsed / 2500) * 100); // 2.5s hold time
      setProgress(p);

      if (p < 100) {
        animationFrame.current = requestAnimationFrame(tick);
      } else {
        handleUnlock();
      }
    };
    animationFrame.current = requestAnimationFrame(tick);
  };

  const endHold = () => {
    if (isProcessing) return;
    cancelAnimationFrame(animationFrame.current);
    stopChargeUp(); // Stop sound immediately

    if (progress < 100 && progress > 0) {
      // Failed attempt
      setIsShake(true);
      playDamage(); // Error sound
      setProgress(0);
    }
    pressStartTime.current = null;
  };

  const handleUnlock = () => {
    stopChargeUp(); // Stop rising pitch
    playWin(); // Success sound
    setIsProcessing(true);
    
    // Simulate checkout latency
    setTimeout(() => {
        if (onPurchase) {
            onPurchase(selectedPack);
        }
        onClose();
    }, 1500);
  };

  const PACKS = [
    { id: 'small', name: 'Handful of Splitz', coins: 150, price: '$2.90', icon: '💰', popular: false },
    { id: 'medium', name: 'Chest of Wonders', coins: 500, price: '$6.90', icon: '🏆', popular: true, bonus: '+ 5 Shields' },
    { id: 'large', name: 'Vault Access', coins: 1500, price: '$14.90', icon: '🏦', popular: false },
  ];

  // Calculate random shake based on progress for "tension" effect
  const tensionShake = progress > 0 ? `translate(${Math.random() * (progress/20)}px, ${Math.random() * (progress/20)}px)` : 'none';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      
      {view === 'SHOP' ? (
        // STATE 1: THE VAULT
        <div className="w-full max-w-lg bg-slate-900 border-2 border-indigo-500/50 rounded-[2rem] overflow-hidden shadow-2xl relative animate-pop-in">
           {/* Decorative BG */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]"></div>

           <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20">
             <X size={24} />
           </button>

           <div className="p-8 text-center relative z-10">
             <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
               <Zap size={32} className="text-yellow-400 fill-yellow-400" />
             </div>
             <h2 className="text-3xl font-black text-white uppercase tracking-wide mb-1 text-shadow-glow">The Vault</h2>
             <p className="text-indigo-300 font-bold text-sm">Acquire resources to speed up evolution.</p>
           </div>

           <div className="px-6 pb-8 space-y-4 relative z-10">
             {PACKS.map((pack) => (
               <div 
                 key={pack.id}
                 onClick={() => handlePackClick(pack)}
                 className={`
                   relative group cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 transform hover:scale-[1.02]
                   ${pack.popular ? 'bg-gradient-to-r from-indigo-900 to-indigo-800 border-yellow-400 shadow-lg shadow-indigo-500/20' : 'bg-slate-800 border-slate-700 hover:border-indigo-400'}
                 `}
               >
                 {pack.popular && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                     <Crown size={10} fill="currentColor"/> Best Value
                   </div>
                 )}
                 
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="text-4xl">{pack.icon}</div>
                       <div className="text-left">
                          <h3 className={`font-black text-lg ${pack.popular ? 'text-white' : 'text-slate-200'}`}>{pack.name}</h3>
                          <div className="flex items-center gap-2 text-sm font-bold text-yellow-400">
                             <Zap size={12} fill="currentColor"/> {pack.coins} Splitz
                             {pack.bonus && <span className="text-green-400 text-xs">+ {pack.bonus}</span>}
                          </div>
                       </div>
                    </div>
                    <div className="bg-white text-black font-black px-4 py-2 rounded-xl text-lg shadow-sm">
                       {pack.price}
                    </div>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="bg-slate-950 p-4 text-center border-t border-slate-800 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Secure Transaction • Parental Gate Protected
           </div>
        </div>
      ) : (
        // STATE 2: THE GUARDIAN GATE (BIO-SCANNER)
        <div className={`w-full max-w-md bg-red-950 border-[6px] border-red-600 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.5)] relative animate-in zoom-in duration-200 ${isShake ? 'animate-shake' : ''}`}>
           
           {/* Hazard Stripes */}
           <div className="absolute top-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)] opacity-80"></div>
           <div className="absolute bottom-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)] opacity-80"></div>

           <div className="p-8 text-center relative z-10">
              <div className="mb-6 relative inline-block">
                 <ShieldAlert size={80} className="text-red-500 animate-pulse" />
                 <div className="absolute inset-0 bg-red-500 blur-2xl opacity-30 animate-pulse"></div>
              </div>
              
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2 leading-none text-shadow-glow">
                 Security Breach<br/>Detected
              </h2>
              <p className="text-red-300 font-bold text-sm mb-8 bg-red-900/50 p-3 rounded-lg border border-red-500/30">
                 Unauthorized bio-signature on Vault Access. <br/>System Locked.
              </p>

              <div className="bg-black/40 rounded-xl p-4 mb-8 border border-red-500/20">
                 <p className="text-white font-black uppercase text-lg animate-pulse mb-1">
                    HAND DEVICE TO COMMANDER
                 </p>
                 <p className="text-xs text-red-400 font-bold uppercase tracking-widest">
                    (Parent) Immediately
                 </p>
              </div>

              {/* Bio Scanner Button */}
              <div className="relative flex justify-center">
                 <button
                    onMouseDown={startHold}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                    onTouchStart={startHold}
                    onTouchEnd={endHold}
                    disabled={isProcessing}
                    className={`relative w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-700 flex items-center justify-center group select-none -webkit-touch-callout-none ${isProcessing ? 'cursor-wait' : 'active:scale-95 transition-transform'}`}
                    style={{ WebkitUserSelect: 'none', transform: tensionShake }}
                 >
                    {/* Progress Ring */}
                    {!isProcessing && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                        <circle
                            cx="50%" cy="50%" r="44%"
                            fill="none"
                            stroke="#334155"
                            strokeWidth="4"
                        />
                        <circle
                            cx="50%" cy="50%" r="44%"
                            fill="none"
                            stroke={progress > 0 ? (progress >= 100 ? '#4ade80' : '#facc15') : 'transparent'}
                            strokeWidth="4"
                            strokeDasharray="280"
                            strokeDashoffset={280 - (280 * progress) / 100}
                            className="transition-all duration-75"
                            strokeLinecap="round"
                        />
                        </svg>
                    )}
                    
                    {isProcessing ? (
                        <Loader2 size={40} className="text-green-500 animate-spin" />
                    ) : (
                        <Fingerprint 
                        size={40} 
                        className={`transition-colors duration-300 ${progress > 0 ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`} 
                        />
                    )}
                 </button>
              </div>
              
              <div className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                 {isProcessing ? (
                     <span className="text-green-400 animate-pulse">Contacting Orbital Bank...</span>
                 ) : (
                     "Guardian: Hold for 3 seconds to verify identity"
                 )}
              </div>

              <button 
                onClick={() => !isProcessing && setView('SHOP')} 
                className={`mt-8 text-red-400/50 hover:text-red-400 font-bold uppercase text-xs tracking-wider transition-colors ${isProcessing ? 'opacity-0 pointer-events-none' : ''}`}
              >
                 Cancel Access
              </button>
           </div>
        </div>
      )}
      
      <style>{`
        .text-shadow-glow { text-shadow: 0 0 20px rgba(255,255,255,0.5); }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};