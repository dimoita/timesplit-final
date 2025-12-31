
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Check, Clock, ArrowRight, Loader2, Lock, Star } from 'lucide-react';
import { Button } from './ui/Button';

// SUBSTITUA ISSO PELO LINK DO SEU PRODUTO DE $17 NA HOTMART
const HOTMART_FAMILY_UPSELL_LINK = "https://pay.hotmart.com/SEU_CODIGO_DO_UPSELL";

interface OneTimeOfferProps {
  onAccept?: () => void;
  onDecline: () => void;
}

export const OneTimeOffer: React.FC<OneTimeOfferProps> = ({ onAccept, onDecline }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAccept = () => {
    setIsProcessing(true);
    // Direct link to the $17 offer
    window.location.href = HOTMART_FAMILY_UPSELL_LINK;
    if (onAccept) setTimeout(onAccept, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300 font-nunito">
      
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gray-800">
        <div className="h-full bg-green-500 w-[90%] shadow-[0_0_10px_#22c55e] animate-pulse"></div>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl relative animate-scale-up">
        
        {/* Header Alert */}
        <div className="bg-red-600 p-3 text-center text-white flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs sm:text-sm animate-pulse">
           <Clock size={16} /> Locked Feature: Family Mode
        </div>

        <div className="p-6 md:p-10">
           {/* Social Proof */}
           <div className="flex justify-center gap-1 mb-4">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
           </div>

           <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 leading-tight">Unlock Unlimited Profiles</h2>
              <p className="text-gray-500 font-bold text-base md:text-lg">
                 Add siblings. Separate progress. Restore peace.
              </p>
           </div>

           <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-6 mb-8 relative overflow-hidden flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-indigo-100 shrink-0 shadow-lg">
                    <Users size={32} className="text-indigo-600" />
                 </div>
                 <div className="text-left">
                    <h3 className="text-lg font-black text-gray-900 leading-tight">Family License</h3>
                    <p className="text-gray-500 text-xs font-bold">One-time upgrade.</p>
                 </div>
              </div>
              
              {/* THE PRICE ANCHOR */}
              <div className="text-right">
                  <div className="text-gray-400 font-bold line-through text-lg">$97.00</div>
                  <div className="text-5xl md:text-6xl font-black text-green-600 tracking-tighter text-shadow-glow-green">$17</div>
              </div>
           </div>

           <div className="flex flex-col items-center gap-4">
              <Button 
                onClick={handleAccept}
                disabled={isProcessing}
                className="w-full h-24 text-xl md:text-2xl bg-[#4CAF50] hover:bg-[#43A047] border-green-700 shadow-xl shadow-green-500/30 animate-bounce-gentle flex flex-col items-center justify-center leading-tight rounded-2xl"
              >
                 {isProcessing ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="animate-spin" /> Upgrading...
                    </div>
                 ) : (
                    <>
                       <span className="flex items-center gap-2 font-black">YES, ADD ALL MY KIDS <ArrowRight strokeWidth={4} /></span>
                       <span className="text-sm font-bold opacity-90 uppercase tracking-widest text-green-100 bg-green-700/30 px-4 py-1 rounded-full mt-1">Instant Activation</span>
                    </>
                 )}
              </Button>

              <button 
                onClick={onDecline}
                disabled={isProcessing}
                className="text-gray-400 font-bold text-xs hover:text-red-500 hover:underline mt-2 text-center max-w-sm leading-relaxed uppercase tracking-wide"
              >
                 No thanks, I will stick to 1 child profile. <br/>I understand this discount expires now.
              </button>
           </div>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
           <Lock size={10} /> Secure 256-Bit SSL Encryption
        </div>

      </div>
      
      <style>{`
        .text-shadow-glow-green { text-shadow: 0 0 20px rgba(34, 197, 94, 0.4); }
        @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        .animate-bounce-gentle {
            animation: bounce-gentle 2s infinite;
        }
      `}</style>
    </div>
  );
};
