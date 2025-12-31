
import { GoogleGenAI } from "@google/genai";

// Inicialização segura - O app funciona mesmo se a chave não estiver presente (modo offline)
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AICallbackData {
  childName: string;
  masteryGaps: string[];
  currentLevel: number;
  coins: number;
  villain: string;
}

// --- HYBRID INTELLIGENCE: CÉREBRO LOCAL (Custo $0, Latência 0ms) ---
// Respostas instantâneas para interações de alta frequência
const LOCAL_RESPONSES = {
  STREAK_LOW: [
    "Bom trabalho!",
    "Sistemas alinhados!",
    "Isso aí! Continue assim.",
    "Trajetória calculada com sucesso.",
    "Bela jogada!",
    "Sinal verde! Avance.",
    "Cálculo preciso.",
    "Você está pegando o ritmo!"
  ],
  STREAK_HIGH: [
    "COMBO SUPREMO!",
    "Energia no máximo!",
    "Você é imparável!",
    "Sobrecarga de poder!",
    "O universo está em harmonia!",
    "Lenda em formação!",
    "Domínio total detectado!",
    "Incrível! Nenhum erro à vista."
  ],
  ERROR_MILD: [
    "Quase lá, ajuste a frequência.",
    "Tente novamente, Guardião.",
    "Cálculo impreciso. Recalibre.",
    "Não desista, o padrão está aí.",
    "Respire. Foque nos números.",
    "Pequena flutuação detectada.",
    "Revise a lógica."
  ],
  ERROR_CRITICAL: [
    "Escudos baixos! Concentre-se.",
    "Detectando interferência... respire.",
    "Alerta! Falha no sistema lógico.",
    "Reiniciando protocolos de foco.",
    "O caos está vencendo. Reaja!",
    "Mantenha a calma e calcule.",
    "Não deixe o vilão vencer!"
  ],
  IDLE: [
    "Pronto para a próxima missão?",
    "Aguardando input.",
    "Sensores ativos.",
    "O tempo corre...",
    "Sistemas prontos."
  ]
};

// Dicionário de emergência para offline (apenas os mais difíceis)
const OFFLINE_MNEMONICS: Record<string, string> = {
    "7x8": "5, 6, 7, 8... 56 é 7 vezes 8!",
    "8x7": "5, 6, 7, 8... 56 é 7 vezes 8!",
    "6x7": "6 vezes 7? Pense em 6x6 (36) + 6 = 42!",
    "7x6": "6 vezes 7? Pense em 6x6 (36) + 6 = 42!",
    "8x8": "8 vezes 8 é 64, Nintendo 64!",
    "6x8": "6 vezes 8 = 48. Rima com biscoito!",
    "8x6": "6 vezes 8 = 48. Rima com biscoito!",
    "9x9": "9 vezes 9 é 81. Um a menos que 10x9 (90)!",
    "7x7": "7 vezes 7 é 49. Quase 50!",
    "6x6": "6 vezes 6 é 36. Meia dúzia de 6.",
    "3x3": "3 vezes 3 é 9. Um quadrado perfeito."
};

const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// --- INTEGRAÇÃO HÍBRIDA (CUSTO OTIMIZADO) ---

export const getStarPetMessage = async (
  context: 'BRIEFING' | 'COACHING' | 'CELEBRATION' | 'GUARDIAN' | 'VILLAIN_HACK' | 'STRATEGIC_REPORT' | 'CHRONO_STORM_ALERT', 
  data: AICallbackData, 
  extraInfo?: string
): Promise<string> => {
  
  // 1. Rota Local (Prioridade: Velocidade e Custo Zero)
  // Intercepta contextos de alta frequência ou baixa complexidade para evitar chamadas de API
  
  if (context === 'CELEBRATION') {
      const isHighIntensity = Math.random() > 0.7; // Simula "crítico" aleatoriamente
      return pickRandom(isHighIntensity ? LOCAL_RESPONSES.STREAK_HIGH : LOCAL_RESPONSES.STREAK_LOW);
  }

  if (context === 'COACHING') {
      // Dicas simples rodando localmente para não quebrar o fluxo do jogo
      return pickRandom(Math.random() > 0.6 ? LOCAL_RESPONSES.ERROR_CRITICAL : LOCAL_RESPONSES.ERROR_MILD);
  }

  if (context === 'CHRONO_STORM_ALERT') {
      // Alertas de evento rápidos
      return "Alerta de Tempestade Temporal! O tempo está instável!";
  }

  // 2. Rota Nuvem (Inteligência Real para Momentos WOW)
  // Apenas contextos complexos passam para o Gemini
  if (!ai) {
      // Fallback para modo totalmente offline
      if (context === 'BRIEFING') return `Olá ${data.childName}! Preparado para vencer o nível ${data.currentLevel}?`;
      if (context === 'VILLAIN_HACK') return "Eu não vou deixar você passar!";
      return pickRandom(LOCAL_RESPONSES.IDLE);
  }

  try {
    // Configuração de Tokens Estrita para Economia
    let maxTokens = 60;
    let temperature = 0.7;

    // Ajuste fino baseado no contexto
    if (context === 'BRIEFING') maxTokens = 100;
    if (context === 'GUARDIAN') { maxTokens = 200; temperature = 0.4; } // Relatórios mais longos e precisos
    if (context === 'STRATEGIC_REPORT') maxTokens = 150;

    const systemInstruction = `
      Persona: StarPet (IA futurista, companheiro de jogo).
      Tom: Curto, Tático, Encorajador.
      Usuário: Criança (${data.childName}).
      Contexto: ${context}.
      Vilão Atual: ${data.villain}.
      Regra: Responda em PT-BR. Seja conciso.
    `;

    let prompt = `Situação atual: Nível ${data.currentLevel}, Moedas ${data.coins}.`;
    
    if (context === 'VILLAIN_HACK') {
        prompt += ` O Vilão está atacando. Gere uma frase de provocação curta e sci-fi.`;
    } else if (context === 'GUARDIAN') {
        prompt += ` Resumo para os pais sobre: ${extraInfo || 'Progresso geral'}. Seja profissional mas lúdico.`;
    } else if (context === 'STRATEGIC_REPORT') {
        prompt += ` Relatório de status da base e progresso. Gaps detectados: ${data.masteryGaps.join(', ')}.`;
    } else {
        prompt += ` Dê um briefing de missão empolgante.`;
    }

    // Chamada ao Modelo FLASH (Mais rápido e barato)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const text = response.text;
    if (text) return text.trim();
    throw new Error("Resposta vazia da IA");

  } catch (error) {
    console.warn("IA indisponível ou erro de cota. Usando backup local.", error);
    // Fallback de Segurança Silencioso
    if (context === 'VILLAIN_HACK') return "Sistemas de defesa ativos! Cuidado!";
    if (context === 'GUARDIAN') return "O sistema está compilando os dados. O progresso está consistente.";
    if (context === 'BRIEFING') return "Prepare-se, Guardião. A missão vai começar.";
    return pickRandom(LOCAL_RESPONSES.IDLE);
  }
};

// --- NOVA FUNÇÃO: CIRURGIÃO NEURAL (Passo 7) ---
export const generateMnemonic = async (a: number, b: number, product: number, villain: string): Promise<string> => {
  // Check local dictionary first (Offline support)
  const key = `${a}x${b}`;
  if (OFFLINE_MNEMONICS[key]) {
      return OFFLINE_MNEMONICS[key];
  }

  // Offline/Fallback logic imediato para garantir fluidez
  if (!ai) {
     return `Lembre-se: ${a} vezes ${b} é igual a ${product}. Você consegue!`;
  }

  try {
    const prompt = `Crie um mnemônico curto, divertido ou uma rima em Português (PT-BR) para ajudar uma criança a decorar que ${a} x ${b} = ${product}.
    Contexto: O vilão ${villain} está tentando confundir a criança. O StarPet está hackeando o sistema para dar a resposta.
    Estilo: Hacker "Matrix", código de trapaça ou rima boba. Máximo 1 frase. 
    Exemplo: "Ei! Lembre-se que 5, 6, 7, 8 formam uma escada: 56 = 7 x 8!".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 60,
      },
    });

    return response.text?.trim() || `Cheat Code: ${a} x ${b} = ${product}.`;
  } catch (error) {
    console.error("Mnemonic gen failed", error);
    return `Protocolo de emergência: ${a} x ${b} é ${product}.`;
  }
};

// --- SUPPORT AGENT (Mantido para suporte ao cliente) ---
export const getSupportResponse = async (userMessage: string): Promise<string> => {
  if (!ai) {
    return "I'm currently in Offline Mode. Please check the Self-Repair tools on the right for common fixes.";
  }

  try {
    const systemInstruction = `
      You are the Senior Support Agent for TimeSplit.
      Tone: Professional, Concise, Empathetic, Resolutive.
      Language: English (Perfect Grammar).
      Context: Parent requesting help for a math app.
      
      Rules:
      1. If the user mentions a technical bug (crash, freeze, sync), suggest using the 'Self-Repair' tools on the dashboard.
      2. If the user asks about the method, explain the 'Tri-Link' visual memory system briefly.
      3. If the user is angry or asks for a refund, be empathetic and guide them to the 'Resolution Center' button.
      4. Keep responses under 50 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Query: "${userMessage}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 100,
      }
    });

    return response.text?.trim() || "I didn't quite catch that. Could you rephrase?";

  } catch (error) {
    console.error("Support Agent Error:", error);
    return "Our support brain is temporarily offline. Please try the automated tools on the right.";
  }
};

// Gerador de Briefing Diário
export const generateDailyBriefing = async (data: AICallbackData) => {
    // Lógica Híbrida: Estrutura local + Texto IA (se disponível)
    const targetGap = data.masteryGaps.length > 0 ? data.masteryGaps[0] : "7x8";
    const [f1, f2] = targetGap.includes('x') ? targetGap.split('x') : ['7','8'];

    return {
        message: `Atenção, ${data.childName}! Detectamos instabilidade crítica no setor ${targetGap}. O destino da galáxia depende da sua precisão hoje.`,
        bounties: [
            { 
                id: `b1_${Date.now()}`, 
                title: "Reparo de Setor", 
                goal: `Acerte combinações de ${f1} e ${f2}`, 
                current: 0,
                target: 5, 
                reward: 50, 
                type: 'CORRECT_ANSWERS' as const
            },
            { 
                id: `b2_${Date.now()}`, 
                title: "Fluxo Contínuo", 
                goal: "Alcance um Combo de 10x", 
                current: 0,
                target: 10, 
                reward: 75, 
                type: 'STREAK' as const
            },
            { 
                id: `b3_${Date.now()}`, 
                title: "Dominância", 
                goal: "Complete 1 Missão sem perder vidas", 
                current: 0,
                target: 1, 
                reward: 100, 
                type: 'LEVEL_COMPLETE' as const
            }
        ]
    };
};

export const generateDynamicChronicle = async (childName: string, narrativeTokens: any) => {
  // Essa chamada é rara (apenas ao vencer Boss ou Nível difícil). Custo aceitável.
  if (!ai) return `O herói ${childName} venceu mais uma batalha no setor lógico.`;

  try {
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Escreva crônica curta (uma frase épica) para o histórico do jogo.
          Herói: ${childName}. Feito: ${narrativeTokens.heroAchievement}.
          Estilo: Lenda Antiga Sci-Fi.`,
      });
      return response.text || "Registro corrompido... dados recuperados.";
  } catch (e) {
      return `A lenda de ${childName} cresce a cada dia.`;
  }
};
