import fs from "fs";
import path from "path";
import { validateCatalogItems } from "./validators";

const OUTPUT_FILE = path.resolve(__dirname, "..", "..", "public", "data", "catalog.json");
const SCHEMA_PATH = path.resolve(__dirname, "..", "schemas", "catalog.schema.json");

function main() {
  if (!fs.existsSync(OUTPUT_FILE)) {
    console.error(`Catalog file not found at ${OUTPUT_FILE}`);
    process.exit(1);
  }

  const items = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
  
  console.log(`Validating ${items.length} skills from ${OUTPUT_FILE}...`);
  const isValid = validateCatalogItems(items, SCHEMA_PATH);

  if (isValid) {
    console.log("Validation passed! The catalog is valid.");
    process.exit(0);
  } else {
    console.error("Validation failed!");
    process.exit(1);
  }
}

main();