# CodexDepot Workspace Notes

## Repository Identity
- GitHub: `FunkyBlend/codex-templates`
- Default branch: `main`
- Catalog source defaults:
  - `CATALOG_REPO=FunkyBlend/codex-templates`
  - `CATALOG_BRANCH=main`

## Project Purpose
CodexDepot is a content-first Codex marketplace.

The source of truth is repository content in `content/`, validated and transformed into static data artifacts in `public/data/`. The Next.js app and CLI both consume those generated artifacts.

## Current Tech Stack
- App: Next.js 14 (App Router) + TypeScript
- UI: Tailwind CSS + React components under `src/components/`
- Data pipeline: TypeScript scripts in `scripts/`
- Validation: AJV + JSON schemas in `schemas/`
- Optional DB scaffolding: Prisma (`prisma/`) is present, but MVP is static-data driven
- CLI: `cli/bin/codexdepot.js`

## Key Paths
- `content/` catalog items (skills, agents, commands, templates, hooks, settings)
- `schemas/` metadata schemas
- `scripts/lib/content-pipeline.ts` validation + index/search/stats generation
- `public/data/index.json` generated catalog index
- `public/data/search.json` generated search index
- `public/data/stats.json` generated stats index
- `artifacts/validation-report.json` generated validation report
- `.github/workflows/validate-content.yml` CI validation workflow
- `.github/workflows/release-cli.yml` npm publish workflow for CLI tags

## Content Type Contracts
- `skill`: `content/skills/<slug>/SKILL.md`
- `agent`: `content/agents/<slug>/AGENT.md`
- `command`: `content/commands/<slug>/COMMAND.md`
- `template`: `content/templates/<slug>/item.yaml` + `files/`
- `hook`: `content/hooks/<slug>/hook.json` + `README.md`
- `setting`: `content/settings/<slug>/settings.json` + `README.md`

Slugs must be lowercase kebab-case. IDs must match `<type>.<slug>`.

## Core Commands
- `npm run validate:content`
- `npm run build:index`
- `npm run lint`
- `npm run build`

## CLI Commands
- `npm run cli -- doctor`
- `npm run cli -- list --type skill --limit 2`
- `npm run cli -- search "refactor"`
- `npm run cli -- info agent refactor-review`
- `npm run cli -- install template nextjs-codex-starter --target ./sandbox --dry-run`
- Pinned install:
  - `npm run cli -- install template nextjs-codex-starter --target ./sandbox --ref <tag-or-commit> --dry-run`

## GitHub Automation and Governance
- `main` branch protection is enabled.
- `main` requires pull requests before merge.
- Required status check on `main`: `validate`.
- `.github/CODEOWNERS` routes ownership to `@FunkyBlend` for repo-critical paths.
- Repo Actions variables expected:
  - `CATALOG_REPO`
  - `CATALOG_BRANCH`
- Repo Actions secret required for CLI release:
  - `NPM_TOKEN`

## Release Flow (CLI)
1. Bump `cli/package.json` version.
2. Push commit to `main`.
3. Push tag `cli-v<version>` (must match `cli/package.json` version).
4. Workflow `.github/workflows/release-cli.yml` validates and publishes to npm.

## Working Rules for Updates
- Any change under `content/`, `schemas/`, `scripts/`, or app code that affects catalog output should be followed by:
  1. `npm run validate:content`
  2. `npm run build:index`
  3. `npm run lint`
  4. `npm run build`
- Commit regenerated artifacts when they change:
  - `public/data/index.json`
  - `public/data/search.json`
  - `public/data/stats.json`
  - `artifacts/validation-report.json`

## Notes
- Prefer static catalog flow for MVP behavior.
- Keep repo metadata and links pinned to `FunkyBlend/codex-templates`.
- If workflow job names change, update branch protection required checks accordingly.
