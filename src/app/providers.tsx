"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/lib/theme";
import { SWRConfig } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <SWRConfig
          value={{
            fetcher,
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 5,
          }}
        >
          {children}
        </SWRConfig>
      </SessionProvider>
    </ThemeProvider>
  );
}