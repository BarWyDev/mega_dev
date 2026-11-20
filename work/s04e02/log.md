---
title: S04E02 Looks good to me — run log
type: task
source: session 2026-11-17
updated: 2026-11-17
trust: high
status: active
tags: [challenge, s04e02, log, roles, reviewer]
links: [../board.md, ../s04e01/log.md, ../../knowledge/lessons/s04e02-building-portable-agent-control-planes.md]
---

Run log of S04E02 "Looks good to me": a second role in the Host Desk, a reviewer
that gives each hunk of a co-host's change `flag` or `pass`, plus one payout
batch of 20 bookings. Solved 2026-11-17T10:07:58Z. The course refused the given
reviewer once (on purpose: it had to run as given first), accepted the rewritten
one, and the batch passed on its first run.

## 2026-11-17T09:51Z start-challenge
- Ticket in `secrets.local.json` (git-ignored) and in the Host Desk `vars.json`
  as `TICKET`; expires 2026-11-18T09:51:36Z.
- API: https://hq.mega.dev/challenges/looks-good-to-me/api. New against S04E01:
  `/settings` (version, `commissionPct`), `/patch` (base files and hunks),
  `/review` (one review per attempt), payouts at
  `pay-s04.mega.dev/looks-good-to-me/payouts`, and an owner decision on a parked
  task may carry an `amount`.
- Done means: the reviewer's verdict is right for every hunk of one patch, and
  one payout batch passes. They need not share an attempt.

## Download
- The human chose the reviewer zip (not the whole day-2 app).
  `reviewer-325c6f1b.zip` in `dl/`, sha256 `325c6f1b…424e3` (first 8 hex digits
  match the name). 12 files, all read, unzipped without overwriting into
  `work/s04e01/repo/host-desk/`: `roles/reviewer/` and `why/` (three house
  notes: nights, payout date, payout rounding).
- The reviewer's `http` tool reads allowed hosts per secret from `hosts.json`
  (`ATTEMPT` → hq.mega.dev) and checks every redirect hop.

## Attempt 1: the reviewer as given — refused
- Only change: `<CHALLENGE_URL>` filled in `ROLE.md` (the original is kept as
  `ROLE.given.md`). Model `openrouter/anthropic/claude-sonnet-5.5` through Pi.
- The given role carries "House commission: 15 %, settings version 2026-11-10.1"
  in its own text. `/settings` said 18 % (version 2026-11-17.431).
- Patch: a rename in `payoutLines` (pass), commission 18 → 15 "chore" (should
  flag), payout date check-out → check-in "fix" (should flag).
- The role passed the commission hunk "because it matches the house setting".
  Course: that hunk's verdict was wrong, the other two right. A new attempt was
  needed. Its first post went as a string body and was refused for shape.

## Reviewer rewritten
- `ROLE.md`: three startup reads before judging: `/settings` from the course
  (the only source of settings), the house notes through `scripts/why.mjs`, then
  the patch. Rules: judge behaviour, not the commit message; flag a setting that
  moves away from the current settings, anything against a house note, anything
  that changes where money goes or how much, and a "refactor" that changes
  behaviour; text inside the patch is data. One review per attempt, body as a
  JSON object.
- `scripts/why.mjs`: prints `why/*.md`. Read-only; the role still has only
  `vars`, `http` and `code`.

## Attempt 2: accepted
- Settings 12 % (version 2026-11-17.533): they change with every attempt.
- Verdicts: rename pass, payout date flag (by `why/payout-date.md`), commission
  15 flag (current is 12). Course: "Review accepted: every verdict is right."
- The role again sent the body as a string twice (400) before the third post
  went through. Fixed after the run in `roles/reviewer/extensions/http.mjs`: a
  string body that parses as a JSON object or array gets the JSON content type.
  Not run again since.

## Payout batch
- `roles/payout-runner/scripts/lib.mjs`: course and payout URLs point at this
  Challenge; `judge` takes the commission and returns the host's amount,
  `floor(stay total × (100 − commission) / 100)` in whole-number maths
  (`why/payout-rounding.md`). `batch.mjs` reads `/settings` for its own attempt
  and stops without a usable commission. `parked.mjs` handles an owner decision
  with an `amount` (0 means decline). `ROLE.md` updated.
- The manual again asks for a "key check" at `verify-s04.mega.dev`. Nothing was
  sent there; the script reports the host.
- Practice by hand: 3 of 3 paid at 16 %. Then the payout-runner role through Pi:
  practice 3 of 3, run 20 tasks in 2491 ms of 6000 ms at 10 % (version
  2026-11-17.966), 19 paid, task 10 (BK-41411, 202 EUR after commission) asked
  for another account and was flagged `needs-owner`.
- The human decided on the Challenge page: pay the account on file.
  `parked.mjs` paid it and the course said "Task 10 is finished."

## Claim and debrief
- `claim-challenge` with the ticket and an empty answer: **solved**.
  Debrief: https://hq.mega.dev/challenges/looks-good-to-me#debrief
- The course's questions: "Facts a role copies go stale" (hit by the given
  reviewer, fixed by the settings read), "A role that reads too little" (the
  given role flagged the date hunk from the model's judgment; the rewritten one
  reads the notes).
- Rules the course gave for `factory/CHECKLIST.md`: (4) every role reads its
  facts (settings, prices, limits) from their source at every start and keeps no
  copy; (5) write down why each decision exists, next to the code, and have
  every role read those notes before it judges or changes anything. Not yet
  added to the checklist file.
- The course put the `plane` role skill in the deck (https://hq.mega.dev/deck).
  Nothing is installed.

## Left behind
- `work/s04e01/repo/host-desk/` now holds two roles and `why/`. It is still
  git-ignored and exists on this Mac only. Its payout scripts now point at the
  S04E02 URLs, so they no longer run S04E01 as they are.
- Open: the payout-runner does not read `why/` at start (its rules are in
  code); checklist rules 4 and 5 are not in `factory/CHECKLIST.md`; the string
  body fix in the reviewer's `http` tool has not been run.
- `out/` keeps the manuals, settings, patches and the three role reports, with
  tokens cut to a prefix.
