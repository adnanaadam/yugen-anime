"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { themeColors } from "./theme-colors";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function setThemeVariables(theme: Theme) {
  const colors = themeColors[theme];
  const root = document.documentElement;

  root.setAttribute("data-theme", theme);

  // Background
  root.style.setProperty("--color-background", colors.background);

  // Text
  root.style.setProperty("--color-foreground", colors.text.primary);
  root.style.setProperty("--color-text-secondary", colors.text.secondary);

  // Accent
  root.style.setProperty("--color-accent", colors.accent);

  // Card backgrounds
  root.style.setProperty("--card-bg-1", colors.cards[0]);
  root.style.setProperty("--card-bg-2", colors.cards[1]);
  root.style.setProperty("--card-bg-3", colors.cards[2]);
  root.style.setProperty("--card-bg-4", colors.cards[3]);

  // Surface colors (simplified, no glass)
  root.style.setProperty("--surface", colors.surface);
  root.style.setProperty("--surface-hover", colors.surfaceHover);
  root.style.setProperty("--border", colors.border);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme") as Theme | null;
  return saved || "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    setThemeVariables(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}