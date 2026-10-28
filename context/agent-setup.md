---
title: Agent setup
type: context
source: inspection of ~/.claude, session 2026-10-28
updated: 2026-10-28
trust: high
status: active
tags: [setup, claude-code]
links: [../knowledge/lessons/s01e03-building-knowledge-systems.md, ../work/s01e02/log.md, ../knowledge/topics/session-handoffs.md]
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
- **Transcriber (added S01E02):** `ffmpeg` and `whisper-cpp` from Homebrew. Model `ggml-large-v3-turbo.bin` in `work/s01e02/models/` (git-ignored). Run `whisper-cli -m <model> -ml 1 -sow -f <file.wav>` for word times; convert media to 16 kHz mono wav with ffmpeg first.
- **HTTP to hq.mega.dev:** use curl. Python urllib gets Cloudflare 403 (error 1010) because of its user agent.

## Gaps (from s01e03)

- No global context: `~/.claude/CLAUDE.md` is missing, so nothing describes the machine, tools or projects before a session starts.
- No skill for building or maintaining a knowledge base.
- No scheduled routine (health check, inbox filing), though scheduled-task tools are available.
- No habit of one subagent per source when a task has several inputs (S01E02 debrief).
- Hand-offs don't label the source of each part. See [session hand-offs](../knowledge/topics/session-handoffs.md).
