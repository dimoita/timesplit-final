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
import { ToastSystem, ToastMessage, ToastType } from './components/ui/ToastSystem';

// Definimos os tipos aqui dentro para evitar buscar em arquivos externos que podem estar travados
interface Profile {
  id: string;
  name: string;
}

export default function App() {
  const [view, setView] = useState<'LANDING' | 'LOGIN'>('LANDING');
  const [user, setUser] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutBump, setCheckoutBump] = useState<'KIT' | 'INSURANCE' | null>(null);
  const [tempChildName, setTempChildName] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sistema de Notificação Simples
  const addToast = (message: string, type: ToastType = 'INFO') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // Verifica Login (Apenas para saber se usuário existe)
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

  // Quando o Quiz termina -> Abre o Checkout
  const handleQuizComplete = (data: { name: string; painPoint: string; goal: string }) => {
      setTempChildName(data.name);
      localStorage.setItem('ts_lead_data', JSON.stringify(data));
      setShowQuiz(false);
      
      // Pequeno delay para garantir a transição
      setTimeout(() => {
          setCheckoutBump(null);
          setShowCheckout(true);
      }, 300);
  };

  // RENDERIZAÇÃO SIMPLIFICADA (SEM JOGO)
  
  if (view === 'LOGIN') {
      return (
        <LoginPage 
            onLoginSuccess={() => {
                // Se logar, por enquanto mandamos para a Landing com um aviso,
                // pois o Dashboard está desligado para manutenção.
                setView('LANDING');
                addToast("Login realizado! O acesso ao jogo será liberado em breve.", "SUCCESS");
            }} 
            onBack={() => setView('LANDING')} 
        />
      );
  }

  // VIEW PADRÃO (LANDING PAGE)
  return (
      <>
        <ToastSystem toasts={toasts} removeToast={removeToast} />
        
        <Header onSignInClick={() => setView('LOGIN')} />
        
        {/* Bloco Principal de Vendas */}
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
        
        {/* Funis de Conversão */}
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
