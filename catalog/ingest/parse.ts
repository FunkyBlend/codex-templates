import fs from "fs";
import path from "path";
import matter from "gray-matter";
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
}

function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

// Check if a path is matched by simple include paths
// Real implementation might use minimatch, but for Phase 1 we use basic substring or regex.
// Since the instruction says "finds SKILL.md files", we can just walk all subdirs and optionally filter.
function matchesInclude(relativePath: string, includePaths?: string[]): boolean {
  if (!includePaths || includePaths.length === 0) return true;
  
  // Very naive glob support for `skills/.curated/**` -> `skills/.curated/`
  return includePaths.some(pattern => {
    const prefix = pattern.replace('/**', '').replace('/*', '');
    // Using startsWith for simple path matching
    // Replace backslashes with forward slashes for matching
    const posixPath = relativePath.split(path.sep).join('/');
    return posixPath.startsWith(prefix);
  });
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

import { execSync } from "child_process";

export function parseSourceSkills(source: Source, sourcePath: string): CatalogItem[] {
  console.log(`Scanning ${source.id} for skills...`);
  const skillFiles = findSkillFiles(sourcePath, sourcePath, source.include_paths);
  const items: CatalogItem[] = [];
  
  let commitHash = "";
  try {
    commitHash = execSync("git rev-parse HEAD", { cwd: sourcePath, encoding: "utf-8" }).trim();
  } catch (err) {
    console.warn("Could not get git commit hash for", sourcePath);
  }

  for (const file of skillFiles) {
    const fileContent = fs.readFileSync(file, "utf-8");
    const parsed = matter(fileContent);
    const { name, description, tags } = parsed.data;

    // Skip if invalid frontmatter (missing name or description)
    if (!name || !description) {
      console.warn(`Warning: Missing name or description in ${file}. Skipping.`);
      continue;
    }

    const nameTruncated = name.length > 80 ? name.substring(0, 80) : name;
    const descTruncated = description.length > 280 ? description.substring(0, 280) : description;

    const slug = kebabCase(nameTruncated);
    const id = `${source.id}:${slug}`;
    const skillDirPath = path.dirname(file);
    const relativePath = path.relative(sourcePath, skillDirPath).split(path.sep).join('/');

    // Validate Layout
    const hasScripts = fs.existsSync(path.join(skillDirPath, "scripts"));
    const hasReferences = fs.existsSync(path.join(skillDirPath, "references"));
    const hasAssets = fs.existsSync(path.join(skillDirPath, "assets"));
    const hasOpenaiYaml = fs.existsSync(path.join(skillDirPath, "agents", "openai.yaml"));

    // Detect License
    const license = detectLicense(skillDirPath, sourcePath);

    // Scan Risk
    const risk = scanSkillDirectory(skillDirPath);

    const itemTags = Array.isArray(tags) ? tags : [];

    const install = source.install_hint ? [{
      method: "codex_skill_installer",
      hint: `$${source.install_hint} install ${source.repo}/tree/${source.ref}/${relativePath}`
    }] : [];

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
        path: relativePath
      },
      license,
      layout: {
        has_scripts: hasScripts,
        has_references: hasReferences,
        has_assets: hasAssets,
        has_openai_yaml: hasOpenaiYaml
      },
      risk,
      tags: itemTags,
      install
    });
  }

  return items;
}