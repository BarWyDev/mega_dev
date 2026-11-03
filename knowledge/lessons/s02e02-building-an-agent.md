---
title: "s02e02 — Building an Agent"
type: lesson
source: lessons/s02e02-building-an-agent.md (https://hq.mega.dev/lessons/s02e02/)
updated: 2026-11-03
trust: high
status: active
tags: [custom-agent, primitives, model-routing, tool-design, context, prompt-cache, journal, durable]
links: [../../lessons/s02e02-building-an-agent.md, s02e01-agentic-primitives.md, s01e05-building-workflows-not-tool-stacks.md, s01e04-working-with-ai-harnesses.md, s01e03-building-knowledge-systems.md, ../topics/pi-and-herdr.md, ../../context/agent-setup.md, ../../work/board.md]
---

Własnego agenta budujemy wtedy, gdy harness użytkownika (Claude przez MCP) nie
wystarczy: agent ma działać na danych całej platformy, w tle, bez UI. Lekcja
pokazuje projekt **samoewoluującego, opartego na prymitywach, trwałego
(durable) agenta**: zamiast projektować funkcje, kształtujemy środowisko
(interfejs, reguły, limity), a agent sam składa z prymitywów to, czego
potrzebuje. Kluczowe metryki i mechanizmy: cache hit rate (~99%), dziennik
tylko do dopisywania, kontekst wstrzykiwany w trakcie tury.

Surowy tekst: [lessons/s02e02-building-an-agent.md](../../lessons/s02e02-building-an-agent.md).

## Dlaczego własny agent

- Przykład: platforma e-commerce. Sprzedawca zarządza produktami przez Claude i
  MCP, ale rekomendacje kampanii z uogólnionych danych całej platformy musi
  dawać nasz agent — **nie użyjemy do tego harnessu użytkownika**.
- Polecany wykład: Lee Robinson, Stanford CS146S, „How always-on agents work”.

## Architektura

- Trzy drogi: od zera (z dzisiejszymi coding agentami realne), framework
  (Mastra, Cloudflare Agents SDK — mniej pracy, ale mniej kontroli nisko), albo
  open-source harness (Pi, Goose).
- 13 pytań projektowych: autonomia, UI (pełne / MCP Apps / generative UI),
  profile (osobne workspace'y?), możliwości (komputer, przeglądarka, sandbox),
  integracje, łączność, pamięć, samoewolucja, zarządzanie kontekstem,
  środowisko, **cache — cel 99% hit rate („critical”)**, komunikacja
  (akceptacje, raporty), bezpieczeństwo.
- Schemat: pętla Think → Act → Observe wokół modelu; harness („co budujemy”) =
  Context, Tools, Permissions, State; pod nim prymitywy (Integrations, Values,
  Secrets, Apps, Documents, Packages). Agent tworzy/edytuje prymitywy przez
  Permissions, a one wracają do kontekstu w następnym uruchomieniu.
  **Tylko Integrations wychodzą na zewnątrz.**

## Kluczowe cechy: kształtowanie środowiska

- Edytor zdjęć: zamiast stałych filtrów agent dostaje `filters.list/create/update/delete`
  i tworzy filtry dla użytkownika. Nowy problem: co z projektami używającymi
  filtra, który agent potem zmienił?
- Krok dalej: `tools.create`, `panels.create`, `workflows.create`. Nasza rola:
  interfejs + reguły („zachowaj historię”, „nie psuj istniejących projektów”) +
  limity („bez dostępu poza aplikację”, „bez usuwania plików”).
- Przykładowy agent: działa w tle w bazie wiedzy, uczy nas, korzysta tylko z
  zaufanych źródeł, nie ma UI, kontaktuje się przez notatkę / wiadomość / digest.
  Proaktywny przez **refleksję**, nie stały harmonogram: cichy w zajęte tygodnie,
  głębszy, gdy eksplorujemy. Każda zmiana zalogowana i odwracalna.
- Sześć prymitywów:
  - **Event** — sygnał o aktywności z dowolnego źródła.
  - **Schedule** — pobudki, które agent ustawia sam sobie.
  - **Document** — wszystko, co agent napisał dla siebie i dla nas.
  - **Skill** — powtarzalna praca zapisana do ponownego użycia, także deterministycznie.
  - **Journal** — wszystko, co agent zrobił; **wpisy tylko dopisywane, nigdy edytowane**.
  - **Channel** — jedyna droga do użytkownika.
- Kompozycja: Event wyzwala Skill wg typu, Schedule wiąże się z kategorią
  Documents, każda akcja zostawia wpis w Journal. W refleksji agent czyta
  Journal i decyduje: kiedy następna pobudka, co zapisać jako Skill, czy pisać
  przez Channel. Przy błędzie Journal pokazuje co i dlaczego.
- Część prymitywów to pliki (schedules, events, skrypty, dokumenty, journal),
  więc agent potrzebuje sandboxa do pisania kodu. Inne mogą żyć w bazie danych
  za dedykowanym interfejsem.

## Dostawcy i konfiguracja

- Nie wiązać się z jednym dostawcą: lock-in i potrzeba wielu modeli naraz
  (Gemini do obrazów, mix Anthropic + OpenAI dla kilku perspektyw).
- OpenRouter najprościej, ale część natywnych funkcji API może nie działać.
  B2B: Amazon Bedrock, Microsoft Azure.
- Architektura: **gateway + adaptery dostawców** — wszyscy mówią jednym językiem
  w aplikacji, dodanie/usunięcie dostawcy to drobiazg.
- **Model routing**: łatwe zadania do mniejszego, tańszego modelu lub niższego
  reasoningu. Pierwszy krok: para **primary / secondary**. Routery typu Max
  (Arena AI) to często przesada. Reguła routingu może być zwykłym kodem.
- Unikać warstw, które utrudniają migrację (np. Chat Completions → Responses API
  w OpenAI: bez migracji część modeli i funkcji jest niedostępna).

## Projektowanie narzędzi

- Dwa najważniejsze pytania: **czy narzędzie jest potrzebne** i **czy agent
  będzie wiedział, jak go użyć**. Technicznie to schematy + callbacki.
- Model potrafi używać API bezpośrednio, ale API bywają złe i dają
  **fałszywe sukcesy**: serwis muzyczny zwraca **200** niezależnie od wyniku
  [false-success-tool] — agent musi sprawdzić stan odtwarzacza.
- Wymuszone sekwencje: Stripe nie pozwala zmienić ceny produktu — trzeba
  utworzyć nową cenę i dezaktywować starą. Stripe model zna; wewnętrznego API
  już nie, i wtedy po prostu poległ.
- Gdy agent tworzy narzędzia sam, daj mu wytyczne i sposób oceny
  **nazw, opisów, schematów i formatu wyjścia**.
- Cztery natywne narzędzia przykładowego agenta: `core.exec` (kod w sandboxie),
  `web.search` (tylko zaufane źródła), `web.fetch`, `channel.send`.
  Harness sam używa `journal.append` i `events.add` — agent je widzi, ale
  **fizycznie nie może ich zmienić**.
- Workspace: do zapisu `documents/`, `skills/`, `schedule.yaml`; tylko do
  odczytu `events/` (pisze harness), `journal.jsonl` (harness + `journal.append`),
  `config.yaml` (tylko użytkownik).
- Startowy **przewodnik** jako Documents i Skills (np. skill `weekly-digest`) =
  „augmented tools”, które agent może modyfikować. Harmonogram typu
  **„dreaming”** każe agentowi porządkować dokumenty i harmonogramy.
- Cel: równowaga logiki deterministycznej i niedeterministycznej.

## Zarządzanie kontekstem

- Przewaga własnego harnessu: pokazujemy modelowi **co jest dostępne,
  dynamicznie**, a nie uczymy go, co ma robić.
- Cache hit rate to jedna z najważniejszych metryk — także przy rozszerzaniu
  istniejącego harnessu hookami.
- Stan środowiska trzeba wstrzykiwać **w trakcie tury**, więc sam AGENTS.md nie wystarczy.
- Układ kontekstu (od góry, część stała = cache):
  - **System prompt**: rola i możliwości (personalizowane) + notatki, które agent
    sam utrzymuje i poprawia w refleksji.
  - **Tools**: w code mode tylko `exec`, `search`, `fetch`; resztą steruje kod agenta.
  - **Początkowy developer message**: bieżący stan systemu.
  - **User message**: zwykle wysłany przez harness wg harmonogramu — agent musi
    wiedzieć, że **nie może zadawać pytań**; jedyny kontakt to `channel.send`.
  - **Developer message w trakcie tury**: tylko **to, co się zmieniło**
    (Events, Schedules, działające instancje).
  - **Tool hooks**: uogólnione, samosterujące komunikaty przed i po narzędziu.
- Zacząć prosto; pozwolić agentowi dojść do najlepszej formy przez self-play,
  ale nadzorować — modele ciągną do złożoności, my szukamy najprostszego
  rozwiązania. Evale w kolejnych lekcjach.

## Workflowy i zadania długoterminowe

- Ambient agent = ćwiczenie z niezawodnych systemów z logiką niedeterministyczną.
- Events raportują naszą aktywność („activity: busy”, „email: opened”,
  „message: read”); agent filtruje strumień i dostosowuje się albo przerywa akcje.
- Pamięć między uruchomieniami = **Journal + Documents**: agent filtruje wpisy
  Journal i zapisuje wnioski strukturalnie, potem w refleksji ustawia następną pobudkę.
- Równoległe aktualizacje mogą gubić dane → kolejki albo wersjonowanie.
  Odporność i pauza: pi-durable; watchery i cykliczne pobudki: pi-until.

## Na co uważać

1. Agent modyfikuje coś, czego używają istniejące obiekty (filtr, skill, szablon).
   → Wersjonować zmiany albo reguła „nie psuj istniejących”; stare wersje zostają.
2. Dziennik, który agent może edytować, przestaje być dowodem.
   → Journal tylko do dopisywania i egzekwowany przez harness (uprawnienia/hook), nie przez prośbę w prompcie.
3. Status 200 ≠ sukces; agent raportuje akcję, która się nie udała.
   → Narzędzie samo weryfikuje stan po akcji i zwraca prawdziwy wynik.
4. Nieznane API z wymuszoną sekwencją kroków (Stripe-like).
   → Opakować sekwencję w jedno narzędzie albo skill, zamiast liczyć na wiedzę modelu.
5. Dynamiczny stan wrzucany do system promptu psuje cache.
   → Stan w developer message po prefiksie; w trakcie tury tylko diff.
6. Agent autonomiczny „pyta” użytkownika i czeka w nieskończoność.
   → Powiedzieć mu wprost, że pytań nie ma, a jedyny kanał to `channel.send`.
7. Równoległe zapisy tych samych plików gubią dane.
   → Kolejka albo wersjonowanie; jeden pisarz na plik.
8. Modele komplikują rozwiązanie przy samoewolucji.
   → Nadzór i evale; wybierać najprostsze działające.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Prymitywy jako pliki | Mamy | Ta baza już ma Document (`knowledge/`), Skill (`.claude/skills/lesson-notes`), Event (`inbox/`), Journal (`log.md`), Channel (czat + brief na dashboardzie). Brakuje Schedule. |
| 2 | Journal tylko do dopisywania, egzekwowany przez harness | Zrobić | `tools/check.ts`: błąd, gdy `log.md` w working tree nie zaczyna się od treści z `git show HEAD:log.md` (czyli ktoś zmienił lub usunął stare wpisy). Hook już uruchamia skrypt po każdym Edit/Write. |
| 3 | Początkowy developer message z bieżącym stanem | Mamy | Hook `SessionStart` w `.claude/settings.json` uruchamia `tools/state.ts`: pliki w `inbox/` (poza README), pozycje „Active” z tablicy i ostatni wpis `log.md`. Agent zaczyna sesję ze stanem zamiast czytać pliki. |
| 4 | Schedule ustawiany przez agenta | Zrobić | Cotygodniowy health check jako zaplanowane zadanie — już na [tablicy](../../work/board.md); rozszerzyć: zadanie zapisuje w `log.md`, kiedy następny przebieg i dlaczego (refleksja zamiast stałej daty). |
| 5 | Model routing primary/secondary | Mamy (decyzja) | Standing choice 2026-10-29: opus do wszystkiego do czasu eksperymentu z effortem (na tablicy). Bez zmian. |
| 6 | Notatki agenta w system prompcie, poprawiane w refleksji | Zrobić | Folder pamięci projektu jest pusty — punkt już na tablicy (s01e02, item 3). |
| 7 | Narzędzie zwraca prawdziwy, akcjonowalny wynik | Mamy | `tools/check.ts` zwraca plik i powód błędu; hook oddaje to agentowi (exit 2). |
| 8 | Własna pętla agenta z Journal i Schedule | Zrobić | Rozszerzyć eksperyment z pętlą z s02e01 (na tablicy): dodać `journal.jsonl` pisany tylko przez pętlę i `schedule.yaml`, który agent edytuje; w osobnym repo. |

## Powiązane

- Poprzednia lekcja: [s02e01](s02e01-agentic-primitives.md) (pętla, cache prefiksu, pamięć, narzędzia).
- Wcześniej: [s01e03](s01e03-building-knowledge-systems.md) (baza wiedzy, którą ten agent kuratoruje), [s01e04](s01e04-working-with-ai-harnesses.md) (Pi, harnessy), [s01e05](s01e05-building-workflows-not-tool-stacks.md) (code mode, agenci w tle, bezpieczeństwo).
- Temat: [Pi i Herdr](../topics/pi-and-herdr.md) (pi-durable, pi-until).
- Setup: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
- Challenge tej lekcji: „nobody asked” — https://hq.mega.dev/challenges/nobody-asked (jeszcze bez logu).
