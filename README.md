# CodexDepot

[![GitHub stars](https://img.shields.io/github/stars/FunkyBlend/codex-templates?style=for-the-badge)](https://github.com/FunkyBlend/codex-templates)
[![License](https://img.shields.io/github/license/FunkyBlend/codex-templates?style=for-the-badge)](https://github.com/FunkyBlend/codex-templates/blob/main/LICENSE)
![Validated items](https://img.shields.io/badge/items-6-success?style=for-the-badge)
![CLI](https://img.shields.io/badge/CLI-v0.1.0-blue?style=for-the-badge)

Community-driven Codex marketplace using GitHub content as source of truth.

## MVP Principles
- No database.
- No authentication/accounts.
- Static index generation from repository content.
- PR-based contributions with automated validation and security checks.

## Core Paths
- `content/` canonical catalog content.
- `schemas/` metadata contracts.
- `scripts/` validation + index/search/stats generation.
- `public/data/` generated index artifacts.
- `cli/` CodexDepot CLI package scaffold.

## Skill Ingestion Pipeline

CodexDepot pulls skills from external repositories defined in `catalog/sources.yaml`.

### Contributing Skills

There are two paths to add a skill to the marketplace:

**Path A: Direct PR (Best for single skills)**
1. Fork the repository.
2. Add your skill folder under `content/skills/<slug>/`.
3. Ensure it has a valid `SKILL.md`.
4. Open a Pull Request. CI will validate it.

**Path B: External Repo Link (Best for large collections)**
1. Host your skills in a public GitHub repository.
2. Ensure they follow the `SKILL.md` format.
3. Open a Pull Request adding your repository to `catalog/sources.yaml` (Trust Tier C).
4. Our nightly ingestion pipeline will scan your repo, run risk/license checks, and publish the safe skills.

### Pipeline Commands

* `npm run catalog:ingest` - Fetches/parses all sources in `sources.yaml`, applies trust/risk/license gating, writes published entries to `public/data/catalog.json`, and writes review-required entries to `public/data/catalog.candidates.json`.
* `npm run catalog:ingest -- --dry-run` - Runs full ingest + gating + schema validation without writing files.
* `npm run catalog:validate` - Runs schema + semantic validation for the published catalog.
* `npm run catalog:validate -- --file <path>` - Validates a specific catalog artifact file.
* `npm run catalog:diff` - Shows added/removed entries and field-level changes versus `HEAD`.

## Local Commands
```bash
npm run validate:content
npm run build:index
npm run lint
npm run build
```

## CLI Commands
```bash
npm run cli -- doctor
npm run cli -- list --type skill
npm run cli -- search "refactor review"
npm run cli -- info agent refactor-review
npm run cli -- install template nextjs-codex-starter --target ./sandbox --dry-run
npm run cli -- install template nextjs-codex-starter --target ./sandbox --ref <tag-or-commit> --dry-run
```

## CI Variables
- `CATALOG_REPO` (default: `FunkyBlend/codex-templates`)
- `CATALOG_BRANCH` (default: `main`)

These are read by content validation/index generation workflows.

## CLI Release Flow
- Set repository secret `NPM_TOKEN`.
- Bump `cli/package.json` version.
- Push a tag matching `cli-v*` (example: `cli-v0.1.1`).
- GitHub Actions workflow `.github/workflows/release-cli.yml` publishes `cli/` to npm.

## Docs
- Contributor guide: `docs/CONTRIBUTING.md`
- Moderation guide: `docs/MODERATION.md`
- CLI notes: `cli/README.md`
