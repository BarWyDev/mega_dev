---
name: lesson-notes
description: Turn a MEGA course lesson into a lesson note in this knowledge base — detailed summary, what to watch out for, and what to apply to the human's agent setup, then board, index and log updates. Use after "mega start" opens a new lesson, or when the human asks to summarize, digest or "process" a lesson (s01eNN), or to back-fill a lesson note.
---

# Lesson notes

One run per lesson. Output: `knowledge/lessons/<id>-<slug>.md`, plus the
bookkeeping CLAUDE.md requires. Follow CLAUDE.md for note format and rules;
this skill only adds the steps and the note shape.

## 1. Get the source

- Raw text must be in `lessons/<id>-<slug>.md` (`type: source`). If it is not,
  call the MEGA MCP `mega-start` (serves the current lesson only) and save the
  text unedited. Older lessons need the human to export them into `inbox/`.
- Read the whole raw file. Large lessons: read in parts, never summarize from
  the outline alone.

## 2. Read what it lands on

Before writing, read so the "apply" part is concrete, not generic:

- `context/agent-setup.md` — what the setup has and lacks.
- `work/board.md` — Planned items and Standing choices (don't duplicate a Planned item; link it).
- The Challenge log for this lesson, if any (`work/<id>/log.md`).
- Earlier lesson notes in `knowledge/lessons/` — link, don't repeat.
- What the current session can see of its own harness (skills listed, tools,
  plugins, reminders): facts from here are the most useful "Do" items.

## 3. Write the note

Frontmatter per CLAUDE.md, `type: lesson`, `source:` the raw file path plus the
lesson URL `https://hq.mega.dev/lessons/<id>/`. Write the body in **Polish**
(the human reads these notes); keep frontmatter, tags, file names and
established English terms (token, harness, compaction, skill, subagent) as they
are. Shape, with these Polish headings:

1. **Summary** (no heading) — 3–5 lines: the lesson's core idea and why it matters.
2. **Detailed sections** — follow the lesson's own structure. Each point: what
   it is, the number or example the lesson gives, and the runnable example name
   in brackets (e.g. `[context-compaction]`) when there is one. Keep numbers
   exactly as the lesson states them.
3. **`## Na co uważać`** — numbered pitfalls, each one line of risk plus one
   line of what to do. Only things the lesson supports.
4. **`## Do zastosowania w tym setupie`** — table:
   `# | Punkt z lekcji | Stan | Co zrobić`. Stan is `Mamy` (already in place,
   name where) or `Zrobić` (a concrete action in this setup). Verify every
   `Mamy` by looking, not from memory. Prefer actions that change a file, a
   setting or a habit over "be mindful of".
5. **`## Powiązane`** — Challenge log, earlier and later lesson notes, topic notes.

Example of the finished shape: `knowledge/lessons/s01e01-mechanics-behind-generative-ai.md`.

If an idea spans lessons, put it in `knowledge/topics/` and link to it instead.

## 4. Bookkeeping

- `index.md`: one line under Knowledge.
- `context/course.md`: add or update the lesson's row in the Lessons table.
- `work/board.md`: each new `Do` worth tracking → one Planned line linking the
  note. Skip items already on the board. Mark "back-fill lesson note" Done if
  it applies.
- `log.md`: one dated line.
- Run `node tools/check.ts` (the hook does it on Edit/Write) and fix errors.

## 5. Report to the human

In Polish: the summary in a few lines, the top 3 pitfalls, the `Zrobić` items
ranked by value, and any setup change that needs
their yes (removing plugins, global config). Don't make those changes without it.
