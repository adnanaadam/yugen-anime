"use client";

import { useEffect } from "react";
import { themeColors } from "./theme-colors";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      "--color-background",
      themeColors.background
    );

    root.style.setProperty(
      "--color-foreground",
      themeColors.text.primary
    );

    root.style.setProperty(
      "--color-text-secondary",
      themeColors.text.secondary
    );

    root.style.setProperty(
      "--color-primary",
      themeColors.primary
    );

    root.style.setProperty(
      "--color-secondary",
      themeColors.secondary
    );

    root.style.setProperty(
      "--color-info",
      themeColors.info
    );

    root.style.setProperty(
      "--color-success",
      themeColors.success
    );

    root.style.setProperty(
      "--color-surface",
      themeColors.surface
    );

    root.style.setProperty(
      "--color-border",
      themeColors.border
    );
  }, []);

  return <>{children}</>;
}