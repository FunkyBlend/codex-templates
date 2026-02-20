# Contributing to CodexDepot

CodexDepot is a PR-driven catalog. GitHub content files are the source of truth.

## Quick Start
1. Fork the repo.
2. Create a branch named `add/<type>-<slug>`.
3. Copy the matching starter from `content/_starter/`.
4. Add your item under one canonical folder:
   - `content/skills/<slug>/SKILL.md`
   - `content/agents/<slug>/AGENT.md`
   - `content/commands/<slug>/COMMAND.md`
   - `content/templates/<slug>/item.yaml` + `files/`
   - `content/hooks/<slug>/hook.json` + `README.md`
   - `content/settings/<slug>/settings.json` + `README.md`
5. Run checks locally:
   - `npm run validate:content`
   - `npm run build:index`
6. Open a PR using the PR template.

## Metadata Rules
- `id` must be globally unique and follow `type.slug`.
- `type` must match the folder type.
- `slug` is the folder name and must be lowercase kebab-case.
- `tags` should be 3 to 8 lowercase tags.
- `license` should be a valid SPDX identifier (for example: `MIT`).
- `updated_at` must be ISO date (`YYYY-MM-DD`).
- Markdown item bodies must include a `## Usage` section.

## Validation and Safety
Automated checks enforce:
- frontmatter/template schema validity,
- file extension allowlist,
- binary file blocking,
- duplicate `slug` / `id` detection,
- dangerous command pattern warnings,
- basic secret pattern detection.

CI runs additional secret scanning integration via GitHub Action.

## Contributor Quality Bar
- Keep instructions reproducible.
- Explain risk where commands execute remote scripts.
- Include clear attribution/source URLs when content is derived from another project.
- Keep scope focused on Codex-related workflows.

