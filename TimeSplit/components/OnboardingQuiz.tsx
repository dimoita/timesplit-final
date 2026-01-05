import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Brain, Calculator, Frown, Zap, Trophy, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingQuizProps {
  isOpen: boolean;
  onClose: () => void;
  // Agora passamos também os dados do diagnóstico para o App usar no checkout
  onComplete: (data: { name: string; painPoint: string; goal: string }) => void;
}

export const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [goal, setGoal] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- AUDIO SYSTEM ---
  const playSound = (type: 'POP' | 'VICTORY') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'POP') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        // Victory Chime
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const oscV = ctx.createOscillator();
            const gainV = ctx.createGain();
            oscV.type = 'sine';
            oscV.frequency.value = freq;
            gainV.gain.setValueAtTime(0, now + i*0.1);
            gainV.gain.linearRampToValueAtTime(0.2, now + i*0.1 + 0.05);
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

  // --- CONFETTI SYSTEM (Nativo, sem bibliotecas pesadas) ---
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
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            life: 100
        });
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            if (p.life > 0) {
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // Gravity
                p.life -= 1;
                p.size *= 0.96;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            }
        });
        if (active) requestAnimationFrame(animate);
    };
    animate();
  };

  // Trigger Victory effects on Final Step
  useEffect(() => {
      if (step === 3) {
          playSound('VICTORY');
          fireConfetti();
      }
  }, [step]);

  const handleNext = () => {
    playSound('POP');
    if (step < 3) setStep(step + 1);
    else {
      // Aqui vamos disparar a ação para abrir o CheckoutBridge
      onComplete({ name, painPoint, goal });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white font-nunito animate-in fade-in duration-300">
      
      {/* Canvas para Confetes (Fica invisível até ser acionado) */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[60]" />

      <div className="w-full max-w-lg h-full md:h-auto md:max-h-[90vh] bg-white md:rounded-3xl md:shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Progress Bar & Header */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between shrink-0">
            <div className="flex gap-1.5">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-[#4F46E5]' : 'w-3 bg-gray-200'}`} />
                ))}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-50 rounded-full">
                <X size={20} />
            </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* STEP 0: NOME (VÍNCULO) */}
            {step === 0 && (
                <div className="animate-in slide-in-from-right duration-300 h-full flex flex-col">
                    <div className="flex-1">
                        <h2 className="text-3xl font-black text-gray-900 mb-3 leading-tight">Who are we helping today?</h2>
                        <p className="text-gray-500 text-lg mb-8">Enter your child's name to personalize their learning path.</p>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Child's First Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-5 text-gray-900 font-bold text-2xl focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-all placeholder:text-gray-300"
                                placeholder="Ex: Leo"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 1: A DOR (PAIN) */}
            {step === 1 && (
                <div className="animate-in slide-in-from-right duration-300">
                    <h2 className="text-2xl font-black text-gray-900 mb-3">What's the biggest struggle right now?</h2>
                    <p className="text-gray-500 mb-8">Be honest. This helps us adjust the algorithm.</p>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'fingers', label: 'Still counting on fingers', icon: Calculator },
                            { id: 'anxiety', label: 'Gets anxious or cries', icon: Frown },
                            { id: 'slow', label: 'Takes too long to answer', icon: Brain },
                            { id: 'bored', label: 'Finds math boring/hates it', icon: Zap }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => { playSound('POP'); setPainPoint(opt.id); }}
                                className={`w-full p-5 rounded-xl border-2 flex items-center gap-4 transition-all text-left group
                                    ${painPoint === opt.id 
                                        ? 'border-[#4F46E5] bg-indigo-50 shadow-md transform scale-[1.02]' 
                                        : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'}
                                `}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors
                                    ${painPoint === opt.id ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white'}
                                `}>
                                    <opt.icon size={20} strokeWidth={2.5} />
                                </div>
                                <span className={`text-lg font-bold ${painPoint === opt.id ? 'text-[#4F46E5]' : 'text-gray-600'}`}>
                                    {opt.label}
                                </span>
                                {painPoint === opt.id && <CheckCircle2 className="ml-auto text-[#4F46E5]" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: O SONHO (GOAL) */}
            {step === 2 && (
                <div className="animate-in slide-in-from-right duration-300">
                    <h2 className="text-2xl font-black text-gray-900 mb-3">What is your dream outcome?</h2>
                    <p className="text-gray-500 mb-8">Where do you want {name || 'your child'} to be in 30 days?</p>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'speed', label: 'Instant Mental Math', icon: Zap },
                            { id: 'confidence', label: 'Confidence in Class', icon: Trophy },
                            { id: 'love', label: 'Actually Loving Math', icon: Heart },
                            { id: 'grades', label: 'Better Grades', icon: CheckCircle2 }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => { playSound('POP'); setGoal(opt.id); }}
                                className={`w-full p-5 rounded-xl border-2 flex items-center gap-4 transition-all text-left group
                                    ${goal === opt.id 
                                        ? 'border-[#4F46E5] bg-indigo-50 shadow-md transform scale-[1.02]' 
                                        : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'}
                                `}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors
                                    ${goal === opt.id ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white'}
                                `}>
                                    <opt.icon size={20} strokeWidth={2.5} />
                                </div>
                                <span className={`text-lg font-bold ${goal === opt.id ? 'text-[#4F46E5]' : 'text-gray-600'}`}>
                                    {opt.label}
                                </span>
                                {goal === opt.id && <CheckCircle2 className="ml-auto text-[#4F46E5]" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3: O DIAGNÓSTICO (A VENDA) */}
            {step === 3 && (
                <div className="animate-in zoom-in duration-500 text-center flex flex-col h-full justify-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce shadow-lg shadow-green-100">
                        <CheckCircle2 size={48} strokeWidth={3} />
                    </div>
                    
                    <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                        Good News! We can help {name}.
                    </h2>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#4F46E5]"></div>
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2">ANALYSIS RESULT:</h4>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            {name} is not "bad at math". The traditional method is just boring. Based on your answers, our <strong>Gamified Protocol</strong> fits perfectly to fix "{painPoint || 'counting fingers'}" in less than 30 days.
                        </p>
                    </div>

                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Recommended Plan Ready</p>
                </div>
            )}

        </div>

        {/* Fixed Footer Action Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0 z-20">
            <button 
                onClick={handleNext}
                disabled={step === 0 && !name || step === 1 && !painPoint || step === 2 && !goal}
                className={`
                    w-full h-16 rounded-xl font-black text-xl uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-xl
                    ${step === 3 
                        ? 'bg-[#10B981] hover:bg-[#059669] text-white animate-pulse' // Botão Verde na última tela
                        : 'bg-[#4F46E5] hover:bg-[#4338ca] text-white disabled:opacity-50 disabled:cursor-not-allowed' // Botão Azul nas outras
                    }
                `}
            >
                {step === 3 ? (
                    <>SEE {name ? `${name.toUpperCase()}'S` : 'THE'} PLAN <ArrowRight size={24} /></>
                ) : (
                    <>CONTINUE</>
                )}
            </button>
            
            {/* O "No thanks" aparece discreto só no final, se você quiser, ou removemos para conversão total */}
            {step === 3 && (
                <button onClick={onClose} className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase">
                    No thanks, I prefer the traditional way
                </button>
            )}
        </div>

      </div>
    </div>
  );
};
