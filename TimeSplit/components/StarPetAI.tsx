
import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

interface StarPetAIProps {
  message: string;
  isThinking?: boolean;
  onComplete?: () => void;
}

export const StarPetAI: React.FC<StarPetAIProps> = ({ message, isThinking, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayText('');
    setIndex(0);
  }, [message]);

  useEffect(() => {
    if (index < message.length && !isThinking) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + message[index]);
        setIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (index === message.length && onComplete) {
      onComplete();
    }
  }, [index, message, isThinking, onComplete]);

  return (
    <div className="relative animate-pop-in pointer-events-none group-hover/pet:pointer-events-auto">
      <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-500/50 p-4 rounded-3xl rounded-bl-none shadow-[0_0_30px_rgba(6,182,212,0.3)] relative">
        {/* Gemini Branding Badge */}
        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-lg scale-90">
           <Sparkles size={10} className="text-white animate-pulse" />
           <span className="text-[9px] font-black text-white uppercase tracking-tighter">Neural Link</span>
        </div>

        {isThinking ? (
          <div className="flex items-center gap-3 py-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-[0.2em] animate-pulse">Sincronizando...</span>
          </div>
        ) : (
          <p className="text-white text-sm font-bold leading-relaxed font-nunito pr-2">
            {displayText}
            <span className="inline-block w-1.5 h-4 bg-cyan-400 ml-1 animate-pulse align-middle"></span>
          </p>
        )}
      </div>
      
      {/* Connector Tail */}
      <div className="w-0 h-0 border-t-[12px] border-t-slate-900/95 border-r-[12px] border-r-transparent"></div>
    </div>
  );
};
