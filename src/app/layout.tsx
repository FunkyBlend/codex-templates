import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageViewTracker } from "@/components/PageViewTracker";
import { PersistentStackBuilder } from "@/components/StackBuilder";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "CodexDepot",
  description:
    "Community-driven Codex marketplace powered by repository content and static indexing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-screen flex flex-col font-sans bg-[#05070a] selection:bg-accent-green/20 selection:text-green-200 ${inter.variable} ${jetbrainsMono.variable}`}>
        <Header />
        <main className="flex-1 flex flex-col pt-16">
          {children}
        </main>
        <PersistentStackBuilder />
        <PageViewTracker />
        <Footer />
      </body>
    </html>
  );
}
