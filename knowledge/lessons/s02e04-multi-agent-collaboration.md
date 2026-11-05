---
title: "s02e04 — Multi-Agent Collaboration"
type: lesson
source: lessons/s02e04-multi-agent-collaboration.md (https://hq.mega.dev/lessons/s02e04/)
updated: 2026-11-05
trust: high
status: active
tags: [multi-agent, subagents, a2a, agent-card, delegation, orchestration, observability]
links: [../../lessons/s02e04-multi-agent-collaboration.md, s02e03-agentic-capabilities.md, s02e02-building-an-agent.md, s01e04-working-with-ai-harnesses.md, s01e02-steering-models-through-context.md, ../topics/limen-mapping.md, ../topics/session-handoffs.md, ../../context/agent-setup.md, ../../work/board.md]
---

Od pojedynczego agenta do zespołów: architektury (pojedynczy agent w wielu
instancjach, subagenci, hierarchia, zespół, rój), protokół **A2A** do
odkrywania i rozmowy agentów bez dzielenia się wnętrzem, oraz to, co w
praktyce robi z wieloma agentami system: kontrakty, menedżerowie zasobów,
samonaprawa, śledzenie kontekstowe, heartbeat. Orkiestracja to nie „system do
X”, tylko **prymitywy** + rozsądny podział między logikę agentową a
deterministyczny kod (blokady, zależności, akceptacja człowieka).

Surowy tekst: [lessons/s02e04-multi-agent-collaboration.md](../../lessons/s02e04-multi-agent-collaboration.md).

## Architektury multi-agent

- Koncepcja z lat 70.–80. (distributed AI). Ok. **połowy 2026** modele stały
  się dobre w komunikacji i handoffach między agentami; harnessy idą w tę
  stronę (np. Claude Managed Agents).
- Przykład: research w dwóch falach — lead wysyła pytanie do agentów tech /
  cost / risk, porównują wyniki; druga fala (cost + tech) kopie głębiej →
  raport. Flota składana **dynamicznie**, lead spawnuje i zamyka workerów.
- Dla każdego agenta trzeba określić **zakres, możliwości i uprawnienia**, a
  oprócz kontekstu każdego agenta — kontekst całego workflow.
- **Pojedynczy agent** w kilku instancjach na wspólnych zasobach to już
  multi-agent. Przykład: research 06:00–07:30, brief startuje o 07:00 i czyta
  pliki ze **starym** researchem.
- **Subagent** to mechanizm, nie architektura: **handoff** zadania do
  krótkotrwałego agenta. Może **czekać i wznawiać** — dopytać o kontekst lub
  zgodę [subagent-asks-back]. Wariant **worker**: osobna, interaktywna
  instancja, która **emituje zdarzenia** do rodzica.
- **Hierarchia**: lider → koordynatorzy (każdy ze swoim zakresem) → workerzy;
  koordynatorzy współpracują; może być składana dynamicznie.
- **Zespół**: role + **wspólna przestrzeń robocza**, każdy rozmawia z każdym,
  bez lidera.
- **Rój (swarm)**: role, reguły, uprawnienia, zakres i cel są zdefiniowane, ale
  agenci sami wybierają, kto robi zadanie. Jeszcze rzadkie w produkcji.
- Multi-agent łata ograniczenia modeli (okno kontekstu, posłuszeństwo
  instrukcjom), ale daje też **równoległość**: szybkość i różnorodność
  eksploracji; razem ze środowiskiem, które **weryfikuje** wyniki (błąd →
  powrót do agenta → ponowna próba).
- Współpraca także z agentami innych ludzi → **wystawiać część możliwości**,
  resztę chronić. Floty setek/tysięcy agentów: niezawodność, koszt, szybkość.
- **Błędy propagują się** między agentami: zły wynik A psuje kroki B, które
  biorą jego handoff, i wynik leada; C odzyskał i nie jest dotknięty.

## Agent2Agent (A2A)

- Agenci mają współpracować, ale nie ujawniać wnętrza (kontekst,
  specjalizacja, polityki, **cudzy agent**). Przykład złej konfiguracji:
  umawianie spotkania, mój agent na „co umiesz?” wymienia wszystkie zasoby
  (mail, pliki, smart lock, kalendarz), a na „czy może w piątek?” zwraca
  „dentysta 09:00, rozmowa w Acme 14:00”; drugi agent mógłby też kazać usunąć wpisy.
- **A2A** rozwiązuje odkrywanie i komunikację. Mniej popularne niż MCP; nie
  konkurują: **MCP rozszerza jednego agenta, A2A łączy agentów**. Jeden agent
  jest klientem, drugi serwerem (może działać w obie strony).
- **Agent Card**: nazwa, opis, wersja, skille, dane połączenia, metadane
  (dostawca, flagi możliwości), pod `/.well-known/agent-card.json` (RFC 8615).
  Bez narzędzi wewnętrznych, pamięci, implementacji. Kartę można ograniczyć do
  uprawnionych [agent-card-boundary].
- Agenci nie dzielą **wątków** → wiadomość musi zawierać **wszystko, co
  potrzebne**; części: tekst, dane strukturalne, referencje do plików.
- Transport: HTTP(S), zwykle JSON-RPC (`jsonrpc`, `id`, `method`, `params`),
  metoda `SendMessage`; wiadomość ma `messageId`, `role`, `parts`, opcjonalnie
  `contextId`, `taskId`, `metadata`, `extensions`.
- Obsługa: polling, SSE albo push notifications — wg potrzeb responsywności i trwałości.
- Przebieg: A czyta kartę B → wysyła wszystko, co ma → B pauzuje w stanie
  `TASK_STATE_INPUT_REQUIRED` i pyta → A odpowiada z **tym samym `taskId`** →
  B kończy (`TASK_STATE_COMPLETED`) i zwraca artefakt. Przykład: Research Agent
  ↔ Weather Agent, „czy w sobotę w Wrocławiu pada?” → „które godziny?” →
  „14–18” → „20% szans”. Warto sklonować a2a-samples i omówić je z agentem.
- Idee współbieżności z A2A: **multitasking** (wiele zadań, każde z ID i
  stanem), **wiele strumieni** (kilku klientów subskrybuje ten sam task, ta
  sama kolejność zdarzeń), **ID nadaje serwer**, nie klient (brak kolizji).

## Współpraca wielu agentów

- Modele są dobre w zadaniach długohoryzontowych (METR), ale praca w zespole
  agentów szybko się nakłada i konfliktuje — gubią się i ludzie, i agenci.
- **Struktura**: możliwie prosta, **agentic-first**; zdecydować, czy ludzie w
  ogóle czytają oryginały. Uprawnienia i bezpieczeństwo w **deterministycznym
  kodzie** (bramka przed `workspace/`), nie w samych agentach.
- **Kontrakty**: wspólne formaty dla wiadomości (koperta JSON), folderów (stałe
  drzewo), dokumentów (frontmatter), raportów i logów aktywności → deterministyczne
  wyszukiwanie, walidatory, health checki; czasem bazy grafowe.
- **Menedżerowie**: agenci nie sięgają po zasoby/narzędzia bezpośrednio, tylko
  przez menedżera (kolejka, reguły, rozwiązywanie konfliktów, globalny kontekst
  projektu, człowiek w razie potrzeby).
- **Samonaprawa**: system obserwuje siebie, czyta logi, czasem zmienia własną
  logikę; to może być **40–60%** całej pracy systemu.
- **Śledzenie aktywności** (Axiom, PostHog): obserwowalność jest **krytyczna**
  przy logice niedeterministycznej; logi **kontekstowe** (trace z drzewem
  agentów i spanami), nie luźne zdarzenia.
- **Heartbeat**: w długich zadaniach nie widać, czy agent pracuje, czeka czy
  utknął (cisza wygląda tak samo) → okresowe sprawdzenie i reakcja tylko na „stuck”.
- Część tych mechanik da się zbudować na istniejącym harnessie (MCP,
  customizacja). Pytanie kontrolne: **co stanie się z systemem, gdy modele /
  harnessy się poprawią?**

## Orkiestracja

- Przykład: publikacja filmu na YouTube — montaż, audio, napisy i tłumaczenia,
  tytuł/opis/tagi/rozdziały, miniatury, prawa autorskie i oznaczenia
  sponsorów, ekrany końcowe, Shorts, posty, newsletter, harmonogram, przypięty
  komentarz, potem analityka. Szansa, że **za każdym razem** wszystko wyjdzie,
  jest niska, bo kroki zależą od **naszej strategii, preferencji i procedur**.
- Cel to nie „system do publikacji wideo”, tylko **prymitywy** (etapy produce,
  package, verify, distribute, release, learn + playbook strategii), które
  obsłużą też podcast, artykuł, newsletter; `learn` zasila playbook.
- AI daje **elastyczność kosztem kontroli**. Lekcja 1: gdy potrzebna **100%
  pewność**, nie polegać na LLM (choć zadanie z milionem kroków rozwiązano
  bez błędu). Lekcja 2: nie każdy krok wymaga pewności → balans agent / kod:
  montaż przez DaVinci MCP, miniatury przez Replicate, tytuł iteruje agent a
  akceptuje człowiek, statystyki autonomicznie z powiadomieniem w razie potrzeby.
- Zależności często wynikają z decyzji biznesowych, w tym **fizyczna blokada**
  agenta przed pewnymi akcjami (komentarz publiczny za ścianą w kodzie); część
  kroków działa w tle bez nadzoru.

## Wnioski

- **Agenci**: podział odpowiedzialności daje kontrolę nad kontekstem,
  możliwościami i uprawnieniami oraz nad współbieżnością, konfliktami i strukturą.
- **Prymitywy**: rozszerzanie systemu przy minimalnych zmianach kodu.
- **Code mode**: powtarzalne akcje jako kod, AI tylko gdy logika się zmienia.
- **Kontekst**: spawnowany agent dostaje kontekst od rodzica + instrukcje
  zależne od roli **lub bieżącego stanu systemu**.
- **Zależności**: co równolegle, co po czym, co **zablokowane** do spełnienia
  warunku (komentarz dopiero po akceptacji, edycja wymaga nowej akceptacji) — np. DAG.
- **Trwałość**: proces długi i częściowo w tle → pi-durable albo agenci, którzy
  wstają po awarii.

## Na co uważać

1. Dwie instancje tego samego agenta na wspólnych plikach — jedna czyta stan, którego druga jeszcze nie zapisała.
   → Kolejność/zależność jawnie (np. „brief po zakończeniu researchu”) albo znacznik zakończenia zapisywany na końcu.
2. Błąd jednego agenta płynie przez handoffy do wyniku leada.
   → Weryfikacja na granicy handoffu, raport błędów i ścieżka naprawy, nie tylko „done”.
3. Agent udostępniony innym ujawnia prywatne dane albo wykonuje cudze polecenia (usuń wpisy).
   → Karta mówi tylko o umiejętnościach; odpowiedzi ograniczone do potrzebnego minimum; akcje zapisu za deterministyczną bramką.
4. Handoff bez pełnego kontekstu (agenci nie dzielą wątku) → zgadywanie albo pytania wstecz.
   → Brief zawiera wszystko, co potrzebne, plus kanał „dopytaj” (input-required / waiting).
5. Uprawnienia egzekwowane promptem.
   → Uprawnienia i blokady w kodzie (hook, bramka), agent tylko prosi.
6. Ciche, długie zadanie — nie wiadomo, czy pracuje, czeka, czy utknął.
   → Heartbeat / okresowe sprawdzenie stanu; reakcja tylko na „stuck”.
7. Luźne logi bez powiązań — nie da się odtworzyć, który agent co zepsuł.
   → Logi kontekstowe: wspólny identyfikator przebiegu i rodzic każdego kroku.
8. System zbudowany wokół ograniczeń, które modele zaraz usuną.
   → Przy każdym elemencie pytać „co z tym, gdy modele/harness się poprawią?” (pasuje do przeglądu remove z s02e03).

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Subagenci i handoff | Mamy | Narzędzie `Agent` (typy Explore, Plan, general-purpose, fork) i `SendMessage` do wznowienia; aplikacja desktop: osobne sesje (`start_session`) raportują po zakończeniu tury. Zob. [limen mapping](../topics/limen-mapping.md). |
| 2 | Predefiniowane role (zakres, możliwości, uprawnienia) | Zrobić | Brak `.claude/agents/` i `~/.claude/agents/`. Pierwszy: `source-reader` w `.claude/agents/` z narzędziami tylko do odczytu i kontraktem wyniku (źródło, fakty z cytatem, czego brak). Już w Planned (port z limen) — tu doprecyzowany kontrakt. |
| 3 | Kontrakty → deterministyczne lookupy i walidatory | Mamy | Frontmatter każdej notatki + `tools/check.ts` (hook `PostToolUse`). Brak kontraktu dla raportu subagenta — to punkt 2. |
| 4 | Pojedynczy agent w wielu instancjach na wspólnych plikach | Zrobić | Równoległe sesje mogą jednocześnie dopisywać do `log.md`, `index.md`, `work/board.md`. Dodać do `CLAUDE.md` regułę: sesje poboczne nie piszą do tych trzech plików, tylko zwracają linie do dopisania; pisze sesja główna (bo… inaczej konflikty i nadpisania). |
| 5 | Uprawnienia w kodzie, nie w prompcie | Mamy (częściowo) | Plugin dev-guard (hooki w `~/.claude/mods/dev-guard`) i Standing choice „każda akcja na zewnątrz wymaga yes”. Ta reguła jest tylko tekstem; ewentualny hook na `git push`/`gh` wymaga decyzji człowieka. |
| 6 | A2A / Agent Card | Zrobić | Eksperyment: dodać `/.well-known/agent-card.json` do mail agenta z S02E02 albo barwy-tools (Worker już jest) — tylko umiejętności, bez wnętrza; potem odpytać ją z drugiej sesji. Kod w repo Challenge, notatka-wskaźnik tutaj. |
| 7 | Heartbeat dla zadań w tle | Zrobić | Mail agent i barwy-tools działają bez nadzoru. Przy przeglądzie tygodniowym (Planned) dodać sprawdzenie „żyje?” (ostatnia aktywność w logach Workera). |
| 8 | Logi kontekstowe | Zrobić (później) | Mail agent: dodać `traceId` na wiadomość do każdej linii logu w Workerze, żeby przebieg mail → model → odpowiedź dało się odtworzyć. |

## Powiązane

- Poprzednia lekcja: [s02e03](s02e03-agentic-capabilities.md) (MCP, przegląd improve/remove).
- [s02e02](s02e02-building-an-agent.md) (prymitywy agenta, kanały, harmonogram), [s01e04](s01e04-working-with-ai-harnesses.md) (limen: koordynator i workerzy), [s01e02](s01e02-steering-models-through-context.md) (subagenci vs workerzy).
- Tematy: [limen mapping](../topics/limen-mapping.md), [session hand-offs](../topics/session-handoffs.md).
- Setup: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
- Challenge tej lekcji: „two places” — https://hq.mega.dev/challenges/two-places (nie rozpoczęty).
