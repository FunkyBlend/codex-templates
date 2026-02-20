import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageViewTracker } from "@/components/PageViewTracker";

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
      <body className="min-h-screen flex flex-col font-sans bg-dark-bg selection:bg-accent-green/20 selection:text-green-200">
        <Header />
        <main className="flex-1 flex flex-col pt-16">
          {children}
        </main>
        <PageViewTracker />
        <Footer />
      </body>
    </html>
  );
}
