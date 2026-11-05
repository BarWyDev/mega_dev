---
title: "s01e01 — Mechanics Behind Generative AI"
type: lesson
source: lessons/s01e01-mechanics-behind-generative-ai.md (https://hq.mega.dev/lessons/s01e01/)
updated: 2026-10-31
trust: high
status: active
tags: [llm, tokens, context, compaction, harness, tools, steering]
links: [../../lessons/s01e01-mechanics-behind-generative-ai.md, ../../context/agent-setup.md, ../../work/board.md, ../../work/s01e01/log.md, ../topics/session-handoffs.md, s01e03-building-knowledge-systems.md]
---

LLM przewiduje jeden token naraz na podstawie tego, co ma w kontekście, i nie
może cofnąć raz wybranego tokenu. Z tego wynika cała reszta: wyniki różnią się
między uruchomieniami, brak kontekstu daje pewne siebie błędne odpowiedzi, długie
wątki są kompaktowane i gubią fakty, a harness po cichu decyduje, co model
naprawdę widzi. Praca z agentami to zwiększanie szans na dobry wynik, nie pewność.

Surowy tekst: [lessons/s01e01](../../lessons/s01e01-mechanics-behind-generative-ai.md).
Przykłady do uruchomienia: https://github.com/MEGA-DOT-DEV/examples (nazwy w nawiasach kwadratowych poniżej).

## 1. Podstawowe cechy każdego LLM

- **Tokenizacja.** Tekst (oraz obrazy i audio) zamieniany jest na numeryczne ID i z powrotem. Emoji i tekst w innym języku niż angielski kosztują więcej tokenów. [tokenization-round-trip]
- **Przewidywanie następnego tokenu.** Model dokleja token po tokenie aż do tokenu końca. Złego wczesnego tokenu nie da się cofnąć, a jego skutek kumuluje się w dalszej części odpowiedzi. [next-token-probabilities]
- **Niedeterminizm.** Ten sam prompt i te same ustawienia dają różne wyniki; znaczenie ma nawet sprzęt. `temperature: 0` nie gwarantuje powtarzalności. Nigdy nie ma pełnej pewności co do wyniku. [same-prompt-many-runs]
- **Konfabulacja.** Dane treningowe są skończone i mają datę graniczną wiedzy (knowledge cutoff). Dziś czyste halucynacje są rzadkie; większość błędów bierze się z *brakującego lub złego kontekstu* („Tell me about Alice” bez kontekstu daje Alicję z Krainy Czarów). [confabulation-probe]
- **Rozumowanie.** Modele „myślą” jawnie (tokeny rozumowania) i po cichu w jednym przebiegu (praca Anthropic o J-space). Więcej wysiłku zwykle pomaga, ale kosztuje czas i pieniądze; właściwy poziom zależy od modelu i zadania. Szukaj najniższego poziomu, który wciąż poprawnie rozwiązuje sprawdzalne zadanie. [reasoning-effort]
- **Kolejność przesłanek ma znaczenie.** Mniejsze modele mylą się, gdy te same fakty przyjdą w innej kolejności. [premise-order]

## 2. Mechanika zapytania

- **Zapytanie = kontekst + ustawienia.** Kontekst to lista wiadomości; ustawienia to model, poziom rozumowania, narzędzia i pola platformy. Popularny format to Responses API; `output` jest listą, `usage` pokazuje zużycie tokenów. [responses-request]
- **Completion i ChatML.** Czat to format tekstowy ze specjalnymi tokenami wokół każdej roli. Dla modelu wiadomości to po prostu tekst. Użytkownik wpisujący `<|im_end|>` dostaje zwykłe tokeny, więc nie zamknie sam swojej tury. [chat-template]
- **Okno kontekstu.** Ok. 250k–1M tokenów. Harnessy robią auto-kompakcję, więc długie wątki są **stratne**: fakty są kompresowane, przycinane albo „wyciągane” do podsumowania. Kilkukrotna kompakcja po cichu gubi ograniczenia typu „Never log secrets”. [context-compaction]
- **Rozumienie kontekstu.** Pomieścić 1M tokenów to nie znaczy dobrze go wykorzystać. Zasada praktyczna: modele rozumują najlepiej poniżej **30–40% okna**. Proste wyszukiwanie w długim tekście wciąż działa dobrze; rozumowanie na nim słabnie (wykres z lekcji: model najlepszy w recall był ostatni w rozumowaniu na długim kontekście). [context-window-budget]
- **Multimodalność.** Obrazy i audio są tokenizowane inaczej; model widzi liczby, nie obrazy. Ma problem z nakładającymi się elementami, dokładnymi kolorami, godziną na zegarze. [image-detail-probe]
- **Structured outputs.** JSON zgodny ze schematem pozwala wyciągać dane i wpinać LLM w logikę aplikacji. **Schemat kontroluje kształt, nie prawdziwość**: nieistniejące miasto przechodzi walidację. [structured-output]
- **Function calling.** Model zwraca JSON z nazwą narzędzia; Twój kod je uruchamia i oddaje wynik modelowi. Wszystkie schematy narzędzi siedzą w kontekście. [function-calling]
- **Code mode.** Model dostaje tylko `find` i `execute` i pisze kod korzystający z dostępnych możliwości. W przebiegu z lekcji ok. 2300 z 3000 tokenów wejścia to były schematy narzędzi przy function calling. Taniej przy pracy wieloetapowej, może być drożej przy zadaniu na jedno wywołanie, a na produkcji wymaga sandboxa. [code-mode]
- **Agent.** Pętla: model albo wywołuje narzędzie i pracuje dalej, albo odpowiada tekstem, co kończy pętlę. Trwałość i długie zadania to tydzień 2. [agent-loop]
- **CLI / MCP.** Oba po prostu udostępniają narzędzia używane przez function calling albo code mode. CLI najlepiej lokalnie; MCP to standard dla produkcji i pracy zdalnej (np. Playwright MCP). [mcp-tool-bridge]

## 3. Co ukrywają harnessy

Cursor, Claude Code, Pi, T3 Code działają na tych samych modelach; różnica to
„opakowanie”. Żeby było prosto dla wszystkich, uogólniają, a to ukrywa mechanikę:

- **Auto-kompakcja:** wątek, który widzisz, to nie kontekst, który dostaje model. Stare wiadomości stają się podsumowaniem, wyniki narzędzi i załączniki wypadają. „Agent wie, o czym mówimy” często nie jest prawdą.
- **Plan mode:** pomaga, dopóki plan nie jest zbyt szeroki albo zbyt szczegółowy; wtedy części giną w kompakcji lub umykają w długim kontekście, a kolejność się sypie. Lepiej dzielić na małe zadania.
- **Skille:** wybierane wyłącznie po **nazwie i opisie**. Raz załadowany skill zostaje w kontekście do kompakcji albo nowego wątku. W teście z lekcji część zapytań wybrała zbędny skill albo pominęła potrzebny. [skill-selection]
- **Załączniki i repozytoria:** plik widoczny w UI nie jest w kontekście modelu, dopóki agent go nie przeczyta, czasem tylko częściowo. To samo dotyczy kodu i bazy wiedzy.
- **Środowisko:** Twoja wiadomość to nie jedyne, co jest wysyłane. Harness dodaje system prompt, definicje narzędzi i bloki `<system-reminder>` (data, e-mail, stan gita, effort). Instrukcje są stałe ze względu na cache, więc zmiany przychodzą jako przypomnienia. [request-inspector]

## 4. Dostawcy i modele

- OpenAI (GPT, pełna multimodalność, Responses API), Anthropic (Claude, tekst + obrazy, Claude Code), xAI (Grok, Grok Bot), Google DeepMind (pełna multimodalność z wideo, Interactions API), OpenRouter (jeden dostęp do wielu modeli).
- Najlepszy model często się zmienia (Artificial Analysis). Unikaj vendor lock-in: domyślnie najlepszy model, a mniejszy model lub niższy effort tylko do zadań automatyzowanych albo robionych na skalę. Kilka modeli na jednym zadaniu może podnieść jakość.
- Kurs skłania się ku narzędziom niezależnym od harnessu: Pi, OpenCode, T3 Code, Superset.

## 5. Uogólnione sterowanie

Nie precyzyjne instrukcje, tylko popychanie modelu w stronę pewnych zachowań:

- **Różne perspektywy:** kilka pytań, kilka modeli na jedno pytanie albo subagenci w osobnych wątkach. Jeden subagent na umowę: 79–80/80 pól; jeden agent z 16 umowami: 75–79. [ask-models, subagents-as-tools]
- **Self-querying:** niech model przed zadaniem zada sobie (albo Tobie) pytania pomocnicze, żeby wciągnąć potrzebną wiedzę do „pamięci roboczej”. [self-querying]
- **Pamięć:** każdy wątek zaczyna się od zera; agent potrzebuje *sposobu na sprawdzenie informacji* (baza wiedzy, wyszukiwanie), a nie tylko dobrego promptu.
- **Samozarządzanie:** agenci zmieniający własne ustawienia (Pi, OpenCode 2). Pomyśl, jak agenci mogą działać w Twoim imieniu przy minimalnym udziale z Twojej strony.
- **Agenci w tle (ambient, durable):** zdalni agenci uruchamiani harmonogramem i zdarzeniami, w sandboxach, z własnymi kontami, z ograniczonym kontaktem z człowiekiem.

## Na co uważać

1. **Wątek to nie kontekst.** Po kompakcji reguły podane wcześnie na czacie mogą zniknąć. Wszystko, co ma obowiązywać przez całe zadanie, trzymaj w pliku, który agent czyta ponownie (CLAUDE.md, plik planu, tablica), nie tylko w wiadomości.
2. **Pewność ≠ poprawność.** Niedeterminizm plus konfabulacja: weryfikuj czymś mechanicznym (testy, skrypt, drugie uruchomienie), zwłaszcza gdy odpowiedź idzie do claimu albo działania na zewnątrz.
3. **Poprawny JSON może być fałszywy.** Walidacja schematu sprawdza tylko kształt. Wartości porównuj ze źródłem.
4. **„Załączyłem” ≠ „przeczytał”.** Poproś agenta o przeczytanie konkretnego pliku albo sprawdź, czy to zrobił.
5. **Długie sesje słabną.** Po przekroczeniu mniej więcej jednej trzeciej okna zacznij nową sesję z przekazaniem kontekstu.
6. **Opis skilla to wyzwalacz.** Niejasny albo nakładający się opis oznacza, że skill zostanie pominięty albo odpali się nie wtedy, kiedy trzeba.
7. **Duże plany zawodzą po cichu.** Środkowe punkty i ich kolejność giną. Dziel pracę na małe, sprawdzalne zadania.
8. **Szczegóły obrazów kłamią.** Nie ufaj dokładnym odczytom (kolory, zegary, drobny tekst) ze zrzutów ekranu bez drugiego sprawdzenia.
9. **Kolejność faktów ma znaczenie.** Kluczowe ograniczenie daj na początku i powtórz pod koniec długiego promptu.

## Do zastosowania w tym setupie

Odniesione do [agent-setup](../../context/agent-setup.md) i [tablicy](../../work/board.md).
„Mamy” = już jest; „Zrobić” = warto dodać.

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Stratna kompakcja | Mamy | Reguły są w `CLAUDE.md` i w Standing choices na tablicy, nie na czacie. Tak zostawić. |
| 2 | Brak kontekstu powoduje konfabulację | Zrobić | Napisać globalny `~/.claude/CLAUDE.md` (już w Planned na tablicy). |
| 3 | Budżet kontekstu 30–40% | Zrobić | Nowa sesja na każdy krok Challenge'a albo temat; [przekazania z oznaczonymi źródłami](../topics/session-handoffs.md). |
| 4 | Harness dodaje ukryty kontekst | Zrobić | Raz uruchomić `request-inspector` na Claude Code i zapisać, co wysyła (rozmiar system promptu, narzędzia, przypomnienia). |
| 5 | Skille wybierane po opisie; schematy narzędzi kosztują tokeny | Zrobić | Ta sesja widzi każdy skill Cloudflare **dwa razy** (`~/.claude/skills/wrangler` i plugin `cloudflare:wrangler`, tak samo ok. dziesięć innych). Usunąć jedną kopię; wyłączyć pluginy nieużywane w kursie. Mniej, ostrzejszych opisów = lepszy wybór i mniej tokenów. |
| 6 | Niedeterminizm | Mamy | Hook `tools/check.ts` weryfikuje każdą edycję notatki. Przenieść ten nawyk na Challenge: sprawdzać wyniki skryptem, nie na oko. |
| 7 | Plan mode psuje się przy dużych planach | Mamy | S01E04 podzielił plan na issues. Ten sam kształt dla każdego zadania powyżej ok. 5 kroków. |
| 8 | Różne perspektywy / subagenci | Zrobić | Jeden subagent na źródło, gdy zadanie ma kilka wejść (otwarta luka z S01E02 i portów z limen). |
| 9 | Self-querying | Zrobić | Przy nowym Challenge'u najpierw poprosić agenta o listę niewiadomych i pytań, potem działanie. |
| 10 | Reasoning effort | Zrobić | Pokrywa to eksperyment z effortem na tablicy; uruchomić go. |
| 11 | CLI vs MCP | Mamy | Lokalnie używane są CLI (`gh`, `wrangler`, `curl`); Claude Code odracza schematy narzędzi MCP, dopóki nie zostaną wyszukane. |
| 12 | Agenci w tle | Zrobić | Cotygodniowy health check jako zadanie cykliczne (Planned). |

## Powiązane

- Challenge do tej lekcji: [somebody slow](../../work/s01e01/log.md) — wiadomość skompaktowana dla wolnego czytelnika, czyli punkt o kompakcji w praktyce.
- Kolejne lekcje budują na tej: s01e02 (sterowanie przez kontekst), [s01e03](s01e03-building-knowledge-systems.md) (bazy wiedzy = punkt o pamięci powyżej).
