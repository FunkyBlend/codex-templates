import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeClient } from "@/components/HomeClient";
import { getAllCatalogItems } from "@/lib/catalog-data";

export const metadata: Metadata = {
  title: "CodexDepot - Developer Workflows",
  description: "Ready-to-use configurations and skills for your Codex projects.",
};

export default async function HomePage() {
  const items = await getAllCatalogItems();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center font-mono text-sm text-dark-muted">
          INITIALIZING_SYSTEM_UI...
        </div>
      }
    >
      <HomeClient items={items} />
    </Suspense>
  );
}
