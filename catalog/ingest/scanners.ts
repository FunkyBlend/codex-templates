import fs from "fs";
import path from "path";

export interface RiskResult {
  level: "low" | "medium" | "high";
  flags: string[];
}

const NETWORK_PATTERNS = [/curl\s/, /wget\s/, /requests\./, /httpx\./, /fetch\(/, /axios\./];
const SHELL_EXEC_PATTERNS = [/subprocess\./, /os\.system/, /child_process\.exec/, /execSync/];
const FS_WRITE_PATTERNS = [/rm -rf/, /unlink\(/, /rmtree\(/, /WriteFile/, /fs\.writeFile/, /fs\.rm/];
const SECRETS_PATTERNS = [/OPENAI_API_KEY/, /GITHUB_TOKEN/, /\.env/, /paste your key/i];

function scanFileContent(content: string, flags: Set<string>, currentLevel: "low" | "medium" | "high"): "low" | "medium" | "high" {
  let level = currentLevel;

  const checkPattern = (patterns: RegExp[], flagName: string, flagLevel: "low" | "medium" | "high") => {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        flags.add(flagName);
        if (flagLevel === "high" || (flagLevel === "medium" && level === "low")) {
          level = flagLevel;
        }
      }
    }
  };

  checkPattern(NETWORK_PATTERNS, "network", "medium");
  checkPattern(SHELL_EXEC_PATTERNS, "shell_exec", "medium");
  checkPattern(FS_WRITE_PATTERNS, "fs_write", "high");
  checkPattern(SECRETS_PATTERNS, "secrets", "high");

  return level;
}

export function scanSkillDirectory(skillDirPath: string): RiskResult {
  const flags = new Set<string>();
  let level: "low" | "medium" | "high" = "low";

  // Scan only scripts/ or specific executable files at the root of the skill
  const scanQueue = [skillDirPath];

  while (scanQueue.length > 0) {
    const currentDir = scanQueue.shift()!;
    if (!fs.existsSync(currentDir)) continue;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Only recurse into scripts/ or if we are already inside scripts/
        if (currentDir === skillDirPath && entry.name === "scripts") {
          scanQueue.push(fullPath);
        } else if (currentDir !== skillDirPath) {
          // We are inside a subdirectory (e.g., scripts/something)
          scanQueue.push(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        const isExecutableType = [".py", ".js", ".sh", ".ts", ".bash"].includes(ext);
        
        // Scan if it's in scripts/ OR it's an executable file in the root
        if (currentDir !== skillDirPath || isExecutableType) {
          try {
            const content = fs.readFileSync(fullPath, "utf-8");
            level = scanFileContent(content, flags, level);
          } catch (err) {
            console.warn(`Could not read file for scanning: ${fullPath}`, err);
          }
        }
      }
    }
  }

  return {
    level,
    flags: Array.from(flags)
  };
}