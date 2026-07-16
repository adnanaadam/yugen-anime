"use client";

import { useState, useEffect, useCallback } from "react";
import { ToastProvider, addGlobalToast } from "@/components/Toast";
import CelebrationModal from "@/components/CelebrationModal";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ScrollToTop from "@/components/ui/ScrollToTop";
import FeedbackModal from "@/components/feedback/FeedbackModal";
import { MessageSquare } from "lucide-react";
import type { FeedbackData } from "@/features/tracking/api";
import { registerFeedbackHandlers, unregisterFeedbackHandlers } from "@/lib/feedback-helper";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [celebrationData, setCelebrationData] = useState<FeedbackData | null>(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState("general");

  const openFeedback = useCallback((context: string = "general") => {
    setFeedbackContext(context);
    setFeedbackOpen(true);
  }, []);

  useEffect(() => {
    const showFeedback = (feedback: FeedbackData) => {
      setCelebrationData(feedback);
      if (feedback.newLevel > feedback.previousLevel || feedback.newBadges.length > 0) {
        setCelebrationOpen(true);
      }
    };
    const showToast = (toast: { type: "xp" | "badge" | "levelup"; message: string; amount?: number; badgeName?: string; level?: number }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addGlobalToast(toast as any);
    };
    
    registerFeedbackHandlers(showFeedback, showToast);
    return () => {
      unregisterFeedbackHandlers();
    };
  }, []);

  // After first celebration, ask for contextual feedback
  useEffect(() => {
    if (!celebrationOpen) return;

    const isLevelUp = celebrationData && celebrationData.newLevel > celebrationData.previousLevel;
    const hasBadges = celebrationData && celebrationData.newBadges.length > 0;

    if (isLevelUp || hasBadges) {
      const timer = setTimeout(() => {
        setFeedbackContext(isLevelUp ? "level_up" : "badge_earned");
        setFeedbackOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [celebrationOpen, celebrationData]);

  // Delayed early-user feedback nudge based on localStorage milestones
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("yugen_feedback_prompts");
      if (!raw) return;
      const state = JSON.parse(raw) as {
        earlyUserNudgeShown?: boolean;
        totalEpisodes?: number;
        totalAnime?: number;
        level?: number;
      };
      if (state.earlyUserNudgeShown) return;

      const shouldNudge =
        (state.level && state.level >= 3) ||
        (state.totalAnime && state.totalAnime >= 5) ||
        (state.totalEpisodes && state.totalEpisodes >= 10);

      if (shouldNudge) {
        const timer = setTimeout(() => {
          setFeedbackContext("early_user_nudge");
          setFeedbackOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <ToastProvider>
      <ErrorBoundary>
        <div className="animate-fade-in">
          {children}
        </div>
      </ErrorBoundary>
      <ScrollToTop />
      <CelebrationModal
        isOpen={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        data={celebrationData ? {
          type: celebrationData.newLevel > celebrationData.previousLevel
            ? (celebrationData.newBadges.length > 0 ? "mixed" : "levelup")
            : "badge",
          level: celebrationData.newLevel,
          badges: celebrationData.newBadges,
          xpEarned: celebrationData.xpEarned,
        } : null}
      />
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        context={feedbackContext}
      />
      <button
        onClick={() => openFeedback("general")}
        className="fixed bottom-6 left-6 z-[9998] flex items-center gap-2 rounded-full bg-[#545863] px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-[#3d424d] transition-all active:scale-95 cursor-pointer"
        title="Send feedback"
      >
        <MessageSquare size={16} />
        <span className="hidden sm:inline">Feedback</span>
      </button>
    </ToastProvider>
  );
}