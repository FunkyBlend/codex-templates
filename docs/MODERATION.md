# CodexDepot Moderation Guide

This document defines MVP moderation and security policy for repository-based contributions.

## Automated Guardrails
Validation scripts and CI should block PRs for:
- schema errors,
- disallowed file types,
- binary content in catalog folders,
- duplicate item IDs/slugs,
- detected secrets.

Validation should warn for:
- dangerous shell/script patterns (for manual review),
- suspicious external links.

## Manual Review Checklist
1. Is the item clearly in scope for Codex workflows?
2. Is metadata accurate and complete?
3. Are setup and usage steps reproducible?
4. Are risky instructions documented with `safety_notes`?
5. Is license/attribution clear and acceptable?
6. Does this introduce harmful, misleading, or abusive content?

## Merge Policy
- Require at least one maintainer approval.
- Require all required CI checks to pass.
- Reject content that requests unsafe behavior without explicit warnings.

## Security Posture (MVP)
- Treat all contributed content as untrusted.
- Never execute contributed code during rendering.
- Render markdown safely (no raw HTML execution).
- Keep dependencies patched and run regular dependency scanning.

## Incident Handling
1. Revert or disable affected content path.
2. Regenerate index and redeploy.
3. Document incident in maintainer notes.
4. Add or tighten validation rule to prevent recurrence.

