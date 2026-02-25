Below is a **ready-to-implement “Skill ingestion pipeline” spec** you can hand to Codex and build into your Codex-skills marketplace.

It’s designed around the **canonical rules**:

* A skill is a **folder** anchored by a required `SKILL.md` containing YAML frontmatter with at least `name` + `description`. ([OpenAI Developers][1])
* Skills may include optional `scripts/`, `references/`, `assets/`, and optional `agents/openai.yaml` metadata. ([OpenAI Developers][1])
* Codex discovers repo skills from `.agents/skills` locations (from CWD up to repo root). ([OpenAI Developers][1])
* OpenAI’s curated/experimental catalog installs via `$skill-installer`, and Codex includes `$skill-creator` for creating new skills. ([OpenAI Developers][1])

---

## 1) Goal

Produce a single file your website can ingest, e.g.:

* `public/data/catalog.json` (or `catalog.ndjson` for streaming)
* plus a **strict validator** to keep your marketplace “legit”

---

## 2) Trust tiers + default sources (seed catalog)

Start with “known good” sources, then expand:

### Tier A — First-party / highly trusted

* `openai/skills` (curated + experimental skills; license typically in each skill folder as `LICENSE.txt`) ([GitHub][2])
* `huggingface/skills` ([GitHub][3])
* `anthropics/skills` (Agent Skills format) ([GitHub][4])

### Tier B — Curated community lists

* “awesome” lists (manual curation) → these become **discovery inputs**, not auto-approved.

### Tier C — Open discovery (GitHub topics/search)

* You ingest candidates, but only publish after validation + license + risk scoring.

---

## 3) Repository layout in your project

Suggested folders:

```
/catalog
  sources.yaml            # where you pull from
  allowlist.yaml          # approved repos/paths
  blocklist.yaml          # banned repos/paths/hashes
  schemas/
    catalog.schema.json
  ingest/
    ingest.ts (or .py)    # main CLI
    validators.ts
    scanners.ts
/public/data/
  catalog.json
```

---

## 4) `sources.yaml` format (input)

Example:

```yaml
version: 1
sources:
  - id: openai-skills-curated
    trust: A
    repo: https://github.com/openai/skills
    ref: main
    include_paths:
      - skills/.curated/**
      - skills/.experimental/**
    install_hint: skill-installer

  - id: hf-skills
    trust: A
    repo: https://github.com/huggingface/skills
    ref: main
    include_paths:
      - skills/**

  - id: community-topic-codex-skill
    trust: C
    discovery:
      type: github_topic
      topic: codex-skill
    max_repos: 200
```

---

## 5) Skill detection rules (hard gate)

A folder is a “skill” if it contains:

* `SKILL.md` or `skill.md`
* YAML frontmatter at the top bounded by `---`
* frontmatter includes **non-empty**:

  * `name`
  * `description` ([OpenAI Developers][1])

Also capture optional files if present:

* `agents/openai.yaml` (metadata/deps/appearance) ([OpenAI Developers][1])
* `scripts/**` (executable code) ([OpenAI Developers][1])
* `references/**`, `assets/**` ([OpenAI Developers][1])

---

## 6) Parsing + normalization

### 6.1 Parse `SKILL.md`

Extract:

* `name` (string)
* `description` (string)
* optional: `version`, `tags`, `tools`, `inputs`, `outputs` (you decide; store but don’t require)

Normalize:

* `slug = kebabCase(name)`
* enforce max lengths (ex: `name <= 80`, `description <= 280`)

### 6.2 Optional parse `agents/openai.yaml`

Store as `openai_meta` (raw YAML) so you can show “dependencies” / “appearance” later. ([OpenAI Developers][1])

---

## 7) License detection (publish gate)

Rules:

1. If skill folder includes `LICENSE*` (OpenAI’s catalog uses `LICENSE.txt` per-skill), use that. ([GitHub][2])
2. Else fall back to repo root `LICENSE*`
3. Else mark `license = "UNKNOWN"` → **don’t publish** for Trust A/B; for Trust C keep as “candidate” only

Also store:

* `license_spdx_guess` (MIT/Apache-2.0/etc.)
* `license_file_path`

---

## 8) Risk scanning + safety labels (publish gate)

You’re not sandboxing here; you’re just labeling and filtering.

### 8.1 Classify execution surface

* `instruction_only`: no `scripts/` and no executable files
* `has_scripts`: contains `scripts/` or `*.py/*.js/*.sh` etc.

### 8.2 Static “risk score” heuristic (simple + effective)

Scan scripts for:

* **Network**: `curl`, `wget`, `requests`, `httpx`, `fetch`, `axios`
* **Shell exec**: `subprocess`, `os.system`, `child_process.exec`
* **Filesystem write**: `rm -rf`, `unlink`, `rmtree`, `WriteFile`
* **Secrets usage**: `OPENAI_API_KEY`, `GITHUB_TOKEN`, `.env`, “paste your key”

Output:

* `risk_level`: `low | medium | high`
* `risk_flags`: string[]

Policy:

* Trust A: allow low/medium; block high unless manually reviewed
* Trust C: publish only `low` automatically; everything else requires approval

---

## 9) Catalog JSON schema (output)

Each entry:

```json
{
  "id": "openai-skills-curated:gh-address-comments",
  "name": "gh-address-comments",
  "slug": "gh-address-comments",
  "description": "…",
  "trust": "A",
  "source": {
    "repo": "https://github.com/openai/skills",
    "ref": "main",
    "commit": "abc123…",
    "path": "skills/.curated/gh-address-comments"
  },
  "license": {
    "spdx": "MIT",
    "file": "LICENSE.txt"
  },
  "layout": {
    "has_scripts": true,
    "has_references": true,
    "has_assets": false,
    "has_openai_yaml": true
  },
  "risk": {
    "level": "medium",
    "flags": ["network", "shell_exec"]
  },
  "install": [
    {
      "method": "codex_skill_installer",
      "hint": "$skill-installer install <github_dir_url>"
    }
  ],
  "tags": ["github", "review"]
}
```

For OpenAI catalog entries, you can generate install hints that match their README examples (`$skill-installer …` by name or GitHub directory URL). ([GitHub][2])
For generic repos, also include “manual install” hint: copy into `.agents/skills` (Codex discovery path). ([OpenAI Developers][1])

---

## 10) CLI commands you implement

### `catalog:ingest`

* reads `sources.yaml`
* pulls repos (GitHub API or shallow clone)
* finds skill folders
* validates + scans
* writes `public/data/catalog.json`

### `catalog:validate`

* validates JSON against `catalog.schema.json`
* checks for:

  * duplicate `name` collisions
  * missing licenses
  * broken paths
  * empty descriptions

### `catalog:diff`

* compares last build vs new build
* outputs “added/removed/changed” list (useful for PR review)

---

## 11) CI / GitHub Actions (to keep the site clean)

On every PR:

1. run `catalog:ingest --dry-run`
2. run `catalog:validate`
3. fail if:

   * any published entry has `license=UNKNOWN`
   * any published entry has `risk_level=high`
   * any entry missing `name/description` frontmatter ([OpenAI Developers][1])

Nightly:

* run full ingest, open PR with updated `catalog.json`

---

## 12) “Contribution” flow (so people can add skills safely)

Two paths:

### A) Add a skill directly to your repo (best)

* Contributors PR a new folder under `community/skills/<slug>/SKILL.md`
* Your CI validates it

### B) Add an external repo as a source

* Contributors PR an entry to `sources.yaml` (Trust C)
* Pipeline ingests as “candidate”
* You approve → move to allowlist / bump to Trust B

---

## 13) Implementation notes (fastest stack)

If your site is Node/Next:

* parse frontmatter: `gray-matter`
* YAML: `yaml`
* schema validation: `zod` or `ajv`
* git: `isomorphic-git` OR `git clone --depth=1`
* GitHub API: REST “contents” endpoints (needs token for rate limits)

---

