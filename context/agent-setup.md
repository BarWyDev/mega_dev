---
title: Agent setup
type: context
source: inspection of ~/.claude, session 2026-10-28
updated: 2026-11-09
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
- **Skills:** Cloudflare set (workers, wrangler, durable-objects, sandbox, …), Supabase, find-skills, capture (symlink to `~/.agents/skills/capture`, added 2026-11-09 for S03E01).
- **Synced skills (checked 2026-11-09):** `~/.claude/skills/synced/<id>/` holds the skills of the human's claude.ai account, copied there by Claude Code and listed to the model as `anthropic-skills:<name>`. `manifest.json` in that folder names each skill and its source: Anthropic's own (pdf, docx, pptx, xlsx), Anthropic examples (docs, morning, import-memory, skill-creator, google-workspace) and the human's own uploads (copilot-prompt, python-course, llms-from-scratch-tutor). Sync rewrites the folder, so change these skills on claude.ai, not on disk. Inferred from the manifest and the listing prefix; not from docs.
- **MCP:** MEGA course server; Supabase and Cloudflare need `/mcp` auth.
- **Plans:** loose files in `~/.claude/plans`, no status board.
- **Memory:** per-project memory folder for mega_dev exists, empty.
- **Transcriber (added S01E02):** `ffmpeg` and `whisper-cpp` from Homebrew. Model `~/.cache/whisper/ggml-large-v3-turbo.bin`, shared by all Challenges. Run `whisper-cli -m <model> -ml 1 -sow -f <file.wav>` for word times; convert media to 16 kHz mono wav with ffmpeg first.
- **HTTP to hq.mega.dev:** use curl. Python urllib gets Cloudflare 403 (error 1010) because of its user agent.

## Gaps (from s01e03)

- No global context: `~/.claude/CLAUDE.md` is missing, so nothing describes the machine, tools or projects before a session starts.
- No skill for building or maintaining a knowledge base.
- No scheduled routine (health check, inbox filing), though scheduled-task tools are available.
- No habit of one subagent per source when a task has several inputs (S01E02 debrief).
- Hand-offs don't label the source of each part. See [session hand-offs](../knowledge/topics/session-handoffs.md).
