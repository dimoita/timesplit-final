
import React, { useState, useEffect, useMemo } from 'react';
import { X, Play, Skull, Shield, Zap, Hourglass, Coins, Swords, AlertTriangle, BrainCircuit, Lock, ChevronRight, Crown } from 'lucide-react';
import { Button } from './ui/Button';
import { LevelConfig } from '../data/LevelConfig';
import { ARSENAL_ITEMS } from './Shop';
import { useGameSound } from '../hooks/useGameSound';
import { VillainHacker } from './VillainHacker';
import { getStarPetMessage } from '../services/GeminiService';

type MasteryMap = Record<string, number>;

interface MissionBriefingProps {
  level: LevelConfig;
  onClose: () => void;
  onStart: () => void;
  consumables: Record<string, number>;
  onBuyConsumable: (itemId: string, cost: number) => void;
  coins: number;
  childName: string;
  childAvatar: string;
  mastery: MasteryMap;
  onCalibrate: (factors: number[]) => void;
  isUnlocked: boolean;
  villainId?: string;
  isPremium?: boolean;
  onTriggerCheckout?: () => void;
}

const VILLAIN_MAP: Record<string, string> = { 'tables': '👹', 'division': '👻', 'focus': '👁️', 'all': '🐲', 'default': '👾' };

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  level,
  onClose,
  onStart,
  consumables,
  onBuyConsumable,
  coins,
  childName,
  childAvatar,
  mastery,
  onCalibrate,
  isUnlocked,
  villainId = 'default',
  isPremium = false,
  onTriggerCheckout
}) => {
  const { playWin, playDamage } = useGameSound();
  const [animateVs, setAnimateVs] = useState(false);
  const [isInvasionActive, setIsInvasionActive] = useState(false);
  const [villainMessage, setVillainMessage] = useState<string | null>(null);

  // PAYWALL LOGIC: Levels > 3 are locked for free users
  const isPaywalled = level.id > 3 && !isPremium;

  const winProbability = useMemo(() => {
      let totalScore = 0;
      let count = 0;
      level.factors.forEach(f => {
          for(let i=1; i<=9; i++) {
              const normKey = f < i ? `${f}x${i}` : `${i}x${f}`;
              totalScore += (mastery[normKey] || 0);
              count++;
          }
      });
      return Math.round((count > 0 ? totalScore / count : 0.4) * 100);
  }, [level, mastery]);

  useEffect(() => {
    // Only trigger invasion if unlocked and NOT paywalled
    if (isUnlocked && !isPaywalled) {
        const triggerInvasion = async () => {
          if (level.isBoss || winProbability < 40) {
            const gaps = Object.entries(mastery).filter(([_, s]) => (s as number) < 0.6).map(([k]) => k);
            const msg = await getStarPetMessage('VILLAIN_HACK', {
              childName, masteryGaps: gaps, currentLevel: level.id, coins, villain: villainId
            });
            setVillainMessage(msg);
            setIsInvasionActive(true);
            const interval = setInterval(playDamage, 200);
            setTimeout(() => clearInterval(interval), 1000);
          }
        };
        triggerInvasion();
    }
    if (level.isBoss) setTimeout(() => setAnimateVs(true), 100);
  }, [level, winProbability, childName, mastery, coins, playDamage, villainId, isUnlocked, isPaywalled]);

  const handleBuy = (itemId: string, cost: number) => {
    if (coins >= cost) { playWin(); onBuyConsumable(itemId, cost); } 
    else { playDamage(); }
  };

  const handleAction = () => {
      if (!isUnlocked) return;
      if (isPaywalled) {
          if (onTriggerCheckout) onTriggerCheckout();
      } else {
          onStart();
      }
  };

  if (isInvasionActive && villainMessage) {
    return <VillainHacker villainEmoji={VILLAIN_MAP[villainId] || VILLAIN_MAP['default']} message={villainMessage} onComplete={() => setIsInvasionActive(false)} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/95 backdrop-blur-sm">
      <div className={`w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-pop-in ${level.isBoss ? 'border-[6px] border-red-600' : 'border-[6px] border-gray-100'}`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full z-20"><X size={24} /></button>
        <div className={`p-8 pb-12 text-center relative overflow-hidden ${level.isBoss ? 'bg-red-950 text-white' : 'bg-[#1e1b4b] text-white'}`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            {level.isBoss ? (
                <div className="flex items-center justify-center gap-4 sm:gap-12 mb-4 relative z-10">
                    <div className={`flex flex-col items-center transition-all duration-700 transform ${animateVs ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}><div className="text-6xl sm:text-7xl mb-2">{childAvatar}</div><div className="text-sm font-black uppercase bg-white/10 px-3 py-1 rounded-full">{childName}</div></div>
                    <div className={`text-4xl font-black text-white italic animate-pulse transition-all duration-500 delay-500 ${animateVs ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}>VS</div>
                    <div className={`flex flex-col items-center transition-all duration-700 transform ${animateVs ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}><div className="text-6xl sm:text-7xl mb-2">{VILLAIN_MAP[villainId] || '👾'}</div><div className="text-sm font-black uppercase bg-red-600 px-3 py-1 rounded-full text-white">{level.bossName || "Boss"}</div></div>
                </div>
            ) : (
                <div className="relative z-10">
                    <div className="inline-block bg-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-200 text-xs font-black uppercase tracking-widest mb-4">Briefing • Level {level.id}</div>
                    <h2 className="text-4xl font-black text-white mb-2">{level.title}</h2>
                    <p className="text-indigo-200 font-bold text-lg">{level.description}</p>
                </div>
            )}
        </div>
        <div className="px-6 py-6 md:px-8 -mt-8 relative z-10">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2"><span className="text-xs font-black text-gray-400 uppercase">Probabilidade de Sucesso</span><span className={`text-sm font-black ${winProbability < 30 ? 'text-red-500' : 'text-green-500'}`}>{winProbability}%</span></div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200"><div className={`h-full transition-all duration-1000 ${winProbability < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${winProbability}%` }}></div></div>
                </div>
                
                {/* ITEMS GRID (Dimmed if paywalled) */}
                <div className={`grid grid-cols-3 gap-3 mb-8 ${isPaywalled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    {ARSENAL_ITEMS.map(item => {
                        const count = consumables[item.id] || 0;
                        const canAfford = coins >= item.cost;
                        return (
                            <div key={item.id} className={`border-2 rounded-2xl p-3 flex flex-col items-center transition-all ${count > 0 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                                <div className="text-lg mb-1">{item.emoji}</div>
                                <div className="text-[10px] font-black leading-tight mb-1">{item.name}</div>
                                {count > 0 ? <span className="text-sm font-black text-indigo-600">x{count}</span> : <button onClick={() => handleBuy(item.id, item.cost)} disabled={!canAfford} className={`w-full py-1 rounded text-[10px] font-black uppercase ${canAfford ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{item.cost} <Zap size={8} className="inline"/></button>}
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-3">
                    {!isUnlocked ? (
                        <div className="bg-slate-100 p-4 rounded-xl text-center text-slate-500 font-black flex items-center justify-center gap-2">
                            <Lock size={20} /> NÍVEL ANTERIOR INCOMPLETO
                        </div>
                    ) : isPaywalled ? (
                        <Button 
                            onClick={handleAction} 
                            className="w-full text-xl py-5 h-auto bg-green-600 hover:bg-green-500 border-green-800 text-white shadow-xl animate-pulse"
                        >
                            <Crown className="mr-2" size={24} /> DESBLOQUEAR VERSÃO COMPLETA
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleAction} 
                            className={`w-full text-xl py-5 h-auto ${level.isBoss ? 'bg-red-600' : ''}`}
                        >
                            {level.isBoss ? 'LUTAR CONTRA BOSS' : 'INICIAR MISSÃO'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
