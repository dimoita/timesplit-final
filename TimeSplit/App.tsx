import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { OnboardingQuiz } from './components/OnboardingQuiz';
import { LoginPage } from './components/LoginPage';
import { CheckoutBridge } from './components/CheckoutBridge';
import { ToastSystem, ToastMessage, ToastType } from './components/ui/ToastSystem';
// NÃO IMPORTAMOS MAIS NADA DA PASTA COMPONENTS PARA EVITAR O ERRO CICLICO

// --- ÍCONES (Lucide) ---
import { Play, Star, Shield, Lock, Menu, X, Rocket, Zap, Brain, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'LANDING' | 'LOGIN'>('LANDING');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [tempChildName, setTempChildName] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Helpers
  const addToast = (message: string, type: ToastType = 'INFO') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // Init Auth
  useEffect(() => {
    if (supabase) {
        supabase.auth.getSession().then(() => {});
        supabase.auth.onAuthStateChange(() => {});
    }
  }, []);

  const handleQuizComplete = (data: { name: string; painPoint: string; goal: string }) => {
      setTempChildName(data.name);
      localStorage.setItem('ts_lead_data', JSON.stringify(data));
      setShowQuiz(false);
      setTimeout(() => setShowCheckout(true), 300);
  };

  // --- VIEW: LOGIN ---
  if (view === 'LOGIN') {
      return <LoginPage onLoginSuccess={() => { setView('LANDING'); addToast("Login Success!", "SUCCESS"); }} onBack={() => setView('LANDING')} />;
  }

  // --- VIEW: LANDING PAGE (RECONSTRUÍDA AQUI DENTRO PARA EVITAR BUGS) ---
  return (
      <div className="font-nunito bg-white text-slate-900 overflow-x-hidden">
        <ToastSystem toasts={toasts} removeToast={removeToast} />
        
        {/* HEADER */}
        <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-40 border-b border-slate-100 h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center text-white font-black text-lg">T</div>
                <span className="font-black text-xl tracking-tight text-slate-900">TIMESPLIT</span>
            </div>
            <button 
                onClick={() => setView('LOGIN')}
                className="text-sm font-bold text-slate-500 hover:text-[#4F46E5] transition-colors"
            >
                JÁ SOU ALUNO
            </button>
        </header>

        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#4F46E5] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
                <Rocket size={14} /> Método Aprovado por Pais
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                Seu filho <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-purple-600">amando matemática</span> em 15 dias.
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
                Pare de brigar na hora do dever de casa. O Timesplit usa gamificação para transformar o celular em uma ferramenta de aprendizado que vicia em estudar.
            </p>
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <button 
                    onClick={() => setShowQuiz(true)}
                    className="w-full h-16 bg-[#10B981] hover:bg-green-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-200 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    COMEÇAR AGORA <Play fill="currentColor" />
                </button>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Teste Grátis de Perfil • Sem Compromisso</p>
            </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="bg-slate-50 py-12 border-y border-slate-200">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-4">
                    <div className="text-4xl font-black text-[#4F46E5] mb-2">15 min</div>
                    <p className="font-bold text-slate-600">Tempo diário necessário</p>
                </div>
                <div className="p-4">
                    <div className="text-4xl font-black text-[#4F46E5] mb-2">30 dias</div>
                    <p className="font-bold text-slate-600">Para ver resultados reais</p>
                </div>
                <div className="p-4">
                    <div className="text-4xl font-black text-[#4F46E5] mb-2">100%</div>
                    <p className="font-bold text-slate-600">Seguro e sem anúncios</p>
                </div>
            </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Por que o método tradicional falha?</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 p-8 rounded-3xl border-2 border-red-100">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-3xl mb-4">🥱</div>
                    <h3 className="text-xl font-black text-red-900 mb-2">É chato e repetitivo</h3>
                    <p className="text-red-700/80 font-medium">Decorar tabuada com papel e caneta não funciona para a geração digital.</p>
                </div>
                <div className="bg-indigo-50 p-8 rounded-3xl border-2 border-indigo-100">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl mb-4">🎮</div>
                    <h3 className="text-xl font-black text-indigo-900 mb-2">O Timesplit é Jogo</h3>
                    <p className="text-indigo-700/80 font-medium">Usamos dopamina, recompensas e rankings para fazer a criança *querer* passar de fase.</p>
                </div>
            </div>
        </section>

        {/* STICKY CTA MOBILE */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-30 md:hidden">
            <button 
                onClick={() => setShowQuiz(true)}
                className="w-full h-14 bg-[#4F46E5] hover:bg-indigo-600 text-white rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2"
            >
                QUERO MEU FILHO CAMPEÃO
            </button>
        </div>

        <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm font-bold pb-32 md:pb-12">
            <p>© 2025 Timesplit Education. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-4">
                <span>Terms</span> • <span>Privacy</span> • <span>Support</span>
            </div>
        </footer>

        {/* FUNIS */}
        <OnboardingQuiz 
            isOpen={showQuiz} 
            onClose={() => setShowQuiz(false)} 
            onComplete={handleQuizComplete} 
        />
        
        <CheckoutBridge 
            isOpen={showCheckout} 
            onClose={() => setShowCheckout(false)} 
            price={37} 
            childName={tempChildName || "Future Genius"} 
        />
      </div>
  );
}
