
import { GameStats } from '../components/GameArena';
import { MasteryMap } from '../App';

export interface NarrativeTokens {
  heroAchievement: string;
  battleIntensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  struggleSector: string | null;
  villainFate: string;
  masteryGained: number;
}

export const prepareNarrativeTokens = (
  stats: GameStats, 
  mastery: MasteryMap, 
  villainName: string, 
  isBoss: boolean
): NarrativeTokens => {
  // Identifica o setor de maior dificuldade (menor pontuação no histórico da sessão)
  const struggleSector = stats.accuracy < 0.7 ? "Setor das Sombras Decimais" : null;
  
  const intensity = 
    stats.livesRemaining === 1 ? 'EXTREME' : 
    stats.maxStreak > 8 ? 'HIGH' : 
    isBoss ? 'MEDIUM' : 'LOW';

  const achievement = 
    stats.stars === 3 ? "Sincronização Perfeita" :
    stats.maxStreak > 5 ? "Surto de Claridade Neural" : "Persistência Heroica";

  const villainFate = isBoss 
    ? `O núcleo de processamento de ${villainName} entrou em colapso crítico.`
    : `As sondas de ${villainName} foram repelidas do setor.`;

  return {
    heroAchievement: achievement,
    battleIntensity: intensity,
    struggleSector,
    villainFate,
    masteryGained: stats.correctCount
  };
};
