---
title: Work board
type: task
source: session 2026-10-28
updated: 2026-10-30
trust: high
status: active
tags: [board]
links: [../context/course.md, ../knowledge/topics/limen-mapping.md, s01e01/log.md, s01e02/log.md, s01e03/log.md, s01e04/log.md]
---

Planned → active → done → archived. One line per item, with a link to details
when there are any. The newest items go at the top of each lane.

## Standing choices

Decisions that outlast a session. Read before picking a model, starting a
worker, or acting outside this repo. Only the human changes a line; date each
one and replace it rather than adding a second. (Idea from limen's TRACK, see
[limen mapping](../knowledge/topics/limen-mapping.md).)

- 2026-10-28 — Every outside action (create or delete a repo, push, issue, PR, message) needs a yes each time. One yes may cover a named set of pushes inside one Challenge repo.
- 2026-10-28 — Tickets, receipts and secrets are never committed: they stay in git-ignored files under `work/<id>/`.
- 2026-10-28 — A Challenge counts as done when the course accepts the claim, not when the work looks finished.
- 2026-10-28 — Split a folder only when it passes about 15 notes.
- 2026-10-29 — Model: opus for everything, default effort. No routing until the effort experiment gives data.

## Active

- Reach test for this base: in a fresh session, ask a question whose answer is in a note that shares no keywords with it. If the agent misses it, fix `index.md` or the links, not the content. (s01e03 Try today)

## Planned

- Delete the S01E04 repos mega-s01e04-before-i-looked and mega-s01e04-preview (course accepted; needs the human's yes).
- S01E04 debrief gaps: write the approved issue shape into the rig repo (skill or AGENTS.md) and a rule/skill for Pages uploads. See [log](s01e04/log.md).
- Ports from limen still open: worker rules in global CLAUDE.md, one source-reader subagent. See [limen mapping](../knowledge/topics/limen-mapping.md#ports-smallest-first).
- Effort experiment: same small task at low and high effort, compare tokens, time and findings. (s01e04 Try today)
- Delete the S01E03 repo https://github.com/BarWyDev/mega-s01e03-what-it-shows (course accepted; needs the human's yes).
- Add a global `~/.claude/CLAUDE.md` (machine, tools, projects, principles). See [agent-setup](../context/agent-setup.md).
- Back-fill lesson notes for s01e01 and s01e02 (lesson text now in `lessons/`).
- Weekly health check as a scheduled task, once the base has enough notes to be worth checking.

## Done

- 2026-10-30 — Challenge "before i looked" (S01E04) solved on the second claim. [Log](s01e04/log.md), debrief https://hq.mega.dev/challenges/before-i-looked#debrief.
- 2026-10-30 — Lesson text for s01e01–s01e05 in `lessons/` (s01e01–04 from the human's export, s01e05 from the MEGA MCP).
- 2026-10-29 — limen ports 1–2: Standing choices section on this board; `.claude/settings.json` hook runs `tools/check.ts` after every Edit or Write to a `.md` file and feeds errors back.
- 2026-10-29 — Mapped limen onto this base and Claude Code. [Note](../knowledge/topics/limen-mapping.md). (s01e04 Try today)
- 2026-10-28 — Challenge "what it shows" (S01E03) solved on claim 10. [Log](s01e03/log.md), debrief https://hq.mega.dev/challenges/what-it-shows#debrief. Repo can be deleted.
- 2026-10-28 — S01E02 cleanup: whisper model moved to `~/.cache/whisper/`; media, wav files, receipts and ticket deleted.
- 2026-10-28 — Challenge "who said what" (S01E02) solved on the second claim. [Log](s01e02/log.md), debrief https://hq.mega.dev/challenges/who-said-what#debrief. Lesson: [session hand-offs](../knowledge/topics/session-handoffs.md).
- 2026-10-28 — Challenge "somebody slow" (S01E01) solved. [Log](s01e01/log.md), debrief https://hq.mega.dev/challenges/somebody-slow#debrief
- 2026-10-28 — `git init` and `tools/check.ts` health-check script (s01e03 Try today).
- 2026-10-28 — Set up this knowledge base (s01e03 Try today).

## Archived
