// src/hooks/useFeedbackPrompts.ts
"use client";

import { useEffect, useCallback } from "react";

const STORAGE_KEY = "yugen_feedback_prompts";

interface PromptState {
  firstAnimeCompletionShown: boolean;
  leveledUpShown: boolean;
  earlyUserNudgeShown: boolean;
}

function getState(): PromptState {
  if (typeof window === "undefined") {
    return {
      firstAnimeCompletionShown: false,
      leveledUpShown: false,
      earlyUserNudgeShown: false,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }

  return {
    firstAnimeCompletionShown: false,
    leveledUpShown: false,
    earlyUserNudgeShown: false,
  };
}

function saveState(state: PromptState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function useFeedbackPrompts(
  onTriggerFeedback: (context: string) => void
) {
  const state = getState();

  // Mark first anime completion prompt as shown
  const markFirstAnimeShown = useCallback(() => {
    const s = getState();
    s.firstAnimeCompletionShown = true;
    saveState(s);
  }, []);

  // Mark level up prompt as shown
  const markLevelUpShown = useCallback(() => {
    const s = getState();
    s.leveledUpShown = true;
    saveState(s);
  }, []);

  // Mark early user nudge as shown
  const markEarlyUserNudgeShown = useCallback(() => {
    const s = getState();
    s.earlyUserNudgeShown = true;
    saveState(s);
  }, []);

  // Track usage milestones for early user nudge
  const trackUsage = useCallback(
    (milestone: "level3" | "fiveAnime" | "tenEpisodes") => {
      const s = getState();
      if (s.earlyUserNudgeShown) return;

      // This hook doesn't know the actual counts; the caller should
      // pass context based on their own data. We just expose helpers.
      if (milestone === "level3" || milestone === "fiveAnime" || milestone === "tenEpisodes") {
        onTriggerFeedback("early_user_nudge");
        markEarlyUserNudgeShown();
      }
    },
    [onTriggerFeedback, markEarlyUserNudgeShown]
  );

  return {
    markFirstAnimeShown,
    markLevelUpShown,
    markEarlyUserNudgeShown,
    trackUsage,
    state,
  };
}