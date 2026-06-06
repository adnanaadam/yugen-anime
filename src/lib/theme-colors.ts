// src/lib/theme-colors.ts

export const themeColors = {
  light: {
    background: "#E0E2DB", // Pure white background
    
    text: {
      primary: "#111111", // Almost black for better contrast
      secondary: "#666666", // Medium gray for secondary text
    },
    
    accent: "#f7b708", // tuscan-sun-500
    accentSecondary: "#f73c08", // burnt-peach-500
    accentTertiary: "#00eaff", // electric-aqua-500
    
    cards: [
      "#f5f5f5", // Light gray card
      "#f7b708", // tuscan-sun-500
      "#f96339", // burnt-peach-400
      "#00bbcc", // electric-aqua-600
    ],
    
    surface: "#f8f9fa", // Very light gray surface
    surfaceHover: "#f0f0f0", // Slightly darker on hover
    border: "#e0e0e0", // Light border color
  },
  
  dark: {
    background: "#101113", // charcoal-950
    
    text: {
      primary: "#ffffff",
      secondary: "#9195a1", // charcoal-400
    },
    
    accent: "#f7b708", // tuscan-sun-500
    accentSecondary: "#f73c08", // burnt-peach-500
    accentTertiary: "#00eaff", // electric-aqua-500
    
    cards: [
      "#c8cad0", // charcoal-200
      "#f7b708", // tuscan-sun-500
      "#f96339", // burnt-peach-400
      "#00bbcc", // electric-aqua-600
    ],
    
    surface: "#17191c", // charcoal-900
    surfaceHover: "#2f3137", // charcoal-800
    border: "#464a53", // charcoal-700
  },
};