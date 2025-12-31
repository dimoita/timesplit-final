
import React, { useEffect, useRef, useMemo } from 'react';
import { Lock, Star, Skull, Play, Check, MapPin, Zap, Thermometer, AlertCircle, BookOpen } from 'lucide-react';
import { LevelConfig } from '../data/LevelConfig';

interface SagaMapProps {
  levels: LevelConfig[];
  unlockedLevel: number;
  onLevelClick: (id: number) => void;
  currentAvatar: string;
  isPremium?: boolean; 
  isCooledDown?: boolean; 
  onAlgebraTrigger?: () => void; // New trigger
}

export const SagaMap: React.FC<SagaMapProps> = ({ levels, unlockedLevel, onLevelClick, currentAvatar, isPremium = false, isCooledDown = false, onAlgebraTrigger }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- CONFIGURATION ---
  const VIEW_WIDTH = 400; // SVG internal coordinate width
  const NODE_SPACING = 150; // Vertical distance between nodes
  const PADDING_TOP = 250; // Extra space for Algebra Node
  const PADDING_BOTTOM = 150;
  const AMPLITUDE = 120; // How wide the path swings (X axis)

  // Calculate total height needed
  const totalHeight = (levels.length - 1) * NODE_SPACING + PADDING_TOP + PADDING_BOTTOM;

  // --- COORDINATE MATH ---
  const points = useMemo(() => {
    return levels.map((_, index) => {
      // Level 1 is at the bottom (index 0)
      const reversedIndex = index; 
      
      const y = totalHeight - PADDING_BOTTOM - (reversedIndex * NODE_SPACING);
      
      // Create a winding path using Sine wave
      // Adjust frequency so it winds pleasantly (approx 1 full cycle every 4-5 nodes)
      const x = (VIEW_WIDTH / 2) + AMPLITUDE * Math.sin(reversedIndex * 0.8);
      
      return { x, y, level: levels[index] };
    });
  }, [levels, totalHeight]);

  // Algebra Node Position (Above Level 10)
  const algebraNode = {
      x: VIEW_WIDTH / 2,
      y: 80 // Top area
  };

  // --- SCROLL TO CURRENT LEVEL ---
  useEffect(() => {
    if (containerRef.current) {
      // Find the active level point
      const activeIndex = Math.min(unlockedLevel - 1, levels.length - 1);
      
      const domNode = document.getElementById(`saga-node-${levels[activeIndex].id}`);
      if (domNode) {
          domNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [unlockedLevel, levels, points]);

  // --- PATH GENERATION ---
  const pathData = useMemo(() => {
    if (points.length === 0) return '';
    
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      
      const cp1x = p0.x;
      const cp1y = (p0.y + p1.y) / 2;
      const cp2x = p1.x;
      const cp2y = (p0.y + p1.y) / 2;
      
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    
    return d;
  }, [points]);

  return (
    <div 
        ref={containerRef} 
        className="w-full h-[600px] overflow-y-auto relative bg-[#020617] rounded-3xl border-4 border-slate-800 shadow-2xl custom-scrollbar overscroll-contain"
    >
        {/* --- BIOME BACKGROUNDS --- */}
        <div className="absolute top-0 left-0 w-full h-full min-h-[1500px]" style={{ height: totalHeight }}>
            {/* Sector 3: Quantum Void (Top) */}
            <div className="absolute top-0 w-full h-[35%] bg-gradient-to-b from-black via-[#1e1b4b] to-transparent opacity-80">
                <div className="absolute top-20 right-10 text-cyan-500/20 animate-pulse text-6xl">⚛</div>
                <div className="absolute top-40 left-10 text-purple-500/20 animate-float text-4xl">◈</div>
            </div>
            
            {/* Sector 2: Logic Labs (Middle) */}
            <div className="absolute top-[35%] w-full h-[35%] bg-gradient-to-b from-transparent via-amber-900/20 to-transparent">
                <div className="absolute top-1/2 right-20 text-amber-500/10 text-8xl">⚙️</div>
            </div>

            {/* Sector 1: The Core (Bottom) */}
            <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-indigo-900/40 to-transparent">
                <div className="absolute bottom-20 left-10 text-blue-500/20 animate-float-delayed text-6xl">●</div>
            </div>

            {/* Starfield */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
        </div>

        {/* --- SVG MAP LAYER --- */}
        <svg 
            width="100%" 
            viewBox={`0 0 ${VIEW_WIDTH} ${totalHeight}`} 
            className="relative z-10"
            style={{ minHeight: totalHeight }}
        >
            {/* 1. The Path (Background/Locked) */}
            <path 
                d={pathData} 
                fill="none" 
                stroke="#1e293b" 
                strokeWidth="20" 
                strokeLinecap="round" 
            />
            
            {/* 2. The Path (Progress/Unlocked) */}
            {unlockedLevel > 1 && (
                <path 
                    d={pathData} 
                    fill="none" 
                    stroke="url(#progressGradient)" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    strokeDasharray={`${(unlockedLevel / levels.length) * 2000} 3000`} 
                    className="opacity-50"
                />
            )}

            <defs>
                <linearGradient id="progressGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
                
                <filter id="glow-node">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                
                <filter id="rust-effect">
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence"/>
                    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
            </defs>

            {/* ALGEBRA BRIDGE NODE (Special) */}
            <g 
                onClick={onAlgebraTrigger} 
                className="cursor-pointer group"
                transform={`translate(${algebraNode.x}, ${algebraNode.y})`}
            >
                <circle r="40" fill="#0f172a" stroke="#6366f1" strokeWidth="2" className="group-hover:stroke-cyan-400 transition-colors" />
                <text x="0" y="-55" textAnchor="middle" fontSize="14" fill="#818cf8" fontWeight="bold" letterSpacing="2">FUTURE</text>
                <g transform="translate(-12, -12)">
                    <BookOpen size={24} className="text-indigo-400" />
                </g>
                <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">ALGEBRA BRIDGE</text>
                <circle r="45" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow opacity-50" />
            </g>

            {/* Line to Algebra */}
            <line 
                x1={points[points.length-1].x} 
                y1={points[points.length-1].y} 
                x2={algebraNode.x} 
                y2={algebraNode.y + 40} 
                stroke="#1e293b" 
                strokeWidth="4" 
                strokeDasharray="8 8" 
            />

            {/* 3. Level Nodes */}
            {points.map((p, i) => {
                const levelId = p.level.id;
                
                // PREMIUM LOCK LOGIC:
                const isPremiumLocked = !isPremium && levelId > 3;
                const isUnlocked = unlockedLevel >= levelId;
                const isCompleted = unlockedLevel > levelId;
                const isCurrent = unlockedLevel === levelId;
                const isBoss = p.level.isBoss;
                
                // VISUAL DECAY LOGIC (Randomly mark some old levels as "Rusty")
                // For MVP, simulate rust on levels that are unlockedLevel - 2 or - 5
                const isRusty = isCompleted && (unlockedLevel - levelId) % 3 === 0 && !isBoss;

                let fillColor = '#1e293b'; // Locked Slate
                let strokeColor = '#334155';
                
                if (isCompleted) {
                    fillColor = '#10b981'; // Green
                    strokeColor = '#059669';
                } else if (isCurrent) {
                    // Neural Cooldown Visual
                    if (isCooledDown) {
                        fillColor = '#ea580c'; // Burnt Orange
                        strokeColor = '#c2410c';
                    } else {
                        fillColor = '#f59e0b'; // Amber (Active)
                        strokeColor = '#b45309';
                    }
                } else if (isUnlocked) {
                    fillColor = '#3b82f6'; // Blue (Available)
                    strokeColor = '#1d4ed8';
                }

                // Rust Override
                if (isRusty) {
                    fillColor = '#78350f'; // Brown
                    strokeColor = '#b45309';
                }

                // Boss overrides
                if (isBoss) {
                    if (isCompleted) { fillColor = '#ef4444'; strokeColor = '#b91c1c'; }
                    else if (isCurrent) { fillColor = '#ef4444'; strokeColor = '#fff'; }
                    else if (!isUnlocked) { fillColor = '#3f3f46'; strokeColor = '#18181b'; }
                }

                // Premium Locked Overrides (Gray out even if reached)
                if (isPremiumLocked) {
                    fillColor = '#1e293b';
                    strokeColor = '#9a3412'; // Rusty/Reddish to indicate paywall
                }

                return (
                    <g 
                        key={levelId} 
                        onClick={() => (isUnlocked || isPremiumLocked) ? onLevelClick(levelId) : null}
                        className={isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
                    >
                        
                        {/* AVATAR (If Current) */}
                        {isCurrent && !isPremiumLocked && (
                            <g transform={`translate(${p.x}, ${p.y - 60})`} className="animate-bounce-custom">
                                {/* Speech Bubble */}
                                {isCooledDown ? (
                                    <g>
                                        <rect x="-35" y="-35" width="70" height="24" rx="12" fill="#ef4444" />
                                        <text x="0" y="-20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">OVERHEAT</text>
                                        <polygon points="-5,-11 5,-11 0,-5" fill="#ef4444" />
                                    </g>
                                ) : (
                                    <g>
                                        <rect x="-30" y="-35" width="60" height="24" rx="12" fill="white" />
                                        <text x="0" y="-20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="black">START</text>
                                        <polygon points="-5,-11 5,-11 0,-5" fill="white" />
                                    </g>
                                )}
                                
                                <text x="0" y="20" textAnchor="middle" fontSize="40" filter="url(#glow-node)">{currentAvatar}</text>
                            </g>
                        )}

                        {/* Outer Glow Ring for Current */}
                        {isCurrent && (
                            <circle 
                                cx={p.x} cy={p.y} r={isBoss ? 45 : 35} 
                                fill="none" stroke={isCooledDown ? '#ef4444' : 'white'} strokeWidth="2" strokeDasharray="4 4"
                                className="animate-spin-slow"
                                opacity="0.5"
                            />
                        )}

                        {/* The Node Circle */}
                        <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r={isBoss ? 35 : 25} 
                            fill={fillColor} 
                            stroke={strokeColor} 
                            strokeWidth={isBoss ? 6 : 4}
                            filter={isRusty ? "url(#rust-effect)" : isCurrent && !isPremiumLocked && !isCooledDown ? "url(#glow-node)" : ""}
                            className="transition-all duration-300 hover:scale-110"
                        />

                        {/* Icon inside Node */}
                        <g transform={`translate(${p.x - 12}, ${p.y - 12})`}>
                            {isPremiumLocked ? (
                                <g transform="translate(4, 0)">
                                    <Lock size={20} className="text-yellow-500" strokeWidth={3} />
                                </g>
                            ) : isRusty ? (
                                <AlertCircle size={24} className="text-orange-400" />
                            ) : isCooledDown && isCurrent ? (
                                <Thermometer size={24} className="text-white animate-pulse" />
                            ) : isCompleted ? (
                                <path d="M5 12l5 5l10 -10" stroke="white" strokeWidth="4" fill="none" /> // Checkmark
                            ) : isBoss ? (
                                <text x="0" y="20" fontSize="24">💀</text>
                            ) : !isUnlocked ? (
                                <path d="M12 2a4 4 0 0 1 4 4v4h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z" fill="#94a3b8" transform="translate(0, 0) scale(0.8)" /> // Lock icon approx
                            ) : (
                                <text x="2" y="18" fontSize="16" fontWeight="900" fill="white" textAnchor="middle">{levelId}</text>
                            )}
                        </g>

                        {/* Label underneath */}
                        <text 
                            x={p.x} 
                            y={p.y + (isBoss ? 55 : 45)} 
                            textAnchor="middle" 
                            fill={isUnlocked && !isPremiumLocked ? "white" : "#64748b"} 
                            fontSize="12" 
                            fontWeight="bold"
                            className="uppercase tracking-widest font-nunito"
                        >
                            {isRusty ? "NEEDS REPAIR" : isBoss ? "BOSS" : `Level ${levelId}`}
                        </text>
                        
                    </g>
                );
            })}
        </svg>
        
        {/* Helper Divs for Scroll Targets */}
        {points.map(p => (
            <div 
                key={`scroll-${p.level.id}`} 
                id={`saga-node-${p.level.id}`}
                className="absolute w-1 h-1 pointer-events-none"
                style={{ left: 0, top: p.y }}
            />
        ))}

        <style>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #0f172a; 
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #334155; 
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #475569; 
            }
            @keyframes spin-slow {
                from { transform: rotate(0deg); transform-origin: center; }
                to { transform: rotate(360deg); transform-origin: center; }
            }
            .animate-spin-slow {
                animation: spin-slow 10s linear infinite;
                transform-box: fill-box;
            }
            @keyframes bounce-custom {
                0%, 100% { transform: translateY(-60px); }
                50% { transform: translateY(-70px); }
            }
            .animate-bounce-custom {
                animation: bounce-custom 2s ease-in-out infinite;
            }
        `}</style>
    </div>
  );
};
