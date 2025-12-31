
import React, { useState } from 'react';
import { ArrowLeft, Box, Layout, Monitor, Image as ImageIcon, Lock, Check, Zap, ShoppingCart, Home, Heart, Utensils, Archive, BookOpen, Sparkles, Binary, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { HQState, PetState, MasteryMap } from '../App';
import { StarPet } from './StarPet';

interface CosmicHQProps {
  coins: number;
  setCoins: (amount: number) => void;
  hqState: HQState;
  setHqState: (state: HQState) => void;
  onBack: () => void;
  petState?: PetState;
  setPetState?: (state: PetState) => void;
  onOpenVault?: () => void;
  onOpenCodex?: () => void;
  mastery: MasteryMap;
}

type Category = 'VIEW' | 'FLOOR' | 'DESK' | 'DECOR';

interface HQItem { id: string; category: Category; name: string; cost: number; icon: string; styleClass?: string; }

const HQ_ITEMS: HQItem[] = [
    { id: 'view_earth', category: 'VIEW', name: 'Earth Orbit', cost: 0, icon: '🌍' },
    { id: 'view_mars', category: 'VIEW', name: 'Mars Surface', cost: 500, icon: '🪐' },
    { id: 'view_nebula', category: 'VIEW', name: 'Nebula Cloud', cost: 1000, icon: '🌌' },
    { id: 'view_void', category: 'VIEW', name: 'Black Hole', cost: 2500, icon: '⚫' },
    { id: 'floor_steel', category: 'FLOOR', name: 'Steel Grate', cost: 0, icon: '⬜' },
    { id: 'floor_wood', category: 'FLOOR', name: 'Teak Wood', cost: 200, icon: '🪵' },
    { id: 'floor_holo', category: 'FLOOR', name: 'Holo Grid', cost: 800, icon: '🟦' },
    { id: 'floor_gold', category: 'FLOOR', name: 'Gold Plate', cost: 2000, icon: '🟨' },
    { id: 'desk_standard', category: 'DESK', name: 'Standard Console', cost: 0, icon: '🖥️' },
    { id: 'desk_tech', category: 'DESK', name: 'Holo-Table', cost: 500, icon: '🔮' },
    { id: 'desk_commander', category: 'DESK', name: 'Commander Seat', cost: 1500, icon: '💺' },
    { id: 'desk_throne', category: 'DESK', name: 'Golden Throne', cost: 5000, icon: '👑' },
    { id: 'decor_none', category: 'DECOR', name: 'Empty', cost: 0, icon: '🚫' },
    { id: 'decor_plant', category: 'DECOR', name: 'Alien Plant', cost: 150, icon: '🌵' },
    { id: 'decor_bot', category: 'DECOR', name: 'Helper Bot', cost: 500, icon: '🤖' },
    { id: 'decor_trophy', category: 'DECOR', name: 'Champion Cup', cost: 1000, icon: '🏆' },
];

export const CosmicHQ: React.FC<CosmicHQProps> = ({ coins, setCoins, hqState, setHqState, onBack, petState, setPetState, onOpenVault, onOpenCodex, mastery }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [showPetMenu, setShowPetMenu] = useState(false);
  const [showEvolutionRoom, setShowEvolutionRoom] = useState(false);
  const { playWin, playCorrect, playDamage, playChargeUp } = useGameSound();

  const handlePetClick = () => { setShowPetMenu(!showPetMenu); playCorrect(); };
  
  const handleFeed = () => {
      if (!petState || !setPetState || coins < 50) { playDamage(); return; }
      setCoins(coins - 50); playChargeUp();
      setPetState({ ...petState, hunger: Math.min(100, petState.hunger + 30), lastInteraction: Date.now() });
      setTimeout(() => setShowPetMenu(false), 800);
  };

  const handleBuy = (item: HQItem) => {
      if (coins >= item.cost) { playWin(); setCoins(coins - item.cost); setHqState({ ...hqState, unlocked: [...hqState.unlocked, item.id] }); }
      else playDamage();
  };

  const handleEquip = (item: HQItem) => {
      playCorrect();
      const key = item.category.toLowerCase() as keyof typeof hqState.layout;
      setHqState({ ...hqState, layout: { ...hqState.layout, [key]: item.id } });
  };

  const nextEvolutionThreshold = petState?.evolutionLevel === 1 ? 30 : petState?.evolutionLevel === 2 ? 80 : petState?.evolutionLevel === 3 ? 150 : 250;
  const evolutionProgress = (petState?.evolutionPoints || 0) / nextEvolutionThreshold * 100;

  return (
    <div className="min-h-screen bg-slate-950 font-nunito flex flex-col relative overflow-hidden">
        
        {/* EVOLUTION ROOM MODAL */}
        {showEvolutionRoom && petState && (
          <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-slate-900 border-4 border-indigo-500/50 rounded-[3rem] p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                <button onClick={() => setShowEvolutionRoom(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><Binary size={32} /></button>
                
                <div className="text-center mb-10 relative z-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Câmara de Metamorfose</h2>
                    <p className="text-indigo-300 font-bold">Converta maestria matemática em evolução biológica.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                    <div className="bg-black/40 rounded-[2rem] p-8 flex items-center justify-center border-2 border-indigo-500/30">
                        <StarPet stage={petState.stage} mood="IDLE" size="lg" />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-black text-indigo-400 uppercase mb-2">
                                <span>DNA Progress</span>
                                <span>{petState.evolutionPoints} / {nextEvolutionThreshold} EXP</span>
                            </div>
                            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-indigo-500/20">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-1000" style={{ width: `${Math.min(100, evolutionProgress)}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-indigo-500/20">
                            <h4 className="text-white font-black text-xs uppercase mb-3 flex items-center gap-2"><Binary size={14} className="text-cyan-400" /> Próxima Mutação</h4>
                            <p className="text-indigo-200 text-sm font-bold">
                                Domine mais {Math.ceil((nextEvolutionThreshold - petState.evolutionPoints)/10)} conceitos para alcançar o Nível {petState.evolutionLevel + 1}.
                            </p>
                        </div>
                        <Button onClick={() => setShowEvolutionRoom(false)} className="w-full h-14 bg-indigo-600 border-indigo-800">Sincronizar e Voltar</Button>
                    </div>
                </div>
            </div>
          </div>
        )}

        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-30 pointer-events-none">
            <button onClick={onBack} className="pointer-events-auto bg-slate-800/80 backdrop-blur text-white p-3 rounded-xl border border-white/10 hover:bg-slate-700 transition-all"><ArrowLeft size={24} /></button>
            <div className="bg-slate-800/80 backdrop-blur text-white px-6 py-2 rounded-full border border-yellow-500/30 flex items-center gap-2 shadow-lg"><Zap size={20} className="text-yellow-400 fill-yellow-400" /><span className="font-black text-xl">{coins}</span></div>
        </div>

        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <div className="relative w-full max-w-4xl aspect-video md:aspect-[16/9] lg:aspect-[2/1] bg-slate-900 shadow-2xl overflow-hidden group">
                
                <div className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ${hqState.layout.view === 'view_mars' ? 'bg-gradient-to-b from-orange-900 to-red-900' : hqState.layout.view === 'view_nebula' ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black' : hqState.layout.view === 'view_void' ? 'bg-black' : 'bg-gradient-to-b from-[#0f172a] to-[#1e293b]'} cursor-pointer hover:brightness-110`} onClick={() => setActiveCategory('VIEW')}>
                    <div className="absolute inset-0 border-[40px] border-slate-800 pointer-events-none"></div>
                </div>

                <div className={`absolute bottom-0 w-full h-[35%] transition-all duration-500 ${hqState.layout.floor === 'floor_wood' ? 'bg-[#451a03]' : hqState.layout.floor === 'floor_holo' ? 'bg-blue-900/50' : hqState.layout.floor === 'floor_gold' ? 'bg-yellow-600/80' : 'bg-slate-800'} cursor-pointer hover:brightness-110`} onClick={() => setActiveCategory('FLOOR')}></div>

                {/* Evolution Lab Trigger */}
                <div onClick={() => { setShowEvolutionRoom(true); playChargeUp(); }} className="absolute top-[20%] right-[20%] cursor-pointer group z-20">
                    <div className="w-20 h-28 bg-indigo-900/40 border-4 border-indigo-500/30 rounded-t-full flex items-center justify-center relative overflow-hidden animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent"></div>
                        <Binary size={40} className="text-cyan-400 group-hover:scale-125 transition-transform" />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] uppercase font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-indigo-500/30">Câmara DNA</div>
                    </div>
                </div>

                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => setActiveCategory('DESK')}>
                    <div className="text-[120px] md:text-[180px] drop-shadow-2xl">{HQ_ITEMS.find(i => i.id === hqState.layout.desk)?.icon}</div>
                </div>

                {petState && (
                    <div className="absolute bottom-[20%] left-[20%] z-20">
                        <StarPet stage={petState.stage} mood={petState.hunger < 30 ? 'SAD' : 'HAPPY'} onClick={handlePetClick} className="drop-shadow-2xl" />
                        {showPetMenu && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white rounded-2xl p-4 shadow-xl border-4 border-indigo-500 w-48 animate-pop-in z-50">
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={handleFeed} className="flex flex-col items-center justify-center bg-orange-100 p-2 rounded-xl text-orange-600"><Utensils size={16} /><span className="text-[10px] font-bold mt-1">50 <Zap size={8} className="inline"/></span></button>
                                    <button onClick={() => { playWin(); setShowPetMenu(false); }} className="flex flex-col items-center justify-center bg-pink-100 p-2 rounded-xl text-pink-600"><Heart size={16} /><span className="text-[10px] font-bold mt-1">Brincar</span></button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        <div className={`absolute bottom-0 left-0 w-full bg-slate-900 border-t-4 border-slate-700 transition-transform duration-300 z-40 ${activeCategory ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800">
                <h3 className="text-white font-black text-xl uppercase tracking-widest flex items-center gap-2">Catálogo de {activeCategory}</h3>
                <button onClick={() => setActiveCategory(null)} className="text-slate-400 hover:text-white"><Check size={28} /></button>
            </div>
            <div className="p-6 overflow-x-auto">
                <div className="flex gap-4 min-w-max pb-4">
                    {HQ_ITEMS.filter(i => i.category === activeCategory).map(item => {
                        const isOwned = hqState.unlocked.includes(item.id);
                        const isEquipped = Object.values(hqState.layout).includes(item.id);
                        return (
                            <div key={item.id} className={`w-40 bg-slate-800 rounded-2xl p-4 flex flex-col items-center border-2 transition-all ${isEquipped ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-slate-700'}`}>
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <div className="text-white font-bold text-sm mb-1 text-center leading-tight">{item.name}</div>
                                <div className="mt-auto w-full pt-2">
                                    {isEquipped ? <div className="bg-green-500/20 text-green-400 text-center text-[10px] font-black uppercase py-2 rounded-lg">Ativo</div> : isOwned ? <Button onClick={() => handleEquip(item)} className="w-full py-2 text-xs bg-slate-700">Equipar</Button> : <Button onClick={() => handleBuy(item)} disabled={coins < item.cost} className="w-full py-2 text-xs bg-yellow-600">{item.cost} <Zap size={10} fill="currentColor" /></Button>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
};
