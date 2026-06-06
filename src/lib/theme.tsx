// src/lib/theme.tsx

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { themeColors } from "./theme-colors";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void; // Keep this for future implementation
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function setThemeVariables(theme: Theme) {
  const colors = themeColors[theme];
  const root = document.documentElement;

  root.setAttribute("data-theme", theme);
  
  // Set color-scheme for browser UI elements
  root.style.colorScheme = theme;

  // Background
  root.style.setProperty("--color-background", colors.background);

  // Text
  root.style.setProperty("--color-foreground", colors.text.primary);
  root.style.setProperty("--color-text-secondary", colors.text.secondary);

  // Accent colors
  root.style.setProperty("--color-accent", colors.accent);
  root.style.setProperty("--color-accent-secondary", colors.accentSecondary);
  root.style.setProperty("--color-accent-tertiary", colors.accentTertiary);

  // Card backgrounds
  root.style.setProperty("--card-bg-1", colors.cards[0]);
  root.style.setProperty("--card-bg-2", colors.cards[1]);
  root.style.setProperty("--card-bg-3", colors.cards[2]);
  root.style.setProperty("--card-bg-4", colors.cards[3]);

  // Surface colors
  root.style.setProperty("--color-surface", colors.surface);
  root.style.setProperty("--color-surface-hover", colors.surfaceHover);
  root.style.setProperty("--color-border", colors.border);
}

// Force light mode for now, but keep the logic for when you add dark mode
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  
  // For now, always return "light"
  // When you're ready to add dark mode, you can uncomment this:
  /*
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved) return saved;
  
  // Optional: Check system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
  */
  
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    setThemeVariables(theme);
  }, [theme]);

  // This function is ready for when you want to add dark mode toggle
  const toggleTheme = () => {
    // When you're ready to enable dark mode, uncomment this:
    /*
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    */
    
    // For now, just console.log to show it's ready
    console.log("Dark mode toggle will be available soon!");
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