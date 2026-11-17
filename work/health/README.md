# Health reports

One file per run of `node tools/health.ts`, named `<YYYY-MM-DD>.md`; a second run
the same day replaces that day's file. Written by the daily heartbeat task, which
reports and never fixes.

The reports are git-ignored (only this README is tracked), and `tools/check.ts` skips this folder: the reports are run output, not notes, so they
carry no frontmatter and are not listed in `index.md`.
