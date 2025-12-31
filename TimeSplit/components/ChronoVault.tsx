
import React, { useState } from 'react';
import { ArrowLeft, Lock, Info, X, Sparkles, Zap } from 'lucide-react';
import { ARTIFACTS, Artifact } from '../data/Artifacts';
import { Button } from './ui/Button';

interface ChronoVaultProps {
  unlockedArtifacts: string[];
  onBack: () => void;
  equippedArtifactId?: string | null;
  onEquipArtifact?: (id: string) => void;
}

export const ChronoVault: React.FC<ChronoVaultProps> = ({ unlockedArtifacts, onBack, equippedArtifactId, onEquipArtifact }) => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  // --- SVG RENDERERS FOR ARTIFACTS ---
  const RenderArtifactVisual = ({ id, size = 100 }: { id: string, size?: number }) => {
      const s = size;
      const c = s / 2; // center

      switch (id) {
          case 'zero_prism':
              return (
                  <svg width={s} height={s} viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                      <defs>
                          <linearGradient id="voidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#581c87" />
                              <stop offset="100%" stopColor="#000" />
                          </linearGradient>
                      </defs>
                      <path d="M50 10 L90 80 L10 80 Z" fill="url(#voidGrad)" stroke="#d8b4fe" strokeWidth="2" className="animate-float">
                          <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                      </path>
                      <circle cx="50" cy="55" r="10" fill="#000" stroke="#d8b4fe" strokeWidth="1">
                          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                      </circle>
                  </svg>
              );
          case 'prime_key':
              return (
                  <svg width={s} height={s} viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                      <g transform="rotate(45, 50, 50)" className="animate-pulse-slow">
                          <circle cx="50" cy="30" r="15" fill="none" stroke="#facc15" strokeWidth="4" />
                          <rect x="46" y="45" width="8" height="40" fill="#facc15" />
                          <rect x="46" y="55" width="20" height="6" fill="#facc15" />
                          <rect x="46" y="70" width="16" height="6" fill="#facc15" />
                          {/* Inner details */}
                          <path d="M50 25 L50 35 M45 30 L55 30" stroke="#facc15" strokeWidth="2" />
                      </g>
                  </svg>
              );
          case 'golden_spiral':
              return (
                  <svg width={s} height={s} viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(20,184,166,0.6)]">
                      <g className="animate-spin-slow" style={{transformOrigin: '50% 50%'}}>
                          <path 
                              d="M50 50 m0 0 a1 1 0 0 1 1 1 a2 2 0 0 1 -2 2 a3 3 0 0 1 -4 -3 a5 5 0 0 1 5 -6 a8 8 0 0 1 9 7 a13 13 0 0 1 -11 14 a21 21 0 0 1 -24 -19" 
                              fill="none" 
                              stroke="#2dd4bf" 
                              strokeWidth="3" 
                              strokeLinecap="round"
                          />
                          <circle cx="50" cy="50" r="3" fill="#ccfbf1" className="animate-ping" />
                      </g>
                  </svg>
              );
          case 'infinity_gear':
              return (
                  <svg width={s} height={s} viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">
                      <g className="animate-spin-slow" style={{transformOrigin: '50% 50%', animationDuration: '4s'}}>
                          <circle cx="50" cy="50" r="25" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="10 5" />
                          <circle cx="50" cy="50" r="10" fill="#818cf8" />
                          <path d="M50 10 L50 25 M50 75 L50 90 M10 50 L25 50 M75 50 L90 50" stroke="#6366f1" strokeWidth="4" />
                      </g>
                  </svg>
              );
          case 'unity_crystal':
              return (
                  <svg width={s} height={s} viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
                      <path d="M50 10 L80 50 L50 90 L20 50 Z" fill="#fbcfe8" stroke="#ec4899" strokeWidth="2" className="animate-bounce-gentle" fillOpacity="0.5">
                          <animate attributeName="fill-opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
                      </path>
                      <path d="M50 10 L50 90 M20 50 L80 50" stroke="#ec4899" strokeWidth="1" />
                  </svg>
              );
          default:
              return <div className="text-4xl">❓</div>;
      }
  };

  const getRarityColor = (rarity: string) => {
      switch (rarity) {
          case 'COMMON': return 'border-slate-500 shadow-slate-500/20';
          case 'RARE': return 'border-blue-400 shadow-blue-400/40';
          case 'LEGENDARY': return 'border-yellow-400 shadow-yellow-400/50';
          case 'MYTHIC': return 'border-purple-500 shadow-purple-500/60';
          default: return 'border-slate-500';
      }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-nunito text-white relative overflow-hidden flex flex-col">
        
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,rgba(0,0,0,0)_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

        {/* Header */}
        <div className="p-6 flex justify-between items-center relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back to Base
            </button>
            <div className="flex flex-col items-end">
                <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-cyan-400 text-shadow-glow">Chrono Vault</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Museum of Time</p>
            </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {ARTIFACTS.map((artifact) => {
                    const isUnlocked = unlockedArtifacts.includes(artifact.id);
                    const isEquipped = equippedArtifactId === artifact.id;
                    
                    return (
                        <div 
                            key={artifact.id}
                            onClick={() => isUnlocked && setSelectedArtifact(artifact)}
                            className={`
                                aspect-[1/1.15] relative group cursor-pointer transition-all duration-300
                                ${isUnlocked ? 'hover:scale-105' : 'opacity-50 grayscale cursor-not-allowed'}
                            `}
                        >
                            {/* Hexagon Shape Container using CSS Clip Path */}
                            <div 
                                className={`
                                    w-full h-full bg-slate-800/50 backdrop-blur-sm border-2 relative flex flex-col items-center justify-center
                                    ${isEquipped ? 'border-green-500 shadow-green-500/50 bg-green-900/20' : isUnlocked ? getRarityColor(artifact.rarity) : 'border-slate-800'}
                                `}
                                style={{
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    borderWidth: '0' 
                                }}
                            >
                                {/* Inner Hex Border Trick */}
                                <div 
                                    className={`absolute inset-1 z-0 transition-colors duration-300 ${isUnlocked ? 'bg-slate-900' : 'bg-slate-950'}`}
                                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                ></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center">
                                    {isUnlocked ? (
                                        <>
                                            <RenderArtifactVisual id={artifact.id} size={80} />
                                            {isEquipped && (
                                                <div className="absolute top-[-30px] bg-green-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-full animate-bounce">
                                                    Active
                                                </div>
                                            )}
                                            <div className={`mt-4 text-xs font-bold uppercase tracking-wider text-center px-4 ${isEquipped ? 'text-green-400' : 'text-slate-300'}`}>
                                                {artifact.name}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={40} className="text-slate-700 mb-2" />
                                            <div className="text-[10px] font-black uppercase text-slate-700">Unknown</div>
                                        </>
                                    )}
                                </div>

                                {/* Shine Effect */}
                                {isUnlocked && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
                
                {/* Empty Slots Fillers */}
                {[...Array(3)].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-[1/1.15] opacity-10 pointer-events-none">
                        <div 
                            className="w-full h-full bg-slate-900"
                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                        ></div>
                    </div>
                ))}
            </div>
        </div>

        {/* LORE MODAL */}
        {selectedArtifact && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-pop-in">
                    
                    <button 
                        onClick={() => setSelectedArtifact(null)}
                        className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 text-center relative overflow-hidden">
                        {/* Background Glow */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b ${selectedArtifact.rarity === 'LEGENDARY' ? 'from-yellow-500/20' : 'from-cyan-500/20'} to-transparent z-0`}></div>
                        
                        <div className="relative z-10 mb-6 scale-150 py-4">
                            <RenderArtifactVisual id={selectedArtifact.id} size={120} />
                        </div>

                        <h2 className="relative z-10 text-3xl font-black uppercase tracking-wide text-white mb-2">{selectedArtifact.name}</h2>
                        
                        <div className={`relative z-10 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-6
                            ${selectedArtifact.rarity === 'LEGENDARY' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-900/20' : 
                              selectedArtifact.rarity === 'MYTHIC' ? 'border-purple-500/50 text-purple-400 bg-purple-900/20' : 
                              'border-blue-500/50 text-blue-400 bg-blue-900/20'}
                        `}>
                            {selectedArtifact.rarity} Artifact
                        </div>

                        <div className="relative z-10 bg-black/30 p-6 rounded-2xl border border-slate-700/50 mb-6">
                            <p className="text-slate-300 font-serif italic text-lg leading-relaxed mb-4">
                                "{selectedArtifact.description}"
                            </p>
                            <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={12} />
                                Effect: {selectedArtifact.effectDescription}
                            </div>
                        </div>

                        {onEquipArtifact && (
                            <div className="relative z-10">
                                {equippedArtifactId === selectedArtifact.id ? (
                                    <Button 
                                        onClick={() => { onEquipArtifact(selectedArtifact.id); setSelectedArtifact(null); }}
                                        className="w-full bg-red-600 hover:bg-red-500 border-red-800 text-white shadow-red-500/20"
                                    >
                                        DEACTIVATE SYSTEM
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => { onEquipArtifact(selectedArtifact.id); setSelectedArtifact(null); }}
                                        className="w-full bg-green-600 hover:bg-green-500 border-green-800 text-white shadow-green-500/20"
                                    >
                                        <Zap className="mr-2" size={18} fill="currentColor" /> ACTIVATE ARTIFACT
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        <style>{`
            .text-shadow-glow { text-shadow: 0 0 15px rgba(34,211,238,0.5); }
            .animate-spin-slow { animation: spin 10s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
    </div>
  );
};
