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
// import { CheckoutBridge } from './components/CheckoutBridge'; // DESLIGADO TEMPORARIAMENTE
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
  id: string; title: string; goal: string; current: number; target: number; reward: number; type: 'CORRECT_ANSWERS' | 'STREAK' | 'LEVEL_COMPLETE';
}

export interface PetState {
  stage: 'EGG' | 'PROTO' | 'SENTINEL' | 'GUARDIAN' | 'GALACTIC'; mood: 'IDLE' | 'HAPPY' | 'SAD' | 'EATING' | 'SLEEPING' | 'DANCING'; hunger: number; evolutionPoints: number; evolutionLevel: number; lastInteraction: number;
}

export interface HQState {
  unlocked: string[]; layout: { view: string; floor: string; desk: string; decor: string; };
}

export interface Chronicle {
  id: string; text: string; level: number; timestamp: string;
}

export interface ChronoEvent {
  type: 'BLITZ' | 'GRAVITY_WELL' | 'SPLITZ_RAIN'; title: string; description: string; endsAt: number; multiplier: number;
}

export interface Profile {
  id: string; name: string; avatar: string; villain: string;
  progress: {
    unlockedLevel: number; totalStars: number; coins: number; mastery: MasteryMap; consumables: Record<string, number>; upgrades: Record<string, number>; inventory: string[]; equippedItems: { avatar: string; trail: string; theme: string; }; bounties: Bounty[]; chronicles: Chronicle[]; pet: PetState; hq: HQState; unlockedArtifacts: string[]; equippedArtifact: string | null; lastDailyBriefing: string | null; referralCode?: string; redeemedCode?: boolean; recruitsCount?: number; realWorldInventory?: RealWorldItem[]; dailyLevelCount?: number; lastPlayedDate?: string;
  };
}

const DEFAULT_PET: PetState = { stage: 'EGG', mood: 'IDLE', hunger: 50, evolutionPoints: 0, evolutionLevel: 1, lastInteraction: Date.now() };
const DEFAULT_HQ: HQState = { unlocked: ['view_earth', 'floor_steel', 'desk_standard', 'decor_none'], layout: { view: 'view_earth', floor: 'floor_steel', desk: 'desk_standard', decor: 'decor_none' } };
const STORAGE_KEY = 'timeSplit_profiles_v1';
const DAILY_LEVEL_LIMIT = 3;

const generateReferralCode = () => `AGENT-${Math.floor(100 + Math.random() * 900)}`;

export default function App() {
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'PROFILES' | 'DASHBOARD' | 'GAME' | 'SHOP' | 'UPGRADES' | 'HALL' | 'GUARDIAN' | 'TITAN' | 'LEAGUE' | 'HQ' | 'CODEX' | 'PRINT' | 'DOJO' | 'ORBITAL' | 'QUANTUM' | 'DUEL' | 'LOGIC_ARENA' | 'TECH_DOJO' | 'SQUADRON' | 'INVENTORY'>('LANDING');
  
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'SAVED' | 'SYNCING' | 'ERROR' | 'OFFLINE_CHANGES'>('SAVED');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [isPremium, setIsPremium] = useState(false);
  const [isFamilyPlan, setIsFamilyPlan] = useState(false);
  const [hasBackupInsurance, setHasBackupInsurance] = useState(false);
  const [hasOfflineKit, setHasOfflineKit] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [activeEvent, setActiveEvent] = useState<ChronoEvent | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAlgebraModal, setShowAlgebraModal] = useState(false);
  const [checkoutBump, setCheckoutBump] = useState<'KIT' | 'INSURANCE' | null>(null);
  const [tempChildName, setTempChildName] = useState<string>('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState<{coins: number, items: string[]} | null>(null);
  const [showSeasonCeremony, setShowSeasonCeremony] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addToast = (message: string, type: ToastType = 'INFO') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) try { setProfiles(JSON.parse(localData)); } catch (e) {}
    if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) { checkPremiumStatus(session.user.id); subscribeToProfileUpdates(session.user.id); }
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) { checkPremiumStatus(session.user.id); loadCloudData(session.user.id); subscribeToProfileUpdates(session.user.id); }
        });
        return () => subscription.unsubscribe();
    }
  }, []);

  const checkPremiumStatus = async (userId: string) => { if (!supabase) return; try { const { data } = await supabase.from('profiles').select('is_premium, is_family_plan, has_backup_insurance, has_offline_kit').eq('user_id', userId).single(); if (data) { if (data.is_premium) setIsPremium(true); if (data.is_family_plan) setIsFamilyPlan(true); if (data.has_backup_insurance) setHasBackupInsurance(true); if (data.has_offline_kit) setHasOfflineKit(true); } } catch (err) {} };
  const subscribeToProfileUpdates = (userId: string) => { if (!supabase) return; const channel = supabase.channel('profile_changes').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `user_id=eq.${userId}` }, (payload) => { const newData = payload.new as any; if (newData.is_premium) { setIsPremium(true); addToast("Acesso VIP Confirmado!", "SUCCESS"); } }).subscribe(); return () => { supabase.removeChannel(channel); }; };
  const loadCloudData = async (userId: string) => { if (!supabase) return; try { const { data } = await supabase.from('player_progress').select('profile_data, updated_at').eq('user_id', userId).single(); if (data) { const localTime = localStorage.getItem('timeSplit_last_modified'); if (!localTime || new Date(data.updated_at) > new Date(localTime)) { setProfiles(data.profile_data as Profile[]); localStorage.setItem(STORAGE_KEY, JSON.stringify(data.profile_data)); addToast("Dados sincronizados", "INFO"); } } } catch (err) {} };
  const persistData = useCallback(async (newProfiles: Profile[], forceCloud: boolean = false) => { const sanitizedProfiles = newProfiles.map(p => ({ ...p, progress: { ...p.progress, chronicles: (p.progress.chronicles || []).slice(0, 30) } })); try { const timestamp = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedProfiles)); localStorage.setItem('timeSplit_last_modified', timestamp); } catch (e) {} if (!supabase || !user) { setSyncStatus('SAVED'); return; } if (!navigator.onLine && !forceCloud) { setSyncStatus('OFFLINE_CHANGES'); return; } setSyncStatus('SYNCING'); if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current); syncTimeoutRef.current = setTimeout(async () => { try { if (!navigator.onLine) { setSyncStatus('OFFLINE_CHANGES'); return; } const { error } = await supabase.from('player_progress').upsert({ user_id: user.id, profile_data: sanitizedProfiles, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }); if (error) throw error; setSyncStatus('SAVED'); if (forceCloud) addToast("Progresso salvo.", "SUCCESS"); } catch (err) { setSyncStatus('ERROR'); } }, 1000); }, [user]);

  const handleProfileSelect = (id: string) => { setCurrentProfileId(id); const profile = profiles.find(p => p.id === id); if (profile) { const today = new Date().toISOString().split('T')[0]; if (profile.progress.lastPlayedDate !== today) { updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, dailyLevelCount: 0, lastPlayedDate: today } })); } } setView('DASHBOARD'); };
  const handleCreateProfile = (data: { name: string, villain: string, avatar: string }) => { const newProfile: Profile = { id: Date.now().toString(), name: data.name, avatar: data.avatar, villain: data.villain, progress: { unlockedLevel: 1, totalStars: 0, coins: 0, mastery: {}, consumables: {}, upgrades: {}, inventory: ['rocket', 'trail_default', 'theme_default'], equippedItems: { avatar: 'rocket', trail: 'trail_default', theme: 'theme_default' }, bounties: [], chronicles: [], pet: DEFAULT_PET, hq: DEFAULT_HQ, unlockedArtifacts: [], equippedArtifact: null, lastDailyBriefing: null, referralCode: generateReferralCode(), redeemedCode: false, recruitsCount: 0, realWorldInventory: [], dailyLevelCount: 0, lastPlayedDate: new Date().toISOString().split('T')[0] } }; const updated = [...profiles, newProfile]; setProfiles(updated); persistData(updated); setCurrentProfileId(newProfile.id); setView('DASHBOARD'); setShowQuiz(false); addToast(`Perfil de ${data.name} criado!`, "SUCCESS"); };
  const updateCurrentProfile = (updater: (p: Profile) => Profile, showSaveToast = false) => { if (!currentProfileId) return; const updatedProfiles = profiles.map(p => p.id === currentProfileId ? updater(p) : p); setProfiles(updatedProfiles); persistData(updatedProfiles, showSaveToast); };
  
  const handleQuizComplete = (data: { name: string; painPoint: string; goal: string }) => {
      setTempChildName(data.name);
      localStorage.setItem('ts_lead_data', JSON.stringify(data));
      setShowQuiz(false);
      setTimeout(() => {
          setCheckoutBump(null);
          // setShowCheckout(true); // DESLIGADO PARA TESTE
          alert("QUIZ TERMINADO! O Checkout abriria aqui."); // ALERTA DE TESTE
      }, 300);
  };

  const getCurrentProfile = () => profiles.find(p => p.id === currentProfileId);

  if (view === 'LOGIN') return <LoginPage onLoginSuccess={() => setView('PROFILES')} onBack={() => setView('LANDING')} />;
  if (view === 'LANDING') return ( <> <Header onSignInClick={() => setView('LOGIN')} /> <Hero onStartQuiz={() => { if (profiles.length > 0) setView('PROFILES'); else setShowQuiz(true); }} /> <MicroDojo /> <Problem /> <HowItWorks /> <WhyChoose /> <Testimonials /> <Pricing onCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }} /> <FAQ /> <Footer /> <StickyCTA onStartQuiz={() => setShowQuiz(true)} /> <OnboardingQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} onComplete={handleQuizComplete} /> </> );
  if (view === 'PROFILES') return <ProfileSelector profiles={profiles} onSelect={handleProfileSelect} onAddNew={() => setShowQuiz(true)} isPremium={isPremium} isFamilyPlan={isFamilyPlan} />;
  
  const activeProfile = getCurrentProfile();
  if (!activeProfile) return <div onClick={() => setView('PROFILES')}>Error loading profile. Click to reset.</div>;

  return (
    <>
        <ToastSystem toasts={toasts} removeToast={removeToast} />
        {view === 'DASHBOARD' && ( <Dashboard childName={activeProfile.name} unlockedLevel={activeProfile.progress.unlockedLevel} totalStars={activeProfile.progress.totalStars} coins={activeProfile.progress.coins} equippedAvatar={activeProfile.progress.equippedItems.avatar === 'rocket' ? '🚀' : '🦸'} mastery={activeProfile.progress.mastery} consumables={activeProfile.progress.consumables} bounties={activeProfile.progress.bounties} petState={activeProfile.progress.pet} villain={activeProfile.villain} isPremium={isPremium} syncStatus={syncStatus} onStartSession={(l) => { setActiveLevelId(l); setView('GAME'); }} onSignOut={() => setView('PROFILES')} onOpenShop={() => setView('SHOP')} onOpenUpgrades={() => setView('UPGRADES')} onOpenDojo={() => setView('DOJO')} onOpenHallOfFame={() => setView('HALL')} onOpenSquadron={() => setView('SQUADRON')} onOpenInventory={() => setView('INVENTORY')} onOpenGuardian={() => setView('GUARDIAN')} onOpenTitan={() => setView('TITAN')} onOpenBase={() => setView('HQ')} onOpenPrintables={() => setView('PRINT')} onBuyConsumable={(id, cost) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins - cost, consumables: { ...p.progress.consumables, [id]: (p.progress.consumables[id] || 0) + 1 } } }))} onClaimBounty={(id) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins + 50, bounties: p.progress.bounties.filter(b => b.id !== id) } }), true)} onTriggerCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }} activeEvent={activeEvent} onEventEnd={() => setActiveEvent(null)} onAddCoins={(amount) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins + amount } }), true)} dailyLevelCount={activeProfile.progress.dailyLevelCount || 0} /> )}
        {/* Adicionei apenas o Dashboard para simplificar o teste de renderização. Se funcionar, sabemos que o problema era o Checkout. */}
    </>
  );
}
