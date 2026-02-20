import Link from "next/link";
import Image from "next/image";
import { CopyButton } from "@/components/CopyButton";
import { getCatalogIndex, getStatsIndex } from "@/lib/catalog-data";
import type { CatalogItemType } from "@/lib/catalog-types";

const TYPE_LABELS: Record<CatalogItemType, string> = {
  skill: "Skills",
  agent: "Agents",
  command: "Commands",
  template: "Templates",
  hook: "Hooks",
  setting: "Settings",
};

export default async function HomePage() {
  const [index, stats] = await Promise.all([getCatalogIndex(), getStatsIndex()]);
  const repository = index.source.repository || "FunkyBlend/codex-templates";
  const badgeUrls = {
    stars: `https://img.shields.io/github/stars/${repository}?style=for-the-badge`,
    license: `https://img.shields.io/github/license/${repository}?style=for-the-badge`,
    items: `https://img.shields.io/badge/items-${stats.totals.items}-success?style=for-the-badge`,
    cli: "https://img.shields.io/badge/CLI-v0.1.0-blue?style=for-the-badge",
  };
  const latestItems = [...index.items]
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at))
    .slice(0, 6);

  const typeCards = Object.entries(stats.totals.by_type)
    .map(([type, count]) => ({
      type: type as CatalogItemType,
      count,
    }))
    .sort((left, right) => right.count - left.count);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <section className="rounded-lg border border-dark-border bg-dark-card p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-green">
          Repository-Driven Codex Catalog
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-dark-text">
          CodexDepot
        </h1>
        <p className="mb-6 max-w-3xl text-sm text-dark-muted">
          Discover and contribute Codex Skills, Agents, Commands, Templates, Hooks,
          and Settings. Source of truth is GitHub content plus generated static indexes.
        </p>

        <form action="/browse" className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            name="q"
            placeholder="Search by keyword, tag, or compatibility..."
            className="w-full rounded border border-dark-border bg-dark-bg px-4 py-2 text-sm text-dark-text outline-none transition focus:border-accent-green"
          />
          <button
            type="submit"
            className="rounded border border-accent-green bg-accent-green/10 px-4 py-2 text-sm font-semibold text-accent-green transition hover:bg-accent-green/20"
          >
            Browse Catalog
          </button>
        </form>

        <div className="mb-5 flex flex-wrap gap-2">
          <a
            href={`https://github.com/${repository}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={badgeUrls.stars}
              alt="GitHub stars badge"
              width={146}
              height={28}
              unoptimized
            />
          </a>
          <a
            href={`https://github.com/${repository}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={badgeUrls.license}
              alt="License badge"
              width={146}
              height={28}
              unoptimized
            />
          </a>
          <Image
            src={badgeUrls.items}
            alt="Validated items badge"
            width={120}
            height={28}
            unoptimized
          />
          <a href="/cli">
            <Image
              src={badgeUrls.cli}
              alt="CLI version badge"
              width={110}
              height={28}
              unoptimized
            />
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-dark-border bg-dark-bg px-3 py-1 text-xs text-dark-muted">
            GitHub Source of Truth
          </span>
          <span className="rounded-full border border-dark-border bg-dark-bg px-3 py-1 text-xs text-dark-muted">
            Validated Items: {stats.totals.items}
          </span>
          <span className="rounded-full border border-dark-border bg-dark-bg px-3 py-1 text-xs text-dark-muted">
            No Database (MVP)
          </span>
          <span className="rounded-full border border-dark-border bg-dark-bg px-3 py-1 text-xs text-dark-muted">
            No Accounts/Auth (MVP)
          </span>
          <span className="rounded-full border border-dark-border bg-dark-bg px-3 py-1 text-xs text-dark-muted">
            Repo: {repository}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {typeCards.map((entry) => (
          <article
            key={entry.type}
            className="rounded-lg border border-dark-border bg-dark-card p-5"
          >
            <p className="text-xs uppercase tracking-wide text-dark-muted">
              {TYPE_LABELS[entry.type]}
            </p>
            <p className="mt-2 text-3xl font-semibold text-dark-text">{entry.count}</p>
            <Link
              href={`/browse?type=${entry.type}`}
              className="mt-4 inline-block text-xs font-semibold text-accent-green hover:underline"
            >
              Explore {TYPE_LABELS[entry.type]}
            </Link>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-dark-text">Latest Validated Items</h2>
          <Link
            href="/browse"
            className="rounded border border-dark-border px-3 py-1.5 text-xs font-semibold text-dark-muted transition hover:border-accent-green hover:text-accent-green"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {latestItems.map((item) => (
            <article
              key={item.id}
              className="rounded border border-dark-border bg-dark-bg p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full border border-dark-border bg-dark-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dark-muted">
                  {item.type}
                </span>
                <span className="text-[11px] text-dark-muted">{item.updated_at}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-dark-text">{item.title}</h3>
              <p className="mb-3 text-sm text-dark-muted">{item.summary}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={`${item.id}-${tag}`}
                    className="rounded-full border border-dark-border bg-dark-card px-2 py-0.5 text-[11px] text-dark-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={item.route}
                  className="rounded border border-accent-green bg-accent-green/10 px-3 py-1.5 text-xs font-semibold text-accent-green transition hover:bg-accent-green/20"
                >
                  Open Item
                </Link>
                <CopyButton
                  text={item.install_hint}
                  label="Copy Install"
                  analyticsId={item.id}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-dark-border bg-dark-card p-6">
        <h2 className="mb-3 text-xl font-semibold text-dark-text">Contribute</h2>
        <p className="mb-4 text-sm text-dark-muted">
          Add new content by opening a PR with files under `content/`. Automated checks
          validate schema, safety, and index integrity.
        </p>
        <Link
          href="/contribute"
          className="rounded border border-accent-green bg-accent-green/10 px-4 py-2 text-sm font-semibold text-accent-green transition hover:bg-accent-green/20"
        >
          Read Contribution Guide
        </Link>
      </section>
    </div>
  );
}
