# CodexDepot CLI

CLI for browsing and installing CodexDepot catalog items.

## Commands
- `codexdepot doctor`
- `codexdepot list`
- `codexdepot search "<query>"`
- `codexdepot info <type> <slug>`
- `codexdepot install <type> <slug>`

## Common Flags
- `--index <path-or-url>`: override index source.
- `--json`: machine-readable output where supported.
- `--target <path>`: install target path.
- `--ref <tag-or-commit>`: pin install source to a specific git ref.
- `--dry-run`: show planned writes only.
- `--force` / `--overwrite`: skip overwrite prompts.

## Default Index Behavior
1. Use `--index` when provided.
2. Else use `CODEXDEPOT_INDEX_URL` when set.
3. Else read local `public/data/index.json` from current directory.

## Install Behavior
- Shows file write plan before applying.
- Prompts on conflicts unless `--force`/`--overwrite`.
- Supports `--dry-run`.
- Supports reproducible installs with `--ref` (tag or commit SHA).
