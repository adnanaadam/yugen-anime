// src/fonts/fonts.js
import localFont from "next/font/local";


export const lordJuusai = localFont({
  src: [
    {
      path: "./Lord-Juusai.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-clash",
});