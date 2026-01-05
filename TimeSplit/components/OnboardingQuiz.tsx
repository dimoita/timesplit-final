import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, CheckCircle2, Play, AlertCircle } from 'lucide-react';

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

  // --- IMAGENS PARA CADA ETAPA (Storytelling Visual) ---
  const stepImages = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop", // 0: Espaço/Foguete
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop", // 1: Criança Estudando (Dor)
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop", // 2: Criança Feliz (Sonho)
    "https://images.unsplash.com/photo-1501139083538-0139583c61df?q=80&w=1000&auto=format&fit=crop", // 3: Relógio (Tempo)
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", // 4: Cérebro Digital (Analise)
    "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=1000&auto=format&fit=crop"  // 5: Confetes/Ouro (Sucesso)
  ];

  // --- SOM DE ARCADE ---
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
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
    } else {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const oscV = ctx.createOscillator(); const gainV = ctx.createGain();
            oscV.type = 'square'; oscV.frequency.value = freq;
            gainV.gain.setValueAtTime(0.05, now + i*0.1);
            gainV.gain.exponentialRampToValueAtTime(0.001, now + i*0.1 + 0.1);
            oscV.connect(gainV); gainV.connect(ctx.destination);
            oscV.start(now + i*0.1); oscV.stop(now + i*0.1 + 0.1);
        });
    }
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
    if (step === 3) { setStep(4); } else { setStep(step + 1); }
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
    // LAYOUT PRINCIPAL: TELA CHEIA E Z-INDEX MÁXIMO
    <div className="fixed inset-0 z-[100] bg-white font-nunito animate-in fade-in duration-300 flex flex-col md:flex-row h-[100dvh] w-screen overflow-hidden">
      
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[110]" />

      {/* --- ÁREA DA IMAGEM (Topo no Mobile, Esquerda no Desktop) --- */}
      <div className="relative w-full h-[30%] md:h-full md:w-1/2 bg-slate-900 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img 
            src={stepImages[step]} 
            alt="Quiz Illustration" 
            className="w-full h-full object-cover transition-all duration-700 transform scale-105 opacity-90"
        />
        
        {/* Botão Fechar (Fica sobre a imagem no mobile para economizar espaço) */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors">
            <X size={20} />
        </button>

        {/* Barra de Progresso (Sobre a imagem no mobile) */}
        <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex gap-1">
             {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 flex-1 ${i <= step ? 'bg-[#10B981] shadow-[0_0_10px_#10B981]' : 'bg-white/20'}`} />
            ))}
        </div>
      </div>

      {/* --- ÁREA DE CONTEÚDO (Baixo no Mobile, Direita no Desktop) --- */}
      <div className="flex-1 flex flex-col relative bg-white">
        
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-center max-w-lg mx-auto w-full">
            
            {/* STEP 0: NOME */}
            {step === 0 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <span className="text-[#4F46E5] font-bold tracking-widest uppercase text-xs mb-2 block">Start Mission</span>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                        Vamos destravar o potencial matemático do seu filho?
                    </h2>
                    <p className="text-gray-500 mb-6 text-sm">Para começar, como ele(a) se chama?</p>
                    
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-[#10B981] outline-none py-3 bg-transparent placeholder-gray-300 text-slate-800 transition-colors"
                        placeholder="Digite o nome aqui..."
                        autoFocus
                    />
                    
                    {name && (
                        <button onClick={handleNext} className="w-full mt-8 h-14 bg-[#10B981] hover:bg-green-600 text-white rounded-xl font-black text-lg shadow-xl flex items-center justify-center gap-2 animate-in slide-in-from-bottom duration-300">
                            COMEÇAR <Play size={20} fill="currentColor" />
                        </button>
                    )}
                </div>
            )}

            {/* STEP 1: A DOR */}
            {step === 1 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">O que mais te preocupa hoje?</h2>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'fingers', label: 'Ainda conta nos dedos', icon: '🖐️' },
                            { id: 'anxiety', label: 'Trava ou fica nervoso(a)', icon: '😓' },
                            { id: 'slow', label: 'Demora muito na tarefa', icon: '🐢' },
                            { id: 'boring', label: 'Acha matemática chata', icon: '🥱' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => { playSound('POP'); setPainPoint(opt.id); handleNext(); }}
                                className="w-full p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-[#10B981] hover:bg-green-50/50 shadow-sm flex items-center gap-4 transition-all transform active:scale-[0.98] text-left"
                            >
                                <span className="text-2xl">{opt.icon}</span>
                                <span className="text-base font-bold text-slate-700">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: O SONHO */}
            {step === 2 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">Qual seria a maior vitória para o {name}?</h2>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'speed', label: 'Fazer contas de cabeça', icon: '⚡' },
                            { id: 'confidence', label: 'Confiança na escola', icon: '🏆' },
                            { id: 'grades', label: 'Notas melhores', icon: '📈' },
                            { id: 'love', label: 'Gostar de estudar', icon: '❤️' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => { playSound('POP'); setGoal(opt.id); handleNext(); }}
                                className="w-full p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-[#10B981] hover:bg-green-50/50 shadow-sm flex items-center gap-4 transition-all transform active:scale-[0.98] text-left"
                            >
                                <span className="text-2xl">{opt.icon}</span>
                                <span className="text-base font-bold text-slate-700">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3: COMPROMISSO */}
            {step === 3 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Um acordo entre nós.</h2>
                    
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-xl mb-6">
                        <p className="text-slate-800 font-medium text-sm leading-relaxed">
                            O método funciona, mas exige constância. <br/>
                            <strong>Você topa treinar 15 minutos por dia com o {name}?</strong>
                        </p>
                    </div>

                    <button 
                        onClick={handleNext}
                        className="w-full h-16 bg-[#10B981] hover:bg-green-600 text-white rounded-xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
                    >
                        <CheckCircle2 size={24} />
                        SIM, ACEITAMOS
                    </button>
                    <p className="text-center text-gray-400 text-[10px] mt-3 font-bold uppercase">Sem compromisso financeiro agora</p>
                </div>
            )}

            {/* STEP 4: ANALISANDO */}
            {step === 4 && (
                <div className="text-center animate-in zoom-in duration-500 flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 relative mb-6">
                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#10B981] rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Processando Perfil...</h2>
                    <div className="space-y-1 text-sm font-bold text-gray-400">
                        <p className="animate-pulse">Criando plano para o {name}...</p>
                        <p className="animate-pulse delay-75">Selecionando jogos...</p>
                    </div>
                </div>
            )}

            {/* STEP 5: RESULTADO */}
            {step === 5 && (
                <div className="animate-in slide-in-from-bottom duration-500 flex flex-col h-full">
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider w-fit mb-4">
                            <CheckCircle2 size={14} /> Diagnóstico Pronto
                        </div>
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                            Boas Notícias! <br/> Temos a solução.
                        </h2>
                        
                        <p className="text-slate-600 font-medium leading-relaxed text-base mb-6">
                            O {name} <strong>não</strong> tem problema com números. O método tradicional que é chato. <br/><br/>
                            Nosso protocolo foi desenhado para resolver exatamente isso em <strong>15 minutos por dia</strong>.
                        </p>
                    </div>

                    <div className="mt-auto pt-4 bg-white sticky bottom-0">
                        <button 
                            onClick={handleFinalAction}
                            className="w-full h-16 bg-[#10B981] hover:bg-green-600 text-white rounded-xl font-black text-lg shadow-xl flex items-center justify-center gap-2 animate-pulse"
                        >
                            VER PLANO DE RESGATE <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
