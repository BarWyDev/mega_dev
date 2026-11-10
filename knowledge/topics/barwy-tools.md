---
title: barwy-tools — own remote MCP server
type: pointer
source: private repo https://github.com/BarWyDev/barwy-tools (local work/s02e03/repo); session 2026-11-09
updated: 2026-11-10
trust: high
status: active
tags: [mcp, cloudflare, oauth, barwy-tools]
links: [../../work/s02e03/log.md, ../lessons/s02e03-agentic-capabilities.md, ../lessons/s02e05-agent-reliability.md, ../../work/board.md]
---

Własny zdalny serwer MCP na Cloudflare Workers, jeden właściciel: notatki
(`memo_write`, `memo_search`), linki do plików (`upload`) i zamiana mowy na
tekst (`transcribe`). Zbudowany w Challenge „schema first” (S02E03), działa dalej.

- Kod: prywatne repo https://github.com/BarWyDev/barwy-tools (od 2026-11-09).
  Lokalny klon: `work/s02e03/repo/` (git-ignorowany w tej bazie). README
  opisuje narzędzia, auth, pliki i uruchamianie.
- Działa pod: https://barwy-tools.barwy.workers.dev/mcp; co trzyma i po co:
  https://barwy-tools.barwy.workers.dev/plan. W Claude Code podpięty w user scope.
- Stos: MCP TypeScript SDK v2 + `@cloudflare/workers-oauth-provider`
  (DCR, PKCE, zgoda z hasłem właściciela); D1 na notatki, KV na pliki i
  tokeny, Workers AI do transkrypcji.
- Sekrety: tylko w `.dev.vars` (git-ignorowany) i w sekretach Workera.
  Historia repo sprawdzona przed pierwszym pushem: bez kluczy;
  `wrangler.jsonc` ma tylko ID zasobów.
- Pierwszy push `main` zrobił człowiek, bo dev-guard blokuje agentowi push
  na `main`; zmiany idą przez PR (pierwszy: README, https://github.com/BarWyDev/barwy-tools/pull/1).

Jak powstawał, testy, deploy i claimy: [log S02E03](../../work/s02e03/log.md).
Eval `memo_search` (2026-11-10, [s02e05](../lessons/s02e05-agent-reliability.md#do-zastosowania-w-tym-setupie), item 5):
`test/eval-search.mjs` + `test/eval-search.json` na branchu `eval-memo-search`
(lokalny commit `0fd78ff`). Wynik bazowy: kontrole 2/2, parafrazy pass^3 0/10 —
wyszukiwanie to `LIKE` z wymogiem wszystkich słów, więc nie znajduje notatki
opisanej innymi słowami. Uruchamiać tylko na lokalnej D1 (`--persist-to`),
seed ma stałe id.
