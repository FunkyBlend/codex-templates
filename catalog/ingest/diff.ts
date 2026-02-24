import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { CatalogItem } from "./parse";

const OUTPUT_FILE = path.resolve(__dirname, "..", "..", "public", "data", "catalog.json");

function getCommittedCatalog(): CatalogItem[] {
  try {
    const gitPath = "public/data/catalog.json";
    const content = execSync(`git show HEAD:${gitPath}`, { encoding: "utf-8" });
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

function main() {
  const oldCatalog = getCommittedCatalog();
  const newCatalog = getLocalCatalog();

  const oldMap = new Map<string, CatalogItem>(oldCatalog.map(i => [i.id, i]));
  const newMap = new Map<string, CatalogItem>(newCatalog.map(i => [i.id, i]));

  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];

  for (const [id, newItem] of newMap.entries()) {
    const oldItem = oldMap.get(id);
    if (!oldItem) {
      added.push(id);
    } else {
      // Very basic comparison
      if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
        changed.push(id);
      }
    }
  }

  for (const id of oldMap.keys()) {
    if (!newMap.has(id)) {
      removed.push(id);
    }
  }

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
    changed.forEach(id => console.log(`~ ${id}`));
  }
}

main();