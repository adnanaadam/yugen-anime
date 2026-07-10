// src/lib/notifications.ts
// Server-side helper to create notifications

import { prisma } from "@/lib/prisma";

type NotificationType = "xp_gained" | "badge_earned" | "level_up" | "system";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
}) {
  const { userId, type, title, message, link } = params;
  
  return prisma.notification.create({
    data: { userId, type, title, message, link },
  });
}

export async function createBadgeNotification(userId: string, badgeName: string) {
  try {
    return await createNotification({
      userId,
      type: "badge_earned",
      title: `Badge Unlocked: ${badgeName}`,
      message: `You earned the "${badgeName}" badge!`,
      link: "/profile",
    });
  } catch (error) {
    console.error("[Notifications] Failed to create badge notification:", error);
    throw error;
  }
}

export async function createLevelUpNotification(userId: string, newLevel: number) {
  try {
    return await createNotification({
      userId,
      type: "level_up",
      title: `Level Up! You're now Level ${newLevel}`,
      message: `Congratulations on reaching Level ${newLevel}!`,
      link: "/profile",
    });
  } catch (error) {
    console.error("[Notifications] Failed to create level-up notification:", error);
    throw error;
  }
}

export async function createXpNotification(userId: string, xpAmount: number) {
  if (xpAmount <= 0) return;
  return createNotification({
    userId,
    type: "xp_gained",
    title: `+${xpAmount} XP Earned`,
    message: `You gained ${xpAmount} XP from tracking activity.`,
    link: "/profile",
  });
}

export async function createSystemNotification(userId: string, title: string, message?: string) {
  return createNotification({
    userId,
    type: "system",
    title,
    message,
  });
}