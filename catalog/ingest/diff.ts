import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { CatalogItem } from "./parse";

const OUTPUT_FILE = path.resolve(__dirname, "..", "..", "public", "data", "catalog.json");

function getCommittedCatalog(): CatalogItem[] {
  try {
    const gitPath = "public/data/catalog.json";
    const content = execFileSync("git", ["show", `HEAD:${gitPath}`], { encoding: "utf-8" });
    return JSON.parse(content);
  } catch (error) {
    console.warn("Could not load committed catalog (it might not exist yet).");
    return [];
  }
}

function getLocalCatalog(): CatalogItem[] {
  if (!fs.existsSync(OUTPUT_FILE)) return [];
  return JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
}

function getChangedFields(oldItem: CatalogItem, newItem: CatalogItem): string[] {
  const changedFields: string[] = [];
  const oldRecord = oldItem as unknown as Record<string, unknown>;
  const newRecord = newItem as unknown as Record<string, unknown>;
  const keySet = new Set<string>([
    ...Object.keys(oldRecord),
    ...Object.keys(newRecord),
  ]);

  keySet.forEach((key) => {
    const oldValue = oldRecord[key];
    const newValue = newRecord[key];
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changedFields.push(key);
    }
  });

  return changedFields.sort();
}

function main() {
  const oldCatalog = getCommittedCatalog();
  const newCatalog = getLocalCatalog();

  const oldMap = new Map<string, CatalogItem>(oldCatalog.map((i) => [i.id, i]));
  const newMap = new Map<string, CatalogItem>(newCatalog.map((i) => [i.id, i]));

  const added: string[] = [];
  const removed: string[] = [];
  const changed: { id: string; fields: string[] }[] = [];

  newMap.forEach((newItem, id) => {
    const oldItem = oldMap.get(id);
    if (!oldItem) {
      added.push(id);
    } else {
      const changedFields = getChangedFields(oldItem, newItem);
      if (changedFields.length > 0) {
        changed.push({ id, fields: changedFields });
      }
    }
  });

  oldMap.forEach((_, id) => {
    if (!newMap.has(id)) {
      removed.push(id);
    }
  });

  added.sort();
  removed.sort();
  changed.sort((a, b) => a.id.localeCompare(b.id));

  console.log("=== Catalog Diff ===");
  console.log(`Added:   ${added.length}`);
  console.log(`Removed: ${removed.length}`);
  console.log(`Changed: ${changed.length}`);

  if (added.length > 0) {
    console.log("\n--- Added ---");
    added.forEach(id => console.log(`+ ${id}`));
  }

  if (removed.length > 0) {
    console.log("\n--- Removed ---");
    removed.forEach(id => console.log(`- ${id}`));
  }

  if (changed.length > 0) {
    console.log("\n--- Changed ---");
    changed.forEach(({ id, fields }) => console.log(`~ ${id} [${fields.join(", ")}]`));
  }
}

main();
