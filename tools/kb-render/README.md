---
title: kb-render — render a kb export
type: context
source: Challenge S01E03, session 2026-10-28
updated: 2026-10-28
trust: high
status: active
tags: [svelte, mdsvex, render, tool]
links: [../../work/s01e03/log.md]
---

# kb-render

Throwaway SvelteKit + mdsvex + adapter-static build for a kb export (`.svx` pages,
`#lib` alias, `runbook` layout). Used in S01E03 to see the kb as the desk sees it.

1. Copy this folder somewhere temporary (scratchpad), then `npm install` (needs the human's approval).
2. Copy the export's `src/lib/` and `src/routes/` into `src/` there.
3. `npm run build` → static site in `build/`. Check the page text in `build/kb/...`.
