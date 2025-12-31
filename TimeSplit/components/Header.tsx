
import React from 'react';
import { Users } from 'lucide-react';
import { useScarcity } from '../hooks/useScarcity';

interface HeaderProps {
  onSignInClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignInClick }) => {
  const { percentage, isUpdating } = useScarcity();

  const handleSignIn = () => {
    if (onSignInClick) {
      onSignInClick();
    } else {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Bar - CAPACITY SCARCITY (Safe for Ads) */}
      <div className="bg-[#1e1b4b] text-white py-2.5 px-4 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b] via-[#312E81] to-[#1e1b4b] animate-shimmer"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 relative z-10 text-xs md:text-sm">
          
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-bold text-indigo-200 uppercase tracking-wider text-[10px] sm:text-xs">
              Status: <span className="text-white">Founder's Batch Open</span>
            </span>
          </div>

          <div className="hidden sm:block w-px h-4 bg-indigo-800"></div>

          <div className="flex items-center gap-3">
             <div className="flex flex-col sm:flex-row items-baseline gap-1 sm:gap-2">
                <span className="uppercase tracking-widest text-indigo-300 text-[10px] font-black">
                   Protocol Capacity:
                </span>
                <span className={`font-bold text-xs transition-all duration-500 ${isUpdating ? 'text-green-300 scale-105 shadow-glow' : 'text-white'}`}>
                   {percentage.toFixed(1)}% Claimed
                </span>
             </div>
             
             {/* Progress Bar Visual */}
             <div className={`w-24 h-2 bg-indigo-900/50 rounded-full border border-indigo-700/50 overflow-hidden relative transition-all duration-500 ${isUpdating ? 'ring-2 ring-green-500/50' : ''}`}>
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
             </div>
          </div>

        </div>
      </div>
      
      <header className="w-full bg-white/95 backdrop-blur-xl border-b-[3px] border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-200">
            <div className="w-11 h-11 bg-gradient-to-b from-[#4F46E5] to-[#312E81] rounded-xl flex items-center justify-center shadow-[0_4px_0_#312E81] border-2 border-[#6366f1]">
              <span className="text-white font-black text-2xl italic transform -rotate-3">T</span>
            </div>
            <span className="font-black text-gray-900 text-2xl tracking-tighter italic text-3d">
              TIME<span className="text-[#4F46E5]">SPLIT</span>
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#how-it-works" className="hidden md:block text-gray-600 font-extrabold text-sm uppercase tracking-wide hover:text-[#4F46E5] transition-colors">How it Works</a>
            <button 
              className="text-gray-400 hover:text-[#4F46E5] font-bold text-sm transition-colors" 
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 8s linear infinite;
        }
        .shadow-glow {
           text-shadow: 0 0 10px rgba(74, 222, 128, 0.8);
        }
      `}</style>
    </>
  );
};
