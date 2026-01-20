import React, { useEffect, useState } from 'react';
import { X, Check, Lock, Loader2, CreditCard, KeyRound, CheckCircle2, Clock, AlertCircle, ShieldCheck, Download, Mail, ArrowRight, Save } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface CheckoutBridgeProps {
  isOpen: boolean;
  onClose: () => void;
  childName?: string;
  price: number;
  onUpgrade?: () => void;
  initialBump?: 'KIT' | 'INSURANCE' | null;
}

// --- LINKS REAIS DO SEU PRODUTO (CONFIGURADOS) ---
const LINKS = {
    // Oferta Principal ($37) com Order Bumps ativos
    CORE_OFFER: 'https://pay.hotmart.com/L103952822R?checkoutMode=10', 
    
    // Oferta Secreta ($19) para recuperação
    DOWNSELL_OFFER: 'https://pay.hotmart.com/L103952822R?off=m0rqvkv0&checkoutMode=10', 
};

// Helper de Rastreamento (Pixel)
const trackEvent = (eventName: string, params = {}) => {
    if ((window as any).fbq) {
        (window as any).fbq('track', eventName, params);
    }
};

export const CheckoutBridge: React.FC<CheckoutBridgeProps> = ({ isOpen, onClose, childName = "Future Genius", price, onUpgrade, initialBump }) => {
  const [step, setStep] = useState<'LOADING' | 'SUMMARY'>('LOADING');
  const [view, setView] = useState<'CHECKOUT' | 'DOWNSELL' | 'FREE_SIGNUP' | 'REDEEM'>('CHECKOUT');
  
  const [redeemCode, setRedeemCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // States para o Cadastro Free
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const [errorShake, setErrorShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // States visuais dos Bumps (Apenas visual, pois a seleção real ocorre na Hotmart agora)
  const [isKitAccepted, setIsKitAccepted] = useState(false);
  const [isInsuranceAccepted, setIsInsuranceAccepted] = useState(false);
  const [nudgeActive, setNudgeActive] = useState(false); 
  
  const KIT_PRICE = 14; 
  const INSURANCE_PRICE = 5;
  const DOWNSELL_PRICE = 19;

  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
      if (isOpen) {
          setStep('LOADING');
          setView('CHECKOUT');
          setEmail('');
          setPassword('');
          setSignupError(null);
          
          if (initialBump === 'KIT') setIsKitAccepted(true);
          if (initialBump === 'INSURANCE') setIsInsuranceAccepted(true);

          trackEvent('InitiateCheckout', { value: price, currency: 'USD' });
          setTimeout(() => setStep('SUMMARY'), 1500);
      }
  }, [isOpen, initialBump, price]);

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

  // --- LÓGICA DE ABANDONO (FUNIL DE 3 PASSOS) ---
  const handleAttemptClose = () => {
      if (view === 'CHECKOUT') {
          // Tentativa 1: Oferecer Downsell
          setView('DOWNSELL');
          trackEvent('ViewContent', { content_name: 'Downsell_Triggered' });
      } else if (view === 'DOWNSELL') {
          // Tentativa 2: Oferecer Conta Free
          setView('FREE_SIGNUP');
          trackEvent('Lead', { content_name: 'Free_Offer_Triggered' });
      } else {
          // Tentativa 3: Tchau
          onClose();
      }
  };

  const handleFreeSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) return;
      setIsCreatingAccount(true);
      setSignupError(null);

      try {
          if (!supabase) throw new Error("Connection Error");

          // 1. Criar Usuário
          const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                  data: { name: childName }
              }
          });

          if (error) throw error;

          // 2. Criar Perfil Inicial
          if (data.user) {
             const newProfile = {
                user_id: data.user.id,
                name: childName,
                avatar: 'rocket',
                villain: 'glitch',
                progress: {
                    unlockedLevel: 1,
                    totalStars: 0,
                    coins: 0,
                    mastery: {},
                    consumables: {},
                    upgrades: {},
                    inventory: ['rocket'],
                    equippedItems: { avatar: 'rocket', trail: 'trail_default', theme: 'theme_default' },
                    bounties: [],
                    chronicles: [],
                    pet: { stage: 'EGG', mood: 'IDLE', hunger: 50, evolutionPoints: 0, evolutionLevel: 1 },
                    hq: { unlocked: [], layout: {} },
                    unlockedArtifacts: [],
                    equippedArtifact: null,
                    dailyLevelCount: 0,
                    lastPlayedDate: new Date().toISOString().split('T')[0]
                }
             };

             await supabase.from('player_progress').upsert({
                 user_id: data.user.id,
                 profile_data: [newProfile],
                 updated_at: new Date().toISOString()
             });
          }

          trackEvent('CompleteRegistration');
          onClose(); 

      } catch (err: any) {
          console.error(err);
          setSignupError(err.message || "Error creating account.");
      } finally {
          setIsCreatingAccount(false);
      }
  };

  const handleRedeem = async () => {
      // Validação simples de código VIP
      if (redeemCode === 'VIP2025' || redeemCode === 'FOUNDER') {
          onUpgrade?.();
          onClose();
      } else {
          setErrorShake(true);
          setTimeout(() => setErrorShake(false), 500);
      }
  };

  const handlePaymentClick = (isDownsell = false) => {
      if (!isDownsell && !isKitAccepted && !isInsuranceAccepted && !nudgeActive) {
          // Pequeno empurrão visual se ele não marcou nada
          setNudgeActive(true);
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
          content_ids: isDownsell ? ['basic_downsell'] : ['core']
      });

      const baseUrl = isDownsell ? LINKS.DOWNSELL_OFFER : LINKS.CORE_OFFER;
      
      try {
        const url = new URL(baseUrl);
        
        // Passa o nome da criança para o checkout da Hotmart (personalização)
        if (childName && childName !== "Future Genius") {
            url.searchParams.append('name', childName);
            // Também tenta passar como parâmetro customizado caso configurado
            url.searchParams.append('custom_child_name', childName);
        }
        
        // Redireciona para a Hotmart
        window.location.href = url.toString();
      } catch (e) {
        console.error("Invalid URL configuration");
        setIsRedirecting(false);
      }
  };

  if (!isOpen) return null;

  const total = price + (isKitAccepted ? KIT_PRICE : 0) + (isInsuranceAccepted ? INSURANCE_PRICE : 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/95 backdrop-blur-md animate-in fade-in duration-300 font-nunito">
      
      <div className={`bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative animate-pop-in flex flex-col max-h-[95vh] transition-all duration-300 ${view === 'DOWNSELL' ? 'border-4 border-red-500' : ''}`}>
        
        {/* Header Gradient */}
        <div className={`h-2 bg-gradient-to-r ${view === 'DOWNSELL' ? 'from-red-500 via-orange-500 to-red-500' : 'from-[#4F46E5] via-[#7C3AED] to-[#FF6B35]'}`}></div>

        {/* BOTÃO X (Aciona o Funil de Abandono) */}
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
        ) : view === 'CHECKOUT' ? (
            /* --- TELA 1: OFERTA PRINCIPAL ($37) --- */
            <div className="flex flex-col h-full overflow-hidden">
             
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
                
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl shadow-inner shrink-0 ring-4 ring-indigo-50">
                        🚀
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight">
                            {childName}'s Protocol
                        </h3>
                        <div className="flex flex-col mt-1 gap-1">
                            <p className="text-gray-500 text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} className="text-green-500"/> Lifetime Access
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stack de Preço */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-bold flex items-center gap-2">Core App + Updates</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through font-bold text-xs">$197</span>
                            <span className="text-gray-800 font-black">$37</span>
                        </div>
                    </div>
                    
                    {/* Visualização dos Bumps (Apenas visual aqui, a seleção real é na Hotmart) */}
                    <div onClick={() => setIsKitAccepted(!isKitAccepted)} className={`mt-4 p-3 rounded-xl border-2 cursor-pointer transition-all flex gap-3 items-center ${isKitAccepted ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-gray-200'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isKitAccepted ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-gray-300'}`}>
                            {isKitAccepted && <Check size={14} className="text-white" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900">Add Offline Kit (+$14)</p>
                            <p className="text-[10px] text-gray-500">500+ printable activities.</p>
                        </div>
                    </div>

                    <div onClick={() => setIsInsuranceAccepted(!isInsuranceAccepted)} className={`mt-2 p-3 rounded-xl border-2 cursor-pointer transition-all flex gap-3 items-center ${isInsuranceAccepted ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-200'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isInsuranceAccepted ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'}`}>
                            {isInsuranceAccepted && <Check size={14} className="text-white" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900">Add Data Insurance (+$5)</p>
                            <p className="text-[10px] text-gray-500">Secure cloud backup.</p>
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

                <div className="space-y-4">
                    {/* BOTÃO PRINCIPAL (Vai para Hotmart) */}
                    <button 
                        onClick={() => handlePaymentClick(false)}
                        disabled={isRedirecting}
                        className={`w-full text-lg py-6 shadow-xl bg-[#10B981] hover:bg-[#059669] border-2 border-green-600 rounded-xl font-black text-white uppercase tracking-wide flex items-center justify-center transition-all ${nudgeActive ? 'animate-shake' : 'animate-pulse'}`} 
                    >
                        {isRedirecting ? (
                            <><Loader2 className="animate-spin mr-2" /> Redirecting...</>
                        ) : (
                            <><CreditCard size={18} className="mr-2" strokeWidth={2.5} /> Pay ${total} & Start</>
                        )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <Lock size={10} /> 30-Day Money Back Guarantee
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
        ) : view === 'DOWNSELL' ? (
            /* --- TELA 2: DOWNSELL ($19) --- */
            <div className="p-8 text-center flex flex-col h-full animate-in slide-in-from-bottom duration-300">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <AlertCircle size={40} className="text-red-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-none mb-2">WAIT!</h2>
                <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-6">Is price the problem?</p>
                <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                    We don't want {childName} to miss out. <br/><strong>Downgrade to Basic Plan?</strong>
                </p>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-8 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg uppercase">Save 50%</div>
                    <h4 className="font-black text-slate-900 text-lg">Basic Plan</h4>
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                        <li className="flex items-center gap-1"><Check size={10}/> Game Access</li>
                        <li className="flex items-center gap-1 text-red-400 line-through"><X size={10}/> No Offline Kit</li>
                    </ul>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">$19</span>
                        <span className="text-sm text-gray-400 line-through">$37</span>
                    </div>
                </div>
                <div className="mt-auto space-y-3">
                    <button onClick={() => handlePaymentClick(true)} className="w-full h-14 bg-red-600 hover:bg-red-500 border-2 border-red-700 text-white rounded-xl font-black uppercase shadow-lg animate-pulse">
                        Yes, I want the $19 Deal
                    </button>
                    <button onClick={handleAttemptClose} className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wide">
                        No thanks, I'll risk it
                    </button>
                </div>
            </div>
        ) : view === 'FREE_SIGNUP' ? (
            /* --- TELA 3: CAPTURA FREE --- */
            <div className="p-8 text-center flex flex-col h-full animate-in slide-in-from-bottom duration-300">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Save size={40} className="text-[#4F46E5]" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-none mb-2">Don't lose {childName}'s data!</h2>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed text-sm">
                    You've already completed the diagnosis. Save it now and we'll unlock <strong>Mission 1 for Free</strong>.
                </p>
                <form onSubmit={handleFreeSignup} className="space-y-4 text-left">
                    {signupError && <div className="text-red-500 text-xs font-bold text-center">{signupError}</div>}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-900 focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Create Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-900 focus:border-indigo-500 outline-none" />
                    </div>
                    <button type="submit" disabled={isCreatingAccount} className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-700 text-white rounded-xl font-black uppercase shadow-lg mt-4 flex items-center justify-center">
                        {isCreatingAccount ? <Loader2 className="animate-spin" /> : 'Save Progress & Start Free'}
                    </button>
                </form>
                <button onClick={onClose} className="mt-4 text-[10px] font-bold text-gray-300 hover:text-gray-400 uppercase tracking-wide">
                    Delete Data & Exit
                </button>
            </div>
        ) : (
            /* --- TELA 4: RESGATE DE CÓDIGO (Para quem já comprou) --- */
            <div className="p-8 animate-in slide-in-from-right duration-300">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-slate-700 shadow-xl">
                        <KeyRound size={40} className="text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Access Vault</h3>
                </div>
                <div className={`space-y-6 ${errorShake ? 'animate-shake' : ''}`}>
                    <div className="relative">
                        <input type="text" value={redeemCode} onChange={(e) => setRedeemCode(e.target.value)} placeholder="XXXX-XXXX" className="w-full bg-slate-100 border-4 border-slate-200 rounded-xl p-4 text-center text-2xl font-black text-slate-800 tracking-widest uppercase placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                        {isValidating && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Loader2 className="animate-spin text-indigo-500" /></div>}
                    </div>
                    <button onClick={handleRedeem} disabled={!redeemCode || isValidating} className="w-full text-lg py-6 bg-slate-900 hover:bg-slate-800 border-4 border-slate-950 rounded-xl text-white font-black shadow-xl uppercase">
                        {isValidating ? 'Verifying...' : 'Unlock Full Access'}
                    </button>
                    <button onClick={() => setView('CHECKOUT')} className="w-full text-center text-indigo-600 font-bold text-xs hover:text-indigo-800 transition-colors uppercase tracking-wider">Back to Offer</button>
                </div>
            </div>
        )}
      </div>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } } .animate-shake { animation: shake 0.3s ease-in-out; }`}</style>
    </div>
  );
};
