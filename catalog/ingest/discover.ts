import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import yaml from "yaml";

export interface Source {
  id: string;
  trust: "A" | "B" | "C";
  repo: string;
  ref: string;
  include_paths?: string[];
  install_hint?: string;
}

export interface Config {
  version: number;
  sources: Source[];
}

const SOURCE_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REF_RE = /^[A-Za-z0-9._/-]{1,120}$/;

function assertNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${fieldName}: expected non-empty string`);
  }
  return value.trim();
}

function validateRepo(repo: string): string {
  if (/[;&|`$<>]/.test(repo)) {
    throw new Error(`Invalid source.repo '${repo}': contains disallowed shell metacharacters`);
  }

  const isHttps = /^https:\/\/[^\s]+$/.test(repo);
  const isSsh = /^git@[^\s:]+:[^\s]+$/.test(repo);
  if (!isHttps && !isSsh) {
    throw new Error(
      `Invalid source.repo '${repo}': expected https://... or git@host:owner/repo(.git)`,
    );
  }

  return repo;
}

function validateRef(ref: string): string {
  if (!REF_RE.test(ref)) {
    throw new Error(`Invalid source.ref '${ref}': contains unsupported characters`);
  }

  if (ref.startsWith("/") || ref.endsWith("/") || ref.includes("//") || ref.includes("..")) {
    throw new Error(`Invalid source.ref '${ref}': malformed git ref`);
  }

  return ref;
}

function validateIncludePaths(includePaths: unknown): string[] | undefined {
  if (includePaths === undefined) return undefined;
  if (!Array.isArray(includePaths)) {
    throw new Error("Invalid source.include_paths: expected an array of strings");
  }

  return includePaths.map((rawPath, index) => {
    const value = assertNonEmptyString(rawPath, `source.include_paths[${index}]`);
    if (/[;&|`$<>]/.test(value)) {
      throw new Error(`Invalid include path '${value}': contains disallowed characters`);
    }
    return value;
  });
}

function validateSource(rawSource: unknown, index: number): Source {
  if (!rawSource || typeof rawSource !== "object") {
    throw new Error(`Invalid sources[${index}]: expected object`);
  }

  const sourceObj = rawSource as Record<string, unknown>;
  const id = assertNonEmptyString(sourceObj.id, `sources[${index}].id`);
  if (!SOURCE_ID_RE.test(id)) {
    throw new Error(
      `Invalid sources[${index}].id '${id}': expected lowercase kebab-case`,
    );
  }

  const trust = assertNonEmptyString(sourceObj.trust, `sources[${index}].trust`);
  if (!["A", "B", "C"].includes(trust)) {
    throw new Error(`Invalid sources[${index}].trust '${trust}': expected A, B, or C`);
  }

  const repo = validateRepo(assertNonEmptyString(sourceObj.repo, `sources[${index}].repo`));
  const ref = validateRef(assertNonEmptyString(sourceObj.ref, `sources[${index}].ref`));

  const includePaths = validateIncludePaths(sourceObj.include_paths);
  const installHint =
    sourceObj.install_hint === undefined
      ? undefined
      : assertNonEmptyString(sourceObj.install_hint, `sources[${index}].install_hint`);

  return {
    id,
    trust: trust as Source["trust"],
    repo,
    ref,
    include_paths: includePaths,
    install_hint: installHint,
  };
}

function runGit(args: string[], cwd?: string): void {
  const result = spawnSync("git", args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

export function loadConfig(configPath: string): Config {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const content = fs.readFileSync(configPath, "utf-8");
  const parsed = yaml.parse(content) as unknown;

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid sources config: expected top-level object");
  }

  const configObj = parsed as { version?: unknown; sources?: unknown };
  if (typeof configObj.version !== "number" || !Number.isInteger(configObj.version)) {
    throw new Error("Invalid sources config: 'version' must be an integer");
  }

  if (!Array.isArray(configObj.sources) || configObj.sources.length === 0) {
    throw new Error("Invalid sources config: 'sources' must be a non-empty array");
  }

  const sources = configObj.sources.map((source, index) => validateSource(source, index));

  return {
    version: configObj.version,
    sources,
  };
}

export function cloneSource(source: Source, cacheDir: string): string {
  const repoDirName = source.id;
  const targetPath = path.join(cacheDir, repoDirName);

  if (!fs.existsSync(targetPath)) {
    console.log(`Cloning ${source.repo} into ${targetPath}...`);
    // Create cache dir if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    // Clone depth 1 for speed
    runGit(["clone", "--depth", "1", "--branch", source.ref, source.repo, targetPath]);
  } else {
    if (!fs.existsSync(path.join(targetPath, ".git"))) {
      throw new Error(
        `Cache path exists but is not a git repository: ${targetPath}. Remove it and retry.`,
      );
    }

    console.log(`Source ${source.id} already cloned. Fetching latest...`);
    runGit(["fetch", "--depth", "1", "origin", source.ref], targetPath);
    runGit(["reset", "--hard", `origin/${source.ref}`], targetPath);
  }

  return targetPath;
}
