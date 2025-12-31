
import React, { useState, useEffect } from 'react';
import { Radio, Zap, Target, ArrowRight, Activity } from 'lucide-react';
import { Button } from './ui/Button';
import { StarPet } from './StarPet';
import { Bounty, PetState } from '../App';

interface DailySentinelProps {
  message: string;
  bounties: Bounty[];
  petState?: PetState;
  onAccept: () => void;
}

export const DailySentinel: React.FC<DailySentinelProps> = ({ message, bounties, petState, onAccept }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (index < message.length) {
      const t = setTimeout(() => {
        setDisplayText(prev => prev + message[index]);
        setIndex(prev => prev + 1);
      }, 35);
      return () => clearTimeout(t);
    }
  }, [index, message]);

  // Occasional Glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 z-[150] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden transition-all duration-100 ${glitch ? 'blur-[1px] brightness-125' : ''}`}>
        
        {/* CRT Scanline & Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        
        {/* Moving Scanline */}
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/20 blur-sm animate-scan-down"></div>

        {/* Static Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWUPr9WUM/giphy.gif')] bg-repeat"></div>

        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
            {/* Mission Director Avatar */}
            <div className="mb-12 relative scale-110">
                <div className={`absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full scale-150 transition-opacity duration-300 ${glitch ? 'opacity-100' : 'opacity-50'}`}></div>
                <div className="relative p-10 border-4 border-cyan-500/30 rounded-full shadow-[0_0_60px_rgba(34,211,238,0.3)] bg-slate-900/50 backdrop-blur-md">
                    <StarPet stage={petState?.stage || 'SENTINEL'} mood="IDLE" size="lg" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 px-6 py-1.5 rounded-full font-black text-xs uppercase tracking-[0.3em] animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                    Link Direto
                </div>
            </div>

            {/* Rádio / Briefing Box */}
            <div className="w-full bg-slate-900/90 border-4 border-cyan-500/20 rounded-[2rem] p-10 shadow-2xl backdrop-blur-xl mb-10 relative">
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-cyan-400/10 rounded-[2rem] pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-8 opacity-60">
                    <div className="flex items-center gap-3">
                        <Radio size={20} className="text-cyan-400 animate-pulse" />
                        <span className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.5em]">Setor-Alpha Transmissão</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-cyan-400" />
                        <span className="text-[10px] font-mono text-cyan-500/50">ENC-TS:92</span>
                    </div>
                </div>

                <p className="text-2xl md:text-3xl font-black text-white leading-relaxed italic lowercase tracking-tight">
                    {displayText}
                    <span className="inline-block w-3 h-8 bg-cyan-400 ml-2 animate-pulse align-middle"></span>
                </p>
            </div>

            {/* Bounties Preview */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {bounties.map((b, i) => (
                    <div key={i} className="bg-slate-900/60 border-2 border-white/5 rounded-3xl p-5 animate-in slide-in-from-bottom duration-700 hover:border-cyan-500/30 transition-colors" style={{ animationDelay: `${600 + i * 200}ms` }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Target size={16} className="text-red-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{b.title}</span>
                        </div>
                        <p className="text-sm font-black text-slate-100 mb-4 min-h-[40px] leading-tight">{b.goal}</p>
                        <div className="flex justify-between items-center bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20">
                            <span className="text-xs font-black text-cyan-400">+{b.reward} Splitz</span>
                            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={onAccept} className="w-full max-w-sm h-20 text-2xl bg-cyan-600 hover:bg-cyan-500 border-cyan-800 text-white shadow-[0_15px_40px_rgba(8,145,178,0.4)] transition-all active:translate-y-1">
                ACEITAR MISSÕES <ArrowRight className="ml-3" strokeWidth={3} />
            </Button>
        </div>

        <style>{`
            @keyframes scan-down {
                0% { transform: translateY(-100vh); opacity: 0; }
                50% { opacity: 0.5; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
            .animate-scan-down {
                animation: scan-down 4s linear infinite;
            }
        `}</style>
    </div>
  );
};
