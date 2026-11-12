# Index

Every note, one line each. Read this first.

## Context
- [context/course.md](context/course.md) — the MEGA course: where lessons and Challenges live, which are open.
- [context/agent-setup.md](context/agent-setup.md) — the human's Claude Code setup and its gaps, as of 2026-10-28.

## Knowledge
- [knowledge/lessons/s01e01-mechanics-behind-generative-ai.md](knowledge/lessons/s01e01-mechanics-behind-generative-ai.md) — how LLMs work (tokens, prediction, context, compaction, tools), what harnesses hide, what to watch for and apply here.
- [knowledge/lessons/s01e02-steering-models-through-context.md](knowledge/lessons/s01e02-steering-models-through-context.md) — what the agent really sees, context rot and short threads, designing skills, tool results and hints, subagents vs workers; what to apply here.
- [knowledge/lessons/s01e03-building-knowledge-systems.md](knowledge/lessons/s01e03-building-knowledge-systems.md) — agent-first knowledge bases: formats, retrieval, reach, self-management; what this base already applies and what's left.
- [knowledge/lessons/s01e04-working-with-ai-harnesses.md](knowledge/lessons/s01e04-working-with-ai-harnesses.md) — choosing harnesses, Pi + Herdr self-management, limen coordinator/workers through files, model/effort/cost per task, teamwork, repo automation.
- [knowledge/lessons/s01e05-building-workflows-not-tool-stacks.md](knowledge/lessons/s01e05-building-workflows-not-tool-stacks.md) — skills as executable markdown vs code, self-verification, remote agents on a VPS, background workflows, prompt injection defenses, business value.
- [knowledge/lessons/s02e01-agentic-primitives.md](knowledge/lessons/s02e01-agentic-primitives.md) — agent loop and what a harness does around it (recovery, cache prefix, compaction, approvals), five prompt blocks, agentic memory, tool discovery; what to apply here.
- [knowledge/lessons/s02e02-building-an-agent.md](knowledge/lessons/s02e02-building-an-agent.md) — custom agents: primitives (Event, Schedule, Document, Skill, Journal, Channel), gateway and model routing, tool design, mid-turn context; what to apply here.
- [knowledge/lessons/s02e03-agentic-capabilities.md](knowledge/lessons/s02e03-agentic-capabilities.md) — personalization (principles with reasons, supporting hooks, improve/remove review), MCP host/client/server, designing a custom MCP, skills linked to tools; what to apply here.
- [knowledge/lessons/s02e04-multi-agent-collaboration.md](knowledge/lessons/s02e04-multi-agent-collaboration.md) — multi-agent architectures (subagents, hierarchy, team, swarm), A2A and Agent Cards, contracts, managers, heartbeat, orchestration with primitives; what to apply here.
- [knowledge/lessons/s02e05-agent-reliability.md](knowledge/lessons/s02e05-agent-reliability.md) — guardrails (odds vs deterministic blocks, primitives over prompts, moderation), observability (traces, gateway, replay), evals (offline/online, pass^k, too-easy evals); what to apply here.
- [knowledge/lessons/s03e01-mechanics-behind-product-engineering.md](knowledge/lessons/s03e01-mechanics-behind-product-engineering.md) — product engineering: outcome over output, primitives (Subscriptions) vs adapters, PM vs PE, unknown unknowns, feasibility matrix, foundations for leverage; what to apply here.
- [knowledge/lessons/s03e02-translating-intent-into-agent-work.md](knowledge/lessons/s03e02-translating-intent-into-agent-work.md) — intent as principles with reasons, context beyond code (ADR vs durable guidance), agreement (scope, outcome, boundaries, proof), visuals and labs, evaluation; what to apply here.
- [knowledge/lessons/s03e04-verifying-product-outcomes.md](knowledge/lessons/s03e04-verifying-product-outcomes.md) — verifying outcomes: evidence matched to risk (composes / extends / one-way door), acceptance table, agentic lab and routines, system diff, agent review with boundaries, deterministic quality gates; what to apply here.

- [knowledge/topics/barwy-tools.md](knowledge/topics/barwy-tools.md) — own remote MCP server barwy-tools (private repo BarWyDev/barwy-tools): tools, stack, where it runs, how changes reach it.
- [knowledge/topics/limen-mapping.md](knowledge/topics/limen-mapping.md) — coordinator/worker setup (limen, s01e04) mapped onto this base and Claude Code: what's native, what to port.
- [knowledge/topics/own-agent-loop.md](knowledge/topics/own-agent-loop.md) — own naive agent loop in TS (private repo BarWyDev/agent-loop): 8 steps (tools, loop, hooks, trace, guard, retry/resume, prompt cache, subscriptions) and how it compares with Pi's agent-loop.ts.
- [knowledge/topics/pi-and-herdr.md](knowledge/topics/pi-and-herdr.md) — Pi (agent harness) and Herdr (keeps agents alive): what each does, how they pair, why, and the Herdr CLI drift since s01e04.
- [knowledge/topics/session-handoffs.md](knowledge/topics/session-handoffs.md) — label each part of a hand-off with its source; what went wrong in S01E02.

## Lessons (raw text)
- [lessons/s01e01-mechanics-behind-generative-ai.md](lessons/s01e01-mechanics-behind-generative-ai.md) — full lesson text of s01e01: how LLMs work, tokens, context, limits.
- [lessons/s01e02-steering-models-through-context.md](lessons/s01e02-steering-models-through-context.md) — full lesson text of s01e02: steering models through context.
- [lessons/s01e03-building-knowledge-systems.md](lessons/s01e03-building-knowledge-systems.md) — full lesson text of s01e03: knowledge bases for agents.
- [lessons/s01e04-working-with-ai-harnesses.md](lessons/s01e04-working-with-ai-harnesses.md) — full lesson text of s01e04: harnesses, multi-agent setup, settings.
- [lessons/s01e05-building-workflows-not-tool-stacks.md](lessons/s01e05-building-workflows-not-tool-stacks.md) — full lesson text of s01e05: workflows, self-verification, remote agents, security.
- [lessons/s02e01-agentic-primitives.md](lessons/s02e01-agentic-primitives.md) — full lesson text of s02e01: agent loop, instructions, context and memory, tools.
- [lessons/s02e02-building-an-agent.md](lessons/s02e02-building-an-agent.md) — full lesson text of s02e02: building a custom agent (primitives, providers, tools, context, workflows).
- [lessons/s02e03-agentic-capabilities.md](lessons/s02e03-agentic-capabilities.md) — full lesson text of s02e03: AGENTS.md personalization, MCP, designing a custom MCP, skills and tools.
- [lessons/s02e04-multi-agent-collaboration.md](lessons/s02e04-multi-agent-collaboration.md) — full lesson text of s02e04: multi-agent architectures, A2A, collaboration, orchestration.
- [lessons/s02e05-agent-reliability.md](lessons/s02e05-agent-reliability.md) — full lesson text of s02e05: guardrails, observability, evals.
- [lessons/s03e01-mechanics-behind-product-engineering.md](lessons/s03e01-mechanics-behind-product-engineering.md) — full lesson text of s03e01: shift to outcome, ownership, judgement, leverage.
- [lessons/s03e02-translating-intent-into-agent-work.md](lessons/s03e02-translating-intent-into-agent-work.md) — full lesson text of s03e02: intent, product context, requirements and decomposition, evaluation.
- [lessons/s03e03-ai-native-product-development.md](lessons/s03e03-ai-native-product-development.md) — full lesson text of s03e03: feature maps, planning with background agents, execution (research, structure, ecosystem, schedules), feedback for agents.
- [lessons/s03e04-verifying-product-outcomes.md](lessons/s03e04-verifying-product-outcomes.md) — full lesson text of s03e04: acceptance with captured evidence, agentic lab, system diff, agent review, deterministic quality gates.

## Work
- [work/board.md](work/board.md) — planned, active, done and archived work.
- [work/s01e01/log.md](work/s01e01/log.md) — S01E01 "somebody slow" solve: every request and reply, schema, cuts, form answer.
- [work/s01e02/log.md](work/s01e02/log.md) — S01E02 "who said what" solve: transcription with whisper-cpp, reports, record, crossed first claim.
- [work/s01e03/log.md](work/s01e03/log.md) — S01E03 "what it shows" solve: #4471 split into parser/hint/shift, desk update, ticket signature, 10 claims.
- [work/s01e04/log.md](work/s01e04/log.md) — S01E04 "before i looked" solve: template repo, plan → issues, build, Pages preview.
- [work/s01e05/log.md](work/s01e05/log.md) — S01E05 "answer where i asked" solve: #12 fix, pulse + test writer on a host, pings, claims.
- [work/s02e01/log.md](work/s02e01/log.md) — S02E01 "found out late" solve: what the stock-5 sessions decided, plan.md, store build, claims.
- [work/s02e02/log.md](work/s02e02/log.md) — S02E02 "nobody asked" solve: email agent (AgentMail inbox + Cloudflare Worker + model), design, keys, claims.
- [work/s02e03/log.md](work/s02e03/log.md) — S02E03 "schema first" solve: own remote MCP server barwy-tools (Worker, OAuth, memo/upload/transcribe), tests, deploy, claims.
- [work/s02e05/log.md](work/s02e05/log.md) — S02E05 "while you're away" solve: away-agent Worker (HMAC inbox, policy in code, phone approval, ntfy), live messages, status log, claims.
- [work/s02e04/log.md](work/s02e04/log.md) — S02E04 "two places" solve: job 1 in a Claude Code cloud session, job 2 in a local subagent, time-zone join, claim.
- [work/s03e02/log.md](work/s03e02/log.md) — S03E02 "nothing ships unmarked" solve: sched-prod requests in four waves triaged into a marked tracker, `triage` skill, request ledger, first claim accepted.
- [work/s03e03/log.md](work/s03e03/log.md) — S03E03 "out of office" solve: unattended runner on the Mac (poll loop + `claude -p`), `triage` grown to run alone, six issues shipped/declined/asked, first verdict claim accepted.
- [work/s03e04/log.md](work/s03e04/log.md) — S03E04 "show me when" solve: incident board built and deployed, recording of the row moving under the click, product's confirm decision, replay proof on GitHub Actions; what is left online and follow-ups.
- [work/s03e01/log.md](work/s03e01/log.md) — S03E01 "status for the night" solve: pack intake, cited requirements list, capture skill, status page Worker, claims.

## Meta
- [README.md](README.md) — front page for GitHub: what the base is, where to start, how to add material.
- [CLAUDE.md](CLAUDE.md) — rules, layout, note format and routines for this base.
- [log.md](log.md) — dated log of filing and structural changes.
- [.claude/skills/lesson-notes/SKILL.md](.claude/skills/lesson-notes/SKILL.md) — skill: turn a lesson into a lesson note (summary, pitfalls, what to apply), plus board/index/log updates.
- [tools/check.ts](tools/check.ts) — health-check script: frontmatter, links, index coverage, staleness.
- [tools/state.ts](tools/state.ts) — prints the base's current state at session start (SessionStart hook): inbox, Active lane, last log entry.
- [tools/kb-render/README.md](tools/kb-render/README.md) — SvelteKit + mdsvex config to render a kb export and look at it.
