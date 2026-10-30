---
title: limen mapped onto this base and Claude Code
type: topic
source: https://github.com/overment/limen/tree/01fc400e916e05f4f92ff881b48cd1b40eee99e6 (read 2026-10-29), lesson https://hq.mega.dev/lessons/s01e04/
updated: 2026-10-29
trust: medium
status: active
tags: [limen, harness, multi-agent, coordinator, setup]
links: [../../context/agent-setup.md, ../../work/board.md, ../lessons/s01e03-building-knowledge-systems.md, session-handoffs.md]
---

limen is a coordinator/worker setup on Pi and Herdr, built from text files, git,
a dependency-free CLI and about 1,600 lines of Pi hooks. Claude Code in the desktop app already does most of
its runtime work (worktrees, background sessions, finish notices, steering). What
limen has and we lack is the text layer: recorded standing choices, role rules
for workers, and rules recalled at the moment of use.

Read at commit `01fc400` (2026-10-02). Code was read, not run. Trust is medium:
the "native here" column is from what this session can see of Claude Code, not
from a test.

## How limen works

- You talk to one coordinator. It runs `limen spawn`, which starts a worker in
  its own git worktree and branch, in a Herdr tab.
- Every job is a folder `.limen/jobs/<id>/` of plain files: `state`, `log`,
  `pid`, `base`, `branch`, `commits`, `tip`, `steer/inbox/`. `state` is written
  last, so anything that sees `done` can trust the other files
  (`src/job/record.ts`).
- A supervisor owns the process and writes the outcome even after a crash. On a
  terminal state it wakes the coordinator through Herdr (`hook/wake.ts`).
- Steering: `limen steer` drops a file in the job's inbox; a Pi extension
  delivers it between tool calls (`hook/steering.ts`).
- Text the agents read: `spec/vision.md` (human-owned principles),
  `.agents/limen/styleguide.md` (coding rules), `spec/build.md` (board:
  TRACK / NOW / NEXT / PROVEN), `spec/features/{planned,active,done,dropped}/FNNN-slug/`
  (ticket and outcome per feature), and role prompts in `templates/` (worker,
  reviewer, researcher, judge, quality, picture).
- `hook/communication.ts` puts vision, styleguide and a board digest on the
  system prompt every model call, and after a write or edit recalls the rule
  that applies.

## Mapping

| limen | Here | Verdict |
| --- | --- | --- |
| `spec/vision.md` | `CLAUDE.md` Purpose and Rules | Have |
| `spec/build.md` NOW / NEXT / PROVEN | `work/board.md` Active / Planned / Done | Have |
| `spec/build.md` TRACK: owner's standing choices (models, effort, who reviews, what counts as proof) | Scattered: some in `context/agent-setup.md`, most only in past sessions | **Port** |
| `spec/features/FNNN/` ticket + outcome | `work/s01eXX/log.md`, one folder per Challenge | Have; the lesson code is the stable ID |
| `.limen/jobs/<id>/` written while the job runs | Logs written by me after the fact | **Port** the habit, not the code |
| Supervisor, reaper, wake on finish | Desktop app: linked sessions report back when they end; subagent results return to the caller | Native |
| Steering inbox between tool calls | `SendMessage` to a running session or agent | Native |
| Worktree per worker | `isolation: worktree` on agents, worktrees on new sessions | Native |
| Herdr tabs that outlive the window | Desktop app sessions; cloud sessions for work that must outlive the laptop | Native enough; skip Herdr |
| Role templates (`templates/worker.md`, `researcher.md`, …) | No `~/.claude/agents/` | **Port** one or two |
| Rules re-injected each call, recalled after edits | `CLAUDE.md` loaded once at start; no hook in this repo | **Port** as one hook |
| Model and effort per role, written on the board | `"model": "opus"` for everything | **Port** after the effort experiment |
| Finish webhooks, GitHub doorbell, Linear mirror, VPS seat | None | Skip for now; later lessons cover GitHub and VPS |
| Speech register (`templates/communication.md`) | Course server and CLAUDE.md set the voice | Skip |

## Ideas worth keeping

- **State is the commit point.** Write everything else first, flip `state`
  last. Same rule for this base: a board line moves to Done only after the log
  is written.
- **A tab is not the job.** Sessions come and go; files and git are the truth.
  Our version: a session's result counts once it is in a note.
- **A clean exit is not approval.** limen never merges on `done`; the human
  lands. Matches the course rule that every outside action needs a yes.
- **Code only where prose can't reach** (vision, "Judgment travels as prose").
  Same as `tools/check.ts` here.
- **Outside systems mirror; they never own.** GitHub and Linear reflect state
  but the files hold it.
- From `templates/worker.md`: checkpoint as if the turn could end now;
  exploration must leave residue in a file; report only checks you actually
  ran; ten reads without an edit means make the probe edit.
- Trust boundary (README): a worktree separates work but is not a sandbox. A
  worker can do anything your account can.

## Ports, smallest first

1. Done 2026-10-29. Add a **Standing choices** section to `work/board.md` (limen's TRACK): one
   line per decision you made that should outlive a session, with date.
2. Done 2026-10-29. Add a project hook in `.claude/settings.json`: after an Edit or Write to a
   `.md` file here, run `node tools/check.ts` and show errors. The rule "run
   check after any change" then stops depending on memory.
3. Put the four worker rules above into the global `~/.claude/CLAUDE.md`
   (already planned on the board).
4. One named subagent in `~/.claude/agents/`: a source reader that handles one
   input and labels its output with that source. Covers the S01E02 gap in
   [session hand-offs](session-handoffs.md).
5. After the effort experiment, record model and effort per kind of task in
   Standing choices.
