---
title: S03E04 show me when — run log
type: task
source: session 2026-11-12
updated: 2026-11-12
trust: high
status: active
tags: [challenge, s03e04, log, verification]
links: [../board.md, ../../knowledge/lessons/s03e04-verifying-product-outcomes.md, ../s03e03/log.md]
---

Run log of S03E04 "show me when": build the starter's four ready issues, deploy the
incident board to a public https address, send product a recording and a short report,
then rebuild after product's answer and prove the new build. Solved 2026-11-12: the course accepted the step-two claim on the first try (step one on the second).

## Brief (from start-challenge, 2026-11-12)

- **Task:** build the four ready issues of the starter (incident board of a scheduling product, with `plan.md`), deploy to a public https address, record it in use, send a report with a link to the recording. After product answers: rebuild and prove the new build.
- **Why:** a change ships with proof that it works, not with a diff alone.
- **Done:** the course accepts the step-two proof of the new build.
- **Human's part:** a host for the board, a public link to the video, a public GitHub repo only if asked for.
- **Starter:** https://hq.mega.dev/media/show-me-when/sched-prod-board-2dff0937.zip
- **API:** https://hq.mega.dev/challenges/show-me-when/api
- **Session:** in `secrets.local.json` (git-ignored), valid until 2026-11-19T06:00:10Z. Goes into the starter's `config.js` (board sends it as `?t=`) and into every claim. A second start-challenge call deals a new night under a new session: do not call it again.

## Proof chain

| Proof | Comes from | Goes to |
| --- | --- | --- |
| `session` | the start | starter's `config.js`, every claim |
| `receipt` | the ack API, for the reported moment | step-one evidence block |
| `productReceipt` | the step-one pass | `resume-challenge` receipts, step-two answer |
| `replayNonce` | product's answer | the course's replay |

## Report shape

Step 1: Markdown with `## What you checked`, `## When`, `## Where`, `## Options for product`,
then one fenced `evidence` block of JSON: `flow` (one of `open-board`, `ack-incident`,
`watch-board`), `at` ("mm:ss" in the recording), `receipt`, `sha` (the build the recording
shows), `videoLink`. The starter's README has an example. Claim with `claim-challenge`:
`session`, `step: 1`, `url`, `report` (up to 64 KB), `videoLink`.

Step 2: report with `## System Diff` (what changed against the plan: behavior, UX, data,
product's decision, the `data-testid` hooks touched) and one `evidence` block (`sha`,
`videoLink`, optional `runUrl` of a prove run on GitHub Actions). Claim adds
`productReceipt` and, without `runUrl`, `replay` (what the course's replay printed, as JSON).

## Log

- 2026-11-12 — start-challenge called once; session saved. Waiting for the human's go before step one.
- 2026-11-12 — Starter downloaded (`dl/`, 13 files) and unpacked to `repo/` (own local git repo, git-ignored here). API probed (`api.log`): the full list comes back on every call; a new incident lands at the top about every 10 s, counted from the board's first call without a cursor.
- 2026-11-12 — Built SCHED-4511..4514 in `repo/app/` (`app.js`, new `time.js`): rows keyed by id (a refresh moves rows, never rebuilds them, so an acked mark survives), loader removed on first load, `empty` hook, 2 s refresh with an in-flight guard, times via the viewer's locale order printed as dd/mm or mm/dd with the UTC value in `datetime`. R6: `scripts/build.mjs` copies `app/` to `dist/` and stamps `git rev-parse HEAD` into the meta tag and footer; refuses a dirty tree.
- 2026-11-12 — Local check (`scripts/check.mjs`, Playwright on the installed Chrome, three locales): 23/23 pass. `npm test`: 6/6 time-format tests.
- 2026-11-12 — **Snag:** Playwright 1.64.1 wants its own Chromium and ffmpeg builds (not on this Mac). Went around both without installing: `channel: 'chrome'`, and a recorder that takes Chrome screencast frames over CDP and encodes them with the Homebrew ffmpeg (`scripts/record.mjs`).
- 2026-11-12 — **Finding (local trial recording):** with R1 + R2 + R4 as planned, a new incident pushes every row down one place. The pointer rested on the Ack of INC-7562; INC-6904 arrived; the click acked INC-5442. This is the moment to show product in step one.
- 2026-11-12 — Deploy prepared (`wrangler.jsonc`, Worker name `sched-prod-board`, static `dist/`), not run: needs a yes.
- 2026-11-12 — Human said yes to the deploy. `npx wrangler deploy` → https://sched-prod-board.barwy.workers.dev, build `287cc5e1397c05ba6b824c0761718234e9190919`. Take-down: `npx wrangler delete --name sched-prod-board`. Live check: 23/23 (run twice by mistake, so two extra acks of INC-5711 went to the course).
- 2026-11-12 — Recording against the live board (`out/step1/board.mp4`, 28 s, timeline and receipt in `out/step1/timeline.json`, git-ignored): pointer on the Ack of INC-7562 at 00:16; INC-6904 arrived; click at 00:22 acked INC-5442. Second deploy added the file: https://sched-prod-board.barwy.workers.dev/rec/board-287cc5e.mp4 (200, video/mp4).
- 2026-11-12 — Step-one report drafted in `out/report-step1.txt` (receipt filled in only at claim time). Flow `ack-incident`, at 00:22. Waiting for the human's yes to claim.
- 2026-11-12 — Human said yes to the claim. Step-one claim 1: **rejected** — "Which row did you mean, and which got the ack? Name them in the evidence block as expected and got (incident ids)." Added `expected: INC-7562`, `got: INC-5442` to the evidence block. Claim 2: **step accepted**, `productReceipt` saved in `secrets.local.json`; product answers around 06:59:59Z through `resume-challenge`.
- 2026-11-12 — Product's answer (via `resume-challenge`): "New incidents stay live at the top and Ack stays on the row, but Ack asks to confirm, and the confirm names the incident id." New hooks: `confirm`, `confirm-ack`, `confirm-cancel`. `replayNonce` and replay URL saved in `secrets.local.json`.
- 2026-11-12 — Read the replay script (`dl/replay/`, sha256 matches the one pinned in `prove.yml`). The nonce names six checks: new incident shows live at the top; Ack is on the row; the confirm names the picked incident; all three acks hit the picked incident; with no incidents the loader is gone and `empty` shows; no row is removed from the list while watching.
- 2026-11-12 — Built the change: Ack opens a fixed-place confirm naming the id; `confirm-ack` sends, `confirm-cancel` / Escape / backdrop sends nothing; focus starts on Cancel. `plan.md` (R2, flow, hooks) and the SCHED-4511 issue updated. Local check 27/27. Commit `d45643a0be72c6145617963a2783e19a4916641d`, deployed to the same Worker.
- 2026-11-12 — Recording of the new build (`out/step2/board.mp4`, 34 s): click at 00:22 lands on INC-5442, confirm says "Ack INC-5442?", Cancel at 00:25 (no request), Ack on INC-7562 at 00:26, confirmed at 00:29, INC-7562 marked acked. Public: https://sched-prod-board.barwy.workers.dev/rec/board-d45643a.mp4
- 2026-11-12 — **Blocked on a yes:** the replay launches Playwright's own Chromium (not on this Mac). Either `npx playwright install chromium` here, or a public GitHub repo with `prove.yml`.
- 2026-11-12 — Human chose the GitHub way for the replay. `gh repo create mega-s03e04-show-me-when --public --source . --push` was **denied by the harness's permission classifier** (creating a public surface). Not worked around: the human runs that command, then the agent runs the `prove` workflow. Step-two report drafted in `out/report-step2.txt` (run address still a placeholder).
- 2026-11-12 — Human: "you can do it". Public repo created and pushed: https://github.com/BarWyDev/mega-s03e04-show-me-when (HEAD `d45643a`, `prove.yml` unedited; holds the course session in `app/config.js`, expires 2026-11-19). Take-down: delete the repo.
- 2026-11-12 — `gh workflow run prove.yml` → https://github.com/BarWyDev/mega-s03e04-show-me-when/actions/runs/43173738200: **success**, `unmet: []`, build `d45643a…`, three attempts each acked the intended incident (INC-5711, INC-7562, INC-5442), confirm seen naming the picked id, no rows removed, empty state shown. Run address filled into `out/report-step2.txt`.
- 2026-11-12 — Human said yes. Step-two claim: **solved** (07:22:23Z). Debrief saved: https://hq.mega.dev/challenges/show-me-when#debrief. All six questions "went right the first time"; four snags (evidence block without expected/got; recorder without Playwright's own browser; live check run twice; repo creation blocked until the human's go).

## What is left online

- Worker `sched-prod-board` (board + two recordings): https://sched-prod-board.barwy.workers.dev. Take-down: `npx wrangler delete --name sched-prod-board`.
- Public repo https://github.com/BarWyDev/mega-s03e04-show-me-when (holds the course session, which expires 2026-11-19). Take-down: delete the repo.

Both need the human's yes to remove.

## What is kept locally

Git-ignored: `secrets.local.json`, `api.log`, `dl/` (starter zip, replay script), `repo/` (the board's own git repo, same as the public one), `out/step1/` and `out/step2/` (recording, timeline with the receipt). Tracked: `out/report-step1.txt` (receipt left out) and `out/report-step2.txt`. Trial recording, still frames, the unpacked starter copy, `node_modules` and `dist` were removed on 2026-11-12 on the human's ask; `npm install` and `npm run build` in `repo/` bring the last two back.

## Gaps and follow-ups

- No `prove` skill installed. The course put one in the deck (https://hq.mega.dev/deck): records the product the way a person uses it, marks each breaking moment with what/when/where/why, checks the proof is of the live build. Read it and decide; installing needs a yes. Until then the pieces are `repo/scripts/build.mjs` (stamp), `check.mjs` (hooks and flows), `record.mjs` (screencast recorder, click by screen position).
- Product's answer was fetched by waiting in the session. The mail agent (s02e02) could receive it instead.
- Habit to keep: run a check against a live address once; it sends real acks.
