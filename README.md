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
