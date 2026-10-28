---
title: S01E03 what it shows — solve log
type: task
source: session 2026-10-28
updated: 2026-10-28
trust: high
status: active
tags: [challenge, s01e03, log, github, svelte]
links: [../board.md, ../../context/agent-setup.md, ../../tools/kb-render/README.md]
---

Split support ticket #4471 (412 date reports, marked "known", one fix queued) into its real problems,
filed one GitHub issue per problem, and added a signed kb page about them.
Repo: https://github.com/BarWyDev/mega-s01e03-what-it-shows (public; delete after the course accepts).
Status: **solved** 2026-10-28 on claim 10. Issues: #1 completed, #2 not planned, #3 completed. Page signed with the course ticket.
Debrief: https://hq.mega.dev/challenges/what-it-shows#debrief. Repo can be deleted now that the course accepted.
Render build config is kept in [tools/kb-render](../../tools/kb-render/README.md).

# S01E03 "what it shows" — log

## Start
- Start point is the Challenge page (https://hq.mega.dev/challenges/what-it-shows), not start-challenge; no receipts.
- Input: kb export `kb-export-267efc5e.zip` (SvelteKit + mdsvex kb: `.svx` pages, components in `src/lib/kb`, data in `src/lib/data`). The file name is a sha256 prefix of the zip.
- Deliver in a public repo: one issue per problem with its report count; the page (`.svx`) and the page as the desk sees it (rendered).

## Analysis
- `reports-4471.json`: 427 rows, 15 exact repeats → 412 unique by id (`uniqueById`).
- All 11 tenants are day-first locales (checked with `Intl`, as `causes.ts` does).
- `causes.ts` already knows two causes: `parser` (shared parser reads month first) and `hint`
  (booking-v3 form prints `MM/DD/YYYY` but reads day first; channel `form` + booking-v3 tenant).
- `desk-notes.json` → `oneDayMove`: 5 reports where the date moved one day, no swap (time zones).
  Every other body with two dates is an exact month/day swap.
- Intake tags (`meta.intakeTag`) are a browser guess and disagree with the cause both ways.
- Decision 0001 merges on subject; the same subjects cover all problems, which is how #4471 hid them.

## Filed
| issue | problem | reports |
| --- | --- | --- |
| #1 | `parser` | 379 (desk view; 374 without the one-day moves) |
| #2 | `hint` | 33 |
| #3 | `shift` (one-day move) | 5 |

Page: `src/routes/kb/incidents/4471/problems/+page.svx`, signed `BarWyDev`, desk ref `DR-VF41-FCE5`.
Logic in `src/lib/kb/problems.ts` + `ProblemTable.svelte`; issue links in `src/lib/data/tickets-4471.json`.
Rendered with a throwaway SvelteKit + mdsvex + adapter-static build (alias `#lib` → `src/lib`,
layout `runbook` → absolute path); output committed under `rendered/`.

## Claims
1. Rejected. Desk: "Right problems. The desk counts with its own view, as it was exported."
   → the desk's `CauseTable` counts the 5 one-day moves under `parser` (footnoted). Changed #1 from 374 to 379.
2. Progress: tickets accepted. Desk: "The desk isn't done with #4471 yet. When it is, close yours and submit again."

3. Rejected: "your tickets are still open. Close them." Desk: "The desk is still waiting on those tickets."
4. Closed #1–#3 by hand (completed, with a comment). Rejected: "closed, but not the way the course expects".
   Desk: "Closed, but not the way the desk would. Things moved since your first submit."
5. Page recounted like the desk's view (parser 379 incl. the 5 shift, hint 33, shift 5); issues reopened and closed
   by PR #5 ("Closes #1–#3"). Same rejection.
6. #3 reopened and closed as duplicate of #1. Same rejection.
- Export unchanged throughout (link hash 267efc5e, same ETag). No course activity on the repo.
7. #3 reopened and closed as not planned. Same rejection.
- Re-downloaded the export: byte-identical (sha256 267efc5e…, md5 bfc8a900…). Server ETag is not an MD5.
- 2026-10-28, later: the Challenge page now shows a **desk update** ("engineering update", #4471 closed 05 Oct):
  `parser` fixed ("fix(dates): parse dd/mm for eu locales"), `hint` won't fix ("booking-v3 form retired"). No line for `shift`.
  In claims 4–7, #2 was always closed as completed, so every one of them was wrong on #2.
8. #1 completed, #2 reopened and closed as not planned, #3 reopened and left open. Page and `rendered/` updated
   (state column, PR #6, no "Closes"). Rejected with the same message and desk line.
9. #3 closed as completed with #1 (desk files shift under parser); fix noted on #1; page updated (PR #7).
   Tickets passed. Rejected: "no .svx page in this repo carries your signature. Put the `ticket` from start-challenge … as `signature:`".
   start-challenge was never called, because the startPoint was the page. Called it now: it hands out a `ticket` (proof).
10. Page `signature:` set to the ticket (PR #8, desk ref changed). **Solved.**

## What decided it
- The desk update on the Challenge page. Re-read the source page after a repeated rejection.
- Call start-challenge even when a Challenge starts on a page: it hands out the proofs.

## Snags
- npm install and `gh pr merge` were blocked by auto mode; the human approved both.
- The human's dev-guard hook blocks pushes to `main`; second commit went through PR #4.
