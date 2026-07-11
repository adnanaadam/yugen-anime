// src/components/feedback/FeedbackModal.tsx
"use client";

import { useState } from "react";
import { X, MessageSquare, Star } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  initialRating?: string;
}

type FeedbackStep = "rating" | "details" | "success";

function FeedbackModalInner({
  onClose,
  context,
  initialRating,
}: Omit<FeedbackModalProps, "isOpen">) {
  const [step, setStep] = useState<FeedbackStep>("rating");
  const [rating, setRating] = useState<string | null>(initialRating || null);
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRating = (value: string) => {
    setRating(value);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !rating) return;

    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          rating,
          context,
          message: message.trim(),
          email: email.trim() || undefined,
          pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        }),
      });
      setStep("success");
    } catch {
      // Keep the form open on error so user can retry
    } finally {
      setLoading(false);
    }
  };

  const emojis = ["😍", "😐", "😕"];
  const ratings = ["loved", "okay", "confused"] as const;

  return (
    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X size={18} className="text-gray-500" />
      </button>

      <div className="p-6">
        {step === "rating" && (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#f9c846]/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={24} className="text-[#f9c846]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                How was your experience?
              </h2>
              <p className="text-xs text-gray-500">
                Your feedback helps us improve Yugen for everyone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              {emojis.map((emoji, i) => (
                <button
                  key={emoji}
                  onClick={() => handleRating(ratings[i])}
                  className="text-4xl hover:scale-110 cursor-pointer transition-transform active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              What could we improve?
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full h-28 rounded-lg border border-gray-200 p-3 text-sm resize-none focus:border-[#f9c846] focus:ring-1 focus:ring-[#f9c846] outline-none"
              autoFocus
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-3 w-full rounded-lg border border-gray-200 p-2.5 text-sm bg-white"
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="ui">UI/UX Issue</option>
              <option value="performance">Performance</option>
            </select>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="mt-3 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setStep("rating")}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="flex-1 py-2 rounded-lg bg-[#f9c846] cursor-pointer text-sm font-semibold hover:bg-[#f5bd29] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Feedback"}
              </button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Star size={28} className="text-green-600 fill-current" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Thank you!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your feedback means a lot to us. It helps make Yugen better every day.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[#f9c846] text-sm font-semibold hover:bg-[#f5bd29] cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeedbackModal({
  isOpen,
  onClose,
  context,
  initialRating,
}: FeedbackModalProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ display: isOpen ? "flex" : "none" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative">
        <FeedbackModalInner
          onClose={onClose}
          context={context}
          initialRating={initialRating}
        />
      </div>
    </div>
  );
}