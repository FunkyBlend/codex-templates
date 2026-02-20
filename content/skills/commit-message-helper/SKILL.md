---
id: skill.commit-message-helper
type: skill
title: Commit Message Helper
summary: Generate conventional commit messages from staged git changes.
tags: [git, commits, productivity]
author: "@codexdepot"
license: MIT
compatibility: [codex-cli, vscode]
updated_at: 2026-02-20
difficulty: beginner
source_url: https://github.com/openai/codex
---

# Commit Message Helper

## Usage
1. Run `git diff --staged`.
2. Summarize the change in one sentence.
3. Output a Conventional Commit in `type(scope): message` format.

## Notes
- Prefer `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`.
- Keep the subject line under 72 characters.

