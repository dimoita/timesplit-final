
import React, { useState, useEffect } from 'react';
import { Skull, AlertTriangle, Zap } from 'lucide-react';

interface VillainHackerProps {
  villainEmoji: string;
  message: string;
  onComplete: () => void;
}

export const VillainHacker: React.FC<VillainHackerProps> = ({ villainEmoji, message, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < message.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + message[index]);
        setIndex(prev => prev + 1);
      }, 40) ;
      return () => clearTimeout(timeout);
    } else {
      const finishTimeout = setTimeout(onComplete, 2500);
      return () => clearTimeout(finishTimeout);
    }
  }, [index, message, onComplete]);

  return (
    <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-6 font-mono overflow-hidden animate-shake-fast">
      {/* CRT Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 blur-sm animate-scan-down"></div>

      {/* Villain Avatar with Glitch */}
      <div className="relative mb-12">
        <div className="text-[120px] filter hue-rotate-180 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-glitch-spin">
          {villainEmoji}
        </div>
        <div className="absolute -top-4 -right-4 bg-red-600 text-white px-3 py-1 rounded font-black text-xs uppercase animate-bounce">
          System Breach
        </div>
      </div>

      {/* Terminal Text */}
      <div className="w-full max-w-lg bg-black/80 border-2 border-red-600 p-6 rounded-sm shadow-[0_0_40px_rgba(220,38,38,0.3)]">
        <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase mb-4 tracking-[0.3em]">
          <AlertTriangle size={12} /> Incoming Transmission // Error 0x88
        </div>
        
        <p className="text-red-400 text-xl font-bold leading-relaxed lowercase italic">
          {displayText}
          <span className="inline-block w-2 h-5 bg-red-500 ml-1 animate-pulse"></span>
        </p>

        <div className="mt-6 flex justify-between items-center opacity-40">
          <div className="text-[8px] text-red-700">ENCRYPTION: AES-256-BREAK</div>
          <Zap size={14} className="text-red-600 animate-pulse" />
        </div>
      </div>

      <style>{`
        @keyframes scan-down {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-scan-down { animation: scan-down 3s linear infinite; }
        
        @keyframes glitch-spin {
          0% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg); }
          20% { transform: scale(1.1) rotate(5deg); filter: hue-rotate(90deg); }
          40% { transform: scale(0.9) rotate(-5deg); filter: invert(0.2); }
          100% { transform: scale(1) rotate(0deg); filter: hue-rotate(360deg); }
        }
        .animate-glitch-spin { animation: glitch-spin 0.5s infinite; }

        @keyframes shake-fast {
          0%, 100% { transform: translate(0,0); }
          25% { transform: translate(-2px, 2px); }
          75% { transform: translate(2px, -2px); }
        }
        .animate-shake-fast { animation: shake-fast 0.1s infinite; }
      `}</style>
    </div>
  );
};
