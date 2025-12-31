
import React, { useState, useEffect } from 'react';
import { Radio, AlertCircle, Zap, Timer, Activity, ShieldAlert } from 'lucide-react';
import { ChronoEvent } from '../App';

interface ChronoStormHUDProps {
  event: ChronoEvent | null;
  onEventEnd: () => void;
}

export const ChronoStormHUD: React.FC<ChronoStormHUDProps> = ({ event, onEventEnd }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!event) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = event.endsAt - now;
      
      if (diff <= 0) {
        onEventEnd();
        return;
      }

      const m = Math.floor(diff / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${m}:${s < 10 ? '0' : ''}${s}`);
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(interval);
  }, [event, onEventEnd]);

  if (!event) return null;

  const typeConfig = {
    'BLITZ': { color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-950/40', icon: Zap },
    'GRAVITY_WELL': { color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-950/40', icon: ShieldAlert },
    'SPLITZ_RAIN': { color: 'text-yellow-400', border: 'border-yellow-500/50', bg: 'bg-yellow-950/40', icon: Activity },
  };

  const cfg = typeConfig[event.type];
  const Icon = cfg.icon;

  return (
    <div className={`mx-6 mb-6 p-4 rounded-2xl border-2 ${cfg.border} ${cfg.bg} backdrop-blur-md relative overflow-hidden animate-in slide-in-from-top-4 duration-500 shadow-lg`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border} ${cfg.color} animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
            <Icon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${cfg.color}`}>Alerta de Fenômeno Temporal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            </div>
            <h3 className="text-xl font-black text-white leading-none mt-1 uppercase italic tracking-tighter">
                {event.title}
            </h3>
            <p className="text-white/60 text-xs font-bold mt-1 max-w-md italic">
                {event.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="text-right">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Colapso em</div>
                <div className={`text-2xl font-mono font-black ${cfg.color} flex items-center gap-2`}>
                    <Timer size={20} /> {timeLeft}
                </div>
            </div>
            <div className={`h-12 w-px ${cfg.bg} border-l border-white/10 hidden md:block`}></div>
            <div className="flex flex-col items-center px-4">
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Bônus</span>
                 <span className={`text-xl font-black ${cfg.color}`}>x{event.multiplier}</span>
            </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full overflow-hidden">
        <div 
            className={`h-full ${cfg.color.replace('text', 'bg')} transition-all duration-1000 linear`}
            style={{ width: `${Math.max(0, ((event.endsAt - Date.now()) / (15 * 60 * 1000)) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};
