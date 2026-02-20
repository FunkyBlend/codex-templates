#!/usr/bin/env node
"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin, stdout, stderr, exit, cwd } = require("node:process");

const GIT_REF_PATTERN = /^[A-Za-z0-9._/-]{1,200}$/;
const ITEM_TYPES = new Set(["skill", "agent", "command", "template", "hook", "setting"]);
const TYPE_DIRS = {
  skill: "skills",
  agent: "agents",
  command: "commands",
  template: "templates",
  hook: "hooks",
  setting: "settings",
};

function printHelp() {
  stdout.write(
    [
      "CodexDepot CLI",
      "",
      "Usage:",
      "  codexdepot doctor [--index <path-or-url>] [--json]",
      "  codexdepot list [--type <type>] [--tag <tag>] [--compat <tool>] [--limit <n>] [--json]",
      "  codexdepot search <query> [--type <type>] [--limit <n>] [--json]",
      "  codexdepot info <type> <slug> [--json]",
      "  codexdepot install <type> <slug> [--target <path>] [--ref <tag-or-commit>] [--dry-run] [--force|--overwrite]",
      "",
      "Global options:",
      "  --index <path-or-url>    Use custom index source",
      "  --help                   Show this message",
      "",
      "Item types: skill, agent, command, template, hook, setting",
      "",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const positionals = [];
  const options = {};
  let index = 0;

  while (index < argv.length) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      positionals.push(token);
      index += 1;
      continue;
    }

    const [rawKey, inlineValue] = token.split("=", 2);
    const key = rawKey.slice(2);
    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      index += 1;
      continue;
    }

    const nextToken = argv[index + 1];
    if (nextToken && !nextToken.startsWith("--")) {
      options[key] = nextToken;
      index += 2;
      continue;
    }

    options[key] = true;
    index += 1;
  }

  return { positionals, options };
}

function isUrl(value) {
  return /^https?:\/\//i.test(value);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return response.json();
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function parseQueryTokens(query) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function pickOption(options, key, fallback = null) {
  if (Object.prototype.hasOwnProperty.call(options, key)) {
    return options[key];
  }
  return fallback;
}

function sortByUpdatedDesc(left, right) {
  return String(right.updated_at || "").localeCompare(String(left.updated_at || ""));
}

function ensureType(type) {
  if (!ITEM_TYPES.has(type)) {
    throw new Error(`Invalid type "${type}". Expected one of: ${Array.from(ITEM_TYPES).join(", ")}.`);
  }
}

async function resolveIndexSource(options) {
  const explicitSource = pickOption(options, "index", null);
  const envSource = process.env.CODEXDEPOT_INDEX_URL || null;
  const localDefault = path.resolve(cwd(), "public", "data", "index.json");
  const source = explicitSource || envSource || localDefault;

  if (!source) {
    throw new Error("No index source configured.");
  }

  if (isUrl(source)) {
    const index = await fetchJson(source);
    const searchUrl = source.endsWith("/index.json")
      ? source.replace(/\/index\.json$/i, "/search.json")
      : source.replace(/index\.json$/i, "search.json");
    let search = null;
    try {
      search = await fetchJson(searchUrl);
    } catch {
      search = { items: [] };
    }
    return {
      index,
      search,
      source,
      sourceType: "url",
      repoRoot: null,
    };
  }

  const sourcePath = path.resolve(cwd(), source);
  const index = await readJsonFile(sourcePath);
  const searchPath = path.join(path.dirname(sourcePath), "search.json");
  let search = { items: [] };
  try {
    search = await readJsonFile(searchPath);
  } catch {
    search = { items: [] };
  }

  const repoRoot = path.resolve(path.dirname(sourcePath), "..", "..");
  return {
    index,
    search,
    source: sourcePath,
    sourceType: "file",
    repoRoot,
  };
}

function printItems(items, asJson) {
  if (asJson) {
    stdout.write(`${JSON.stringify(items, null, 2)}\n`);
    return;
  }
  if (items.length === 0) {
    stdout.write("No matching items found.\n");
    return;
  }

  for (const item of items) {
    stdout.write(`${item.type.padEnd(8)} ${item.slug.padEnd(28)} ${item.title}\n`);
  }
}

function formatInfo(item, asJson) {
  if (asJson) {
    stdout.write(`${JSON.stringify(item, null, 2)}\n`);
    return;
  }
  stdout.write(
    [
      `${item.title} (${item.type}/${item.slug})`,
      `id: ${item.id}`,
      `summary: ${item.summary}`,
      `updated_at: ${item.updated_at}`,
      `author: ${item.author}`,
      `license: ${item.license}`,
      `compatibility: ${(item.compatibility || []).join(", ")}`,
      `tags: ${(item.tags || []).join(", ")}`,
      `route: ${item.route}`,
      `install_hint: ${item.install_hint}`,
      `source: ${item.raw_url}`,
      "",
    ].join("\n"),
  );
}

function getInstallSourceFiles(item) {
  if (item.type === "template") {
    const files = ["item.yaml", "README.md"];
    for (const entry of item.entry_files || []) {
      files.push(`files/${entry}`);
    }
    return Array.from(new Set(files));
  }

  if (item.type === "hook") {
    return ["hook.json", "README.md"];
  }

  if (item.type === "setting") {
    return ["settings.json", "README.md"];
  }

  return [path.posix.basename(item.content_path)];
}

function destinationPathFor(item, sourceFile, targetRoot) {
  if (item.type === "template") {
    if (sourceFile.startsWith("files/")) {
      return path.join(targetRoot, sourceFile.slice("files/".length));
    }
    return path.join(targetRoot, ".codexdepot", "templates", item.slug, sourceFile);
  }

  const subDir = TYPE_DIRS[item.type];
  return path.join(targetRoot, ".codexdepot", subDir, item.slug, path.posix.basename(sourceFile));
}

function toPosix(value) {
  return value.replace(/\\/g, "/");
}

function normalizeRepository(value) {
  const normalized = String(value || "").trim();
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(normalized)) {
    return null;
  }
  return normalized;
}

function resolveRepository(sourceContext, item) {
  const fromIndex = normalizeRepository(sourceContext.index?.source?.repository);
  if (fromIndex) return fromIndex;

  const rawUrl = String(item.raw_url || "");
  const rawUrlMatch = rawUrl.match(/^https?:\/\/raw\.githubusercontent\.com\/([^/]+\/[^/]+)\//i);
  if (rawUrlMatch) return rawUrlMatch[1];

  return null;
}

function parseInstallRef(value) {
  if (value === null || value === undefined || value === false) {
    return null;
  }
  const ref = String(value).trim();
  if (!ref) {
    throw new Error("Invalid --ref value. Use a git tag, branch, or commit SHA.");
  }
  if (!GIT_REF_PATTERN.test(ref) || ref.includes("..")) {
    throw new Error("Invalid --ref value. Use a git tag, branch, or commit SHA.");
  }
  return ref;
}

function getRawBaseDirectory(item) {
  const url = String(item.raw_url || "");
  const marker = String(item.content_path || "");
  const normalizedMarker = marker.replace(/\\/g, "/");

  if (url.endsWith(normalizedMarker)) {
    return url.slice(0, url.length - normalizedMarker.length);
  }

  const lastSlash = url.lastIndexOf("/");
  if (lastSlash === -1) return "";
  return `${url.slice(0, lastSlash + 1)}`;
}

async function readSourceFileContent(item, sourceFile, sourceContext, pinConfig = null) {
  const itemDir = path.posix.dirname(item.content_path);
  const relativeSourcePath = path.posix.join(itemDir, sourceFile);

  if (pinConfig && pinConfig.ref && pinConfig.repository) {
    const pinnedUrl = `https://raw.githubusercontent.com/${pinConfig.repository}/${pinConfig.ref}/${relativeSourcePath}`;
    const pinnedResponse = await fetch(pinnedUrl);
    if (!pinnedResponse.ok) {
      throw new Error(`Failed to download ${pinnedUrl} (${pinnedResponse.status}).`);
    }
    const pinnedArrayBuffer = await pinnedResponse.arrayBuffer();
    return Buffer.from(pinnedArrayBuffer);
  }

  if (sourceContext.sourceType === "file" && sourceContext.repoRoot) {
    const localPath = path.join(
      sourceContext.repoRoot,
      ...toPosix(relativeSourcePath).split("/"),
    );
    return fs.readFile(localPath);
  }

  const rawBase = getRawBaseDirectory(item);
  if (!rawBase || !isUrl(rawBase)) {
    throw new Error(
      "Cannot resolve remote source URL. Provide --index pointing to a real repository index or run from the repository root.",
    );
  }

  const resolvedUrl = new URL(sourceFile, rawBase).toString();
  const response = await fetch(resolvedUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${resolvedUrl} (${response.status}).`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function promptConflict(filePath) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question(
      `File exists: ${filePath}\nOverwrite? [y]es / [n]o / [a]ll / [q]uit: `,
    );
    return String(answer || "").trim().toLowerCase();
  } finally {
    rl.close();
  }
}

function stringifyPlanRows(rows, asJson) {
  if (asJson) {
    stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
    return;
  }

  if (rows.length === 0) {
    stdout.write("No files to write.\n");
    return;
  }

  stdout.write("Planned writes:\n");
  for (const row of rows) {
    stdout.write(`- ${row.action.padEnd(10)} ${row.relativeTarget}\n`);
  }
}

async function runDoctor(options) {
  const source = await resolveIndexSource(options);
  const payload = {
    index_source: source.source,
    source_type: source.sourceType,
    total_items: Number(source.index.total_items || (source.index.items || []).length || 0),
    index_version: source.index.index_version || "unknown",
    generated_at: source.index.generated_at || "unknown",
    repository: source.index.source ? source.index.source.repository : "unknown",
    branch: source.index.source ? source.index.source.branch : "unknown",
  };

  if (options.json) {
    stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }

  stdout.write(
    [
      "CodexDepot Doctor",
      `index_source: ${payload.index_source}`,
      `source_type: ${payload.source_type}`,
      `index_version: ${payload.index_version}`,
      `generated_at: ${payload.generated_at}`,
      `repository: ${payload.repository}`,
      `branch: ${payload.branch}`,
      `total_items: ${payload.total_items}`,
      "",
    ].join("\n"),
  );
}

async function runList(options, positionals) {
  const source = await resolveIndexSource(options);
  let items = Array.isArray(source.index.items) ? [...source.index.items] : [];

  const typeFilter = pickOption(options, "type", positionals[0] || null);
  const tagFilter = pickOption(options, "tag", null);
  const compatFilter = pickOption(options, "compat", null);
  const limit = Number(pickOption(options, "limit", "50"));

  if (typeFilter) {
    ensureType(String(typeFilter));
    items = items.filter((item) => item.type === String(typeFilter));
  }
  if (tagFilter) {
    items = items.filter((item) => (item.tags || []).includes(String(tagFilter).toLowerCase()));
  }
  if (compatFilter) {
    items = items.filter((item) =>
      (item.compatibility || []).includes(String(compatFilter).toLowerCase()),
    );
  }

  items.sort(sortByUpdatedDesc);
  const limited = Number.isFinite(limit) && limit > 0 ? items.slice(0, limit) : items;
  printItems(limited, Boolean(options.json));
}

async function runSearch(options, positionals) {
  const query = positionals.join(" ").trim();
  if (!query) {
    throw new Error('Missing query. Usage: codexdepot search "<query>"');
  }

  const source = await resolveIndexSource(options);
  const records = Array.isArray(source.search.items) ? source.search.items : [];
  const items = Array.isArray(source.index.items) ? source.index.items : [];
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const tokens = parseQueryTokens(query);
  const typeFilter = pickOption(options, "type", null);
  const limit = Number(pickOption(options, "limit", "20"));

  if (typeFilter) {
    ensureType(String(typeFilter));
  }

  const scored = [];
  for (const record of records) {
    if (typeFilter && record.type !== typeFilter) continue;
    const recordTokens = Array.isArray(record.tokens) ? record.tokens : [];
    const tokenHits = tokens.filter((token) =>
      recordTokens.some((candidate) => String(candidate).includes(token)),
    ).length;
    const item = itemMap.get(record.id);
    if (!item) continue;

    const directTextHit =
      String(item.title).toLowerCase().includes(query.toLowerCase()) ||
      String(item.summary).toLowerCase().includes(query.toLowerCase());

    if (tokenHits === 0 && !directTextHit) continue;
    scored.push({ item, tokenHits, directTextHit });
  }

  scored.sort((left, right) => {
    if (left.directTextHit !== right.directTextHit) {
      return left.directTextHit ? -1 : 1;
    }
    if (left.tokenHits !== right.tokenHits) {
      return right.tokenHits - left.tokenHits;
    }
    return sortByUpdatedDesc(left.item, right.item);
  });

  const output = scored.map((entry) => entry.item);
  const limited = Number.isFinite(limit) && limit > 0 ? output.slice(0, limit) : output;
  printItems(limited, Boolean(options.json));
}

async function findItem(index, type, slug) {
  ensureType(type);
  const items = Array.isArray(index.items) ? index.items : [];
  return items.find((item) => item.type === type && item.slug === slug) || null;
}

async function runInfo(options, positionals) {
  const [type, slug] = positionals;
  if (!type || !slug) {
    throw new Error("Usage: codexdepot info <type> <slug>");
  }

  const source = await resolveIndexSource(options);
  const item = await findItem(source.index, type, slug);
  if (!item) {
    throw new Error(`Item not found: ${type}/${slug}`);
  }

  formatInfo(item, Boolean(options.json));
}

async function runInstall(options, positionals) {
  const [type, slug] = positionals;
  if (!type || !slug) {
    throw new Error(
      "Usage: codexdepot install <type> <slug> [--target <path>] [--ref <tag-or-commit>] [--dry-run]",
    );
  }

  const source = await resolveIndexSource(options);
  const item = await findItem(source.index, type, slug);
  if (!item) {
    throw new Error(`Item not found: ${type}/${slug}`);
  }

  const targetRoot = path.resolve(cwd(), String(pickOption(options, "target", ".")));
  const dryRun = Boolean(options["dry-run"]);
  const force = Boolean(options.force || options.overwrite);
  const installRef = parseInstallRef(pickOption(options, "ref", null));
  const pinnedRepository = installRef ? resolveRepository(source, item) : null;
  if (installRef && !pinnedRepository) {
    throw new Error(
      "Unable to determine source repository for --ref install. Ensure index source includes source.repository.",
    );
  }
  const files = getInstallSourceFiles(item);

  const plan = [];
  for (const sourceFile of files) {
    const targetPath = destinationPathFor(item, sourceFile, targetRoot);
    let exists = false;
    try {
      await fs.access(targetPath);
      exists = true;
    } catch {
      exists = false;
    }

    plan.push({
      sourceFile,
      targetPath,
      relativeTarget: path.relative(targetRoot, targetPath) || path.basename(targetPath),
      action: exists ? "overwrite" : "write",
    });
  }

  stringifyPlanRows(plan, Boolean(options.json));
  if (installRef && !options.json) {
    stdout.write(`Pinned source: ${pinnedRepository}@${installRef}\n`);
  }

  const writes = [];
  let overwriteAll = force;
  for (const row of plan) {
    if (row.action === "overwrite" && !overwriteAll) {
      if (!stdin.isTTY || !stdout.isTTY) {
        throw new Error(
          `Conflict on ${row.relativeTarget}. Re-run with --force or --overwrite to proceed in non-interactive mode.`,
        );
      }
      const answer = await promptConflict(row.relativeTarget);
      if (answer === "q") {
        throw new Error("Install cancelled by user.");
      }
      if (answer === "a") {
        overwriteAll = true;
      } else if (answer !== "y" && answer !== "yes") {
        continue;
      }
    }
    writes.push(row);
  }

  if (dryRun) {
    stdout.write(`Dry run complete. ${writes.length} file(s) would be written.\n`);
    return;
  }

  const pinConfig =
    installRef && pinnedRepository
      ? {
          repository: pinnedRepository,
          ref: installRef,
        }
      : null;

  for (const row of writes) {
    const content = await readSourceFileContent(item, row.sourceFile, source, pinConfig);
    await fs.mkdir(path.dirname(row.targetPath), { recursive: true });
    await fs.writeFile(row.targetPath, content);
  }

  stdout.write(`Install complete. Wrote ${writes.length} file(s) to ${targetRoot}\n`);
}

async function main() {
  const argv = process.argv.slice(2);
  const { positionals, options } = parseArgs(argv);

  if (positionals.length === 0 || options.help) {
    printHelp();
    return;
  }

  const [command, ...rest] = positionals;
  try {
    if (command === "doctor") {
      await runDoctor(options);
      return;
    }
    if (command === "list") {
      await runList(options, rest);
      return;
    }
    if (command === "search") {
      await runSearch(options, rest);
      return;
    }
    if (command === "info") {
      await runInfo(options, rest);
      return;
    }
    if (command === "install") {
      await runInstall(options, rest);
      return;
    }

    throw new Error(`Unknown command "${command}".`);
  } catch (error) {
    stderr.write(`Error: ${(error && error.message) || String(error)}\n`);
    exit(1);
  }
}

void main();
