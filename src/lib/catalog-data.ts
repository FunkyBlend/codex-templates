import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type {
  CatalogIndex,
  CatalogItem,
  CatalogItemType,
  SearchIndex,
  StatsIndex,
} from "@/lib/catalog-types";

const DATA_ROOT = path.join(process.cwd(), "public", "data");

const EMPTY_INDEX: CatalogIndex = {
  index_version: "1.0.0",
  generated_at: new Date(0).toISOString(),
  total_items: 0,
  source: {
    repository: "FunkyBlend/codex-templates",
    branch: "main",
  },
  items: [],
};

const EMPTY_SEARCH: SearchIndex = {
  index_version: "1.0.0",
  generated_at: new Date(0).toISOString(),
  total_records: 0,
  items: [],
};

const EMPTY_STATS: StatsIndex = {
  index_version: "1.0.0",
  generated_at: new Date(0).toISOString(),
  totals: {
    items: 0,
    by_type: {
      skill: 0,
      agent: 0,
      command: 0,
      template: 0,
      hook: 0,
      setting: 0,
    },
  },
  by_tag: {},
  by_compatibility: {},
};

async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_ROOT, fileName), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const getCatalogIndex = cache(async (): Promise<CatalogIndex> => {
  return readJson<CatalogIndex>("index.json", EMPTY_INDEX);
});

export const getSearchIndex = cache(async (): Promise<SearchIndex> => {
  return readJson<SearchIndex>("search.json", EMPTY_SEARCH);
});

export const getStatsIndex = cache(async (): Promise<StatsIndex> => {
  return readJson<StatsIndex>("stats.json", EMPTY_STATS);
});

export async function getAllCatalogItems(): Promise<CatalogItem[]> {
  return (await getCatalogIndex()).items;
}

export async function getCatalogItem(
  type: CatalogItemType,
  slug: string,
): Promise<CatalogItem | null> {
  const items = await getAllCatalogItems();
  return items.find((item) => item.type === type && item.slug === slug) ?? null;
}
