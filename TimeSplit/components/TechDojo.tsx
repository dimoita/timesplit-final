
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BrainCircuit, Delete, Check, Zap, Hash, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

type MasteryMap = Record<string, number>;

interface DojoProps {
  mastery: MasteryMap;
  focusFactors?: number[]; 
  onComplete: (results: { mastered: string[], coins: number }) => void;
  onExit: () => void;
}

interface CalibrationTask {
  id: string;
  expression: string;
  answer: number;
  type: 'REPAIR' | 'MAINTENANCE';
}

export const TechDojo: React.FC<DojoProps> = ({ mastery, focusFactors, onComplete, onExit }) => {
  const [tasks, setTasks] = useState<CalibrationTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phase, setPhase] = useState<'LOADING' | 'ACTIVE' | 'COMPLETE'>('LOADING');
  
  const { playCorrect, playWrong, playWin, playAttack } = useGameSound();

  useEffect(() => {
    const generateSmartTasks = () => {
        const newTasks: CalibrationTask[] = [];
        const realGaps = Object.entries(mastery).filter(([_, score]) => (score as number) < 0.5).map(([key]) => key);

        if (focusFactors && focusFactors.length > 0) {
            focusFactors.forEach(f => {
                for(let i=2; i<=9; i++) {
                    const normId = f < i ? `${f}x${i}` : `${i}x${f}`;
                    if ((mastery[normId] || 0) < 0.8) {
                        newTasks.push({ id: normId, expression: `${f} × ${i}`, answer: f * i, type: 'REPAIR' });
                    }
                }
            });
        }

        realGaps.forEach(gap => {
            if (newTasks.length < 10 && !newTasks.find(t => t.id === gap)) {
                const [a, b] = gap.split('x').map(Number);
                newTasks.push({ id: gap, expression: `${a} × ${b}`, answer: a * b, type: 'REPAIR' });
            }
        });

        while (newTasks.length < 8) {
            const a = Math.floor(Math.random() * 8) + 2;
            const b = Math.floor(Math.random() * 8) + 2;
            const normId = a < b ? `${a}x${b}` : `${b}x${a}`;
            if (!newTasks.find(t => t.id === normId)) {
                newTasks.push({ id: normId, expression: `${a} × ${b}`, answer: a * b, type: 'MAINTENANCE' });
            }
        }

        setTasks(newTasks.sort(() => Math.random() - 0.5).slice(0, 10));
        setPhase('ACTIVE');
    };
    generateSmartTasks();
  }, [focusFactors, mastery]);

  const handleNumPress = (num: number) => {
      if (input.length >= 3 || isSuccess) return;
      playCorrect();
      setInput(prev => prev + num.toString());
  };

  const handleBackspace = () => {
      if (input.length > 0 && !isSuccess) { setInput(prev => prev.slice(0, -1)); playAttack(); }
  };

  const handleSubmit = () => {
      const current = tasks[currentIndex];
      if (!current || isSuccess) return;

      if (parseInt(input) === current.answer) {
          setIsSuccess(true);
          playWin();
          setTimeout(() => {
              if (currentIndex < tasks.length - 1) {
                  setCurrentIndex(prev => prev + 1);
                  setInput('');
                  setIsSuccess(false);
              } else {
                  setPhase('COMPLETE');
              }
          }, 800);
      } else {
          setIsShake(true);
          playWrong();
          setInput('');
          setTimeout(() => setIsShake(false), 400);
      }
  };

  if (phase === 'LOADING') return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-mono tracking-widest">CALIBRANDO LINK NEURAL...</div>;

  if (phase === 'COMPLETE') {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-green-500 shadow-glow"><ShieldCheck size={48} className="text-green-400" /></div>
              <h2 className="text-3xl font-black text-white mb-2 uppercase">Calibração Concluída</h2>
              <p className="text-slate-400 text-sm mb-8">Trilhas de memória reforçadas. Gaps fechados.</p>
              <Button onClick={() => onComplete({ mastered: tasks.map(t => t.id), coins: 25 })} className="w-full max-w-xs h-16 bg-green-600 border-green-800">Retornar à Base</Button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#020617] font-mono flex flex-col relative overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-white/5 bg-black/20">
            <button onClick={onExit} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft /></button>
            <div className="flex items-center gap-2"><BrainCircuit size={16} className="text-cyan-400" /><span className="text-xs font-black text-cyan-100 uppercase tracking-widest">Neural Repair Mode</span></div>
            <div className="text-cyan-600 font-black text-sm">{currentIndex + 1} / {tasks.length}</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className={`w-full max-w-sm bg-slate-900/50 border-2 ${isSuccess ? 'border-green-500' : isShake ? 'border-red-500' : 'border-cyan-500/20'} rounded-3xl p-8 mb-8 backdrop-blur-md transition-colors`}>
                <div className="text-center">
                    <div className={`text-[10px] font-black uppercase mb-4 tracking-[0.3em] ${tasks[currentIndex].type === 'REPAIR' ? 'text-orange-500 animate-pulse' : 'text-cyan-500'}`}>{tasks[currentIndex].type === 'REPAIR' ? '⚠️ REPARO CRÍTICO' : 'SEQUÊNCIA DE MANUTENÇÃO'}</div>
                    <div className="text-6xl font-black text-white mb-8 tracking-tighter">{tasks[currentIndex].expression}</div>
                    <div className={`h-20 bg-black/40 border-2 ${isShake ? 'animate-shake border-red-500' : 'border-white/10'} rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-inner`}>{input || <span className="opacity-10 animate-pulse">_</span>}{isSuccess && <Check size={32} className="text-green-500 ml-4 animate-pop-in" />}</div>
                </div>
            </div>
            <div className="w-full max-w-xs grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9,0].map(n => (<button key={n} onClick={() => handleNumPress(n)} className={`h-16 rounded-xl font-black text-2xl bg-slate-800 text-white border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 ${n === 0 ? 'col-start-2' : ''}`}>{n}</button>))}
                <button onClick={handleBackspace} className="h-16 rounded-xl bg-red-900/20 text-red-500 flex items-center justify-center border-b-4 border-red-950/20"><Delete /></button>
                <button onClick={handleSubmit} disabled={!input} className={`h-16 rounded-xl font-black flex items-center justify-center border-b-4 ${input ? 'bg-cyan-600 border-cyan-800 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}><Check /></button>
            </div>
        </div>
        <style>{`
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            .animate-shake { animation: shake 0.3s ease-in-out; }
        `}</style>
    </div>
  );
};
