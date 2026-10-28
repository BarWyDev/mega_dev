---
title: "s01e03 — Building Knowledge Systems"
type: lesson
source: https://hq.mega.dev/lessons/s01e03/
updated: 2026-10-28
trust: high
status: active
tags: [knowledge-base, retrieval, context, self-management]
links: [../../context/course.md, ../../context/agent-setup.md, ../../work/board.md]
---

Agents are becoming the main readers and maintainers of knowledge bases, so you
build the base for them: plain text at the core, the LLM doing the building and
upkeep, and extra context layers so the agent actually reaches the right notes.

## Formats

- Markdown and HTML are what agents handle best. Notion and Drive are fine as *bridges* for humans, not as the core (agents struggle to read images there or to write back).
- mdx / svx add components (e.g. a live checklist) while keeping the source readable.
- Skills and artifacts belong in the base too: templates that steer the model toward consistent output without boxing it in (see overment's `explainer` and `knowledge` skills).

## Retrieval

- **grep / ripgrep:** the agent explores in loops until it's satisfied. Great on text and code, near useless on images and PDFs (fix: sidecar notes describing them).
- **Semantic search:** embeddings find what's *similar in meaning*, which isn't always *relevant*. Needs indexing and chunking, and the embedding model has its own knowledge cutoff.
- **Decision models:** a small, fast model picks files up front (jevgrep), so the agent explores less.
- **Hybrid:** pattern plus similarity. Most complex, usually best.
- For a small personal base, an index file plus summaries is enough (Karpathy's ~100-article wiki needs no search engine).

## Reach

The typical failure: the agent finds notes that *look* complete and never reaches the one that explains why. Raise the odds with:

- **Global context:** machine, tools, projects, principles.
- **Project context:** vision, feature map, styleguide, business side.
- **Metadata:** tags, source, trust, freshness (Open Knowledge Format: Markdown with YAML frontmatter).
- **Broader context:** a board of implemented, active, planned and archived work, so the agent sees what came before and what's next. This also helps when shaping ADRs.

Let the agent choose the structure; steer it rather than design it yourself.

## Building it: the knowledge-skill loop

Define purpose (with you) → build context → try a few structures → set templates → write the skill for working with the base → test with subagents or fresh sessions (with you) → loop back as the base grows. It can run on its own until the model judges it ready, but it needs a clear definition of "good enough".

## Self-management

- **Single inbox** for everything that comes in.
- **Schedules:** daily or weekly dedupe, structure fixes and enrichment. Keep them simple so they can't quietly degrade the base.
- **Events:** merged PRs, new repos, tickets, issues, labeled mail, read-later items. The agent decides what to distill; it doesn't copy.

## The example: a personal "second brain"

Rules: reachable from any device (lives remotely; sync with `mutagen`); the source of truth for its own notes, with pointer notes for things kept elsewhere; grows nearly on its own; kept simple. The resulting skill splits judgment (SKILL.md plus reference notes) from mechanics (scripts for link checks and IDs). Structure: inbox → context / work (planned → active → review → done) / knowledge.

## Applied here

This base is the lesson applied: `CLAUDE.md` as project context, `inbox/`, frontmatter with source and trust, `index.md` instead of search, `work/board.md` for broader context. Gaps it exposed in the setup: see [agent-setup](../../context/agent-setup.md).
