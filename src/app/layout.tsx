import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QuestForge — Digital Game Marketplace",
    template: "%s | QuestForge",
  },
  description:
    "Forge your digital game library. Buy, sell, and discover the best games on QuestForge — the premier digital game marketplace.",
  keywords: ["games", "digital marketplace", "gaming", "buy games", "game store"],
  authors: [{ name: "QuestForge" }],
  creator: "QuestForge",
  metadataBase: new URL("https://questforge.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "QuestForge",
    title: "QuestForge — Digital Game Marketplace",
    description: "Forge your digital game library.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
