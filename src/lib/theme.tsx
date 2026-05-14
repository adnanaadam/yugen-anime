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

  // Glass
  root.style.setProperty("--glass-surface", colors.glass.surface);
  root.style.setProperty("--glass-border", colors.glass.border);

  // Text
  root.style.setProperty("--color-foreground", colors.text.primary);
  root.style.setProperty("--color-text-secondary", colors.text.secondary);

  // Accent
  root.style.setProperty("--color-accent", colors.accent);

  // Glow
  root.style.setProperty("--glow-purple", colors.glow.purple);
  root.style.setProperty("--glow-blue", colors.glow.blue);
  root.style.setProperty("--glow-pink", colors.glow.pink);
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