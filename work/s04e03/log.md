---
title: S04E03 Three small changes — run log
type: task
source: session 2026-11-18
updated: 2026-11-18
trust: high
status: active
tags: [challenge, s04e03, log, roles, planner, team]
links: [../board.md, ../s04e02/log.md, ../s04e01/log.md]
---

Run log of S04E03 "Three small changes": the Host Desk got a team (critic,
planner, worker, integrator), the team took the host's three change requests
from a shared board, and one payout batch ran on the merged work. Solved
2026-11-18T14:07:19Z in one attempt; the course turned down no tries.

## Start
- Ticket in `secrets.local.json` (git-ignored) and in the Host Desk `vars.json`
  as `TICKET`; expires 2026-11-19T13:28:05Z.
- API: https://hq.mega.dev/challenges/three-small-changes/api. New against
  S04E02: `/board` (requests, plan, jobs, results, questions),
  `/board/questions`, `/board/plan`, `/board/claims`, `/board/results`; tasks
  carry `day.guests` and `day.bookedAt`; run limit 6000 ms.
- Done means, in one attempt: the plan is posted before any job starts, every
  job posts its change and changed only the files its plan gave it, and the
  payout batch passes.

## Download and setup
- The human chose the team zip. `team-e12fefc8.zip` in `dl/`, sha256
  `e12fefc8…28a0d`. 37 files, no collisions, unzipped into
  `work/s04e01/repo/host-desk/`: `roles/critic`, `worker`, `integrator` (run as
  given) and an empty `roles/planner/ROLE.md`.
- The manual was fetched once (`start.mjs`); the attempt went into `vars.json`
  as `ATTEMPT` and the manual text into the Host Desk's `state/manual.json`.
  Every fetch of the manual starts a new attempt with an empty board.
- Before the first commit: `<CHALLENGE_URL>` filled in every role; the payout
  scripts point at this Challenge and take the attempt from `vars.json`
  instead of fetching the manual (`batch.mjs`, `lib.mjs`); `state/` added to
  the Host Desk's `.gitignore`.
- The Host Desk became its own git repo (`git init`, commit `start`), local
  only, inside the git-ignored `work/s04e01/repo/`.

## The requests and the host's answers
- r1: 10 % off the nights for stays of 7 nights or more. Host: build it as
  written.
- r2: city tax, 3 EUR per guest per night. Host: at most the first 7 nights;
  paid out with the host's payout, commission on it too; only bookings made on
  or after 2026-11-16.
- r3: hosts keep the whole cleaning fee, no commission on it. Host: build it as
  written.
- The critic (three runs in parallel) posted 5 questions per request. It did
  not read the code in any run: its role names no file and `read` cannot list
  a folder. The human pasted the host's answers from the owner page; they are
  kept in the Host Desk as `why/change-requests-2026-11-18.md`.

## The planner
- `roles/planner/ROLE.md`, written by the harness and approved by the human:
  startup reads (board, settings, checklist and `why/`, the payout code by
  path, the host's answers from the prompt); one job per request, each with
  exactly one new file `roles/payout-runner/scripts/rules/<request>.mjs`; one
  `merge` job that owns every existing file; the host's answers and the
  function signatures go into each job's `asks`; stop instead of guessing when
  an open point changes an amount; one plan per attempt.
- First post refused for shape (the body went as a string; nothing was
  stored). The string-body fix from S04E02 was ported to the `http` tool of
  planner, critic, worker and integrator and committed; the second run was
  accepted: "Plan accepted."
- Plan: `w-r1` → `rules/r1.mjs` (`longStayNights`), `w-r2` → `rules/r2.mjs`
  (`cityTax`), `w-r3` → `rules/r3.mjs` (`cleaningFeeKept`), `merge` →
  `lib.mjs` and the payout-runner's `ROLE.md`. Model for every job:
  `openrouter/anthropic/claude-sonnet-5.5`.

## Jobs
- One git worktree per worker (`../host-desk-w-r1` and so on, `vars.json`
  copied in). Three workers ran in parallel; each claimed its job, wrote its
  one file and posted its result.
- Integrator, first start: claimed, merged the three jobs (`merge-job.mjs`),
  wired the rules into `judge`. Host payout =
  `floor(((nights × rate × (90 or 100) + tax × 100) × (100 − commission) + cleaning × 10000) / 10000)`;
  `day` became a known field and a task without valid `guests` or `bookedAt`
  is flagged.
- Practice on the merged Host Desk: 3 of 3 paid. Reviewer on the jobs' posted
  changes: 0 of 3 hunks flagged.
- Integrator, second start: posted its result last. Board: "Every job has its
  result."

## Payout batch
- Payout-runner role through Pi: 20 tasks in 3497 ms of 6000 ms at 10 %
  (settings version 2026-11-18.724), 19 paid, task 9 (BK-26939, 1144 EUR)
  asked for another account and was flagged `needs-owner`.
- The human's first decision was not saved on the owner page; after pressing
  Decide the course showed `on-file`, `parked.mjs` paid the account on file
  and the course said "Task 9 is finished."

## Claim and debrief
- `claim-challenge` with the ticket and an empty answer: **solved**.
  Debrief: https://hq.mega.dev/challenges/three-small-changes#debrief
- The course's questions: "Split by request, not by file" (went right: the
  shared file went to the integrator alone), "The vague request is guessed"
  (went right: the critic asked, the host answered before any code changed).
- Rules the course gave for `factory/CHECKLIST.md`: (6) plan by files before
  anyone works: one owner per file, and a file every change needs goes to one
  integrator; (7) send every unclear request to a critic first, and let the
  owner answer before any code changes. Not yet added to the checklist file.
- The course says S04E05 has the factory write a planner.

## Left behind
- `work/s04e01/repo/host-desk/` is now a local git repo (5 roles plus the
  payout-runner and reviewer, `why/` with four notes) with three worktrees
  beside it. Still git-ignored here and on this Mac only. Its payout scripts
  point at the S04E03 URLs and need `ATTEMPT` in `vars.json` and
  `state/manual.json`.
- Open: checklist rules 4 to 7 are not in `factory/CHECKLIST.md`; the critic's
  role has no code paths; the payout-runner's `run.mjs` takes no prompt (the
  batch was started with the same flags by hand to skip the practice step).
- `out/` keeps the API description, the manual, three board snapshots and
  every role's report, with tokens cut to a prefix. `dl/` holds the zip and
  the Host Desk's S04E02 state files.
