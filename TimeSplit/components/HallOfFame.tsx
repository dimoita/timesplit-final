
import React, { useState } from 'react';
import { ArrowLeft, Lock, Trophy, Share2, Check } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionDescription?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first_blood', 
    title: 'First Blood', 
    description: 'Complete your first training session.', 
    icon: '⚔️' 
  },
  { 
    id: 'sharpshooter', 
    title: 'Sharpshooter', 
    description: 'Finish a level with 100% Accuracy.', 
    icon: '🎯' 
  },
  { 
    id: 'speed_demon', 
    title: 'Speed Demon', 
    description: 'Complete a level with blistering speed.', 
    icon: '⚡' 
  },
  { 
    id: 'untouchable', 
    title: 'Untouchable', 
    description: 'Win without losing a single heart.', 
    icon: '🛡️' 
  },
  { 
    id: 'deep_pockets', 
    title: 'Deep Pockets', 
    description: 'Collect 200 Splitz in your bank.', 
    icon: '💰' 
  },
  { 
    id: 'marathoner', 
    title: 'Marathoner', 
    description: 'Reach a Combo Streak of 10x.', 
    icon: '🔥' 
  }
];

interface HallOfFameProps {
  unlockedIds: string[];
  onBack: () => void;
}

export const HallOfFame: React.FC<HallOfFameProps> = ({ unlockedIds, onBack }) => {
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleShare = async () => {
      const text = `I've unlocked ${unlockedIds.length}/${ACHIEVEMENTS.length} Achievements in TimeSplit! 🏆 Can you beat my trophy collection?`;
      const url = window.location.href;

      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'TimeSplit Hall of Fame',
                  text: text,
                  url: url
              });
              setShareFeedback('Sent!');
          } catch (err) {
              console.log('Share dismissed');
          }
      } else {
          navigator.clipboard.writeText(`${text} ${url}`);
          setShareFeedback('Link Copied!');
      }
      setTimeout(() => setShareFeedback(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-nunito flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-black opacity-80 pointer-events-none"></div>

      {/* Header */}
      <nav className="relative z-20 px-4 py-4 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-colors"
          >
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back to Base</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={24} />
            <span className="font-black text-white text-xl uppercase tracking-wider text-3d">Hall of Fame</span>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/10 border border-white/10 px-4 py-1.5 rounded-full hidden sm:block">
                <span className="font-black text-white text-sm">
                  {unlockedIds.length} / {ACHIEVEMENTS.length} <span className="text-gray-400 text-xs uppercase ml-1">Unlocked</span>
                </span>
              </div>
              <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-colors shadow-lg"
              >
                  {shareFeedback ? <Check size={20} /> : <Share2 size={20} />}
              </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);

            return (
              <div 
                key={achievement.id}
                className={`
                  relative rounded-2xl p-6 border-[3px] transition-all duration-300 group
                  ${isUnlocked 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.1)]' 
                    : 'bg-black/20 border-white/5 grayscale opacity-60'}
                `}
              >
                {/* Shine effect for unlocked */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-shine"></div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner border-2
                    ${isUnlocked 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-white/20' 
                      : 'bg-slate-800 border-white/5'}
                  `}>
                    {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-600" />}
                  </div>
                  
                  {isUnlocked && (
                    <div className="bg-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase px-2 py-1 rounded border border-yellow-500/30">
                      Unlocked
                    </div>
                  )}
                </div>

                <div>
                  <h3 className={`text-lg font-black mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm font-bold leading-relaxed ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                    {isUnlocked ? achievement.description : '???'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
};
