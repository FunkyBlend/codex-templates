import fs from "node:fs/promises";
import path from "node:path";
import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";

export type ItemType =
  | "skill"
  | "agent"
  | "command"
  | "template"
  | "hook"
  | "setting";

export interface CatalogItem {
  id: string;
  type: ItemType;
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
  type: ItemType;
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
    by_type: Record<ItemType, number>;
  };
  by_tag: Record<string, number>;
  by_compatibility: Record<string, number>;
}

export interface ValidationIssue {
  level: "error" | "warning";
  code: string;
  message: string;
  file?: string;
  item_id?: string;
}

export interface ValidationReport {
  generated_at: string;
  summary: {
    errors: number;
    warnings: number;
    items_validated: number;
  };
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface PipelineResult {
  index: CatalogIndex;
  search: SearchIndex;
  stats: StatsIndex;
  report: ValidationReport;
  hasErrors: boolean;
}

interface RepoSourceConfig {
  repository: string;
  owner: string;
  repo: string;
  branch: string;
  rawBaseUrl: string;
  blobBaseUrl: string;
  contentVersion: string;
}

interface TypeConfig {
  dir: string;
  requiredFile: string;
}

const ITEM_TYPE_ORDER: ItemType[] = [
  "skill",
  "agent",
  "command",
  "template",
  "hook",
  "setting",
];

const TYPE_CONFIG: Record<ItemType, TypeConfig> = {
  skill: { dir: "skills", requiredFile: "SKILL.md" },
  agent: { dir: "agents", requiredFile: "AGENT.md" },
  command: { dir: "commands", requiredFile: "COMMAND.md" },
  template: { dir: "templates", requiredFile: "item.yaml" },
  hook: { dir: "hooks", requiredFile: "hook.json" },
  setting: { dir: "settings", requiredFile: "settings.json" },
};

const COMMON_ALLOWED_EXT = new Set([
  ".md",
  ".mdx",
  ".yaml",
  ".yml",
  ".json",
  ".txt",
]);

const TEMPLATE_ALLOWED_EXT = new Set([
  ...Array.from(COMMON_ALLOWED_EXT),
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".html",
  ".sh",
  ".py",
  ".go",
  ".rs",
  ".toml",
  ".ini",
  ".env",
  ".sql",
  ".lock",
]);

const ALLOWED_BASENAMES = new Set([
  "Dockerfile",
  "Makefile",
  ".gitignore",
  ".npmrc",
  ".editorconfig",
  ".env.example",
  "LICENSE",
]);

const DANGEROUS_PATTERNS: Array<{ code: string; regex: RegExp; message: string }> = [
  {
    code: "dangerous-curl-pipe-shell",
    regex: /\bcurl\b[^\n|]*\|\s*(bash|sh)\b/i,
    message: "Detected curl piped directly into a shell.",
  },
  {
    code: "dangerous-wget-pipe-shell",
    regex: /\bwget\b[^\n|]*\|\s*(bash|sh)\b/i,
    message: "Detected wget piped directly into a shell.",
  },
  {
    code: "dangerous-powershell-encoded",
    regex: /\bpowershell(?:\.exe)?\b[^\n]*-(?:enc|encodedcommand)\b/i,
    message: "Detected encoded PowerShell execution.",
  },
  {
    code: "dangerous-invoke-expression",
    regex: /\b(?:invoke-expression|iex)\b/i,
    message: "Detected Invoke-Expression usage.",
  },
  {
    code: "dangerous-certutil-download",
    regex: /\bcertutil\b[^\n]*-urlcache\b[^\n]*-f\b/i,
    message: "Detected certutil download-and-execute style command.",
  },
];

const SECRET_PATTERNS: Array<{ code: string; regex: RegExp; message: string }> = [
  {
    code: "secret-openai-key",
    regex: /\bsk-[A-Za-z0-9]{20,}\b/g,
    message: "Potential OpenAI API key detected.",
  },
  {
    code: "secret-github-token",
    regex: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
    message: "Potential GitHub token detected.",
  },
  {
    code: "secret-aws-access-key",
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    message: "Potential AWS access key detected.",
  },
  {
    code: "secret-private-key",
    regex: /-----BEGIN (?:RSA|EC|DSA|OPENSSH) PRIVATE KEY-----/g,
    message: "Potential private key material detected.",
  },
  {
    code: "secret-slack-token",
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
    message: "Potential Slack token detected.",
  },
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toPosixPath(value: string): string {
  return value.replace(/\\/g, "/");
}

function isAllowedFilePath(itemType: ItemType, fileName: string): boolean {
  const baseName = path.basename(fileName);
  if (ALLOWED_BASENAMES.has(baseName) || baseName.endsWith(".example")) {
    return true;
  }

  const extension = path.extname(baseName).toLowerCase();
  if (!extension) {
    return false;
  }

  if (itemType === "template") {
    return TEMPLATE_ALLOWED_EXT.has(extension);
  }
  return COMMON_ALLOWED_EXT.has(extension);
}

function isProbablyBinary(buffer: Buffer): boolean {
  const sampleSize = Math.min(buffer.length, 4096);
  if (sampleSize === 0) return false;

  let suspiciousBytes = 0;
  for (let index = 0; index < sampleSize; index += 1) {
    const value = buffer[index];
    if (value === 0) {
      return true;
    }
    const isControl =
      (value < 7 || (value > 14 && value < 32)) &&
      value !== 9 &&
      value !== 10 &&
      value !== 13;
    if (isControl) {
      suspiciousBytes += 1;
    }
  }

  return suspiciousBytes / sampleSize > 0.3;
}

function parseScalar(input: string): string | boolean | number {
  const trimmed = input.trim();
  if (trimmed.length === 0) return "";

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);

  return trimmed;
}

function parseSimpleYaml(source: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = source.replace(/\r/g, "").split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyMatch) {
      throw new Error(`Invalid YAML line: ${line}`);
    }

    const [, key, rawValue] = keyMatch;
    if (rawValue === "") {
      const listValues: Array<string | boolean | number> = [];
      let cursor = index + 1;
      while (cursor < lines.length) {
        const listMatch = lines[cursor].match(/^\s*-\s+(.*)$/);
        if (!listMatch) break;
        listValues.push(parseScalar(listMatch[1]));
        cursor += 1;
      }

      if (listValues.length > 0) {
        result[key] = listValues;
        index = cursor - 1;
      } else {
        result[key] = "";
      }
      continue;
    }

    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      const inner = rawValue.slice(1, -1).trim();
      result[key] = inner
        ? inner.split(",").map((entry) => parseScalar(entry.trim()))
        : [];
      continue;
    }

    result[key] = parseScalar(rawValue);
  }

  return result;
}

function parseMarkdownFrontmatter(fileContent: string): {
  metadata: Record<string, unknown>;
  body: string;
} {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing or invalid frontmatter block.");
  }

  return {
    metadata: parseSimpleYaml(match[1]),
    body: match[2].trim(),
  };
}

function cleanTextForSearch(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildTokenSet(input: string): string[] {
  const tokens = input
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
  return Array.from(new Set(tokens)).slice(0, 300);
}

function createAjvValidator(schema: object): ValidateFunction {
  const ajv = new Ajv({
    allErrors: true,
  });
  return ajv.compile(schema);
}

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors || errors.length === 0) return [];
  return errors.map((error) => {
    const legacyError = error as ErrorObject & { dataPath?: string };
    const instancePath =
      ("instancePath" in error ? error.instancePath : legacyError.dataPath) || "/";
    return `${instancePath} ${error.message ?? "is invalid"}`.trim();
  });
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => String(entry).trim())
    .filter((entry) => entry.length > 0);
}

function getRepoConfig(): RepoSourceConfig {
  const repositoryEnv =
    process.env.CATALOG_REPO || process.env.GITHUB_REPOSITORY || "FunkyBlend/codex-templates";
  const [owner, repo] = repositoryEnv.split("/");
  const branch = process.env.CATALOG_BRANCH || process.env.GITHUB_REF_NAME || "main";
  const safeOwner = owner || "FunkyBlend";
  const safeRepo = repo || "codex-templates";
  const safeRepository = `${safeOwner}/${safeRepo}`;

  return {
    repository: safeRepository,
    owner: safeOwner,
    repo: safeRepo,
    branch,
    rawBaseUrl: `https://raw.githubusercontent.com/${safeOwner}/${safeRepo}/${branch}`,
    blobBaseUrl: `https://github.com/${safeOwner}/${safeRepo}/blob/${branch}`,
    contentVersion: process.env.CONTENT_VERSION || process.env.GITHUB_SHA || "local",
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function listDirectories(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function walkFiles(dirPath: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function isMarkdownType(itemType: ItemType): boolean {
  return itemType === "skill" || itemType === "agent" || itemType === "command";
}

function toValidationPath(rootDir: string, absolutePath: string): string {
  return toPosixPath(path.relative(rootDir, absolutePath));
}

function hasUsageSection(markdownBody: string): boolean {
  return /^##?\s+Usage\b/im.test(markdownBody);
}

function stringifyWithStableIndent(data: unknown): string {
  return `${JSON.stringify(data, null, 2)}\n`;
}

export async function runPipeline(rootDir = process.cwd()): Promise<PipelineResult> {
  const repoConfig = getRepoConfig();
  const generatedAt = new Date().toISOString();
  const contentRoot = path.join(rootDir, "content");
  const schemaRoot = path.join(rootDir, "schemas");

  const itemSchemaPath = path.join(schemaRoot, "item-frontmatter.schema.json");
  const templateSchemaPath = path.join(schemaRoot, "template.schema.json");
  const itemSchema = await readJsonFile<object>(itemSchemaPath);
  const templateSchema = await readJsonFile<object>(templateSchemaPath);

  const validateItem = createAjvValidator(itemSchema);
  const validateTemplate = createAjvValidator(templateSchema);

  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const items: CatalogItem[] = [];

  const idMap = new Map<string, string>();
  const routeMap = new Map<string, string>();
  const titleMap = new Map<string, string>();

  const pushIssue = (issue: ValidationIssue): void => {
    if (issue.level === "error") {
      errors.push(issue);
    } else {
      warnings.push(issue);
    }
  };

  for (const itemType of ITEM_TYPE_ORDER) {
    const typeConfig = TYPE_CONFIG[itemType];
    const typeRoot = path.join(contentRoot, typeConfig.dir);
    let slugs: string[] = [];

    try {
      slugs = await listDirectories(typeRoot);
    } catch {
      pushIssue({
        level: "error",
        code: "missing-type-folder",
        message: `Missing content folder: content/${typeConfig.dir}`,
        file: toPosixPath(path.join("content", typeConfig.dir)),
      });
      continue;
    }

    slugs.sort((left, right) => left.localeCompare(right));

    for (const slug of slugs) {
      const itemDir = path.join(typeRoot, slug);
      if (!SLUG_PATTERN.test(slug)) {
        pushIssue({
          level: "error",
          code: "invalid-slug",
          message: `Slug "${slug}" must be lowercase kebab-case.`,
          file: toValidationPath(rootDir, itemDir),
        });
        continue;
      }

      const requiredFilePath = path.join(itemDir, typeConfig.requiredFile);
      try {
        await fs.access(requiredFilePath);
      } catch {
        pushIssue({
          level: "error",
          code: "missing-required-file",
          message: `Missing required file ${typeConfig.requiredFile}.`,
          file: toValidationPath(rootDir, itemDir),
        });
        continue;
      }

      const itemFiles = await walkFiles(itemDir);
      const dangerousMatchesForItem: string[] = [];
      let hasSecretMatch = false;

      for (const absoluteFilePath of itemFiles) {
        const relativeFilePath = toValidationPath(rootDir, absoluteFilePath);

        if (!isAllowedFilePath(itemType, absoluteFilePath)) {
          pushIssue({
            level: "error",
            code: "disallowed-file-type",
            message: `File type not allowed for ${itemType} items.`,
            file: relativeFilePath,
          });
        }

        const buffer = await fs.readFile(absoluteFilePath);
        if (isProbablyBinary(buffer)) {
          pushIssue({
            level: "error",
            code: "binary-file-detected",
            message: "Binary file detected in content directory.",
            file: relativeFilePath,
          });
          continue;
        }

        const textContent = buffer.toString("utf8");

        for (const pattern of DANGEROUS_PATTERNS) {
          if (pattern.regex.test(textContent)) {
            dangerousMatchesForItem.push(pattern.code);
            pushIssue({
              level: "warning",
              code: pattern.code,
              message: pattern.message,
              file: relativeFilePath,
            });
          }
        }

        for (const secretPattern of SECRET_PATTERNS) {
          secretPattern.regex.lastIndex = 0;
          if (secretPattern.regex.test(textContent)) {
            hasSecretMatch = true;
            pushIssue({
              level: "error",
              code: secretPattern.code,
              message: secretPattern.message,
              file: relativeFilePath,
            });
          }
        }
      }

      if (hasSecretMatch) {
        continue;
      }

      let metadata: Record<string, unknown> = {};
      let body = "";

      try {
        if (isMarkdownType(itemType)) {
          const markdown = await fs.readFile(requiredFilePath, "utf8");
          const parsed = parseMarkdownFrontmatter(markdown);
          metadata = parsed.metadata;
          body = parsed.body;
          if (!hasUsageSection(body)) {
            pushIssue({
              level: "error",
              code: "missing-usage-section",
              message: "Markdown item body must include a Usage section.",
              file: toValidationPath(rootDir, requiredFilePath),
            });
          }
        } else if (itemType === "template") {
          const yamlRaw = await fs.readFile(requiredFilePath, "utf8");
          metadata = parseSimpleYaml(yamlRaw);
          const readmePath = path.join(itemDir, "README.md");
          try {
            body = (await fs.readFile(readmePath, "utf8")).trim();
          } catch {
            body = "";
            pushIssue({
              level: "warning",
              code: "template-readme-missing",
              message: "Template README.md is recommended for detail page documentation.",
              file: toValidationPath(rootDir, itemDir),
            });
          }

          const filesDir = path.join(itemDir, "files");
          try {
            const templateFiles = await walkFiles(filesDir);
            if (templateFiles.length === 0) {
              pushIssue({
                level: "error",
                code: "template-files-empty",
                message: "Template files directory must contain at least one file.",
                file: toValidationPath(rootDir, filesDir),
              });
            }
          } catch {
            pushIssue({
              level: "error",
              code: "template-files-missing",
              message: "Template requires a files/ directory.",
              file: toValidationPath(rootDir, itemDir),
            });
          }
        } else if (itemType === "hook" || itemType === "setting") {
          const jsonRaw = await fs.readFile(requiredFilePath, "utf8");
          metadata = JSON.parse(jsonRaw) as Record<string, unknown>;
          const readmePath = path.join(itemDir, "README.md");
          body = (await fs.readFile(readmePath, "utf8")).trim();
        }
      } catch (error) {
        pushIssue({
          level: "error",
          code: "metadata-parse-error",
          message: `Failed to parse metadata: ${(error as Error).message}`,
          file: toValidationPath(rootDir, requiredFilePath),
        });
        continue;
      }

      const validator = itemType === "template" ? validateTemplate : validateItem;
      if (!validator(metadata)) {
        const schemaErrors = formatAjvErrors(validator.errors);
        for (const schemaError of schemaErrors) {
          pushIssue({
            level: "error",
            code: "schema-validation-error",
            message: schemaError,
            file: toValidationPath(rootDir, requiredFilePath),
          });
        }
        continue;
      }

      const expectedId = `${itemType}.${slug}`;
      const actualId = String(metadata.id ?? "");
      const actualType = String(metadata.type ?? "");
      const title = String(metadata.title ?? "");

      if (actualType !== itemType) {
        pushIssue({
          level: "error",
          code: "type-mismatch",
          message: `Metadata type "${actualType}" does not match folder type "${itemType}".`,
          file: toValidationPath(rootDir, requiredFilePath),
        });
        continue;
      }

      if (actualId !== expectedId) {
        pushIssue({
          level: "error",
          code: "id-slug-mismatch",
          message: `Expected id "${expectedId}" but found "${actualId}".`,
          file: toValidationPath(rootDir, requiredFilePath),
        });
        continue;
      }

      if (dangerousMatchesForItem.length > 0 && !metadata.safety_notes) {
        pushIssue({
          level: "error",
          code: "missing-safety-notes",
          message:
            "Dangerous pattern detected but safety_notes is missing in metadata.",
          file: toValidationPath(rootDir, requiredFilePath),
        });
      }

      if (itemType === "hook") {
        if (!metadata.trigger || !metadata.runtime || !Array.isArray(metadata.permissions)) {
          pushIssue({
            level: "error",
            code: "hook-fields-missing",
            message: "Hook requires trigger, runtime, and permissions fields.",
            file: toValidationPath(rootDir, requiredFilePath),
          });
        }
      }

      if (itemType === "setting") {
        if (!metadata.target_tool || !metadata.schema_version) {
          pushIssue({
            level: "error",
            code: "setting-fields-missing",
            message: "Setting requires target_tool and schema_version fields.",
            file: toValidationPath(rootDir, requiredFilePath),
          });
        }
      }

      const route = `/items/${itemType}/${slug}`;

      if (idMap.has(actualId)) {
        pushIssue({
          level: "error",
          code: "duplicate-id",
          message: `Duplicate id "${actualId}" also used by ${idMap.get(actualId)}.`,
          file: toValidationPath(rootDir, requiredFilePath),
        });
      } else {
        idMap.set(actualId, toValidationPath(rootDir, requiredFilePath));
      }

      if (routeMap.has(route)) {
        pushIssue({
          level: "error",
          code: "duplicate-route",
          message: `Duplicate route "${route}" also used by ${routeMap.get(route)}.`,
          file: toValidationPath(rootDir, requiredFilePath),
        });
      } else {
        routeMap.set(route, toValidationPath(rootDir, requiredFilePath));
      }

      const normalizedTitle = title.toLowerCase().trim();
      if (titleMap.has(normalizedTitle)) {
        pushIssue({
          level: "warning",
          code: "duplicate-title-similarity",
          message: `Title "${title}" is very similar to ${titleMap.get(normalizedTitle)}.`,
          file: toValidationPath(rootDir, requiredFilePath),
        });
      } else {
        titleMap.set(normalizedTitle, toValidationPath(rootDir, requiredFilePath));
      }

      const relativeRequiredFile = toPosixPath(path.relative(rootDir, requiredFilePath));
      const summaryText = String(metadata.summary ?? "");
      const cleanedBody = cleanTextForSearch(body);
      const excerpt = cleanedBody || summaryText;

      const catalogItem: CatalogItem = {
        id: actualId,
        type: itemType,
        slug,
        title,
        summary: summaryText,
        tags: normalizeStringArray(metadata.tags).map((tag) => tag.toLowerCase()),
        author: String(metadata.author ?? ""),
        license: String(metadata.license ?? ""),
        compatibility: normalizeStringArray(metadata.compatibility).map((value) =>
          value.toLowerCase(),
        ),
        updated_at: String(metadata.updated_at ?? ""),
        created_at: metadata.created_at ? String(metadata.created_at) : undefined,
        difficulty: metadata.difficulty
          ? (String(metadata.difficulty) as CatalogItem["difficulty"])
          : undefined,
        safety_notes: metadata.safety_notes ? String(metadata.safety_notes) : undefined,
        source_url: metadata.source_url ? String(metadata.source_url) : undefined,
        content_version: repoConfig.contentVersion,
        content_path: relativeRequiredFile,
        raw_url: `${repoConfig.rawBaseUrl}/${relativeRequiredFile}`,
        repo_url: `${repoConfig.blobBaseUrl}/${relativeRequiredFile}`,
        route,
        install_hint: `codexdepot install ${itemType} ${slug}`,
        render_excerpt: excerpt.slice(0, 220),
        body,
        template_version: metadata.template_version
          ? String(metadata.template_version)
          : undefined,
        install_path: metadata.install_path ? String(metadata.install_path) : undefined,
        entry_files: metadata.entry_files
          ? normalizeStringArray(metadata.entry_files)
          : undefined,
      };

      items.push(catalogItem);
    }
  }

  items.sort((left, right) => {
    if (left.type !== right.type) {
      return ITEM_TYPE_ORDER.indexOf(left.type) - ITEM_TYPE_ORDER.indexOf(right.type);
    }
    return left.slug.localeCompare(right.slug);
  });

  const index: CatalogIndex = {
    index_version: "1.0.0",
    generated_at: generatedAt,
    total_items: items.length,
    source: {
      repository: repoConfig.repository,
      branch: repoConfig.branch,
    },
    items,
  };

  const searchItems: SearchRecord[] = items.map((item) => {
    const tokenInput = [
      item.title,
      item.summary,
      item.tags.join(" "),
      item.compatibility.join(" "),
      item.author,
      cleanTextForSearch(item.body).slice(0, 400),
    ].join(" ");
    return {
      id: item.id,
      type: item.type,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      tags: item.tags,
      compatibility: item.compatibility,
      author: item.author,
      route: item.route,
      updated_at: item.updated_at,
      tokens: buildTokenSet(tokenInput),
    };
  });

  const byType = ITEM_TYPE_ORDER.reduce<Record<ItemType, number>>((accumulator, itemType) => {
    accumulator[itemType] = 0;
    return accumulator;
  }, {} as Record<ItemType, number>);

  const byTag: Record<string, number> = {};
  const byCompatibility: Record<string, number> = {};

  for (const item of items) {
    byType[item.type] += 1;
    for (const tag of item.tags) {
      byTag[tag] = (byTag[tag] || 0) + 1;
    }
    for (const compatibility of item.compatibility) {
      byCompatibility[compatibility] = (byCompatibility[compatibility] || 0) + 1;
    }
  }

  const stats: StatsIndex = {
    index_version: "1.0.0",
    generated_at: generatedAt,
    totals: {
      items: items.length,
      by_type: byType,
    },
    by_tag: Object.fromEntries(
      Object.entries(byTag).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])),
    ),
    by_compatibility: Object.fromEntries(
      Object.entries(byCompatibility).sort(
        (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
      ),
    ),
  };

  const search: SearchIndex = {
    index_version: "1.0.0",
    generated_at: generatedAt,
    total_records: searchItems.length,
    items: searchItems,
  };

  const report: ValidationReport = {
    generated_at: generatedAt,
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      items_validated: items.length,
    },
    errors,
    warnings,
  };

  return {
    index,
    search,
    stats,
    report,
    hasErrors: errors.length > 0,
  };
}

export async function writeValidationReport(
  result: PipelineResult,
  rootDir = process.cwd(),
): Promise<void> {
  const artifactsDir = path.join(rootDir, "artifacts");
  await fs.mkdir(artifactsDir, { recursive: true });
  await fs.writeFile(
    path.join(artifactsDir, "validation-report.json"),
    stringifyWithStableIndent(result.report),
    "utf8",
  );
}

async function assertFileMatches(
  filePath: string,
  expectedContent: string,
  label: string,
): Promise<void> {
  let currentContent = "";
  try {
    currentContent = await fs.readFile(filePath, "utf8");
  } catch {
    throw new Error(`${label} is missing. Run npm run build:index.`);
  }

  const stripGeneratedAt = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map((entry) => stripGeneratedAt(entry));
    }
    if (value && typeof value === "object") {
      const objectEntries = Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "generated_at" && key !== "content_version")
        .map(([key, entryValue]) => [key, stripGeneratedAt(entryValue)]);
      return Object.fromEntries(objectEntries);
    }
    return value;
  };

  try {
    const currentJson = stripGeneratedAt(JSON.parse(currentContent));
    const expectedJson = stripGeneratedAt(JSON.parse(expectedContent));
    if (JSON.stringify(currentJson) !== JSON.stringify(expectedJson)) {
      throw new Error(`${label} is out of date. Run npm run build:index.`);
    }
    return;
  } catch {
    if (currentContent !== expectedContent) {
      throw new Error(`${label} is out of date. Run npm run build:index.`);
    }
  }
}

export async function writeCatalogOutputs(
  result: PipelineResult,
  options?: {
    check?: boolean;
    rootDir?: string;
    includeIndex?: boolean;
    includeSearch?: boolean;
    includeStats?: boolean;
  },
): Promise<void> {
  const rootDir = options?.rootDir ?? process.cwd();
  const check = options?.check ?? false;
  const includeIndex = options?.includeIndex ?? true;
  const includeSearch = options?.includeSearch ?? true;
  const includeStats = options?.includeStats ?? true;
  const dataDir = path.join(rootDir, "public", "data");
  await fs.mkdir(dataDir, { recursive: true });
  await writeValidationReport(result, rootDir);

  if (includeIndex) {
    const indexPath = path.join(dataDir, "index.json");
    const indexContent = stringifyWithStableIndent(result.index);
    if (check) {
      await assertFileMatches(indexPath, indexContent, "public/data/index.json");
    } else {
      await fs.writeFile(indexPath, indexContent, "utf8");
    }
  }

  if (includeSearch) {
    const searchPath = path.join(dataDir, "search.json");
    const searchContent = stringifyWithStableIndent(result.search);
    if (check) {
      await assertFileMatches(searchPath, searchContent, "public/data/search.json");
    } else {
      await fs.writeFile(searchPath, searchContent, "utf8");
    }
  }

  if (includeStats) {
    const statsPath = path.join(dataDir, "stats.json");
    const statsContent = stringifyWithStableIndent(result.stats);
    if (check) {
      await assertFileMatches(statsPath, statsContent, "public/data/stats.json");
    } else {
      await fs.writeFile(statsPath, statsContent, "utf8");
    }
  }
}
