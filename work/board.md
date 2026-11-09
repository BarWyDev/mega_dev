---
title: Work board
type: task
source: session 2026-10-28
updated: 2026-11-09
trust: high
status: active
tags: [board]
links: [../context/course.md, ../knowledge/topics/barwy-tools.md, s03e01/log.md, ../knowledge/lessons/s03e01-mechanics-behind-product-engineering.md, ../knowledge/topics/own-agent-loop.md, s02e05/log.md, ../knowledge/lessons/s02e05-agent-reliability.md, ../knowledge/lessons/s02e04-multi-agent-collaboration.md, ../knowledge/lessons/s02e03-agentic-capabilities.md, ../knowledge/lessons/s02e02-building-an-agent.md, ../knowledge/lessons/s02e01-agentic-primitives.md, ../knowledge/topics/limen-mapping.md, s01e01/log.md, s01e02/log.md, s01e03/log.md, s01e04/log.md, s01e05/log.md, s02e01/log.md, s02e02/log.md, s02e03/log.md, s02e04/log.md]
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

- S02E05: dev-guard rule that asks before `git push` and `gh repo create/delete`, with a test in `rules.test.ts`, so the "outside action needs a yes" choice is enforced in code. Global config, needs a yes. ([note](../knowledge/lessons/s02e05-agent-reliability.md#do-zastosowania-w-tym-setupie), item 2; [matrix](https://claude.ai/artifact/LPz6gmA1Aax7n9k83neKB7) #6)

## Planned

- S03E01: read overment's `unknown-unknowns` skill (github.com/overment/skills) and decide whether to add it as a project skill. Downloading it needs a yes. (note, item 5)
- S02E05 debrief gaps for away-agent: append-only event log (one line per receive/notify/reply); phone pings that work from the Worker (ntfy answers 429 to Cloudflare egress: own ntfy server, paid plan, or another push route), tested from inside the host; tighten ntfy topic exposure. See [log](s02e05/log.md).
- S02E05: eval for barwy-tools `memo_search`: 10 queries worded unlike the notes they should find (the lesson's "too easy" trap); run 3 times, report pass^3. ([note](../knowledge/lessons/s02e05-agent-reliability.md#do-zastosowania-w-tym-setupie), item 5)
- S02E05 experiment: send Claude Code sessions of one project to Langfuse for a week and read cost per session type. Sends transcripts out, needs a yes. ([note](../knowledge/lessons/s02e05-agent-reliability.md#do-zastosowania-w-tym-setupie), item 7)
- S02E04: first project subagent `.claude/agents/source-reader.md`: read-only tools and a fixed result contract (source, facts with quotes, what's missing). Replaces the "one source-reader subagent" limen port. ([note](../knowledge/lessons/s02e04-multi-agent-collaboration.md#do-zastosowania-w-tym-setupie), item 2)
- S02E04: `traceId` per incoming mail in every mail-agent log line, plus model, tokens and latency on the model call (s02e05, item 6). ([note](../knowledge/lessons/s02e04-multi-agent-collaboration.md#do-zastosowania-w-tym-setupie), item 8)
- S02E02 follow-up: a per-sender daily cap in the mail agent so a burst of mail cannot spend the model budget. See [log](s02e02/log.md).
- S02E01 follow-up: add a Stop hook that re-checks sources before the agent stops; turn the session-flatten script into a recall skill. See [log](s02e01/log.md).
- Effort experiment: same small task at low and high effort, compare tokens, time and findings. (s01e04 Try today)
- Delete the S01E03 repo https://github.com/BarWyDev/mega-s01e03-what-it-shows (course accepted; needs the human's yes).
- Add a global `~/.claude/CLAUDE.md` (machine, tools, projects, principles). See [agent-setup](../context/agent-setup.md). Include the worker rules from limen ([mapping](../knowledge/topics/limen-mapping.md#ports-smallest-first)). Rules the lesson notes add: a test counts only if it ran red on the base and green on the fix (s01e05); skills as plain `SKILL.md` in the repo, linked not copied (s01e04); skill when the task needs this thread, agent when it can run apart (s01e02).
- Test the `lesson-notes` skill in a fresh session: a few asks that should trigger it and a few near misses; fix the description from the result. Keep the cases in a file (`evals/lesson-notes/cases.md`, 10 hits + 10 near misses) and rerun after every description change; pass^3 (s02e01 eval loop, s02e05 item 4). ([s01e02](../knowledge/lessons/s01e02-steering-models-through-context.md#do-zastosowania-w-tym-setupie), item 6)
- Remove duplicate Cloudflare skills: same skills in `~/.claude/skills/` and the cloudflare plugin, so each is listed twice to the model. Needs the human's yes. ([s01e01 note](../knowledge/lessons/s01e01-mechanics-behind-generative-ai.md#do-zastosowania-w-tym-setupie), item 5)
- Run `request-inspector` against Claude Code once and record what it sends besides the message. (s01e01, item 4)
- Weekly health check as a scheduled task, once the base has enough notes to be worth checking. Same run: scan recent sessions and propose fixes to skills, CLAUDE.md and hooks (s01e02 self-improving loop, item 5), and list what to remove: rules, hooks, skills and plugins the agent no longer needs (s02e03, item 4). Also a heartbeat: last activity of the mail agent and barwy-tools in their Worker logs (s02e04, item 7).

## Done

- 2026-11-09 — barwy-tools has its own private repo https://github.com/BarWyDev/barwy-tools: agent created it on the human's yes, the human pushed `main` (dev-guard blocks the agent), README went in as PR https://github.com/BarWyDev/barwy-tools/pull/1. [Pointer note](../knowledge/topics/barwy-tools.md). (s02e03, item 7)
- 2026-11-09 — Own loop step 8: one `subscribe(trigger)` / `wake(event)` primitive (`subscriptions.ts`, `step8.ts`) with `journal.jsonl`, agent tools `subscribe` and `reschedule`; 20 tests that catch 3 planted bugs; dry run checked. Local commit `5aeb853` in `~/dev/personal/agent-loop`, not pushed (push needs a yes). Not yet run with the model. [Note](../knowledge/topics/own-agent-loop.md).
- 2026-11-09 — `CLAUDE.md` Rules: a "because …" reason on each rule (s02e03, item 2) and a new rule: side sessions don't write `log.md`, `index.md` or `work/board.md` (s02e04, item 4).
- 2026-11-09 — `tools/check.ts` fails when committed lines of `log.md` change; appending still passes. Checked both ways. (s02e02, item 2)
- 2026-11-09 — `~/.claude/skills/synced/` explained in [agent-setup](../context/agent-setup.md): the claude.ai account's skills, synced by Claude Code, listed as `anthropic-skills:<name>`. (s01e02, item 8)
- 2026-11-09 — S03E01 "status for the night" solved: cited requirements list (10 accepted, 5 in 3 conflicts; product chose day-first dates), `capture` skill in `~/.agents/skills/capture`, page live at https://status-for-the-night.barwy.workers.dev. [Log](s03e01/log.md).
- 2026-11-09 — Planned lane triaged with a feasibility matrix (value, complexity, risk for 30 items): [matrix](https://claude.ai/artifact/LPz6gmA1Aax7n9k83neKB7). 3 moved to Active, 6 archived with reasons, 2 closed as done. (s03e01 note, item 2)
- 2026-11-09 — SessionStart hook state reaches the agent: in a fresh session the agent saw inbox, Active lane and last log entry before reading any file. (S02E02 check)
- 2026-11-09 — mega_dev memory folder is in use: `MEMORY.md` holds "Chat in Polish"; further preferences get added as they come up. (s01e02, item 3)
- 2026-11-09 — s03e01 "Mechanics Behind Product Engineering": lesson text saved, lesson note written. [Note](../knowledge/lessons/s03e01-mechanics-behind-product-engineering.md).
- 2026-11-08 — S02E01 own agent loop built step by step with the human (agent wrote the code, human ran and read it): 7 steps in local repo `~/dev/personal/agent-loop` (single call, bash tool, loop, hooks + `trace.jsonl` + guard with tests, network drop with retry/resume, prompt cache before/after a one-word change), then compared with Pi's `agent-loop.ts`. [Note](../knowledge/topics/own-agent-loop.md).
- 2026-11-06 — S01E05 leaked AI Studio key deleted by the human: `...PcRA` (created 2026-10-30, used by nothing since rig-pulse was deleted). `AQ.Ab8R` turned out to be a prefix shared by all new-format keys, not a fingerprint. The mail agent's key `...CWOw` (2026-11-03) stays.
- 2026-11-06 — Reach test for this base passed (s01e03 Try today): 5 questions worded unlike their notes (local speech-to-text, off-machine agents, session hand-offs, most claims, origin of Standing choices), all answered right with the right notes in 1–2 steps. No index or link fixes needed. Caveat: all 5 ran in one session, so `index.md` was in context after the first.
- 2026-11-06 — Challenge "while you're away" (S02E05) solved on the first live try: away-agent Worker (signed HTTPS inbox, policy check in code, phone approval page, ntfy) on Cloudflare, keeps running. [Log](s02e05/log.md), debrief https://hq.mega.dev/challenges/while-youre-away#debrief.
- 2026-11-06 — s02e05 "Agent Reliability": lesson text saved, lesson note written. [Note](../knowledge/lessons/s02e05-agent-reliability.md).
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

- 2026-11-09 — S02E02: extend the own loop (`~/dev/personal/agent-loop`, [note](../knowledge/topics/own-agent-loop.md)) with a loop-only `journal.jsonl` and an agent-edited `schedule.yaml`; the weekly health check records when its next run should be and why. (note, items 4 and 8) Archived: merged into the Active `subscriptions.yaml` item, which also carries `journal.jsonl`.
- 2026-11-09 — S02E04: publish an Agent Card (`/.well-known/agent-card.json`, skills only) on the mail agent or barwy-tools and read it from another session. Needs a yes before deploy. ([note](../knowledge/lessons/s02e04-multi-agent-collaboration.md#do-zastosowania-w-tym-setupie), item 6) Archived: a public deploy nobody reads; the S02E04 Challenge passed without it.
- 2026-11-09 — S02E01: when a Standing choice is replaced, log the old and new text in `log.md`, and say so in the Standing choices section (needs the human's yes, since only they change that section). (note, item 8) Archived: no Standing choice has changed since 2026-10-29; add it when the first one does.
- 2026-11-09 — S01E05 gap: the test writer on the host only reports a red line, it never runs the test. Add a step that runs it red on the base and green on the fix (C6 "A test that never failed proves nothing"). Archived: host rig-pulse was deleted 2026-10-30; the rule "a test must fail first" lives on in the global CLAUDE.md item.
- 2026-11-09 — S01E04 debrief gaps: write the approved issue shape into the rig repo (skill or AGENTS.md) and a rule/skill for Pages uploads. See [log](s01e04/log.md). Archived: both S01E04 repos were deleted 2026-10-30, so there is nowhere to write it.
- 2026-11-09 — Ports from limen still open: worker rules in global CLAUDE.md, one source-reader subagent. See [limen mapping](../knowledge/topics/limen-mapping.md#ports-smallest-first). Archived: duplicate: source-reader is the S02E04 subagent item, worker rules are now part of the global CLAUDE.md item.