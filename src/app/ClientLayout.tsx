"use client";

import { useState, useEffect } from "react";
import { ToastProvider, addGlobalToast } from "@/components/Toast";
import CelebrationModal from "@/components/CelebrationModal";
import type { FeedbackData } from "@/features/tracking/api";
import { registerFeedbackHandlers, unregisterFeedbackHandlers } from "@/lib/feedback-helper";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [celebrationData, setCelebrationData] = useState<FeedbackData | null>(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);

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

  return (
    <ToastProvider>
      {children}
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
    </ToastProvider>
  );
}
