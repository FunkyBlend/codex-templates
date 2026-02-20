import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getAllCatalogItems, getCatalogItem } from "@/lib/catalog-data";
import type { CatalogItemType } from "@/lib/catalog-types";

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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <Link
        href="/browse"
        className="w-fit rounded border border-dark-border bg-dark-card px-3 py-1.5 text-xs font-semibold text-dark-muted transition hover:border-accent-green hover:text-accent-green"
      >
        Back to Browse
      </Link>

      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-dark-border bg-dark-bg px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-dark-muted">
            {item.type}
          </span>
          <span className="rounded-full border border-dark-border bg-dark-bg px-2 py-0.5 text-[11px] text-dark-muted">
            Updated {item.updated_at}
          </span>
          <span className="rounded-full border border-dark-border bg-dark-bg px-2 py-0.5 text-[11px] text-dark-muted">
            License: {item.license}
          </span>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-dark-text">{item.title}</h1>
        <p className="mb-4 text-sm text-dark-muted">{item.summary}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {item.compatibility.map((compatibility) => (
            <span
              key={`${item.id}-${compatibility}`}
              className="rounded-full border border-dark-border bg-dark-bg px-2 py-0.5 text-xs text-dark-muted"
            >
              {compatibility}
            </span>
          ))}
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded border border-dark-border bg-dark-bg p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dark-muted">
              Install Hint
            </p>
            <code className="block overflow-x-auto text-xs text-accent-green">
              {item.install_hint}
            </code>
            <CopyButton
              text={item.install_hint}
              label="Copy Install Command"
              className="mt-3"
              analyticsId={item.id}
            />
          </div>

          <div className="rounded border border-dark-border bg-dark-bg p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dark-muted">
              Source Links
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href={item.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-green hover:underline"
              >
                View source on GitHub
              </a>
              <a
                href={item.raw_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-green hover:underline"
              >
                Open raw content
              </a>
            </div>
          </div>
        </div>

        {item.safety_notes ? (
          <div className="mb-6 rounded border border-yellow-700/60 bg-yellow-500/10 p-3 text-sm text-yellow-200">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-yellow-300">
              Safety Notes
            </p>
            <p>{item.safety_notes}</p>
          </div>
        ) : null}

        <MarkdownContent markdown={item.body || "_No additional content provided._"} />
      </section>
    </div>
  );
}
