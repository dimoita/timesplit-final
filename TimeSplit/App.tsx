import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MicroDojo } from './components/MicroDojo';
import { Problem } from './components/Problem';
import { WhyChoose } from './components/WhyChoose';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { CTA } from './components/CTA';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { FAQ } from './components/FAQ';
import { StickyCTA } from './components/StickyCTA';
import { OnboardingQuiz } from './components/OnboardingQuiz';
import { LoginPage } from './components/LoginPage';
import { CheckoutBridge } from './components/CheckoutBridge';
import { ProfileSelector } from './components/ProfileSelector';
import { PurchaseSuccessOverlay } from './components/PurchaseSuccessOverlay';
import { AlgebraExpansionModal } from './components/upsell/LogicExpansionModal';
import { ToastSystem, ToastMessage, ToastType } from './components/ui/ToastSystem';

// Importação segura dos tipos
import { Profile, PetState, HQState, Chronicle, ChronoEvent, Bounty, MasteryMap } from './types';

export default function App() {
  // Simplificamos as Views para focar no fluxo de Vendas
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'PROFILES' | 'DASHBOARD'>('LANDING');
  
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAlgebraModal, setShowAlgebraModal] = useState(false);
  const [checkoutBump, setCheckoutBump] = useState<'KIT' | 'INSURANCE' | null>(null);
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
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }
  }, []);

  // Handlers
  const handleQuizComplete = (data: { name: string; painPoint: string; goal: string }) => {
      setTempChildName(data.name);
      localStorage.setItem('ts_lead_data', JSON.stringify(data));
      setShowQuiz(false);
      setTimeout(() => {
          setCheckoutBump(null);
          setShowCheckout(true);
      }, 300);
  };

  const handleProfileSelect = (id: string) => {
      setCurrentProfileId(id);
      setView('DASHBOARD');
  };

  // --- RENDERIZAÇÃO SEGURA ---

  if (view === 'LOGIN') {
      return <LoginPage onLoginSuccess={() => setView('PROFILES')} onBack={() => setView('LANDING')} />;
  }

  if (view === 'PROFILES') {
      return <ProfileSelector profiles={profiles} onSelect={handleProfileSelect} onAddNew={() => {}} isPremium={isPremium} isFamilyPlan={false} />;
  }

  // Dashboard Temporário (Placeholder para testar se o login funciona)
  if (view === 'DASHBOARD') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white flex-col gap-4">
            <h1 className="text-3xl font-bold">Acesso Liberado! 🚀</h1>
            <p>O Login funcionou. Agora podemos religar o jogo.</p>
            <button onClick={() => setView('LANDING')} className="px-4 py-2 bg-red-500 rounded">Sair</button>
        </div>
      );
  }

  // VIEW 'LANDING' (O Principal)
  return (
      <>
        <ToastSystem toasts={toasts} removeToast={removeToast} />
        
        <Header onSignInClick={() => setView('LOGIN')} />
        <Hero onStartQuiz={() => setShowQuiz(true)} />
        <MicroDojo />
        <Problem />
        <HowItWorks />
        <WhyChoose />
        <Testimonials />
        <Pricing onCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }} />
        <FAQ />
        <Footer />
        <StickyCTA onStartQuiz={() => setShowQuiz(true)} />
        
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
            initialBump={checkoutBump} 
        />
      </>
  );
}
