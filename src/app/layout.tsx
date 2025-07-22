"use client";

import { Toaster } from "@/components/ui/toast";
import CookieConsentProvider from "@/context/consent-cookie";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/context/supabase";
import { ThemeProvider, useTheme } from "@/context/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutComponent>
        {children}
      </LayoutComponent>
    </ThemeProvider>
  );
}

function LayoutComponent({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();
  return (
    <html lang="en" className={mode}>
      <head className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        <link
          rel="icon"
          href="https://api.soreal.app/assets/png/logo/favicon.png"
        />
        <link
          rel="shortcut icon"
          href="https://api.soreal.app/assets/png/logo/favicon.png"
        />
        <link
          rel="apple-touch-icon"
          href="https://api.soreal.app/assets/png/logo/favicon.png"
        />
      </head>
      <body>
        <NextThemesProvider disableTransitionOnChange>
          <SupabaseProvider>
            <CookieConsentProvider>
              {children}
              <Toaster />
            </CookieConsentProvider>
          </SupabaseProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
