// src/components/anime/FavoriteButton.tsx
"use client";

import { useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { Heart } from "lucide-react";
import { handleFeedback, extractFeedback } from "@/lib/feedback-helper";
import { addGlobalToast } from "@/components/Toast";

interface FavoriteButtonProps {
  animeId: number;
  initialFavorited?: boolean;
  size?: number;
  className?: string;
  onToggle?: (favorited: boolean) => void;
}

export default function FavoriteButton({
  animeId,
  initialFavorited = false,
  size = 16,
  className = "",
  onToggle,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!session) {
        signIn();
        return;
      }

      setLoading(true);

      try {
        if (favorited) {
          // Remove from favorites
          const res = await fetch(`/api/favorites?animeId=${animeId}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to remove favorite");
          setFavorited(false);
          onToggle?.(false);
        } else {
          // Add to favorites
          const res = await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animeId }),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            const errorMsg = errorData?.error || "Failed to add favorite";
            if (res.status === 400) {
              addGlobalToast({
                type: "xp",
                message: errorMsg,
              });
              return;
            }
            throw new Error(errorMsg);
          }

          const data = await res.json();
          setFavorited(true);
          onToggle?.(true);

          // Show feedback (XP, badges)
          const feedback = extractFeedback(data);
          if (feedback) {
            handleFeedback(feedback);
          }
        }
      } catch (error) {
        console.error("Favorite toggle failed:", error);
        addGlobalToast({
          type: "xp",
          message: "Something went wrong. Try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [animeId, favorited, session, onToggle]
  );

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex h-7 w-7 items-center cursor-pointer justify-center rounded-full backdrop-blur-sm border transition-all ${
        favorited
          ? "bg-[#f96e46]/20 border-[#f96e46]/40 text-[#f96e46] hover:bg-[#f96e46]/30"
          : "bg-black/60 border-white/10 text-white hover:bg-[#f96e46] hover:text-white hover:border-transparent"
      } ${loading ? "opacity-50 cursor-wait" : ""} ${className}`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        className={`transition-all duration-200 ${
          favorited ? "fill-current scale-110" : ""
        }`}
      />
    </button>
  );
}