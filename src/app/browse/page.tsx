import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/BrowseClient";
import { getAllCatalogItems, getSearchIndex } from "@/lib/catalog-data";

export const metadata: Metadata = {
  title: "Browse | CodexDepot",
  description: "Search and filter CodexDepot items from the generated static index.",
};

export default async function BrowsePage() {
  const [items, searchIndex] = await Promise.all([
    getAllCatalogItems(),
    getSearchIndex(),
  ]);
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-6 py-10 text-sm text-dark-muted">
          Loading catalog filters...
        </div>
      }
    >
      <BrowseClient items={items} searchRecords={searchIndex.items} />
    </Suspense>
  );
}
