// ARQUIVO DE DEFINIÇÕES GLOBAIS
// (Tiramos isso do App.tsx para evitar tela branca)

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

export const DEFAULT_PET: PetState = { stage: 'EGG', mood: 'IDLE', hunger: 50, evolutionPoints: 0, evolutionLevel: 1, lastInteraction: Date.now() };
export const DEFAULT_HQ: HQState = { unlocked: ['view_earth', 'floor_steel', 'desk_standard', 'decor_none'], layout: { view: 'view_earth', floor: 'floor_steel', desk: 'desk_standard', decor: 'decor_none' } };
export const STORAGE_KEY = 'timeSplit_profiles_v1';
export const DAILY_LEVEL_LIMIT = 3;

export const generateReferralCode = () => `AGENT-${Math.floor(100 + Math.random() * 900)}`;
