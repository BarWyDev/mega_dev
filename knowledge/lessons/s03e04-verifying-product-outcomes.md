---
title: "s03e04 — Verifying Product Outcomes"
type: lesson
source: lessons/s03e04-verifying-product-outcomes.md (https://hq.mega.dev/lessons/s03e04/)
updated: 2026-11-12
trust: high
status: active
tags: [acceptance, verification, evidence, agentic-lab, system-diff, review, quality-gates, routines]
links: [../../lessons/s03e04-verifying-product-outcomes.md, s03e02-translating-intent-into-agent-work.md, s03e01-mechanics-behind-product-engineering.md, s02e05-agent-reliability.md, s01e05-building-workflows-not-tool-stacks.md, s01e03-building-knowledge-systems.md, ../topics/barwy-tools.md, ../../context/agent-setup.md, ../../work/board.md]
---

**Agenci chętnie i szybko zbudują nie to, co trzeba** — odpłyną od wymagań,
skończą za wcześnie albo za późno. Zanim da się skalować autonomię, trzeba
zbudować zaufanie: odbiór pracy oparty na **dowodach złapanych z prawdziwego
buildu**, ilość dowodów dopasowana do ryzyka, czytelny „system diff” dla
człowieka, osobni recenzenci z granicami i deterministyczne bramki jakości.
Wiele z tych narzędzi, notatek i modułów powstaje **wyłącznie dla agentów**.

Surowy tekst: [lessons/s03e04-verifying-product-outcomes.md](../../lessons/s03e04-verifying-product-outcomes.md).

## Acceptance

- Punkt wyjścia: **umowa przed pracą** z [s03e02](s03e02-translating-intent-into-agent-work.md).
  Ale to, że agent wraca do umowy i raportuje „gotowe”, nie znaczy, że praca
  została dostarczona. Agent może **oszukać**: wygenerować dowód zamiast go złapać.
- Potrzebne: zasady (ogólne, dynamiczne) **plus część deterministyczna**.
  Napięcie: chcemy maksymalnej pewności przed wdrożeniem, ale bez ciężkiej
  recenzji dla najprostszych zmian.
- Rys. 1 — szansa, że praca jest dobra, vs wysiłek: krzywa rośnie stromo i
  spłaszcza się poniżej „Certain”. Kolejne punkty: Checks → Captured proof →
  Separate reviewer → Person approves. Trzy progi ryzyka:
  - **Composes** (mała poprawka, używa istniejącego) — dalej „więcej wysiłku, mało zysku”.
  - **Extends** (zmienia istniejące zachowanie) — odbiór tylko na checkach to „Accepted too early”.
  - **One-way door** (nowy prymityw, dane, pieniądze).
  - „Agent says done” — przekreślone kółko blisko „Certain”, niepołączone z krzywą.
- Siatka 9 rodzajów dowodów dla 4 przykładów:
  - literówka na stronie (Composes): Checks, Before and after;
  - poprawka webhooka (Extends): Checks, Tests, Real requests, Separate reviewer;
  - nowe menu mobilne (Extends): Checks, Measurements, Before and after, Recordings, Separate reviewer;
  - migracja danych płatności (One-way door): Checks, Tests, Real requests, Data records, Separate reviewer, Person approves.
  - Dwa wiersze Extends: **to samo ryzyko, inne dowody**. Zasada: dopasuj dowody
    do ryzyka i rodzaju zmiany, łap je z prawdziwego buildu.
- Agent potrzebuje **trochę elastyczności**, bo zakres zmienia się w trakcie.
  Brakujące narzędzia i wiedza o weryfikacji powinny wyjść przy umowie; gdy nie
  wyjdą, łapiemy to na dwa sposoby: **agent sam zgłasza** albo **wychodzi w
  zaplanowanych checkach** (albo oba).
- Rys. 2 — podsumowanie w PR dla menu mobilnego: 3 fazy (Agreement, Work,
  Acceptance), 6 kryteriów, każde zachowuje swój wiersz. 4 z dowodem (✓),
  „Works with a keyboard” bez dowodu (✗ „Missing tool”). W trakcie dodano „No
  overlap on a tablet”, usunięto „Animated opening” — każda zmiana z dymkiem
  „Reported”. Znacznik „Session end” między Work a Acceptance.

## Verification

- Strategie z poprzednich lekcji; zob. sekcję „Feedback” w S03E03 (jak dostosować
  system do agentów). Agenci zbudują wszystko, ale **my musimy pomóc im ustalić, co budować**.
- Przykład autora: wspólny runtime z dwoma cienkimi klientami (desktop i web),
  runtime lokalnie albo w chmurze. Rys. 3: Agent → „Lab tools” (start, drive,
  score; ramka „Lab, for agents only”) → „Run records” (zrzuty, logi, wyniki);
  Lab „używa aplikacji jak użytkownik” przez Interface → Runtime; Run records
  wracają do agenta jako „Evidence”.
- **Agentic lab** = głównie skrypty CLI: przeglądarka dla weba albo instancja
  desktopu; klik, pisanie, załączanie plików, zrzuty, krótkie wideo; wyniki w
  folderze tymczasowym. Szczegóły:
  - limit równoległych przeglądarek/instancji (CPU i RAM, zwłaszcza przy
    testach, lintach i kompilacji Rusta);
  - każda instancja z własnym kontem i workspace, seedy profili, osobny tryb do
    testów autoryzacji Clerk i synchronizacji z chmurą;
  - jeden interfejs logowania — agent mierzy przepływ danych, UI i wydajność;
  - desktop nie da się testować na VPS ani na laptopie (kradnie fokus) → VMPal;
  - nagrania: browser clips i Mac clips;
  - wywołania LLM API **fałszowane** w testach UI; tryb live z prawdziwym
    kluczem, limitem wydatków i liczby akcji;
  - agenci piszą skrypty do powtarzalnych checków i raportów — **co jakiś czas
    przejrzeć i posprzątać**;
  - recenzent wie o akcjach zależnych od platformy, żeby ich nie zgłaszał;
  - twarde granice: agent nie dotyka środowiska dev, workspace ani instancji
    autora; autor ma tryb debug do ręcznych testów;
  - nieodwracalne akcje (np. wysyłka maili) **zablokowane**, gdzie się da.
- Lab musi być **podłączony bezpośrednio do modułów** aplikacji (zmiany w
  architekturze) i ewoluuje — to nie jednorazowa robota.
- Rys. 4 — rutyny w tle:
  - **po każdym zadaniu**: PR wchodzi → „warto spojrzeć?” (nie: pomiń) →
    przeczytaj historię zadania → problemy z labem: niejasne zadanie, brak
    narzędzia, trudne w użyciu;
  - **raz w tygodniu**: agent w chmurze czyta wszystkie zadania (historie +
    problemy z labem) → zmiany: scalić podobne narzędzia, wycofać nieużywane,
    oskryptować ręczne checki, przyspieszyć wolne kroki → PR (my zatwierdzamy).
- Rutyny: Grok Bot, Cursor, Devin; Claude Code ma **cloud routines** (harmonogram,
  wywołanie API, zdarzenia GitHub). Zacząć od małych; nową rutynę łatwo zrobić,
  dobrą — trudno.
- **Agenci mają prowadzić listę aktywnych rutyn i miejsca, gdzie je włączono.**
- Dowody muszą być uporządkowane — agenci to zrobią, ale trzeba ich o to
  poprosić; inaczej rozjadą się po wielu miejscach i łatwo je skasować.

## System Diff

- Jeden agent generuje więcej kodu, niż da się śledzić; zespół agentów — tym
  bardziej. Lab **zwiększa szansę**, nie gwarantuje wyniku.
- Pytanie: jak nadążać za zmianami na tyle, by podejmować dobre decyzje.
  Trzy wymiary do wyboru:
  - **Cel**: przegląd architektury (czy kierunek dobry), diff kodu z
    krytycznymi fragmentami logiki, albo interaktywny dashboard;
  - **Forma**: tabele, wykresy, grafy, zrzuty, wideo, audio; zwykle HTML albo
    Markdown z komponentami;
  - **Treść**: balans szeroko/wąsko (albo przełączanie), maksymalny
    **signal-to-noise** przy wystarczającym kontekście.
- Pierwszą wersję skilla do system diffów niech agenci zrobią sami: przeskanują
  ostatnie PR-y i historię pracy z agentami.
- Rys. 5 — „We choose” (cel, forma, treść) → „Agents scan” → „Skill” → strona
  „System diff for one PR”: Answer, Decisions (a. rekomendowana, b. inna), Map,
  Before and after, Files and lines (po kliknięciu); od ogółu do szczegółu.
  „We decide” — tylko tak głęboko, jak trzeba; „What it missed” wraca do skilla.
- Feature maps z S03E03 pomagają też przy system diffach.
- Autor: diffy jako `.html` albo `.svx`; demo na cloud.overment.com, skill
  [`/system-diff`](https://github.com/overment/skills/tree/main/skills/system-diff).
  Agent czasem otwiera diff w jego przeglądarce, autor nagrywa notatkę głosową
  (Superwhisper). Rys. 6: pierwszy ekran = odpowiedź + ponumerowane decyzje z
  opcjami literowymi i gwiazdką przy rekomendacji; Map, Parts, Files — „tylko
  w razie potrzeby”. Notatka: „Go with 1b. 2a is fine. Why does the list jump
  on a phone?” → transkrypcja → agent przełącza na 1b, zostawia 2a, nagrywa
  listę na telefonie i aktualizuje diff.
- Dobry PR (repo Matta Pococka): **summary** najważniejszych zmian, **evidence**
  before/after, sekcja **merge danger**.
- Diff przydaje się też agentom: porównany z wizją produktu, user stories i
  syntetycznymi przepływami ujawnia luki, konflikty i okazje.

## Review

- Nawet jeśli przestajemy czytać kod, dalej dbamy o organizację, spójność, złe
  wzorce, wydajność i bezpieczeństwo — przez agentów. Przykład: PR w kody-hq z
  komentarzami Bugbota, CodeRabbit i Devina; własna aplikacja też to umie (S01E05).
- Modele często **naciskają za mocno albo za słabo**, a osobni recenzenci
  **nadpisują sobie zmiany**. Lekarstwo: kontekst z **zasadami**, **źródłami** i
  **granicami** (np. macierz wykonalności z S03E01).
- Rys. 7 — dwie rundy, 4 tory (autor, recenzenci, inni agenci, człowiek):
  - R1: security — brak walidacji wejścia (Principle: users and data first) → autor poprawia;
    code — rename tylko jako notatka (Source: inny agent edytuje ten plik);
  - R2: data — migracja jednokierunkowa (Boundary: one-way door) → człowiek zatwierdza;
    style — drobne uwagi odrzucone (Boundary: last round) → merge.
- Review poza kodem:
  - **Synchronizacja** — dokumentacja, baza wiedzy, strona produktu (tekst, obrazy, animacje);
  - **Learnings** — agent aktualizuje notatki i dostaje je w kolejnych runach;
  - **Komunikacja** — marketing, sprzedaż; powiadomienie, gdy funkcję zamówił
    konkretny klient (churn, upsell);
  - **Outcome check** — nowe harmonogramy do monitorowania funkcji na produkcji
    albo przeglądu adopcji po czasie;
  - **Ulepszenia** — research poza produktem (rynek, alternatywy, biblioteki).
- Sedno: dźwignia z agentów pracujących w tle.

## Quality Gates

- Tu **reguły, nie zasady** — decydujemy, ile wolności dać agentowi. Wiele
  (jeśli nie wszystkie) bramek powinno być **deterministycznych**.
- Przykład: workflow `validate` Kenta (kody-hq), ok. **30 checków**: oxfmt,
  oxlint, TypeScript, Wrangler dry run, npm audit, Vitest, testy Workera
  (`@cloudflare/vitest-plugin`), e2e Playwright, `tsx --test` dla CLI, plus
  własne skrypty w `tools/` (prymitywy, feature maps, dryf dokumentacji).
  GitHub Actions + WarpBuild.
- Rys. 8 — każdy PR startuje 6 grup równolegle (unit, server runtime, browser,
  agent tools, CLI, static); końcowy check czeka na wszystkie: wszystko zielone
  → merge, jedno czerwone → blokada. Static = 6 typowych narzędzi + 6 reguł
  domu. Utrzymanie: **komentarz recenzenta powtórzony dwa razy → nowa reguła**;
  co noc agent usuwa słabe testy, żeby zestaw był szybki.
- Ćwiczenie: ściągnąć repo kody-hq, porozmawiać z agentem o `tools/`, potem
  poprosić o przegląd własnego projektu i propozycję najważniejszych bramek.

## Wnioski

Proces weryfikacji podnosi jakość całego produktu i działa na inne obszary
biznesu, ale przede wszystkim na użytkowników. Musi pasować do naszego
oprogramowania i sposobu pracy; nie budować wszystkiego naraz — kilka
elementów dobrze zrobionych pokaże, jak bramka się zachowuje. To tylko
częściowo wyzwanie techniczne: wymaga **przejęcia odpowiedzialności za wynik**
(mindset Product Engineera).

## Na co uważać

1. „Agent mówi gotowe” to nie dowód; agent może wygenerować dowód zamiast go złapać.
   → Akceptować tylko dowód z prawdziwego buildu (komenda, plik, zrzut), który da się odtworzyć.
2. Zmiana Extends odebrana na samych checkach — „accepted too early”.
   → Przed odbiorem nazwać próg ryzyka (Composes / Extends / One-way door) i dobrać dowody z siatki.
3. Ciężka recenzja dla drobnych zmian to „więcej wysiłku, mało zysku”.
   → Dla Composes wystarczą checki + before/after.
4. Zakres zmienia się w trakcie i kryteria cicho znikają.
   → Każde kryterium zachowuje wiersz; dodane i usunięte oznaczone „zgłoszone”.
5. Recenzenci naciskają za mocno lub za słabo i nadpisują sobie zmiany.
   → Dać im zasady, źródła i granice (one-way door, ostatnia runda).
6. Rutyny, o których nikt nie wie, skąd się wzięły.
   → Jedna lista aktywnych rutyn z miejscem uruchomienia.
7. Dowody rozrzucone po wielu miejscach — trudne do znalezienia, łatwe do skasowania.
   → Jedno miejsce na dowody na zadanie, o które agent jest proszony wprost.
8. Skrypty checków pisane przez agentów gniją.
   → Okresowy przegląd i sprzątanie (np. w tygodniowej rutynie).
9. Testy UI, które wołają prawdziwe LLM API, kosztują.
   → Fałszować wywołania; tryb live z limitem wydatków i akcji.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Deterministyczna bramka | Mamy (baza) / Zrobić (barwy-tools) | Bazę pilnuje `tools/check.ts` z hooka PostToolUse w `.claude/settings.json`. W barwy-tools (`work/s02e03/repo`) brak bramki: `npm test` = „no test specified”, brak `.github/workflows`. Dodać `npm run gate`: `tsc --noEmit`, `wrangler deploy --dry-run`, `test/eval-search.mjs`; kod wyjścia ≠ 0 przy błędzie. CI w GitHub Actions później (push wymaga zgody). |
| 2 | Tabela odbioru: kryterium → dowód / „brak narzędzia”, zmiany zakresu „zgłoszone” | Zrobić | Dołożyć do planowanego skilla `agreement` (board, S03E02) część „Acceptance”: na koniec zadania tabela jak na rys. 2. Bez skilla pierwszą tabelę zrobić ręcznie przy następnej pozycji z Planned. |
| 3 | Próg ryzyka → zestaw dowodów | Zrobić | W tym samym skillu: pole „ryzyko: composes / extends / one-way door” i minimalne dowody dla każdego progu (siatka z rys. 1). One-way door = zgoda człowieka; zgadza się z Standing choice o akcjach na zewnątrz. |
| 4 | Dowód złapany, nie wygenerowany | Mamy (częściowo) | `test/eval-search.mjs` ma strażnika „za łatwo” (oblewa zapytanie kopiujące notatkę). Logi Challenge'y w `work/<id>/log.md` trzymają dowody w jednym miejscu. Brakuje reguły dla zwykłych zadań — wejdzie z punktem 2. |
| 5 | Blokada nieodwracalnych akcji | Mamy | dev-guard 0.4.0 (`~/.claude/mods/dev-guard`): pyta przed push, `gh repo …`, `gh pr create`, `gh issue create` ([agent-setup](../../context/agent-setup.md)). |
| 6 | Osobny recenzent z granicami | Zrobić | Brak `.claude/agents/`. Są skille `code-review` i `security-review`. Reguła w `CLAUDE.md` barwy-tools albo w skillu `agreement`: zmiana Extends+ przechodzi `code-review` przed odbiorem. |
| 7 | Rutyny w tle + lista aktywnych rutyn | Zrobić (już na tablicy) | Planned: tygodniowy health check jako scheduled task. Dopisać do tej pozycji: rutyna czyta logi zadań i szuka „brak narzędzia / niejasne zadanie”; lista aktywnych rutyn z miejscem uruchomienia w `context/agent-setup.md`. |
| 8 | System diff | Zrobić | Skill `/system-diff` (github.com/overment/skills) — przeczytać i zdecydować o instalacji; pobranie wymaga zgody. Wypróbować na zmianie `memo_search` (FTS5 albo embeddingi) jako artefakt: odpowiedź, decyzje, before/after wyników evala. |
| 9 | Notatka głosowa jako feedback do diffu | Mamy narzędzie | barwy-tools `transcribe` + lokalny whisper-cpp. Nawyk: komentarz do artefaktu podyktować zamiast pisać. |
| 10 | Lab: agent używa aplikacji jak użytkownik | Mamy narzędzie | Wbudowana przeglądarka (`mcp__Claude_Browser__*`) w tej sesji. Przy następnej zmianie UI w Challenge'u: zrzut before/after zapisany w `work/<id>/` jako dowód. |

## Powiązane

- Poprzednia lekcja z notatką: [s03e02](s03e02-translating-intent-into-agent-work.md) (umowa: scope, outcome, boundaries, proof; ewaluacja). S03E03 (feature maps, Feedback) — notatka jeszcze nie napisana, tekst: [lessons/s03e03](../../lessons/s03e03-ai-native-product-development.md).
- [s03e01](s03e01-mechanics-behind-product-engineering.md) (macierz wykonalności), [s02e05](s02e05-agent-reliability.md) (evale, guardrails w kodzie), [s01e05](s01e05-building-workflows-not-tool-stacks.md) (samoweryfikacja, test czerwony przed poprawką), [s01e03](s01e03-building-knowledge-systems.md) (baza wiedzy jako synchronizacja).
- [barwy-tools](../topics/barwy-tools.md) — kandydat na pierwszą bramkę.
- Setup: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
- Challenge tej lekcji: „show me when” — https://hq.mega.dev/challenges/show-me-when (nie rozpoczęty).
