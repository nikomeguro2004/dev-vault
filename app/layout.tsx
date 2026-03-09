import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Developer Knowledge Hub",
  description: "Personal developer reference vault with categories and snippets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${monoFont.variable} antialiased`}>
        <ThemeProvider>
          <div className="app-bg min-h-screen">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-cyan-500 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
              Skip to content
            </a>
            <SiteHeader />
            <main
              id="main-content"
              className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8"
            >
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
