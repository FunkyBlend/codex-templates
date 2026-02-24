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
const OUTPUT_FILE = path.resolve(__dirname, "..", "..", "public", "data", "catalog.json");

function loadYaml(filePath: string): any {
  if (!fs.existsSync(filePath)) return null;
  return yaml.parse(fs.readFileSync(filePath, "utf-8"));
}

function main() {
  console.log("Loading configurations...");
  const config = loadConfig(CONFIG_PATH);
  const allowlist = loadYaml(ALLOWLIST_PATH)?.allowed_skills || [];
  const blocklistSkills = loadYaml(BLOCKLIST_PATH)?.blocked_skills || [];
  const blocklistSources = loadYaml(BLOCKLIST_PATH)?.blocked_sources || [];

  let allSkills: CatalogItem[] = [];

  for (const source of config.sources) {
    if (blocklistSources.includes(source.id)) {
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
        if (blocklistSkills.includes(skill.id)) {
          console.warn(`[Blocked] ${skill.id} - Explicitly on blocklist.`);
          continue;
        }

        let skip = false;
        if (skill.license.spdx === "UNKNOWN") {
          console.warn(`[Blocked] ${skill.id} - Unknown license.`);
          skip = true;
        }
        
        // For Tier A/B, block high risk UNLESS allowlisted
        if (["A", "B"].includes(skill.trust) && skill.risk.level === "high") {
          if (allowlist.includes(skill.id)) {
            console.log(`[Allowed] ${skill.id} - High risk, but explicitly allowlisted.`);
          } else {
            console.warn(`[Blocked] ${skill.id} - High risk level not allowed for Tier ${skill.trust}. Flags: ${skill.risk.flags.join(", ")}`);
            skip = true;
          }
        }

        if (!skip) {
          allSkills.push(skill);
        }
      }
    } catch (error) {
      console.error(`Error processing source ${source.id}:`, error);
    }
  }

  // 4. Validate output schema
  console.log(`Validating ${allSkills.length} skills against schema...`);
  const isValid = validateCatalogItems(allSkills, SCHEMA_PATH);
  
  if (!isValid) {
    console.error("Schema validation failed. Halting ingestion.");
    process.exit(1);
  }

  // 5. Output
  const isDryRun = process.argv.includes("--dry-run");
  if (isDryRun) {
    console.log(`[DRY RUN] Would write ${allSkills.length} skills to ${OUTPUT_FILE}`);
  } else {
    console.log(`Validation passed. Writing to ${OUTPUT_FILE}...`);
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allSkills, null, 2), "utf-8");
  }
  console.log("Ingestion complete!");
}

main();