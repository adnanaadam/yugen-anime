"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Minus } from "lucide-react";

const statusOptions = [
  { label: "Watching", value: "WATCHING" as const, color: "#00e8fc" },
  { label: "Completed", value: "COMPLETED" as const, color: "#97cc04" },
  { label: "Plan to Watch", value: "PLAN_TO_WATCH" as const, color: "#f9c846" },
  { label: "Paused", value: "PAUSED" as const, color: "#f96e46" },
  { label: "Dropped", value: "DROPPED" as const, color: "#ff4444" },
  { label: "Rewatching", value: "REWATCHING" as const, color: "#c084fc" },
];

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: string, progress: number) => void;
  currentStatus: string;
  currentProgress: number;
  totalEpisodes?: number;
  animeTitle: string;
  isAiring?: boolean;
  isUpdating?: boolean;
}

export default function UpdateProgressModal({
  isOpen,
  onClose,
  onSave,
  currentStatus,
  currentProgress,
  totalEpisodes,
  animeTitle,
  isAiring = false,
  isUpdating = false,
}: UpdateProgressModalProps) {
  // Note: Parent component should pass a unique `key` prop when opening modal
  // to ensure state resets for different anime (e.g., key={`modal-${animeId}-${Date.now()}`})
  const [status, setStatus] = useState(currentStatus);
  const [progress, setProgress] = useState(currentProgress);
  const prevStatusRef = useRef(currentStatus);
  const prevProgressRef = useRef(currentProgress);

  // Sync status with prop changes (only when changed)
  useEffect(() => {
    if (currentStatus !== prevStatusRef.current) {
      prevStatusRef.current = currentStatus;
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  // Sync progress with prop changes (only when changed)
  useEffect(() => {
    if (currentProgress !== prevProgressRef.current) {
      prevProgressRef.current = currentProgress;
      setProgress(currentProgress);
    }
  }, [currentProgress]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(status, progress);
  };

  const handleProgressChange = (delta: number) => {
    const newProgress = Math.max(0, progress + delta);
    if (totalEpisodes && totalEpisodes > 0) {
      setProgress(Math.min(newProgress, totalEpisodes));
    } else {
      setProgress(newProgress);
    }
  };

  const handleProgressInputChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (totalEpisodes && totalEpisodes > 0) {
      setProgress(Math.max(0, Math.min(numValue, totalEpisodes)));
    } else {
      setProgress(Math.max(0, numValue));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#ececec]">
          <h3 className="text-sm font-semibold text-[#545863]">Update Progress</h3>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="p-1 rounded-lg hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
          >
            <X size={18} className="text-[#7b7f89]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Anime Title */}
          <div>
            <p className="text-xs text-[#7b7f89] mb-1">Anime</p>
            <p className="text-sm font-medium text-[#545863] line-clamp-2">{animeTitle}</p>
          </div>

          {/* Status Selector */}
          <div>
            <label className="text-xs text-[#7b7f89] mb-2 block">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  disabled={isUpdating || (option.value === "COMPLETED" && isAiring)}
                  className={`flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    status === option.value
                      ? "border-[#545863] bg-[#f7f7f7]"
                      : "border-[#ececec] hover:border-[#f9c846]/30"
                  } ${option.value === "COMPLETED" && isAiring ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-xs font-medium text-[#545863]">{option.label}</span>
                  {option.value === "COMPLETED" && isAiring && (
                    <span className="text-[10px] text-[#7b7f89]">(Currently Airing)</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Progress */}
          <div>
            <label className="text-xs text-[#7b7f89] mb-2 block">
              Episodes Watched
              {totalEpisodes && totalEpisodes > 0 && (
                <span className="text-[#7b7f89]"> (max: {totalEpisodes})</span>
              )}
            </label>
            
            {/* Show current progress */}
            {currentProgress > 0 && (
              <div className="mb-2 p-2 rounded-lg bg-[#f7f7f7] border border-[#ececec]">
                <p className="text-[11px] text-[#7b7f89]">
                  Currently watched: <span className="font-semibold text-[#545863]">{currentProgress} episodes</span>
                  {progress > currentProgress && (
                    <span className="text-[#97cc04] ml-1">
                      (+{progress - currentProgress} new)
                    </span>
                  )}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleProgressChange(-1)}
                disabled={isUpdating || progress === 0}
                className="p-2 rounded-lg border cursor-pointer border-[#ececec] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={progress}
                onChange={(e) => handleProgressInputChange(e.target.value)}
                disabled={isUpdating}
                className="flex-1 px-3 py-2 text-center text-sm font-medium text-[#545863] border border-[#ececec] rounded-lg focus:outline-none focus:border-[#f9c846] disabled:opacity-50"
                min="0"
                max={totalEpisodes || undefined}
              />
              <button
                onClick={() => handleProgressChange(1)}
                disabled={isUpdating || (totalEpisodes ? progress >= totalEpisodes : false)}
                className="p-2 rounded-lg border cursor-pointer border-[#ececec] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-[#ececec]">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 rounded-lg border cursor-pointer border-[#ececec] text-sm font-medium text-[#545863] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 rounded-lg bg-[#f9c846] cursor-pointer text-sm font-medium text-[#545863] hover:bg-[#f5bd29] transition-colors disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}