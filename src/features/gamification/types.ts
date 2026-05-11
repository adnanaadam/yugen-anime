export interface UserLevel {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface LevelInfo {
  level: number;
  minXp: number;
  maxXp: number;
  title: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, minXp: 0, maxXp: 100, title: "Novice" },
  { level: 2, minXp: 100, maxXp: 300, title: "Watcher" },
  { level: 3, minXp: 300, maxXp: 600, title: "Enthusiast" },
  { level: 4, minXp: 600, maxXp: 1000, title: "Connoisseur" },
  { level: 5, minXp: 1000, maxXp: 2000, title: "Otaku" },
];