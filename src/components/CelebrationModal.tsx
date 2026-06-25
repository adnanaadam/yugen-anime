"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Trophy, Star, Zap } from "lucide-react";
import { lordJuusai } from "@/fonts/fonts";

interface NewBadge {
  name: string;
  xpReward: number;
}

interface CelebrationData {
  type: "levelup" | "badge" | "mixed";
  level?: number;
  badges?: NewBadge[];
  xpEarned?: number;
}

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CelebrationData | null;
}

export default function CelebrationModal({ isOpen, onClose, data }: CelebrationModalProps) {
  if (!isOpen || !data) return null;

  const hasLevelUp = data.type === "levelup" || data.type === "mixed";
  const hasBadges = (data.type === "badge" || data.type === "mixed") && data.badges && data.badges.length > 0;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#f9c846] via-[#f96e46] to-[#c084fc] p-8 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
          
          {/* Icon */}
          <div className="relative mx-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
            {hasLevelUp ? (
              <Sparkles size={32} className="text-white" />
            ) : (
              <Trophy size={32} className="text-white" />
            )}
          </div>

          <h2 className={`relative text-2xl text-white ${lordJuusai.className}`}>
            {hasLevelUp ? "Level Up!" : "Achievement Unlocked!"}
          </h2>
          
          {data.level && (
            <p className="relative text-5xl font-bold text-white mt-2">
              {data.level}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {data.xpEarned && data.xpEarned > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f9c846]/10 border border-[#f9c846]/20">
              <div className="w-10 h-10 rounded-full bg-[#f9c846]/20 flex items-center justify-center">
                <Zap size={20} className="text-[#f9c846]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#545863]">
                  XP Earned
                </p>
                <p className="text-lg font-bold text-[#f9c846]">
                  +{data.xpEarned.toLocaleString()} XP
                </p>
              </div>
            </div>
          )}

          {/* Badges earned */}
          {hasBadges && data.badges && (
            <div>
              <p className="text-xs font-semibold text-[#7b7f89] uppercase tracking-wider mb-3">
                Badges Earned
              </p>
              <div className="space-y-2">
                {data.badges.map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#f9c846]/10 to-[#f96e46]/10 border border-[#f9c846]/20"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f9c846]/20 flex items-center justify-center">
                      <Star size={18} className="text-[#f9c846]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#545863]">
                        {badge.name}
                      </p>
                      <p className="text-xs text-[#7b7f89]">
                        +{badge.xpReward} XP bonus
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#545863] text-white text-sm font-semibold hover:bg-[#3d4049] transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}