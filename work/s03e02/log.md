---
title: S03E02 nothing ships unmarked — run log
type: task
source: session 2026-11-10
updated: 2026-11-10
trust: high
status: active
tags: [challenge, s03e02, log, triage]
links: [../../knowledge/lessons/s03e02-translating-intent-into-agent-work.md, ../board.md]
---

Run log of S03E02 "nothing ships unmarked": 21 requests and 17 backlog issues of
sched-prod triaged into a Markdown tracker with a new `triage` skill. The course
accepted the first claim. Session token masked; it sits in the git-ignored
`secrets.local.json`.

## 2026-11-10

- list-challenges → S03E02 open, starts in the harness. start-challenge → kit `media/nothing-ships-unmarked/sched-prod-3e6e841d.zip`, API `/challenges/nothing-ships-unmarked/api`, proof `session` (valid one day; a second start deals a new round).
- Kit (200, 10038 B, unpacked to the ignored `repo/`): README with the issue format, `collectors/` (backlog + desk, chat, mail), `specs/` (PRD-1..4, DES-1..5, AUT-1..3, ADR-0001, ADR-0002).
- Collector run 1 → backlog 17 (11 open, 6 done), desk 4, chat 2, mail 3. Runs 2 and 3 right after → 0.
- check-lane skill-wiring → one source in `.agents/skills`, linked not copied. Skill written to `~/.agents/skills/triage/SKILL.md`, linked into `~/.claude/skills/triage` (same wiring as `capture`).
- First pass written with `write-issues.mjs`, checked with `check-tracker.mjs` → OK, 24 issues.
- **Snag:** the collector run before that write had filed a second wave (desk 4, chat 2, mail 3), and the write script removed every file it did not know. A channel read without a cursor gives only the first page, so the check still said 9. Recovered by reading `since=<first cursor>` (printed in run 1). Fix: `collect.sh` copies every raw request into `requests.json` (the ledger); the write script removes a raw file only once its id is in some issue's `sources`; the check runs against the ledger.
- Waves: 1 (9 requests) · 2 (9) · 3 (2: IN-1232, IN-2061) · 4 (1: IN-6489). New requests appear a minute or two after a cursor was issued. Then six polls a minute apart → 0.
- Decisions, by case:
  - already shipped → `sources` of the done issue: IN-9583 → SCHED-4471, IN-4708 → SCHED-4442.
  - covered by an open backlog issue: IN-7727 → SCHED-4446, IN-1232 → SCHED-4465.
  - same ask twice: IN-7958 + IN-8314 (note on the booking form).
  - contradicts a spec: IN-4168 ('OK' button, DES-5) → closed.
  - withdrawn: IN-5919 (summary on Mondays) taken back by IN-6489 → closed obsolete, both ids. (Before wave 4 it was an agent-ready setting.)
  - client relies on it (AUT-2) → needs-human with both ids: IN-9334 + IN-4743 (sender bookings@), IN-4186 + IN-3225 (CSV dates mm/dd). IN-4743 was first closed as not-planned, until IN-9334 arrived.
  - deletes stored data (AUT-2) → needs-human: SCHED-4486 (audit log 90 days).
  - blocked: IN-1162 (compact week view, "URGENT") `blocked-by: [SCHED-4468]`.
  - everything else agent-ready, each ending with the quoted AUT-1 line.
- claim-challenge { session, tracker md 30 files, skill } → **solved** 10:21:54 UTC. Stats: "21 requests in → 17 issues carry them · 8 merged into another issue · closed: 1 obsolete, 1 contradicts-spec · open: 19 agent-ready, 3 needs-human."
- debrief saved: https://hq.mega.dev/challenges/nothing-ships-unmarked#debrief. Artifact in the deck: `ask` (interview and evidence skill), not installed.

## What is where

- `write-issues.mjs` — the whole triaged tracker as data; `node write-issues.mjs <doc/issues>` rebuilds it.
- `check-tracker.mjs` — step 5 of the skill as code: format, marks, sources against the ledger, blockers, cited ids.
- `collect.sh`, `requests.json` — collector wrapper and the ledger of all 21 requests.
- `~/.agents/skills/triage/SKILL.md` — the skill, user scope, outside this repo.

## Learned

- A cursor gives a request once. Copy requests to a ledger before any script may delete collector output.
- One empty poll is not the end of a stream; later requests merge into, reverse or cancel earlier issues.
- Code checks shape and coverage; the model decides placing, mark and wording by the skill.
