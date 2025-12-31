
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Ticket, Clock, CheckCircle2, AlertCircle, QrCode, ScanLine, X, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

export interface RealWorldItem {
  id: string; // unique instance id
  itemId: string; // type id (e.g. 'supply_screen')
  name: string;
  cost: number;
  purchasedAt: string;
  status: 'UNUSED' | 'ACTIVE' | 'USED';
  activatedAt?: string;
}

interface RealityCouponsProps {
  onBack: () => void;
  inventory: RealWorldItem[];
  onConsume: (id: string) => void; // Activates the coupon (starts timer)
  onFinish: (id: string) => void; // Marks as used/finished
}

export const RealityCoupons: React.FC<RealityCouponsProps> = ({ onBack, inventory, onConsume, onFinish }) => {
  const [selectedCoupon, setSelectedCoupon] = useState<RealWorldItem | null>(null);
  const [modalState, setModalState] = useState<'PREVIEW' | 'ACTIVE' | 'REDEEMED'>('PREVIEW');
  const [timer, setTimer] = useState<string>('00:00');
  
  const { playCorrect, playWin, playChargeUp } = useGameSound();

  // Helper to get emoji based on name (simple mapping since we don't store emoji in inventory)
  const getEmoji = (name: string) => {
      if (name.includes('Screen')) return '📺';
      if (name.includes('Chore')) return '🧹';
      if (name.includes('Dinner')) return '🍕';
      if (name.includes('Movie')) return '🎟️';
      return '🎁';
  };

  const handleOpen = (item: RealWorldItem) => {
      setSelectedCoupon(item);
      if (item.status === 'ACTIVE') {
          setModalState('ACTIVE');
      } else if (item.status === 'USED') {
          setModalState('REDEEMED');
      } else {
          setModalState('PREVIEW');
      }
      playCorrect();
  };

  const handleActivate = () => {
      if (!selectedCoupon) return;
      playChargeUp();
      onConsume(selectedCoupon.id);
      setModalState('ACTIVE');
      // Update local object to reflect change immediately
      setSelectedCoupon({ ...selectedCoupon, status: 'ACTIVE', activatedAt: new Date().toISOString() });
  };

  const handleFinish = () => {
      if (!selectedCoupon) return;
      playWin();
      onFinish(selectedCoupon.id);
      setModalState('REDEEMED');
      setSelectedCoupon({ ...selectedCoupon, status: 'USED' });
  };

  // Timer Effect for Active Coupons
  useEffect(() => {
      if (modalState === 'ACTIVE' && selectedCoupon?.activatedAt) {
          const interval = setInterval(() => {
              const start = new Date(selectedCoupon.activatedAt!).getTime();
              const now = Date.now();
              const diff = now - start;
              
              // Let's assume a 2-hour valid window for redemption OR usage duration
              // For visualization, we show time ELAPSED since activation
              const seconds = Math.floor(diff / 1000);
              const m = Math.floor(seconds / 60);
              const s = seconds % 60;
              setTimer(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
          }, 1000);
          return () => clearInterval(interval);
      }
  }, [modalState, selectedCoupon]);

  // Sort: Active first, then Unused, then Used
  const sortedInventory = [...inventory].sort((a, b) => {
      const score = (status: string) => status === 'ACTIVE' ? 3 : status === 'UNUSED' ? 2 : 1;
      return score(b.status) - score(a.status) || new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-900 font-nunito flex flex-col relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)]"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back
            </button>
            <div className="flex items-center gap-2 text-purple-400">
                <Ticket size={24} />
                <span className="font-black uppercase tracking-wider text-sm">Supply Bag</span>
            </div>
        </div>

        <main className="flex-1 p-6 max-w-4xl mx-auto w-full overflow-y-auto">
            {sortedInventory.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Ticket size={48} className="text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Supplies Yet</h3>
                    <p className="text-slate-400">Visit the Shop to buy real-world rewards.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sortedInventory.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => handleOpen(item)}
                            className={`
                                relative p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02]
                                ${item.status === 'ACTIVE' ? 'bg-green-900/20 border-green-500 animate-pulse-slow' : 
                                  item.status === 'USED' ? 'bg-slate-800/50 border-slate-700 opacity-60' : 
                                  'bg-slate-800 border-indigo-500/50 hover:border-indigo-400'}
                            `}
                        >
                            {item.status === 'ACTIVE' && (
                                <div className="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded-bl-xl uppercase">Active</div>
                            )}
                            {item.status === 'USED' && (
                                <div className="absolute top-0 right-0 bg-slate-700 text-slate-400 text-[10px] font-black px-2 py-1 rounded-bl-xl uppercase">Redeemed</div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="text-4xl">{getEmoji(item.name)}</div>
                                <div>
                                    <h4 className="font-black text-white text-lg leading-tight">{item.name}</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                                        {item.status === 'ACTIVE' ? 'Ready to Redeem' : item.status === 'USED' ? 'Consumed' : 'Tap to Activate'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>

        {/* MODAL */}
        {selectedCoupon && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
                <div className={`
                    w-full max-w-md bg-slate-900 border-[4px] rounded-[2rem] overflow-hidden shadow-2xl relative animate-pop-in
                    ${modalState === 'ACTIVE' ? 'border-green-500 shadow-green-500/30' : 
                      modalState === 'REDEEMED' ? 'border-slate-700' : 
                      'border-indigo-500 shadow-indigo-500/30'}
                `}>
                    <button onClick={() => setSelectedCoupon(null)} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white z-20">
                        <X size={24} />
                    </button>

                    {/* HOLOGRAPHIC HEADER */}
                    <div className={`p-6 text-center border-b-2 relative overflow-hidden ${modalState === 'ACTIVE' ? 'bg-green-900/30 border-green-500/30' : 'bg-indigo-900/30 border-indigo-500/30'}`}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white text-shadow-glow">
                                {modalState === 'ACTIVE' ? 'AUTHORIZED' : modalState === 'REDEEMED' ? 'ARCHIVED' : 'SUPPLY DROP'}
                            </h2>
                            <p className="text-xs font-mono font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                ID: {selectedCoupon.id.slice(-6)}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 text-center">
                        <div className="text-8xl mb-6 filter drop-shadow-lg animate-float">
                            {getEmoji(selectedCoupon.name)}
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">{selectedCoupon.name}</h3>
                        
                        {/* STATE: PREVIEW */}
                        {modalState === 'PREVIEW' && (
                            <div className="space-y-6">
                                <p className="text-indigo-200 font-bold text-sm bg-indigo-900/40 p-4 rounded-xl border border-indigo-500/30">
                                    Show this screen to your Commander (Parent) when ready to redeem.
                                </p>
                                <Button onClick={handleActivate} className="w-full h-16 text-xl bg-indigo-600 hover:bg-indigo-500 border-indigo-800 shadow-indigo-500/30 animate-pulse">
                                    ACTIVATE COUPON
                                </Button>
                            </div>
                        )}

                        {/* STATE: ACTIVE */}
                        {modalState === 'ACTIVE' && (
                            <div className="space-y-6">
                                <div className="bg-black/50 p-4 rounded-xl border-2 border-green-500/50 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 blur-sm animate-scan-down"></div>
                                    <div className="flex justify-center mb-4 opacity-80">
                                        <QrCode size={120} className="text-green-400" />
                                    </div>
                                    <div className="text-3xl font-mono font-black text-green-400 animate-pulse">
                                        {timer}
                                    </div>
                                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">
                                        Active Session
                                    </p>
                                </div>
                                <p className="text-slate-400 text-xs font-bold">
                                    Parent: Tap below to confirm redemption.
                                </p>
                                <Button onClick={handleFinish} className="w-full h-14 bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300">
                                    Mark as Redeemed
                                </Button>
                            </div>
                        )}

                        {/* STATE: REDEEMED */}
                        {modalState === 'REDEEMED' && (
                            <div className="space-y-6">
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={32} className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 font-bold text-sm">
                                        This coupon has been used.
                                    </p>
                                </div>
                                <Button onClick={() => setSelectedCoupon(null)} className="w-full h-14 bg-slate-700 hover:bg-slate-600 border-slate-800 text-white">
                                    Close
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        <style>{`
            .text-shadow-glow { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
            @keyframes scan-down {
                0% { top: 0%; }
                100% { top: 100%; }
            }
            .animate-scan-down { animation: scan-down 2s linear infinite; }
            .animate-pulse-slow { animation: pulse 3s infinite; }
        `}</style>
    </div>
  );
};
