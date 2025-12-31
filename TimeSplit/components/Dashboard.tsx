
import React, { useState, useEffect } from 'react';
import { Star, Trophy, Play, Lock, LogOut, Zap, Skull, Check, Swords, Home, Shield, BookOpen, Printer, BrainCircuit, Radio, Radar, Target, Gift, Activity, Cloud, CloudOff, RefreshCw, Users, Ticket, Thermometer } from 'lucide-react';
import { Button } from './ui/Button';
import { LEVELS } from '../data/LevelConfig';
import { MissionBriefing } from './MissionBriefing';
import { Bounty, PetState, MasteryMap, ChronoEvent } from '../App';
import { useGameSound } from '../hooks/useGameSound';
import { NeuralNexus } from './NeuralNexus';
import { CoinShopModal } from './CoinShopModal';
import { StarPet } from './StarPet';
import { SagaMap } from './SagaMap';
import { StarPetAI } from './StarPetAI';
import { getStarPetMessage, generateDailyBriefing } from '../services/GeminiService';
import { ChronoStormHUD } from './ChronoStormHUD';
import { DailySentinel } from './DailySentinel';
import { AlgebraExpansionModal } from './upsell/AlgebraExpansionModal';

interface DashboardProps {
  childName?: string;
  onStartSession: (level: number) => void;
  onSignOut: () => void;
  totalStars?: number;
  unlockedLevel: number;
  coins: number;
  equippedAvatar: string;
  onOpenShop: () => void;
  onOpenUpgrades: () => void;
  onOpenDojo: () => void;
  onOpenHallOfFame: () => void;
  onOpenSquadron?: () => void;
  onOpenInventory?: () => void; 
  mastery: MasteryMap;
  consumables: Record<string, number>;
  onBuyConsumable: (itemId: string, cost: number) => void;
  bounties: Bounty[];
  onClaimBounty: (id: string) => void;
  onOpenGuardian?: () => void;
  onOpenTitan?: () => void;
  onOpenBase?: () => void; 
  onOpenPrintables?: () => void; 
  petState?: PetState;
  villain?: string;
  isPremium?: boolean;
  syncStatus?: 'SAVED' | 'SYNCING' | 'ERROR' | 'OFFLINE_CHANGES';
  equippedArtifactId?: string | null;
  activeEvent?: ChronoEvent | null;
  onEventEnd?: () => void;
  lastDailyBriefing?: string | null;
  onUpdateDailyBriefing?: (date: string, bounties: Bounty[]) => void;
  onTriggerCheckout?: () => void;
  onAddCoins?: (amount: number) => void; 
  dailyLevelCount?: number; // New Prop for Cooldown Logic
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  childName = "Herói", onStartSession, onSignOut, totalStars = 0, unlockedLevel = 1, coins, equippedAvatar, 
  onOpenShop, onOpenUpgrades, onOpenDojo, onOpenHallOfFame, onOpenSquadron, onOpenInventory, mastery, consumables, onBuyConsumable, 
  onOpenGuardian, onOpenTitan, onOpenBase, onOpenPrintables, petState, villain = 'default', isPremium = false, syncStatus = 'SAVED',
  activeEvent, onEventEnd, lastDailyBriefing, onUpdateDailyBriefing, bounties, onClaimBounty, onTriggerCheckout, onAddCoins, dailyLevelCount = 0
}) => {
  const [briefingLevelId, setBriefingLevelId] = useState<number | null>(null);
  const [showCoinShop, setShowCoinShop] = useState(false);
  const [showAlgebraModal, setShowAlgebraModal] = useState(false); // New Modal State
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [strategicReport, setStrategicReport] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isRadarScanning, setIsRadarScanning] = useState(false);
  const [showSentinel, setShowSentinel] = useState(false);
  const [sentinelBriefing, setSentinelBriefing] = useState<{message: string, bounties: Bounty[]} | null>(null);

  const { playCorrect, playDamage, playChargeUp, stopChargeUp, playWin } = useGameSound();

  // COOLDOWN LOGIC
  const isCooldownActive = dailyLevelCount >= 3;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const fetchBriefing = async () => {
      setIsAiThinking(true);
      const gaps = Object.entries(mastery).filter(([_, s]) => (s as number) < 0.6).map(([k]) => k);
      
      if (lastDailyBriefing !== today && onUpdateDailyBriefing) {
          const briefing = await generateDailyBriefing({ childName, masteryGaps: gaps, currentLevel: unlockedLevel, coins, villain });
          setSentinelBriefing(briefing);
          setShowSentinel(true);
      }

      const context = activeEvent ? 'CHRONO_STORM_ALERT' : 'BRIEFING';
      const msg = await getStarPetMessage(context, { childName, masteryGaps: gaps, currentLevel: unlockedLevel, coins, villain });
      setAiMessage(msg);

      const report = await getStarPetMessage('STRATEGIC_REPORT', { childName, masteryGaps: gaps, currentLevel: unlockedLevel, coins, villain });
      setStrategicReport(report);
      
      setIsAiThinking(false);
    };
    fetchBriefing();
  }, [unlockedLevel, childName, mastery, coins, villain, activeEvent, lastDailyBriefing]);

  const handleSentinelAccept = () => {
      if (sentinelBriefing && onUpdateDailyBriefing) {
          const today = new Date().toISOString().split('T')[0];
          onUpdateDailyBriefing(today, sentinelBriefing.bounties);
          setShowSentinel(false);
          playWin();
      }
  };

  const handleScan = () => {
    setIsRadarScanning(true);
    playChargeUp();
    setTimeout(() => {
        setIsRadarScanning(false);
        stopChargeUp();
        playCorrect();
    }, 3000);
  };

  const handleLevelClick = (levelId: number) => {
      const isLocked = levelId > unlockedLevel;
      if (isLocked) { playDamage(); return; }
      
      // Cooldown Check
      if (isCooldownActive && levelId === unlockedLevel) {
          // Playing the newest level is blocked
          playDamage();
          // Show feedback toast or similar handled by UI state
          return;
      }
      
      setBriefingLevelId(levelId);
  };

  const currentLevelInfo = LEVELS.find(l => l.id === unlockedLevel) || LEVELS[LEVELS.length - 1];
  const briefingLevelConfig = LEVELS.find(l => l.id === briefingLevelId);
  
  // Premium Logic: Level 4+ Locked
  const isNextLevelLocked = !isPremium && currentLevelInfo.id > 3;

  const SyncIcon = () => {
      if (syncStatus === 'SYNCING') return <RefreshCw size={14} className="text-yellow-400 animate-spin" />;
      if (syncStatus === 'ERROR' || syncStatus === 'OFFLINE_CHANGES') return <CloudOff size={14} className="text-red-400" />;
      return <Cloud size={14} className="text-green-400" />;
  };

  return (
    <div className="min-h-screen bg-[#020617] font-nunito flex flex-col overflow-hidden pb-safe">
      <AlgebraExpansionModal 
        isOpen={showAlgebraModal} 
        onClose={() => setShowAlgebraModal(false)} 
        onCheckout={() => { window.open('https://pay.hotmart.com/ALGEBRA_LINK'); setShowAlgebraModal(false); }} 
      />

      {showSentinel && sentinelBriefing && (
          <DailySentinel message={sentinelBriefing.message} bounties={sentinelBriefing.bounties} petState={petState} onAccept={handleSentinelAccept} />
      )}

      {briefingLevelConfig && (
          <MissionBriefing 
            level={briefingLevelConfig} 
            onClose={() => setBriefingLevelId(null)} 
            onStart={() => { if (briefingLevelId) { onStartSession(briefingLevelId); setBriefingLevelId(null); } }} 
            consumables={consumables} 
            onBuyConsumable={onBuyConsumable} 
            coins={coins} 
            childName={childName} 
            childAvatar={equippedAvatar} 
            mastery={mastery} 
            isUnlocked={briefingLevelId! <= unlockedLevel} 
            onCalibrate={() => onOpenDojo()} 
            villainId={villain}
            isPremium={isPremium}
            onTriggerCheckout={onTriggerCheckout}
          />
      )}
      
      <CoinShopModal 
        isOpen={showCoinShop} 
        onClose={() => setShowCoinShop(false)} 
        onPurchase={(pack) => {
            if (onAddCoins) onAddCoins(pack.coins);
            setShowCoinShop(false);
        }}
      />

      {/* TOP NAV BAR - HOLOGRAPHIC */}
      <nav className="bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-4 pt-safe sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]">T</div>
                <span className="font-black text-white text-xl tracking-tight uppercase hidden sm:inline">Time<span className="text-indigo-400">Split</span></span>
            </div>
            {/* SYNC STATUS INDICATOR */}
            <div className="bg-black/30 px-2 sm:px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 transition-colors">
                <SyncIcon />
                <span className={`text-[10px] font-black uppercase tracking-widest hidden xs:inline ${syncStatus === 'SAVED' ? 'text-green-400' : syncStatus === 'SYNCING' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {syncStatus === 'SAVED' ? 'Cloud Secure' : syncStatus === 'SYNCING' ? 'Syncing...' : 'Offline Mode'}
                </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <button onClick={() => setShowCoinShop(true)} className="flex items-center gap-1 sm:gap-2 bg-yellow-500/10 px-3 sm:px-4 py-2 rounded-full border border-yellow-500/30 hover:bg-yellow-500/20 transition-all">
                <Zap size={16} className="text-yellow-500 fill-yellow-500 sm:w-[18px] sm:h-[18px]" /><span className="font-black text-yellow-500 text-sm sm:text-base">{coins}</span>
             </button>
             
             <div className="flex items-center gap-3 bg-white/5 px-3 sm:px-4 py-2 rounded-full border border-white/10 relative group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shadow-sm text-lg">{equippedAvatar}</div>
                <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-black text-white leading-none">{childName}</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Nível {unlockedLevel}</span>
                </div>
                {aiMessage && (
                  <div className="absolute top-full right-0 mt-4 z-50 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <StarPetAI message={aiMessage} isThinking={isAiThinking} />
                  </div>
                )}
             </div>
             <button onClick={onSignOut} className="p-2 text-white/20 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      {/* WAR RADIO HUD */}
      <div className="bg-indigo-950/30 border-b border-indigo-500/20 p-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-6">
            <div className={`w-8 h-8 ${activeEvent ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'} rounded-lg flex items-center justify-center animate-pulse shrink-0`}>
                <Radio size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${activeEvent ? 'text-red-400' : 'text-indigo-400'}`}>
                    Frequência Tática {activeEvent && "• EVENTO ATIVO"}
                </p>
                <p className="text-indigo-100 text-sm font-bold truncate italic">
                    {strategicReport || "Escaneando canais de comunicação do Vilão..."}
                </p>
            </div>
            <div className="hidden md:flex gap-2">
                {[...Array(8)].map((_, i) => <div key={i} className={`w-1 h-4 ${activeEvent ? 'bg-red-500/20' : 'bg-indigo-500/20'} rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }}></div>)}
            </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:py-10 w-full flex-1 overflow-y-auto">
        {activeEvent && onEventEnd && (
            <ChronoStormHUD event={activeEvent} onEventEnd={onEventEnd} />
        )}

        <div className="px-4 sm:px-6 grid lg:grid-cols-12 gap-8 w-full pb-20">
            {/* COLUNA ESQUERDA: RADAR DE INVASÃO E DASHBOARD */}
            <div className="lg:col-span-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* RADAR CIRCULAR */}
                    <div className="bg-slate-900 border-4 border-slate-800 rounded-[3rem] p-6 relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]"></div>
                        <div className={`absolute inset-0 z-20 pointer-events-none border-[20px] border-transparent transition-all duration-300 ${isRadarScanning ? 'border-indigo-500/20 rotate-180 scale-110' : ''}`}></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="flex justify-between w-full mb-4 px-2">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Radar size={12} className={isRadarScanning ? 'animate-spin' : ''} /> Setor de Defesa
                                </h4>
                                <span className="text-[10px] font-black text-red-500 animate-pulse uppercase">Invasão Iminente</span>
                            </div>
                            
                            <div className={`relative transition-all duration-1000 ${isRadarScanning ? 'scale-90 blur-[1px]' : ''}`}>
                                <NeuralNexus mastery={mastery} />
                                {/* Camada de Radar Animada */}
                                {isRadarScanning && <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping"></div>}
                            </div>

                            <button 
                                onClick={handleScan}
                                disabled={isRadarScanning}
                                className="mt-6 px-8 py-2 bg-indigo-900/50 border border-indigo-500/30 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                            >
                                {isRadarScanning ? "Escaneando Gaps..." : "Iniciar Varredura Tática"}
                            </button>
                        </div>
                    </div>

                    {/* MISSÃO ATUAL - WAR STYLE / COOLDOWN OVERLAY */}
                    <section className={`p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group border-4 ${isCooldownActive ? 'bg-orange-950 border-orange-600' : currentLevelInfo.isBoss ? 'bg-red-950 border-red-600' : activeEvent ? 'bg-cyan-950 border-cyan-500' : 'bg-indigo-950 border-indigo-600'}`}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        
                        {/* Cooldown Overlay */}
                        {isCooldownActive ? (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-sm">
                                <Thermometer className="text-orange-500 w-16 h-16 mb-4 animate-pulse" />
                                <h3 className="text-2xl font-black text-white uppercase mb-2">Neural Overheat</h3>
                                <p className="text-sm font-bold text-orange-200 mb-6">
                                    Protocolo de 15 Minutos Atingido.<br/>
                                    Cérebro em modo de consolidação.
                                </p>
                                <div className="space-y-3 w-full">
                                    <Button onClick={onOpenTitan} className="bg-purple-600 hover:bg-purple-500 w-full">
                                        Jogar Arena dos Titãs
                                    </Button>
                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                                        Campanha recarrega amanhã
                                    </p>
                                </div>
                            </div>
                        ) : isNextLevelLocked && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
                                <Lock className="text-yellow-400 w-16 h-16 mb-4 animate-bounce" />
                                <h3 className="text-2xl font-black text-white uppercase mb-2">Acesso Restrito</h3>
                                <p className="text-sm font-bold text-gray-300 mb-6">Níveis Avançados requerem Licença de Guardião.</p>
                                <Button onClick={onTriggerCheckout} className="bg-yellow-500 text-black hover:bg-yellow-400 w-full animate-pulse shadow-xl">
                                    Desbloquear Agora
                                </Button>
                            </div>
                        )}

                        <div className={`relative z-10 text-white flex flex-col h-full ${isCooldownActive ? 'opacity-20' : ''}`}>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest border border-white/10 mb-4 inline-block self-start">
                                {activeEvent ? 'Missão sob Fenda Temporal' : 'Missão de Campanha Ativa'}
                            </span>
                            <h3 className="text-4xl font-black mb-2 text-shadow-glow leading-tight">{currentLevelInfo.title}</h3>
                            <p className="text-indigo-200 font-bold text-lg mb-10 opacity-90 max-w-xs">{currentLevelInfo.description}</p>
                            
                            <div className="mt-auto">
                                <Button 
                                    onClick={() => handleLevelClick(currentLevelInfo.id)} 
                                    className={`w-full text-2xl py-8 h-auto bg-white text-indigo-950 border-b-[8px] border-indigo-200 hover:bg-indigo-50 shadow-[0_10px_40px_rgba(0,0,0,0.4)] ${activeEvent ? 'ring-4 ring-cyan-400 animate-bounce' : ''}`}
                                >
                                    {currentLevelInfo.isBoss ? <Skull className="mr-3" /> : <Play fill="currentColor" className="mr-3" />} 
                                    {isNextLevelLocked ? "DESBLOQUEAR" : "INICIAR DEPLOY"}
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ATALHOS DE MÓDULOS */}
                <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button onClick={onOpenTitan} className="bg-slate-900 p-6 rounded-3xl border-2 border-white/5 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all text-center group min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden">
                        {isCooldownActive && <div className="absolute top-2 right-2 text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full animate-pulse">RECOMMENDED</div>}
                        <Swords className="mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-black text-[10px] uppercase text-slate-400 group-hover:text-white">Arena dos Titãs</span>
                    </button>
                    <button onClick={onOpenDojo} className="bg-slate-900 p-6 rounded-3xl border-2 border-white/5 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all text-center group min-h-[140px] flex flex-col items-center justify-center">
                        <BrainCircuit className="mx-auto mb-2 text-cyan-400 group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-black text-[10px] uppercase text-slate-400 group-hover:text-white">Dojo de Treino</span>
                    </button>
                    <button onClick={onOpenInventory} className="bg-slate-900 p-6 rounded-3xl border-2 border-white/5 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-center group min-h-[140px] flex flex-col items-center justify-center">
                        <Ticket className="mx-auto mb-2 text-emerald-400 group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-black text-[10px] uppercase text-slate-400 group-hover:text-white">Supply Bag</span>
                    </button>
                    
                    <button onClick={onOpenSquadron} className="bg-slate-900 p-6 rounded-3xl border-2 border-white/5 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all text-center group min-h-[140px] flex flex-col items-center justify-center">
                        <Users className="mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-black text-[10px] uppercase text-slate-400 group-hover:text-white">Central do Squad</span>
                    </button>

                    <button onClick={onOpenShop} className="bg-slate-900 p-6 rounded-3xl border-2 border-white/5 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all text-center group min-h-[140px] flex flex-col items-center justify-center">
                        <Zap className="mx-auto mb-2 text-yellow-400 group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-black text-[10px] uppercase text-slate-400 group-hover:text-white">Arsenal</span>
                    </button>
                    <button onClick={onOpenPrintables} className="bg-slate-900 p-6 rounded-3xl border-2 border-white/5 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all text-center group min-h-[140px] flex flex-col items-center justify-center">
                        <Printer className="mx-auto mb-2 text-cyan-400 group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-black text-[10px] uppercase text-slate-400 group-hover:text-white">Arquivos HQ</span>
                    </button>
                </section>
            </div>

            {/* COLUNA DIREITA: RANKING E OBJETIVOS */}
            <div className="lg:col-span-4 space-y-8">
                {/* WIDGET DE OBJETIVOS DIÁRIOS (Protocolo Sentinela) */}
                <section className="bg-slate-900 p-6 rounded-[2.5rem] border-2 border-cyan-500/30 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-cyan-400"><Target size={80} /></div>
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
                        <div className="w-full h-full animate-pulse-radar bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.4)_0%,transparent_70%)]"></div>
                    </div>
                    <h4 className="font-black text-[10px] text-cyan-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 relative z-10">
                        <Activity size={14} className="animate-pulse" /> Objetivos da Operação
                    </h4>
                    
                    <div className="space-y-4 relative z-10">
                        {bounties.length > 0 ? bounties.map((b) => {
                            const isComplete = b.current >= b.target;
                            return (
                                <div key={b.id} className={`p-4 rounded-2xl border transition-all ${isComplete ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className={`text-xs font-black uppercase tracking-wider ${isComplete ? 'text-green-400 line-through opacity-50' : 'text-slate-200'}`}>{b.title}</div>
                                            <div className="text-[10px] text-slate-500 font-bold leading-tight mt-1">{b.goal}</div>
                                        </div>
                                        {isComplete ? (
                                            <button onClick={() => onClaimBounty(b.id)} className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-lg font-black text-[10px] uppercase animate-bounce-gentle shadow-lg shadow-yellow-500/20">Resgatar</button>
                                        ) : (
                                            <div className="text-[10px] font-black text-yellow-500 flex items-center gap-1">+{b.reward} <Zap size={10} fill="currentColor" /></div>
                                        )}
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${isComplete ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`} style={{ width: `${(b.current / b.target) * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-end mt-1">
                                        <span className="text-[10px] font-mono text-slate-500 font-bold">{b.current}/{b.target}</span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="py-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <div className="text-slate-600 text-xs font-bold italic mb-4">Aguardando novas ordens do Comando...</div>
                                <Gift className="mx-auto text-slate-800" size={32} />
                            </div>
                        )}
                    </div>
                </section>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-2 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-white"><Trophy size={80} /></div>
                    <h4 className="font-black text-[10px] text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Trophy size={14} className="text-yellow-500" /> Melhores da Semana</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🥇</span>
                                <span className="font-black text-white">{childName}</span>
                            </div>
                            <span className="font-black text-indigo-400">{totalStars} Estrelas</span>
                        </div>
                    </div>
                </div>

                <SagaMap 
                    levels={LEVELS} 
                    unlockedLevel={unlockedLevel} 
                    onLevelClick={handleLevelClick} 
                    currentAvatar={equippedAvatar} 
                    isPremium={isPremium} 
                    isCooledDown={isCooldownActive}
                    onAlgebraTrigger={() => setShowAlgebraModal(true)} 
                />

                {/* PREMIUM LOCK: GUARDIAN INTERFACE */}
                <button 
                    onClick={onOpenGuardian} 
                    className={`w-full py-4 rounded-2xl bg-white text-indigo-950 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border-b-4 border-slate-300 relative ${!isPremium ? 'opacity-80' : ''}`}
                >
                    {!isPremium && <Lock size={16} className="text-red-500" />}
                    <Shield size={18} className="text-indigo-600" /> Painel de Comando
                </button>
            </div>
        </div>
      </main>
      
      <style>{`
        .text-shadow-glow { text-shadow: 0 0 10px currentColor; }
        @keyframes pulse-radar {
            0% { transform: scale(0.8); opacity: 0; }
            50% { opacity: 0.1; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-pulse-radar {
            animation: pulse-radar 3s ease-out infinite;
        }
        @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        .animate-bounce-gentle {
            animation: bounce-gentle 2s infinite;
        }
      `}</style>
    </div>
  );
};
