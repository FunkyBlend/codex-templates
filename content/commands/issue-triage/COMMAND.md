---
id: command.issue-triage
type: command
title: Issue Triage Command
summary: Classify incoming issues by severity, area, and next action.
tags: [triage, support, workflow]
author: "@codexdepot"
license: MIT
compatibility: [codex-cli, github]
updated_at: 2026-02-20
difficulty: beginner
---

# Issue Triage Command

## Usage
1. Label issue type: `bug`, `feature`, or `question`.
2. Set severity: `low`, `medium`, `high`, or `critical`.
3. Assign owner and recommend immediate next action.

## Output Contract
Return a compact JSON object with `type`, `severity`, `owner`, and `next_action`.

