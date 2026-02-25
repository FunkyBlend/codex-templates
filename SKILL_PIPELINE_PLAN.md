# Skill Ingestion Pipeline Implementation Plan

Based on the requirements and constraints outlined in `spec.md`, here is a comprehensive, step-by-step technical plan to build the **Skill Ingestion Pipeline** for the CodexDepot marketplace.

This plan is structured to integrate cleanly into the existing Next.js/TypeScript ecosystem. It is designed to be implemented iteratively following Gall's Law: *A complex system that works is invariably found to have evolved from a simple system that worked.*

---

## Phase 1: Core Foundation & Discovery (The Simple System)

**Goal:** Establish the basic structure, define the configuration schema, and implement a rudimentary ingestion script that simply finds and parses local/remote skills without complex validation.

### 1.1 Directory & Configuration Setup
Create the foundational directory structure under the project root:
```text
/catalog
  ├── sources.yaml          # Defines external repositories (Tier A, B, C)
  ├── schemas/
  │   └── catalog.schema.json # Target schema for the generated catalog.json
  └── ingest/
      ├── ingest.ts         # Main pipeline orchestrator
      ├── discover.ts       # GitHub API/Git cloning logic
      └── parse.ts          # SKILL.md and frontmatter parser
```

### 1.2 `sources.yaml` Definition
Define the initial configuration for external skill resolution. Focus only on a single, highly trusted source first (e.g., Tier A).
*   **Tier A (Trusted):** First-party (OpenAI, HuggingFace, Anthropic).

### 1.3 `catalog.schema.json` Implementation
Define the strict JSON schema for the output `public/data/catalog.json`. Each entry must enforce at a minimum:
*   `id`: String (Format: `source-id:slug`)
*   `name` & `slug`: String
*   `description`: String
*   `trust`: Enum (`A`, `B`, `C`)
*   `source`: Object containing `repo`, `ref`, and `path`.

### 1.4 Basic Discovery & Parsing (`discover.ts` & `parse.ts`)
*   **Discover:** Implement a basic mechanism to clone or fetch a repository defined in `sources.yaml` (using `isomorphic-git`, `simple-git`, or GitHub REST API).
*   **Parse:** Find directories containing `SKILL.md`. Use `gray-matter` to extract the `name` and `description` from the YAML frontmatter.
*   **Output:** Generate a basic `catalog.json` array and write it to `public/data/catalog.json`.

---

## Phase 2: Validation & Gating (Evolving the System)

**Goal:** Introduce strict validation rules, license checks, and risk scanning to ensure the marketplace only publishes safe and legally sound skills.

### 2.1 Schema Enforcement & Normalization
*   Integrate `ajv` to strictly validate the generated JSON array against `catalog.schema.json`.
*   Normalize the parsed data: generate the `slug` (`kebabCase(name)`), and enforce length limits on `name` (max 80) and `description` (max 280).

### 2.2 License Detection (`validators.ts`)
*   Implement logic to search for `LICENSE*` or `LICENSE.txt` inside the skill folder or the root of the repository.
*   Attempt to guess the SPDX identifier.
*   **Gate:** If no license is found, set `license = "UNKNOWN"` and exclude it from the final published catalog.

### 2.3 Risk Scanning Heuristic (`scanners.ts`)
Perform static analysis on `scripts/` or executable files (`*.py`, `*.js`, `*.sh`).
*   **Network Check:** Regex for `curl`, `wget`, `requests`, `fetch`, etc.
*   **Shell Exec Check:** Regex for `subprocess`, `os.system`, `child_process.exec`, etc.
*   **Filesystem Check:** Regex for `rm -rf`, `unlink`, `WriteFile`, etc.
*   **Secrets Check:** Regex for `OPENAI_API_KEY`, `.env`, etc.
*   **Scoring & Gating:** Assign a `risk_level` (`low`, `medium`, `high`). Block `high` risk skills from publishing automatically.

---

## Phase 3: CLI Integration & Allow/Block Lists

**Goal:** Integrate the ingestion pipeline into the existing CLI and introduce manual override capabilities for community sources.

### 3.1 Allow/Block Lists
*   Create `catalog/allowlist.yaml` and `catalog/blocklist.yaml`.
*   Implement logic in the pipeline to explicitly approve high-risk skills (if in allowlist) or entirely skip specific repos/paths (if in blocklist).
*   Expand `sources.yaml` to include Tier B (Curated) and Tier C (Discovery/GitHub Topics) sources.

### 3.2 CLI Commands Expansion
Extend the existing `cli/bin/codexdepot.js` (or npm scripts):
*   **`catalog:ingest [--dry-run]`**: Runs the full pipeline (Phase 1 & 2) and writes to `public/data/catalog.json`.
*   **`catalog:validate`**: Explicitly runs the `ajv` validation against the generated file.
*   **`catalog:diff`**: Compares the newly generated catalog against the previously committed version to show what was added, removed, or changed.

---

## Phase 4: CI/CD & Automation (Maturing the System)

**Goal:** Automate the pipeline via GitHub Actions to ensure the site remains clean and up-to-date automatically.

### 4.1 PR Verification Workflow (`.github/workflows/validate-catalog.yml`)
Triggered on any pull request:
1.  Run `npm run catalog:ingest -- --dry-run`.
2.  Run `npm run catalog:validate`.
3.  **Fail the Action if:**
    *   Any published entry has `license = UNKNOWN`.
    *   Any published entry has `risk_level = high` (unless allowlisted).
    *   Missing frontmatter (`name`/`description`).

### 4.2 Nightly Sync Workflow (`.github/workflows/nightly-ingest.yml`)
Triggered via a daily cron schedule:
1.  Run full `npm run catalog:ingest`.
2.  If `public/data/catalog.json` changes, use an action (e.g., `peter-evans/create-pull-request`) to automatically open a PR titled *"chore: nightly catalog sync"*.

### 4.3 Documentation
Update `README.md` or `CONTRIBUTING.md` detailing the dual-path contribution model (Direct PR vs. External Repo Linking via `sources.yaml`).
