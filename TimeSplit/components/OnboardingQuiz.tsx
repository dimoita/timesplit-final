import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Brain, Calculator, Frown, Zap, Trophy, Heart, ArrowRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface OnboardingQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { name: string; painPoint: string; goal: string }) => void;
}

export const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0); // 0: Name, 1: Pain, 2: Goal, 3: Commitment, 4: Analyzing, 5: Result
  const [name, setName] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [goal, setGoal] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- SISTEMA DE SOM (Pop Suave) ---
  const playSound = (type: 'POP' | 'VICTORY') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'POP') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        // Victory Chord
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const oscV = ctx.createOscillator();
            const gainV = ctx.createGain();
            oscV.type = 'sine';
            oscV.frequency.value = freq;
            gainV.gain.setValueAtTime(0, now + i*0.1);
            gainV.gain.linearRampToValueAtTime(0.1, now + i*0.1 + 0.05);
            gainV.gain.exponentialRampToValueAtTime(0.001, now + i*0.1 + 0.5);
            oscV.connect(gainV);
            gainV.connect(ctx.destination);
            oscV.start(now + i*0.1);
            oscV.stop(now + i*0.1 + 0.6);
        });
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
    } catch (e) {}
  };

  // --- CONFETES ---
  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: any[] = [];
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2, y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4, life: 100
        });
    }
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            if (p.life > 0) {
                active = true;
                p.x += p.vx; p.y += p.vy; p.vy += 0.5; p.life -= 1; p.size *= 0.96;
                ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size);
            }
        });
        if (active) requestAnimationFrame(animate);
    };
    animate();
  };

  // --- LÓGICA DE TRANSIÇÃO ---
  const handleNext = () => {
    playSound('POP');
    if (step === 3) {
        // Entra no modo "Analisando" antes de mostrar o resultado
        setStep(4); 
    } else {
        setStep(step + 1);
    }
  };

  // Efeito de "Analisando..."
  useEffect(() => {
      if (step === 4) {
          setIsAnalyzing(true);
          // Simula 3 segundos de processamento
          setTimeout(() => {
              setIsAnalyzing(false);
              setStep(5); // Vai para o resultado final
              playSound('VICTORY');
              fireConfetti();
          }, 2500);
      }
  }, [step]);

  // Fecha o quiz e manda dados para o App abrir o Checkout
  const handleFinalAction = () => {
      playSound('POP');
      onComplete({ name, painPoint, goal });
  };

  if (!isOpen) return null;

  return (
    // Z-INDEX 100 GARANTE QUE CUBRA TUDO
    <div className="fixed inset-0 z-[100] bg-white font-nunito animate-in fade-in duration-300 flex flex-col">
      
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[110]" />

      {/* HEADER: PROGRESS BAR & CLOSE */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between shrink-0 bg-white z-20">
        {step < 5 && (
            <div className="flex gap-1.5 w-full max-w-[200px]">
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 flex-1 ${i <= step ? 'bg-[#4F46E5]' : 'bg-gray-100'}`} />
                ))}
            </div>
        )}
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900 p-2 ml-auto">
            <X size={24} />
        </button>
      </div>

      {/* BODY: CONVERSATIONAL CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-center max-w-lg mx-auto w-full">
        
        {/* --- STEP 0: NOME (IDENTIDADE) --- */}
        {step === 0 && (
            <div className="animate-in slide-in-from-right duration-500">
                <span className="text-[#4F46E5] font-black tracking-widest uppercase text-xs mb-2 block">Step 1: Identity</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
                    Let's unlock your child's potential. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-purple-600">What is their name?</span>
                </h2>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-3xl font-bold border-b-4 border-gray-200 focus:border-[#4F46E5] outline-none py-4 bg-transparent placeholder-gray-300 transition-colors text-slate-800"
                    placeholder="Type name here..."
                    autoFocus
                />
            </div>
        )}

        {/* --- STEP 1: A DOR (AGITAÇÃO) --- */}
        {step === 1 && (
            <div className="animate-in slide-in-from-right duration-500">
                <span className="text-orange-500 font-black tracking-widest uppercase text-xs mb-2 block">Step 2: Diagnosis</span>
                <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">What holds {name} back the most?</h2>
                <p className="text-gray-500 mb-8 font-medium">Be honest. We need to know where to start.</p>
                
                <div className="space-y-3">
                    {[
                        { id: 'fingers', label: 'Still counts on fingers', icon: '🖐️' },
                        { id: 'anxiety', label: 'Gets anxious / Cries', icon: '😢' },
                        { id: 'slow', label: 'Too slow / Loses focus', icon: '🐢' },
                        { id: 'boring', label: 'Thinks math is boring', icon: '😴' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => { setPainPoint(opt.id); handleNext(); }}
                            className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all text-left transform active:scale-95
                                ${painPoint === opt.id 
                                    ? 'border-[#4F46E5] bg-indigo-50 shadow-md ring-2 ring-indigo-100' 
                                    : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'}
                            `}
                        >
                            <span className="text-2xl">{opt.icon}</span>
                            <span className={`text-lg font-bold ${painPoint === opt.id ? 'text-[#4F46E5]' : 'text-slate-700'}`}>{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* --- STEP 2: O SONHO (FUTURO) --- */}
        {step === 2 && (
            <div className="animate-in slide-in-from-right duration-500">
                <span className="text-purple-500 font-black tracking-widest uppercase text-xs mb-2 block">Step 3: The Goal</span>
                <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">Imagine {name} in 30 days... What is the biggest win?</h2>
                
                <div className="space-y-3">
                    {[
                        { id: 'speed', label: 'Instant Mental Math', icon: '⚡' },
                        { id: 'confidence', label: 'Confidence in Class', icon: '🏆' },
                        { id: 'love', label: 'Loving to Learn', icon: '❤️' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => { setGoal(opt.id); handleNext(); }}
                            className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all text-left transform active:scale-95
                                ${goal === opt.id 
                                    ? 'border-[#4F46E5] bg-indigo-50 shadow-md ring-2 ring-indigo-100' 
                                    : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'}
                            `}
                        >
                            <span className="text-2xl">{opt.icon}</span>
                            <span className={`text-lg font-bold ${goal === opt.id ? 'text-[#4F46E5]' : 'text-slate-700'}`}>{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* --- STEP 3: O COMPROMISSO (A PEGADINHA DO BEM) --- */}
        {step === 3 && (
            <div className="animate-in slide-in-from-right duration-500">
                <span className="text-red-500 font-black tracking-widest uppercase text-xs mb-2 block">Step 4: Commitment</span>
                <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">Final Check.</h2>
                
                <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl mb-8">
                    <p className="text-slate-700 font-medium text-lg leading-relaxed">
                        The Timesplit Method is fast, but it requires consistency. <br/><br/>
                        <strong>Are you and {name} willing to train 15 minutes a day?</strong>
                    </p>
                </div>

                <button 
                    onClick={handleNext}
                    className="w-full h-20 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3 transform active:scale-95 transition-all"
                >
                    <CheckCircle2 size={28} />
                    YES, WE ACCEPT THE CHALLENGE
                </button>
                <p className="text-center text-gray-400 text-xs mt-4 font-bold">This commitment is essential for results.</p>
            </div>
        )}

        {/* --- STEP 4: ANALISANDO (A ESPERA MÁGICA) --- */}
        {step === 4 && (
            <div className="text-center animate-in zoom-in duration-500 flex flex-col items-center">
                <div className="w-24 h-24 relative mb-8">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#4F46E5] rounded-full border-t-transparent animate-spin"></div>
                    <Brain className="absolute inset-0 m-auto text-[#4F46E5]" size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Analyzing Profile...</h2>
                <div className="space-y-2 text-sm font-bold text-gray-400">
                    <p className="animate-pulse">Building personalized path for {name}...</p>
                    <p className="animate-pulse delay-75">Selecting best modules...</p>
                    <p className="animate-pulse delay-150">Calculating success rate...</p>
                </div>
            </div>
        )}

        {/* --- STEP 5: O RESULTADO (A VENDA) --- */}
        {step === 5 && (
            <div className="animate-in slide-in-from-bottom duration-500 flex flex-col h-full">
                <div className="flex-1 flex flex-col justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-lg mx-auto">
                        <Trophy size={40} strokeWidth={2.5} />
                    </div>
                    
                    <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight text-center">
                        Great News! <br/> We can help {name}.
                    </h2>
                    
                    <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-6 mb-6 relative">
                        <div className="absolute -top-3 left-6 bg-[#4F46E5] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                            Analysis Result
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed text-lg">
                            {name} isn't "bad at math". The traditional method is just boring. <br/><br/>
                            Based on your answers, our <strong>Gamified Protocol</strong> is the perfect fit to fix the focus issue and reach <strong>Mental Math Mastery</strong> in 21 days.
                        </p>
                    </div>
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={handleFinalAction}
                        className="w-full h-20 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3 animate-pulse"
                    >
                        SEE PERSONALIZED PLAN <ArrowRight size={28} />
                    </button>
                    <p className="text-center text-gray-400 text-xs mt-4 font-bold uppercase tracking-wider">
                        100% Risk Free • Parent Approved
                    </p>
                </div>
            </div>
        )}

      </div>

      {/* FIXED FOOTER BUTTON (Só aparece no Step 0 para confirmar nome) */}
      {step === 0 && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-30">
            <div className="max-w-lg mx-auto">
                <button 
                    onClick={handleNext}
                    disabled={!name}
                    className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338ca] disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-wide shadow-lg transition-all"
                >
                    Start Mission
                </button>
            </div>
        </div>
      )}

    </div>
  );
};
