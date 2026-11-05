---
title: Work board
type: task
source: session 2026-10-28
updated: 2026-11-05
trust: high
status: active
tags: [board]
links: [../context/course.md, ../knowledge/lessons/s02e04-multi-agent-collaboration.md, ../knowledge/lessons/s02e03-agentic-capabilities.md, ../knowledge/lessons/s02e02-building-an-agent.md, ../knowledge/lessons/s02e01-agentic-primitives.md, ../knowledge/topics/limen-mapping.md, s01e01/log.md, s01e02/log.md, s01e03/log.md, s01e04/log.md, s01e05/log.md, s02e01/log.md, s02e02/log.md, s02e03/log.md, s02e04/log.md]
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

- S02E04: add a rule to `CLAUDE.md`: side sessions don't write `log.md`, `index.md` or `work/board.md`; they return the lines and the main session writes them (parallel instances on shared files conflict). ([note](../knowledge/lessons/s02e04-multi-agent-collaboration.md#do-zastosowania-w-tym-setupie), item 4)
- S02E04: first project subagent `.claude/agents/source-reader.md`: read-only tools and a fixed result contract (source, facts with quotes, what's missing). Replaces the "one source-reader subagent" limen port. ([note](../knowledge/lessons/s02e04-multi-agent-collaboration.md#do-zastosowania-w-tym-setupie), item 2)
- S02E04: publish an Agent Card (`/.well-known/agent-card.json`, skills only) on the mail agent or barwy-tools and read it from another session. Needs a yes before deploy. ([note](../knowledge/lessons/s02e04-multi-agent-collaboration.md#do-zastosowania-w-tym-setupie), item 6)
- S02E04: `traceId` per incoming mail in every mail-agent log line. ([note](../knowledge/lessons/s02e04-multi-agent-collaboration.md#do-zastosowania-w-tym-setupie), item 8)
- S02E03: barwy-tools code lives only in `work/s02e03/repo/` (local git, git-ignored); give it its own GitHub repo and a pointer note (needs a yes). Built on SDK v2 + workers-oauth-provider instead of streamable-mcp-server-template. ([note](../knowledge/lessons/s02e03-agentic-capabilities.md#do-zastosowania-w-tym-setupie), item 7)
- S02E03: add a one-line reason ("because …") to each rule in `CLAUDE.md` Rules. (note, item 2)
- S02E02 follow-up: a per-sender daily cap in the mail agent so a burst of mail cannot spend the model budget. See [log](s02e02/log.md).
- S02E02: check in a fresh session that the SessionStart hook's state reaches the agent: ask what is pending without letting it read files.
- S02E02: `tools/check.ts` fails when `log.md` no longer starts with its `HEAD` version, so the journal stays append-only. (note, item 2)
- S02E02: extend the agent-loop experiment with a loop-only `journal.jsonl` and an agent-edited `schedule.yaml`; the weekly health check records when its next run should be and why. (note, items 4 and 8)
- S02E01: build a naive agent loop in TS with the Anthropic SDK (one bash tool, token-logging hook, break the network mid-run) and measure `cache_read_input_tokens` before and after a one-word system prompt change. Code in its own repo, pointer note here. ([note](../knowledge/lessons/s02e01-agentic-primitives.md#do-zastosowania-w-tym-setupie), items 6–7)
- S02E01: when a Standing choice is replaced, log the old and new text in `log.md`, and say so in the Standing choices section (needs the human's yes, since only they change that section). (note, item 8)
- S02E01 follow-up: add a Stop hook that re-checks sources before the agent stops; turn the session-flatten script into a recall skill. See [log](s02e01/log.md).
- S01E05: confirm the leaked AI Studio key (starts `AQ.Ab8R`) is revoked; if MODEL_KEY held the same key, it is gone with the Worker anyway.
- S01E05 gap: the test writer on the host only reports a red line, it never runs the test. Add a step that runs it red on the base and green on the fix (C6 "A test that never failed proves nothing").
- S01E04 debrief gaps: write the approved issue shape into the rig repo (skill or AGENTS.md) and a rule/skill for Pages uploads. See [log](s01e04/log.md).
- Ports from limen still open: worker rules in global CLAUDE.md, one source-reader subagent. See [limen mapping](../knowledge/topics/limen-mapping.md#ports-smallest-first).
- Effort experiment: same small task at low and high effort, compare tokens, time and findings. (s01e04 Try today)
- Delete the S01E03 repo https://github.com/BarWyDev/mega-s01e03-what-it-shows (course accepted; needs the human's yes).
- Add a global `~/.claude/CLAUDE.md` (machine, tools, projects, principles). See [agent-setup](../context/agent-setup.md). Rules the lesson notes add: a test counts only if it ran red on the base and green on the fix (s01e05); skills as plain `SKILL.md` in the repo, linked not copied (s01e04); skill when the task needs this thread, agent when it can run apart (s01e02).
- Test the `lesson-notes` skill in a fresh session: a few asks that should trigger it and a few near misses; fix the description from the result. Keep the cases in a file and rerun after every description change (s02e01 eval loop). ([s01e02](../knowledge/lessons/s01e02-steering-models-through-context.md#do-zastosowania-w-tym-setupie), item 6)
- Find out what `~/.claude/skills/synced/` is and where it came from; record it in `context/agent-setup.md`. (s01e02, item 8)
- Fill the empty mega_dev memory folder with preferences that don't belong in the base (e.g. lesson notes in Polish). (s01e02, item 3)
- Remove duplicate Cloudflare skills: same skills in `~/.claude/skills/` and the cloudflare plugin, so each is listed twice to the model. Needs the human's yes. ([s01e01 note](../knowledge/lessons/s01e01-mechanics-behind-generative-ai.md#do-zastosowania-w-tym-setupie), item 5)
- Run `request-inspector` against Claude Code once and record what it sends besides the message. (s01e01, item 4)
- Weekly health check as a scheduled task, once the base has enough notes to be worth checking. Same run: scan recent sessions and propose fixes to skills, CLAUDE.md and hooks (s01e02 self-improving loop, item 5), and list what to remove: rules, hooks, skills and plugins the agent no longer needs (s02e03, item 4). Also a heartbeat: last activity of the mail agent and barwy-tools in their Worker logs (s02e04, item 7).

## Done

- 2026-11-05 — Challenge "two places" (S02E04) solved on the first claim: job 1 (incident-lookup) in a Claude Code cloud session after the human allowed hq.mega.dev in its network access, job 2 (voice-to-memo) in a local subagent, join 22:35 US Eastern → 03:35 CET. Course left the "crew" artifact in the deck. [Log](s02e04/log.md), debrief https://hq.mega.dev/challenges/two-places#debrief.
- 2026-11-05 — s02e04 "Multi-Agent Collaboration": lesson text saved, lesson note written. [Note](../knowledge/lessons/s02e04-multi-agent-collaboration.md).
- 2026-11-05 — Challenge "schema first" (S02E03) solved on claim 12: own remote MCP server barwy-tools on Cloudflare (https://barwy-tools.barwy.workers.dev/mcp, user-scope in Claude Code), stays up. Course left the "hands" artifact in the deck. [Log](s02e03/log.md), debrief https://hq.mega.dev/challenges/schema-first#debrief.
- 2026-11-04 — s02e03 "Agentic Capabilities": lesson text saved, lesson note written. [Note](../knowledge/lessons/s02e03-agentic-capabilities.md).
- 2026-11-03 — Challenge "nobody asked" (S02E02) solved on the 3rd round: email agent barwy-reader@agentmail.to (Cloudflare Worker mail-agent + AgentMail + Gemini) keeps running. [Log](s02e02/log.md), debrief https://hq.mega.dev/challenges/nobody-asked#debrief.
- 2026-11-03 — SessionStart hook: `tools/state.ts` prints inbox items, the Active lane and the last log entry at session start (s02e02 note, item 3).
- 2026-11-03 — s02e02 "Building an Agent": lesson text saved, lesson note written. [Note](../knowledge/lessons/s02e02-building-an-agent.md).
- 2026-11-02 — Challenge "found out late" (S02E01) solved on the 8th claim. [Log](s02e01/log.md), debrief https://hq.mega.dev/challenges/found-out-late#debrief.
- 2026-11-02 — s02e01 "Agentic Primitives": lesson text saved, brief on the dashboard, lesson note written. [Note](../knowledge/lessons/s02e01-agentic-primitives.md).
- 2026-11-01 — Lesson notes for s01e04 and s01e05 written; s01e03 note rewritten in Polish in the same shape. All five lessons now have notes.
- 2026-10-31 — s01e02 lesson note written with the `lesson-notes` skill. [Note](../knowledge/lessons/s01e02-steering-models-through-context.md).
- 2026-10-31 — s01e01 lesson note written; `lesson-notes` skill added for every next lesson. [Note](../knowledge/lessons/s01e01-mechanics-behind-generative-ai.md).
- 2026-10-30 — S01E05 cleanup: Worker rig-pulse deleted on the human's yes (`wrangler delete`, address now 404).
- 2026-10-30 — Challenge "answer where i asked" (S01E05) solved on the 7th claim (one refusal: no test came back). [Log](s01e05/log.md), debrief https://hq.mega.dev/challenges/answer-where-i-asked#debrief.
- 2026-10-30 — S01E04 cleanup: both repos deleted by the human (API 404, Pages 404); local clones and worktrees moved to the Trash.
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
