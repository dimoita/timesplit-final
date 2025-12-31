
import React, { useState, useEffect, useCallback } from 'react';
import { X, Heart, Gem, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { ParticleSystem } from './ParticleSystem';
import { MasteryMap, PetState, ChronoEvent } from '../App';
import { NeuralReport, SessionHistoryItem } from './NeuralReport';
import { LEVELS, LevelConfig } from '../data/LevelConfig';
import { VictoryChest } from './VictoryChest';
import { StarPet } from './StarPet';
import { StarPetAI } from './StarPetAI';
import { getStarPetMessage, generateMnemonic } from '../services/GeminiService';
import { getArtifactForLevel } from '../data/Artifacts';
import { NeuralRepair } from './NeuralRepair';

interface ChildData { name: string; villain: string; avatar: string; }
export interface GameStats { stars: number; accuracy: number; maxStreak: number; livesRemaining: number; speedBonus: boolean; correctCount: number; totalQuestions: number; earnedCoins: number; earnedItems: string[]; earnedArtifact?: string; usedAssist: boolean; }

interface GameArenaProps { 
  onExit: () => void; 
  onComplete: (stats: GameStats) => void; 
  childData?: ChildData | null; 
  level?: number; 
  mastery: MasteryMap; 
  onUpdateMastery: (updates: MasteryMap) => void; 
  consumables: Record<string, number>; 
  onConsume: (itemId: string) => void; 
  upgrades: Record<string, number>; 
  coins: number; 
  onBuyConsumable: (itemId: string, cost: number) => void; 
  petState?: PetState; 
  equippedArtifactId?: string | null;
  activeEvent?: ChronoEvent | null;
  referralCode?: string;
  // New Neuro-Props
  isZenMode?: boolean;
  isHighContrast?: boolean;
}

// Updated Question Interface for Tri-Force Logic
interface Question { 
  id: string; 
  q: string; 
  options: number[]; 
  a: number; 
  type: 'mult' | 'div';
  triad: { top: number; left: number; right: number }; // 56, 7, 8
  missing: 'top' | 'left' | 'right'; 
}

export const GameArena: React.FC<GameArenaProps> = ({ 
  onExit, onComplete, childData, level = 1, mastery, onUpdateMastery, consumables, onConsume, upgrades, coins, onBuyConsumable, petState, equippedArtifactId, activeEvent, referralCode,
  isZenMode = false, isHighContrast = false
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'LOADING' | 'PLAYING' | 'VICTORY' | 'DEFEAT' | 'REPORT' | 'INTERVENTION'>('LOADING');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryItem[]>([]);
  
  // Neural Surgeon States
  const [errorMap, setErrorMap] = useState<Record<string, number>>({});
  const [interventionData, setInterventionData] = useState<{ mnemonic: string, q: Question } | null>(null);
  const [hasUsedSurgeon, setHasUsedSurgeon] = useState(false); // Tracks if player needed help
  
  const [artifactEnergy, setArtifactEnergy] = useState(0);
  const [isArtifactActive, setIsArtifactActive] = useState(false);

  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);

  const { playCorrect, playWrong, playDamage, playGameOver, playWin, playChargeUp, stopChargeUp } = useGameSound();
  const config = LEVELS.find(l => l.id === level) || LEVELS[0];

  // --- LOCAL QUESTION GENERATOR ENGINE (TRI-FORCE ADAPTED) ---
  const generateLocalQuestions = useCallback((levelConfig: LevelConfig) => {
    const QUESTION_COUNT = levelConfig.isBoss ? 12 : 8;
    let candidates: { a: number, b: number, type: 'mult' | 'div' }[] = [];
    
    // Generate pool based on level factors
    levelConfig.factors.forEach(f1 => {
        for (let f2 = 1; f2 <= 9; f2++) {
            if (levelConfig.ops.includes('mult')) candidates.push({ a: f1, b: f2, type: 'mult' });
            if (levelConfig.ops.includes('div')) candidates.push({ a: f1 * f2, b: f1, type: 'div' });
        }
    });
    
    // Shuffle and Select
    const selected = candidates.sort(() => Math.random() - 0.5).slice(0, QUESTION_COUNT).map(c => {
        const ans = c.type === 'mult' ? c.a * c.b : c.a / c.b;
        
        // Smart Distractors
        const opts = new Set([ans]);
        opts.add(ans + (Math.random() > 0.5 ? 1 : -1));
        if (c.type === 'mult') {
             opts.add(ans + c.a);
             opts.add(ans - c.b);
        } else {
             opts.add(ans + 2);
             opts.add(ans - 2);
        }
        while(opts.size < 3) {
            const noise = (Math.floor(Math.random() * 10) - 5);
            const val = ans + noise;
            if (val > 0 && val !== ans) opts.add(val);
        }
        
        let triad = { top: 0, left: 0, right: 0 };
        let missing: 'top' | 'left' | 'right' = 'top';

        if (c.type === 'mult') {
            triad = { top: ans, left: c.a, right: c.b };
            missing = 'top';
        } else {
            triad = { top: c.a, left: c.b, right: ans };
            missing = 'right'; 
        }

        // Normalize ID
        const normId = c.type === 'mult' 
          ? (c.a < c.b ? `${c.a}x${c.b}` : `${c.b}x${c.a}`)
          : `${Math.min(c.b, ans)}x${Math.max(c.b, ans)}`; 

        return {
            id: normId,
            q: c.type === 'mult' ? `${c.a} × ${c.b}` : `${c.a} ÷ ${c.b}`,
            options: Array.from(opts).sort(() => Math.random() - 0.5),
            a: ans,
            type: c.type,
            triad,
            missing
        };
    });

    return selected;
  }, []);

  useEffect(() => {
    const newQuestions = generateLocalQuestions(config);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setLives(3);
    setStreak(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setAiMessage(null);
    setArtifactEnergy(0);
    setIsArtifactActive(false);
    setErrorMap({});
    setInterventionData(null);
    setHasUsedSurgeon(false);
    setGameState('PLAYING');
  }, [config, generateLocalQuestions]);

  const handleActivateArtifact = () => {
    if (artifactEnergy < 100 || isArtifactActive) return;
    setIsArtifactActive(true);
    setArtifactEnergy(0);
    playChargeUp();
    setTimeout(stopChargeUp, 1000);
  };

  const handleInterventionComplete = () => {
      // Return to game, reset visual states for current question to allow retry
      setGameState('PLAYING');
      setInterventionData(null);
      setSelectedOption(null);
      setIsCorrect(null);
      setConsecutiveErrors(0);
      setHasUsedSurgeon(true); // MARK AS ASSISTED
  };

  const handleAnswer = async (answer: number) => {
    if (selectedOption !== null || gameState !== 'PLAYING') return;
    
    const currentQ = questions[currentIndex];
    const correct = answer === currentQ.a;
    setSelectedOption(answer);
    setIsCorrect(correct);

    const currentScore = (mastery as any)[currentQ.id] || 0;
    const newScore = correct ? Math.min(1, currentScore + 0.2) : Math.max(0, currentScore - 0.1);
    
    setSessionHistory(prev => [...prev, {
      id: currentQ.id, label: currentQ.q, result: correct ? 'correct' : 'wrong', oldScore: currentScore, newScore: newScore
    }]);

    onUpdateMastery({ [currentQ.id]: newScore });

    if (correct) {
      playCorrect();
      setCorrectCount(c => c + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      setConsecutiveErrors(0);
      setAiMessage(null); 
      
      const energyGain = activeEvent?.type === 'GRAVITY_WELL' ? 45 : 15;
      setArtifactEnergy(prev => Math.min(100, prev + energyGain));

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
          if (isArtifactActive && equippedArtifactId === 'prime_key') setIsArtifactActive(false);
        } else {
          setGameState('VICTORY');
          playWin();
        }
      }, 1000); 
    } else {
      const isProtected = isArtifactActive && equippedArtifactId === 'prime_key';
      playWrong();
      if (!isProtected) setStreak(0);
      else setIsArtifactActive(false);

      const lifeCost = activeEvent?.type === 'GRAVITY_WELL' ? 2 : 1;
      const newLives = lives - lifeCost;
      setLives(newLives);
      const newErrors = consecutiveErrors + 1;
      setConsecutiveErrors(newErrors);

      // --- NEURAL SURGEON LOGIC ---
      const specificErrorCount = (errorMap[currentQ.id] || 0) + 1;
      setErrorMap(prev => ({...prev, [currentQ.id]: specificErrorCount}));

      if (specificErrorCount >= 2 && lives > 1) { // Only intervene if not dead
          // Pause and trigger AI
          setTimeout(async () => {
              setGameState('INTERVENTION');
              
              // Generate Mnemonic
              const mnemonic = await generateMnemonic(
                  currentQ.triad.left, 
                  currentQ.triad.right, 
                  currentQ.triad.top, 
                  childData?.villain || 'default'
              );
              
              setInterventionData({ mnemonic, q: currentQ });
          }, 800); // Small delay to show error red flash
          return;
      }

      // Standard Error Handling (AI Coaching / Game Over)
      if (newErrors >= 2 || (lives === 1 && !aiMessage)) {
        setIsAiThinking(true);
        // Non-blocking weak AI hint
        getStarPetMessage('COACHING', {
          childName: childData?.name || 'Hero', 
          masteryGaps: [], 
          currentLevel: level, 
          coins, 
          villain: childData?.villain || 'default'
        }).then(msg => {
            setAiMessage(msg);
            setIsAiThinking(false);
        });
      }

      setTimeout(() => {
        if (newLives > 0) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
        } else {
          setGameState('DEFEAT');
          playGameOver();
        }
      }, 1500); 
    }
  };

  // --- RENDER HELPERS ---
  const currentQ = questions[currentIndex];

  if (gameState === 'INTERVENTION' && interventionData) {
      return (
          <NeuralRepair 
              factorA={interventionData.q.triad.left} 
              factorB={interventionData.q.triad.right} 
              product={interventionData.q.triad.top} 
              mnemonic={interventionData.mnemonic}
              onComplete={handleInterventionComplete} 
          />
      );
  }

  if (gameState === 'VICTORY') {
    const baseCoins = config.isBoss ? 500 : 100;
    const eventBonus = activeEvent?.type === 'SPLITZ_RAIN' ? (correctCount * 20) : 0;
    const potentialArtifact = getArtifactForLevel(config.id);
    
    // CALCULATE STARS
    // If Surgeon used, max stars = 2. Otherwise based on lives.
    let calculatedStars = lives >= 3 ? 3 : lives >= 2 ? 2 : 1;
    if (hasUsedSurgeon && calculatedStars > 2) calculatedStars = 2;

    return (
        <VictoryChest 
            stars={calculatedStars} 
            isBoss={config.isBoss} 
            loot={{ coins: baseCoins + eventBonus, items: [], artifact: potentialArtifact?.id }} 
            onCollect={() => setGameState('REPORT')} 
            usedAssist={hasUsedSurgeon}
            referralCode={referralCode}
        />
    );
  }

  if (gameState === 'DEFEAT') {
      return (
          <div className="fixed inset-0 z-50 bg-red-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
              <div className="text-9xl mb-6 animate-bounce">💀</div>
              <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter">Missão Falhou</h2>
              <div className="flex flex-col gap-4 w-full max-w-xs">
                  <Button onClick={() => window.location.reload()} className="h-16 text-xl bg-white text-red-600 border-red-200">Tentar Novamente</Button>
                  <button onClick={onExit} className="text-red-300 font-black uppercase tracking-widest">Abortar Missão</button>
              </div>
          </div>
      );
  }

  if (gameState === 'REPORT') {
    const potentialArtifact = getArtifactForLevel(config.id);
    let calculatedStars = lives >= 3 ? 3 : lives >= 2 ? 2 : 1;
    if (hasUsedSurgeon && calculatedStars > 2) calculatedStars = 2;

    return <NeuralReport history={sessionHistory} onContinue={() => onComplete({
        stars: calculatedStars, 
        accuracy: correctCount / questions.length, 
        maxStreak, 
        livesRemaining: lives, 
        speedBonus: true, 
        correctCount, 
        totalQuestions: questions.length, 
        earnedCoins: config.isBoss ? 500 : 100, 
        earnedItems: [], 
        earnedArtifact: potentialArtifact?.id,
        usedAssist: hasUsedSurgeon
    })} />;
  }

  // --- TRI-FORCE RENDERER ---
  const Node = ({ type, val, active, isTarget }: { type: 'top' | 'left' | 'right', val: number, active: boolean, isTarget: boolean }) => {
      const posClass = type === 'top' ? 'top-[10%] left-1/2 -translate-x-1/2' : 
                       type === 'left' ? 'bottom-[10%] left-[10%]' : 
                       'bottom-[10%] right-[10%]';
      
      const showValue = !isTarget || (isCorrect === true && isTarget);
      
      // High Contrast: Black border, Yellow/White text
      const borderColor = isHighContrast 
        ? (active ? 'border-yellow-400' : isTarget && isCorrect === false ? 'border-white' : 'border-white') 
        : (active ? 'border-cyan-400 shadow-[0_0_30px_#22d3ee]' : isTarget && isCorrect === false ? 'border-red-500 animate-shake' : 'border-indigo-900/50');

      const textColor = isHighContrast
        ? 'text-yellow-300'
        : (active ? 'text-cyan-50' : 'text-indigo-200');

      return (
          <div className={`absolute ${posClass} transition-all duration-500`}>
              <div className={`
                  w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-[4px] 
                  z-20 relative ${isHighContrast ? 'bg-black' : 'bg-[#020617] shadow-[0_0_30px_rgba(0,0,0,0.5)]'}
                  ${borderColor}
                  ${isTarget && !showValue ? 'animate-pulse' : ''}
                  ${isTarget && showValue && !isHighContrast ? 'scale-110 bg-cyan-900/20' : ''}
              `}>
                  {/* Rotating Ring (Hide in High Contrast for noise reduction) */}
                  {!isHighContrast && active && <div className="absolute inset-[-8px] border-2 border-dashed border-cyan-500/50 rounded-full animate-spin-slow"></div>}
                  
                  {showValue ? (
                      <span className={`text-4xl md:text-5xl font-black font-nunito ${textColor}`}>
                          {val}
                      </span>
                  ) : (
                      <div className={`w-4 h-4 rounded-full ${isHighContrast ? 'bg-white' : 'bg-indigo-500/30'}`}></div>
                  )}
              </div>
          </div>
      );
  };

  // Determine Background Logic
  const bgClass = isHighContrast ? 'bg-black' : config.colorTheme;

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-nunito relative overflow-hidden pb-safe`}>
      {/* Zen Mode: No Particles. High Contrast: No Particles. */}
      {!isZenMode && !isHighContrast && (
          <ParticleSystem variant={isCorrect ? 'trail_rainbow' : activeEvent ? 'trail_matrix' : 'trail_default'} />
      )}
      
      {/* HEADER HUD */}
      <div className={`p-4 md:p-6 flex justify-between items-center z-20 ${isHighContrast ? 'bg-black border-b-2 border-white' : 'bg-black/20 backdrop-blur-sm border-b border-white/5'} pt-safe`}>
         <div className="flex items-center gap-6">
            <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isHighContrast ? 'text-white' : 'text-white/50'}`}>Nível {level}</span>
                <span className={`font-black text-xl leading-none flex items-center gap-2 ${isHighContrast ? 'text-yellow-400' : 'text-white'}`}>
                    {config.title}
                </span>
            </div>
            <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <Heart key={i} size={24} className={`${i < lives ? "text-red-500 fill-red-500" : "text-white/10"} transition-all`} />
                ))}
            </div>
         </div>
         <div className="flex items-center gap-4">
            {equippedArtifactId && (
                <button onClick={handleActivateArtifact} disabled={artifactEnergy < 100 || isArtifactActive} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${artifactEnergy >= 100 ? 'bg-white text-indigo-600 shadow-glow animate-bounce border-white' : 'bg-white/10 text-white/20 cursor-not-allowed border-transparent'}`}><Gem size={24} /></button>
            )}
            <button onClick={onExit} className="text-white/50 hover:text-white"><X size={32}/></button>
         </div>
      </div>

      {/* MAIN GAME AREA - FLEX GROW FOR VISUAL, BOTTOM FIXED FOR BUTTONS */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 w-full max-w-4xl mx-auto">
        
        {/* PET & AI (Hidden in Zen Mode) */}
        {!isZenMode && (
            <div className="absolute top-4 left-4 md:top-10 md:left-0 z-0 opacity-50 md:opacity-100 transition-opacity">
                {petState && <StarPet stage={petState.stage} mood={activeEvent ? 'HAPPY' : streak >= 5 ? 'DANCING' : isCorrect === false ? 'SAD' : 'HAPPY'} size="sm" />}
                {aiMessage && <div className="absolute top-full mt-2 w-48 animate-pop-in"><StarPetAI message={aiMessage} isThinking={isAiThinking} /></div>}
            </div>
        )}

        {/* --- TRI-FORCE INTERFACE --- */}
        {/* Shrink on mobile to give space for buttons */}
        <div className="relative w-full max-w-[280px] aspect-square md:max-w-[400px] mb-4 sm:mb-12">
            {/* Holographic Triangle Lines */}
            <svg className={`absolute inset-0 w-full h-full z-0 ${isHighContrast ? '' : 'drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}>
                <defs>
                    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                </defs>
                <path 
                    d="M 50% 10% L 10% 90% L 90% 90% Z" 
                    fill="none" 
                    stroke={isHighContrast ? "#FFFFFF" : isCorrect ? "url(#neonGrad)" : "#1e1b4b"} 
                    strokeWidth={isCorrect ? "6" : "4"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-all duration-500 ${isCorrect && !isHighContrast ? 'opacity-100 filter drop-shadow-[0_0_15px_#22d3ee]' : isHighContrast ? 'opacity-100' : 'opacity-30'}`}
                />
                
                {/* Connecting Beams (Only on correct) */}
                {isCorrect && !isZenMode && !isHighContrast && (
                    <>
                        <circle cx="50%" cy="10%" r="4" fill="#fff" className="animate-ping" />
                        <circle cx="10%" cy="90%" r="4" fill="#fff" className="animate-ping" style={{animationDelay: '0.1s'}} />
                        <circle cx="90%" cy="90%" r="4" fill="#fff" className="animate-ping" style={{animationDelay: '0.2s'}} />
                    </>
                )}
            </svg>

            {/* Operator Symbol */}
            <div className={`absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black ${isHighContrast ? 'text-white' : 'text-white/20'}`}>
                {currentQ?.type === 'mult' ? '×' : '÷'}
            </div>

            {/* Nodes */}
            {currentQ && (
                <>
                    <Node type="top" val={currentQ.triad.top} active={isCorrect === true} isTarget={currentQ.missing === 'top'} />
                    <Node type="left" val={currentQ.triad.left} active={isCorrect === true} isTarget={currentQ.missing === 'left'} />
                    <Node type="right" val={currentQ.triad.right} active={isCorrect === true} isTarget={currentQ.missing === 'right'} />
                </>
            )}
        </div>

        {/* THUMB ZONE SPACER */}
        <div className="flex-1"></div>

        {/* --- DATA ORBS (OPTIONS) --- */}
        <div className="grid grid-cols-3 gap-3 md:gap-8 w-full max-w-2xl relative z-30 mb-4 sm:mb-8">
            {currentQ?.options.map(opt => {
                const isSelected = selectedOption === opt;
                const isCorrectOption = opt === currentQ.a;
                
                // If we selected this and it's correct, it "teleports" (hides here, appears in triangle)
                const isHidden = isCorrect === true && isCorrectOption;

                // High Contrast Button Styles
                let btnStyle = "";
                if (isHighContrast) {
                    if (isSelected) {
                        btnStyle = isCorrectOption ? 'bg-white text-black border-4 border-black' : 'bg-white text-black border-4 border-black animate-shake';
                    } else {
                        btnStyle = 'bg-black border-4 border-white text-white active:bg-gray-800';
                    }
                } else {
                    if (isSelected) {
                        btnStyle = isCorrectOption ? 'bg-cyan-500 text-black shadow-[0_0_50px_#22d3ee] scale-110' : 'bg-red-500 text-white animate-shake';
                    } else {
                        btnStyle = 'bg-slate-800/80 border-b-[6px] border-black/30 text-white active:border-b-0 active:translate-y-1 active:bg-slate-700 shadow-lg backdrop-blur-md';
                    }
                }

                return (
                    <button 
                        key={opt} 
                        onClick={() => handleAnswer(opt)} 
                        disabled={selectedOption !== null}
                        className={`
                            h-20 sm:h-24 md:h-28 rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-black transition-all duration-100 touch-manipulation
                            ${isHidden ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
                            ${btnStyle}
                        `}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>

      </div>

      {/* FOOTER */}
      {!isZenMode && (
          <div className="px-6 pb-2 flex justify-between text-white/30 font-black text-lg uppercase tracking-widest">
              <div>Combo x{streak}</div>
              <div>{currentIndex + 1} / {questions.length}</div>
          </div>
      )}

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>
    </div>
  );
};
