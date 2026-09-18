import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import ClientLayout from "./ClientLayout";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OtakuProfile - Build Your Anime Identity",
  description:
    "Create your OtakuProfile, showcase your favorite anime, track your journey, earn badges, and build an anime profile that’s uniquely yours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full`}
    >
      <head>
        {/* Applies the persisted theme before first paint (default: dark) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("yugen-theme");if(t!=="light"&&t!=="dark"){t="dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
        <GoogleAnalytics />
      </body>
    </html>
  );
}