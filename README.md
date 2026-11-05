# mega_dev

Knowledge base for the [MEGA course](https://hq.mega.dev/): lesson notes,
Challenge solve logs and the state of ongoing work. An agent (Claude Code)
builds and maintains it; the human reads it and drops raw material into
`inbox/`.

## Where to start

- [index.md](index.md) — every note, one line each.
- [work/board.md](work/board.md) — planned, active and done work.
- [CLAUDE.md](CLAUDE.md) — rules, folder layout, note format and routines.
- [log.md](log.md) — dated log of filing and structural changes.

## Adding material

Drop text, links, screenshots or session notes into `inbox/`. The agent files
them into the right notes and moves the raw item to `archive/inbox/`. Don't
edit other folders by hand; ask the agent instead.

## Health check

```bash
node tools/check.ts
```

Checks frontmatter, links, index coverage and stale notes. A Claude Code hook
in `.claude/settings.json` runs it after every Markdown edit.
