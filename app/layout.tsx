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

const geist = localFont({
  src: "../public/fonts/Geist.ttf",
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeBox",
  description: "Защищенное облачное хранилище для ваших файлов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider localization={ruRU}>
      <html lang="ru" suppressHydrationWarning>
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