# mega_dev — course knowledge base

## Purpose

This is the knowledge base for the MEGA course (hq.mega.dev). It holds what was
learned in each lesson, the state of Challenges and experiments, and the context
an agent needs to help without rereading everything. The agent builds and
maintains it; the human reads it and drops raw material into `inbox/`.

## Rules

- **The agent owns the structure.** Folders, file names, links and templates are
  the agent's to change. Record structural changes in `log.md` with the reason.
- **The human writes only to `inbox/`.** Anything else the human wants changed
  goes through the agent.
- **Start every lookup at `index.md`.** It lists every note with a one-line
  summary. Grep second, not first. If a note was hard to find, fix `index.md`
  or add links instead of writing another note.
- **One fact, one place.** Link to a note instead of copying from it.
- **Never delete.** Move outdated notes to `archive/` and set `status: archived`.
- **Pointers, not copies.** Things already kept well elsewhere (lesson pages,
  GitHub repos) get a short pointer note with the URL, not a copy.

## Layout

| Path | Holds |
| --- | --- |
| `index.md` | Map of every note, one line each. Read first. |
| `inbox/` | Raw drops from the human: text, links, screenshots, session notes. |
| `context/` | Stable background: the course, the human's agent setup. |
| `knowledge/` | What was learned: one note per lesson, plus topic notes as they emerge. |
| `work/board.md` | Planned / active / done / archived work, with links to details. |
| `archive/` | Retired notes. |
| `log.md` | Dated log of filing and structural changes. |
| `tools/check.ts` | Mechanical health check: frontmatter, links, index coverage, staleness. Run `node tools/check.ts`. |

## Note format

Every note except `index.md`, `log.md` and inbox drops starts with frontmatter:

```yaml
---
title: Short title
type: context | lesson | topic | task | pointer
source: where it came from (URL, "session 2026-10-28", "inbox/<file>")
updated: YYYY-MM-DD
trust: high | medium | low   # high = primary source or verified; low = guess or unverified
status: active | stale | archived
tags: [short, lowercase]
links: [relative/paths/to/related.md]
---
```

Body: lead with a two- or three-line summary, then the details. No fixed
sections; pick the shape that fits the note.

## Routines

- **Filing the inbox** (when asked, or at session start if `inbox/` is not
  empty): for each item, update or create the right note, link it to related
  notes, add it to `index.md`, add a line to `log.md`, then move the raw item to
  `archive/inbox/`.
- **Health check** (weekly, or when asked): run `node tools/check.ts` for the
  mechanical part (frontmatter fields, broken links, notes missing from
  `index.md`, `updated` older than 30 days on `active` notes). Then judge what
  the script can't: duplicates to merge, notes that should link but don't.
  Report findings before making large changes.
- **After any change to notes:** run `node tools/check.ts` and fix errors before
  committing.
- **End of session**: move finished items on `work/board.md`, note what's next.
