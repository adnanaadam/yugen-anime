"use client";

import { PackageOpen, Search, BookOpen, Sparkles, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: "search" | "book" | "sparkles" | "package";
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  search: Search,
  book: BookOpen,
  sparkles: Sparkles,
  package: PackageOpen,
};

export default function EmptyState({
  icon = "package",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
        <Icon size={28} className="text-[var(--color-text-secondary)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {(actionLabel && actionHref) && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-primary-hover)] transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/20 active:scale-[0.97]"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction) && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-primary-hover)] transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/20 active:scale-[0.97]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}