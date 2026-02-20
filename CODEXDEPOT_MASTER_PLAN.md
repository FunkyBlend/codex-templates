# Executive Summary
CodexDepot is a community-driven marketplace for Codex resources: Skills, Agents, Commands, Templates, and optional Hooks/Settings. The core idea is simple: contributors add content files in a GitHub repo, open a PR, automated checks validate it, and the website updates from a generated `index.json` without needing a database.

Recommended launch strategy:
- MVP first: read-only website, PR-based contributions, static indexing, no auth, no ratings.
- V1 next: add CLI (`codexdepot`) for list/search/install from repo index.
- V2 later: optional accounts, ratings, favorites, advanced moderation.

Recommended defaults:
- One repo for website + content + validation scripts.
- Next.js + Tailwind + TypeScript.
- Content source in `/content/*`.
- Index generated in CI/build from markdown frontmatter.
- Vercel hosting for MVP.

Success target for first 60 days:
- 100+ published items.
- 20+ merged community PRs.
- <10 minutes from contributor fork to valid PR.
- Zero critical security incidents from contributed content.

# Product Requirements (PRD)
## Problem
Codex users need a trusted, searchable place to discover and share reusable prompts/workflows. Existing examples are scattered across gists, chats, and private notes.

## Product Vision
A “GitHub-first” marketplace where high-quality Codex resources are:
- Easy to discover on a clean website.
- Easy to contribute via PR templates.
- Easy to install/copy via CLI (V1).

## Goals
- Standardize content format across Skills/Agents/Commands/Templates.
- Make contribution beginner-friendly.
- Keep MVP cheap and operationally simple.
- Build trust with validation/moderation guardrails.

## Non-Goals (MVP)
- No login/auth.
- No user-generated comments.
- No ratings/favorites.
- No database-backed admin panel.

## Target Users
- Beginner Codex users who want ready-to-use resources.
- Power users who want reusable building blocks.
- OSS contributors who want attribution for templates.

## Scope by Phase
| Requirement | MVP | V1 | V2 |
|---|---|---|---|
| Public browse/search website | Yes | Yes | Yes |
| Item detail pages with copy/install info | Yes | Yes | Yes |
| PR-based contribution flow | Yes | Yes | Yes |
| Automated schema validation | Yes | Yes | Yes |
| Static index generation from repo | Yes | Yes | Yes |
| CLI list/search/install | Planned | Yes | Yes |
| Download analytics | Basic | Improved | Advanced |
| Accounts/favorites/ratings | No | No | Optional |
| Database | No | Optional | Likely |

## Success Metrics
| Metric | MVP Target | V1 Target |
|---|---|---|
| Time to first useful item for visitor | <2 minutes | <1 minute |
| PR validation pass rate | >80% | >90% |
| Median PR review-to-merge time | <72 hours | <48 hours |
| Search success (user finds item in first query) | >60% | >75% |
| Broken item reports per month | <5 | <3 |

## Non-Functional Requirements
- Fast page loads via static pre-rendering.
- Deterministic builds from repo content.
- Reproducible validation in CI and local.
- Clear contributor docs and templates.
- Safe rendering and content sanitization.

# User Stories
| ID | User Story | Acceptance Criteria | Phase |
|---|---|---|---|
| US-01 | As a visitor, I can search by keyword to find relevant Codex resources quickly. | Search input filters items by title/summary/tags. | MVP |
| US-02 | As a visitor, I can filter by type (skill/agent/command/template). | Filter chips update result list instantly. | MVP |
| US-03 | As a visitor, I can open an item and copy usage instructions. | Detail page has copy buttons for prompt/install snippets. | MVP |
| US-04 | As a visitor, I can see metadata trust signals. | Item shows author, license, updated date, compatibility, tags. | MVP |
| US-05 | As a contributor, I can add a new item by adding files in one folder. | PR passes schema checks if files are valid. | MVP |
| US-06 | As a contributor, I get clear errors when my format is wrong. | CI comments include exact field/file failures. | MVP |
| US-07 | As a maintainer, I can reject unsafe submissions automatically. | CI blocks binaries/secrets/disallowed patterns. | MVP |
| US-08 | As a maintainer, I can review with a consistent checklist. | PR template and labels enforce review flow. | MVP |
| US-09 | As a user, I can run a CLI command to install an item locally. | `codexdepot install <type> <slug>` copies files with conflict handling. | V1 |
| US-10 | As a user, I can list/search from CLI before installing. | CLI supports `list` and `search`. | V1 |
| US-11 | As a maintainer, I can publish CLI updates safely. | Semver releases and changelog are automated. | V1 |
| US-12 | As a returning user, I can save favorites. | Favorite feature exists behind auth. | V2 |

# Architecture Overview
## Recommended Architecture (MVP)
- Source of truth: GitHub repository content files.
- Validation layer: local + CI scripts for schemas and policy checks.
- Build-time indexing: script generates `index.json` and `search.json`.
- Website: Next.js reads generated JSON and renders static pages.
- Deployment: Vercel auto-deploy on main branch.

## Component Map
| Component | Responsibility |
|---|---|
| `content/` | Contributor-submitted Skills/Agents/Commands/Templates |
| `schemas/` | Frontmatter/file contract definitions |
| `scripts/validate-content` | Validate metadata, policy, file safety |
| `scripts/build-index` | Normalize content into searchable JSON |
| `web app` | Home, browse, detail, contribute pages |
| `GitHub Actions` | Run validation/index checks on PR |
| `Vercel` | Host static website and redeploy on merge |

## Data Flow
1. Contributor opens PR with new content folder.
2. CI validates files and frontmatter.
3. Maintainer reviews and merges PR.
4. Main branch build regenerates index.
5. Vercel deploys updated site.
6. Visitors browse and copy/install instructions.

## Why This Works for Beginners
- No DB migrations.
- No auth complexity.
- Git-based moderation.
- Low infra overhead.

# Repo Structure (Canonical)
| Path | Purpose |
|---|---|
| `.github/workflows/validate-content.yml` | PR validation checks |
| `.github/PULL_REQUEST_TEMPLATE.md` | Contributor checklist |
| `.github/CODEOWNERS` | Required reviewer ownership |
| `content/skills/<slug>/SKILL.md` | Skill entries |
| `content/agents/<slug>/AGENT.md` | Agent entries |
| `content/commands/<slug>/COMMAND.md` | Command entries |
| `content/templates/<slug>/item.yaml` | Template metadata |
| `content/templates/<slug>/files/*` | Template installable files |
| `content/hooks/<slug>/hook.json` | Optional hook entries |
| `content/settings/<slug>/settings.json` | Optional settings entries |
| `schemas/item-frontmatter.schema.json` | Common metadata schema |
| `schemas/template.schema.json` | Template-specific schema |
| `scripts/validate-content.ts` | Validation runner |
| `scripts/build-index.ts` | Index generation runner |
| `scripts/build-search.ts` | Search index generator |
| `public/data/index.json` | Generated catalog metadata |
| `public/data/search.json` | Generated search tokens |
| `src/app/page.tsx` | Home page |
| `src/app/browse/page.tsx` | Browse/search page |
| `src/app/items/[type]/[slug]/page.tsx` | Item detail page |
| `src/app/contribute/page.tsx` | Contribution guide page |
| `docs/CONTRIBUTING.md` | Human-friendly contribution docs |
| `docs/MODERATION.md` | Maintainer moderation policy |
| `cli/` | CLI package (V1) |

# Content Formats & Schemas
## Common Frontmatter Contract (for markdown items)
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | Yes | Globally unique; format `type.slug` |
| `type` | enum | Yes | `skill`, `agent`, `command`, `template`, `hook`, `setting` |
| `title` | string | Yes | Human-readable item title |
| `summary` | string | Yes | One-sentence description |
| `tags` | string[] | Yes | 3-8 lowercase tags |
| `author` | string | Yes | GitHub handle preferred |
| `license` | string | Yes | SPDX identifier, usually `MIT` |
| `compatibility` | string[] | Yes | Example: `codex-cli`, `vscode`, `cursor` |
| `updated_at` | date | Yes | ISO date |
| `created_at` | date | Optional | ISO date |
| `difficulty` | enum | Optional | `beginner`, `intermediate`, `advanced` |
| `safety_notes` | string | Optional | Required when risky instructions exist |
| `source_url` | URL | Optional | External reference |

## Type-Specific File Rules
| Type | Required File | Required Extra Fields |
|---|---|---|
| Skill | `SKILL.md` | `compatibility`, `tags`, `summary` |
| Agent | `AGENT.md` | `compatibility`, `tags`, `summary` |
| Command | `COMMAND.md` | `compatibility`, `tags`, `summary` |
| Template | `item.yaml` + `files/` | `install_path`, `entry_files`, `template_version` |
| Hook | `hook.json` + `README.md` | `trigger`, `runtime`, `permissions` |
| Setting | `settings.json` + `README.md` | `target_tool`, `schema_version` |

## Slug and Path Rules
- Slug format: lowercase kebab-case only.
- One folder per item.
- Folder name is canonical slug.
- No spaces or uppercase in folder/file names.
- Markdown body must include a “Usage” section.

## Recommended Defaults
- Default license: `MIT`.
- Default difficulty: `beginner` unless clearly advanced.
- Default compatibility: include at least `codex-cli`.

# Contribution Workflow (PR-based)
1. Contributor forks repo.
2. Contributor creates branch `add/<type>-<slug>`.
3. Contributor copies starter template from `content/_starter`.
4. Contributor fills frontmatter and instructions.
5. Contributor runs local validation command.
6. Contributor opens PR using template.
7. CI runs schema, policy, and safety checks.
8. Maintainer reviews with moderation checklist.
9. Maintainer merges when checks pass.
10. Site auto-deploys with regenerated index.

## Required PR Checks
- Frontmatter schema validation.
- Allowed file extension check.
- Secret scan.
- Markdown lint.
- Duplicate slug/id detection.
- Link validation (best-effort).

## Maintainer Review Policy
- Require at least 1 maintainer approval.
- Require all CI checks green.
- Require explicit safety note for risky commands.
- Reject entries without clear licensing/attribution.

# Website Features & Pages
## MVP Pages
| Route | Purpose | MVP Features |
|---|---|---|
| `/` | Landing page | Hero, category cards, search box, top badges, featured items |
| `/browse` | Discovery | Filter by type/tag/tool, sort by newest/popular, quick preview |
| `/items/[type]/[slug]` | Item detail | Metadata, markdown instructions, copy buttons, install command snippet |
| `/contribute` | Contributor onboarding | Step-by-step PR guide, starter templates, policy checklist |
| `/about` | Trust and scope | Mission, governance, moderation policy link |

## MVP UX Requirements
- Search is instant on local JSON.
- Filters are multi-select and URL-shareable.
- Detail page includes “Copy” and “View source on GitHub.”
- Compatibility badges are visible above fold.
- Mobile layout supports browsing and copy actions.

## V1 Page Enhancements
- Changelog/recently added feed.
- “Collections” page curated by maintainers.
- CLI docs page with install examples.

# CLI Tool (Optional but Planned)
## Placement
- Defer implementation to V1, but design now.
- Keep source in `cli/` folder in same repo.

## CLI Goals
- List available items quickly.
- Search by keyword/type/tag.
- Install item files into local project safely.
- Stay synced with GitHub repo as source of truth.

## Proposed Commands
- `codexdepot list`
- `codexdepot search "<query>"`
- `codexdepot install <type> <slug>`
- `codexdepot info <type> <slug>`
- `codexdepot doctor`

## Install Behavior (Recommended Default)
- Pull index from raw GitHub URL or site-hosted `index.json`.
- Download only selected item files.
- Show planned file writes before applying.
- Prompt on file conflict unless `--force`.
- Support `--dry-run` and `--target <path>`.

## Versioning Strategy
- CLI uses SemVer (npm package releases).
- Index includes `index_version` and `generated_at`.
- Each item includes `content_version` (git commit SHA).
- CLI can pin install to specific commit/tag for reproducibility.

# Data Indexing Pipeline (How the site reads repo content)
## Pipeline Stages
1. Discover content files under `content/**`.
2. Parse frontmatter for markdown items.
3. Validate required fields and enums.
4. Validate type-specific file contracts.
5. Normalize metadata.
6. Compute slug, route, and canonical paths.
7. Extract searchable text fields.
8. Generate `index.json` and `search.json`.
9. Fail build on hard validation errors.
10. Emit human-readable validation report.

## Generated Outputs
| File | Purpose |
|---|---|
| `public/data/index.json` | Full item metadata and file links |
| `public/data/search.json` | Lightweight search token dataset |
| `public/data/stats.json` | Counts by type/tag/tool for badges |
| `artifacts/validation-report.json` | CI diagnostics for contributors |

## Index Record (Required Fields)
- `id`, `type`, `slug`, `title`, `summary`
- `tags`, `author`, `license`, `compatibility`
- `updated_at`, `content_path`, `raw_url`
- `route`, `install_hint`, `render_excerpt`

## Build Integration
- PR CI: run validation + dry-run index build.
- Main branch build: regenerate index used by site deploy.
- Optional nightly job: dead-link check + freshness report.

# Moderation, Validation & Security
## Automated Guardrails
| Control | Rule | Action |
|---|---|---|
| File type allowlist | Only md/mdx/yaml/yml/json/txt and template text files | Block PR |
| Binary detection | Reject images/executables in content dirs unless approved template asset path | Block PR |
| Secret scanning | Run gitleaks or equivalent | Block PR |
| Frontmatter lint | Required fields + type safety | Block PR |
| Dangerous pattern scan | Detect `curl|bash`, encoded PowerShell, silent remote scripts | Require safety note + manual review |
| External link policy | Flag untrusted/shortened URLs | Warn or block |
| License check | SPDX required; no “unknown” | Block PR |
| Duplicate detection | Duplicate slug/id/title similarity | Block PR |

## Human Moderation Checklist
- Is description accurate and non-misleading?
- Are instructions reproducible?
- Are security warnings sufficient?
- Is attribution/license clear?
- Is this high-quality and in-scope?

## Security Posture for MVP
- Render markdown with sanitization.
- Never execute contributed code server-side.
- Treat all contributed text as untrusted input.
- Keep dependencies updated via Dependabot.

# Badges Explained + How to Implement Them
## Badge Set for README + Homepage Top Bar
| Badge | Why it matters | Source |
|---|---|---|
| GitHub stars | Social proof and project traction | Shields + GitHub repo |
| License | Legal clarity for reuse | Shields + repo license |
| npm downloads (CLI) | Adoption signal | Shields + npm package |
| Sponsors | Sustainability signal | GitHub Sponsors link/badge |
| Validated items count | Catalog depth and freshness | Generated `stats.json` |

## Implementation Guidance
- Put badges in repo README top section.
- Mirror key badges on website home hero.
- Use server-side render for badge URLs to avoid client flicker.
- Cache badge responses and provide text fallback on failure.
- Keep badge list short to avoid visual clutter.

## Recommended Badge Policy
- Keep 4-6 badges maximum.
- Include at least stars, license, and validated items.
- Add npm downloads only once CLI is actually published.

# Tech Stack Recommendation (Beginner-Friendly)
## Recommended Defaults Table
| Layer | Recommended | Why |
|---|---|---|
| Language | TypeScript | Strong typing for schemas/index pipeline |
| Web framework | Next.js (App Router) | Great docs, Vercel-native deployment |
| Styling | Tailwind CSS | Fast iteration, predictable utility classes |
| Markdown parsing | `gray-matter` + `remark` + `rehype-sanitize` | Reliable frontmatter + safe rendering |
| Validation | `zod` or JSON Schema + `ajv` | Clear contributor errors |
| Search (MVP) | JSON + MiniSearch/FlexSearch | No backend dependency |
| Testing | Vitest + Playwright | Unit + E2E coverage |
| CI | GitHub Actions | Native PR automation |
| Hosting | Vercel | Fast setup, preview deployments |
| CLI (V1) | Node.js + Commander | Familiar tooling and npm distribution |

## Stack Decisions to Avoid Overthinking
- Use npm for package manager initially.
- Keep one repository for MVP.
- Skip database/auth until real need appears.
- Use static JSON indexing first.

# Step-by-Step Milestones (MVP → V1 → V2)
## Milestone 0: Foundation (Week 1)
1. Create repo and base Next.js app.
2. Add `content/`, `schemas/`, `scripts/`, `docs/`.
3. Add CONTRIBUTING and PR template.
4. Add starter examples for each content type.
5. Set up basic CI workflow.

Exit criteria:
- Repo builds.
- CI runs.
- Contributors can see clear docs.

## Milestone 1: Content Contract + Indexing (Week 2)
1. Define frontmatter schema.
2. Build `validate-content` script.
3. Build `build-index` script.
4. Generate first `index.json` from sample content.
5. Fail CI on invalid submissions.

Exit criteria:
- Index generation is deterministic.
- Validation errors are clear and actionable.

## Milestone 2: Website MVP (Week 3-4)
1. Build Home page with categories/search.
2. Build Browse page with filters/sort.
3. Build Item detail page with markdown render and copy actions.
4. Build Contribute page with PR steps.
5. Add top badges and metadata cards.

Exit criteria:
- End-to-end browse-to-detail flow works.
- Site fully reads from generated JSON.
- No database required.

## Milestone 3: Launch Hardening (Week 4-5)
1. Add security checks (secrets/binaries/dangerous patterns).
2. Add moderation checklist and CODEOWNERS.
3. Add basic analytics for page and copy events.
4. Polish mobile UX and accessibility.
5. Launch publicly.

Exit criteria:
- Safe moderation baseline in place.
- Public launch ready.

## Milestone 4: V1 CLI (Week 6-8)
1. Scaffold CLI package.
2. Implement list/search/install/info.
3. Add dry-run and overwrite prompts.
4. Publish package to npm.
5. Add CLI docs page and badge.

Exit criteria:
- Users can install by slug reliably.
- CLI versions and content versions are traceable.

## Milestone 5: V2 Expansion (Post-launch)
1. Evaluate need for accounts/favorites.
2. Add ratings and abuse reporting.
3. Introduce DB only if needed for dynamic features.
4. Add curated collections and editor tools.

Exit criteria:
- New complexity is justified by usage metrics.

# Implementation Checklist
- [ ] Initialize repo and Next.js app.
- [ ] Add folder scaffolding for content types.
- [ ] Write `docs/CONTRIBUTING.md`.
- [ ] Add PR template and issue templates.
- [ ] Define frontmatter schema.
- [ ] Implement local content validator.
- [ ] Implement CI validator workflow.
- [ ] Implement index generation script.
- [ ] Implement search index generation.
- [ ] Build home page.
- [ ] Build browse/filter page.
- [ ] Build item detail page.
- [ ] Build contribute page.
- [ ] Add metadata badges on item cards.
- [ ] Add copy-to-clipboard actions.
- [ ] Add markdown sanitization.
- [ ] Add dangerous-pattern scanner.
- [ ] Add binary and extension checks.
- [ ] Add secret scanning in CI.
- [ ] Add CODEOWNERS and moderation docs.
- [ ] Configure Vercel project.
- [ ] Add custom domain.
- [ ] Add launch checklist.
- [ ] Collect initial seed content (20+ items).
- [ ] Publish project README badges.
- [ ] Scaffold CLI package (V1).
- [ ] Implement CLI list/search/install/info (V1).
- [ ] Publish npm package and add download badge (V1).
- [ ] Define V2 decision gates from metrics.

# Testing Plan
## MVP Test Layers
| Layer | Tooling | What to test |
|---|---|---|
| Schema tests | Vitest | Required fields, enums, invalid cases |
| Script tests | Vitest | Slug generation, dedupe, path normalization |
| UI unit tests | Testing Library | Search/filter components and copy buttons |
| E2E tests | Playwright | Home → Browse → Detail → Copy flow |
| CI policy tests | GitHub Actions | Secrets, binaries, dangerous text patterns |

## Acceptance Test Scenarios
- Valid Skill PR passes all checks.
- Invalid frontmatter PR fails with exact error.
- Duplicate slug PR fails.
- Browse filters update URL correctly.
- Detail page renders markdown safely.
- Copy button works on desktop/mobile.

## Regression Plan
- Run full test suite on PR and main.
- Keep golden snapshot for sample `index.json`.
- Add smoke test after deployment.

# Deployment Plan
## MVP Deployment (Recommended)
1. Host repo on GitHub.
2. Connect repo to Vercel.
3. Configure build to run validation + index generation.
4. Deploy from `main` with preview deploys on PRs.
5. Add custom domain and HTTPS.
6. Set up error monitoring.

## Branch and Release Strategy
- `main` for production.
- Short-lived feature branches.
- Required PR checks before merge.
- Tag releases for major milestones (`v0.x`, `v1.0.0`).

## Rollback Strategy
- Use Vercel previous deployment restore.
- Keep content change isolated by PR for easy revert.
- Re-run index build from known good commit.

## Optional Droplet Deployment (Later)
- Use Node runtime + PM2 + Nginx reverse proxy.
- Build once and deploy artifact.
- Keep Vercel as fallback during migration.

# Cost Estimates (rough)
## Monthly Cost Scenarios
| Item | MVP Lean (Public Repo) | Growth (Pro + CLI) |
|---|---:|---:|
| Domain | $1-$2/month equivalent | $1-$2/month equivalent |
| GitHub repo | $0 | $0-$4 (optional paid features) |
| GitHub Actions | Usually $0 for public repo standard runners | Variable for private/heavy usage |
| Vercel | $0 (Hobby) | Starts around $20/month Pro platform fee |
| Optional Droplet (self-host) | Not needed | Starts around $4-$24/month basic tiers |
| Monitoring/analytics | $0 (basic/free tiers) | $0-$20 |

Estimated total:
- MVP lean: about $0-$5/month + domain.
- Growth path: about $25-$70/month depending usage and tooling.

Pricing references:
- Vercel pricing/docs: https://vercel.com/docs/pricing and https://vercel.com/docs/plans/pro
- GitHub Actions billing docs: https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions
- DigitalOcean Droplet pricing: https://www.digitalocean.com/pricing/droplets

# “Gotchas” & Risk Mitigation
| Risk | Why it happens | Mitigation |
|---|---|---|
| Schema drift | Contributors use inconsistent metadata | Strict validation and starter templates |
| Unsafe instructions | PR includes risky shell snippets | Pattern scan + required safety notes + manual review |
| Search quality poor | Basic token matching misses intent | Add synonym map and tag normalization in V1 |
| Content quality variance | Open contribution model | Maintainer checklist + curation labels |
| Contributor drop-off | Contribution process feels hard | One-folder starter templates + clear CI errors |
| Build instability | Parser edge cases in markdown | Golden test fixtures and strict parser tests |
| Scope creep | Too many features before launch | Freeze MVP scope and enforce milestone gates |

# Appendix: Example Files (minimal examples)
## Example 1: Skill File (`content/skills/commit-message-helper/SKILL.md`)
```md
---
id: skill.commit-message-helper
type: skill
title: Commit Message Helper
summary: Generate conventional commits from staged changes.
tags: [git, commits, productivity]
author: "@alice"
license: MIT
compatibility: [codex-cli, vscode]
updated_at: 2026-02-20
difficulty: beginner
---

# Commit Message Helper

## Usage
1. Run `git diff --staged`.
2. Summarize the change in one line.
3. Output Conventional Commit format.
```

## Example 2: Agent File (`content/agents/refactor-review/AGENT.md`)
```md
---
id: agent.refactor-review
type: agent
title: Refactor Review Agent
summary: Reviews refactors for regressions and missing tests.
tags: [review, refactor, testing]
author: "@bob"
license: MIT
compatibility: [codex-cli]
updated_at: 2026-02-20
---

# Refactor Review Agent

## Prompt
You are a strict reviewer. Find regressions, risks, and missing tests.
```

## Example 3: Command File (`content/commands/issue-triage/COMMAND.md`)
```md
---
id: command.issue-triage
type: command
title: Issue Triage Command
summary: Classifies incoming issues by severity and area.
tags: [triage, support, workflow]
author: "@carol"
license: MIT
compatibility: [codex-cli, github]
updated_at: 2026-02-20
---

# Issue Triage Command

## Command
Classify issue into: bug, feature, question. Assign severity and next action.
```

## Example 4: Template Folder Structure
```text
content/templates/nextjs-codex-starter/
  item.yaml
  README.md
  files/
    package.json
    src/
      prompts/
        starter.md
```

## Example 5: Sample Generated `index.json`
```json
{
  "index_version": "1.0.0",
  "generated_at": "2026-02-20T12:00:00Z",
  "total_items": 2,
  "items": [
    {
      "id": "skill.commit-message-helper",
      "type": "skill",
      "slug": "commit-message-helper",
      "title": "Commit Message Helper",
      "summary": "Generate conventional commits from staged changes.",
      "tags": ["git", "commits", "productivity"],
      "author": "@alice",
      "license": "MIT",
      "compatibility": ["codex-cli", "vscode"],
      "updated_at": "2026-02-20",
      "content_path": "content/skills/commit-message-helper/SKILL.md",
      "raw_url": "https://raw.githubusercontent.com/FunkyBlend/codex-templates/main/content/skills/commit-message-helper/SKILL.md",
      "route": "/items/skill/commit-message-helper",
      "install_hint": "codexdepot install skill commit-message-helper",
      "render_excerpt": "Generate conventional commits from staged changes."
    },
    {
      "id": "agent.refactor-review",
      "type": "agent",
      "slug": "refactor-review",
      "title": "Refactor Review Agent",
      "summary": "Reviews refactors for regressions and missing tests.",
      "tags": ["review", "refactor", "testing"],
      "author": "@bob",
      "license": "MIT",
      "compatibility": ["codex-cli"],
      "updated_at": "2026-02-20",
      "content_path": "content/agents/refactor-review/AGENT.md",
      "raw_url": "https://raw.githubusercontent.com/FunkyBlend/codex-templates/main/content/agents/refactor-review/AGENT.md",
      "route": "/items/agent/refactor-review",
      "install_hint": "codexdepot install agent refactor-review",
      "render_excerpt": "Reviews refactors for regressions and missing tests."
    }
  ]
}
```

## Example 6: GitHub Action Workflow (`.github/workflows/validate-content.yml`)
```yaml
name: Validate Content

on:
  pull_request:
    paths:
      - "content/**"
      - "schemas/**"
      - "scripts/**"
      - ".github/workflows/validate-content.yml"

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run validate:content
      - run: npm run build:index -- --check
```

## Example 7: Shields.io Badge URLs + Placement
```md
<!-- Put these at the top of README.md and mirror key ones on homepage hero -->

![GitHub stars](https://img.shields.io/github/stars/FunkyBlend/codex-templates?style=for-the-badge)
![License](https://img.shields.io/github/license/FunkyBlend/codex-templates?style=for-the-badge)
![npm downloads](https://img.shields.io/npm/dm/codexdepot?style=for-the-badge)
![Sponsor](https://img.shields.io/badge/sponsor-GitHub_Sponsors-ea4aaa?style=for-the-badge)
![Validated items](https://img.shields.io/badge/items-128-success?style=for-the-badge)
```
