"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ size = 20, className = "", text }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2
        size={size}
        className="animate-spin text-[var(--color-primary)]"
      />
      {text && (
        <span className="text-xs text-[var(--color-text-secondary)]">{text}</span>
      )}
    </div>
  );
}