import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/BrowseClient";
import { getAllCatalogItems, getSearchIndex } from "@/lib/catalog-data";
import { StackBuilderSidebar } from "@/components/StackBuilder";

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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col lg:flex-row gap-12 px-6 py-8">
      
      {/* LEFT COLUMN - Browse Content */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-mono font-bold text-white mb-2">Browse Catalog</h1>
        <p className="text-dark-muted font-sans text-sm mb-8">
          Search and filter through the complete repository-driven index.
        </p>

        <Suspense
          fallback={
            <div className="w-full py-10 text-sm text-dark-muted font-mono animate-pulse">
              Loading catalog filters...
            </div>
          }
        >
          <BrowseClient items={items} searchRecords={searchIndex.items} />
        </Suspense>
      </div>

      {/* RIGHT COLUMN - Stack Builder Sidebar */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <div className="sticky top-24 border border-dark-border bg-dark-bg p-6 rounded-lg">
          <StackBuilderSidebar />
        </div>
      </div>
      
    </div>
  );
}
