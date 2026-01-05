import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Trophy, Target, Zap, Brain, Rocket } from 'lucide-react';

interface OnboardingQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { name: string; villain: string; avatar: string }) => void;
}

export const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [villain, setVillain] = useState('');
  const [avatar, setAvatar] = useState('rocket');

  // Sintetizador de Som Nativo (Sem arquivos mp3)
  const playPopSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Ignora erro de áudio se o navegador bloquear
    }
  };

  const handleNext = () => {
    playPopSound();
    if (step < 3) setStep(step + 1);
    else {
      onComplete({ name, villain, avatar });
    }
  };

  const handleOptionSelect = (setter: (val: string) => void, value: string) => {
    setter(value);
    handleNext();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300 font-nunito">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4F46E5]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-lg bg-[#1e293b] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header / Progress */}
        <div className="p-6 pb-2 flex items-center justify-between">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700'}`} />
                ))}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
            
            {/* STEP 0: NAME */}
            {step === 0 && (
                <div className="animate-in slide-in-from-right duration-300">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                        <Rocket size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Welcome, Agent!</h2>
                    <p className="text-slate-400 mb-8">First, identify yourself to the command center.</p>
                    
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agent Name (Child's Name)</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-4 text-white font-bold text-lg focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="Ex: Super Leo"
                            autoFocus
                        />
                        <button 
                            onClick={handleNext}
                            disabled={!name}
                            className="w-full bg-white hover:bg-indigo-50 text-slate-900 h-14 rounded-xl font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            Continue Mission <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 1: AVATAR */}
            {step === 1 && (
                <div className="animate-in slide-in-from-right duration-300">
                    <h2 className="text-2xl font-black text-white mb-2">Choose your Hero</h2>
                    <p className="text-slate-400 mb-6">Select the avatar that will represent you.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: 'rocket', label: 'Cosmic Rocket', icon: '🚀' },
                            { id: 'hero', label: 'Super Guardian', icon: '🦸' },
                            { id: 'robot', label: 'Math Bot', icon: '🤖' },
                            { id: 'wizard', label: 'Time Wizard', icon: '🧙' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleOptionSelect(setAvatar, opt.id)}
                                className="bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-indigo-500 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all group"
                            >
                                <span className="text-4xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                                <span className="font-bold text-slate-300 group-hover:text-white text-sm">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: GOAL (AQUI ESTAVA O ERRO DO BOTÃO) */}
            {step === 2 && (
                <div className="animate-in slide-in-from-right duration-300">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                        <Target size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">What is the Mission?</h2>
                    <p className="text-slate-400 mb-6">Select the main objective for this agent.</p>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'multiplication', label: 'Master Multiplication', sub: 'The basics of the universe', icon: Zap },
                            { id: 'speed', label: 'Increase Speed', sub: 'Think faster than light', icon: Rocket },
                            { id: 'confidence', label: 'Gain Confidence', sub: 'Stop fear of numbers', icon: Trophy },
                            // BOTÃO CORRIGIDO AQUI: h-auto e whitespace-normal
                            { id: 'free', label: 'Free (It\'s for their goal)', sub: 'Just exploring for now', icon: Brain }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={handleNext}
                                className="w-full bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-purple-500 rounded-xl p-4 flex items-center gap-4 transition-all group text-left h-auto min-h-[80px]"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                    <opt.icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white group-hover:text-purple-300 transition-colors whitespace-normal leading-tight">
                                        {opt.label}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 whitespace-normal leading-tight">
                                        {opt.sub}
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-600 group-hover:text-white shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3: VILLAIN */}
            {step === 3 && (
                <div className="animate-in slide-in-from-right duration-300">
                    <h2 className="text-2xl font-black text-white mb-2">Identify the Threat</h2>
                    <p className="text-slate-400 mb-6">Who is stealing time from the universe?</p>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'chronos', label: 'Dr. Chronos', desc: 'The Time Thief' },
                            { id: 'void', label: 'The Void', desc: 'Eater of Numbers' },
                            { id: 'glitch', label: 'General Glitch', desc: 'Master of Chaos' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleOptionSelect(setVillain, opt.id)}
                                className="w-full bg-gradient-to-r from-slate-900 to-slate-900 hover:from-slate-900 hover:to-indigo-900/30 border-2 border-slate-700 hover:border-indigo-500 rounded-xl p-4 flex items-center justify-between transition-all group"
                            >
                                <div className="text-left">
                                    <div className="font-bold text-white">{opt.label}</div>
                                    <div className="text-xs text-slate-500">{opt.desc}</div>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-slate-600 group-hover:border-indigo-500 group-hover:bg-indigo-500 flex items-center justify-center transition-all">
                                    <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
