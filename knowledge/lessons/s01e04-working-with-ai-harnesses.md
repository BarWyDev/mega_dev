---
title: "s01e04 — Working with AI Harnesses"
type: lesson
source: lessons/s01e04-working-with-ai-harnesses.md (https://hq.mega.dev/lessons/s01e04/)
updated: 2026-11-01
trust: high
status: active
tags: [harness, multi-agent, coordinator, workers, settings, teamwork, automation]
links: [../../lessons/s01e04-working-with-ai-harnesses.md, s01e02-steering-models-through-context.md, s01e03-building-knowledge-systems.md, s01e05-building-workflows-not-tool-stacks.md, ../topics/limen-mapping.md, ../topics/pi-and-herdr.md, ../../context/agent-setup.md, ../../work/board.md, ../../work/s01e04/log.md]
---

Narzędzi, modeli i trendów przybywa co kilka tygodni i nie trzeba gonić
każdego. Potrzebny jest dobry system: kilka trafnych decyzji o środowisku,
setup przenośny między harnessami i właściwe nastawienie. Lekcja pokazuje taki
system na przykładzie Pi + Herdr + limen (koordynator i workerzy rozmawiający
przez pliki), a potem omawia ustawienia modeli, pracę w zespole i automaty w
repozytorium. Najważniejsze: AI może budować i zarządzać setupem, ale setup ma
zostać jak najprostszy.

Surowy tekst: [lessons/s01e04](../../lessons/s01e04-working-with-ai-harnesses.md).
Przykłady: https://github.com/MEGA-DOT-DEV/examples (nazwy w nawiasach kwadratowych).
Szczegóły narzędzi: [Pi i Herdr](../topics/pi-and-herdr.md), [limen zmapowany na ten setup](../topics/limen-mapping.md).

## 1. Harnessy i jak wybierać

- Wybór jest ogromny: harnessy CLI (Codex, Claude Code, OpenCode, Pi, DeepSeek Harness, Grok Build), UI (Cursor, Zed, Devin), aplikacje do zarządzania agentami (t3code, humanlayer, superset), agenci (Hermes, Grok Bot, Dots), do tego terminal, modele, skille, integracje, rozszerzenia, konfiguracja. Na każdej warstwie „coś nowego co kilka tygodni”.
- Zasady, które to upraszczają:
  - **Źródła:** w feedach (X, YouTube) obserwuj duże laboratoria, oficjalne konta narzędzi i ich twórców; unikaj kont od hype'u. **Bycie trochę w tyle to zaleta** — warto patrzeć na to, co przetrwa ponad miesiąc.
  - **Multiprovider:** harness obsługujący wielu dostawców ułatwia zmianę modelu i użycie kilku modeli do jednego zadania (różne modele = różne perspektywy). Koszt: natywne harnessy są lepiej zoptymalizowane pod własne modele.
  - **Core features** (MCP, skille, subagenci) mają wszystkie harnessy i szybko kopiują nowości — nie zmieniaj narzędzia dla jednej funkcji.
  - **Critical features** to wyjątek: np. **samozarządzanie** (agent konfiguruje siebie i swoje instancje) albo **cloud agents**. Dla takich warto zmienić harness, więc bądź gotów zrobić to łatwo.
  - **Setup niezależny od harnessu:** agenci, skille, CLI, MCP przenoszą się między narzędziami (przykład: Kody Kenta).
  - **Natywne możliwości:** modele szybko się poprawiają; logika zbudowana wokół agenta (np. skill z [heavy-guidance]) może po cichu **obniżać** jakość. Praca „Context Language Models” sugeruje, że LLM-y zarządzają kontekstem lepiej niż nasze najlepsze strategie.
- Mapa wyboru: najgłębsza personalizacja → **OpenCode, Pi, DeepSeek Agent**; najwięcej „z pudełka” (cloud agents, orkiestracja) → **Cursor, Devin, Dots**; opcjonalna warstwa do zarządzania agentami → T3 Code, Superset albo Grok Bot, Dots.

## 2. Samozarządzanie: Pi + Herdr

- **Pi** to harness, który jest jednocześnie agentem do kodu (zarządza sobą i swoimi instancjami) i **rdzeniem własnego agenta** w aplikacji.
- **Herdr** zarządza instancjami Pi i **utrzymuje je przy życiu po zamknięciu terminala** (serwer → workspace na projekt → tab → pane z jednym agentem; stany: pracuje / czeka na człowieka / gotowe).
- Oba udostępniają dokumentację, więc można **rozmawiać z agentem o ustawieniach** zamiast konfigurować ręcznie. Agent może: uruchomić innego agenta, przekazać mu wiadomość, układać zakładki, zmieniać ustawienia, przejrzeć historię i zaproponować zmiany w workflow. [self-configuring-agent]
- Ćwiczenie z lekcji: w Herdr uruchom Pi i poproś o nową zakładkę „Hello World”. Agent: bada środowisko → otwiera tab → startuje nowe Pi → wysyła prompt → czeka i czyta wynik (`herdr tab create`, `agent start`, `agent prompt`, `agent read`; w nowszym Herdr komendy się zmieniły, patrz [pi-and-herdr](../topics/pi-and-herdr.md)).
- **Worker vs subagent:** worker jest w pełni interaktywny, konfigurowalny, ma własne hooki i może wystartować w tle na zdarzenie. Jeden agent orkiestruje wielu workerów, którzy przeżywają zamknięcie terminala. [background-workers]
- Samo uruchamianie workerów nie wystarcza. Potrzeba też: wymiany informacji między agentami, powiadomień dla koordynatora, bazy wiedzy (co zrobione, co zaplanowane), wspólnej wizji i reguł, ograniczonego udziału człowieka, sandboxów, z czasem własnego VPS i kont, hooków, pracy w zespole, monitoringu i ewaluacji. Kolejne lekcje to omawiają.

## 3. Setup wieloagentowy: limen

- Koordynator i workerzy (instancje Pi) **nie rozmawiają ze sobą bezpośrednio** — wszystko idzie przez pliki. Prosty **Supervisor** pilnuje każdego workera i zapisuje, jak skończył się job (nawet po crashu). Koordynator dostaje powiadomienie o końcu jobu i może sterować workerami w trakcie. Każdy przebieg ma folder jobu, a zadanie — folder feature'a.
- Przebieg: Ty prosisz o efekt → koordynator pisze ticket i startuje workera → worker dostaje własną przestrzeń, robi zadanie, commituje i raportuje → supervisor zapisuje wynik → koordynator dostaje „job ended” → **Ty decydujesz, co wchodzi**, koordynator merguje i zamyka.
- Zbudowane z plików tekstowych, gita i instrukcji. **Bez bazy danych, kolejki, bramek i frameworków** — tylko mały CLI łączący:
  - **git worktrees** — każdy worker ma własną kopię kodu i gałąź;
  - **Herdr** — własna zakładka na workera, supervisor sprawdza, czy żyje;
  - **rozszerzenia Pi** — u koordynatora dopisują wiadomość do czatu, gdy job się kończy [job-end-notifications]; u workera dostarczają poprawki koordynatora między wywołaniami narzędzi [worker-steering] i dają narzędzie do raportu końcowego;
  - **pliki tekstowe** — globalne reguły (vision, styleguide, board) wstrzykiwane do każdego promptu i ticket per feature, który worker czyta na starcie.
- **Kod robi tylko to, czego tekst nie zrobi niezawodnie:** start jobu, obserwacja, zapis wyniku, powiadomienie. Reszta (co budować, jak pisać, kiedy prosić o review) to tekst.
- Zastosowanie: `limen init` → razem z agentem napisz `vision.md` i `styleguide.md` → zainstaluj Pi i Herdr → poproś Pi o implementację. **Vision:** opis produktu, kierunek, mapa feature'ów. **Styleguide:** reguły pisania kodu; w odróżnieniu od AGENTS.md wstrzykiwany częściej, więc oba pliki muszą być **bardzo zwięzłe**. Działa na macOS i Linux (część odzyskiwania agentów tylko macOS).

## 4. Ustawienia: modele, effort, koszt, prywatność

- Gdy koordynator zarządza resztą, routing modeli to kilka rekomendacji dla niego (np. SOTA + high effort, SOTA + low effort, mniejszy model).
- Domyślnie **najlepszy dostępny model (SOTA)**. Taniej: niższy reasoning effort dla prostszych zadań albo mniejszy model.
- **Nie ma reguły na poziom effortu** — zależy od modelu, zadania i harnessu. Benchmarki dają tylko punkt odniesienia; trzeba sprawdzić na własnych zadaniach. [effort-routing]
- **Cena za token to za mało:** liczy się **koszt na zadanie** (slopalytics). Przykład: model A $0,50/M tokenów × 220k tokenów = $0,11 na zadanie; model B $2,00/M × 40k = $0,08 — droższy token, tańsze zadanie.
- Workflow wieloagentowe wyraźnie zyskały od ok. Opus 4.8; starsze lub open-source'owe modele (np. Qwen) mogą sobie nie radzić.
- **Prywatność:** gdy jest krytyczna, **żaden LLM nie wybierze niezawodnie modelu** — potrzebna **deterministyczna separacja** (projekt prywatny podpięty tylko do modelu lokalnego, bez ścieżki do chmury), bo modele sprytnie obchodzą granice. [privacy-boundary]

## 5. Praca w zespole

- **Wspólne zasoby:** AGENTS.md i skille udostępniane przez repo git, `npx skills` albo wewnętrzny serwer MCP (skills over MCP). Muszą być **wspólne i łatwe do aktualizacji**.
- **Wewnętrzna baza wiedzy:** z własnym API (CLI/MCP), na zdalnym serwerze, zarządzana przez agenta, który porządkuje inbox i wprowadza zmiany zespołu; harmonogramy i zdarzenia uruchamiają porządki; klony synchronizowane na urządzeniach zespołu.
- **Stack przyjazny AI:** narzędzia firmy (także CRM, design, obsługa klienta) **wprost wyznaczają**, ile da się zrobić z AI. Lista zespołu MEGA: PostHog, Axiom; Vercel, Minio, Depot, Cloudflare + Alchemy, Tailscale, UploadThing; Pi, Herdr, Moshi, OpenRouter; XState, Effect, oxlint, mdsvex; Clerk, Convex; Linear, Stripe, Resend, Attio; Paper, Figma.
- **Automaty w repo:** agenci z GitHubem (Claude Code GitHub Actions, Cursor, Devin, CodeRabbit), wołani w komentarzach i PR-ach albo zdarzeniami repo. Zastosowania: aktualne docsy i baza wiedzy, issue → PR z kontekstem, review każdego nowego PR [pr-review-rules], drobne poprawki, wykrywanie problemów w kodzie i zależnościach, przypisywanie PR-ów, zbieranie danych, sprzątanie martwego kodu. Agent działa w ramach uprawnień: start, jedno zadanie, stop; wynik zawsze trafia do człowieka, który merguje albo prosi o zmiany.

## 6. Wnioski z lekcji

AI może budować i zarządzać setupem, ale trzymaj go **jak najprostszym**, żeby
szybko iterować. Pi + Herdr to przykład, nie nakaz — Claude Code czy Cursor
też są w porządku, jeśli pasują do Twojego kontekstu. Jedna rzecz do zabrania:
pobaw się repozytorium limen, porozmawiaj o nim z agentem i **wyciągnij pomysły
albo dopasuj je do siebie**.

## Na co uważać

1. **Gonienie nowości.** Zmiana narzędzia dla jednej funkcji to strata czasu; czekaj, aż coś przetrwa miesiąc, wyjątek tylko dla funkcji krytycznych.
2. **Ciężkie skille i logika wokół modelu mogą pogarszać wyniki** bez wyraźnego winnego. Gdy model się zmienia, sprawdź, czy dodatki nadal pomagają.
3. **Cena za token myli.** Porównuj koszt i czas na całe zadanie, nie cennik.
4. **Granica prywatności w promptcie to nie granica.** Separacja ma być deterministyczna (konfiguracja, sieć, klucze), nie decyzją modelu.
5. **Worktree to nie sandbox.** Oddziela pracę, ale worker może zrobić wszystko, na co pozwala Twoje konto.
6. **Czysty koniec jobu to nie akceptacja.** Człowiek decyduje, co trafia do gałęzi głównej.
7. **Vision i styleguide wstrzykiwane co wywołanie muszą być krótkie**, inaczej zjadają kontekst i są ignorowane.

## Do zastosowania w tym setupie

Szczegółowe porównanie limen z tym setupem jest w [limen mapping](../topics/limen-mapping.md); tu tylko to, co z niego wynika, plus reszta lekcji.

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Samozarządzanie, workerzy, powiadomienia, sterowanie | Mamy | Claude Code desktop: sesje w tle z powiadomieniem o końcu, `SendMessage` do działającej sesji, worktree na sesję. Herdr nie jest potrzebny ([limen mapping](../topics/limen-mapping.md#mapping)). |
| 2 | Board i decyzje właściciela (TRACK) | Mamy | `work/board.md` z sekcją Standing choices (port 1, 2026-10-29). |
| 3 | Reguły przypominane w trakcie | Mamy | Hook `tools/check.ts` po każdej edycji `.md` (port 2). |
| 4 | Reguły workera globalnie | Zrobić | Cztery reguły workera z limen do `~/.claude/CLAUDE.md` — już w Planned (porty z limen). |
| 5 | Szablony ról | Zrobić | Jeden subagent w `~/.claude/agents/` (source-reader) — już w Planned; to samo wyszło w [s01e02](s01e02-steering-models-through-context.md). |
| 6 | Effort i koszt na zadanie | Zrobić | Eksperyment z effortem (już w Planned) mierzyć jako **koszt i czas na zadanie**, nie tokeny; wynik wpisać jako standing choice per rodzaj zadania. |
| 7 | Setup niezależny od harnessu | Zrobić | Skille trzymać jako zwykłe `SKILL.md` w repo (jak `lesson-notes`), bez rzeczy specyficznych dla Claude Code; przy S01E04 zadziałał symlink `.claude/skills -> ../.agents/skills`. Zapisać to jako konwencję w globalnym `CLAUDE.md`. |
| 8 | Natywne możliwości > ciężka logika | Zrobić | Przy cotygodniowym przeglądzie (Planned) sprawdzać też, czy któryś skill/hook nie jest już zbędny, i archiwizować. |
| 9 | Źródła wiadomości | Zrobić | Krótka lista obserwowanych źródeł (laby, oficjalne konta narzędzi) w `context/` — tylko jeśli chcesz; to decyzja dla Ciebie. |
| 10 | Automaty w repo (PR review, issue → PR) | Zrobić | Luki z debriefu S01E04: kształt issue i reguła uploadu do Pages w repo rig — już w Planned. Claude Code GitHub Actions do rozważenia przy pierwszym własnym repo, nie w repo z Challenge'y. |
| 11 | Deterministyczna granica prywatności | Mamy | Sekrety tylko w git-ignorowanych `secrets.local.json` (standing choice). |

## Powiązane

- Challenge: [before i looked](../../work/s01e04/log.md) — plan → issues → build → podgląd na Pages; tu pierwszy raz skill z repo przez symlink.
- [limen mapping](../topics/limen-mapping.md), [Pi i Herdr](../topics/pi-and-herdr.md).
- Poprzednia lekcja: [s01e03](s01e03-building-knowledge-systems.md). Następna: [s01e05](s01e05-building-workflows-not-tool-stacks.md) (zdalni agenci, VPS, bezpieczeństwo).
