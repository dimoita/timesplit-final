import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, CheckCircle2, Play, Sparkles, AlertCircle } from 'lucide-react';

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

  // --- IMAGENS EMOCIONAIS (NEURÔNIOS ESPELHO) ---
  const stepImages = [
    "https://images.unsplash.com/photo-1545558728-e5542d5e850f?q=80&w=1000&auto=format&fit=crop", // 0: Criança Astronauta/Sonhadora (Identidade)
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop", // 1: Criança Pensativa/Estudando (Dor)
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop", // 2: Criança Feliz na Escola (Sonho)
    "https://images.unsplash.com/photo-1606092195730-5d7b9af1ef4d?q=80&w=1000&auto=format&fit=crop", // 3: Pai e Filho High-Five (Compromisso/Parceria)
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", // 4: Tecnologia/Cérebro (Análise)
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop"  // 5: Confetes/Vitória (Sucesso)
  ];

  // --- SOM TURBINADO (Volume 0.5) ---
  const playSound = (type: 'POP' | 'VICTORY') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'POP') {
        // Som de "Pop" mais encorpado e alto
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime); // Volume aumentado
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } else {
        // Som de Vitória Épico
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const oscV = ctx.createOscillator();
            const gainV = ctx.createGain();
            oscV.type = 'triangle'; // Timbre mais brilhante
            oscV.frequency.value = freq;
            gainV.gain.setValueAtTime(0.3, now + i*0.1);
            gainV.gain.exponentialRampToValueAtTime(0.001, now + i*0.1 + 0.4);
            oscV.connect(gainV);
            gainV.connect(ctx.destination);
            oscV.start(now + i*0.1);
            oscV.stop(now + i*0.1 + 0.5);
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

  const handleNext = () => {
    playSound('POP');
    if (step === 3) {
        setStep(4); 
    } else {
        setStep(step + 1);
    }
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
    // LAYOUT 100% MOBILE FRIENDLY (h-dvh)
    <div className="fixed inset-0 z-[100] bg-white font-nunito animate-in fade-in duration-300 flex flex-col md:flex-row h-[100dvh] w-screen overflow-hidden">
      
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[110]" />

      {/* --- ÁREA DA IMAGEM HERO (Topo no Mobile) --- */}
      <div className="relative w-full h-[35%] md:h-full md:w-1/2 bg-slate-900 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-white z-10"></div>
        <img 
            src={stepImages[step]} 
            alt="Step Illustration" 
            className="w-full h-full object-cover transition-all duration-700 transform scale-105 opacity-90"
        />
        
        {/* Barra de Progresso (Visível sobre a imagem) */}
        <div className="absolute top-4 left-0 w-full px-6 z-20 flex gap-1">
             {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 flex-1 shadow-sm ${i <= step ? 'bg-[#10B981]' : 'bg-white/40 backdrop-blur-sm'}`} />
            ))}
        </div>

        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors">
            <X size={20} />
        </button>
      </div>

      {/* --- ÁREA DE CONTEÚDO (Baixo no Mobile) --- */}
      <div className="flex-1 flex flex-col relative bg-white -mt-6 rounded-t-3xl md:mt-0 md:rounded-none z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4 flex flex-col justify-start md:justify-center max-w-lg mx-auto w-full">
            
            {/* STEP 0: NOME DO CAMPEÃO */}
            {step === 0 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <span className="text-[#4F46E5] font-black tracking-widest uppercase text-xs mb-2 block flex items-center gap-1">
                        <Sparkles size={12} /> Perfil do Herói
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                        Quem é o nosso futuro <span className="text-[#4F46E5]">Campeão?</span>
                    </h2>
                    <p className="text-gray-500 mb-8 font-medium text-sm">Digite o nome dele(a) para começar a missão.</p>
                    
                    <div className="relative">
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-3xl font-black border-b-4 border-gray-100 focus:border-[#10B981] outline-none py-4 bg-transparent placeholder-gray-200 text-slate-800 transition-colors uppercase tracking-tight"
                            placeholder="NOME AQUI"
                            autoFocus
                        />
                    </div>

                    {name && (
                        <button onClick={handleNext} className="w-full mt-8 h-16 bg-[#10B981] hover:bg-green-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-200 flex items-center justify-center gap-2 animate-in slide-in-from-bottom duration-300">
                            COMEÇAR AGORA <ArrowRight />
                        </button>
                    )}
                </div>
            )}

            {/* STEP 1: A DOR (COM EMOJIS) */}
            {step === 1 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">O que mais te preocupa hoje?</h2>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'fingers', label: 'Ainda conta nos dedos', icon: '🖐️' },
                            { id: 'anxiety', label: 'Trava ou chora na tarefa', icon: '😢' },
                            { id: 'slow', label: 'Demora muito para responder', icon: '🐢' },
                            { id: 'boring', label: 'Acha matemática chata', icon: '🥱' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => { playSound('POP'); setPainPoint(opt.id); handleNext(); }}
                                className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-[#10B981] hover:bg-green-50/30 shadow-sm flex items-center gap-4 transition-all transform active:scale-[0.98] text-left group"
                            >
                                <span className="text-3xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                                <span className="text-base font-bold text-slate-700 group-hover:text-slate-900">{opt.label}</span>
                                <div className="ml-auto w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-[#10B981]"></div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: O SONHO (COM EMOJIS) */}
            {step === 2 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">Imagine o {name} daqui a 30 dias...</h2>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'speed', label: 'Fazendo contas de cabeça', icon: '⚡' },
                            { id: 'confidence', label: 'Com confiança na escola', icon: '🏆' },
                            { id: 'grades', label: 'Tirando notas melhores', icon: '📈' },
                            { id: 'love', label: 'Gostando de estudar', icon: '❤️' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => { playSound('POP'); setGoal(opt.id); handleNext(); }}
                                className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-[#10B981] hover:bg-green-50/30 shadow-sm flex items-center gap-4 transition-all transform active:scale-[0.98] text-left group"
                            >
                                <span className="text-3xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                                <span className="text-base font-bold text-slate-700 group-hover:text-slate-900">{opt.label}</span>
                                <div className="ml-auto w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-[#10B981]"></div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3: O ACORDO (Sem culpa para o pai) */}
            {step === 3 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Um acordo entre nós.</h2>
                    
                    <div className="bg-blue-50 border-l-4 border-[#4F46E5] p-5 rounded-r-xl mb-6">
                        <p className="text-slate-800 font-medium text-sm leading-relaxed">
                            O método é 100% autônomo. Você <strong>não precisa ensinar</strong> nada. <br/><br/>
                            Seu único trabalho é garantir que o {name} abra o aplicativo por <strong>15 minutos</strong>.
                        </p>
                    </div>

                    <p className="text-slate-600 font-bold text-sm mb-4">Você topa esse desafio de supervisão?</p>

                    <button 
                        onClick={handleNext}
                        className="w-full h-20 bg-[#10B981] hover:bg-green-600 text-white rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all text-center leading-tight px-4"
                    >
                        <CheckCircle2 size={24} className="shrink-0" />
                        SIM, EU GARANTO O ACESSO
                    </button>
                </div>
            )}

            {/* STEP 4: ANALISANDO (A Espera) */}
            {step === 4 && (
                <div className="text-center animate-in zoom-in duration-500 flex flex-col items-center justify-center h-full pb-20">
                    <div className="w-24 h-24 relative mb-8">
                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#10B981] rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Gerando Plano Personalizado...</h2>
                    <div className="space-y-1 text-sm font-bold text-gray-400">
                        <p className="animate-pulse">Analisando perfil do {name}...</p>
                        <p className="animate-pulse delay-75">Adaptando dificuldade...</p>
                    </div>
                </div>
            )}

            {/* STEP 5: RESULTADO (Venda) */}
            {step === 5 && (
                <div className="animate-in slide-in-from-bottom duration-500 flex flex-col h-full">
                    <div className="flex-1 flex flex-col justify-center pb-20">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider w-fit mb-4">
                            <CheckCircle2 size={14} /> Diagnóstico Pronto
                        </div>
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                            Boas Notícias! <br/> Temos a solução.
                        </h2>
                        
                        <p className="text-slate-600 font-medium leading-relaxed text-base mb-6">
                            O {name} <strong>não</strong> tem problema com números. O método tradicional que é chato. <br/><br/>
                            Nosso protocolo foi desenhado para resolver isso em <strong>15 minutos por dia</strong>.
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Recomendação:</p>
                            <p className="text-[#4F46E5] font-black text-lg">Kit Titã (Acesso Vitalício)</p>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 bg-white sticky bottom-0 pb-6">
                        <button 
                            onClick={handleFinalAction}
                            className="w-full h-20 bg-[#10B981] hover:bg-green-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-200 flex items-center justify-center gap-3 animate-pulse"
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
