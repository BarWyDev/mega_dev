# Log

- 2026-10-28 — Created the base: CLAUDE.md, index, inbox/, context/, knowledge/, work/board.md, archive/. Layout follows lesson s01e03 (inbox as single entry point, context layers, board for broader context). Kept flat and small on purpose; split folders only when a folder passes ~15 notes.
- 2026-10-28 — Put the base under git. Added `tools/check.ts` (Node, no deps): required frontmatter fields and enum values, frontmatter and body links, index coverage, archive status, staleness over 30 days. Health-check routine in CLAUDE.md now runs it first; judgment (duplicates, missing links) stays with the agent. Lesson s01e03: mechanics in scripts, judgment in notes.
- 2026-10-28 — Added `work/s01e01/` for the "somebody slow" Challenge: solve log (with frontmatter) plus raw files (original message, sent cut, API schema). One folder per Challenge keeps raw evidence next to its log. Moved the Challenge to Done on the board.
- 2026-10-28 — Filed S01E02 "who said what": frontmatter and resume section on `work/s01e02/log.md`, new topic note `knowledge/topics/session-handoffs.md` (first note in `knowledge/topics/`, because the lesson is cross-cutting and the lesson page isn't here), transcriber and curl notes in `context/agent-setup.md`, board moved to Done. Git-ignored the folder's files that hold tickets or receipts, plus wav files and brew output.
- 2026-10-28 — Cleaned up `work/s01e02/` after the solve: moved the whisper model to `~/.cache/whisper/` so every Challenge shares one copy, deleted media, wav files, brew output and the files holding the ticket and receipts. Kept tracked evidence (transcripts, frames, record). Ignore rules stay for the next Challenge.

- 2026-10-28 — Added work/s01e03/log.md (S01E03 in progress, paused); board and index updated.
- 2026-10-28 — Filed S01E03 solve (claims 8–10) in `work/s01e03/log.md`, board moved to Done. Added `tools/kb-render/` (config only, build outputs git-ignored) because the render build lived in a temporary scratchpad and the debrief asked to keep it.
- 2026-10-29 — Added `knowledge/topics/limen-mapping.md` (s01e04 Try today): limen read at commit `01fc400`, each piece mapped to this base or Claude Code as have / native / port / skip. Topic note, not a lesson note, because it compares setups across lessons. Board gets the ports as Planned items.
- 2026-10-29 — limen ports 1–2. Added a Standing choices section to `work/board.md` (limen's TRACK: dated decisions only the human changes). Added `.claude/settings.json` with a PostToolUse hook on Edit|Write: for `.md` files in this repo it runs `tools/check.ts` and exits 2 with the errors, so the rule "check after every change" no longer depends on memory. Tested live: a note without frontmatter was reported. Bash edits bypass the hook, noted in CLAUDE.md.
- 2026-10-29 — Added `lessons/` for raw lesson text and note type `source` (check.ts, CLAUDE.md). The human asked for all lessons via the MEGA MCP; it serves only the current lesson (`mega-start`), and lesson pages redirect to login, so only s01e04 was saved. Narrowed "pointers, not copies": lesson text is the exception, saved on each new lesson.
- 2026-10-30 — Filed lesson exports the human dropped straight into `lessons/` (s01e01–s01e04): dropped the " (2)" suffixes, added `type: source` frontmatter (the export had replaced the s01e04 one). Saved s01e05 from `mega-start`. All five lessons now on disk, which unblocks the s01e01/s01e02 lesson notes.
- 2026-10-30 — `tools/check.ts` skips `repo/` folders: Challenge repo clones (`work/<id>/repo/`, git-ignored) are not notes. `.gitignore` adds `work/*/repo/` and `work/*/wt-*/` (worker worktrees).
- 2026-10-30 — Filed S01E04 "before i looked" as solved: log at `work/s01e04/log.md`, board updated (Done + two follow-ups).
- 2026-10-30 — S01E04 repos deleted by the human; local clones moved to the Trash. Board updated.
- 2026-10-30 — Filed S01E05 "answer where i asked" as solved: log at `work/s01e05/log.md` (indexed), board updated (Done + cleanup and test-runner gap in Planned). `.gitignore` adds `work/*/tail.*` (live Worker logs).
- 2026-10-30 — S01E05 Worker rig-pulse deleted on the human's yes; board and solve log updated.
- 2026-10-30 — Added `README.md` as the GitHub front page, on the human's ask. It points to `index.md`, `CLAUDE.md`, the board and the log instead of copying them. `tools/check.ts` exempts it from frontmatter, like `CLAUDE.md`, because it is for people, not a note.
- 2026-10-31 — Wrote `knowledge/lessons/s01e01-mechanics-behind-generative-ai.md` (summary, pitfalls, "apply to this setup" table) and added the project skill `.claude/skills/lesson-notes/` so every next lesson gets the same note shape. `tools/check.ts` skips `.claude/`: skills use Claude Code's frontmatter, not the note format. Board: two new Planned items from the lesson (duplicate Cloudflare skills, request-inspector run).
- 2026-10-31 — Lesson notes are written in Polish from now on, on the human's ask: rewrote the s01e01 note, and the `lesson-notes` skill now sets Polish body and Polish section headings. Frontmatter, file names and the rest of the base stay English.
- 2026-10-31 — Wrote `knowledge/lessons/s01e02-steering-models-through-context.md` with the `lesson-notes` skill (first real run). Board: three new Planned items (test the skill in a fresh session, identify `~/.claude/skills/synced/`, fill memory) and the self-improving scan folded into the weekly health-check item.
- 2026-10-31 — Added `knowledge/topics/pi-and-herdr.md` on the human's ask: what Pi and Herdr each do, how s01e04/s01e05 pair them, benefits, and that Herdr's CLI changed (`hc …`) since the lesson. Linked from `limen-mapping.md`. English, like the other topic notes.
- 2026-11-01 — Wrote lesson notes for s01e04 and s01e05 with the `lesson-notes` skill, and rewrote the s01e03 note in Polish in the same shape (same path, so links hold). All five lessons now have notes. Course table updated; board: back-fill item done, global CLAUDE.md item lists the rules the notes add.
- 2026-11-02 — Saved lesson text of s02e01 "Agentic Primitives" to `lessons/` from mega start.
- 2026-11-02 — Wrote `knowledge/lessons/s02e01-agentic-primitives.md` with the `lesson-notes` skill; brief saved to the dashboard. Course table and Challenges list updated; board: agent-loop experiment, Standing-choice history item, Challenge "found out late", eval note on the skill-trigger test.
- 2026-11-02 — S02E01 "found out late" solved; log in work/s02e01/log.md. Ignored work/*/sessions/ and work/*/txt/ (raw course session dumps).
- 2026-11-03 — Saved lesson text of s02e02 "Building an Agent" from mega start; wrote `knowledge/lessons/s02e02-building-an-agent.md` with the `lesson-notes` skill. Course table and Challenges list updated ("found out late" marked solved, "nobody asked" added); board: three S02E02 Planned items.
- 2026-11-03 — Added `tools/state.ts` and a SessionStart hook in `.claude/settings.json` that runs it, so every session starts with the base's state (inbox, Active lane, last log entry) without reading files (s02e02, item 3). Listed in CLAUDE.md layout and `index.md`.
- 2026-11-03 — S02E02 "nobody asked" solved; log in work/s02e02/log.md (code in work/s02e02/repo/, git-ignored). Board: Done entry and one Planned follow-up (own address in the agent's sender list, burst cap).
- 2026-11-03 — Mail agent: the human's own address added to ALLOWED_SENDERS (their yes); board follow-up narrowed to the burst cap.
- 2026-11-04 — Saved lesson text of s02e03 "Agentic Capabilities" from mega start; wrote `knowledge/lessons/s02e03-agentic-capabilities.md` with the `lesson-notes` skill. Course table and Challenges list updated ("nobody asked" marked solved, "schema first" added); board: two S02E03 Planned items, health-check item now includes a remove pass.
- 2026-11-05 — S02E03 "schema first" solved (claim 12, after a "no answer in time" refusal fixed by streaming files from KV). `work/s02e03/log.md` closed, debrief saved, board item moved to Done. barwy-tools stays deployed; its own GitHub repo is still a Planned item that needs a yes.
- 2026-11-05 — Saved lesson text of s02e04 "Multi-Agent Collaboration" from mega start; wrote `knowledge/lessons/s02e04-multi-agent-collaboration.md` with the `lesson-notes` skill. Course table and Challenges list updated ("schema first" marked solved, "two places" added); board: four S02E04 Planned items, heartbeat added to the health-check item.
- 2026-11-05 — S02E04 "two places" solved on the first claim; `work/s02e04/log.md` written (secrets in git-ignored `secrets.local.json`, worker log and transcript in git-ignored `txt/`, skills in `dl/`). Board Done entry, index line, course list and lesson note updated.
- 2026-11-05 — `tools/check.ts` now skips `dl/` folders (git-ignored Challenge downloads such as skill folders with their own frontmatter), like `repo/`.
- 2026-11-05 — Board: the human picked the naive agent loop (S02E01) as next up; moved it to the top of Planned with the decisions (from scratch, not on Pi; then compare with Pi `agent-loop.ts`; local repo `~/dev/personal/agent-loop`). The S02E02 journal/schedule extension sits right below it. Not started yet.
- 2026-11-06 — Saved lesson text of s02e05 "Agent Reliability" from mega start; wrote `knowledge/lessons/s02e05-agent-reliability.md` with the `lesson-notes` skill. Course table and Challenges list updated ("while you're away" added); board: three S02E05 Planned items, three existing items extended (agent-loop trace, mail-agent trace fields, lesson-notes eval cases).
- 2026-11-06 — S02E05 "while you're away" solved on the first live try; `work/s02e05/log.md` written (signing key, ntfy topic and admin token in git-ignored `secrets.local.json`, Worker code in git-ignored `repo/away-agent/`, QR in `dl/`). Board Done entry and a Planned item for the debrief gaps (event log, ntfy from Workers), index line, lesson note's Challenge line updated.
- 2026-11-06 — Reach test (s01e03 Try today) closed as passed: 5 questions in one fresh session, each worded unlike its note, all answered right; the agent reached the notes through `index.md`, the board and short greps. No changes to `index.md` or links. Board item moved from Active to Done.
- 2026-11-06 — Leaked S01E05 AI Studio key revoked: the human deleted `...PcRA` (created 2026-10-30) in AI Studio. Identified by creation date and by suffix checks of local env files (the mail agent uses `...CWOw`, which stays); the `AQ.Ab8R` start is shared by new-format keys. Board item moved to Done; `work/s01e05/log.md` line 92 is now resolved here.
- 2026-11-06 — Moved leftover test files `work/s02e03/sample.mp3` and `wrangler-dev.log` (local `wrangler dev` run of barwy-tools transcribe, 2026-11-04; result already in `work/s02e03/log.md`) to the Trash. Added `work/*/*.mp3` and `work/*/*.log` to `.gitignore` so run leftovers stay out of git.
- 2026-11-08 — Added `knowledge/topics/own-agent-loop.md`: pointer note for the local repo `~/dev/personal/agent-loop` (no remote, so a pointer to a path, not a URL), what each of the 7 steps showed, and a comparison with Pi's `packages/agent/src/agent-loop.ts` at commit `04a93bad8f`. Topic note, not lesson note, because it spans s02e01 (loop, cache), s02e02 and s02e05 (guardrails, trace). Board: "Next up" S02E01 item moved to Done; the S02E02 loop item now links the note.
- 2026-11-08 — Created private GitHub repo https://github.com/BarWyDev/agent-loop on the human's yes and pushed the loop code; pointer note `knowledge/topics/own-agent-loop.md` and its index line now carry the URL.
- 2026-11-09 — s03e01 "Mechanics Behind Product Engineering" opened: raw text saved to `lessons/s03e01-mechanics-behind-product-engineering.md`, lesson note written with `lesson-notes`; index, `context/course.md` (lesson row, Challenge "status for the night"; "while you're away" marked solved) and board updated (3 Planned items, 1 Done).
- 2026-11-09 — Planned lane triaged on the human's yes with a feasibility matrix (artifact https://claude.ai/artifact/LPz6gmA1Aax7n9k83neKB7): Active now holds barwy-tools repo, dev-guard push rule, `subscriptions.yaml` in agent-loop; 6 items archived with reasons (loop item merged into subscriptions, Agent Card, Standing-choice logging, S01E05 test writer, S01E04 repo gaps, limen ports); 2 closed as done (SessionStart state check, memory folder). Limen worker rules folded into the global CLAUDE.md item.
- 2026-11-09 — S03E01 "status for the night" solved. Run log `work/s03e01/log.md` (indexed); board Done line; `context/course.md` Challenge marked solved. Pack, frames and Worker source stay git-ignored under `work/s03e01/` (`dl/`, `repo/`); receipt in `secrets.local.json`. New user skill `capture` at `~/.agents/skills/capture` (symlinked into `~/.claude/skills`), outside this repo.
- 2026-11-09 — Worked through the board items that need no outside action: own loop step 8 (subscriptions, local commit `5aeb853` in agent-loop, topic note updated); `CLAUDE.md` rules got reasons and a side-session rule; `tools/check.ts` now enforces an append-only `log.md`; synced skills folder explained in `context/agent-setup.md`; barwy-tools repo checked for secrets and given a README on branch `add-readme`, waiting for a yes to create the GitHub repo. Board: 5 items to Done, barwy-tools item updated.
- 2026-11-09 — barwy-tools code now in private repo https://github.com/BarWyDev/barwy-tools (created on the human's yes; the human pushed `main` because dev-guard blocks the agent from pushing `main`; README as PR #1). Added pointer note `knowledge/topics/barwy-tools.md`; board item moved from Active to Done.
- 2026-11-09 — dev-guard 0.4.0 installed in `~/.claude/mods/dev-guard` on the human's yes: new `outsideAction` rule asks before pushes, GitHub repo changes, new PRs and issues in every project, so the Standing choice "every outside action needs a yes" is enforced in code. Built and tested on a copy first (29 tests pass). Board item moved from Active to Done; `context/agent-setup.md` updated.
- 2026-11-10 — s03e02 "Translating Intent into Agent Work" opened: raw text saved to `lessons/s03e02-translating-intent-into-agent-work.md`, lesson note written with `lesson-notes`; index, `context/course.md` (lesson row, Challenge "nothing ships unmarked") and board updated (2 Planned items, 1 Done).
- 2026-11-10 — memo_search eval done on an agreement (scope, outcome, boundaries, proof, fails when) accepted by the human: baseline pass^3 0/10, controls 2/2; code on local branch `eval-memo-search` in barwy-tools. Board: S02E05 eval item to Done, new Planned item to improve search with a "Done when"; `knowledge/topics/barwy-tools.md` updated.
- 2026-11-10 — Challenge S03E02 "nothing ships unmarked" solved (first claim accepted): added `work/s03e02/log.md` with the run, decisions and the lost-wave snag; new user skill `triage` in `~/.agents/skills/triage` (outside this repo). Index, `context/course.md` (Challenge solved) and board (1 Done, 1 Planned: look at the `ask` skill from the deck) updated.
- 2026-11-11 — s03e03 "AI-Native Product Development" opened: raw text saved to `lessons/s03e03-ai-native-product-development.md`, indexed. Lesson note (`lesson-notes`) and Challenge "out of office" not started yet.
- 2026-11-11 — Challenge S03E03 "out of office" solved (first verdict claim accepted): added `work/s03e03/log.md` (run, runner scripts in `work/s03e03/runner/`, snags, gaps); user skill `triage` grew a "Running alone" part (outside this repo). Index and board (1 Done, 2 Planned: s03e03 lesson note, Challenge follow-ups incl. the `bet` skill) updated.
- 2026-11-11 — `knowledge/records/` (lesson audio, 87 MB of mp3) added to `.gitignore` on the human's call: large binaries stay local, out of the repo.
- 2026-11-12 — s03e04 "Verifying Product Outcomes" opened: raw text saved to `lessons/s03e04-verifying-product-outcomes.md`, brief on the dashboard, lesson note written with `lesson-notes`; index, `context/course.md` (lesson row, Challenge "show me when") and board updated (3 Planned items, weekly health-check item extended).
- 2026-11-12 — Challenge S03E04 "show me when" started: added `work/s03e04/log.md` (brief, proof chain, report shape); session kept in git-ignored `work/s03e04/secrets.local.json`. Index and board (1 Active) updated.
- 2026-11-12 — Challenge S03E04 "show me when" solved (step two accepted on the first claim): `work/s03e04/log.md` completed (run, snags, what is left online, follow-ups). Index and board (1 Done, 1 Planned: follow-ups incl. the `prove` skill; Active emptied) updated. `.gitignore` now skips `work/*/out/step*/` and `work/*/out/dry/` (recordings and receipts).
- 2026-11-12 — Session scratch of S03E04 removed on the human's ask (trial recording, still frames, unpacked starter copy, `node_modules`, `dist`; all git-ignored and rebuildable). Kept list is in `work/s03e04/log.md`. Worker and public repo left online.
- 2026-11-13 — s03e05 "Products That Learn After Release" opened: raw text saved to `lessons/s03e05-products-that-learn-after-release.md`, brief on the dashboard, lesson note written with `lesson-notes`; index, `context/course.md` (lesson row, Challenge "what came back", "show me when" marked solved) and board (3 Planned items) updated.

## 2026-11-13 — S03E05 Challenge "what came back" solved

Went through two batches of post-release signals, grouped them and picked one of
six verbs per group with cited signal ids. Run log and findings in
`work/s03e05/`; both are now in `index.md`.

Structural change: added `.claude/skills/release-signals/` (SKILL.md plus
`reading-clips.md`). It is the second project skill, after `lesson-notes`. It
exists because the solve's two refusals came from the same gap — a recording
read by sampling instead of frame by frame — and because the rule the Challenge
asked to keep needs something that loads it. The skill holds both: the six
verbs, the checks against a release note, the kept rule, and the ffmpeg + PIL
method for reading a clip in full.


## 2026-11-13 — s03e03 lesson note back-filled

Wrote `knowledge/lessons/s03e03-ai-native-product-development.md` with the
`lesson-notes` skill. The raw text had been in `lessons/` since 2026-11-11, but
the note was skipped when the S03E03 Challenge took the session; s03e04 and
s03e05 notes already pointed at the gap. With this, every lesson s01e01–s03e05
has a note.

Updated `index.md` (one line under Knowledge), `context/course.md` (the s03e03
row now links the note) and `work/board.md`: the "s03e03 lesson note" Planned
item moved to Done, two new Planned items (feature map for barwy-tools plus the
skill that maintains it; a resource audit of this Mac), and three existing items
grew an s03e03 reason — the friction log, the weekly health check (change and
archive, Worker errors, artifact output) and the `agreement` skill (the four
edge-of-verification questions).

Checked while writing, so the "Mamy / Zrobić" column is not from memory:
`list_scheduled_tasks` returns nothing, `~/.claude/skills/security-audit` is
installed, and this repo has no `.claude/agents/`.


## 2026-11-16 — s04e01 lesson text, brief and note

"mega start" opened s04e01, called "Software Factory Make an Agent" on the
dashboard while the lesson page's own heading is "Mechanics Behind Autonomous
Systems". The raw text went to `lessons/s04e01-mechanics-behind-autonomous-systems.md`
— named after the page heading, like every other lesson file here, with both
names recorded in its header so either one finds it. The lesson is **extended**:
its second part, the Build guide (lab, black-box testing, expectations), is a
separate page that the MEGA MCP does not return, so it is missing from the base
until the human exports it into `inbox/` (the page needs a login). That is now a
Planned item.

Brief written and saved to the dashboard (`save-brief`), in Polish, like every
chat reply here.

Lesson note `knowledge/lessons/s04e01-mechanics-behind-autonomous-systems.md`
written with the `lesson-notes` skill: the five lesson sections, eleven pitfalls
and a 13-row apply table. Checked while writing, not from memory:
`list_scheduled_tasks` returns nothing (so the base has no heartbeat), there is
no `.claude/agents/` and no `~/.claude/CLAUDE.md`, the two hooks in
`.claude/settings.json` are the only events that wake anything here, and the
`durable-objects` skill is installed.

Updated `index.md` (two lines: the note and the raw text), `context/course.md`
(the s04e01 row, the "twenty payouts" Challenge, and a paragraph about the two
titles) and `work/board.md`: one Done line, four new Planned items (awareness
lines in `log.md`; send keys for mail-agent and away-agent; a cheap-model first
look over `inbox/`; the Build guide export) and the weekly health check item
grew the s04e01 reason — report to `work/health/<date>.md`, a message only when
something is red, and the Workers' logs read in the same run.

Also fixed one stale line in the s03e05 note: it still said the s03e03 note was
not written, which it has been since 2026-11-13.


## 2026-11-16 — heartbeat: tools/health.ts and a daily task

The s04e01 "Try today" item, built the same day. Until now nothing woke this
base: the only events were the two hooks in `.claude/settings.json`, both of
which need a session that the human started.

New script `tools/health.ts`. It runs `tools/check.ts` as a child (so that exit
code stays the source of truth), counts `inbox/` items, uncommitted paths and
the Planned lane, writes the report to `work/health/<date>.md` (a second run the
same day replaces it) and prints a `verdict` line. Red means something that
needs the human: `check.ts` errors, an `inbox/` item older than 7 days, or an
uncommitted change older than 7 days; exit code 2. Everything else (uncommitted
work from today, Planned over 15) is a warning and stays quiet. The report ends
with a "Not covered by this run" section, because a report that hides its blind
spots is worse than no report: the Workers (mail-agent, barwy-tools, away-agent,
`sched-prod-*`) still report errors nowhere, and no script judges duplicates or
missing links.

Structural change: `tools/check.ts` now skips `work/health/` (new `SKIP_PATHS`),
because the reports are run output, not notes — no frontmatter, no `index.md`
entry. `work/health/README.md` says so in the folder itself.

Scheduled task `mega-dev-heartbeat`, daily at 08:00 local, created in this
session on the human's yes, saved in Auto mode (this session's mode), file
`~/.claude/scheduled-tasks/mega-dev-heartbeat/SKILL.md`. Its prompt forbids
fixing, committing and writing `log.md`, `index.md` or `work/board.md`, so a run
nobody asked for cannot change the base behind the human's back; the only thing
it may do besides writing its report is send one notification when the verdict
is red. Scheduled tasks run only while the Claude Code app is open; a missed run
starts at the next launch.

Checked both ways, not only green: a clean run ends green and silent (exit 0),
and with a planted note without frontmatter (`knowledge/topics/_planted.md`) the
script went RED with exit 2. Then the task itself was run once with that file in
place: it reported RED, named the two errors, sent its notification and changed
nothing in the repo — the planted file was still there afterwards, unfixed, as
the prompt requires. The notification was not delivered, because the app drops
one while the human is active at the terminal; the 08:00 run, when nobody is
watching, is the case it exists for. The planted file was then removed.

Bookkeeping: `index.md` (the script), `CLAUDE.md` (layout rows for
`tools/health.ts` and `work/health/`, plus a new "Heartbeat" routine ahead of
the weekly health check), `context/agent-setup.md` (active routines, and the
s01e03 gap about routines narrowed to what is still missing), `work/board.md`
(Done line; the old "weekly health check as a scheduled task" item trimmed to
the judgment part it still carries) and the s04e01 note (rows 1 and 6 of its
apply table are no longer "Zrobić").

The reports themselves are git-ignored (`work/health/*.md`, README tracked): one
per day, rewritten on demand, and a report committed today would be wrong by
tomorrow.

## 2026-11-16 — S04E01 Challenge started

`start-challenge` for "Twenty payouts". New folder `work/s04e01/`: `log.md`
(tracked run log), `secrets.local.json`, `dl/` and `repo/` (all three
git-ignored by the existing patterns). Board: one Active line. Index: one line
for the run log. Not fetched on purpose: the course manual, because the time
limit is shown at the start and it is not known which call starts the clock.

## 2026-11-16 — S04E01 Challenge solved

"Twenty payouts" accepted on the third run. `work/s04e01/log.md` holds the three
runs, the refusal and the debrief link. Board: the Active line moved to Done,
one Planned line for the follow-ups. Index line rewritten. Not done on purpose:
the Host Desk (`work/s04e01/repo/host-desk/`) stays git-ignored, because it
holds `vars.json` and the state files with tokens; where it should live for the
rest of week 4 is a Planned item.

## 2026-11-16 — s04e01 Build guide saved

The second part of s04e01 is in the base: `lessons/s04e01-build-guide.md`
(`type: source`). The MCP does not serve it and the board said only the human
could export it; it turned out the browser pane is logged in to hq.mega.dev, so
the agent read the page's own Markdown file there. The page blocks sending it to
a local port, so the text was written out in three parts and checked against the
original: same 53320 bytes, same sha256. Named `s04e01-build-guide.md`, not after
its long heading, because it is part two of a lesson that already has a file.

Updated with it: the s04e01 lesson note (new section "Build guide", pitfalls
12–18, apply rows 12 and 14–16), the header blurb of the part-one source file
(pointer only; the lesson text is untouched), `index.md`, `context/course.md`
and `work/board.md` (the export item is Done; one Planned line for the first
black-box expectations). Not done on purpose: no tmux install, no Critic, no
hooks added — each changes the setup and needs the human's yes.

## 2026-11-17 — s04e02 lesson saved, note written

"mega start" opened s04e02 ("Software Factory Build the workspace"; page heading
"Building Portable Agent Control Planes"). Saved: the lesson text from the MCP
(`lessons/s04e02-building-portable-agent-control-planes.md`) and the Build guide
from the browser pane (`lessons/s04e02-build-guide.md`); the Build guide body is
byte-identical to the page's Markdown file (42617 bytes, sha256 `b80cf010…c7d3`).
Brief saved to the dashboard. Lesson note written with `lesson-notes`
(`knowledge/lessons/s04e02-building-portable-agent-control-planes.md`).
Updated: `index.md` (three lines), `context/course.md` (row, naming note,
Challenge "looks good to me"), `work/board.md` (Done line, four Planned lines).

`tools/check.ts` changed: `bodyLinks` skips fenced code blocks, because the
Build guide quotes a prompt containing a Markdown link to `MEMORIES.md` and source
files are not edited. Checked both ways: the base is green, and a planted broken
link outside a code block is still reported.

Not done on purpose: nothing from the "Zrobić" column — the heartbeat hash and
the cloud clone test are Planned (Try today); a repo for the global setup,
cloning Kody and keybindings each need the human's yes. The Challenge was not started.

## 2026-11-17 — S04E02 Challenge "Looks good to me" solved

Started from the human's prompt, on the server that was already connected. The
human chose the reviewer zip; it went into `work/s04e01/repo/host-desk/`
(git-ignored). The reviewer ran as given and was refused (commission copied
into its role), was rewritten to read `/settings` and the `why/` notes at every
start, and was accepted. The payout batch passed on its first run; the human
decided the one parked task (pay the account on file). Claim accepted, debrief
saved. New: `work/s04e02/log.md`. Updated: `index.md` (one line),
`context/course.md` (Challenge line), `work/board.md` (Done line, one Planned
line of follow-ups).

Not done on purpose: the course's checklist rules 4 and 5 and the `why/` read
for the payout-runner are Planned, because the Challenge was already accepted
and S04E03 builds on the same Host Desk; the `plane` skill from the deck is not
installed (needs the human's yes). Nothing committed.

## 2026-11-18 — s04e03 lesson saved, note written

"mega start" opened s04e03 "Software factory Staff the Team". Saved the MCP text
unedited as `lessons/s04e03-software-factory-staff-the-team.md` and wrote the
note with `lesson-notes` (`knowledge/lessons/s04e03-software-factory-staff-the-team.md`).
Files are named after the only title the MCP gave, because no separate page
heading was visible. Updated: `index.md` (two lines), `context/course.md` (row,
naming note, Challenge "three small changes"), `work/board.md` (four Planned lines).
Brief saved to the dashboard.

Not done on purpose: the Build guide is not saved — the browser pane landed on
the hq.mega.dev sign-in page, and signing in is the human's step — so the note
is `trust: medium` until it is read. Nothing from the "Zrobić" column was built;
a small model for a domain agent would break the Standing choice "opus for
everything". The Challenge was not started. Nothing committed.

## 2026-11-18 — s04e03 Build guide saved

The human signed in to hq.mega.dev in the browser pane. Read
`/lessons/s04e03/build-guide/lesson.md` there and saved it as
`lessons/s04e03-build-guide.md`. No file was downloaded: the text was retyped
from the page and then compared with it by sha256 (one dropped word found and
restored; the body now matches byte for byte, 38400 bytes). The lesson note got
a "Build guide" section, seven more pitfalls and five more table rows, and is
back to `trust: high`. Updated: `index.md` (one line added, one changed),
`context/course.md` (naming note), `work/board.md` (the "read the Build guide"
Planned line replaced by a Done line and two new Planned lines).

Not done on purpose: the brief on the dashboard was not rewritten, because its
Try today items still hold. Nothing committed.
