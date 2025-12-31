
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { ShieldCheck } from 'lucide-react';

interface StickyCTAProps {
  onStartQuiz: () => void;
}

export const StickyCTA: React.FC<StickyCTAProps> = ({ onStartQuiz }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section (approx 600px)
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.1)] lg:hidden z-[100] transition-transform duration-300 ease-out translate-y-0"
        style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-green-600 font-black uppercase tracking-wider mb-0.5">
             <ShieldCheck size={10} strokeWidth={3} /> 30-Day Guarantee
          </div>
          <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900">$37</span>
              <span className="text-xs text-gray-400 font-bold line-through">$197</span>
          </div>
        </div>

        <Button 
          className="bg-[#4CAF50] hover:bg-[#45a049] border-[#2E7D32] text-white font-bold text-lg px-8 py-4 h-auto shadow-xl flex-1 max-w-[200px]"
          onClick={onStartQuiz}
        >
           Start Now
        </Button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
