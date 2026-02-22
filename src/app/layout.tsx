import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased bg-[#030305] text-slate-300">
        {children}
      </body>
    </html>
  );
}
