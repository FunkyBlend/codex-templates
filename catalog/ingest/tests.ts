import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";
import { loadConfig, Source } from "./discover";
import { parseSourceSkills } from "./parse";
import { validateCatalogSemantics } from "./validators";

function withTempDir(run: (dir: string) => void): void {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalog-ingest-test-"));
  try {
    run(tempDir);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function testLoadConfigRejectsUnsafeRepo(): void {
  withTempDir((dir) => {
    const configPath = path.join(dir, "sources.yaml");
    fs.writeFileSync(
      configPath,
      [
        "version: 1",
        "sources:",
        "  - id: unsafe-source",
        "    trust: A",
        "    repo: https://github.com/example/repo;rm -rf /",
        "    ref: main",
      ].join("\n"),
      "utf-8",
    );

    assert.throws(() => loadConfig(configPath), /disallowed shell metacharacters/);
  });
}

function testParseSourceSkillsSkipsInvalidAndCapturesMetadata(): void {
  withTempDir((dir) => {
    const curatedDir = path.join(dir, "skills", ".curated");
    const goodSkillDir = path.join(curatedDir, "good-skill");
    const badSkillDir = path.join(curatedDir, "bad-skill");

    fs.mkdirSync(path.join(goodSkillDir, "agents"), { recursive: true });
    fs.mkdirSync(badSkillDir, { recursive: true });

    fs.writeFileSync(
      path.join(goodSkillDir, "SKILL.md"),
      [
        "---",
        "name: Good Skill",
        "description: A test skill",
        "tags:",
        "  - test",
        "tools:",
        "  - tool-a",
        "---",
        "",
        "Body",
      ].join("\n"),
      "utf-8",
    );

    fs.writeFileSync(
      path.join(goodSkillDir, "agents", "openai.yaml"),
      ["name: Good Skill", "dependencies:", "  - jq"].join("\n"),
      "utf-8",
    );

    fs.writeFileSync(
      path.join(badSkillDir, "SKILL.md"),
      ["---", "name: Bad Skill", "---", "", "Body"].join("\n"),
      "utf-8",
    );

    const source: Source = {
      id: "test-source",
      trust: "C",
      repo: "https://github.com/example/repo",
      ref: "main",
      include_paths: ["skills/.curated/**"],
      install_hint: "skill-installer",
    };

    const items = parseSourceSkills(source, dir);
    assert.strictEqual(items.length, 1);

    const item = items[0];
    assert.strictEqual(item.id, "test-source:good-skill");
    assert.strictEqual(item.layout.has_openai_yaml, true);
    assert.ok(item.openai_meta);
    assert.ok(Array.isArray(item.install));
    assert.ok(item.install?.some((entry) => entry.method === "manual_copy"));
    assert.ok(item.install?.some((entry) => entry.method === "codex_skill_installer"));
  });
}

function testSemanticValidationFindings(): void {
  const items = [
    {
      id: "source:one",
      name: "Duplicate Name",
      description: "ok",
      license: { spdx: "MIT" },
      risk: { level: "low" },
      source: { path: "skills/one" },
    },
    {
      id: "source:two",
      name: "duplicate name",
      description: "   ",
      license: { spdx: "UNKNOWN" },
      risk: { level: "high" },
      source: { path: "../bad-path" },
    },
  ];

  const errors = validateCatalogSemantics(items);
  assert.ok(errors.some((e) => e.includes("Duplicate name collision")));
  assert.ok(errors.some((e) => e.includes("Empty description")));
  assert.ok(errors.some((e) => e.includes("Missing license (UNKNOWN)")));
  assert.ok(errors.some((e) => e.includes("High-risk entry")));
  assert.ok(errors.some((e) => e.includes("Broken source path")));

  const allowedErrors = validateCatalogSemantics(items, {
    allowedHighRiskIds: new Set(["source:two"]),
  });
  assert.ok(!allowedErrors.some((e) => e.includes("High-risk entry")));
}

function main(): void {
  testLoadConfigRejectsUnsafeRepo();
  testParseSourceSkillsSkipsInvalidAndCapturesMetadata();
  testSemanticValidationFindings();
  console.log("catalog ingestion tests passed");
}

main();
