
import React, { useState } from 'react';
import { ArrowLeft, Coins, Check, Lock, Sparkles, ShoppingBag, Zap, Shield, Hourglass, Swords, Bot, MessageCircle, PaintBucket, Wand2, Hexagon, Gift } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';
import { CoinShopModal } from './CoinShopModal';
import { QuantumForge, ForgeResult } from './QuantumForge';

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  icon?: React.ElementType; // Optional Lucide Icon override
  cost: number;
  description: string;
  type?: 'AVATAR' | 'TRAIL' | 'THEME' | 'SUPPLY'; // New types
  isHidden?: boolean; // For Forge exclusives
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'MYTHIC' | 'LEGENDARY';
}

// --- CATALOG DATA ---

export const HERO_ITEMS: ShopItem[] = [
  { id: 'rocket', name: 'Star Voyager', emoji: '🚀', cost: 0, description: 'The trusty starter ship.', type: 'AVATAR', rarity: 'COMMON' },
  { id: 'wizard', name: 'Math Wizard', emoji: '🧙‍♂️', cost: 50, description: 'Casts spells of logic.', type: 'AVATAR', rarity: 'RARE' },
  { id: 'ninja', name: 'Number Ninja', emoji: '⚔️', icon: Swords, cost: 50, description: 'Silent and precise.', type: 'AVATAR', rarity: 'RARE' },
  { id: 'cat', name: 'Robo-Cat', emoji: '😻', cost: 50, description: 'Powered by purrs.', type: 'AVATAR', rarity: 'RARE' },
  { id: 'dragon', name: 'Gold Dragon', emoji: '🐲', cost: 150, description: 'Legendary beast.', type: 'AVATAR', rarity: 'EPIC' },
  { id: 'unicorn', name: 'Dream Horn', emoji: '🦄', cost: 150, description: 'Magic is real.', type: 'AVATAR', rarity: 'EPIC' },
  { id: 'king', name: 'The Ruler', emoji: '👑', cost: 500, description: 'Bow down to the master.', type: 'AVATAR', rarity: 'LEGENDARY' }, 
];

export const TRAIL_ITEMS: ShopItem[] = [
  { id: 'trail_default', name: 'Stardust', emoji: '✨', cost: 0, description: 'Basic sparkle trail.', type: 'TRAIL', rarity: 'COMMON' },
  { id: 'trail_fire', name: 'Comet Fire', emoji: '🔥', cost: 75, description: 'Burn the answers!', type: 'TRAIL', rarity: 'RARE' },
  { id: 'trail_ice', name: 'Frost Bite', emoji: '❄️', cost: 75, description: 'Cool and calculated.', type: 'TRAIL', rarity: 'RARE' },
  { id: 'trail_rainbow', name: 'Nyan Beam', emoji: '🌈', cost: 120, description: 'Pure colorful magic.', type: 'TRAIL', rarity: 'EPIC' },
  { id: 'trail_matrix', name: 'Matrix Code', emoji: '👾', cost: 150, description: 'Hack the system.', type: 'TRAIL', rarity: 'EPIC' },
  // MYTHIC ITEM (Forge Only)
  { id: 'trail_glitch', name: 'The Glitch', emoji: '💀', cost: 9999, description: 'Reality is breaking...', type: 'TRAIL', isHidden: true, rarity: 'MYTHIC' },
];

export const THEME_ITEMS: ShopItem[] = [
  { id: 'theme_default', name: 'Deep Space', emoji: '🌌', cost: 0, description: 'Classic void.', type: 'THEME', rarity: 'COMMON' },
  { id: 'theme_lava', name: 'Magma Pit', emoji: '🌋', cost: 200, description: 'Don\'t fall in!', type: 'THEME', rarity: 'EPIC' },
  { id: 'theme_ocean', name: 'Abyssal Zone', emoji: '🐙', cost: 200, description: 'Under the sea.', type: 'THEME', rarity: 'EPIC' },
  { id: 'theme_forest', name: 'Elven Grove', emoji: '🌲', cost: 200, description: 'Peaceful nature.', type: 'THEME', rarity: 'EPIC' },
  { id: 'theme_cyber', name: 'Neon City', emoji: '🌃', cost: 250, description: 'The future is now.', type: 'THEME', rarity: 'EPIC' },
];

export const ARSENAL_ITEMS = [
  { id: 'freeze', name: 'Time Freeze', emoji: '⏳', cost: 50, description: 'Pauses timer for 5s.', icon: Hourglass, rarity: 'COMMON' },
  { id: 'shield', name: 'Neural Shield', emoji: '🛡️', cost: 100, description: 'Blocks one mistake.', icon: Shield, rarity: 'COMMON' },
  { id: 'zap', name: 'Laser Focus', emoji: '⚡', cost: 75, description: 'Removes wrong answer.', icon: Zap, rarity: 'COMMON' },
];

export const SUPPLY_ITEMS: ShopItem[] = [
    { id: 'supply_screen', name: '30min Screen Time', emoji: '📺', cost: 500, description: 'Redeem for TV or Tablet time.', type: 'SUPPLY', rarity: 'RARE' },
    { id: 'supply_chores', name: 'Skip 1 Chore', emoji: '🧹', cost: 1500, description: 'Get out of cleaning duties once.', type: 'SUPPLY', rarity: 'EPIC' },
    { id: 'supply_dinner', name: 'Choose Dinner', emoji: '🍕', cost: 3000, description: 'You pick the meal tonight.', type: 'SUPPLY', rarity: 'EPIC' },
    { id: 'supply_movie', name: 'Movie Night Ticket', emoji: '🎟️', cost: 5000, description: 'Control the remote + Popcorn.', type: 'SUPPLY', rarity: 'LEGENDARY' },
];

// Combine all for easy export if needed, though we use separate lists mostly
export const SHOP_ITEMS = [...HERO_ITEMS, ...TRAIL_ITEMS, ...THEME_ITEMS, ...SUPPLY_ITEMS]; 

interface ShopProps {
  coins: number;
  inventory: string[];
  consumables: Record<string, number>;
  equippedAvatarId: string;
  equippedTrailId?: string;
  equippedThemeId?: string;
  onBuyItem: (item: ShopItem) => void;
  onBuyConsumable: (itemId: string, cost: number) => void;
  onBuySupply?: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  onBack: () => void;
  onForgeSpin?: () => ForgeResult; // New Prop
}

export const Shop: React.FC<ShopProps> = ({ 
  coins, 
  inventory, 
  consumables,
  equippedAvatarId, 
  equippedTrailId = 'trail_default',
  equippedThemeId = 'theme_default',
  onBuyItem, 
  onBuyConsumable,
  onBuySupply,
  onEquip, 
  onBack,
  onForgeSpin
}) => {
  const { playCorrect, playWin } = useGameSound();
  const [activeTab, setActiveTab] = useState<'HEROES' | 'FX' | 'THEMES' | 'ARSENAL' | 'FORGE' | 'SUPPLY'>('HEROES');
  const [showCoinShop, setShowCoinShop] = useState(false);

  const handleBuy = (item: ShopItem) => {
    playWin();
    onBuyItem(item);
  };

  const handleBuyConsumableLocal = (item: typeof ARSENAL_ITEMS[0]) => {
      playWin();
      onBuyConsumable(item.id, item.cost);
  }

  const handleBuySupplyLocal = (item: ShopItem) => {
      if (onBuySupply) {
          playWin();
          onBuySupply(item);
      }
  }

  const handleEquip = (item: ShopItem) => {
    playCorrect();
    onEquip(item);
  };

  // Helper to check equipped state based on tab
  const isEquipped = (itemId: string) => {
      if (activeTab === 'HEROES') return equippedAvatarId === itemId;
      if (activeTab === 'FX') return equippedTrailId === itemId;
      if (activeTab === 'THEMES') return equippedThemeId === itemId;
      return false;
  };

  const getSenseiMessage = () => {
      switch(activeTab) {
          case 'HEROES': return "Pick your champion! Changing your avatar boosts your confidence.";
          case 'FX': return "Add swag to your clicks! Make it rain fire, ice, or glitter when you win.";
          case 'THEMES': return "Bored of the dark? Battle in a volcano or under the sea!";
          case 'ARSENAL': return "Stuck on a tough level? Use Freezes to stop time or Shields to block mistakes!";
          case 'FORGE': return "Feeling lucky? Spend 500 Splitz to craft rare items or powerful supplies!";
          case 'SUPPLY': return "The ultimate prize! Trade your Splitz for real-world rewards. Show the coupon to your commander (parent).";
          default: return "Welcome to the Armory!";
      }
  };

  const renderGrid = (items: ShopItem[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.filter(i => !i.isHidden || inventory.includes(i.id)).map((item) => {
            const isOwned = inventory.includes(item.id) || item.cost === 0;
            const equipped = isEquipped(item.id);
            const canAfford = coins >= item.cost;
            const ItemIcon = item.icon;
            const isMythic = item.rarity === 'MYTHIC';

            return (
                <div 
                    key={item.id}
                    className={`bg-white rounded-3xl p-6 border-[3px] shadow-xl relative overflow-hidden transition-transform duration-200 hover:-translate-y-1
                        ${equipped ? 'border-[#4CAF50] ring-4 ring-green-100' : isMythic ? 'border-purple-500' : 'border-gray-100'}
                    `}
                >
                    {equipped && (
                        <div className="absolute top-0 right-0 bg-[#4CAF50] text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl z-10">
                            Active
                        </div>
                    )}
                    {isMythic && (
                        <div className="absolute top-0 left-0 bg-purple-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-br-xl z-10 animate-pulse">
                            MYTHIC
                        </div>
                    )}
                    
                    {/* Item Preview */}
                    <div className="flex justify-center mb-6 relative">
                        {/* Glow effect for high tier */}
                        {(item.cost >= 150 || isMythic) && (
                            <div className={`absolute inset-0 blur-3xl rounded-full scale-150 animate-pulse ${isMythic ? 'bg-purple-500/30' : 'bg-yellow-400/20'}`}></div>
                        )}
                        <div className="text-7xl md:text-8xl relative z-10 drop-shadow-md transition-transform hover:scale-110">
                            {ItemIcon ? <ItemIcon size={80} strokeWidth={1.5} className="text-gray-800" /> : item.emoji}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h3 className="text-xl font-black text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.description}</p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                        {isOwned ? (
                            <Button 
                                variant={equipped ? "secondary" : "primary"}
                                onClick={() => handleEquip(item)}
                                disabled={equipped}
                                className={`w-full py-3 text-lg ${equipped ? 'opacity-50 cursor-default border-gray-200' : ''}`}
                            >
                                {equipped ? (
                                    <> <Check size={18} /> Selected </>
                                ) : (
                                    "Equip"
                                )}
                            </Button>
                        ) : (
                            <Button 
                                variant="secondary"
                                onClick={() => handleBuy(item)}
                                disabled={!canAfford}
                                className={`w-full py-3 text-lg border-b-[6px]
                                    ${canAfford 
                                        ? 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100' 
                                        : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed grayscale opacity-80'}
                                `}
                            >
                                {canAfford ? (
                                    <span className="flex items-center gap-2">
                                        Buy <span className="font-black">{item.cost}</span> <Zap size={16} fill="currentColor" />
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Lock size={16} /> {item.cost} <Zap size={16} fill="currentColor" />
                                    </span>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            );
        })}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-nunito flex flex-col">
      <CoinShopModal isOpen={showCoinShop} onClose={() => setShowCoinShop(false)} />

      {/* Sticky Header */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold transition-colors shrink-0"
          >
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
          </button>
          
          {/* NAVIGATION TABS */}
          <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar gap-1 max-w-full">
             {[
                 { id: 'HEROES', icon: Bot, label: 'Heroes' },
                 { id: 'FX', icon: Wand2, label: 'Effects' },
                 { id: 'THEMES', icon: PaintBucket, label: 'Themes' },
                 { id: 'ARSENAL', icon: ShoppingBag, label: 'Arsenal' },
                 { id: 'SUPPLY', icon: Gift, label: 'Supply', highlight: true }, // New Tab
                 { id: 'FORGE', icon: Hexagon, label: 'Forge' }
             ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap
                        ${activeTab === tab.id 
                            ? (tab.highlight ? 'bg-purple-600 text-white shadow-md ring-1 ring-purple-400' : 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5')
                            : (tab.highlight ? 'text-purple-600 hover:bg-purple-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50')}
                    `}
                 >
                     <tab.icon size={14} className={tab.highlight && activeTab !== tab.id ? 'animate-pulse' : ''} /> {tab.label}
                 </button>
             ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 px-4 py-1.5 rounded-full flex items-center gap-2 shrink-0">
            <Zap size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-black text-yellow-600 text-lg">{coins}</span>
            {/* New Plus Button for Coin Shop */}
            <button 
                onClick={() => setShowCoinShop(true)}
                className="w-5 h-5 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-sm ml-1 transition-colors" 
                title="Get more Splitz"
            >
                <span className="font-black text-xs leading-none" style={{marginTop: '-1px'}}>+</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 animate-pop-in flex-1 w-full">
        
        {/* SENSEI TIP SECTION */}
        <div className={`rounded-3xl p-6 mb-10 flex items-center gap-6 shadow-xl relative overflow-hidden ${activeTab === 'FORGE' || activeTab === 'SUPPLY' ? 'bg-purple-900' : 'bg-indigo-900'}`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10"></div>
            
            <div className="relative z-10 shrink-0">
                <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 ${activeTab === 'FORGE' || activeTab === 'SUPPLY' ? 'border-purple-200' : 'border-indigo-200'} animate-float`}>
                    <Bot size={40} className={activeTab === 'FORGE' || activeTab === 'SUPPLY' ? 'text-purple-600' : 'text-indigo-600'} />
                </div>
            </div>
            
            <div className={`relative z-10 bg-white p-4 rounded-2xl rounded-tl-none shadow-md flex-1 ${activeTab === 'FORGE' || activeTab === 'SUPPLY' ? 'text-purple-900' : 'text-indigo-900'}`}>
                <div className={`flex items-center gap-2 mb-1 text-[10px] font-black uppercase tracking-widest ${activeTab === 'FORGE' || activeTab === 'SUPPLY' ? 'text-purple-400' : 'text-indigo-400'}`}>
                    <MessageCircle size={12} /> Sensei's Tip
                </div>
                <p className="font-bold text-sm md:text-base leading-tight">
                    {getSenseiMessage().replace('Coins', 'Splitz')}
                </p>
            </div>
        </div>

        {activeTab !== 'FORGE' && (
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 text-3d">
                    {activeTab === 'HEROES' ? 'Hero Roster' : 
                    activeTab === 'FX' ? 'Visual Effects' :
                    activeTab === 'THEMES' ? 'Battle Arenas' : 
                    activeTab === 'SUPPLY' ? 'Real World Rewards' : 'Tactical Supplies'}
                </h1>
                <p className="text-gray-500 font-bold text-lg">
                    {activeTab === 'ARSENAL' ? 'Gain the advantage in tough levels.' : 
                     activeTab === 'SUPPLY' ? 'Convert your effort into reality.' : 'Customize your learning experience.'}
                </p>
            </div>
        )}

        {/* CONTENT SWITCHER */}
        {activeTab === 'HEROES' && renderGrid(HERO_ITEMS)}
        {activeTab === 'FX' && renderGrid(TRAIL_ITEMS)}
        {activeTab === 'THEMES' && renderGrid(THEME_ITEMS)}
        
        {activeTab === 'ARSENAL' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ARSENAL_ITEMS.map((item) => {
                    const quantity = consumables[item.id] || 0;
                    const canAfford = coins >= item.cost;

                    return (
                        <div 
                            key={item.id}
                            className="bg-white rounded-3xl p-6 border-[3px] border-gray-100 shadow-xl relative overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl z-10">
                                Owned: {quantity}
                            </div>
                            
                            <div className="flex justify-center mb-6 relative">
                                <div className="text-7xl md:text-8xl relative z-10 drop-shadow-md">
                                    {item.emoji}
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black text-gray-900 mb-1">{item.name}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.description}</p>
                            </div>

                            <div className="mt-auto">
                                <Button 
                                    variant="secondary"
                                    onClick={() => handleBuyConsumableLocal(item)}
                                    disabled={!canAfford}
                                    className={`w-full py-3 text-lg border-b-[6px]
                                        ${canAfford 
                                            ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' 
                                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed grayscale opacity-80'}
                                    `}
                                >
                                     {canAfford ? (
                                        <span className="flex items-center gap-2">
                                            Buy <span className="font-black">{item.cost}</span> <Zap size={16} fill="currentColor" />
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Lock size={16} /> {item.cost} <Zap size={16} fill="currentColor" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {/* --- SUPPLY TAB (NEW) --- */}
        {activeTab === 'SUPPLY' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SUPPLY_ITEMS.map((item) => {
                    const canAfford = coins >= item.cost;
                    const isEpic = item.rarity === 'EPIC' || item.rarity === 'LEGENDARY';

                    return (
                        <div 
                            key={item.id}
                            className={`bg-white rounded-3xl p-6 border-[3px] shadow-xl relative overflow-hidden transition-transform duration-200 hover:-translate-y-1
                                ${isEpic ? 'border-yellow-400' : 'border-gray-100'}
                            `}
                        >
                            {isEpic && (
                                <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl z-10">
                                    High Value
                                </div>
                            )}
                            
                            <div className="flex justify-center mb-6 relative">
                                <div className="text-7xl md:text-8xl relative z-10 drop-shadow-md">
                                    {item.emoji}
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black text-gray-900 mb-1">{item.name}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.description}</p>
                            </div>

                            <div className="mt-auto">
                                <Button 
                                    variant="secondary"
                                    onClick={() => handleBuySupplyLocal(item)}
                                    disabled={!canAfford}
                                    className={`w-full py-3 text-lg border-b-[6px]
                                        ${canAfford 
                                            ? 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100' 
                                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed grayscale opacity-80'}
                                    `}
                                >
                                     {canAfford ? (
                                        <span className="flex items-center gap-2">
                                            Buy <span className="font-black">{item.cost}</span> <Zap size={16} fill="currentColor" />
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Lock size={16} /> {item.cost} <Zap size={16} fill="currentColor" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {/* --- QUANTUM FORGE TAB --- */}
        {activeTab === 'FORGE' && onForgeSpin && (
            <QuantumForge 
                coins={coins}
                onSpin={onForgeSpin}
                onOpenCoinShop={() => setShowCoinShop(true)}
            />
        )}

      </main>
    </div>
  );
};
