import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "./_components/header";
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "./_components/footer";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ruRU } from "@clerk/localizations";
import { ThemeProvider } from "@/components/theme-provider"
import { themeColors } from '@/lib/theme-colors';


const geist = localFont({
  src: "../public/fonts/Geist.ttf",
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeBox",
  description: "Защищенное облачное хранилище для ваших файлов",
  manifest: "/manifest.json",
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: themeColors.primary },
    { media: '(prefers-color-scheme: dark)', color: themeColors.primaryDark }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Safebox'
  },
  applicationName: 'Safebox',
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider localization={ruRU}>
      <html lang="ru" suppressHydrationWarning>
        <head>
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Safebox" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#4f46e5" />
        </head>
        <body
          className={`${geist.className} antialiased`}
        >
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <Header />
              {children}
              <Footer />
            </ThemeProvider>
            <Analytics />
            <SpeedInsights />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}