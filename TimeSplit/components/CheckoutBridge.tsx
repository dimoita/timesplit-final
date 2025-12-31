
import React, { useEffect, useState } from 'react';
import { X, Check, Lock, Loader2, CreditCard, KeyRound, CheckCircle2, Clock, AlertCircle, ShieldCheck, Download, Zap, ArrowRight, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabaseClient';

interface CheckoutBridgeProps {
  isOpen: boolean;
  onClose: () => void;
  childName?: string;
  price: number;
  onUpgrade?: () => void;
  initialBump?: 'KIT' | 'INSURANCE' | null;
}

// --- LINKS DE PAGAMENTO (SUBSTITUA PELOS REAIS) ---
const LINKS = {
    CORE_OFFER: 'https://pay.hotmart.com/SEU_CODIGO_CORE?checkoutMode=10', // $37
    DOWNSELL_OFFER: 'https://pay.hotmart.com/SEU_CODIGO_BASIC?checkoutMode=10', // $19 (Só o App, sem bônus)
    OFFLINE_KIT: '&off=SEU_CODIGO_OFFLINE', // Bump $14
    INSURANCE: '&off=SEU_CODIGO_INSURANCE', // Bump $5
};

// Helper de Rastreamento
const trackEvent = (eventName: string, params = {}) => {
    if ((window as any).fbq) {
        (window as any).fbq('track', eventName, params);
    }
};

export const CheckoutBridge: React.FC<CheckoutBridgeProps> = ({ isOpen, onClose, childName = "Future Genius", price, onUpgrade, initialBump }) => {
  const [step, setStep] = useState<'LOADING' | 'SUMMARY'>('LOADING');
  const [view, setView] = useState<'CHECKOUT' | 'DOWNSELL' | 'REDEEM'>('CHECKOUT');
  const [redeemCode, setRedeemCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // --- BUMP STATES ---
  const [isKitAccepted, setIsKitAccepted] = useState(false);
  const [isInsuranceAccepted, setIsInsuranceAccepted] = useState(false);
  const [nudgeActive, setNudgeActive] = useState(false); // Para animação de "tremida"
  
  const KIT_PRICE = 14; 
  const INSURANCE_PRICE = 5;
  const DOWNSELL_PRICE = 19;

  // --- TIMER ---
  const [timeLeft, setTimeLeft] = useState(600);

  // Load persistence logic
  useEffect(() => {
      if (isOpen) {
          // Recover bump state from localStorage if available
          const savedKit = localStorage.getItem('ts_bump_kit');
          const savedIns = localStorage.getItem('ts_bump_ins');
          
          if (initialBump === 'KIT') setIsKitAccepted(true);
          else if (savedKit === 'true') setIsKitAccepted(true);
          
          if (initialBump === 'INSURANCE') setIsInsuranceAccepted(true);
          else if (savedIns === 'true') setIsInsuranceAccepted(true);

          setStep('LOADING');
          setView('CHECKOUT');
          setRedeemCode('');
          setErrorMsg(null);
          setIsRedirecting(false);
          
          trackEvent('InitiateCheckout', { value: price, currency: 'USD' });

          setTimeout(() => setStep('SUMMARY'), 1500);
      }
  }, [isOpen, initialBump, price]);

  // Save persistence logic
  useEffect(() => {
      localStorage.setItem('ts_bump_kit', String(isKitAccepted));
      localStorage.setItem('ts_bump_ins', String(isInsuranceAccepted));
  }, [isKitAccepted, isInsuranceAccepted]);

  // Timer Tick
  useEffect(() => {
      if (step === 'SUMMARY' && timeLeft > 0) {
          const interval = setInterval(() => setTimeLeft(p => p - 1), 1000);
          return () => clearInterval(interval);
      }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- EXIT INTENT LOGIC ---
  const handleAttemptClose = () => {
      if (view === 'CHECKOUT') {
          // Don't close, switch to Downsell
          setView('DOWNSELL');
          trackEvent('ViewContent', { content_name: 'Downsell_Triggered' });
      } else {
          // Really close
          onClose();
      }
  };

  const handleRedeem = async () => {
      if (!redeemCode) return;
      setIsValidating(true);
      try {
          if (!supabase) throw new Error("Connection error");
          const { data, error } = await supabase.rpc('redeem_license', { code_input: redeemCode.trim() });
          if (error) throw error;
          if (data === true) {
              setIsValidating(false);
              if (onUpgrade) onUpgrade();
          } else {
              throw new Error("Invalid Code");
          }
      } catch (err) {
          setIsValidating(false);
          setErrorShake(true);
          setErrorMsg("Código inválido.");
          setTimeout(() => setErrorShake(false), 500);
      }
  };

  const handlePaymentClick = (isDownsell = false) => {
      // ACTIVE NUDGE LOGIC (Only on main checkout)
      if (!isDownsell && !isKitAccepted && !isInsuranceAccepted && !nudgeActive) {
          setNudgeActive(true);
          // Pequeno delay para o usuário ver o alerta visual antes de prosseguir
          setTimeout(() => {
              proceedPayment(false);
              setNudgeActive(false);
          }, 800);
          return;
      }
      proceedPayment(isDownsell);
  };

  const proceedPayment = async (isDownsell: boolean) => {
      setIsRedirecting(true);
      const finalValue = isDownsell ? DOWNSELL_PRICE : (price + (isKitAccepted ? KIT_PRICE : 0) + (isInsuranceAccepted ? INSURANCE_PRICE : 0));
      
      trackEvent('AddPaymentInfo', { 
          value: finalValue, 
          currency: 'USD',
          content_ids: isDownsell ? ['basic_downsell'] : ['core', ...(isKitAccepted?['kit']:[]), ...(isInsuranceAccepted?['ins']: [])]
      });

      let userEmail = '';
      let userName = '';
      if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
              userEmail = user.email || '';
              userName = user.user_metadata?.name || '';
          }
      }

      const baseUrl = isDownsell ? LINKS.DOWNSELL_OFFER : LINKS.CORE_OFFER;
      const url = new URL(baseUrl);
      url.searchParams.append('src', isDownsell ? 'downsell_popup' : 'checkout_bridge');
      if (userEmail) url.searchParams.append('email', userEmail);
      if (userName) url.searchParams.append('name', userName);
      if (childName) url.searchParams.append('custom_child_name', childName);
      
      // Add bumps if not downsell
      if (!isDownsell) {
          // Note: Real implementation depends on Hotmart URL structure for bumps
          if (isKitAccepted) url.searchParams.append('bump1', 'true'); 
          if (isInsuranceAccepted) url.searchParams.append('bump2', 'true');
      }

      window.location.href = url.toString();
  };

  if (!isOpen) return null;

  const total = price + (isKitAccepted ? KIT_PRICE : 0) + (isInsuranceAccepted ? INSURANCE_PRICE : 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className={`bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative animate-pop-in flex flex-col max-h-[95vh] transition-all duration-300 ${view === 'DOWNSELL' ? 'border-4 border-red-500' : ''}`}>
        
        {/* Header Gradient */}
        <div className={`h-2 bg-gradient-to-r ${view === 'DOWNSELL' ? 'from-red-500 via-orange-500 to-red-500' : 'from-[#4F46E5] via-[#7C3AED] to-[#FF6B35]'}`}></div>

        <button 
            onClick={handleAttemptClose} 
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-20"
        >
            <X size={20} />
        </button>

        {step === 'LOADING' ? (
          <div className="p-12 text-center">
             <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping"></div>
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">Personalizing Offer...</h3>
             <div className="space-y-2 text-sm font-bold text-gray-400">
                <p className="animate-pulse">Applying Founder's Discount...</p>
                <p className="animate-pulse delay-100">Syncing {childName}'s Progress...</p>
             </div>
          </div>
        ) : view === 'DOWNSELL' ? (
            /* --- DOWNSELL VIEW (EXIT INTENT) --- */
            <div className="p-8 text-center flex flex-col h-full animate-in slide-in-from-bottom duration-300">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <AlertCircle size={40} className="text-red-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-none mb-2">WAIT!</h2>
                <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-6">Is price the problem?</p>
                
                <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                    We don't want {childName} to miss out on mastering math. <br/>
                    <strong>Downgrade to the Basic Plan?</strong>
                </p>

                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-8 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg uppercase">
                        Save 50%
                    </div>
                    <h4 className="font-black text-slate-900 text-lg">Basic Plan</h4>
                    <ul className="space-y-2 mt-2 text-sm text-slate-500 font-medium">
                        <li className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Core Math Game</li>
                        <li className="flex items-center gap-2 text-gray-400 line-through"><X size={14}/> No Printable Kit</li>
                        <li className="flex items-center gap-2 text-gray-400 line-through"><X size={14}/> No Parent Dashboard</li>
                    </ul>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">$19</span>
                        <span className="text-sm text-gray-400 line-through">$37</span>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    <Button onClick={() => handlePaymentClick(true)} className="w-full h-14 bg-red-600 hover:bg-red-500 border-red-800 text-white shadow-lg animate-pulse">
                        Accept Basic Plan ($19)
                    </Button>
                    <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wide">
                        No thanks, I'll pass on math help
                    </button>
                </div>
            </div>
        ) : view === 'CHECKOUT' ? (
            /* --- MAIN CHECKOUT VIEW --- */
            <div className="flex flex-col h-full overflow-hidden">
             
             {/* URGENCY HEADER STRIP */}
             <div className="bg-red-50 border-b border-red-100 p-3 flex items-center justify-between gap-2 text-xs font-bold text-red-700 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Offer Reserved</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-red-200 shadow-sm font-mono">
                    <Clock size={12} /> {formatTime(timeLeft)}
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
                        <AlertCircle size={16} /> {errorMsg}
                    </div>
                )}

                {/* Product Summary */}
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl shadow-inner shrink-0 ring-4 ring-indigo-50">
                        🚀
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight">
                            {childName !== "Future Genius" ? `${childName}'s Protocol` : "Math Rescue Bundle"}
                        </h3>
                        <div className="flex flex-col mt-1 gap-1">
                            <p className="text-gray-500 text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} className="text-green-500"/> Lifetime Access
                            </p>
                        </div>
                    </div>
                </div>

                {/* The Stack */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-bold flex items-center gap-2">
                            Core App + Updates
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through font-bold text-xs">$197</span>
                            <span className="text-gray-800 font-black">$37</span>
                        </div>
                    </div>
                    
                    {/* --- BUMP 1: OFFLINE KIT (VISUAL UPGRADE) --- */}
                    <div 
                        onClick={() => setIsKitAccepted(!isKitAccepted)}
                        className={`mt-6 p-3 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden group
                            ${isKitAccepted 
                                ? 'bg-indigo-50/50 border-indigo-500 shadow-md ring-1 ring-indigo-200' 
                                : 'bg-white border-gray-200 hover:border-indigo-300'}
                            ${nudgeActive && !isKitAccepted ? 'animate-shake border-red-400 bg-red-50' : ''}
                        `}
                    >
                        {isKitAccepted && (
                            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg shadow-sm">
                                INCLUDED
                            </div>
                        )}
                        {/* Nudge Tooltip */}
                        {nudgeActive && !isKitAccepted && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-20 whitespace-nowrap animate-bounce">
                                Recommended for Rainy Days!
                            </div>
                        )}

                        <div className="flex gap-3">
                            {/* Visual Thumbnail */}
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center shrink-0 border-2 transition-colors ${isKitAccepted ? 'bg-indigo-100 border-indigo-200' : 'bg-gray-100 border-gray-200'}`}>
                                <Download className={`${isKitAccepted ? 'text-indigo-500' : 'text-gray-400'}`} size={24} />
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-black text-gray-900 text-sm leading-tight">Offline Emergency Kit</h4>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 line-through font-bold">$47</div>
                                        <div className="text-sm font-black text-red-600">${KIT_PRICE}</div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-tight mt-1">
                                    500+ printable activities. Avoid screen-time battles.
                                </p>
                                <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-black uppercase tracking-wider ${isKitAccepted ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isKitAccepted ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                        {isKitAccepted && <Check size={10} className="text-white" strokeWidth={4} />}
                                    </div>
                                    {isKitAccepted ? 'Yes, Add to Order' : 'Click to Add'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BUMP 2: INSURANCE --- */}
                    <div 
                        onClick={() => setIsInsuranceAccepted(!isInsuranceAccepted)}
                        className={`mt-2 p-3 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden group
                            ${isInsuranceAccepted 
                                ? 'bg-emerald-50/50 border-emerald-500 shadow-md ring-1 ring-emerald-200' 
                                : 'bg-white border-gray-200 hover:border-emerald-300'}
                        `}
                    >
                        <div className="flex gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border-2 transition-colors ${isInsuranceAccepted ? 'bg-emerald-100 border-emerald-200' : 'bg-gray-100 border-gray-200'}`}>
                                <ShieldCheck className={`${isInsuranceAccepted ? 'text-emerald-600' : 'text-gray-400'}`} size={20} />
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-black text-gray-900 text-sm leading-tight">Data Insurance</h4>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-emerald-600">${INSURANCE_PRICE}</div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-tight mt-1 max-w-[200px]">
                                    Forever cloud backup. Accidental deletion protection.
                                </p>
                                <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-black uppercase tracking-wider ${isInsuranceAccepted ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    <div className={`w-3 h-3 rounded border flex items-center justify-center ${isInsuranceAccepted ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'}`}>
                                        {isInsuranceAccepted && <Check size={8} className="text-white" strokeWidth={4} />}
                                    </div>
                                    {isInsuranceAccepted ? 'Protected' : 'Add Protection'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-2 pt-4 flex justify-between items-end">
                        <span className="text-gray-900 font-black uppercase text-xs tracking-wider">Total Due Today</span>
                        <div className="text-right flex items-center gap-2">
                            <span className="text-gray-400 line-through text-xs font-bold">
                                ${244 + (isKitAccepted ? 47 : 0) + (isInsuranceAccepted ? 19 : 0)}
                            </span>
                            <span className="text-[#4F46E5] font-black text-4xl">${total}</span>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="space-y-4">
                    <Button 
                        className={`w-full text-lg py-6 shadow-xl bg-[#4CAF50] hover:bg-[#43A047] border-green-700 flex items-center justify-center ${nudgeActive ? 'animate-shake' : 'animate-pulse'}`} 
                        onClick={() => handlePaymentClick(false)}
                        disabled={isRedirecting}
                    >
                        {isRedirecting ? (
                            <><Loader2 className="animate-spin mr-2" /> Redirecting...</>
                        ) : (
                            <><CreditCard size={18} className="mr-2" strokeWidth={2.5} /> Pay ${total} & Get Access</>
                        )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <Lock size={10} /> 256-Bit SSL Encrypted • 30-Day Guarantee
                    </div>

                    <div className="text-center pt-2 border-t border-gray-100 mt-4">
                        <button 
                            onClick={() => setView('REDEEM')}
                            className="text-gray-400 font-bold text-[10px] hover:text-indigo-500 transition-colors uppercase tracking-wider flex items-center justify-center gap-1 mx-auto"
                        >
                            <KeyRound size={10} /> Have a Code?
                        </button>
                    </div>
                </div>
             </div>
            </div>
        ) : (
            /* --- REDEEM VIEW --- */
            <div className="p-8 animate-in slide-in-from-right duration-300">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-slate-700 shadow-xl">
                        <KeyRound size={40} className="text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Access Vault</h3>
                    <p className="text-gray-500 font-bold text-sm">Enter your Founding Member code.</p>
                </div>

                <div className={`space-y-6 ${errorShake ? 'animate-shake' : ''}`}>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={redeemCode}
                            onChange={(e) => setRedeemCode(e.target.value)}
                            placeholder="XXXX-XXXX"
                            className="w-full bg-slate-100 border-4 border-slate-200 rounded-xl p-4 text-center text-2xl font-black text-slate-800 tracking-widest uppercase placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                            autoFocus
                        />
                        {isValidating && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 className="animate-spin text-indigo-500" />
                            </div>
                        )}
                    </div>

                    <Button 
                        onClick={handleRedeem}
                        disabled={!redeemCode || isValidating}
                        className="w-full text-lg py-6 bg-slate-900 hover:bg-slate-800 border-slate-950 text-white shadow-xl"
                    >
                        {isValidating ? 'Verifying...' : 'Unlock Full Access'}
                    </Button>

                    <button 
                        onClick={() => setView('CHECKOUT')}
                        className="w-full text-center text-indigo-600 font-bold text-xs hover:text-indigo-800 transition-colors uppercase tracking-wider"
                    >
                        Back to Offer
                    </button>
                </div>
            </div>
        )}

      </div>
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};
