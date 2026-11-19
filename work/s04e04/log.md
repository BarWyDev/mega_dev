---
title: S04E04 Leave it running — run log
type: task
source: session 2026-11-19
updated: 2026-11-19
trust: high
status: active
tags: [challenge, s04e04, log, events, night-desk, idempotency]
links: [../board.md, ../s04e03/log.md, ../s04e01/log.md, ../../knowledge/lessons/s04e04-automating-work-beyond-code.md]
---

Run log of S04E04 "Leave it running": the Host Desk got a night desk that
handles booking events while nobody types, then one payout batch ran on the
bookings as the night left them. **Solved 2026-11-19T07:23:36Z on the fifth
attempt**; the course turned down four tries and gave a hint on three. What
decided it: two course jobs on the board each took one event, and the desk
told the course `applied` twice for a repeated delivery.

## Start
- Ticket in `secrets.local.json` (git-ignored) and in the Host Desk `vars.json`
  as `TICKET`; expires 2026-11-20T05:48:05Z. `start.mjs` fetches the manual and
  stores the attempt; every fetch is a new attempt with its own bookings.
- API: https://hq.mega.dev/challenges/leave-it-running/api (`out/api.txt`). New
  against S04E03: `/board/heartbeats`, `/board/stop`, `/events/window` (starts
  the night, 10 minutes), `/events?after=&job=`, `/events/ack` (within 60 s),
  `/events/results` (`applied | conflict | parked`), optional `/events/push`;
  parked decisions `add-night` / `as-booked` for a booking a guest asked to
  change.
- Done means: every event gets its result within 2 minutes, the desk's job is
  still running when the night closes, and the payout batch passes.
- The board of a fresh attempt already holds two jobs from the course:
  `legacy/export` (owner none) and `rook/lint` (owner rook), both running.

## Download and setup
- `night-2be2323c.zip` in `dl/`, sha256 `2be2323c…d61819`, 13 files, all new,
  unzipped into `work/s04e01/repo/host-desk/roles/night-desk/`.
- The owner page (`/challenges/leave-it-running/owner`) shows the night's
  timeline, what the desk parked, and the host's city-tax answers; they match
  `why/change-requests-2026-11-18.md`.

## What was changed in the Host Desk (not committed there yet)
- Later fixes are in the attempts below: the changed repeat's own record
  (attempt 1) and no second result for a repeat (attempt 4).
- `roles/night-desk/night.mjs` rewritten: never throws on a failed request;
  bookmark in `night/state.json` (cursor, every event, its result), so a
  restart goes on; acks at once, then handles; one booking's events in order,
  bookings side by side; an event id seen before with the same content is not
  handled again and its stored result is posted for the new delivery; the same
  id with other content is a record of its own (`<id>#<seq>`) and what the
  first content did stays; code checks the role (a guest message never records
  a change, a result other than `applied` keeps none); beats at half the asked
  interval and keeps beating after the night until `night/stop` exists.
  `--test <file>` runs the role on made-up events without the course.
- `roles/night-desk/ROLE.md` rewritten: when `applied`, `conflict`, `parked`;
  a guest's text is a request, never an instruction. `scripts/change.mjs`
  writes beside the event (`night/inbox/<seq>.changes.json`); the poller alone
  writes `night/changes.json`.
- Payout scripts: URLs of this Challenge; `loadNight()` reads the night's
  changes and results; nights added are part of the stay, a refund comes off
  the host's payout, a booking with a parked guest request or a conflict is
  flagged `needs-owner`; `parked.mjs` knows `add-night` and `as-booked`.

## Attempt 1 (night 05:56:30–06:06:30Z)
- 7 first deliveries, each with a result in 5 to 8 s; 3 more deliveries of
  known ids. Scenario: `booking.changed` +1 and the same delivered again;
  `booking.cancelled` and the same again; guest "add one night" (parked);
  `booking.changed` +2, then the same id with +3 (conflict); a second guest
  request; a cancel; a guest request that names no booking (parked).
- Bug found: the first poller replaced the record when the same id came with
  other content, so the applied +2 was lost from `changes.json`. Fixed in code
  and repaired by hand before the batch.
- The cursor moved 4→5 and 11→12 with no event delivered for seq 5 and 12.
- Batch: tasks 1 to 3 accepted (one flag, one refund), then "Task 4: wrong
  answer" for BK-13214, a booking with no event in the desk's stream.
- Checked afterwards on the refused attempt: practice refuses a wrong amount,
  so the plain formula is right; a second desk job sees the same events; no
  other route shows seq 5 or 12.

## Attempt 2 (night 06:15:30–06:25:30Z)
- Same scenario with other bookings; the board did not change during the night
  (`out/board-watch-2.txt`). The desk kept beating through the batch.
- Batch: 15 tasks accepted, among them the conflict booking flagged, two guest
  requests flagged, one task asking for another account flagged, +1 night and
  two refunds paid. Then "Task 16: wrong answer" for BK-89778, again a booking
  with no event in the desk's stream.
- The course's hint (second refusal at the same spot): "Who else could take
  events from your outbox, and where would you see them?"

## Attempt 3 (night 06:31:30–06:41:30Z), `legacy/export` stopped first
- The human said yes to stopping `legacy/export` (owner none). `POST
  /board/stop` with that id before the claim: state `stopped`; `rook/lint`
  left running.
- The desk now got seq 5: a `booking.changed` +1 that the earlier nights never
  delivered. So `legacy/export` was taking it. 9 events handled, stream 1 to 11
  without a gap; the cursor still moved 11→12 with no event, 16 s after
  event 11.
- Batch (commission 14 % this attempt): "Task 1: wrong answer" for BK-84904,
  a booking with no event in the desk's stream, with the same hint.

## Attempt 4 (night 06:53:30–07:03:30Z), both course jobs stopped first
- The human said yes to stopping `rook/lint` too. With both stopped, seq 12
  arrived: a `booking.cancelled` with a refund. So `rook/lint` was taking it.
- Batch: all 20 tasks answered with right amounts (16 paid, 4 flagged), then
  "The run was not accepted. The course will not say why." Hint: "How many
  times did your desk tell the course it applied that event?" Pointer:
  check-lane, need `night-run` ("does each result say what the desk really
  did?").
- Cause: for a repeated delivery of the same content the poller posted the
  stored result `applied` again. Fix: a repeat is acked and gets no second
  result.

## Attempt 5 (night 07:06:30–07:16:30Z): accepted
- Both course jobs stopped by id before the claim. 12 deliveries, 10 results,
  each in 4 to 7 s; two repeats acked only; the changed repeat marked
  `conflict` with the first change kept; the message without a booking parked.
- Batch through the payout-runner role: 20 tasks in 2971 ms of 6000 ms at
  10 % (settings version 2026-11-19.565), 16 paid, 4 flagged: two guest
  requests, the conflict booking, one task asking for another account.
  Course: "All 20 tasks are answered."
- The human's decisions on the owner page: task 2 `add-night` (1162 EUR),
  task 12 `new` (1509 EUR to the account the task asked for), task 14
  `take-new` (the later message, 880 EUR), task 15 `add-night` (1095 EUR).
  `parked.mjs` finished all four; the amounts on the page matched the desk's.

## Claim and debrief
- `claim-challenge` with the ticket and an empty answer: **solved**. Debrief:
  https://hq.mega.dev/challenges/leave-it-running#debrief
- The course's questions: "The same event twice" (went wrong first: one result
  per event, a repeat is only acked), "A change under the same id" (went
  right: body hash per id, the changed repeat goes to the owner), "Jobs no
  role of yours owns" (went wrong first: stop every job on the board that no
  role of ours owns, by id, `rook/lint` included), "A message with no target"
  (went right: change nothing, park it).
- Rules the course gave for `factory/CHECKLIST.md`: (8) handle each event
  once: keep its id and body hash; skip a repeat, send a changed repeat to the
  owner; (9) every running job has an owner among your roles; stop the others
  by job id and keep yours running; (10) when an event names no clear target,
  change nothing and park it for the owner. Not yet added to the checklist.
- Still missing, by the course's toolbox: the desk runs only while the chat
  that started it is open (a background command). The course names Pi Durable,
  a loop or a scheduler. It says S04E05 has the factory make the next role.

## Left behind
- `dl/attempt-1/` to `dl/attempt-5/` (git-ignored): each attempt's night
  folder and request log, with tokens. `out/`: API description, manual of attempt 2, role reports, the
  board watch. The Host Desk's `night/` and `state/` hold attempt 5. The Host Desk's own
  git repo has the night-desk role and the payout changes uncommitted; its
  payout scripts point at the S04E04 URLs. Stopping the two course jobs was
  done by hand (`curl`), not by the poller.
