"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  CatalogItem,
  CatalogItemType,
  SearchRecord,
} from "@/lib/catalog-types";
import { CopyButton } from "@/components/CopyButton";

interface BrowseClientProps {
  items: CatalogItem[];
  searchRecords: SearchRecord[];
}

const TYPE_ORDER: CatalogItemType[] = [
  "skill",
  "agent",
  "command",
  "template",
  "hook",
  "setting",
];

function parseMultiValue(input: string | null): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function toTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function BrowseClient({ items, searchRecords }: BrowseClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const qFromUrl = searchParams.get("q") ?? "";
  const selectedTypes = parseMultiValue(searchParams.get("type"));
  const selectedTags = parseMultiValue(searchParams.get("tag"));
  const sortBy = searchParams.get("sort") ?? "newest";
  const [query, setQuery] = useState(qFromUrl);

  useEffect(() => {
    setQuery(qFromUrl);
  }, [qFromUrl]);

  const [isPending, startTransition] = useTransition();

  const updateSearchParams = (mutator: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams.toString());
    mutator(next);
    const nextValue = next.toString();
    startTransition(() => {
      router.replace(nextValue ? `${pathname}?${nextValue}` : pathname, { scroll: false });
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearchParams((params) => {
        if (query.trim()) {
          params.set("q", query.trim());
        } else {
          params.delete("q");
        }
      });
    }, 140);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 24)
      .map(([tag]) => tag);
  }, [items]);

  const filteredItems = useMemo(() => {
    const queryLower = query.toLowerCase().trim();
    const queryTokens = queryLower
      .split(/[^a-z0-9-]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 1);
    const searchMap = new Map(searchRecords.map((record) => [record.id, record]));

    const filtered = items.filter((item) => {
      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);
      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => item.tags.includes(tag));

      const record = searchMap.get(item.id);
      const tokenMatch =
        queryTokens.length === 0 ||
        queryTokens.every((token) =>
          (record?.tokens ?? []).some((candidate) => candidate.includes(token)),
        );

      const searchMatch =
        queryLower.length === 0 ||
        tokenMatch ||
        item.title.toLowerCase().includes(queryLower) ||
        item.summary.toLowerCase().includes(queryLower) ||
        item.tags.some((tag) => tag.includes(queryLower)) ||
        item.compatibility.some((compat) => compat.includes(queryLower));

      return typeMatch && tagMatch && searchMatch;
    });

    filtered.sort((left, right) => {
      if (sortBy === "title") {
        return left.title.localeCompare(right.title);
      }
      if (sortBy === "updated") {
        return right.updated_at.localeCompare(left.updated_at);
      }
      return right.updated_at.localeCompare(left.updated_at);
    });

    return filtered;
  }, [items, query, searchRecords, selectedTags, selectedTypes, sortBy]);

  const toggleMultiValue = (key: "type" | "tag", value: string) => {
    updateSearchParams((params) => {
      const existing = parseMultiValue(params.get(key));
      const nextValues = existing.includes(value)
        ? existing.filter((entry) => entry !== value)
        : [...existing, value];
      if (nextValues.length === 0) {
        params.delete(key);
      } else {
        params.set(key, nextValues.join(","));
      }
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="rounded-lg border border-dark-border bg-dark-card p-6">
        <h1 className="mb-4 text-2xl font-bold text-dark-text">Browse Catalog</h1>
        <p className="mb-6 text-sm text-dark-muted">
          Local search runs against generated JSON (`index.json` + `search.json`).
        </p>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-dark-muted">
            Search
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, summary, tags, or compatibility..."
              className="rounded border border-dark-border bg-dark-bg px-3 py-2 text-sm text-dark-text outline-none transition focus:border-accent-green"
            />
          </label>

          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-dark-muted">
            Sort
            <select
              value={sortBy}
              onChange={(event) =>
                updateSearchParams((params) => {
                  params.set("sort", event.target.value);
                })
              }
              className="rounded border border-dark-border bg-dark-bg px-3 py-2 text-sm text-dark-text outline-none transition focus:border-accent-green"
            >
              <option value="newest">Newest</option>
              <option value="updated">Recently Updated</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-muted">
              Types
            </p>
            <div className="flex flex-wrap gap-2">
              {TYPE_ORDER.map((type) => {
                const active = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleMultiValue("type", type)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-accent-green bg-accent-green/10 text-accent-green"
                        : "border-dark-border bg-dark-bg text-dark-muted hover:border-dark-muted"
                    }`}
                  >
                    {toTitleCase(type)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-muted">
              Tags
            </p>
            <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto pr-2">
              {allTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleMultiValue("tag", tag)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-accent-green bg-accent-green/10 text-accent-green"
                        : "border-dark-border bg-dark-bg text-dark-muted hover:border-dark-muted"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-muted">
          Showing <span className="text-dark-text">{filteredItems.length}</span> of{" "}
          <span className="text-dark-text">{items.length}</span> items
        </p>
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="rounded border border-dark-border px-3 py-1 text-xs font-semibold text-dark-muted transition hover:border-accent-green hover:text-accent-green"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-dark-border bg-dark-card p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="rounded-full border border-dark-border bg-dark-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dark-muted">
                {item.type}
              </span>
              <span className="text-[11px] text-dark-muted">{item.updated_at}</span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-dark-text">{item.title}</h2>
            <p className="mb-3 text-sm text-dark-muted">{item.summary}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={`${item.id}-${tag}`}
                  className="rounded-full border border-dark-border bg-dark-bg px-2 py-0.5 text-[11px] text-dark-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={item.route}
                className="rounded border border-accent-green bg-accent-green/10 px-3 py-2 text-xs font-semibold text-accent-green transition hover:bg-accent-green/20"
              >
                View Item
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
    </div>
  );
}
