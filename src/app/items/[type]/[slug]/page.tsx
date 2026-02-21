import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getAllCatalogItems, getCatalogItem } from "@/lib/catalog-data";
import type { CatalogItemType } from "@/lib/catalog-types";
import { AddToStackButton } from "@/components/AddToStackButton";
import { Github, FileText, Download, Calendar, Shield, Tag } from "lucide-react";

interface ItemPageProps {
  params: {
    type: string;
    slug: string;
  };
}

function isCatalogItemType(value: string): value is CatalogItemType {
  return ["skill", "agent", "command", "template", "hook", "setting"].includes(value);
}

export async function generateStaticParams() {
  const items = await getAllCatalogItems();
  return items.map((item) => ({
    type: item.type,
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  if (!isCatalogItemType(params.type)) {
    return {
      title: "Item Not Found | CodexDepot",
    };
  }

  const item = await getCatalogItem(params.type, params.slug);
  if (!item) {
    return {
      title: "Item Not Found | CodexDepot",
    };
  }

  return {
    title: `${item.title} | CodexDepot`,
    description: item.summary,
  };
}

export default async function ItemDetailPage({ params }: ItemPageProps) {
  if (!isCatalogItemType(params.type)) {
    notFound();
  }

  const item = await getCatalogItem(params.type, params.slug);
  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col lg:flex-row gap-12 px-6 py-8">
      
      {/* LEFT COLUMN - Main Content */}
      <div className="flex-1 min-w-0">
        <Link
          href="/browse"
          className="inline-flex mb-8 text-xs font-mono text-dark-muted hover:text-white transition-colors"
        >
          ← Back to Catalog
        </Link>

        {/* Header Section */}
        <div className="flex items-start gap-6 mb-8 border-b border-dark-border pb-8">
          <div className="hidden sm:flex text-4xl bg-dark-card w-20 h-20 items-center justify-center rounded border border-dark-border shrink-0">
            {item.type === 'skill' ? '🎨' : item.type === 'agent' ? '🤖' : item.type === 'template' ? '📦' : '⚡'}
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{item.title}</h1>
            <p className="text-lg text-dark-muted font-sans mb-4">{item.summary}</p>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge border-accent-green/50 text-accent-green bg-accent-green/10">
                {item.type}
              </span>
              <span className="badge">
                v{item.version}
              </span>
              {item.compatibility.map((compatibility) => (
                <span key={`${item.id}-${compatibility}`} className="badge text-dark-muted">
                  {compatibility}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Markdown Body */}
        <div className="prose prose-invert prose-pre:bg-black prose-pre:border prose-pre:border-dark-border max-w-none">
          {item.safety_notes ? (
            <div className="mb-8 rounded-md border border-yellow-700/50 bg-yellow-900/10 p-4">
              <div className="flex items-center gap-2 text-yellow-500 mb-2 font-bold font-mono text-sm">
                <Shield size={16} /> SAFETY WARNING
              </div>
              <p className="text-sm text-yellow-200/80 m-0">{item.safety_notes}</p>
            </div>
          ) : null}

          <MarkdownContent markdown={item.body || "_No additional content provided._"} />
        </div>
      </div>

      {/* RIGHT COLUMN - Sidebar */}
      <div className="w-full lg:w-[340px] shrink-0">
        <div className="sticky top-24 flex flex-col gap-6">
          
          {/* Install Box */}
          <div className="border border-dark-border bg-dark-bg rounded-lg p-5">
            <h3 className="font-bold text-white text-sm mb-3 font-mono">Install Command</h3>
            <div className="bg-black border border-dark-border rounded p-3 text-accent-green text-[11px] font-mono break-all mb-4 relative group">
              {item.install_hint}
            </div>
            <CopyButton
              text={item.install_hint}
              label="Copy Command"
              className="w-full mb-3 flex items-center justify-center py-2"
              analyticsId={item.id}
            />
            
            <div className="relative flex items-center py-3">
              <div className="flex-grow border-t border-dark-border"></div>
              <span className="shrink-0 px-3 text-dark-muted text-xs font-mono">OR</span>
              <div className="flex-grow border-t border-dark-border"></div>
            </div>

            <AddToStackButton item={item} />
          </div>

          {/* Metadata Box */}
          <div className="border border-dark-border bg-dark-bg rounded-lg p-5">
            <h3 className="font-bold text-white text-sm mb-4 font-mono">Metadata</h3>
            
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center border-b border-dark-border/50 pb-3">
                <span className="text-dark-muted flex items-center gap-2"><Tag size={14} /> Version</span>
                <span className="text-white font-mono">{item.version}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-dark-border/50 pb-3">
                <span className="text-dark-muted flex items-center gap-2"><Calendar size={14} /> Updated</span>
                <span className="text-white font-mono text-xs">{item.updated_at.split('T')[0]}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-dark-border/50 pb-3">
                <span className="text-dark-muted flex items-center gap-2"><Shield size={14} /> License</span>
                <span className="text-white font-mono text-xs">{item.license}</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <span className="text-dark-muted flex items-center gap-2 mb-1"><Github size={14} /> Repository</span>
                <a
                  href={item.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-green hover:text-white transition-colors text-xs font-mono break-all"
                >
                  View source on GitHub →
                </a>
                <a
                  href={item.raw_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-muted hover:text-white transition-colors text-xs font-mono break-all mt-1"
                >
                  <FileText size={12} className="inline mr-1" /> Open raw content
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
