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
import { LoginPage } from './components/LoginPage';
import { OnboardingQuiz } from './components/OnboardingQuiz';
import { CheckoutBridge } from './components/CheckoutBridge';
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

// --- IMPORTAÇÃO DO ARQUIVO NEUTRO (RESOLVE O ERRO 'UE') ---
import { 
  Profile, PetState, HQState, Chronicle, ChronoEvent, Bounty, MasteryMap,
  DEFAULT_PET, DEFAULT_HQ, STORAGE_KEY, DAILY_LEVEL_LIMIT, generateReferralCode 
} from './types';

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
  const handleCreateProfile = (data: { name: string, villain: string, avatar: string }) => { /* Legacy */ };
  const updateCurrentProfile = (updater: (p: Profile) => Profile, showSaveToast = false) => { if (!currentProfileId) return; const updatedProfiles = profiles.map(p => p.id === currentProfileId ? updater(p) : p); setProfiles(updatedProfiles); persistData(updatedProfiles, showSaveToast); };
  
  const handleQuizComplete = (data: { name: string; painPoint: string; goal: string }) => {
      setTempChildName(data.name);
      localStorage.setItem('ts_lead_data', JSON.stringify(data));
      setShowQuiz(false);
      setTimeout(() => {
          setCheckoutBump(null);
          setShowCheckout(true);
      }, 300);
  };

  const getCurrentProfile = () => profiles.find(p => p.id === currentProfileId);

  if (view === 'LOGIN') {
      return <LoginPage onLoginSuccess={() => setView('PROFILES')} onBack={() => setView('LANDING')} />;
  }

  if (view === 'LANDING') {
      return (
          <>
            <Header onSignInClick={() => setView('LOGIN')} />
            <Hero onStartQuiz={() => { if (profiles.length > 0) setView('PROFILES'); else setShowQuiz(true); }} />
            <MicroDojo />
            <Problem />
            <HowItWorks />
            <WhyChoose />
            <Testimonials />
            <Pricing onCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }} />
            <FAQ />
            <Footer />
            <StickyCTA onStartQuiz={() => setShowQuiz(true)} />
            
            <OnboardingQuiz 
                isOpen={showQuiz} 
                onClose={() => setShowQuiz(false)} 
                onComplete={handleQuizComplete} 
            />
            
            <CheckoutBridge 
                isOpen={showCheckout} 
                onClose={() => setShowCheckout(false)} 
                price={37} 
                childName={activeProfile?.name || tempChildName} 
            />
          </>
      );
  }

  if (view === 'PROFILES') return <ProfileSelector profiles={profiles} onSelect={handleProfileSelect} onAddNew={() => setShowQuiz(true)} isPremium={isPremium} isFamilyPlan={isFamilyPlan} />;
  
  const activeProfile = getCurrentProfile();
  if (!activeProfile) return <div onClick={() => setView('PROFILES')}>Error loading profile. Click to reset.</div>;

  return (
    <>
        <ToastSystem toasts={toasts} removeToast={removeToast} />
        <AlgebraExpansionModal isOpen={showAlgebraModal} onClose={() => setShowAlgebraModal(false)} onCheckout={() => { window.open('https://pay.hotmart.com/ALGEBRA_LINK'); setShowAlgebraModal(false); }} />
        {view === 'DASHBOARD' && ( <Dashboard childName={activeProfile.name} unlockedLevel={activeProfile.progress.unlockedLevel} totalStars={activeProfile.progress.totalStars} coins={activeProfile.progress.coins} equippedAvatar={activeProfile.progress.equippedItems.avatar === 'rocket' ? '🚀' : '🦸'} mastery={activeProfile.progress.mastery} consumables={activeProfile.progress.consumables} bounties={activeProfile.progress.bounties} petState={activeProfile.progress.pet} villain={activeProfile.villain} isPremium={isPremium} syncStatus={syncStatus} onStartSession={(l) => { setActiveLevelId(l); setView('GAME'); }} onSignOut={() => setView('PROFILES')} onOpenShop={() => setView('SHOP')} onOpenUpgrades={() => setView('UPGRADES')} onOpenDojo={() => setView('DOJO')} onOpenHallOfFame={() => setView('HALL')} onOpenSquadron={() => setView('SQUADRON')} onOpenInventory={() => setView('INVENTORY')} onOpenGuardian={() => setView('GUARDIAN')} onOpenTitan={() => setView('TITAN')} onOpenBase={() => setView('HQ')} onOpenPrintables={() => setView('PRINT')} onBuyConsumable={(id, cost) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins - cost, consumables: { ...p.progress.consumables, [id]: (p.progress.consumables[id] || 0) + 1 } } }))} onClaimBounty={(id) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins + 50, bounties: p.progress.bounties.filter(b => b.id !== id) } }), true)} onTriggerCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }} activeEvent={activeEvent} onEventEnd={() => setActiveEvent(null)} onAddCoins={(amount) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins + amount } }), true)} dailyLevelCount={activeProfile.progress.dailyLevelCount || 0} /> )}
        {view === 'GAME' && ( <GameArena level={activeLevelId} childData={{ name: activeProfile.name, villain: activeProfile.villain, avatar: activeProfile.avatar }} mastery={activeProfile.progress.mastery} coins={activeProfile.progress.coins} consumables={activeProfile.progress.consumables} upgrades={activeProfile.progress.upgrades} petState={activeProfile.progress.pet} equippedArtifactId={activeProfile.progress.equippedArtifact} activeEvent={activeEvent} onExit={() => setView('DASHBOARD')} onComplete={handleGameComplete} onUpdateMastery={(updates) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, mastery: { ...p.progress.mastery, ...updates } } }))} onConsume={(id) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, consumables: { ...p.progress.consumables, [id]: Math.max(0, (p.progress.consumables[id] || 0) - 1) } } }))} onBuyConsumable={(id, cost) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins - cost, consumables: { ...p.progress.consumables, [id]: (p.progress.consumables[id] || 0) + 1 } } }))} referralCode={activeProfile.progress.referralCode} isZenMode={isZenMode} isHighContrast={isHighContrast} /> )}
        {/* RESTO DO CÓDIGO PERMANECE IGUAL, APENAS GARANTA QUE ESTÁ COPIANDO TUDO DA JANELA DE CÓDIGO */}
        {view === 'SHOP' && ( <Shop coins={activeProfile.progress.coins} inventory={activeProfile.progress.inventory} consumables={activeProfile.progress.consumables} equippedAvatarId={activeProfile.progress.equippedItems.avatar} equippedTrailId={activeProfile.progress.equippedItems.trail} equippedThemeId={activeProfile.progress.equippedItems.theme} onBack={() => setView('DASHBOARD')} onBuyItem={(item) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins - item.cost, inventory: [...p.progress.inventory, item.id] } }), true)} onBuyConsumable={(id, cost) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins - cost, consumables: { ...p.progress.consumables, [id]: (p.progress.consumables[id] || 0) + 1 } } }), true)} onEquip={(item) => updateCurrentProfile(p => { const type = item.type === 'TRAIL' ? 'trail' : item.type === 'THEME' ? 'theme' : 'avatar'; return { ...p, progress: { ...p.progress, equippedItems: { ...p.progress.equippedItems, [type]: item.id } } }; })} onForgeSpin={handleForgeSpin} onBuySupply={(item) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins - item.cost, realWorldInventory: [ ...(p.progress.realWorldInventory || []), { id: Date.now().toString(), itemId: item.id, name: item.name, cost: item.cost, purchasedAt: new Date().toISOString(), status: 'UNUSED' } ] } }), true)} /> )}
        {view === 'SQUADRON' && ( <SquadronCenter onBack={() => setView('DASHBOARD')} referralCode={activeProfile.progress.referralCode || 'AGENT-000'} recruitsCount={activeProfile.progress.recruitsCount || 0} onRedeemCode={handleRedeemCode} /> )}
        {view === 'INVENTORY' && ( <RealityCoupons onBack={() => setView('DASHBOARD')} inventory={activeProfile.progress.realWorldInventory || []} onConsume={(id) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, realWorldInventory: (p.progress.realWorldInventory || []).map(item => item.id === id ? { ...item, status: 'ACTIVE', activatedAt: new Date().toISOString() } : item) } }), true)} onFinish={(id) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, realWorldInventory: (p.progress.realWorldInventory || []).map(item => item.id === id ? { ...item, status: 'USED' } : item) } }), true)} /> )}
        {view === 'HQ' && <CosmicHQ coins={activeProfile.progress.coins} setCoins={(amt) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: amt } }))} hqState={activeProfile.progress.hq} setHqState={(hq) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, hq } }), true)} petState={activeProfile.progress.pet} setPetState={(pet) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, pet } }), true)} mastery={activeProfile.progress.mastery} onBack={() => setView('DASHBOARD')} />}
        {view === 'UPGRADES' && <UpgradeGrid upgrades={activeProfile.progress.upgrades} coins={activeProfile.progress.coins} onBack={() => setView('DASHBOARD')} onBuy={(id, cost) => updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins - cost, upgrades: { ...p.progress.upgrades, [id]: (p.progress.upgrades[id] || 0) + 1 } } }), true)} />}
        {view === 'HALL' && <HallOfFame unlockedIds={[]} onBack={() => setView('DASHBOARD')} />}
        {view === 'GUARDIAN' && ( <GuardianInterface onBack={() => setView('DASHBOARD')} mastery={activeProfile.progress.mastery} onResetProfile={() => { const resetP: Profile = { ...activeProfile, progress: { unlockedLevel: 1, totalStars: 0, coins: 0, mastery: {}, consumables: {}, upgrades: {}, inventory: ['rocket', 'trail_default', 'theme_default'], equippedItems: { avatar: 'rocket', trail: 'trail_default', theme: 'theme_default' }, bounties: [], chronicles: [], pet: DEFAULT_PET, hq: DEFAULT_HQ, unlockedArtifacts: [], equippedArtifact: null, lastDailyBriefing: null, referralCode: activeProfile.progress.referralCode, redeemedCode: activeProfile.progress.redeemedCode, recruitsCount: 0, realWorldInventory: [], dailyLevelCount: 0, lastPlayedDate: activeProfile.progress.lastPlayedDate } }; const updated = profiles.map(p => p.id === currentProfileId ? resetP : p); setProfiles(updated); persistData(updated, true); addToast("Perfil resetado com sucesso.", "WARNING"); }} isZenMode={isZenMode} onToggleZenMode={setIsZenMode} isHighContrast={isHighContrast} onToggleHighContrast={setIsHighContrast} childName={activeProfile.name} hasBackupInsurance={hasBackupInsurance} onForceBackup={() => persistData(profiles, true)} realWorldInventory={activeProfile.progress.realWorldInventory || []} isPremium={isPremium} hasOfflineKit={hasOfflineKit} onTriggerCheckout={() => { setCheckoutBump(null); setShowCheckout(true); }} onTriggerUpsell={() => { setCheckoutBump('KIT'); setShowCheckout(true); }} onApproveItem={handleApproveItem} onRefundItem={handleRefundItem} /> )}
        {view === 'DOJO' && <TrainingDojo mastery={activeProfile.progress.mastery} onExit={() => setView('DASHBOARD')} onComplete={({coins}) => { updateCurrentProfile(p => ({...p, progress: {...p.progress, coins: p.progress.coins + coins}})); setView('DASHBOARD'); }} />}
        {view === 'TITAN' && <TitanArena onExit={() => setView('DASHBOARD')} onComplete={(dmg) => { updateCurrentProfile(p => ({...p, progress: {...p.progress, coins: p.progress.coins + Math.floor(dmg/10)}})); setView('DASHBOARD'); }} username={activeProfile.name} />}
        {view === 'PRINT' && <PrintableHQ unlockedLevel={activeProfile.progress.unlockedLevel} onBack={() => setView('DASHBOARD')} childName={activeProfile.name} hasOfflineKit={hasOfflineKit} onUnlock={() => { setCheckoutBump('KIT'); setShowCheckout(true); }} />}
        {view === 'LOGIC_ARENA' && <LogicArena onExit={() => setView('DASHBOARD')} onComplete={(score) => { updateCurrentProfile(p => ({...p, progress: {...p.progress, coins: p.progress.coins + score}})); setView('DASHBOARD'); }} />}
        {showDailyReward && <DailyRewardModal onClaim={(c, i) => { updateCurrentProfile(p => ({ ...p, progress: { ...p.progress, coins: p.progress.coins + c, consumables: { ...p.progress.consumables, [i]: (p.progress.consumables[i] || 0) + 1 } } }), true); setShowDailyReward(false); }} />}
        <CheckoutBridge isOpen={showCheckout} onClose={() => setShowCheckout(false)} price={37} childName={activeProfile?.name || tempChildName} initialBump={checkoutBump} />
    </>
  );
}
