// src/lib/feedback-helper.ts
// This utility provides a way to show feedback (toasts/celebration) 
// from any component without needing React hooks.

import type { FeedbackData } from "@/features/tracking/api";

// Toast type for the global function
interface GlobalToast {
  type: "xp" | "badge" | "levelup";
  message: string;
  amount?: number;
  badgeName?: string;
  level?: number;
}

// Global function references - these get registered by the root layout
let globalShowFeedbackFn: ((feedback: FeedbackData) => void) | null = null;
let globalShowToastFn: ((toast: GlobalToast) => void) | null = null;

export function registerFeedbackHandlers(
  showFeedback: (feedback: FeedbackData) => void,
  showToast: (toast: GlobalToast) => void
) {
  globalShowFeedbackFn = showFeedback;
  globalShowToastFn = showToast;
}

export function unregisterFeedbackHandlers() {
  globalShowFeedbackFn = null;
  globalShowToastFn = null;
}

export function handleFeedback(feedback: FeedbackData) {
  if (globalShowToastFn && feedback.xpEarned > 0) {
    globalShowToastFn({
      type: "xp",
      message: "XP Earned!",
      amount: feedback.xpEarned,
    });
  }

  if (globalShowToastFn && feedback.newBadges.length > 0) {
    feedback.newBadges.forEach((badge) => {
      globalShowToastFn!({
        type: "badge",
        message: `Badge Unlocked: ${badge.name}`,
        amount: badge.xpReward,
      });
    });
  }

  if (globalShowFeedbackFn && (feedback.newLevel > feedback.previousLevel || feedback.newBadges.length > 0)) {
    globalShowFeedbackFn(feedback);
  }
}

export function extractFeedback(result: unknown): FeedbackData | null {
  if (result && typeof result === "object" && "feedback" in result) {
    return (result as { feedback: FeedbackData }).feedback;
  }
  return null;
}