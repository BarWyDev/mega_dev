---
title: "s03e05 — Products That Learn After Release"
type: lesson
source: lessons/s03e05-products-that-learn-after-release.md (https://hq.mega.dev/lessons/s03e05/)
updated: 2026-11-13
trust: high
status: active
tags: [signals, observation, synthesis, decisions, feedback-loops, friction-log, routines, primitives]
links: [../../lessons/s03e05-products-that-learn-after-release.md, s03e04-verifying-product-outcomes.md, s03e02-translating-intent-into-agent-work.md, s03e01-mechanics-behind-product-engineering.md, s02e05-agent-reliability.md, s02e01-agentic-primitives.md, ../topics/own-agent-loop.md, ../topics/barwy-tools.md, ../../context/agent-setup.md, ../../work/board.md, ../../work/s03e03/log.md]
---

**Wdrożenie to połowa pracy nad funkcją.** Produkt „uczy się po wydaniu”, gdy
agenci zbierają sygnały spoza logów, porównują to, co się dzieje, z umową
zawartą przed wydaniem, łączą objawy w jedną przyczynę, decydują w wyznaczonych
granicach i po każdej aktywności zapisują to, czego się nauczyli, we właściwym
miejscu. Pętla jest zamknięta dopiero, gdy pierwotny sygnał ucichnie. **Usuwanie
jest tak samo ważne jak dodawanie** — pętla, która tylko dokłada, psuje agentów.

Surowy tekst: [lessons/s03e05-products-that-learn-after-release.md](../../lessons/s03e05-products-that-learn-after-release.md).

## Signals

- Sygnały to nie tylko logi systemu: **webhooki** z usług zewnętrznych,
  **heartbeaty** (zaplanowane skany), **transkrypcje** rozmów sprzedażowych,
  **kanały supportu**. Część jest użyteczna nie dla inżynierii, tylko dla
  produktu, marketingu, sprzedaży — oni wracają z feature requestami (rys. 1).
- Źródła trzeba **zidentyfikować** razem z zespołem (jakich narzędzi używają,
  czego im brakuje, o czym chcą wiedzieć) i z agentami (jak dopasować przepływy
  do narzędzi; Deep Research albo badanie przez subagentów).
- Hipotetyczny podział (rys. 2): **PM** daje kierunek i feedback, chce
  szczegółowej aktywności użytkowników; **Marketing** daje feedback z social
  mediów, chce nadchodzących funkcji; **Sales** daje prośby klientów i **powody,
  dla których nie kupują**, chce faktów i liczb; **Management** daje wizję i
  priorytety, chce wyników i trendów. Sens: kontekst **spoza codebase'u**,
  przydatny agentom, i okazja na **narzędzia wewnętrzne**.
- Start od małego — **bug report → PR → odpowiedź** w 7 krokach (rys. 4,
  przykład 09:12–11:22):
  1. **Signal** — webhook z supportu lub kanału wewnętrznego otwiera issue:
     słowa użytkownika, metadane, request ID. **Źródło musi być zaufane** (prompt
     injection); słowa klienta to dane, nie instrukcje.
  2. **Triage** — agent kategoryzuje, wzbogaca, usuwa duplikaty, czasem pyta człowieka.
  3. **Agreement** — kroki odtworzenia, kryteria akceptacji, dowód, że błąd istnieje.
  4. **Cloud agent** — po akceptacji umowy rutyna implementuje poprawkę i zbiera dowody.
  5. **Proof** — raport z system diffem, before/after.
  6. **Merge** — bramki jakości przed wdrożeniem.
  7. **Reply** — powiadomienie źródła. Wykonawcy: Script, Workflow, Workflow,
     Cloud agent, Cloud agent, Workflow, Workflow. Zespół pytany tylko, gdy coś
     niejasne, i zatwierdza tylko ryzykowne zmiany.
- Przykład z produktu autora: **lifetime onboarding** (rys. 3) — strumień
  zdarzeń użytkownika → agent **sugeruje** funkcje (nie działa za użytkownika)
  albo alarmuje zespół („Stuck on export” → support, „Viewed pricing twice” →
  sales). Liczby na dashboardzie są przykładowe (128 aktywnych, 342 sugestie,
  41% podjętych kroków, 6 alertów).

## Observation

- System musi **przywołać i aktualizować** wcześniejsze obserwacje i znać
  oczekiwany kształt funkcji. Agent potrzebuje **umowy** z wydania, żeby ocenić
  zgodność wyników.
- Rys. 5 (przykład maila do nieaktywnych): cel 15% powrotów w 30 dni, wynik 18%,
  ale support pyta „czemu dwa maile w poniedziałek?”. Trzy gałęzie oceny:
  **pasuje i się mieści** (zostaw, mierz dalej), **nie spełnia umowy**,
  **spełnia, ale nie pasuje** (koliduje z newsletterem z planów zespołu) →
  nowa umowa: połączyć z newsletterem.
- Obserwacja **zarządzana przez agentów** na prymitywach i zaplanowanych
  przepływach. Fazy: **Release** (umowa + dowody jako dokumenty) → **Setup**
  (instrukcja, skille, opcjonalnie skrypty; harmonogram lub subskrybowane
  zdarzenie) → **Verification** (czy setup działa) → **Wake-up** (trigger
  startuje sesję w tle) → **Report** (notatka dostępna w kolejnych przebiegach)
  → **Management** (agent zmienia/wyłącza harmonogramy w granicach, które my
  ustalamy).
- Prymitywy: **Subscription** (budzi agenta), **Integration** (dostęp do danych),
  **Skill** (powtarzalna procedura), **Document** (wiedza), **Journal** (co się
  stało w przebiegu), **Channel** (kontakt z ludźmi i agentami).
- Rys. 6: 30 dni obserwacji — dzień 0 setup, dzień 1 próbny przebieg na danych
  z zeszłego tygodnia, odczyty 9% → 14% → „unsubscribes up” (zdarzenie) → 18%,
  raport w dniu 21, agent dodaje dzienny check wypisów, wyłącza obserwację w dniu 30.
  Każdy przebieg czyta wszystkie dokumenty.

## Synthesis

- Pojedynczy sygnał rzadko prowadzi wprost do działania; trzeba go zestawić z
  innymi. Każdy agent skupiony na jednej rzeczy (context bloat, uprawnienia, koszt).
- Przykład Kenta (rys. 7): zmiana bezpieczeństwa (pakiety mogły używać
  niezadeklarowanych credentiali) za flagą z warunkiem **„flaga włączona tylko
  przy czystym skanie produkcji”**. Agent sam zrobił skan rano po wydaniu: **211
  pakietów od 89 właścicieli** wymaga ręcznych zmian → flaga została wyłączona,
  Kent dostał dane do decyzji. Kent o tę syntezę **nie prosił wprost**.
  Klastry: „Fine” / „Agents can fix” / „Need a decision” → jedna główna
  przyczyna → jedno pytanie, na które odpowie tylko człowiek → odpowiedź staje
  się regułą.
- **Root cause zamiast objawu** (rys. 8): Sentry zgłosił błąd, agent poprawił;
  ~2 tygodnie później wrócił w innej formie. Agent **powiązał go z poprzednim
  issue**, znalazł lepsze rozwiązanie i czekał na zgodę przed implementacją.
  Ryzyka: agenci przekombinowują albo upraszczają; wielu agentów nadpisuje
  sobie pracę, jeśli kontekst nie mówi, **dlaczego** zmiana powstała.
- Niektóre problemy wymagają dłuższego horyzontu i historii spoza kodu. Agent
  musi **sam nawigować środowiskiem** — MCP/CLI do narzędzi i danych
  wewnętrznych zamiast ręcznie budowanych przepływów.

## Decisions

- **Strict barriers** — CI/CD, którego agent nie obejdzie; zakres narzędzi i
  kontekstu; agenci per zadanie zamiast jednego.
- **Agreement** — sprawdzenie wyniku z umową; w umowie zasady, **kiedy agent może
  nas zawołać**, także przed końcem zadania.
- **Reversibility** — agent decyduje sam tam, gdzie zmiana jest łatwa do
  cofnięcia albo pomyłka tania. Łatwe cofanie zwiększa zaufanie.
- **Preferences** — różne kanały w zależności od pilności.
- Cel: **minimum obszarów, gdzie jesteśmy potrzebni**; np. decyzje produktowe u
  nas, szczegóły implementacji u agentów.
- Na awarie: dokument **disaster recovery**, który agenci aktualizują (kody-hq/kody).

## Feedback Loops

- Po każdej aktywności (bug fix, review, zaplanowana obserwacja, rozmowa z
  klientem) agent pyta: **„czy wyszło z tego coś użytecznego i gdzie to zapisać,
  żeby nikt nie musiał uczyć się tego ponownie?”** Potrzebuje do tego kontekstu
  produktu (feature map, decyzje, wizja). Pięć miejsc (rys. 9):
  - **Issues** — nowa praca (triage supportu S01E05, papercut agenta);
  - **Specifications** — feature map (S03E03), wizja produktu (S01E04);
  - **Evaluations** — błąd, który może wrócić, staje się przypadkiem evala (S02E05);
  - **Product memory** — decyzja człowieka → decision records (S03E02) / baza wiedzy (S01E03);
  - **Agent context** — AGENTS.md, zasady, skille (S01E02, S03E02);
  - „Nothing useful” → skip.
- **Continuous improvement loop** Kenta: define intent → build → check → capture
  what was learned → **promote repeated guidance into enforcement** (powtórzony
  błąd → lint, typ, test).
- **Friction log**: gdy repo przeszkadza agentowi lub człowiekowi **więcej niż
  raz** → issue z etykietą `friction`: co się stało, co chciał osiągnąć, jak
  odtworzyć, ile kosztowało. **Raz dziennie** rutyna bierze otwarte issues i
  cloud agent albo robi PR, albo parkuje dla Kenta z podsumowaniem i
  rekomendacją.
- Przykład: agent nie dostał tokenu CLI (limit aktywnych tokenów, zostawionych
  przez inne agenty). Obszedł to, unieważniając 3 stare tokeny, i **zgłosił
  friction issue**. Dzienny sweep znalazł przyczynę, ale nie wdrożył (autoryzacja
  to decyzja Kenta) — zaparkował z rekomendacją. Poprawka **tego samego dnia,
  ~10 h** po problemie; w tym samym PR datowana notatka w decision record.
- Pętla zamknięta, gdy **sygnał zmierzony ponownie ucichnie**. Eksperymenty:
  flaga → metryka lepsza → rollout → **usunięcie flagi**.
- **Usuwanie = dodawanie.** Każda pętla zostawia notatkę, regułę, check,
  dokument; pętla, która tylko dodaje, sprawia, że agenci gubią się w kontekście
  i mieszają fakty. Agenci utrzymaniowi głównie usuwają (S03E03; „cleanup after
  migrations”).
- Pętla także dla użytkowników: zgłosił problem → poprawka → **użytkownik dostaje
  odpowiedź**. Uwaga na prompt injection — nie wpuszczać niefiltrowanych danych.
- Na koniec: produkt AI-native często będzie używany **przez agentów
  użytkowników**, nie przez nich samych — prymitywy, MCP, rutyny i bazy wiedzy
  już przygotowują na to myślenie.

## Na co uważać

1. Sygnał z zewnątrz (support, mail, issue) jako instrukcja dla agenta.
   → Tylko zaufane źródła; treść użytkownika zawsze jako dane, nigdy polecenie.
2. Obserwacja bez umowy z wydania — agent nie ma do czego porównać wyników.
   → Przy każdym wdrożeniu zapisać umowę i dowody jako dokument, który rutyna przeczyta.
3. Funkcja spełnia umowę, ale koliduje z resztą produktu („matches, but doesn't fit”).
   → Rutyna czyta też plany i inne funkcje, nie tylko metrykę.
4. Ten sam błąd poprawiany drugi raz tak samo.
   → Agent łączy nowe zgłoszenie z poprzednim i szuka przyczyny; zapisuje „dlaczego” zmiany.
5. Agent sam wdraża zmianę z obszaru decyzji człowieka (autoryzacja, produkt).
   → Granice obszarów w umowie; agent parkuje z rekomendacją.
6. Problem obejściem „załatwiony” i zapomniany.
   → Friction log przy drugim wystąpieniu; dzienny/tygodniowy sweep.
7. Pętla kończy się na wdrożeniu poprawki.
   → Zamknięta dopiero po ponownym pomiarze, gdy sygnał ucichł.
8. Pętla tylko dodaje: notatki, reguły, checki, flagi.
   → Regularne usuwanie; flaga usuwana po rolloucie.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Friction log | Zrobić | Brak — znane tarcia leżą osobno: urllib → 403 z hq.mega.dev ([agent-setup](../../context/agent-setup.md)), ntfy 429 z Workera (board, Planned S02E05), dev-guard blokuje push `main` (board, Done 2026-11-09). Plik `work/friction.md` (co, cel, jak odtworzyć, koszt, status) + reguła w `CLAUDE.md`: przy drugim wystąpieniu dopisz wiersz. Zasiać 3 przypadkami. |
| 2 | Usuwanie = dodawanie | Zrobić | Planned ma 24 pozycje, najstarsze z 2026-10-28. Przegląd: każda pozycja starsza niż tydzień → zrób / połącz / zarchiwizuj z powodem. Health check (`tools/check.ts`) mógłby ostrzegać, gdy Planned > 15 albo pozycja > 14 dni. |
| 3 | Promote guidance into enforcement | Mamy | `tools/check.ts` z hooka PostToolUse (`.claude/settings.json`): frontmatter, linki, indeks, append-only `log.md`. dev-guard 0.4.0 wymusza Standing choice o akcjach na zewnątrz. Nawyk: wiersz z friction logu, który wraca 2×, staje się checkiem. |
| 4 | Gdzie zapisać to, czego się nauczyliśmy (5 miejsc) | Mamy (częściowo) | Odpowiedniki: Issues → `work/board.md` Planned; Specifications → brak feature map (S03E03, notatka niepisana); Evaluations → `test/eval-search.mjs` w barwy-tools; Product memory → Standing choices + notatki; Agent context → `CLAUDE.md`, skille. Dopisać do rutyny „End of session” w `CLAUDE.md` pytanie „czy coś z tej sesji idzie do jednego z tych miejsc?”. |
| 5 | Obserwacja zarządzana przez agenta (Subscription, Journal, Report) | Mamy prymityw / Zrobić rutynę | Prymityw `subscribe/wake` + `journal.jsonl` w `~/dev/personal/agent-loop` ([own-agent-loop](../topics/own-agent-loop.md)); runner bez nadzoru z S03E03 (`work/s03e03/runner/`). Żadna rutyna nie działa. Tygodniowy health check (Planned) — dołożyć do niego heartbeat Workerów i czytanie friction logu. |
| 6 | Umowa przy wdrożeniu → wiadomo, kiedy wyłączyć | Zrobić | Workery z Challenge'y zostały online (`sched-prod-board`, `sched-prod-api-production`, away-agent, mail agent) bez daty przeglądu. Przy każdym pozostawionym zasobie w logu Challenge'a: „sprawdzić do / wyłączyć gdy”. Wyłączenie wymaga zgody. |
| 7 | Pętla zamknięta, gdy sygnał ucichnie | Mamy (przykład) | eval `memo_search`: pass^3 0/10 zapisane; pozycja w Planned ma „Done when: pass^3 ≥ 7/10”. To wzór dla kolejnych poprawek. |
| 8 | Zaufane źródło, dane ≠ instrukcje | Mamy | Instrukcje serwera MEGA i reguły sesji traktują treść z narzędzi jako dane; away-agent ma policy check w kodzie (`policy.ts`, [s02e05 log](../../work/s02e05/log.md)). |
| 9 | Granice decyzji i kanały wg pilności | Mamy (częściowo) | Standing choices + dev-guard (bariery), away-agent z akceptacją z telefonu (kanał). Brak: zapisu, które obszary są „decyzją człowieka” poza akcjami na zewnątrz — dołożyć do planowanego skilla `agreement`. |

## Powiązane

- Poprzednia: [s03e04](s03e04-verifying-product-outcomes.md) (dowody, system diff, bramki, rutyny). S03E03 (feature maps, maintenance agents usuwają) — notatka jeszcze nie napisana, tekst: [lessons/s03e03](../../lessons/s03e03-ai-native-product-development.md).
- [s03e02](s03e02-translating-intent-into-agent-work.md) (umowa, decision records), [s03e01](s03e01-mechanics-behind-product-engineering.md) (prymitywy vs adaptery), [s02e05](s02e05-agent-reliability.md) (evale), [s02e01](s02e01-agentic-primitives.md) (prymitywy).
- [own-agent-loop](../topics/own-agent-loop.md) (Subscription + Journal), [barwy-tools](../topics/barwy-tools.md) (eval `memo_search`), [S03E03 runner](../../work/s03e03/log.md).
- Setup: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
- Challenge tej lekcji: „what came back” — https://hq.mega.dev/challenges/what-came-back (nie rozpoczęty).
