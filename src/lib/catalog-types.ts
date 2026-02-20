export type CatalogItemType =
  | "skill"
  | "agent"
  | "command"
  | "template"
  | "hook"
  | "setting";

export interface CatalogItem {
  id: string;
  type: CatalogItemType;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  author: string;
  license: string;
  compatibility: string[];
  updated_at: string;
  created_at?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  safety_notes?: string;
  source_url?: string;
  content_version: string;
  content_path: string;
  raw_url: string;
  repo_url: string;
  route: string;
  install_hint: string;
  render_excerpt: string;
  body: string;
  template_version?: string;
  install_path?: string;
  entry_files?: string[];
}

export interface CatalogIndex {
  index_version: string;
  generated_at: string;
  total_items: number;
  source: {
    repository: string;
    branch: string;
  };
  items: CatalogItem[];
}

export interface SearchRecord {
  id: string;
  type: CatalogItemType;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  compatibility: string[];
  author: string;
  route: string;
  updated_at: string;
  tokens: string[];
}

export interface SearchIndex {
  index_version: string;
  generated_at: string;
  total_records: number;
  items: SearchRecord[];
}

export interface StatsIndex {
  index_version: string;
  generated_at: string;
  totals: {
    items: number;
    by_type: Record<CatalogItemType, number>;
  };
  by_tag: Record<string, number>;
  by_compatibility: Record<string, number>;
}
