
import React, { useEffect, useState } from 'react';

export type PetStage = 'EGG' | 'PROTO' | 'SENTINEL' | 'GUARDIAN' | 'GALACTIC';
export type PetMood = 'IDLE' | 'HAPPY' | 'SAD' | 'EATING' | 'SLEEPING' | 'DANCING';

interface StarPetProps {
  stage: PetStage;
  mood: PetMood;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const StarPet: React.FC<StarPetProps> = ({ stage, mood, size = 'md', onClick, className = '' }) => {
  const [internalMood, setInternalMood] = useState(mood);

  useEffect(() => {
    setInternalMood(mood);
  }, [mood]);

  const sizeClass = {
    sm: 'w-12 h-12 md:w-16 md:h-16',
    md: 'w-24 h-24 md:w-32 md:h-32',
    lg: 'w-32 h-32 md:w-48 md:h-48',
  }[size];

  const getAnimClass = () => {
    switch (internalMood) {
      case 'HAPPY': return 'animate-bounce-custom';
      case 'SAD': return 'animate-shake-sad';
      case 'EATING': return 'animate-pulse-fast';
      case 'DANCING': return 'animate-spin-slow';
      default: return 'animate-float-gentle';
    }
  };

  const FaceRenderer = ({ cx1 = 40, cx2 = 60, cy = 52 }) => {
    if (internalMood === 'SAD') {
      return (
        <g>
          <circle cx={cx1} cy={cy} r="3" fill="#0f172a" />
          <circle cx={cx2} cy={cy} r="3" fill="#0f172a" />
          <path d={`M ${cx1 + 5} ${cy + 15} Q 50 ${cy + 10} ${cx2 - 5} ${cy + 15}`} fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    }
    if (internalMood === 'HAPPY' || internalMood === 'DANCING') {
      return (
        <g>
          <path d={`M ${cx1 - 5} ${cy} Q ${cx1} ${cy - 5} ${cx1 + 5} ${cy}`} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <path d={`M ${cx2 - 5} ${cy} Q ${cx2} ${cy - 5} ${cx2 + 5} ${cy}`} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <path d={`M ${cx1 + 5} ${cy + 10} Q 50 ${cy + 15} ${cx2 - 5} ${cy + 10}`} fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    }
    return (
      <g>
        <circle cx={cx1} cy={cy} r="4" fill="#0f172a" />
        <circle cx={cx2} cy={cy} r="4" fill="#0f172a" />
        <circle cx={cx1 + 1} cy={cy - 1} r="1.5" fill="white" />
        <circle cx={cx2 + 1} cy={cy - 1} r="1.5" fill="white" />
      </g>
    );
  };

  const RenderEgg = () => (
    <svg viewBox="0 0 100 100" className="drop-shadow-lg filter overflow-visible">
      <defs>
        <radialGradient id="eggGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" /><stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="50" rx="35" ry="45" fill="url(#eggGrad)" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M 30 40 L 40 50 L 30 60" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
    </svg>
  );

  const RenderProto = () => (
    <svg viewBox="0 0 100 100" className="drop-shadow-xl overflow-visible">
      <defs>
        <radialGradient id="protoGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" /><stop offset="100%" stopColor="#06b6d4" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="55" r="30" fill="url(#protoGrad)" stroke="#cffafe" strokeWidth="2" />
      <path d="M 20 55 Q 10 40 25 35" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <path d="M 80 55 Q 90 40 75 35" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <FaceRenderer />
    </svg>
  );

  const RenderSentinel = () => (
    <svg viewBox="0 0 100 100" className="drop-shadow-2xl overflow-visible">
      <defs>
        <linearGradient id="sentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <rect x="25" y="30" width="50" height="50" rx="10" fill="url(#sentGrad)" stroke="#fef3c7" strokeWidth="3" />
      <path d="M 30 20 L 40 30 M 70 20 L 60 30" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <rect x="35" y="45" width="30" height="15" rx="5" fill="#0f172a" opacity="0.2" />
      <FaceRenderer cy={55} />
    </svg>
  );

  const RenderGuardian = () => (
    <svg viewBox="0 0 100 100" className="drop-shadow-2xl overflow-visible">
      <defs>
        <linearGradient id="guardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path d="M 50 15 L 80 40 L 70 85 L 30 85 L 20 40 Z" fill="url(#guardGrad)" stroke="#c7d2fe" strokeWidth="3" />
      <path d="M 20 40 L 5 20 M 80 40 L 95 20" stroke="#818cf8" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="55" r="10" fill="#22d3ee" className="animate-pulse" />
      <FaceRenderer cy={45} />
    </svg>
  );

  const RenderGalactic = () => (
    <svg viewBox="0 0 100 100" className="drop-shadow-2xl overflow-visible">
      <defs>
        <radialGradient id="galGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" /><stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#galGrad)" stroke="#f3e8ff" strokeWidth="2" opacity="0.8" />
      <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px' }}>
        <path d="M 50 5 L 60 40 L 95 50 L 60 60 L 50 95 L 40 60 L 5 50 L 40 40 Z" fill="#fff" opacity="0.5" />
      </g>
      <FaceRenderer cy={50} />
    </svg>
  );

  return (
    <div onClick={onClick} className={`relative cursor-pointer transition-transform duration-300 active:scale-95 select-none ${sizeClass} ${getAnimClass()} ${className}`}>
        {stage === 'EGG' && <RenderEgg />}
        {stage === 'PROTO' && <RenderProto />}
        {stage === 'SENTINEL' && <RenderSentinel />}
        {stage === 'GUARDIAN' && <RenderGuardian />}
        {stage === 'GALACTIC' && <RenderGalactic />}
        
        {internalMood === 'HAPPY' && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-float-up pointer-events-none">❤️</div>}
        <style>{`
            @keyframes bounce-custom { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
            @keyframes float-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            @keyframes shake-sad { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px) rotate(-2deg); } 75% { transform: translateX(3px) rotate(2deg); } }
            @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .animate-bounce-custom { animation: bounce-custom 0.5s infinite; }
            .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
            .animate-spin-slow { animation: spin-slow 10s linear infinite; }
            .animate-float-up { animation: float-delayed 1s forwards; opacity: 0; }
        `}</style>
    </div>
  );
};
