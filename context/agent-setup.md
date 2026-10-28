---
title: Agent setup
type: context
source: inspection of ~/.claude, session 2026-10-28
updated: 2026-10-28
trust: high
status: active
tags: [setup, claude-code]
links: [../knowledge/lessons/s01e03-building-knowledge-systems.md]
---

Claude Code (desktop app and CLI) on macOS, default model opus. Strong on
domain skills, missing the context layers: there is no global CLAUDE.md, and
this base's CLAUDE.md is the only project context.

## What's there

- **Plugins:** supabase, cloudflare, dev-guard (own mod in `~/.claude/mods/dev-guard`, hooks in `rules.ts` and `agents.ts`).
- **Skills:** Cloudflare set (workers, wrangler, durable-objects, sandbox, …), Supabase, find-skills, one synced skill.
- **MCP:** MEGA course server; Supabase and Cloudflare need `/mcp` auth.
- **Plans:** loose files in `~/.claude/plans`, no status board.
- **Memory:** per-project memory folder for mega_dev exists, empty.

## Gaps (from s01e03)

- No global context: `~/.claude/CLAUDE.md` is missing, so nothing describes the machine, tools or projects before a session starts.
- No skill for building or maintaining a knowledge base.
- No scheduled routine (health check, inbox filing), though scheduled-task tools are available.
