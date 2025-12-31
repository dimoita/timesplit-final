
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Trophy, Star, Zap, Shield, Clock, GraduationCap, Users, BookOpen, BrainCircuit, Divide, MousePointer2, Gamepad2, Bot } from 'lucide-react';
import { useGameSound } from '../hooks/useGameSound';

interface HeroProps {
  onStartQuiz: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartQuiz }) => {
  
  // Interactive Hero Logic
  const [hasPlayed, setHasPlayed] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  
  // Ghost Demo State
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [ghostPosition, setGhostPosition] = useState({ x: 50, y: 110 }); // Start below screen
  const [isGhostClicking, setIsGhostClicking] = useState(false);
  
  const { playCorrect, playWrong } = useGameSound();
  const demoLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- GHOST DEMO LOOP ---
  useEffect(() => {
    if (!isAutoPlaying || hasPlayed) return;

    const runDemoLoop = () => {
        // 1. Reset
        setFeedbackState('IDLE');
        setGhostPosition({ x: 50, y: 120 }); // Reset position
        setIsGhostClicking(false);

        // 2. Move to target (The number '8' is the correct answer in the UI)
        // Coordinates are approximate percentages relative to the game container
        demoLoopRef.current = setTimeout(() => {
            setGhostPosition({ x: 25, y: 65 }); // Move to Left Button
        }, 500);

        // 3. Click
        demoLoopRef.current = setTimeout(() => {
            setIsGhostClicking(true);
        }, 1500);

        // 4. Trigger Win
        demoLoopRef.current = setTimeout(() => {
            setIsGhostClicking(false);
            handleDemoInteraction(8, true); // True = artificial
        }, 1700);

        // 5. Reset Loop
        demoLoopRef.current = setTimeout(() => {
            runDemoLoop();
        }, 4000);
    };

    runDemoLoop();

    return () => {
        if (demoLoopRef.current) clearTimeout(demoLoopRef.current);
    };
  }, [isAutoPlaying, hasPlayed]);

  const handleUserIntervention = () => {
      if (isAutoPlaying) {
          setIsAutoPlaying(false);
          setGhostPosition({ x: 50, y: 150 }); // Fly away
          if (demoLoopRef.current) clearTimeout(demoLoopRef.current);
          setFeedbackState('IDLE'); // Reset board for user
      }
  };

  const handleDemoInteraction = (answer: number, isGhost = false) => {
    if (!isGhost && isAutoPlaying) {
        handleUserIntervention();
    }

    if (feedbackState === 'CORRECT') return; 

    if (answer === 8) {
        setFeedbackState('CORRECT');
        if (!isGhost) {
            setHasPlayed(true);
            playCorrect();
        }
    } else {
        setFeedbackState('WRONG');
        playWrong();
        setTimeout(() => setFeedbackState('IDLE'), 800);
    }
  };

  const HeroVisual3D = () => (
    <div 
        className="relative w-full max-w-[500px] aspect-square mx-auto perspective-1000 group cursor-pointer"
        onClick={handleUserIntervention}
        onTouchStart={handleUserIntervention}
    >
      
      {/* Floating Elements Behind */}
      <div className={`absolute top-0 right-10 w-20 h-20 bg-yellow-400 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center rotate-12 z-0 transition-all duration-500 ${feedbackState === 'CORRECT' ? 'scale-125 rotate-[360deg]' : 'animate-float-delayed'}`}>
         <span className="text-4xl">👑</span>
      </div>
      
      <div className="absolute bottom-20 -left-6 w-24 h-24 bg-[#FF6B35] rounded-full border-4 border-white shadow-xl flex flex-col items-center justify-center -rotate-6 animate-float z-20">
         <span className="text-white font-black text-2xl">2-in-1</span>
         <span className="text-white/90 text-xs font-bold uppercase">System</span>
      </div>

      {/* Main Tablet Frame */}
      <div className={`absolute inset-4 bg-[#1e293b] rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-[8px] border-gray-800 ring-4 ring-gray-900/20 z-10 overflow-hidden transform transition-all duration-500 ${feedbackState === 'WRONG' ? 'animate-shake border-red-500' : 'rotate-[-2deg] hover:rotate-0'}`}>
         
         {/* Screen Content */}
         <div className={`w-full h-full relative overflow-hidden flex flex-col transition-colors duration-300 ${feedbackState === 'CORRECT' ? 'bg-[#4CAF50]' : 'bg-gradient-to-br from-indigo-900 to-slate-900'}`}>
            
            {/* Header UI */}
            <div className="w-full p-6 bg-black/20 backdrop-blur-sm border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <BrainCircuit className={`${feedbackState === 'CORRECT' ? 'text-white' : 'text-[#4CAF50]'} animate-pulse`} size={20} />
                  <span className={`text-xs font-mono uppercase tracking-widest ${feedbackState === 'CORRECT' ? 'text-white' : 'text-[#4CAF50]'}`}>
                      {feedbackState === 'CORRECT' ? 'DOPAMINE HIT!' : 'Neural Link Active'}
                  </span>
               </div>
               <div className={`px-3 py-1 rounded-full border font-black text-xs ${feedbackState === 'CORRECT' ? 'bg-white text-[#4CAF50] border-white' : 'bg-[#4CAF50]/20 border-[#4CAF50]/50 text-[#4CAF50]'}`}>
                  INVERSE MODE
               </div>
            </div>

            {/* Gameplay Simulation */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
               
               {/* Confetti / Success State */}
               {feedbackState === 'CORRECT' && (
                   <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                       <div className="absolute top-1/2 left-1/2 w-full h-full bg-white/20 rounded-full animate-ping"></div>
                       <div className="absolute top-1/2 left-1/2 w-2/3 h-2/3 bg-white/20 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                   </div>
               )}

               <p className={`text-xs font-bold uppercase mb-4 tracking-widest transition-colors ${feedbackState === 'CORRECT' ? 'text-green-100' : 'text-gray-400'}`}>
                   {feedbackState === 'CORRECT' ? 'Excellent! Connection Formed.' : 'Tap the correct answer:'}
               </p>
               
               <div className="inline-block bg-white text-gray-900 px-8 py-6 rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.3)] border-b-8 border-gray-200 transform scale-110 mb-8 relative z-10">
                  <div className="text-5xl md:text-6xl font-black tracking-widest text-[#1e293b] flex items-center gap-2 md:gap-4">
                     56 <Divide size={40} strokeWidth={4} className="md:w-12 md:h-12" /> <span className={`transition-colors ${feedbackState === 'CORRECT' ? 'text-[#4CAF50]' : 'text-red-500 animate-pulse'}`}>{feedbackState === 'CORRECT' ? '8' : '?'}</span>
                     <span className="text-gray-300">=</span> 7
                  </div>
               </div>
               
               {/* Interactive Buttons */}
               <div className={`grid grid-cols-2 gap-3 w-full max-w-[280px] transition-all duration-500 ${feedbackState === 'CORRECT' ? 'opacity-0 scale-0 h-0' : 'opacity-100'}`}>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDemoInteraction(8); }}
                    className="bg-[#4CAF50] hover:bg-[#43A047] active:scale-95 rounded-xl p-4 text-white font-black text-xl border-b-4 border-[#2E7D32] shadow-lg transform hover:scale-105 ring-2 ring-white/50 animate-pulse transition-all"
                  >
                      8
                  </button>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDemoInteraction(6); }}
                    className="bg-white/10 backdrop-blur-md hover:bg-red-500/20 active:bg-red-500 rounded-xl p-4 text-white/50 font-black text-xl border-2 border-white/5 hover:border-red-500/50 transition-all"
                  >
                      6
                  </button>
               </div>

               {/* Success Message */}
               {feedbackState === 'CORRECT' && (
                   <div className="absolute bottom-10 animate-pop-in z-20">
                       <div className="bg-white text-[#4CAF50] px-6 py-2 rounded-xl font-black text-xl shadow-xl border-b-4 border-black/10">
                           +50 SPLITZ!
                       </div>
                   </div>
               )}

               {/* GHOST CURSOR (The "Try Before You Buy" Visual) */}
               <div 
                  className="absolute z-50 pointer-events-none transition-all duration-500 ease-in-out"
                  style={{ 
                      left: `${ghostPosition.x}%`, 
                      top: `${ghostPosition.y}%`,
                      opacity: isAutoPlaying ? 1 : 0
                  }}
               >
                   <div className={`transform transition-transform duration-150 ${isGhostClicking ? 'scale-75' : 'scale-100'}`}>
                       <MousePointer2 
                          className="fill-white text-black drop-shadow-xl" 
                          size={48} 
                          strokeWidth={1.5}
                       />
                   </div>
               </div>

            </div>
         </div>
         
         {/* Reflection */}
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Foreground Badge */}
      <div className={`absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-4 border-white flex items-center gap-3 transition-all duration-500 z-30 max-w-[220px] ${feedbackState === 'CORRECT' ? 'scale-110 shadow-[0_0_30px_rgba(76,175,80,0.5)] border-[#4CAF50]' : 'animate-pop-in'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner border border-white/50 transition-colors ${feedbackState === 'CORRECT' ? 'bg-[#4CAF50]' : 'bg-gradient-to-br from-[#4F46E5] to-[#312E81]'}`}>
          <Zap className="w-6 h-6 text-white" fill="currentColor" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Result</div>
          <div className={`text-sm font-black leading-none ${feedbackState === 'CORRECT' ? 'text-[#4CAF50]' : 'text-gray-900'}`}>
              {feedbackState === 'CORRECT' ? 'Gap Repaired!' : 'Math Gap Closed'}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px) rotate(-2deg); }
          75% { transform: translateX(8px) rotate(2deg); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden bg-moving-grid pt-12 pb-20 lg:pt-24 lg:pb-32">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
         <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
         <div className="absolute bottom-20 right-10 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Copy Side */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start space-y-8">
            
            {/* USP Badge (UPDATED WITH TRUST SIGNAL) */}
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#4F46E5] border border-indigo-100 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-sm transform hover:scale-105 transition-transform cursor-default">
               <Shield className="w-3 h-3 fill-current" />
               <span>Science-Based 15-Minute Protocol</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#0f172a] leading-[1.1] tracking-tight text-3d">
              Stop Counting <br/> on Fingers. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">Start Mastering.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 font-bold max-w-lg leading-relaxed">
              The gamified system that fixes <span className="text-indigo-600">Multiplication & Division</span> gaps in 30 days. 
              No more homework battles. Just 15 minutes a day.
            </p>

            <div className="flex flex-col w-full sm:max-w-md gap-6">
               <Button 
                    className={`w-full text-xl py-6 px-12 h-auto transition-all duration-300 ${hasPlayed ? 'bg-[#4CAF50] border-[#2E7D32] hover:bg-[#43A047] scale-105 shadow-[0_0_30px_rgba(76,175,80,0.4)]' : ''}`} 
                    onClick={onStartQuiz}
                >
                  {hasPlayed ? (
                      <span className="flex items-center gap-2">
                          Start The Protocol <ArrowRight size={24} />
                      </span>
                  ) : (
                      "Fix The Math Gap Now"
                  )}
               </Button>
               
               {/* Trust/Safety Micro-copy (NEW BLOCK 1 ADDITION) */}
               <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  <Clock size={12} className="text-orange-500" />
                  <span>Auto-locks after 15 mins to prevent burnout</span>
               </div>
               
               {/* Authority Badges */}
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 opacity-90 mt-2">
                  <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100">
                    <BrainCircuit className="w-5 h-5 text-[#4F46E5]" />
                    <span className="text-xs font-black text-gray-600 uppercase tracking-wide">Visual Memory</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100">
                    <Divide className="w-5 h-5 text-[#4F46E5]" />
                    <span className="text-xs font-black text-gray-600 uppercase tracking-wide">Inverse Logic</span>
                  </div>
                   <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100">
                    <Trophy className="w-5 h-5 text-[#4F46E5]" />
                    <span className="text-xs font-black text-gray-600 uppercase tracking-wide">Gamified</span>
                  </div>
               </div>
            </div>

          </div>

          {/* Visual Side */}
          <div className="flex items-center justify-center">
             <HeroVisual3D />
             {!hasPlayed && (
                 <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full animate-bounce whitespace-nowrap border border-white/20 shadow-xl z-40 cursor-pointer" onClick={handleUserIntervention}>
                     {isAutoPlaying ? (
                       <>
                         <Bot size={14} className="text-cyan-400" />
                         <span className="font-bold">Auto-Pilot Active <span className="text-gray-400 mx-1">|</span> Tap to Take Control</span>
                       </>
                     ) : (
                       <>
                         <Gamepad2 size={14} className="text-green-400" />
                         <span className="font-bold">Manual Control Engaged</span>
                       </>
                     )}
                 </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
};

// Simple Arrow icon for the updated button
const ArrowRight = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
    </svg>
);
