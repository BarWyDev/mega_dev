---
title: "s02e01 — Agentic Primitives"
type: lesson
source: lessons/s02e01-agentic-primitives.md (https://hq.mega.dev/lessons/s02e01/)
updated: 2026-11-02
trust: high
status: active
tags: [agent-loop, instructions, system-prompt, context, prompt-cache, memory, tools, approvals]
links: [../../lessons/s02e01-agentic-primitives.md, s01e05-building-workflows-not-tool-stacks.md, s01e04-working-with-ai-harnesses.md, s01e03-building-knowledge-systems.md, s01e02-steering-models-through-context.md, s01e01-mechanics-behind-generative-ai.md, ../topics/pi-and-herdr.md, ../../context/agent-setup.md, ../../work/board.md]
---

Agent to pętla: stan → wywołanie modelu → wykonanie tool calli → wyniki do
stanu → powtórka, aż model odda sam tekst. Sama pętla jest prosta; o
niezawodności decyduje wszystko wokół niej (odzyskiwanie po błędach, wątki,
persystencja, cache prefiksu, compaction, odkrywanie narzędzi, akceptacje).
Do tego trzy warstwy, które kształtujemy sami: instrukcje, pamięć i narzędzia.
Lekcja jest fundamentem sezonu 2: z tej wiedzy budujemy własny harness albo
dostosowujemy istniejący na dowolnym poziomie.

Surowy tekst: [lessons/s02e01](../../lessons/s02e01-agentic-primitives.md).
Przykłady: https://github.com/MEGA-DOT-DEV/examples (nazwy w nawiasach kwadratowych).

## 1. Pętla agenta

- Schemat harnessu: caller → Wake → Context → Model → Actions (tool calls + approval) → wyniki wracają do Context; pod spodem History, Memory, Observability; hooki na strzałkach.
- Składniki pętli: **State** (wątek, kontekst, konfiguracja, zmienne pętli), **Model** (komunikacja z API dostawcy), **Tools** (schematy + callbacki), **Hooks** (obserwowalność, compaction, przetwarzanie plików). Warunek stopu: model nie zwraca tool calli.
- Wzorcowe implementacje open source: Pi (`packages/agent/src/agent-loop.ts`) i Goose. Pi podłączony do dowolnych narzędzi daje agenta ogólnego przeznaczenia. Zob. [Pi i Herdr](../topics/pi-and-herdr.md).
- Naiwna pętla pada na jednym błędzie API w środku tury. Harnessy (Claude Code, Codex) dodają odzyskiwanie. [loop-error-recovery]

## 2. Odpowiedzialności harnessu poza pętlą

- **Połączenie:** adaptery na dostawców (OpenAI, Anthropic); biblioteki typu AI SDK istnieją, ale zalecane są **oficjalne SDK**, bez zbędnych abstrakcji.
- **Wątki i sesje:** wątek może obejmować wiele sesji i subagentów; historia zwykle w plikach tekstowych czytanych przez bash. Nie każdy harness ma subagentów i łatwy dostęp do wątków.
- **Persystencja:** wątki, załączniki, artefakty, skrypty, skille, uprawnienia, integracje, własne narzędzia — i agent musi umieć tym **zarządzać** (np. znaleźć wcześniej wygenerowany obraz, pokazać ustawienia do nadania uprawnienia). Trzy poziomy dostępu: agent czyta (wątki, załączniki), agent tworzy i edytuje (artefakty, skrypty, skille, narzędzia), agent prosi, człowiek nadaje (uprawnienia, połączenia, integracje). Poza jednym użytkownikiem potrzebne są sandboxy i zarządzanie uprawnieniami.
- **Konfiguracja:** harness konfiguruje sam siebie, także UI w runtime (OpenCode, DeepSeek Harness — „wszystko jest pluginem”, self-evolving software).
- **Kontekst:** opis środowiska; **cache prefiksu** obniża koszt i opóźnienie tylko, gdy prefiks się nie zmienia [prompt-cache-prefix]; nie wszystko ładujemy z góry, resztę agent odkrywa; compaction streszcza starsze wiadomości, nowe zostają. Prefiks: system prompt, AGENTS.md, profil, podstawowe narzędzia.
- **Narzędzia:** function calling wymaga schematu w kontekście, a każdy wynik trafia do wątku — nieefektywne przy złożonych workflow. **Code mode:** model pisze skrypt łączący narzędzia, wyniki w zmiennych, do wątku tylko wynik końcowy. Duży wynik → plik, a model dostaje referencję (czyta fragment, pokazuje, przekazuje dalej).
- **Akceptacje:** harness nie wykonuje nieodwracalnej akcji bez zgody; czekanie może trwać dni i musi przetrwać. [resumable-run]
- Wnioski dla zwykłego użytkownika: AGENTS.md nie może być bardzo długi (model ignoruje większość, rośnie koszt i opóźnienie do czasu cache); skille krótkie i czasem **reaktywowane** po compaction; wątek jak najkrótszy albo agent wyspecjalizowany; informacja może zginąć w kompresji albo zostać zignorowana. Dalej dojdą rutyny, harmonogramy, zdarzenia, webhooki.

## 3. Osobowość i świadomość środowiska

- Claude Code usunął **80%** system promptu dla najnowszych modeli; w pracy bezpośredniej krótkie wiadomości wystarczają. Gdy agent pracuje **bez nas** (automaty, workflow w tle, logika w aplikacji), potrzebne są jasne instrukcje: co jest dostępne, a resztę agent ustali sam.
- Źródła: system prompty harnessów (repo CL4R1T4S Pliny'ego, np. GPT-6 Sol, Claude Opus 5.5), oficjalne poradniki (Prompting Opus 5.5, Rethinking skills and prompts for GPT-6), struktura system promptu Haiku 5.5 (dziesięć sekcji `claude_behavior`).
- Pięć bloków promptu: **Personality** (rola, z kim rozmawia), **Environment** (cel, np. brak łatwego dostępu do człowieka), **Context** (mapa zasobów albo gdzie ich szukać — inaczej agent twierdzi, że czegoś nie może), **Discovery** (jak odkrywać możliwości harnessu; źle zorganizowane dokumenty procesu = pominięte kroki), **Boundaries** (czego nie wolno — to tylko rekomendacja, model może zignorować).
- Proces: zacznij prosto, model pisze pierwszą wersję, weryfikuj albo oceniaj evalami, poprawiaj z modelem, aż prompt będzie **czysty, uogólniony** i zawierał tylko to, co potrzebne. „Działa” to nie to samo co „dobrze”. [prompt-eval-loop]
- Najlepsza rada (Latent Space Activation): prompt ma sprawić, że model **przywoła odpowiednią wiedzę i metody**, zanim odpowie.

## 4. Kontekst i pamięć

- Pamięć agenta = cztery rzeczy: **struktura** (tabela, drzewo, graf + metadane), **ekstrakcja** (zapis z rozmów i systemów zewnętrznych), **retrieval** (agentic search: LLM, wzorce, embeddingi, full-text, graf, modele decyzyjne), **kontekst** (jak pamięć trafia do agenta i narzędzia do czytania, zapisu, zmiany, usuwania).
- Brak standardów; większość harnessów robi pamięć naiwnie, „na pokaz”.
- Ekstrakcja: osobne zapytanie LLM w tle albo jawne tool calle; jako aktualizacje profilu (fakty walczą o uwagę) albo osobne dokumenty powiązane z resztą.
- Trudności: **sprzeczności** (nowa preferencja nadpisuje starą), **duplikaty**, **niejednoznaczność** (dwóch klientów o imieniu Adam) [memory-extraction], aktualizacje i historia zmian. Próby: wskaźniki pewności, notatki tymczasowe do czasu wyjaśnienia. Zapisać łatwo; trudno utrzymać jedną aktualną, jednoznaczną wartość w czasie.
- Przywoływanie ma być **szybkie, kontekstowe, wydajne**: ostatnia wiadomość często nie nazywa klienta ani spotkania, więc harness patrzy na cały wątek plus globalny kontekst (profil użytkownika/klienta, mapa), robi szybki lookup i re-rank (top 2 dokumenty). [contextual-recall]
- Projekty: mem0, supermemory, Hindsight (retain / recall / reflect; worker konsoliduje fakty w obserwacje i odświeża strony wiedzy). Inspiracje: pipeline obserwacji Joela Hooksa, lamarck Johna Lindquista.

## 5. Narzędzia

- **Świadomość:** agent wie, co umie, bez ładowania wszystkiego; system prompt ma listę możliwości, instrukcję jak doładować szczegóły i natywne narzędzia dostępne od razu. Trzeba zdecydować, co ładować od razu. [tool-search]
- **Zarządzanie:** predefiniowane narzędzia + MCP (w tym tygodniu) + własne integracje pisane przez agenta, zapisywane i używane ponownie po teście.
- **Odkrywanie:** katalog z narzędziem wyszukiwania (więcej kontroli) albo narzędzia jako pliki eksplorowane bashem (elastyczne, agent sam nimi zarządza — dobrze i źle). W skali: gateway, np. Uber dla **8000+** narzędzi (crawler → rejestr z nowymi narzędziami domyślnie wyłączonymi → proxy autoryzuje, redaguje, przycina odpowiedź), albo open source Treg.
- **Reużywalność:** skille ze skryptami; agent tworzy pakiety łączące integracje, magazyny wartości i inne pakiety.
- **Środowisko:** w produkcji wyraźnie rozdzielone workspace'y użytkowników — agent łatwo obchodzi granice i może dotrzeć do cudzych danych.
- Zakres swobody dobieramy sami: od pełnej kontroli po agenta, który sam się konfiguruje i rozwiązuje nowe problemy.

## 6. Wnioski

- Wiedząc, jak działa harness, wiemy, czego się po agencie spodziewać i dlaczego zawodzi (np. twierdzi, że czegoś nie ma, choć powinien to pamiętać).
- Zbudowanie choćby prostego agenta poprawia pracę z Claude, Pi i każdym innym harnessem.

## Na co uważać

1. Długi CLAUDE.md/AGENTS.md: model ignoruje większość, a koszt i opóźnienie rosną.
   → Trzymać krótko; szczegóły w notatkach, do których prowadzi `index.md`.
2. Zmiana czegokolwiek w prefiksie (system prompt, CLAUDE.md, lista narzędzi) unieważnia cache.
   → Edytować pliki instrukcji paczkami, nie w trakcie długiej sesji; dynamiczne rzeczy (daty, statusy) poza prefiksem.
3. Skill i reguły znikają po compaction albo są ignorowane.
   → Krótkie wątki, jedna sesja na zadanie; po compaction ponownie wywołać skill zamiast liczyć, że „pamięta”.
4. Pamięć: sprzeczne i zdublowane fakty, a stara wartość znika bez śladu.
   → Jeden fakt, jedno miejsce; przy zmianie zapisywać, co zastąpiło co i kiedy.
5. Boundaries w prompcie to tylko rekomendacja.
   → Twarde granice robić w ustawieniach i hookach (uprawnienia, PreToolUse), nie tylko w tekście.
6. Prompt „działa” po pierwszej wersji, ale nie jest „dobry”.
   → Weryfikacja albo eval na kilku przypadkach przed uznaniem skillu czy promptu za gotowy.
7. Wielki wynik narzędzia wrzucony do kontekstu zjada okno.
   → Zapis do pliku, w wątku tylko ścieżka i podsumowanie.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Hook między iteracjami pętli | Mamy | `.claude/settings.json`: PostToolUse uruchamia `tools/check.ts` po Edit/Write `.md` i zwraca błędy agentowi. |
| 2 | Pięć bloków instrukcji (personality, environment, context, discovery, boundaries) | Mamy (projekt) | `CLAUDE.md` ma cel, układ, mapę (`index.md`), zasady szukania i granice. Brak globalnego — punkt już na [tablicy](../../work/board.md) (globalny `~/.claude/CLAUDE.md`). |
| 3 | Odkrywanie narzędzi bez ładowania schematów | Mamy | Claude Code ładuje narzędzia MCP na żądanie (ToolSearch, deferred tools). |
| 4 | Świadomość możliwości bez szumu | Zrobić | Usunąć zdublowane skille Cloudflare (już na tablicy, wymaga zgody). |
| 5 | Akceptacje przed nieodwracalnymi akcjami | Mamy | Standing choices na [tablicy](../../work/board.md): każda akcja na zewnątrz wymaga „tak”. |
| 6 | Zbuduj własną prostą pętlę, żeby zobaczyć mechanikę | Zrobić | Skrypt TS (~60 linii) z oficjalnym SDK Anthropic: jedno narzędzie bash, hook `beforeModel` logujący tokeny, stop bez tool calli; zerwać sieć w trakcie i zobaczyć brak recovery. Kod w osobnym repo, tu notatka-wskaźnik. |
| 7 | Cache prefiksu działa tylko przy stałym prefiksie | Zrobić | W tym samym skrypcie wypisać `cache_read_input_tokens` dla dwóch uruchomień, potem zmienić jedno słowo w system prompcie i porównać. |
| 8 | Pamięć: historia zmian i sprzeczności | Zrobić | Przy zastępowaniu Standing choice dopisywać do `log.md` starą i nową treść (dziś stara linia znika). Dodać zdanie do sekcji Standing choices. |
| 9 | Eval promptów i skilli | Zrobić | Test triggerów `lesson-notes` (już na tablicy) rozszerzyć o 3–5 przypadków zapisanych w pliku i powtarzanych po każdej zmianie opisu skilla. |
| 10 | Duże wyniki do pliku, w kontekście referencja | Mamy | Logi Challenge'y i surowe lekcje w plikach (`work/<id>/log.md`, `lessons/`), sesja czyta fragmenty. |

## Powiązane

- Poprzednie lekcje: [s01e01](s01e01-mechanics-behind-generative-ai.md) (tokeny, kontekst, compaction), [s01e02](s01e02-steering-models-through-context.md) (co widzi agent, skille, subagenci), [s01e03](s01e03-building-knowledge-systems.md) (baza wiedzy = pamięć), [s01e04](s01e04-working-with-ai-harnesses.md) (harnessy, Pi), [s01e05](s01e05-building-workflows-not-tool-stacks.md) (code mode, bezpieczeństwo).
- Temat: [Pi i Herdr](../topics/pi-and-herdr.md).
- Setup: [agent-setup](../../context/agent-setup.md).
- Challenge tej lekcji: „found out late” — https://hq.mega.dev/challenges/found-out-late (jeszcze bez logu).
