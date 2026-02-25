import fs from "fs";
import path from "path";
import yaml from "yaml";
import { validateCatalogItems, validateCatalogSemantics } from "./validators";

const DEFAULT_OUTPUT_FILE = path.resolve(
  __dirname,
  "..",
  "..",
  "public",
  "data",
  "catalog.json",
);
const SCHEMA_PATH = path.resolve(__dirname, "..", "schemas", "catalog.schema.json");
const ALLOWLIST_PATH = path.resolve(__dirname, "..", "allowlist.yaml");

function parseCatalogFileArg(): string {
  const args = process.argv.slice(2);
  let fileArg: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--file" && args[i + 1]) {
      fileArg = args[i + 1];
      i++;
      continue;
    }

    if (arg.startsWith("--file=")) {
      fileArg = arg.slice("--file=".length);
    }
  }

  return path.resolve(fileArg || process.env.npm_config_file || DEFAULT_OUTPUT_FILE);
}

function loadAllowedHighRiskIds(): Set<string> {
  if (!fs.existsSync(ALLOWLIST_PATH)) return new Set<string>();
  const parsed = yaml.parse(fs.readFileSync(ALLOWLIST_PATH, "utf-8")) as
    | { allowed_skills?: unknown }
    | null;

  if (!Array.isArray(parsed?.allowed_skills)) return new Set<string>();
  return new Set(
    parsed.allowed_skills.filter(
      (value): value is string => typeof value === "string" && value.trim().length > 0,
    ),
  );
}

function main() {
  const catalogFile = parseCatalogFileArg();

  if (!fs.existsSync(catalogFile)) {
    console.error(`Catalog file not found at ${catalogFile}`);
    process.exit(1);
  }

  const items = JSON.parse(fs.readFileSync(catalogFile, "utf-8"));
  
  console.log(`Validating ${items.length} skills from ${catalogFile}...`);
  const isValid = validateCatalogItems(items, SCHEMA_PATH);
  if (!isValid) {
    console.error("Validation failed!");
    process.exit(1);
  }

  const semanticErrors = validateCatalogSemantics(items, {
    allowedHighRiskIds: loadAllowedHighRiskIds(),
  });
  if (semanticErrors.length > 0) {
    console.error("Semantic validation failed:");
    semanticErrors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Validation passed! The catalog is valid.");
  process.exit(0);
}

main();
