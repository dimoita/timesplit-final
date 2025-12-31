export type ArtifactRarity = 'COMMON' | 'RARE' | 'LEGENDARY' | 'MYTHIC';

export interface Artifact {
  id: string;
  name: string;
  description: string; // The "scientific/magical" lore
  effectDescription: string; // Flavor text for the visual
  rarity: ArtifactRarity;
  dropLevel?: number; // Specific level drop (e.g. Bosses)
  dropChance?: number; // 0-1 for random drops
}

export const ARTIFACTS: Artifact[] = [
  {
    id: 'zero_prism',
    name: 'The Zero Prism',
    description: "A shard of the Void itself. In the realm of mathematics, Zero is not nothing—it is a portal. Anything that touches it vanishes into the singularity.",
    effectDescription: "Multiplies any number by nullity.",
    rarity: 'LEGENDARY',
    dropLevel: 5 // Gatekeeper Boss
  },
  {
    id: 'prime_key',
    name: 'The Prime Key',
    description: "Forged from the indivisible atoms of the universe. This key fits into the locks of higher logic, opening pathways that composite numbers cannot enter.",
    effectDescription: "Unlocks the secrets of Division.",
    rarity: 'LEGENDARY',
    dropLevel: 10 // Final Exam Boss
  },
  {
    id: 'golden_spiral',
    name: 'The Golden Spiral',
    description: "The fingerprint of nature. From the shell of a nautilus to the arms of a galaxy, this ratio (1.618...) dictates the flow of beauty and growth.",
    effectDescription: "Symbol of infinite expansion.",
    rarity: 'MYTHIC',
    dropChance: 0.05 // Very rare random drop
  },
  {
    id: 'infinity_gear',
    name: 'The Infinity Gear',
    description: "A mechanism that has no beginning and no end. It powers the clockwork of time, turning moments into eternity.",
    effectDescription: "Perpetual motion engine.",
    rarity: 'RARE',
    dropChance: 0.1 // Rare random drop
  },
  {
    id: 'unity_crystal',
    name: 'Crystal of Unity',
    description: "The Identity Element. It reflects everything exactly as it is. A pure mirror of the number '1'.",
    effectDescription: "Maintains self-identity.",
    rarity: 'RARE',
    dropLevel: 1 // First level reward (Tutorial Boss? Or just first milestone)
  }
];

export const getArtifactForLevel = (levelId: number): Artifact | undefined => {
    return ARTIFACTS.find(a => a.dropLevel === levelId);
};
