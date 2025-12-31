
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './lib/supabaseClient';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MicroDojo } from './components/MicroDojo';
import { Problem } from './components/Problem';
import { WhyChoose } from './components/WhyChoose';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { CTA } from './components/CTA';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { FAQ } from './components/FAQ';
import { StickyCTA } from './components/StickyCTA';
import { OnboardingQuiz } from './components/OnboardingQuiz';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { GameArena, GameStats } from './components/GameArena';
import { Shop, ShopItem } from './components/Shop';
import { UpgradeGrid } from './components/UpgradeGrid';
import { HallOfFame } from './components/HallOfFame';
import { GuardianInterface } from './components/GuardianInterface';
import { InstallMission } from './components/InstallMission';
import { InstallPrompt } from './components/InstallPrompt';
import { TitanArena } from './components/TitanArena';
import { LeagueStandings } from './components/LeagueStandings';
import { CosmicHQ } from './components/CosmicHQ';
import { MemoryCodex } from './components/MemoryCodex';
import { PrintableHQ } from './components/PrintableHQ';
import { TrainingDojo } from './components/TrainingDojo';
import { OrbitalDefense } from './components/OrbitalDefense';
import { QuantumArena } from './components/QuantumArena';
import { HyperDuel } from './components/HyperDuel';
import { SeasonCeremony } from './components/SeasonCeremony';
import { CheckoutBridge } from './components/CheckoutBridge';
import { PurchaseSuccessOverlay } from './components/PurchaseSuccessOverlay';
import { ProfileSelector } from './components/ProfileSelector';
import { prepareNarrativeTokens } from './services/ChronicleEngine';
import { generateDynamicChronicle } from './services/GeminiService';
import { LEVELS } from './data/LevelConfig';
import { LogicExpansionModal } from './components/upsell/LogicExpansionModal';
import { AlgebraExpansionModal } from './components/upsell/AlgebraExpansionModal';
import { LogicArena } from './components/LogicArena';
import { TechDojo } from './components/TechDojo';
import { DailyRewardModal } from './components/DailyRewardModal';
import { ForgeResult } from './components/QuantumForge';
import { ToastSystem, ToastMessage, ToastType } from './components/ui/ToastSystem';
import { SquadronCenter } from './components/SquadronCenter';
import { RealityCoupons, RealWorldItem } from './components/RealityCoupons';

// --- TYPES ---
export type MasteryMap = Record<string, number>;

export interface Bounty {
  id: string;
  title: string;
  goal: string;
  current: number;
  target: number;
  reward: number;
  type: 'CORRECT_ANSWERS' | 'STREAK' | 'LEVEL_COMPLETE';
}

export interface PetState {
  stage: 'EGG' | 'PROTO' | 'SENTINEL' | 'GUARDIAN' | 'GALACTIC';
  mood: 'IDLE' | 'HAPPY' | 'SAD' | 'EATING' | 'SLEEPING' | 'DANCING';
  hunger: number;
  evolutionPoints: number;
  evolutionLevel: number;
  lastInteraction: number;
}

export interface HQState {
  unlocked: string[];
  layout: {
    view: string;
    floor: string;
    desk: string;
    decor: string;
  };
}

export interface Chronicle {
  id: string;
  text: string;
  level: number;
  timestamp: string;
}

export interface ChronoEvent {
  type: 'BLITZ' | 'GRAVITY_WELL' | 'SPLITZ_RAIN';
  title: string;
  description: string;
  endsAt: number;
  multiplier: number;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  villain: string;
  progress: {
    unlockedLevel: number;
    totalStars: number;
    coins: number;
    mastery: MasteryMap;
    consumables: Record<string, number>;
    upgrades: Record<string, number>;
    inventory: string[];
    equippedItems: {
      avatar: string;
      trail: string;
      theme: string;
    };
    bounties: Bounty[];
    chronicles: Chronicle[];
    pet: PetState;
    hq: HQState;
    unlockedArtifacts: string[];
    equippedArtifact: string | null;
    lastDailyBriefing: string | null;
    // SQUADRON DATA
    referralCode?: string;
    redeemedCode?: boolean; // Has this user redeemed someone else's code?
    recruitsCount?: number; // How many people used this user's code?
    // REAL WORLD REWARDS
    realWorldInventory?: RealWorldItem[];
    // NEURAL COOLDOWN (PROTOCOL)
    dailyLevelCount?: number; // How many levels beaten today
    lastPlayedDate?: string; // "YYYY-MM-DD"
  };
}

const DEFAULT_PET: PetState = {
    stage: 'EGG',
    mood: 'IDLE',
    hunger: 50,
    evolutionPoints: 0,
    evolutionLevel: 1,
    lastInteraction: Date.now()
};

const DEFAULT_HQ: HQState = {
    unlocked: ['view_earth', 'floor_steel', 'desk_standard', 'decor_none'],
    layout: { view: 'view_earth', floor: 'floor_steel', desk: 'desk_standard', decor: 'decor_none' }
};

const STORAGE_KEY = 'timeSplit_profiles_v1';
const DAILY_LEVEL_LIMIT = 3; // The "15-minute Protocol" Limit

// Generate a simple random code like "AGENT-823"
const generateReferralCode = () => {
    return `AGENT-${Math.floor(100 + Math.random() * 900)}`;
};

export default function App() {
  // --- STATE ---
  const [view, setView] = useState<'LANDING' | 'PROFILES' | 'DASHBOARD' | 'GAME' | 'SHOP' | 'UPGRADES' | 'HALL' | 'GUARDIAN' | 'TITAN' | 'LEAGUE' | 'HQ' | 'CODEX' | 'PRINT' | 'DOJO' | 'ORBITAL' | 'QUANTUM' | 'DUEL' | 'LOGIC_ARENA' | 'TECH_DOJO' | 'SQUADRON' | 'INVENTORY'>('LANDING');
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'SAVED' | 'SYNCING' | 'ERROR' | 'OFFLINE_CHANGES'>('SAVED');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [isPremium, setIsPremium] = useState(false);
  const [isFamilyPlan, setIsFamilyPlan] = useState(false);
  const [hasBackupInsurance, setHasBackupInsurance] = useState(false);
  const [hasOfflineKit, setHasOfflineKit] = useState(false);
  
  // Accessibility State (App Level)
  const [isZenMode, setIsZenMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Game Event State
  const [activeEvent, setActiveEvent] = useState<ChronoEvent | null>(null);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [showLogin, setShowLogin] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAlgebraModal, setShowAlgebraModal] = useState(false); // New Modal
  const [checkoutBump, setCheckoutBump] = useState<'KIT' | 'INSURANCE' | null>(null); // Controls initial state of checkout
  
  const [showSuccessOverlay, setShowSuccessOverlay] = useState<{coins: number, items: string[]} | null>(null);
  const [showSeasonCeremony, setShowSeasonCeremony] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  
  // Refs
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- TOAST HELPER ---
  const addToast = (message: string, type: ToastType = 'INFO') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- INIT ---
  useEffect(() => {
    // 1. Load Local Profiles
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        setProfiles(JSON.parse(localData));
      } catch (e) { console.error("Corrupt local data", e); }
    }

    // 2. Auth Listener
    if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkPremiumStatus(session.user.id);
                subscribeToProfileUpdates(session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkPremiumStatus(session.user.id);
                loadCloudData(session.user.id);
                subscribeToProfileUpdates(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }
  }, []);

  // --- EVENT SCHEDULER ---
  useEffect(() => {
      // Random event every 5-10 minutes to keep engagement high
      const scheduleEvent = () => {
          const timeout = Math.random() * (600000 - 300000) + 300000;
          setTimeout(() => {
              const events: ChronoEvent[] = [
                  { type: 'BLITZ', title: 'Speed Surge', description: 'Double XP for Speed Runs', endsAt: Date.now() + 1000 * 60 * 15, multiplier: 2 },
                  { type: 'GRAVITY_WELL', title: 'Gravity Well', description: 'Time flows slower, but errors cost double', endsAt: Date.now() + 1000 * 60 * 15, multiplier: 1.5 },
                  { type: 'SPLITZ_RAIN', title: 'Meteor Shower', description: 'Coin drops increased by 50%', endsAt: Date.now() + 1000 * 60 * 15, multiplier: 1.5 }
              ];
              setActiveEvent(events[Math.floor(Math.random() * events.length)]);
              scheduleEvent(); // Reschedule next
          }, timeout);
      };
      scheduleEvent();
  }, []);

  const checkPremiumStatus = async (userId: string) => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('profiles').select('is_premium, is_family_plan, has_backup_insurance, has_offline_kit').eq('user_id', userId).single();
        if (data) {
            if (data.is_premium) setIsPremium(true);
            if (data.is_family_plan) setIsFamilyPlan(true);
            if (data.has_backup_insurance) setHasBackupInsurance(true);
            if (data.has_offline_kit) setHasOfflineKit(true);
        }
      } catch (err) {
        // Silent fail on connection issues during premium check
        console.warn("Premium check pending connection");
      }
  };

  const subscribeToProfileUpdates = (userId: string) => {
      if (!supabase) return;
      
      const channel = supabase
        .channel('profile_changes')
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'profiles', 
            filter: `user_id=eq.${userId}` 
        }, (payload) => {
            const newData = payload.new as any;
            if (newData.is_premium) {
                setIsPremium(true);
                addToast("Acesso VIP Confirmado! Todas as barreiras removidas.", "SUCCESS");
            }
            if (newData.is_family_plan) setIsFamilyPlan(true);
            if (newData.has_backup_insurance) setHasBackupInsurance(true);
            if (newData.has_offline_kit) setHasOfflineKit(true);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
  };

  const loadCloudData = async (userId: string) => {
      if (!supabase) return;
      try {
        const { data } = await supabase.from('player_progress').select('profile_data, updated_at').eq('user_id', userId).single();
        
        if (data) {
            const localTime = localStorage.getItem('timeSplit_last_modified');
            // Simple conflict resolution: Cloud wins if newer or no local time
            if (!localTime || new Date(data.updated_at) > new Date(localTime)) {
                setProfiles(data.profile_data as Profile[]);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.profile_data));
                addToast("Dados sincronizados da nuvem", "INFO");
            }
        }
      } catch (err) {
        console.warn("Could not load cloud data immediately");
      }
  };

  // --- PERSISTENCE & RESILIENCE ---
  const persistData = useCallback(async (newProfiles: Profile[], forceCloud: boolean = false) => {
      const sanitizedProfiles = newProfiles.map(p => ({
          ...p,
          progress: {
              ...p.progress,
              chronicles: (p.progress.chronicles || []).slice(0, 30)
          }
      }));

      // 1. ALWAYS SAVE LOCAL FIRST (Safety Net)
      try {
          const timestamp = new Date().toISOString();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedProfiles));
          localStorage.setItem('timeSplit_last_modified', timestamp);
      } catch (e) {
          console.error("Local Persist Failed", e);
          addToast("Erro ao salvar no dispositivo. Verifique espaço livre.", "ERROR");
      }

      // 2. ATTEMPT CLOUD SYNC
      if (!supabase || !user) {
          setSyncStatus('SAVED');
          return;
      }

      if (!navigator.onLine && !forceCloud) {
          setSyncStatus('OFFLINE_CHANGES');
          return; // Stay quiet if just offline
      }

      setSyncStatus('SYNCING');
      
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      
      syncTimeoutRef.current = setTimeout(async () => {
          try {
              if (!navigator.onLine) {
                  setSyncStatus('OFFLINE_CHANGES');
                  return;
              }

              const { error } = await supabase
                  .from('player_progress')
                  .upsert({ 
                      user_id: user.id, 
                      profile_data: sanitizedProfiles,
                      updated_at: new Date().toISOString()
                  }, { onConflict: 'user_id' });
              
              if (error) throw error;
              
              setSyncStatus('SAVED');
              // Only show toast on manual backup or major events to avoid spam
              if (forceCloud) addToast("Progresso salvo na nuvem com sucesso.", "SUCCESS");

          } catch (err) {
              console.error("Cloud Save Failed:", err);
              setSyncStatus('ERROR');
              // Friendly "Human" Error
              addToast("A internet oscilou. Seus dados estão salvos no dispositivo e serão sincronizados em breve.", "ERROR");
          }
      }, 1000); // Debounce save
  }, [user]);

  // --- ACTIONS ---
  const handleProfileSelect = (id: string) => {
      setCurrentProfileId(id);
      
      // CHECK DAILY LIMIT RESET
      const profile = profiles.find(p => p.id === id);
      if (profile) {
          const today = new Date().toISOString().split('T')[0];
          if (profile.progress.lastPlayedDate !== today) {
              // Reset Logic for New Day
              updateCurrentProfile(p => ({
                  ...p,
                  progress: {
                      ...p.progress,
                      dailyLevelCount: 0,
                      lastPlayedDate: today
                  }
              }));
          }
          
          if (Math.random() > 0.7) setShowDailyReward(true);
      }
      
      setView('DASHBOARD');
  };

  const handleCreateProfile = (data: { name: string, villain: string, avatar: string }) => {
      const newProfile: Profile = {
          id: Date.now().toString(),
          name: data.name,
          avatar: data.avatar,
          villain: data.villain,
          progress: {
              unlockedLevel: 1,
              totalStars: 0,
              coins: 0,
              mastery: {},
              consumables: {},
              upgrades: {},
              inventory: ['rocket', 'trail_default', 'theme_default'],
              equippedItems: { avatar: 'rocket', trail: 'trail_default', theme: 'theme_default' },
              bounties: [],
              chronicles: [],
              pet: DEFAULT_PET,
              hq: DEFAULT_HQ,
              unlockedArtifacts: [],
              equippedArtifact: null,
              lastDailyBriefing: null,
              referralCode: generateReferralCode(),
              redeemedCode: false,
              recruitsCount: 0,
              realWorldInventory: [],
              dailyLevelCount: 0,
              lastPlayedDate: new Date().toISOString().split('T')[0]
          }
      };
      
      const updated = [...profiles, newProfile];
      setProfiles(updated);
      persistData(updated);
      setCurrentProfileId(newProfile.id);
      setView('DASHBOARD');
      setShowQuiz(false);
      addToast(`Perfil de ${data.name} criado!`, "SUCCESS");
  };

  const updateCurrentProfile = (updater: (p: Profile) => Profile, showSaveToast = false) => {
      if (!currentProfileId) return;
      const updatedProfiles = profiles.map(p => p.id === currentProfileId ? updater(p) : p);
      setProfiles(updatedProfiles);
      persistData(updatedProfiles, showSaveToast);
  };

  const handleStartSession = (levelId: number) => {
      // 1. NEURAL COOLDOWN CHECK (Anti-Binge)
      const p = getCurrentProfile();
      if (p) {
          const playedToday = p.progress.dailyLevelCount || 0;
          const isNextLevel = levelId > p.progress.unlockedLevel - 1; // Playing a new level
          
          if (isNextLevel && playedToday >= DAILY_LEVEL_LIMIT) {
              addToast("Neural Overheat! Train in Dojo or fight Titan to cooldown.", "WARNING");
              return; // Block entry
          }
      }

      // 2. PREMIUM LOCK CHECK
      if (levelId > 3 && !isPremium) {
          setCheckoutBump(null);
          setShowCheckout(true);
          return;
      }

      setActiveLevelId(levelId);
      const levelConfig = LEVELS.find(l => l.id === levelId);
      if (levelConfig?.isBoss) {
          setView('GAME');
      } else {
          setView('GAME');
      }
  };

  const handleGameComplete = async (stats: GameStats) => {
      if (!currentProfileId) return;
      const profile = profiles.find(p => p.id === currentProfileId);
      if (!profile) return;

      const isWin = stats.stars > 0;
      
      const narrativeTokens = prepareNarrativeTokens(stats, profile.progress.mastery, profile.villain, activeLevelId % 5 === 0);
      const chronicleText = await generateDynamicChronicle(profile.name, narrativeTokens);

      updateCurrentProfile(p => {
          const newCoins = p.progress.coins + stats.earnedCoins;
          const newStars = p.progress.totalStars + stats.stars;
          const nextLevel = isWin && activeLevelId === p.progress.unlockedLevel ? p.progress.unlockedLevel + 1 : p.progress.unlockedLevel;
          
          let updatedArtifacts = p.progress.unlockedArtifacts;
          if (stats.earnedArtifact && !updatedArtifacts.includes(stats.earnedArtifact)) {
              updatedArtifacts = [...updatedArtifacts, stats.earnedArtifact];
          }

          const newChronicle: Chronicle = {
              id: Date.now().toString(),
              text: chronicleText,
              level: activeLevelId,
              timestamp: new Date().toLocaleDateString()
          };
          
          // NEURAL COOLDOWN UPDATE
          let dailyCount = p.progress.dailyLevelCount || 0;
          if (isWin && activeLevelId === p.progress.unlockedLevel) { // Only count NEW progress
              dailyCount += 1;
          }

          return {
              ...p,
              progress: {
                  ...p.progress,
                  coins: newCoins,
                  totalStars: newStars,
                  unlockedLevel: nextLevel,
                  chronicles: [newChronicle, ...p.progress.chronicles],
                  unlockedArtifacts: updatedArtifacts,
                  dailyLevelCount: dailyCount
              }
          };
      }, true); // Save visibly on level complete

      setView('DASHBOARD');
      if (isWin) addToast("Nível Concluído! Progresso Salvo.", "SUCCESS");
  };

  // Logic for the Quantum Forge (Weighted Random)
  const handleForgeSpin = (): ForgeResult => {
      const rand = Math.random();
      let rarity: 'COMMON' | 'RARE' | 'EPIC' | 'MYTHIC' = 'COMMON';
      if (rand > 0.6) rarity = 'RARE';
      if (rand > 0.9) rarity = 'EPIC';
      if (rand > 0.99) rarity = 'MYTHIC';

      const typeRand = Math.random();
      if (typeRand > 0.7) {
          const base = rarity === 'COMMON' ? 100 : rarity === 'RARE' ? 300 : rarity === 'EPIC' ? 1000 : 5000;
          return { type: 'COINS', name: 'Coin Cache', amount: base, rarity };
      } else {
          const items = ['freeze', 'shield', 'zap'];
          const item = items[Math.floor(Math.random() * items.length)];
          return { type: 'CONSUMABLE', id: item, name: 'Tactical Item', rarity, amount: 1 };
      }
  };

  // REDEEM SQUADRON CODE
  const handleRedeemCode = (code: string): boolean => {
      const p = getCurrentProfile();
      if (!p || p.progress.redeemedCode) return false;
      
      // Simple validation: must start with AGENT- and be > 7 chars
      if (code.startsWith('AGENT-') && code.length > 7 && code !== p.progress.referralCode) {
          updateCurrentProfile(prof => ({
              ...prof,
              progress: {
                  ...prof.progress,
                  coins: prof.progress.coins + 500,
                  redeemedCode: true
              }
          }), true);
          return true;
      }
      return false;
  };

  // --- PARENTAL CONTROL HANDLERS (New Block 3) ---
  const handleApproveItem = (itemId: string) => {
      updateCurrentProfile(p => ({
          ...p,
          progress: {
              ...p.progress,
              realWorldInventory: (p.progress.realWorldInventory || []).map(item =>
                  item.id === itemId ? { ...item, status: 'USED' } : item
              )
          }
      }), true);
      addToast("Recompensa Aprovada com Sucesso!", "SUCCESS");
  };

  const handleRefundItem = (itemId: string) => {
      updateCurrentProfile(p => {
          const item = p.progress.realWorldInventory?.find(i => i.id === itemId);
          if (!item) return p;

          const refundAmount = item.cost;
          return {
              ...p,
              progress: {
                  ...p.progress,
                  coins: p.progress.coins + refundAmount,
                  realWorldInventory: (p.progress.realWorldInventory || []).filter(i => i.id !== itemId)
              }
          };
      }, true);
      addToast("Item reembolsado. Moedas devolvidas à criança.", "INFO");
  };

  const getCurrentProfile = () => profiles.find(p => p.id === currentProfileId);

  // --- RENDER ---
  if (view === 'LANDING') {
      return (
          <>
            <Header onSignInClick={() => setShowLogin(true)} />
            <Hero onStartQuiz={() => {
                if (profiles.length > 0) setView('PROFILES');
                else setShowQuiz(true);
            }} />
            <MicroDojo />
            <Problem />
            <HowItWorks />
            <WhyChoose />
            <Testimonials />
            <Pricing onCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }} />
            <FAQ />
            <Footer />
            <StickyCTA onStartQuiz={() => setShowQuiz(true)} />
            <InstallPrompt />
            <InstallMission />
            
            <OnboardingQuiz 
                isOpen={showQuiz} 
                onClose={() => setShowQuiz(false)} 
                onComplete={handleCreateProfile} 
            />
            {showLogin && <LoginPage onLoginSuccess={() => { setShowLogin(false); setView('PROFILES'); }} onBack={() => setShowLogin(false)} />}
            <CheckoutBridge isOpen={showCheckout} onClose={() => setShowCheckout(false)} price={37} />
          </>
      );
  }

  if (view === 'PROFILES') {
      return <ProfileSelector profiles={profiles} onSelect={handleProfileSelect} onAddNew={() => setShowQuiz(true)} isPremium={isPremium} isFamilyPlan={isFamilyPlan} />;
  }

  const activeProfile = getCurrentProfile();
  if (!activeProfile) return <div onClick={() => setView('PROFILES')}>Error loading profile. Click to reset.</div>;

  return (
    <>
        <ToastSystem toasts={toasts} removeToast={removeToast} />
        <AlgebraExpansionModal isOpen={showAlgebraModal} onClose={() => setShowAlgebraModal(false)} onCheckout={() => { window.open('https://pay.hotmart.com/ALGEBRA_LINK'); setShowAlgebraModal(false); }} />
        
        {view === 'DASHBOARD' && (
            <Dashboard 
                childName={activeProfile.name}
                unlockedLevel={activeProfile.progress.unlockedLevel}
                totalStars={activeProfile.progress.totalStars}
                coins={activeProfile.progress.coins}
                equippedAvatar={activeProfile.progress.equippedItems.avatar === 'rocket' ? '🚀' : '🦸'}
                mastery={activeProfile.progress.mastery}
                consumables={activeProfile.progress.consumables}
                bounties={activeProfile.progress.bounties}
                petState={activeProfile.progress.pet}
                villain={activeProfile.villain}
                isPremium={isPremium}
                syncStatus={syncStatus}
                onStartSession={handleStartSession}
                onSignOut={() => setView('PROFILES')}
                onOpenShop={() => setView('SHOP')}
                onOpenUpgrades={() => setView('UPGRADES')}
                onOpenDojo={() => setView('DOJO')}
                onOpenHallOfFame={() => setView('HALL')}
                onOpenSquadron={() => setView('SQUADRON')}
                onOpenInventory={() => setView('INVENTORY')}
                onOpenGuardian={() => { 
                    // REMOVED: if (!isPremium) { setShowCheckout(true); return; } 
                    // REASON: We now allow free users into Guardian Interface but show restricted content there
                    setView('GUARDIAN'); 
                }}
                onOpenTitan={() => { 
                    // Allow Titan Arena even if campaign blocked, but maybe premium check for full rewards later
                    setView('TITAN'); 
                }}
                onOpenBase={() => setView('HQ')}
                onOpenPrintables={() => setView('PRINT')}
                onBuyConsumable={(id, cost) => updateCurrentProfile(p => ({
                    ...p, 
                    progress: { ...p.progress, coins: p.progress.coins - cost, consumables: { ...p.progress.consumables, [id]: (p.progress.consumables[id] || 0) + 1 } }
                }))}
                onClaimBounty={(id) => updateCurrentProfile(p => ({
                    ...p,
                    progress: { ...p.progress, coins: p.progress.coins + 50, bounties: p.progress.bounties.filter(b => b.id !== id) } 
                }), true)}
                onTriggerCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }}
                activeEvent={activeEvent}
                onEventEnd={() => setActiveEvent(null)}
                onAddCoins={(amount) => updateCurrentProfile(p => ({
                    ...p,
                    progress: { ...p.progress, coins: p.progress.coins + amount }
                }), true)}
                dailyLevelCount={activeProfile.progress.dailyLevelCount || 0} // Pass for UI
            />
        )}

        {view === 'GAME' && (
            <GameArena 
                level={activeLevelId}
                childData={{ name: activeProfile.name, villain: activeProfile.villain, avatar: activeProfile.avatar }}
                mastery={activeProfile.progress.mastery}
                coins={activeProfile.progress.coins}
                consumables={activeProfile.progress.consumables}
                upgrades={activeProfile.progress.upgrades}
                petState={activeProfile.progress.pet}
                equippedArtifactId={activeProfile.progress.equippedArtifact}
                activeEvent={activeEvent}
                onExit={() => setView('DASHBOARD')}
                onComplete={handleGameComplete}
                onUpdateMastery={(updates) => updateCurrentProfile(p => ({
                    ...p, progress: { ...p.progress, mastery: { ...p.progress.mastery, ...updates } }
                }))}
                onConsume={(id) => updateCurrentProfile(p => ({
                    ...p, progress: { ...p.progress, consumables: { ...p.progress.consumables, [id]: Math.max(0, (p.progress.consumables[id] || 0) - 1) } }
                }))}
                onBuyConsumable={(id, cost) => updateCurrentProfile(p => ({
                    ...p, progress: { ...p.progress, coins: p.progress.coins - cost, consumables: { ...p.progress.consumables, [id]: (p.progress.consumables[id] || 0) + 1 } }
                }))}
                referralCode={activeProfile.progress.referralCode}
                isZenMode={isZenMode}
                isHighContrast={isHighContrast}
            />
        )}

        {view === 'SQUADRON' && (
            <SquadronCenter 
                onBack={() => setView('DASHBOARD')}
                referralCode={activeProfile.progress.referralCode || 'AGENT-000'}
                recruitsCount={activeProfile.progress.recruitsCount || 0}
                onRedeemCode={handleRedeemCode}
            />
        )}

        {view === 'SHOP' && (
            <Shop 
                coins={activeProfile.progress.coins}
                inventory={activeProfile.progress.inventory}
                consumables={activeProfile.progress.consumables}
                equippedAvatarId={activeProfile.progress.equippedItems.avatar}
                equippedTrailId={activeProfile.progress.equippedItems.trail}
                equippedThemeId={activeProfile.progress.equippedItems.theme}
                onBack={() => setView('DASHBOARD')}
                onBuyItem={(item) => updateCurrentProfile(p => ({
                    ...p, progress: { ...p.progress, coins: p.progress.coins - item.cost, inventory: [...p.progress.inventory, item.id] }
                }), true)}
                onBuyConsumable={(id, cost) => updateCurrentProfile(p => ({
                    ...p, progress: { ...p.progress, coins: p.progress.coins - cost, consumables: { ...p.progress.consumables, [id]: (p.progress.consumables[id] || 0) + 1 } }
                }), true)}
                onEquip={(item) => updateCurrentProfile(p => {
                    const type = item.type === 'TRAIL' ? 'trail' : item.type === 'THEME' ? 'theme' : 'avatar';
                    return { ...p, progress: { ...p.progress, equippedItems: { ...p.progress.equippedItems, [type]: item.id } } };
                })}
                onForgeSpin={handleForgeSpin}
                onBuySupply={(item) => updateCurrentProfile(p => ({
                    ...p, 
                    progress: { 
                        ...p.progress, 
                        coins: p.progress.coins - item.cost,
                        realWorldInventory: [
                            ...(p.progress.realWorldInventory || []),
                            {
                                id: Date.now().toString(),
                                itemId: item.id,
                                name: item.name,
                                cost: item.cost,
                                purchasedAt: new Date().toISOString(),
                                status: 'UNUSED'
                            }
                        ]
                    }
                }), true)}
            />
        )}

        {view === 'INVENTORY' && (
            <RealityCoupons 
                onBack={() => setView('DASHBOARD')}
                inventory={activeProfile.progress.realWorldInventory || []}
                onConsume={(id) => updateCurrentProfile(p => ({
                    ...p,
                    progress: {
                        ...p.progress,
                        realWorldInventory: (p.progress.realWorldInventory || []).map(item => 
                            item.id === id ? { ...item, status: 'ACTIVE', activatedAt: new Date().toISOString() } : item
                        )
                    }
                }), true)}
                onFinish={(id) => updateCurrentProfile(p => ({
                    ...p,
                    progress: {
                        ...p.progress,
                        realWorldInventory: (p.progress.realWorldInventory || []).map(item => 
                            item.id === id ? { ...item, status: 'USED' } : item
                        )
                    }
                }), true)}
            />
        )}

        {/* ... Other Views ... */}
        {view === 'HQ' && <CosmicHQ coins={activeProfile.progress.coins} setCoins={(amt) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: amt } }))} hqState={activeProfile.progress.hq} setHqState={(hq) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, hq } }), true)} petState={activeProfile.progress.pet} setPetState={(pet) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, pet } }), true)} mastery={activeProfile.progress.mastery} onBack={() => setView('DASHBOARD')} />}
        {view === 'UPGRADES' && <UpgradeGrid upgrades={activeProfile.progress.upgrades} coins={activeProfile.progress.coins} onBack={() => setView('DASHBOARD')} onBuy={(id, cost) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins - cost, upgrades: { ...p.progress.upgrades, [id]: (p.progress.upgrades[id] || 0) + 1 } } }), true)} />}
        {view === 'HALL' && <HallOfFame unlockedIds={[]} onBack={() => setView('DASHBOARD')} />}
        
        {view === 'GUARDIAN' && (
            <GuardianInterface 
                onBack={() => setView('DASHBOARD')} 
                mastery={activeProfile.progress.mastery} 
                onResetProfile={() => { 
                    const resetP: Profile = { ...activeProfile, progress: { unlockedLevel: 1, totalStars: 0, coins: 0, mastery: {}, consumables: {}, upgrades: {}, inventory: ['rocket', 'trail_default', 'theme_default'], equippedItems: { avatar: 'rocket', trail: 'trail_default', theme: 'theme_default' }, bounties: [], chronicles: [], pet: DEFAULT_PET, hq: DEFAULT_HQ, unlockedArtifacts: [], equippedArtifact: null, lastDailyBriefing: null, referralCode: activeProfile.progress.referralCode, redeemedCode: activeProfile.progress.redeemedCode, recruitsCount: 0, realWorldInventory: [], dailyLevelCount: 0, lastPlayedDate: activeProfile.progress.lastPlayedDate } }; 
                    const updated = profiles.map(p => p.id === currentProfileId ? resetP : p); 
                    setProfiles(updated); 
                    persistData(updated, true); 
                    addToast("Perfil resetado com sucesso.", "WARNING"); 
                }} 
                isZenMode={isZenMode} 
                onToggleZenMode={setIsZenMode} 
                isHighContrast={isHighContrast} 
                onToggleHighContrast={setIsHighContrast} 
                childName={activeProfile.name} 
                hasBackupInsurance={hasBackupInsurance} 
                onForceBackup={() => persistData(profiles, true)} 
                realWorldInventory={activeProfile.progress.realWorldInventory || []}
                // NEW PROPS PASSED HERE
                isPremium={isPremium}
                hasOfflineKit={hasOfflineKit}
                onTriggerCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }}
                onTriggerUpsell={() => { setCheckoutBump('KIT'); setShowCheckout(true); }}
                onApproveItem={handleApproveItem}
                onRefundItem={handleRefundItem}
            />
        )}
        
        {view === 'DOJO' && <TrainingDojo mastery={activeProfile.progress.mastery} onExit={() => setView('DASHBOARD')} onComplete={({coins}) => { updateCurrentProfile(p => ({...p, progress: {...p.progress, coins: p.progress.coins + coins}})); setView('DASHBOARD'); }} />}
        {view === 'TITAN' && <TitanArena onExit={() => setView('DASHBOARD')} onComplete={(dmg) => { updateCurrentProfile(p => ({...p, progress: {...p.progress, coins: p.progress.coins + Math.floor(dmg/10)}})); setView('DASHBOARD'); }} username={activeProfile.name} />}
        {view === 'PRINT' && <PrintableHQ unlockedLevel={activeProfile.progress.unlockedLevel} onBack={() => setView('DASHBOARD')} childName={activeProfile.name} hasOfflineKit={hasOfflineKit} onUnlock={() => { setCheckoutBump('KIT'); setShowCheckout(true); }} />}
        {view === 'LOGIC_ARENA' && <LogicArena onExit={() => setView('DASHBOARD')} onComplete={(score) => { updateCurrentProfile(p => ({...p, progress: {...p.progress, coins: p.progress.coins + score}})); setView('DASHBOARD'); }} />}

        {showDailyReward && <DailyRewardModal onClaim={(c, i) => { updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins + c, consumables: { ...p.progress.consumables, [i]: (p.progress.consumables[i] || 0) + 1 } } }), true); setShowDailyReward(false); }} />}
        <CheckoutBridge isOpen={showCheckout} onClose={() => setShowCheckout(false)} price={37} childName={activeProfile?.name} initialBump={checkoutBump} />
    </>
  );
}
