// prisma/seed.ts
// Run with: npx tsx prisma/seed.ts
// WARNING: This will DELETE ALL EXISTING DATA and reseed.

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient, AnimeStatus } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ============================================================
// XP & LEVEL HELPERS (mirrors src/lib/utils.ts)
// ============================================================

function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// ============================================================
// REAL ANIME IDs FROM MyAnimeList
// ============================================================

const ANIME = {
  // ID: { title, episodes }
  1: { title: "Cowboy Bebop", episodes: 26 },
  19: { title: "Monster", episodes: 74 },
  20: { title: "Naruto", episodes: 220 },
  21: { title: "One Piece", episodes: 1100 },
  110: { title: "Hunter x Hunter (2011)", episodes: 148 },
  153: { title: "Fullmetal Alchemist", episodes: 51 },
  164: { title: "Fullmetal Alchemist: Brotherhood", episodes: 64 },
  200: { title: "Naruto Shippuden", episodes: 500 },
  269: { title: "Bleach", episodes: 366 },
  302: { title: "Death Note", episodes: 37 },
  329: { title: "Gurren Lagann", episodes: 27 },
  511: { title: "One Punch Man", episodes: 12 },
  813: { title: "Steins;Gate", episodes: 24 },
  925: { title: "Steins;Gate 0", episodes: 23 },
  1175: { title: "Attack on Titan", episodes: 25 },
  1575: { title: "Code Geass", episodes: 25 },
  1648: { title: "Fate/Stay Night: UBW", episodes: 25 },
  1988: { title: "Noragami", episodes: 12 },
  2001: { title: "Noragami Aragoto", episodes: 13 },
  2055: { title: "Haikyuu!!", episodes: 25 },
  2077: { title: "Haikyuu!! S2", episodes: 25 },
  2098: { title: "Haikyuu!! S3", episodes: 10 },
  2212: { title: "Haikyuu!! S4", episodes: 25 },
  2251: { title: "Demon Slayer", episodes: 26 },
  2321: { title: "Demon Slayer: Mugen Train", episodes: 7 },
  2377: { title: "Jujutsu Kaisen", episodes: 24 },
  2472: { title: "Jujutsu Kaisen S2", episodes: 23 },
  2483: { title: "Vinland Saga", episodes: 24 },
  2499: { title: "Vinland Saga S2", episodes: 24 },
  2501: { title: "Mob Psycho 100", episodes: 12 },
  2515: { title: "Mob Psycho 100 II", episodes: 13 },
  2521: { title: "Mob Psycho 100 III", episodes: 12 },
  2535: { title: "Chainsaw Man", episodes: 12 },
  2547: { title: "Spy x Family", episodes: 25 },
  2551: { title: "Spy x Family S2", episodes: 12 },
  2561: { title: "Bocchi the Rock", episodes: 12 },
  2571: { title: "Oshi no Ko", episodes: 11 },
  2581: { title: "Frieren", episodes: 28 },
  2591: { title: "Dandadan", episodes: 12 },
  2601: { title: "Kaiju No. 8", episodes: 12 },
  2611: { title: "Hell's Paradise", episodes: 13 },
  2621: { title: "Mashle", episodes: 12 },
  2631: { title: "Blue Lock", episodes: 24 },
  2641: { title: "Blue Lock S2", episodes: 14 },
} as const;

type AnimeId = keyof typeof ANIME;

// ============================================================
// BADGE DEFINITIONS (mirrors src/features/tracking/api.ts)
// ============================================================

const BADGE_DEFS = [
  { id: "first_anime", name: "First Anime", description: "Added your first anime to your list", icon: "scroll", xpReward: 100, category: "beginner" },
  { id: "episode_master", name: "Episode Master", description: "Watched 500 episodes total", icon: "spellbook", xpReward: 300, category: "milestone" },
  { id: "anime_veteran", name: "Anime Veteran", description: "Completed 50 anime", icon: "crown", xpReward: 500, category: "milestone" },
  { id: "completionist", name: "Completionist", description: "Completed 20 anime", icon: "trophy", xpReward: 250, category: "achievement" },
  { id: "anime_lover", name: "Anime Lover", description: "Watched 1000 episodes", icon: "heart", xpReward: 750, category: "milestone" },
  { id: "binge_watcher", name: "Binge Watcher", description: "Watched 10+ episodes in one session", icon: "fire", xpReward: 150, category: "special" },
  { id: "collector", name: "Collector", description: "Have 25 anime in your list", icon: "inventory", xpReward: 200, category: "collection" },
  { id: "favorite_curator", name: "Favorite Curator", description: "Added 5 anime to your favorites", icon: "bookmark", xpReward: 100, category: "collection" },
  { id: "early_adopter", name: "Early Adopter", description: "Joined during the first 1000 users", icon: "star", xpReward: 500, category: "special" },
];

// ============================================================
// USER PROFILES
// ============================================================

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  isProfilePublic: boolean;
  createdAt: Date;
  library: { animeId: AnimeId; status: string; progress: number; score?: number; startedAt?: Date; completedAt?: Date }[];
  favorites: AnimeId[];
}

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

const users: UserProfile[] = [
  {
    id: "user-ethan",
    username: "ethan.otaku",
    name: "Ethan Carter",
    email: "ethan.carter@example.com",
    xp: 19600,
    level: 15,
    isProfilePublic: true,
    createdAt: daysAgo(180),
    library: [
      { animeId: 164, status: "COMPLETED", progress: 64, score: 10, completedAt: daysAgo(150) },
      { animeId: 1175, status: "COMPLETED", progress: 25, score: 9, completedAt: daysAgo(140) },
      { animeId: 302, status: "COMPLETED", progress: 37, score: 9, completedAt: daysAgo(130) },
      { animeId: 813, status: "COMPLETED", progress: 24, score: 10, completedAt: daysAgo(120) },
      { animeId: 110, status: "COMPLETED", progress: 148, score: 9, completedAt: daysAgo(110) },
      { animeId: 1575, status: "COMPLETED", progress: 25, score: 8, completedAt: daysAgo(100) },
      { animeId: 2251, status: "COMPLETED", progress: 26, score: 8, completedAt: daysAgo(90) },
      { animeId: 2377, status: "COMPLETED", progress: 24, score: 9, completedAt: daysAgo(85) },
      { animeId: 2472, status: "COMPLETED", progress: 23, score: 8, completedAt: daysAgo(80) },
      { animeId: 2581, status: "COMPLETED", progress: 28, score: 10, completedAt: daysAgo(75) },
      { animeId: 2535, status: "COMPLETED", progress: 12, score: 8, completedAt: daysAgo(70) },
      { animeId: 2483, status: "COMPLETED", progress: 24, score: 9, completedAt: daysAgo(65) },
      { animeId: 2499, status: "COMPLETED", progress: 24, score: 9, completedAt: daysAgo(60) },
      { animeId: 2501, status: "COMPLETED", progress: 12, score: 8, completedAt: daysAgo(55) },
      { animeId: 2515, status: "COMPLETED", progress: 13, score: 9, completedAt: daysAgo(50) },
      { animeId: 2521, status: "COMPLETED", progress: 12, score: 9, completedAt: daysAgo(45) },
      { animeId: 2571, status: "COMPLETED", progress: 11, score: 8, completedAt: daysAgo(40) },
      { animeId: 2547, status: "COMPLETED", progress: 25, score: 7, completedAt: daysAgo(35) },
      { animeId: 2561, status: "COMPLETED", progress: 12, score: 8, completedAt: daysAgo(30) },
      { animeId: 2611, status: "COMPLETED", progress: 13, score: 7, completedAt: daysAgo(25) },
      { animeId: 2591, status: "WATCHING", progress: 8, startedAt: daysAgo(10) },
      { animeId: 2601, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2631, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2641, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 1, status: "COMPLETED", progress: 26, score: 9, completedAt: daysAgo(160) },
      { animeId: 329, status: "COMPLETED", progress: 27, score: 8, completedAt: daysAgo(145) },
      { animeId: 511, status: "COMPLETED", progress: 12, score: 7, completedAt: daysAgo(125) },
      { animeId: 2055, status: "COMPLETED", progress: 25, score: 8, completedAt: daysAgo(95) },
      { animeId: 2077, status: "COMPLETED", progress: 25, score: 8, completedAt: daysAgo(88) },
      { animeId: 2098, status: "COMPLETED", progress: 10, score: 8, completedAt: daysAgo(82) },
    ],
    favorites: [164, 1175, 302, 813, 110, 2581, 2483, 2535, 1575, 2251],
  },
  {
    id: "user-sophia",
    username: "sakura.soph",
    name: "Sophia Bennett",
    email: "sophia.bennett@example.com",
    xp: 4900,
    level: 8,
    isProfilePublic: true,
    createdAt: daysAgo(120),
    library: [
      { animeId: 20, status: "COMPLETED", progress: 220, score: 9, completedAt: daysAgo(100) },
      { animeId: 200, status: "WATCHING", progress: 300, startedAt: daysAgo(90) },
      { animeId: 21, status: "WATCHING", progress: 200, startedAt: daysAgo(80) },
      { animeId: 269, status: "WATCHING", progress: 100, startedAt: daysAgo(70) },
      { animeId: 110, status: "COMPLETED", progress: 148, score: 8, completedAt: daysAgo(60) },
      { animeId: 1175, status: "WATCHING", progress: 15, startedAt: daysAgo(20) },
      { animeId: 2251, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2377, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2535, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 302, status: "COMPLETED", progress: 37, score: 7, completedAt: daysAgo(50) },
    ],
    favorites: [20, 200, 21, 110, 269],
  },
  {
    id: "user-liam",
    username: "liamkai",
    name: "Liam Brooks",
    email: "liam.brooks@example.com",
    xp: 400,
    level: 3,
    isProfilePublic: true,
    createdAt: daysAgo(14),
    library: [
      { animeId: 21, status: "WATCHING", progress: 45, startedAt: daysAgo(10) },
      { animeId: 164, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 302, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2535, status: "PLAN_TO_WATCH", progress: 0 },
    ],
    favorites: [21, 164],
  },
  {
    id: "user-ava",
    username: "ava.yuki",
    name: "Ava Mitchell",
    email: "ava.mitchell@example.com",
    xp: 12100,
    level: 12,
    isProfilePublic: true,
    createdAt: daysAgo(150),
    library: [
      { animeId: 1175, status: "COMPLETED", progress: 25, score: 9, completedAt: daysAgo(130) },
      { animeId: 164, status: "COMPLETED", progress: 64, score: 10, completedAt: daysAgo(120) },
      { animeId: 302, status: "COMPLETED", progress: 37, score: 8, completedAt: daysAgo(110) },
      { animeId: 813, status: "COMPLETED", progress: 24, score: 9, completedAt: daysAgo(100) },
      { animeId: 1575, status: "COMPLETED", progress: 25, score: 9, completedAt: daysAgo(90) },
      { animeId: 110, status: "COMPLETED", progress: 148, score: 8, completedAt: daysAgo(80) },
      { animeId: 2251, status: "COMPLETED", progress: 26, score: 8, completedAt: daysAgo(70) },
      { animeId: 2321, status: "COMPLETED", progress: 7, score: 7, completedAt: daysAgo(68) },
      { animeId: 2377, status: "COMPLETED", progress: 24, score: 8, completedAt: daysAgo(60) },
      { animeId: 2472, status: "COMPLETED", progress: 23, score: 8, completedAt: daysAgo(55) },
      { animeId: 2581, status: "COMPLETED", progress: 28, score: 10, completedAt: daysAgo(50) },
      { animeId: 2483, status: "COMPLETED", progress: 24, score: 9, completedAt: daysAgo(45) },
      { animeId: 2499, status: "COMPLETED", progress: 24, score: 9, completedAt: daysAgo(40) },
      { animeId: 2535, status: "COMPLETED", progress: 12, score: 7, completedAt: daysAgo(35) },
      { animeId: 2571, status: "COMPLETED", progress: 11, score: 8, completedAt: daysAgo(30) },
      { animeId: 2611, status: "COMPLETED", progress: 13, score: 7, completedAt: daysAgo(25) },
      { animeId: 2591, status: "WATCHING", progress: 6, startedAt: daysAgo(5) },
      { animeId: 2601, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2631, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 1, status: "COMPLETED", progress: 26, score: 8, completedAt: daysAgo(140) },
      { animeId: 19, status: "COMPLETED", progress: 74, score: 9, completedAt: daysAgo(105) },
    ],
    favorites: [1175, 164, 813, 1575, 2581, 2483, 2251],
  },
  {
    id: "user-noah",
    username: "noahsenpai",
    name: "Noah Turner",
    email: "noah.turner@example.com",
    xp: 1600,
    level: 5,
    isProfilePublic: true,
    createdAt: daysAgo(60),
    library: [
      { animeId: 2377, status: "COMPLETED", progress: 24, score: 9, completedAt: daysAgo(40) },
      { animeId: 2472, status: "WATCHING", progress: 15, startedAt: daysAgo(20) },
      { animeId: 2535, status: "COMPLETED", progress: 12, score: 8, completedAt: daysAgo(30) },
      { animeId: 2251, status: "COMPLETED", progress: 26, score: 7, completedAt: daysAgo(50) },
      { animeId: 302, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 164, status: "PLAN_TO_WATCH", progress: 0 },
    ],
    favorites: [2377, 2535, 2251],
  },
  {
    id: "user-mia",
    username: "miashiro",
    name: "Mia Collins",
    email: "mia.collins@example.com",
    xp: 8100,
    level: 10,
    isProfilePublic: true,
    createdAt: daysAgo(100),
    library: [
      { animeId: 2251, status: "COMPLETED", progress: 26, score: 9, completedAt: daysAgo(80) },
      { animeId: 2321, status: "COMPLETED", progress: 7, score: 8, completedAt: daysAgo(78) },
      { animeId: 164, status: "COMPLETED", progress: 64, score: 9, completedAt: daysAgo(70) },
      { animeId: 1175, status: "COMPLETED", progress: 25, score: 8, completedAt: daysAgo(60) },
      { animeId: 110, status: "COMPLETED", progress: 148, score: 8, completedAt: daysAgo(50) },
      { animeId: 302, status: "COMPLETED", progress: 37, score: 7, completedAt: daysAgo(40) },
      { animeId: 813, status: "COMPLETED", progress: 24, score: 9, completedAt: daysAgo(30) },
      { animeId: 2581, status: "WATCHING", progress: 20, startedAt: daysAgo(15) },
      { animeId: 2535, status: "WATCHING", progress: 8, startedAt: daysAgo(10) },
      { animeId: 2377, status: "WATCHING", progress: 12, startedAt: daysAgo(5) },
      { animeId: 1575, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2483, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2611, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2591, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2601, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 1, status: "COMPLETED", progress: 26, score: 7, completedAt: daysAgo(90) },
      { animeId: 329, status: "COMPLETED", progress: 27, score: 8, completedAt: daysAgo(65) },
      { animeId: 511, status: "COMPLETED", progress: 12, score: 7, completedAt: daysAgo(55) },
      { animeId: 2501, status: "COMPLETED", progress: 12, score: 8, completedAt: daysAgo(45) },
      { animeId: 2515, status: "COMPLETED", progress: 13, score: 8, completedAt: daysAgo(42) },
      { animeId: 2521, status: "COMPLETED", progress: 12, score: 8, completedAt: daysAgo(38) },
      { animeId: 2547, status: "COMPLETED", progress: 25, score: 7, completedAt: daysAgo(35) },
      { animeId: 2561, status: "COMPLETED", progress: 12, score: 8, completedAt: daysAgo(32) },
      { animeId: 2571, status: "COMPLETED", progress: 11, score: 8, completedAt: daysAgo(28) },
      { animeId: 2055, status: "COMPLETED", progress: 25, score: 8, completedAt: daysAgo(25) },
      { animeId: 2077, status: "COMPLETED", progress: 25, score: 8, completedAt: daysAgo(22) },
      { animeId: 2098, status: "COMPLETED", progress: 10, score: 8, completedAt: daysAgo(20) },
    ],
    favorites: [2251, 164, 1175, 2581, 813, 110, 2501, 2547],
  },
  {
    id: "user-lucas",
    username: "lucaskun",
    name: "Lucas Foster",
    email: "lucas.foster@example.com",
    xp: 3600,
    level: 7,
    isProfilePublic: true,
    createdAt: daysAgo(90),
    library: [
      { animeId: 20, status: "COMPLETED", progress: 220, score: 8, completedAt: daysAgo(60) },
      { animeId: 200, status: "WATCHING", progress: 50, startedAt: daysAgo(50) },
      { animeId: 2055, status: "COMPLETED", progress: 25, score: 9, completedAt: daysAgo(40) },
      { animeId: 2077, status: "COMPLETED", progress: 25, score: 9, completedAt: daysAgo(35) },
      { animeId: 2098, status: "COMPLETED", progress: 10, score: 9, completedAt: daysAgo(32) },
      { animeId: 2212, status: "WATCHING", progress: 10, startedAt: daysAgo(20) },
      { animeId: 2547, status: "WATCHING", progress: 15, startedAt: daysAgo(15) },
      { animeId: 2551, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 164, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 302, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2251, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2377, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2535, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2581, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 1575, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2483, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 1, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 110, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 813, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 1175, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2501, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2561, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2571, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2591, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2601, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2611, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2631, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2641, status: "PLAN_TO_WATCH", progress: 0 },
    ],
    favorites: [20, 2055, 2547, 164, 302],
  },
  {
    id: "user-chloe",
    username: "chloeneko",
    name: "Chloe Parker",
    email: "chloe.parker@example.com",
    xp: 900,
    level: 4,
    isProfilePublic: false,
    createdAt: daysAgo(45),
    library: [
      { animeId: 21, status: "WATCHING", progress: 100, startedAt: daysAgo(30) },
      { animeId: 164, status: "COMPLETED", progress: 64, score: 9, completedAt: daysAgo(20) },
      { animeId: 302, status: "COMPLETED", progress: 37, score: 7, completedAt: daysAgo(15) },
      { animeId: 2535, status: "PLAN_TO_WATCH", progress: 0 },
      { animeId: 2251, status: "PLAN_TO_WATCH", progress: 0 },
    ],
    favorites: [21, 164],
  },
];

// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Clear all data in correct FK order
  console.log("🗑️  Clearing existing data...");
  await prisma.notification.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.animeList.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Database cleared");

  // 2. Create badge definitions
  console.log("🏅 Creating badge definitions...");
  for (const badge of BADGE_DEFS) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: badge,
      create: badge,
    });
  }
  console.log(`✅ Created ${BADGE_DEFS.length} badges`);

  // 3. Create users and their data
  console.log("👤 Creating users...");
  for (const profile of users) {
    // Create user
    await prisma.user.create({
      data: {
        id: profile.id,
        username: profile.username,
        name: profile.name,
        email: profile.email,
        xp: profile.xp,
        level: profile.level,
        isProfilePublic: profile.isProfilePublic,
        createdAt: profile.createdAt,
        updatedAt: profile.createdAt,
      },
    });

    // Create anime list entries
    for (const entry of profile.library) {
      const animeInfo = ANIME[entry.animeId];
      await prisma.animeList.create({
        data: {
          userId: profile.id,
          animeId: entry.animeId,
          status: entry.status as AnimeStatus,
          progress: entry.progress,
          score: entry.score ?? null,
          startedAt: entry.startedAt ?? (entry.status !== "PLAN_TO_WATCH" ? profile.createdAt : null),
          completedAt: entry.completedAt ?? null,
          updatedAt: entry.completedAt ?? entry.startedAt ?? profile.createdAt,
        },
      });
    }

    // Create favorites
    for (const favId of profile.favorites) {
      await prisma.favorite.create({
        data: {
          userId: profile.id,
          animeId: favId,
          createdAt: daysAgo(Math.floor(Math.random() * 30) + 10),
        },
      });
    }

    console.log(`  ✅ ${profile.username} (${profile.library.length} anime, ${profile.favorites.length} favorites)`);
  }
  console.log(`✅ Created ${users.length} users`);

  // 4. Award badges based on user data
  console.log("🎖️  Awarding badges...");
  for (const profile of users) {
    const earnedBadges: string[] = [];

    // First Anime badge
    if (profile.library.length >= 1) earnedBadges.push("first_anime");

    // Collector badge (25+ anime in list)
    if (profile.library.length >= 25) earnedBadges.push("collector");

    // Completionist (20+ completed)
    const completedCount = profile.library.filter(e => e.status === "COMPLETED").length;
    if (completedCount >= 20) earnedBadges.push("completionist");
    if (completedCount >= 50) earnedBadges.push("anime_veteran");

    // Episode milestones
    const totalEpisodes = profile.library.reduce((sum, e) => sum + e.progress, 0);
    if (totalEpisodes >= 500) earnedBadges.push("anime_lover");
    if (totalEpisodes >= 1000) earnedBadges.push("episode_master");

    // Favorite Curator (5+ favorites)
    if (profile.favorites.length >= 5) earnedBadges.push("favorite_curator");

    // Early Adopter (all seed users are early)
    earnedBadges.push("early_adopter");

    // Award unique badges
    const uniqueBadges = [...new Set(earnedBadges)];
    for (const badgeId of uniqueBadges) {
      const badgeDef = BADGE_DEFS.find(b => b.id === badgeId);
      if (!badgeDef) continue;

      const existing = await prisma.userBadge.findUnique({
        where: { userId_badgeId: { userId: profile.id, badgeId } },
      });

      if (!existing) {
        await prisma.userBadge.create({
          data: {
            userId: profile.id,
            badgeId,
            earnedAt: daysAgo(Math.floor(Math.random() * 30) + 5),
          },
        });
      }
    }

    if (uniqueBadges.length > 0) {
      console.log(`  ✅ ${profile.username}: ${uniqueBadges.length} badges`);
    }
  }

  // 5. Create notifications
  console.log("🔔 Creating notifications...");
  for (const profile of users) {
    const notifications = [
      {
        type: "badge_earned",
        title: "Badge Unlocked: First Anime",
        message: 'You earned the "First Anime" badge!',
        createdAt: daysAgo(Math.floor(Math.random() * 30) + 60),
      },
      {
        type: "level_up",
        title: `Level Up! You're now Level ${profile.level}`,
        message: `Congratulations on reaching Level ${profile.level}!`,
        createdAt: daysAgo(Math.floor(Math.random() * 20) + 10),
      },
      {
        type: "xp_gained",
        title: "+50 XP Earned",
        message: "You gained 50 XP from tracking activity.",
        createdAt: daysAgo(Math.floor(Math.random() * 10) + 2),
      },
    ];

    for (const notif of notifications) {
      await prisma.notification.create({
        data: {
          userId: profile.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          read: Math.random() > 0.5,
          createdAt: notif.createdAt,
        },
      });
    }
  }
  console.log("✅ Notifications created");

  // 6. Summary
  console.log("\n📊 Seed Summary:");
  console.log(`   Users: ${users.length}`);
  console.log(`   Badges: ${BADGE_DEFS.length} definitions`);
  const totalAnime = users.reduce((sum, u) => sum + u.library.length, 0);
  console.log(`   Anime list entries: ${totalAnime}`);
  const totalFavorites = users.reduce((sum, u) => sum + u.favorites.length, 0);
  console.log(`   Favorites: ${totalFavorites}`);
  console.log("\n🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });