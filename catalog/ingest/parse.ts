import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import matter from "gray-matter";
import yaml from "yaml";
import { Source } from "./discover";
import { detectLicense } from "./validators";
import { scanSkillDirectory } from "./scanners";

// A basic type for the output JSON
export interface CatalogItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  trust: "A" | "B" | "C";
  source: {
    repo: string;
    ref: string;
    commit?: string;
    path: string;
  };
  license: {
    spdx: string;
    file: string;
  };
  layout: {
    has_scripts: boolean;
    has_references: boolean;
    has_assets: boolean;
    has_openai_yaml: boolean;
  };
  risk: {
    level: "low" | "medium" | "high";
    flags: string[];
  };
  install?: { method: string; hint: string }[];
  tags?: string[];
  version?: string;
  tools?: string[];
  inputs?: unknown;
  outputs?: unknown;
  openai_meta?: unknown;
}

function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

const globRegexCache = new Map<string, RegExp>();

function globToRegExp(globPattern: string): RegExp {
  const normalized = globPattern.replace(/\\/g, "/");
  const cached = globRegexCache.get(normalized);
  if (cached) return cached;

  let regex = "^";
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (char === "*") {
      const next = normalized[i + 1];
      if (next === "*") {
        regex += ".*";
        i++;
      } else {
        regex += "[^/]*";
      }
      continue;
    }

    if (char === "?") {
      regex += "[^/]";
      continue;
    }

    if (/[\\^$+?.()|{}\[\]]/.test(char)) {
      regex += `\\${char}`;
    } else {
      regex += char;
    }
  }

  regex += "$";
  const compiled = new RegExp(regex);
  globRegexCache.set(normalized, compiled);
  return compiled;
}

function matchesInclude(relativePath: string, includePaths?: string[]): boolean {
  if (!includePaths || includePaths.length === 0) return true;

  const posixPath = relativePath.split(path.sep).join("/");
  return includePaths.some((pattern) => globToRegExp(pattern).test(posixPath));
}

function hasYamlFrontmatter(fileContent: string): boolean {
  return /^---\s*\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.test(fileContent);
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? value.substring(0, maxLength) : value;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function readOpenAiMeta(skillDirPath: string): unknown {
  const openAiMetaPath = path.join(skillDirPath, "agents", "openai.yaml");
  if (!fs.existsSync(openAiMetaPath)) return undefined;

  try {
    const content = fs.readFileSync(openAiMetaPath, "utf-8");
    return yaml.parse(content);
  } catch (error) {
    console.warn(`Warning: Failed to parse ${openAiMetaPath}. Ignoring openai_meta.`);
    return undefined;
  }
}

function findSkillFiles(dir: string, baseDir: string, includePaths?: string[]): string[] {
  let results: string[] = [];
  
  if (!fs.existsSync(dir)) return results;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Ignore common hidden dirs like .git (but not .curated etc.)
    if (entry.isDirectory() && entry.name === '.git') {
      continue;
    }
    
    if (entry.isDirectory()) {
      results = results.concat(findSkillFiles(fullPath, baseDir, includePaths));
    } else if (entry.isFile() && (entry.name === "SKILL.md" || entry.name === "skill.md")) {
      // Check if the directory matches includePaths
      const relativeDirPath = path.relative(baseDir, dir);
      if (matchesInclude(relativeDirPath, includePaths)) {
         results.push(fullPath);
      }
    }
  }
  
  return results;
}

export function parseSourceSkills(source: Source, sourcePath: string): CatalogItem[] {
  console.log(`Scanning ${source.id} for skills...`);
  const skillFiles = findSkillFiles(sourcePath, sourcePath, source.include_paths);
  const items: CatalogItem[] = [];
  
  let commitHash = "";
  if (fs.existsSync(path.join(sourcePath, ".git"))) {
    try {
      commitHash = execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: sourcePath,
        encoding: "utf-8",
      }).trim();
    } catch (err) {
      console.warn("Could not get git commit hash for", sourcePath);
    }
  }

  for (const file of skillFiles) {
    try {
      const fileContent = fs.readFileSync(file, "utf-8");
      if (!hasYamlFrontmatter(fileContent)) {
        console.warn(`Warning: Missing YAML frontmatter in ${file}. Skipping.`);
        continue;
      }

      const parsed = matter(fileContent);
      const rawName = parsed.data?.name;
      const rawDescription = parsed.data?.description;
      const name = typeof rawName === "string" ? rawName.trim() : "";
      const description = typeof rawDescription === "string" ? rawDescription.trim() : "";

      if (!name || !description) {
        console.warn(`Warning: Missing name or description in ${file}. Skipping.`);
        continue;
      }

      const nameTruncated = truncate(name, 80);
      const descTruncated = truncate(description, 280);
      const slug = kebabCase(nameTruncated);
      if (!slug) {
        console.warn(`Warning: Generated empty slug for ${file}. Skipping.`);
        continue;
      }

      const id = `${source.id}:${slug}`;
      const skillDirPath = path.dirname(file);
      const relativePath = path.relative(sourcePath, skillDirPath).split(path.sep).join("/");

      // Validate Layout
      const hasScripts = fs.existsSync(path.join(skillDirPath, "scripts"));
      const hasReferences = fs.existsSync(path.join(skillDirPath, "references"));
      const hasAssets = fs.existsSync(path.join(skillDirPath, "assets"));
      const hasOpenaiYaml = fs.existsSync(path.join(skillDirPath, "agents", "openai.yaml"));

      // Detect License
      const license = detectLicense(skillDirPath, sourcePath);

      // Scan Risk
      const risk = scanSkillDirectory(skillDirPath);

      const itemTags = toStringArray(parsed.data?.tags);
      const itemTools = toStringArray(parsed.data?.tools);
      const itemVersion =
        typeof parsed.data?.version === "string" ? parsed.data.version.trim() : undefined;
      const openaiMeta = readOpenAiMeta(skillDirPath);

      const install: { method: string; hint: string }[] = [];
      if (source.install_hint) {
        install.push({
          method: "codex_skill_installer",
          hint: `$${source.install_hint} install ${source.repo}/tree/${source.ref}/${relativePath}`,
        });
      }

      install.push({
        method: "manual_copy",
        hint: "Copy this skill directory into .agents/skills in your target repository.",
      });

      items.push({
        id,
        name: nameTruncated,
        slug,
        description: descTruncated,
        trust: source.trust,
        source: {
          repo: source.repo,
          ref: source.ref,
          commit: commitHash || undefined,
          path: relativePath,
        },
        license,
        layout: {
          has_scripts: hasScripts,
          has_references: hasReferences,
          has_assets: hasAssets,
          has_openai_yaml: hasOpenaiYaml,
        },
        risk,
        tags: itemTags,
        install,
        version: itemVersion,
        tools: itemTools.length > 0 ? itemTools : undefined,
        inputs: parsed.data?.inputs,
        outputs: parsed.data?.outputs,
        openai_meta: openaiMeta,
      });
    } catch (error) {
      console.warn(`Warning: Failed to parse ${file}. Skipping this skill.`);
    }
  }

  return items;
}
