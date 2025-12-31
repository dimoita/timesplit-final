import React, { useState } from 'react';
import { ArrowLeft, Zap, Shield, Clock, BrainCircuit, Heart, Lock, CheckCircle2, Coins } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

export interface Upgrade {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  position: { x: number; y: number }; // Percentage 0-100
  connectsTo: string[]; // IDs of children
}

const UPGRADES: Upgrade[] = [
  {
    id: 'synapse_overload',
    title: 'Synapse Overload',
    description: 'Increases Splitz earnings by 10% per level.',
    icon: Zap,
    maxLevel: 5,
    baseCost: 100,
    costMultiplier: 1.5,
    position: { x: 50, y: 80 }, // Bottom Center (Root)
    connectsTo: ['time_dilation', 'critical_recall']
  },
  {
    id: 'time_dilation',
    title: 'Time Dilation',
    description: 'Slows down the mission timer by 5% per level.',
    icon: Clock,
    maxLevel: 5,
    baseCost: 150,
    costMultiplier: 1.5,
    position: { x: 25, y: 50 }, // Left
    connectsTo: ['neural_shield']
  },
  {
    id: 'critical_recall',
    title: 'Critical Recall',
    description: '10% chance per level for an answer to count as 2x Streak.',
    icon: BrainCircuit,
    maxLevel: 5,
    baseCost: 150,
    costMultiplier: 1.5,
    position: { x: 75, y: 50 }, // Right
    connectsTo: ['life_support']
  },
  {
    id: 'neural_shield',
    title: 'Neural Shield',
    description: 'Start every mission with a Shield active. (Max Lvl Required)',
    icon: Shield,
    maxLevel: 1,
    baseCost: 500,
    costMultiplier: 1,
    position: { x: 25, y: 20 }, // Top Left
    connectsTo: []
  },
  {
    id: 'life_support',
    title: 'Life Support',
    description: 'Once per game, survive a fatal error with 1 HP.',
    icon: Heart,
    maxLevel: 1,
    baseCost: 1000,
    costMultiplier: 1,
    position: { x: 75, y: 20 }, // Top Right
    connectsTo: []
  }
];

interface UpgradeGridProps {
  upgrades: Record<string, number>;
  coins: number;
  onBuy: (id: string, cost: number) => void;
  onBack: () => void;
}

export const UpgradeGrid: React.FC<UpgradeGridProps> = ({ upgrades, coins, onBuy, onBack }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { playWin, playCorrect, playDamage } = useGameSound();

  const handleNodeClick = (id: string) => {
    playCorrect();
    setSelectedId(id);
  };

  const handleBuyClick = () => {
    if (!selectedNode) return;
    const currentLevel = upgrades[selectedNode.id] || 0;
    const cost = Math.floor(selectedNode.baseCost * Math.pow(selectedNode.costMultiplier, currentLevel));
    
    if (coins >= cost && currentLevel < selectedNode.maxLevel) {
      playWin();
      onBuy(selectedNode.id, cost);
    } else {
      playDamage();
    }
  };

  const selectedNode = UPGRADES.find(u => u.id === selectedId);
  const currentLevel = selectedNode ? (upgrades[selectedNode.id] || 0) : 0;
  const nextCost = selectedNode ? Math.floor(selectedNode.baseCost * Math.pow(selectedNode.costMultiplier, currentLevel)) : 0;
  const isMaxed = selectedNode ? currentLevel >= selectedNode.maxLevel : false;
  const canAfford = coins >= nextCost;

  // Render Lines
  const renderConnections = () => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {UPGRADES.map(node => {
          const nodeLevel = upgrades[node.id] || 0;
          const isNodeUnlocked = nodeLevel > 0;

          return node.connectsTo.map(childId => {
            const child = UPGRADES.find(u => u.id === childId);
            if (!child) return null;

            const childLevel = upgrades[child.id] || 0;
            const isLineActive = isNodeUnlocked; // Line lights up if parent is unlocked

            return (
              <line 
                key={`${node.id}-${child.id}`}
                x1={`${node.position.x}%`} 
                y1={`${node.position.y}%`} 
                x2={`${child.position.x}%`} 
                y2={`${child.position.y}%`} 
                stroke={isLineActive ? "#4CAF50" : "#334155"} 
                strokeWidth="4" 
                strokeDasharray={isLineActive ? "" : "8 4"}
                className={`transition-colors duration-500 ${isLineActive ? 'drop-shadow-[0_0_8px_rgba(76,175,80,0.8)]' : ''}`}
              />
            );
          });
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 font-nunito flex flex-col relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10 pointer-events-none animate-pulse-slow"></div>

      {/* Header */}
      <nav className="relative z-20 px-4 py-4 border-b border-white/10 backdrop-blur-md flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-colors"
        >
          <ArrowLeft size={20} /> <span className="hidden sm:inline">Back to Base</span>
        </button>
        
        <div className="flex items-center gap-2 text-white">
          <BrainCircuit className="text-cyan-400" size={24} />
          <span className="font-black text-xl uppercase tracking-wider text-3d">Cortex Grid</span>
        </div>

        <div className="bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full flex items-center gap-2">
          <Zap size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="font-black text-white">{coins}</span>
        </div>
      </nav>

      {/* Main Grid Area */}
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 max-w-3xl mx-auto my-8">
           {renderConnections()}
           
           {UPGRADES.map(node => {
             const level = upgrades[node.id] || 0;
             const isUnlocked = level > 0;
             const isMaxed = level >= node.maxLevel;
             const Icon = node.icon;
             
             // Check if parent is unlocked (to allow purchasing this node)
             // Root node is always purchasable. Others need at least one parent unlocked? 
             // Simplified: Always visible, but maybe dim if unreachable? Let's keep it simple: All visible.

             return (
               <button
                 key={node.id}
                 onClick={() => handleNodeClick(node.id)}
                 className={`absolute w-16 h-16 md:w-20 md:h-20 -ml-8 -mt-8 md:-ml-10 md:-mt-10 rounded-full flex items-center justify-center border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all transform hover:scale-110 z-10
                    ${selectedId === node.id ? 'ring-4 ring-white scale-110' : ''}
                    ${isMaxed 
                        ? 'bg-cyan-500 border-cyan-300 text-white shadow-[0_0_20px_rgba(34,211,238,0.6)]' 
                        : isUnlocked 
                            ? 'bg-slate-700 border-green-500 text-green-400' 
                            : 'bg-slate-800 border-slate-600 text-slate-500'}
                 `}
                 style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
               >
                 <Icon size={32} strokeWidth={isUnlocked ? 2.5 : 2} />
                 
                 {/* Level Badge */}
                 <div className="absolute -bottom-2 -right-2 bg-slate-900 text-[10px] font-black text-white px-2 py-0.5 rounded-full border border-slate-600">
                    {level}/{node.maxLevel}
                 </div>
               </button>
             );
           })}
        </div>
      </main>

      {/* Detail Panel (Drawer) */}
      <div className={`relative z-30 bg-slate-800 border-t border-slate-700 transition-all duration-300 ease-out ${selectedId ? 'translate-y-0' : 'translate-y-full'}`}>
         {selectedNode && (
             <div className="max-w-2xl mx-auto p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                 
                 <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border-4 shadow-xl
                    ${isMaxed 
                        ? 'bg-cyan-500 border-cyan-300 text-white' 
                        : 'bg-slate-700 border-slate-600 text-slate-400'}
                 `}>
                     <selectedNode.icon size={40} />
                 </div>

                 <div className="flex-1 text-center md:text-left">
                     <h3 className="text-2xl font-black text-white mb-1">{selectedNode.title}</h3>
                     <p className="text-slate-400 font-bold text-sm mb-4 leading-relaxed">{selectedNode.description}</p>
                     
                     <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                         {[...Array(selectedNode.maxLevel)].map((_, i) => (
                             <div key={i} className={`h-2 w-8 rounded-full ${i < currentLevel ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                         ))}
                     </div>
                 </div>

                 <div className="w-full md:w-auto">
                     {isMaxed ? (
                         <div className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-8 py-4 rounded-xl font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2">
                             <CheckCircle2 /> Maxed Out
                         </div>
                     ) : (
                         <Button 
                            onClick={handleBuyClick}
                            disabled={!canAfford}
                            className={`w-full md:w-48 h-16 text-lg border-b-[6px]
                                ${canAfford ? 'bg-green-600 hover:bg-green-500 border-green-800' : 'bg-slate-600 border-slate-800 text-slate-400 grayscale cursor-not-allowed'}
                            `}
                         >
                             <div className="flex flex-col items-center leading-none">
                                 <span className="text-xs uppercase font-black opacity-80 mb-1">Upgrade</span>
                                 <span className="flex items-center gap-2">
                                     {nextCost} <Zap size={18} fill="currentColor" />
                                 </span>
                             </div>
                         </Button>
                     )}
                 </div>
             </div>
         )}
      </div>

      <style>{`
        .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};