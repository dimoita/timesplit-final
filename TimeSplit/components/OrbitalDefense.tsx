
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, X, Zap, Shield, Skull, Crosshair, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { LevelConfig } from '../data/LevelConfig';
import { GameStats } from './GameArena';

interface OrbitalDefenseProps {
  levelConfig: LevelConfig;
  onExit: () => void;
  onComplete: (stats: GameStats) => void;
  childName: string;
  avatar: string;
  mastery: Record<string, number>;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  expression: string;
  answer: number;
  speed: number;
  type: 'ASTEROID' | 'SHIP' | 'BOSS_MINION';
  hp: number;
  maxHp: number;
  isTarget: boolean;
}

interface Laser {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  age: number; // 0 to 1
  hit: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const OrbitalDefense: React.FC<OrbitalDefenseProps> = ({
  levelConfig,
  onExit,
  onComplete,
  childName,
  avatar,
  mastery
}) => {
  // Game State
  const [gameState, setGameState] = useState<'INTRO' | 'PLAYING' | 'VICTORY' | 'DEFEAT'>('INTRO');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [input, setInput] = useState('');
  const [inputShake, setInputShake] = useState(false);
  
  // Refs for Loop
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const enemiesRef = useRef<Enemy[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const spawnTimerRef = useRef(0);
  const nextSpawnId = useRef(0);
  
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { playLaser, playDamage, playWin, playCorrect, playGameOver, playChargeUp } = useGameSound();

  // --- CONFIGURATION ---
  const SPAWN_RATE = 2000; // ms
  const BASE_SPEED = levelConfig.id * 0.05 + 0.2; // Speed scales with level
  const TOTAL_WAVES = 3;
  const ENEMIES_PER_WAVE = 5 + levelConfig.id;

  // --- GAME LOOP ---
  const animate = useCallback((time: number) => {
    if (gameState !== 'PLAYING') return;
    
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Ensure canvas size matches
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. SPAWN LOGIC
    spawnTimerRef.current += deltaTime;
    if (spawnTimerRef.current > SPAWN_RATE && enemiesRef.current.length < 5) { // Cap active enemies
        spawnEnemy(width);
        spawnTimerRef.current = 0;
    }

    // 2. UPDATE ENEMIES
    // Find active target (lowest Y)
    let lowestY = -1;
    let targetId = -1;

    enemiesRef.current.forEach(e => {
        e.y += e.speed * (deltaTime / 16);
        if (e.y > lowestY) {
            lowestY = e.y;
            targetId = e.id;
        }
    });

    // Mark target
    enemiesRef.current.forEach(e => e.isTarget = (e.id === targetId));

    // Collision Check (Bottom Line)
    const shipY = height - 180; // Approximate ship top
    enemiesRef.current = enemiesRef.current.filter(e => {
        if (e.y >= shipY) {
            handlePlayerHit();
            return false;
        }
        return true;
    });

    // 3. RENDER ENEMIES
    enemiesRef.current.forEach(e => {
        // Body
        ctx.fillStyle = e.isTarget ? '#EF4444' : '#64748B';
        ctx.beginPath();
        ctx.arc(e.x, e.y, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow if target
        if (e.isTarget) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#EF4444';
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#fff';
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.expression, e.x, e.y);
    });

    // 4. UPDATE & RENDER LASERS
    lasersRef.current = lasersRef.current.filter(l => l.age > 0);
    lasersRef.current.forEach(l => {
        l.age -= 0.1;
        
        ctx.beginPath();
        ctx.moveTo(l.startX, l.startY);
        ctx.lineTo(l.endX, l.endY);
        ctx.lineWidth = 4 * l.age;
        ctx.strokeStyle = `rgba(56, 189, 248, ${l.age})`;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Hit flash
        if (l.hit && l.age > 0.8) {
            ctx.beginPath();
            ctx.arc(l.endX, l.endY, 20, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${l.age})`;
            ctx.fill();
        }
    });

    // 5. UPDATE & RENDER PARTICLES
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.random() * 4 + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    // Loop
    requestRef.current = requestAnimationFrame(animate);
  }, [gameState, levelConfig]); // Dependencies

  // --- LOCAL SPAWNER ---
  const spawnEnemy = (width: number) => {
      // Local math generation based on level config factors
      const factors = levelConfig.factors;
      const f1 = factors[Math.floor(Math.random() * factors.length)];
      const f2 = Math.floor(Math.random() * 9) + 1;
      
      const isMult = Math.random() > 0.3; // Mostly mult
      const expression = isMult ? `${f1} × ${f2}` : `${f1*f2} ÷ ${f1}`;
      const answer = isMult ? f1 * f2 : f2;

      enemiesRef.current.push({
          id: nextSpawnId.current++,
          x: Math.random() * (width - 100) + 50,
          y: -50,
          expression,
          answer,
          speed: BASE_SPEED + (Math.random() * 0.2),
          type: 'ASTEROID',
          hp: 1,
          maxHp: 1,
          isTarget: false
      });
  };

  const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 15; i++) {
          particlesRef.current.push({
              id: Math.random(),
              x, y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              life: 1.0,
              color: color
          });
      }
  };

  const handlePlayerHit = () => {
      playDamage();
      setLives(prev => {
          const next = prev - 1;
          if (next <= 0) {
              setGameState('DEFEAT');
              playGameOver();
          }
          return next;
      });
      
      // Screen shake visual handled by CSS state in render
      const container = containerRef.current;
      if (container) {
          container.classList.add('animate-shake');
          setTimeout(() => container.classList.remove('animate-shake'), 500);
      }
  };

  // --- INPUT HANDLING ---
  const handleFire = () => {
      const val = parseInt(input);
      if (isNaN(val)) return;

      // Find Target
      const target = enemiesRef.current.find(e => e.isTarget);
      
      if (target) {
          if (val === target.answer) {
              // HIT!
              playLaser();
              
              // Laser Visual
              if (containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  const startX = rect.width / 2;
                  const startY = rect.height - 100; // Ship nose
                  
                  lasersRef.current.push({
                      id: Date.now(),
                      startX, startY,
                      endX: target.x,
                      endY: target.y,
                      age: 1.0,
                      hit: true
                  });
              }

              // Destroy Enemy
              createExplosion(target.x, target.y, '#FACC15');
              enemiesRef.current = enemiesRef.current.filter(e => e.id !== target.id);
              
              setScore(s => s + 100);
              setInput('');
              
              // Check Win Condition (Score based for now)
              if (score > 1000) { // Arbitrary win condition for prototype
                  setGameState('VICTORY');
                  playWin();
                  onComplete({
                      stars: 3,
                      accuracy: 1,
                      maxStreak: 10,
                      livesRemaining: lives,
                      speedBonus: true,
                      correctCount: 20,
                      totalQuestions: 20,
                      earnedCoins: 300,
                      earnedItems: [],
                      earnedArtifact: undefined
                  });
              }

          } else {
              // MISS
              playDamage(); // Error sound
              setInput('');
              setInputShake(true);
              setTimeout(() => setInputShake(false), 300);
          }
      }
  };

  const handleNumPress = (num: number) => {
      if (input.length < 3) {
          setInput(prev => prev + num.toString());
          playCorrect('trail_default'); // Click sound
      }
  };

  const handleBackspace = () => {
      setInput(prev => prev.slice(0, -1));
  };

  // Lifecycle
  useEffect(() => {
      if (gameState === 'PLAYING') {
          lastTimeRef.current = performance.now();
          requestRef.current = requestAnimationFrame(animate);
      }
      return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, animate]);

  // Intro Timer
  useEffect(() => {
      if (gameState === 'INTRO') {
          playChargeUp();
          const t = setTimeout(() => {
              setGameState('PLAYING');
          }, 3000);
          return () => clearTimeout(t);
      }
  }, []);

  // --- RENDER ---
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col font-nunito overflow-hidden">
        
        {/* GAME LAYER */}
        <div ref={containerRef} className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
            <canvas ref={canvasRef} className="absolute inset-0 z-10" />
            
            {/* HUD */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                {[...Array(3)].map((_, i) => (
                    <Heart key={i} size={24} className={i < lives ? "text-red-500 fill-red-500" : "text-gray-700"} />
                ))}
            </div>
            <div className="absolute top-4 right-4 z-20 text-white font-black text-xl flex items-center gap-2">
                <Zap size={20} className="text-yellow-400" /> {score}
            </div>

            {/* PLAYER SHIP */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 transition-transform duration-100" style={{ transform: `translateX(-50%) scale(${inputShake ? 0.9 : 1})` }}>
                <div className="text-6xl filter drop-shadow-[0_0_20px_rgba(56,189,248,0.8)] relative">
                    {avatar}
                    {/* Engine Thruster */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-12 bg-blue-500 blur-md animate-pulse"></div>
                </div>
            </div>

            {/* START OVERLAY */}
            {gameState === 'INTRO' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="text-center animate-pulse">
                        <div className="text-red-500 font-black text-4xl mb-4 tracking-[0.5em] uppercase">Orbital Defense</div>
                        <div className="text-white text-xl">Protect the Core!</div>
                    </div>
                </div>
            )}

            {/* DEFEAT OVERLAY */}
            {gameState === 'DEFEAT' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-900/90 backdrop-blur-sm">
                    <div className="text-center">
                        <Skull size={80} className="text-white mx-auto mb-4" />
                        <h2 className="text-4xl font-black text-white mb-6">MISSION FAILED</h2>
                        <Button onClick={() => { setLives(3); setScore(0); enemiesRef.current=[]; setGameState('PLAYING'); }} className="bg-white text-red-900 hover:bg-gray-200">
                            RETRY MISSION
                        </Button>
                        <button onClick={onExit} className="block mt-4 text-white/70 font-bold hover:text-white">ABORT</button>
                    </div>
                </div>
            )}
        </div>

        {/* CONTROLS LAYER (TACTICAL NUMPAD) */}
        <div className="bg-slate-900 border-t-4 border-slate-700 p-4 pb-8 z-30 shadow-2xl relative">
            
            {/* Input Display (Holographic) */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <div className={`
                    bg-slate-900/90 border-2 ${inputShake ? 'border-red-500 text-red-500 translate-x-1' : 'border-cyan-500 text-cyan-400'} 
                    rounded-xl px-8 py-3 min-w-[160px] text-center shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md transition-all
                `}>
                    <span className="font-mono text-3xl font-black tracking-widest">{input || "_"}</span>
                </div>
            </div>

            <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <button
                        key={n}
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-100 font-black text-2xl py-4 rounded-lg border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all"
                        onClick={() => handleNumPress(n)}
                    >
                        {n}
                    </button>
                ))}
                <button 
                    className="bg-red-900/50 hover:bg-red-900 text-red-200 font-bold py-4 rounded-lg border-b-4 border-red-950 active:border-b-0 active:translate-y-1 flex items-center justify-center"
                    onClick={handleBackspace}
                >
                    <span className="text-sm uppercase tracking-wider">DEL</span>
                </button>
                <button 
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-100 font-black text-2xl py-4 rounded-lg border-b-4 border-slate-950 active:border-b-0 active:translate-y-1"
                    onClick={() => handleNumPress(0)}
                >
                    0
                </button>
                <button 
                    className={`bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xl py-4 rounded-lg border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.4)] ${input.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleFire}
                    disabled={input.length === 0}
                >
                    FIRE
                </button>
            </div>
        </div>

    </div>
  );
};
