import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface OnboardingQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { name: string; painPoint: string; goal: string }) => void;
}

export const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0); 
  const [name, setName] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [goal, setGoal] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- IMAGENS DEFINITIVAS (EMOÇÃO REAL & LINKS ESTÁVEIS) ---
  const stepImages = [
    // 0: Identidade - Criança Astronauta (Potencial)
    "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=800&auto=format&fit=crop", 
    // 1: Dor - Criança Frustrada/Cansada com tarefa
    "https://images.unsplash.com/photo-1513542789411-b8a5d44d8436?q=80&w=800&auto=format&fit=crop", 
    // 2: Sonho - Criança Feliz/Sorrindo (Sucesso)
    "https://images.unsplash.com/photo-1503919545874-84c105b79079?q=80&w=800&auto=format&fit=crop", 
    // 3: Compromisso - Mãos dadas/Parceria (Pai e Filho)
    "https://images.unsplash.com/photo-1628239026362-e64b7324d52b?q=80&w=800&auto=format&fit=crop", 
    // 4: Análise - Tecnologia Abstrata (Sem robôs)
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop", 
    // 5: Sucesso - Criança Vibrando/Pulando
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&auto=format&fit=crop"  
  ];

  // --- SOM ---
  const playSound = (type: 'POP' | 'VICTORY') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'POP') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
    } else {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const oscV = ctx.createOscillator(); const gainV = ctx.createGain();
            oscV.type = 'triangle'; oscV.frequency.value = freq;
            gainV.gain.setValueAtTime(0.2, now + i*0.1);
            gainV.gain.exponentialRampToValueAtTime(0.001, now + i*0.1 + 0.3);
            oscV.connect(gainV); gainV.connect(ctx.destination);
            oscV.start(now + i*0.1); oscV.stop(now + i*0.1 + 0.4);
        });
    }
  };

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
            color: colors[Math.floor(Math.random() * colors.length)], size: Math.random() * 8 + 4, life: 100
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

  const handleNext = () => {
    playSound('POP');
    if (step === 3) setStep(4);
    else setStep(step + 1);
  };

  useEffect(() => {
      if (step === 4) {
          setIsAnalyzing(true);
          setTimeout(() => {
              setIsAnalyzing(false);
              setStep(5);
              playSound('VICTORY');
              fireConfetti();
          }, 2500);
      }
  }, [step]);

  const handleFinalAction = () => {
      playSound('POP');
      onComplete({ name, painPoint, goal });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white font-nunito animate-in fade-in duration-300 flex flex-col md:flex-row h-[100dvh] w-screen overflow-hidden">
      
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[110]" />

      {/* --- ÁREA DA IMAGEM HERO --- */}
      <div className="relative w-full h-[25%] md:h-full md:w-1/2 bg-slate-900 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        {/* Adicionei 'bg-slate-200' como placeholder enquanto carrega */}
        <img 
            src={stepImages[step]} 
            alt="Step Context" 
            className="w-full h-full object-cover transition-all duration-700 transform scale-105 opacity-95 bg-slate-200"
        />
        
        <div className="absolute bottom-0 left-0 w-full px-4 pb-2 z-20 flex gap-1">
             {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 flex-1 ${i <= step ? 'bg-[#10B981]' : 'bg-white/40'}`} />
            ))}
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm">
            <X size={20} />
        </button>
      </div>

      {/* --- CONTEÚDO --- */}
      <div className="flex-1 flex flex-col relative bg-white overflow-hidden">
        
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
            
            {/* STEP 0: NOME */}
            {step === 0 && (
                <div className="animate-in slide-in-from-right duration-500 pt-4">
                    <span className="text-[#4F46E5] font-black tracking-widest uppercase text-xs mb-2 block flex items-center gap-1">
                        <Sparkles size={12} /> Perfil do Herói
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                        Quem é o nosso futuro <span className="text-[#4F46E5]">Campeão?</span> 🚀
                    </h2>
                    <p className="text-gray-500 mb-8 font-medium text-sm">Digite o nome dele(a) para começar a missão.</p>
                    
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-3xl font-black border-b-4 border-gray-100 focus:border-[#10B981] outline-none py-4 bg-transparent placeholder-gray-200 text-slate-800 transition-colors uppercase tracking-tight"
                        placeholder="NOME"
                        autoFocus
                    />
                </div>
            )}

            {/* STEP 1: A DOR */}
            {step === 1 && (
                <div className="animate-in slide-in-from-right duration-500 pt-2">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">O que mais te preocupa hoje? 😟</h2>
                    <div className="space-y-3">
                        {[
                            { id: 'fingers', label: 'Ainda conta nos dedos', icon: '🖐️' },
                            { id: 'anxiety', label: 'Trava ou chora na tarefa', icon: '😓' },
                            { id: 'slow', label: 'Demora muito para responder', icon: '🐢' },
                            { id: 'boring', label: 'Acha matemática chata', icon: '🥱' }
                        ].map((opt) => (
                            <button key={opt.id} onClick={() => { playSound('POP'); setPainPoint(opt.id); handleNext(); }} className="w-full p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-[#10B981] hover:bg-green-50/30 shadow-sm flex items-center gap-4 transition-all transform active:scale-[0.98] text-left group">
                                <span className="text-3xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                                <span className="text-base font-bold text-slate-700 group-hover:text-slate-900">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: O SONHO */}
            {step === 2 && (
                <div className="animate-in slide-in-from-right duration-500 pt-2">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">Qual seu sonho para o {name}? 🌟</h2>
                    <div className="space-y-3">
                        {[
                            { id: 'speed', label: 'Fazer contas de cabeça', icon: '⚡' },
                            { id: 'confidence', label: 'Confiança na escola', icon: '🏆' },
                            { id: 'grades', label: 'Tirando notas melhores', icon: '📈' },
                            { id: 'love', label: 'Gostar de estudar', icon: '❤️' }
                        ].map((opt) => (
                            <button key={opt.id} onClick={() => { playSound('POP'); setGoal(opt.id); handleNext(); }} className="w-full p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-[#10B981] hover:bg-green-50/30 shadow-sm flex items-center gap-4 transition-all transform active:scale-[0.98] text-left group">
                                <span className="text-3xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                                <span className="text-base font-bold text-slate-700 group-hover:text-slate-900">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3: O ACORDO */}
            {step === 3 && (
                <div className="animate-in slide-in-from-right duration-500 pt-2">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Um acordo entre nós. 🤝</h2>
                    <div className="bg-blue-50 border-l-4 border-[#4F46E5] p-4 rounded-r-xl mb-4">
                        <p className="text-slate-800 font-medium text-sm leading-relaxed">
                            O método é autônomo. Você <strong>não precisa ensinar</strong> nada. <br/><br/>
                            Seu trabalho é apenas garantir que o {name} abra o aplicativo por <strong>15 minutos</strong>.
                        </p>
                    </div>
                    <p className="text-slate-500 font-bold text-sm">Topa o desafio de supervisão?</p>
                </div>
            )}

            {/* STEP 4: ANALISANDO */}
            {step === 4 && (
                <div className="text-center animate-in zoom-in duration-500 flex flex-col items-center justify-center pt-10">
                    <div className="w-20 h-20 relative mb-6">
                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#10B981] rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Processando Perfil... 🧠</h2>
                    <p className="text-sm font-bold text-gray-400 animate-pulse">Criando plano para o {name}...</p>
                </div>
            )}

            {/* STEP 5: RESULTADO */}
            {step === 5 && (
                <div className="animate-in slide-in-from-bottom duration-500 pt-2">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider w-fit mb-4">
                        <CheckCircle2 size={14} /> Diagnóstico Pronto
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 leading-tight">
                        Temos a solução! 🎉
                    </h2>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm mb-4">
                        O {name} <strong>não</strong> tem problema com números. O método tradicional que é chato. <br/><br/>
                        Nosso protocolo resolve isso em <strong>15 minutos por dia</strong>.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Recomendação:</p>
                        <p className="text-[#4F46E5] font-black text-base">Kit Titã (Acesso Vitalício)</p>
                    </div>
                </div>
            )}
        </div>

        {/* --- RODAPÉ FIXO --- */}
        {step !== 1 && step !== 2 && step !== 4 && (
            <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-30">
                <div className="max-w-lg mx-auto">
                    {step === 0 && (
                        <button onClick={handleNext} disabled={!name} className="w-full h-14 bg-[#10B981] hover:bg-green-600 disabled:opacity-50 text-white rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all">
                            CONTINUAR <ArrowRight size={20} />
                        </button>
                    )}
                    {step === 3 && (
                        <button onClick={handleNext} className="w-full h-14 bg-[#10B981] hover:bg-green-600 text-white rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all">
                            <CheckCircle2 size={20} /> SIM, EU GARANTO
                        </button>
                    )}
                    {step === 5 && (
                        <button onClick={handleFinalAction} className="w-full h-14 bg-[#10B981] hover:bg-green-600 text-white rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2 animate-pulse">
                            VER PLANO DE RESGATE <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
