import fs from "fs";
import path from "path";
import yaml from "yaml";
import { loadConfig, cloneSource } from "./discover";
import { parseSourceSkills, CatalogItem } from "./parse";
import { validateCatalogItems } from "./validators";

const CONFIG_PATH = path.resolve(__dirname, "..", "sources.yaml");
const ALLOWLIST_PATH = path.resolve(__dirname, "..", "allowlist.yaml");
const BLOCKLIST_PATH = path.resolve(__dirname, "..", "blocklist.yaml");
const SCHEMA_PATH = path.resolve(__dirname, "..", "schemas", "catalog.schema.json");
const CACHE_DIR = path.resolve(__dirname, "..", "..", ".cache", "ingest");
const DEFAULT_OUTPUT_FILE = path.resolve(__dirname, "..", "..", "public", "data", "catalog.json");
const DEFAULT_CANDIDATES_FILE = path.resolve(
  __dirname,
  "..",
  "..",
  "public",
  "data",
  "catalog.candidates.json",
);

interface CandidateItem {
  id: string;
  trust: "A" | "B" | "C";
  reasons: string[];
  item: CatalogItem;
}

interface CliOptions {
  dryRun: boolean;
  allowPartial: boolean;
  outputFile: string;
  candidatesFile: string;
}

function loadYaml(filePath: string): unknown {
  if (!fs.existsSync(filePath)) return null;
  return yaml.parse(fs.readFileSync(filePath, "utf-8"));
}

function parseBooleanEnv(name: string): boolean {
  const value = process.env[name]?.toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function parseCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  const dryRun =
    args.includes("--dry-run") ||
    parseBooleanEnv("npm_config_dry_run") ||
    parseBooleanEnv("CATALOG_DRY_RUN");
  const allowPartial =
    args.includes("--allow-partial") ||
    parseBooleanEnv("npm_config_allow_partial") ||
    parseBooleanEnv("CATALOG_ALLOW_PARTIAL");

  let outArg: string | null = null;
  let candidatesOutArg: string | null = null;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--out" && args[i + 1]) {
      outArg = args[i + 1];
      i++;
      continue;
    }

    if (arg.startsWith("--out=")) {
      outArg = arg.slice("--out=".length);
      continue;
    }

    if (arg === "--candidates-out" && args[i + 1]) {
      candidatesOutArg = args[i + 1];
      i++;
      continue;
    }

    if (arg.startsWith("--candidates-out=")) {
      candidatesOutArg = arg.slice("--candidates-out=".length);
    }
  }

  const outputFile = path.resolve(outArg || process.env.npm_config_out || DEFAULT_OUTPUT_FILE);
  const candidatesFile = path.resolve(
    candidatesOutArg || process.env.npm_config_candidates_out || DEFAULT_CANDIDATES_FILE,
  );
  return { dryRun, allowPartial, outputFile, candidatesFile };
}

function toStringSet(value: unknown): Set<string> {
  if (!Array.isArray(value)) return new Set<string>();
  return new Set(value.filter((v): v is string => typeof v === "string" && v.trim().length > 0));
}

function writeJsonAtomic(filePath: string, data: unknown): void {
  const outputDir = path.dirname(filePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const tempFile = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, filePath);
  } finally {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

function main() {
  const options = parseCliOptions();
  console.log("Loading configurations...");
  const config = loadConfig(CONFIG_PATH);
  const allowlistYaml = loadYaml(ALLOWLIST_PATH) as { allowed_skills?: unknown } | null;
  const blocklistYaml = loadYaml(BLOCKLIST_PATH) as
    | { blocked_skills?: unknown; blocked_sources?: unknown }
    | null;

  const allowlist = toStringSet(allowlistYaml?.allowed_skills);
  const blocklistSkills = toStringSet(blocklistYaml?.blocked_skills);
  const blocklistSources = toStringSet(blocklistYaml?.blocked_sources);

  const publishedSkills: CatalogItem[] = [];
  const candidateSkills: CandidateItem[] = [];
  const sourceErrors: string[] = [];

  for (const source of config.sources) {
    if (blocklistSources.has(source.id)) {
      console.warn(`[Blocked Source] ${source.id} is in blocklist. Skipping.`);
      continue;
    }

    console.log(`Processing source: ${source.id}`);
    try {
      // 1. Discover (Clone/Fetch)
      const targetPath = cloneSource(source, CACHE_DIR);

      // 2. Parse & Scan
      const skills = parseSourceSkills(source, targetPath);
      console.log(`Found ${skills.length} skills in ${source.id}`);

      // 3. Filter/Gate rules
      for (const skill of skills) {
        if (blocklistSkills.has(skill.id)) {
          console.warn(`[Blocked] ${skill.id} - Explicitly on blocklist.`);
          continue;
        }

        // Trust C policy: publish only low-risk + known-license by default.
        if (skill.trust === "C") {
          const reasons: string[] = [];
          if (skill.license.spdx === "UNKNOWN") {
            reasons.push("unknown_license");
          }
          if (skill.risk.level !== "low") {
            reasons.push(`risk_${skill.risk.level}`);
          }

          if (reasons.length > 0 && !allowlist.has(skill.id)) {
            console.warn(`[Candidate] ${skill.id} - ${reasons.join(", ")}`);
            candidateSkills.push({
              id: skill.id,
              trust: skill.trust,
              reasons,
              item: skill,
            });
            continue;
          }

          if (reasons.length > 0 && allowlist.has(skill.id)) {
            console.log(
              `[Allowed] ${skill.id} - Candidate policy overridden by allowlist (${reasons.join(", ")}).`,
            );
          }

          publishedSkills.push(skill);
          continue;
        }

        // Trust A/B policy: unknown license is always blocked.
        if (skill.license.spdx === "UNKNOWN") {
          console.warn(`[Blocked] ${skill.id} - Unknown license.`);
          continue;
        }

        // Trust A/B policy: high risk allowed only by explicit allowlist.
        if (skill.risk.level === "high" && !allowlist.has(skill.id)) {
          console.warn(
            `[Blocked] ${skill.id} - High risk level not allowed for Tier ${skill.trust}. Flags: ${skill.risk.flags.join(", ")}`,
          );
          continue;
        }

        if (skill.risk.level === "high" && allowlist.has(skill.id)) {
          console.log(`[Allowed] ${skill.id} - High risk, but explicitly allowlisted.`);
        }

        publishedSkills.push(skill);
      }
    } catch (error) {
      const message = `Error processing source ${source.id}: ${
        error instanceof Error ? error.message : String(error)
      }`;
      console.error(message);
      sourceErrors.push(message);

      if (!options.allowPartial) {
        throw new Error(
          "Halting ingestion because a source failed. Re-run with --allow-partial to continue on source errors.",
        );
      }
    }
  }

  if (sourceErrors.length > 0 && options.allowPartial) {
    console.warn(
      `Continuing after ${sourceErrors.length} source error(s) due to --allow-partial.`,
    );
  }

  publishedSkills.sort((a, b) => a.id.localeCompare(b.id));
  candidateSkills.sort((a, b) => a.id.localeCompare(b.id));

  // 4. Validate output schema
  console.log(`Validating ${publishedSkills.length} published skills against schema...`);
  const isValid = validateCatalogItems(publishedSkills, SCHEMA_PATH);
  
  if (!isValid) {
    console.error("Schema validation failed. Halting ingestion.");
    process.exit(1);
  }

  // 5. Output
  if (options.dryRun) {
    console.log(`[DRY RUN] Would write ${publishedSkills.length} published skills to ${options.outputFile}`);
    console.log(
      `[DRY RUN] Would write ${candidateSkills.length} candidate skills to ${options.candidatesFile}`,
    );
  } else {
    console.log(`Validation passed. Writing to ${options.outputFile}...`);
    writeJsonAtomic(options.outputFile, publishedSkills);
    writeJsonAtomic(options.candidatesFile, candidateSkills);
  }
  console.log("Ingestion complete!");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
