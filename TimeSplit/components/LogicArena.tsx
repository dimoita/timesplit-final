
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Ruler, Hammer, Truck, AlertTriangle, CheckCircle2, Construction, Calculator, RotateCcw, Play, Hand, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

interface LogicArenaProps {
  onExit: () => void;
  onComplete: (score: number) => void;
}

interface BlueprintProblem {
  id: number;
  gapWidth: number; // The "Product" (e.g., 56m)
  beamLength: number; // The "Factor" (e.g., 8m)
  answer: number; // The "Quotient" (e.g., 7)
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export const LogicArena: React.FC<LogicArenaProps> = ({ onExit, onComplete }) => {
  const [phase, setPhase] = useState<'BRIEFING' | 'BUILDING' | 'SIMULATING' | 'RESULT'>('BRIEFING');
  const [problems, setProblems] = useState<BlueprintProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBeams, setSelectedBeams] = useState(1);
  const [simulationState, setSimulationState] = useState<'IDLE' | 'WELDING' | 'CROSSING' | 'COLLAPSE' | 'SUCCESS'>('IDLE');
  const [score, setScore] = useState(0);
  
  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const { playAttack, playWin, playDamage, playCorrect } = useGameSound();

  // LOCAL GENERATOR: Ensure fully offline logic
  useEffect(() => {
    const newProblems: BlueprintProblem[] = [];
    
    // Generate 5 procedurally increasing difficulty problems
    for (let i = 0; i < 5; i++) {
        // Factors shift from smaller (4-6) to larger (7-9)
        const beam = Math.floor(Math.random() * 4) + (i > 2 ? 6 : 3); 
        const count = Math.floor(Math.random() * 5) + 3; // 3 to 8 spans
        
        newProblems.push({
            id: i,
            gapWidth: beam * count,
            beamLength: beam,
            answer: count,
            difficulty: i > 3 ? 'HARD' : 'MEDIUM'
        });
    }
    setProblems(newProblems);
  }, []);

  // Check for Tutorial on Phase Change
  useEffect(() => {
      if (phase === 'BUILDING' && currentIndex === 0) {
          const hasDoneTutorial = localStorage.getItem('logic_tutorial_completed');
          if (!hasDoneTutorial) {
              setShowTutorial(true);
              setTutorialStep(0);
          }
      }
  }, [phase, currentIndex]);

  const handleTutorialNext = () => {
      playCorrect();
      if (tutorialStep < 3) {
          setTutorialStep(prev => prev + 1);
      } else {
          // Finish
          setShowTutorial(false);
          localStorage.setItem('logic_tutorial_completed', 'true');
      }
  };

  const skipTutorial = () => {
      setShowTutorial(false);
      localStorage.setItem('logic_tutorial_completed', 'true');
  };

  const currentProblem = problems[currentIndex];

  // --- CONTROLS ---
  const adjustBeams = (delta: number) => {
      const newVal = Math.max(1, Math.min(12, selectedBeams + delta));
      if (newVal !== selectedBeams) {
          setSelectedBeams(newVal);
          playAttack(); // Mechanical click sound
      }
  };

  const startSimulation = () => {
      if (showTutorial) {
          if (tutorialStep === 3) {
              handleTutorialNext(); // Finish tutorial
          } else {
              return; // Prevent starting if not on last step
          }
      }

      setPhase('SIMULATING');
      setSimulationState('WELDING');
      
      // Sequence: Welding -> Crossing -> Result
      setTimeout(() => {
          setSimulationState('CROSSING');
          
          // Determine outcome
          const isCorrect = selectedBeams === currentProblem.answer;
          
          setTimeout(() => {
              if (isCorrect) {
                  setSimulationState('SUCCESS');
                  playWin();
                  setScore(s => s + 100);
              } else {
                  setSimulationState('COLLAPSE');
                  playDamage();
              }
          }, 2000); // Truck travel time
          
      }, 1500); // Welding time
  };

  const handleNext = () => {
      if (currentIndex < problems.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setPhase('BRIEFING');
          setSimulationState('IDLE');
          setSelectedBeams(1);
      } else {
          onComplete(score);
      }
  };

  const handleRetry = () => {
      setPhase('BUILDING');
      setSimulationState('IDLE');
      setSelectedBeams(1);
  };

  if (!currentProblem) return <div className="bg-[#1e3a8a] min-h-screen text-white flex items-center justify-center font-mono">LOADING BLUEPRINTS...</div>;

  // --- TUTORIAL HIGHLIGHT LOGIC ---
  const getHighlightClass = (stepTarget: number) => {
      if (showTutorial && tutorialStep === stepTarget) {
          return "z-50 relative ring-4 ring-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] bg-slate-900/80 transition-all duration-300";
      }
      return "";
  };

  // --- TUTORIAL CONTENT ---
  const TUTORIAL_STEPS = [
      {
          title: "Analyze the Gap",
          text: `Enginner! We have a ${currentProblem.gapWidth} meter gap to cross. The truck cannot fly.`,
          pos: "bottom-32 left-1/2 -translate-x-1/2"
      },
      {
          title: "Check Inventory",
          text: `We only have ${currentProblem.beamLength} meter steel beams in stock for this project.`,
          pos: "top-32 right-4"
      },
      {
          title: "The Math",
          text: `Use the Blueprint Computer. Total Gap ÷ Beam Length = How many we need.`,
          pos: "bottom-32 left-8"
      },
      {
          title: "Build & Test",
          text: `Adjust the quantity until the math works, then hit the button to test stability!`,
          pos: "bottom-48 right-8"
      }
  ];

  return (
    <div className="min-h-screen bg-[#172554] font-mono text-blue-100 flex flex-col relative overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* TUTORIAL OVERLAY */}
      {showTutorial && (
          <div className="fixed inset-0 bg-black/80 z-40 animate-in fade-in duration-500">
              {/* Architect Dialog */}
              <div className={`absolute ${TUTORIAL_STEPS[tutorialStep].pos} max-w-sm w-full bg-blue-600 border-2 border-white/50 text-white p-6 rounded-none shadow-2xl transition-all duration-500`}>
                  <div className="absolute -top-4 -left-4 bg-yellow-400 border-2 border-black p-2 shadow-lg">
                      <Construction className="text-black" size={32} />
                  </div>
                  
                  <h3 className="font-black text-yellow-400 uppercase tracking-widest text-lg mb-2 pl-8">
                      {TUTORIAL_STEPS[tutorialStep].title}
                  </h3>
                  
                  <p className="font-bold text-sm leading-relaxed mb-6 border-l-2 border-white/20 pl-4">
                      {TUTORIAL_STEPS[tutorialStep].text}
                  </p>

                  <div className="flex justify-between items-center">
                      <button onClick={skipTutorial} className="text-xs font-bold text-blue-200 hover:text-white underline">
                          Skip Training
                      </button>
                      
                      {/* Only show Next button for first steps, last step relies on Build button */}
                      {tutorialStep < 3 && (
                          <button onClick={handleTutorialNext} className="bg-white text-blue-900 font-black px-6 py-2 hover:bg-yellow-400 transition-colors uppercase text-sm flex items-center gap-2">
                              Next <ArrowLeft className="rotate-180" size={14} />
                          </button>
                      )}
                      
                      {tutorialStep === 3 && (
                          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm animate-pulse">
                              <Hand className="rotate-90" /> Click Build Button
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* BACKGROUND GRID (Blueprint Paper) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

      {/* HEADER HUD */}
      <div className={`relative z-10 border-b-2 border-blue-400/30 bg-[#1e3a8a]/90 backdrop-blur p-4 flex justify-between items-center shadow-lg transition-all duration-300 ${showTutorial && tutorialStep !== 1 ? 'opacity-30' : 'opacity-100'} ${getHighlightClass(1)}`}>
          <div className="flex items-center gap-4">
              <button onClick={onExit} className="hover:text-white transition-colors" disabled={showTutorial}><ArrowLeft /></button>
              <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Project ID</div>
                  <div className="text-xl font-bold text-white">#00{currentProblem.id + 1}</div>
              </div>
          </div>
          
          <div className="flex gap-6 text-center">
              <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Target Gap</div>
                  <div className="text-xl font-bold text-white">{currentProblem.gapWidth}m</div>
              </div>
              <div className={`transition-transform duration-300 ${showTutorial && tutorialStep === 1 ? 'scale-125' : ''}`}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Inventory</div>
                  <div className="text-xl font-bold text-white">{currentProblem.beamLength}m Beams</div>
              </div>
          </div>

          <div className="bg-blue-900/50 border border-blue-500/50 px-4 py-2 rounded font-bold text-blue-200">
              SCORE: {score}
          </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden">
          
          {/* PHASE: BRIEFING */}
          {phase === 'BRIEFING' && (
              <div className="max-w-md w-full bg-[#1e40af]/90 border-2 border-blue-400 p-8 rounded-sm shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-in fade-in zoom-in duration-300 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white -mb-1 -mr-1"></div>

                  <div className="flex items-center gap-3 mb-6 border-b border-blue-400/30 pb-4">
                      <Construction className="text-yellow-400" size={32} />
                      <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Engineering Brief</h2>
                  </div>
                  
                  <div className="space-y-4 mb-8 text-blue-100 text-sm md:text-base">
                      <p>
                          <span className="text-blue-300 font-bold uppercase mr-2">Obstacle:</span>
                          Gap detected at <span className="text-white font-bold">{currentProblem.gapWidth} meters</span>.
                      </p>
                      <p>
                          <span className="text-blue-300 font-bold uppercase mr-2">Resources:</span>
                          Standard <span className="text-white font-bold">{currentProblem.beamLength} meter</span> steel beams available.
                      </p>
                      <p>
                          <span className="text-blue-300 font-bold uppercase mr-2">Objective:</span>
                          Calculate exact beam count required for structural integrity.
                      </p>
                  </div>

                  <Button onClick={() => setPhase('BUILDING')} className="w-full h-14 bg-blue-500 hover:bg-blue-400 text-white border-none rounded-none font-bold text-lg uppercase tracking-widest shadow-lg">
                      Open Blueprint <Ruler className="ml-2" />
                  </Button>
              </div>
          )}

          {/* PHASE: BUILDING & SIMULATING */}
          {(phase === 'BUILDING' || phase === 'SIMULATING' || phase === 'RESULT') && (
              <div className="w-full max-w-5xl flex flex-col items-center">
                  
                  {/* SIMULATION AREA */}
                  <div className={`relative w-full h-64 md:h-80 bg-[#0f172a]/50 border-y-4 border-slate-700 mb-8 flex items-end justify-center overflow-hidden rounded-lg ${getHighlightClass(0)}`}>
                      
                      {/* Left Cliff */}
                      <div className="absolute left-0 bottom-0 w-[10%] h-full bg-slate-800 border-r-4 border-slate-600 z-10">
                          <div className="absolute top-0 right-0 w-full h-4 bg-yellow-500/20 striped-pattern"></div>
                      </div>
                      
                      {/* Right Cliff */}
                      <div className="absolute right-0 bottom-0 w-[10%] h-full bg-slate-800 border-l-4 border-slate-600 z-10">
                          <div className="absolute top-0 left-0 w-full h-4 bg-yellow-500/20 striped-pattern"></div>
                      </div>

                      {/* THE GAP (Visualized) */}
                      <div className="relative h-full flex flex-col justify-between w-[80%]">
                          
                          {/* Measurement Line */}
                          <div className="absolute top-4 left-0 w-full flex flex-col items-center animate-pulse">
                              <div className="w-full h-px bg-blue-400 relative">
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-3 bg-blue-400"></div>
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-3 bg-blue-400"></div>
                              </div>
                              <div className="bg-[#172554] px-2 -mt-2.5 text-xs font-bold text-blue-300">
                                  {currentProblem.gapWidth}m
                              </div>
                          </div>

                          {/* THE BRIDGE */}
                          <div className={`absolute top-1/2 -translate-y-1/2 left-0 h-4 bg-transparent flex transition-transform duration-500 w-full ${simulationState === 'COLLAPSE' ? 'origin-left rotate-12 translate-y-12 opacity-50' : ''}`}>
                              {Array.from({ length: selectedBeams }).map((_, i) => (
                                  <div 
                                    key={i} 
                                    className="h-8 border-2 border-blue-300 bg-blue-500/20 relative flex items-center justify-center animate-slide-in-right"
                                    style={{ width: `${(100 / selectedBeams)}%`, animationDelay: `${i * 0.1}s` }}
                                  >
                                      {/* Beam Detail */}
                                      <div className="w-full h-px bg-blue-300/30 absolute top-1/2"></div>
                                      <div className="w-px h-full bg-blue-300/30 absolute left-1/4"></div>
                                      <div className="w-px h-full bg-blue-300/30 absolute right-1/4"></div>
                                      
                                      {/* Measurement per beam */}
                                      <span className="text-[10px] text-blue-200 font-bold bg-[#172554]/80 px-1 absolute -bottom-6">
                                          {currentProblem.beamLength}m
                                      </span>

                                      {/* Welding Sparks */}
                                      {simulationState === 'WELDING' && (
                                          <div className="absolute right-0 -mr-2 top-1/2 -translate-y-1/2 z-20">
                                              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                                              <div className="absolute inset-0 bg-white blur-md animate-pulse"></div>
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>

                          {/* THE TRUCK */}
                          {simulationState === 'CROSSING' && (
                              <div className="absolute top-[35%] left-0 z-20 animate-drive-across">
                                  <Truck size={48} className="text-yellow-500 fill-yellow-500 drop-shadow-lg" />
                              </div>
                          )}
                          {simulationState === 'SUCCESS' && (
                              <div className="absolute top-[35%] right-0 z-20">
                                  <Truck size={48} className="text-green-500 fill-green-500 drop-shadow-lg" />
                              </div>
                          )}
                          {simulationState === 'COLLAPSE' && (
                              <div className="absolute top-[60%] left-1/2 z-20 rotate-45 text-red-500">
                                  <Truck size={48} className="fill-red-500 drop-shadow-lg" />
                              </div>
                          )}

                      </div>
                  </div>

                  {/* CONTROL PANEL */}
                  <div className={`bg-[#1e40af]/50 border-t-4 border-blue-500 w-full max-w-3xl rounded-b-xl p-6 flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl relative transition-all duration-300 ${showTutorial && tutorialStep !== 0 ? 'opacity-100' : showTutorial ? 'opacity-30' : 'opacity-100'}`}>
                      {/* Background Texture */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5 pointer-events-none"></div>

                      {/* Input Section */}
                      <div className={`flex-1 w-full text-center md:text-left p-2 rounded-lg ${getHighlightClass(3)}`}>
                          <label className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2 block">Beam Quantity Selector</label>
                          <div className="flex items-center justify-center md:justify-start gap-4">
                              <button 
                                onClick={() => adjustBeams(-1)}
                                disabled={phase !== 'BUILDING'}
                                className="w-12 h-12 bg-[#0f172a] border-2 border-blue-500 text-blue-400 rounded hover:bg-blue-900 transition-colors disabled:opacity-50 font-bold text-2xl"
                              >
                                  -
                              </button>
                              
                              <div className="bg-black/40 w-32 h-12 flex items-center justify-center border border-blue-500/30 text-3xl font-black text-white font-mono shadow-inner">
                                  {selectedBeams}
                              </div>

                              <button 
                                onClick={() => adjustBeams(1)}
                                disabled={phase !== 'BUILDING'}
                                className="w-12 h-12 bg-[#0f172a] border-2 border-blue-500 text-blue-400 rounded hover:bg-blue-900 transition-colors disabled:opacity-50 font-bold text-2xl"
                              >
                                  +
                              </button>
                          </div>
                      </div>

                      {/* Calculation Preview */}
                      <div className={`flex-1 bg-black/20 p-4 rounded border border-blue-500/20 font-mono text-sm text-blue-200 ${getHighlightClass(2)}`}>
                          <div className="flex justify-between mb-1">
                              <span>UNIT LENGTH:</span>
                              <span>{currentProblem.beamLength}m</span>
                          </div>
                          <div className="flex justify-between mb-1">
                              <span>QUANTITY:</span>
                              <span>x {selectedBeams}</span>
                          </div>
                          <div className="w-full h-px bg-blue-500/50 my-1"></div>
                          <div className="flex justify-between text-white font-bold">
                              <span>TOTAL SPAN:</span>
                              <span className={selectedBeams * currentProblem.beamLength === currentProblem.gapWidth ? "text-green-400" : "text-white"}>
                                  {selectedBeams * currentProblem.beamLength}m
                              </span>
                          </div>
                      </div>

                      {/* Action Button */}
                      <div className={`w-full md:w-auto p-1 rounded-lg ${getHighlightClass(3)}`}>
                          {phase === 'BUILDING' && (
                              <Button 
                                onClick={startSimulation}
                                className={`w-full h-16 bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-700 shadow-[0_0_20px_rgba(234,179,8,0.4)] ${showTutorial && tutorialStep === 3 ? 'animate-bounce' : 'animate-pulse'}`}
                              >
                                  <Hammer className="mr-2" /> BUILD & TEST
                              </Button>
                          )}
                          {phase === 'SIMULATING' && (
                              <div className="h-16 flex items-center justify-center text-blue-300 font-bold uppercase tracking-widest animate-pulse">
                                  {simulationState === 'WELDING' ? 'Welding Joints...' : 'Testing Load...'}
                              </div>
                          )}
                          {simulationState === 'SUCCESS' && (
                              <Button onClick={handleNext} className="w-full h-16 bg-green-500 hover:bg-green-400 border-green-700 text-white">
                                  <CheckCircle2 className="mr-2" /> PROJECT APPROVED
                              </Button>
                          )}
                          {simulationState === 'COLLAPSE' && (
                              <Button onClick={handleRetry} className="w-full h-16 bg-red-500 hover:bg-red-400 border-red-700 text-white">
                                  <RotateCcw className="mr-2" /> RE-ENGINEER
                              </Button>
                          )}
                      </div>
                  </div>

              </div>
          )}

      </div>

      <style>{`
        .striped-pattern {
            background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px);
            opacity: 0.1;
        }
        @keyframes drive-across {
            0% { left: 0%; }
            100% { left: 85%; }
        }
        .animate-drive-across {
            animation: drive-across 2s ease-in-out forwards;
        }
        @keyframes slide-in-right {
            from { opacity: 0; width: 0; }
            to { opacity: 1; }
        }
        .animate-slide-in-right {
            animation: slide-in-right 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
