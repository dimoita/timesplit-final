export type Operation = 'mult' | 'div';

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  factors: number[];
  ops: Operation[];
  isBoss: boolean;
  bossName?: string;
  timeLimit: number; // ms per question
  colorTheme: string; // css gradient classes
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "The Awakening",
    subtitle: "Focus: 1, 2, 5, 10",
    description: "Building the foundation. Pure multiplication.",
    factors: [1, 2, 5, 10],
    ops: ['mult'],
    isBoss: false,
    timeLimit: 15000,
    colorTheme: "bg-indigo-900"
  },
  {
    id: 2,
    title: "Double Trouble",
    subtitle: "Focus: 3, 4",
    description: "Stepping up the difficulty.",
    factors: [3, 4],
    ops: ['mult'],
    isBoss: false,
    timeLimit: 12000,
    colorTheme: "bg-blue-900"
  },
  {
    id: 3,
    title: "The Flip Side",
    subtitle: "Intro to Division",
    description: "Learning the inverse relationship.",
    factors: [2, 5, 10],
    ops: ['div'],
    isBoss: false,
    timeLimit: 12000,
    colorTheme: "bg-purple-900"
  },
  {
    id: 4,
    title: "Mixed Training",
    subtitle: "Mult & Div (1-5)",
    description: "Combining skills for speed.",
    factors: [1, 2, 3, 4, 5],
    ops: ['mult', 'div'],
    isBoss: false,
    timeLimit: 10000,
    colorTheme: "bg-cyan-900"
  },
  {
    id: 5,
    title: "THE GATEKEEPER",
    subtitle: "BOSS BATTLE",
    description: "Prove you are ready for the advanced tier. Speed is key.",
    factors: [1, 2, 3, 4, 5, 10],
    ops: ['mult', 'div'],
    isBoss: true,
    bossName: "Gatekeeper",
    timeLimit: 8000, 
    colorTheme: "bg-red-950"
  },
  {
    id: 6,
    title: "The Deep End",
    subtitle: "Focus: 6, 7",
    description: "The most common sticking points.",
    factors: [6, 7],
    ops: ['mult'],
    isBoss: false,
    timeLimit: 12000,
    colorTheme: "bg-emerald-900"
  },
  {
    id: 7,
    title: "Upper Limits",
    subtitle: "Focus: 8, 9",
    description: "Mastering the hardest single digits.",
    factors: [8, 9],
    ops: ['mult'],
    isBoss: false,
    timeLimit: 12000,
    colorTheme: "bg-teal-900"
  },
  {
    id: 8,
    title: "Division Master",
    subtitle: "Hard Division (6-9)",
    description: "Reverse engineering the hard facts.",
    factors: [6, 7, 8, 9],
    ops: ['div'],
    isBoss: false,
    timeLimit: 12000,
    colorTheme: "bg-pink-900"
  },
  {
    id: 9,
    title: "Total Recall",
    subtitle: "All Factors Mixed",
    description: "High speed random access memory.",
    factors: [2, 3, 4, 5, 6, 7, 8, 9],
    ops: ['mult', 'div'],
    isBoss: false,
    timeLimit: 10000,
    colorTheme: "bg-violet-900"
  },
  {
    id: 10,
    title: "FINAL EXAM",
    subtitle: "MEGA BOSS",
    description: "The ultimate test of automaticity. No mercy.",
    factors: [2, 3, 4, 5, 6, 7, 8, 9, 11, 12],
    ops: ['mult', 'div'],
    isBoss: true,
    bossName: "The Exam",
    timeLimit: 6000,
    colorTheme: "bg-black"
  }
];