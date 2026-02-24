import { execSync } from "child_process";
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

export function loadConfig(configPath: string): Config {
  const content = fs.readFileSync(configPath, "utf-8");
  return yaml.parse(content) as Config;
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
    execSync(`git clone --depth 1 --branch ${source.ref} ${source.repo} ${targetPath}`, {
      stdio: "inherit"
    });
  } else {
    console.log(`Source ${source.id} already cloned. Fetching latest...`);
    execSync(`git fetch --depth 1 origin ${source.ref} && git reset --hard origin/${source.ref}`, {
      cwd: targetPath,
      stdio: "inherit"
    });
  }

  return targetPath;
}
