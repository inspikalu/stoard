import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppNavbar } from "@/components/app/app-navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Stoard - Solana Staking Dashboard",
  description: "A comprehensive dashboard for monitoring and analyzing the health of Solana's staking ecosystem. Track stake distribution, validator performance, and network participation in real-time.",
  keywords: ["Solana", "staking", "dashboard", "blockchain", "cryptocurrency", "validators", "network health"],
  authors: [{ name: "Clement Kalu Okereke" }],
  creator: "Stoard",
  publisher: "Stoard",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://stoard.vercel.app"),
  openGraph: {
    title: "Stoard - Solana Staking Dashboard",
    description: "Monitor and analyze Solana's staking ecosystem in real-time",
    url: "https://stoard.vercel.app",
    siteName: "Stoard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stoard - Solana Staking Dashboard",
    description: "Monitor and analyze Solana's staking ecosystem in real-time",
    creator: "@inspikalu",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <AppNavbar />
            <main className="flex-1 p-4">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

