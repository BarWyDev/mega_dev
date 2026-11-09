---
title: Własna pętla agenta — 8 kroków i porównanie z Pi
type: pointer
source: session 2026-11-06..08; private repo https://github.com/BarWyDev/agent-loop (local ~/dev/personal/agent-loop); Pi packages/agent/src/agent-loop.ts at commit 04a93bad8f (https://github.com/earendil-works/pi)
updated: 2026-11-09
trust: high
status: active
tags: [agent-loop, harness, hooks, retry, prompt-cache, pi, guardrails, subscriptions]
links: [../lessons/s03e01-mechanics-behind-product-engineering.md, ../lessons/s02e01-agentic-primitives.md, ../lessons/s02e05-agent-reliability.md, ../lessons/s02e02-building-an-agent.md, pi-and-herdr.md, ../../work/board.md]
---

Naiwna pętla agenta w TS z oficjalnym SDK Anthropic, budowana krok po kroku,
żeby zobaczyć mechanikę harnessu (s02e01, punkty 6–7). Kod: prywatne repo
https://github.com/BarWyDev/agent-loop (lokalnie `~/dev/personal/agent-loop`),
jeden plik na krok, `npm run stepN`.
Na koniec porównanie z pętlą Pi: co nasza ma, czego nie ma.

## Kroki i co pokazały

| Krok | Plik | Co pokazał (liczby z uruchomień) |
| --- | --- | --- |
| 1 | `step1.ts` | Jedno wywołanie bez narzędzi: `end_turn`, bloki `thinking` (pusty) + `text`, 58 tokenów wejścia. Model mówi, że nie ma dostępu do dysku. |
| 2 | `step2.ts` | Narzędzie `bash_20250124`: wejście 58 → 679 (opis narzędzia). Obrót 1 kończy się `tool_use`; my wykonujemy, dopisujemy `assistant` + `tool_result`. Obrót 2 znowu `tool_use`, więc dwa sztywne obroty nie wystarczą. |
| 3 | `step3.ts`, `bash.ts` | Pętla `for` do `MAX_TURNS`: 8 obrotów, wejście 1320 → 3233. Model obszedł blokadę „pierwsze słowo” przez `find -exec sh -c` i sam się przyznał. |
| 4 | `step4.ts`, `safe-bash.ts`, `safe-bash.test.ts` | Hooki `beforeModel` / `afterModel` / `beforeTool` / `afterTool`, ślad w `trace.jsonl` (request + odpowiedź na obrót, 80 KB po 8 obrotach). Blokada bez powłoki (`execFileSync`, znaki powłoki, flagi `find`), 13 testów. Za ciasna: agent nie wykonał zadania, 0,17 USD. Bez powłoki model zgadywał `/root` jako katalog domowy. |
| 5 | `step5.ts` | Sieć psuta podmienionym `fetch`. `naive`: pierwszy błąd kończy program. `resume`: `state.json` po każdym pełnym obrocie, nowy proces kontynuuje bez powtarzania obrotu 1. `retry`: tylko błędy przejściowe (sieć, 429, 5xx), backoff 1/2/4 s. SDK domyślnie ma `maxRetries: 2`. |
| 6 | `step6.ts` | Cache prefiksu: drugi taki sam request czyta 573 tokeny z cache (0,00065 vs 0,0034 USD); zmiana jednego słowa w system prompcie = nowy zapis; stary wpis dalej żyje. W pętli z automatycznym `cache_control` cała poprzednia historia przychodzi z cache. Zdanie „Katalog domowy to /Users/barwy” usunęło zgadywanie `/root`. |
| 7 | (ta notatka) | Porównanie z Pi poniżej. |
| 8 | `step8.ts`, `subscriptions.ts`, `subscriptions.test.ts` | Prymityw Subscriptions z s03e01: zegar i POST na `127.0.0.1:8787/event` idą jednym `route()` (dozwolone źródła → dedupe z `journal.jsonl` → filtr `match` → routing). Agent ma narzędzia `subscribe` i `reschedule` (termin + powód); przegląd tygodniowy to zwykła subskrypcja. Tylko dry run (bez modelu): duplikat po restarcie odpada, zaległy termin budzi raz, plik czytany przed każdą decyzją (bez tego subskrypcja dopisana w trakcie była ignorowana). 20 testów; łapią 3 celowo wprowadzone błędy. Commit `5aeb853` 2026-11-09. |

## Nasza pętla a pętla Pi

Pi rozdziela role: `agent-loop.ts` to sama pętla z punktami wpięcia, `agent.ts`
trzyma stan i kolejki, ponawianie zapytań jest w warstwie dostawcy (`pi-ai`,
`maxRetryDelayMs`), a trwałość i compaction w osobnym pakiecie `packages/durable`.

| Rzecz | Nasza | Pi |
| --- | --- | --- |
| Warunek stopu | `stop_reason !== "tool_use"` | Brak tool calli **i** brak wiadomości w kolejkach; hook `finishTurn` może zakończyć albo wymusić obrót. |
| Błąd modelu | `naive` pada; `retry`/`resume` w step5 | `stopReason: "error"` kończy pętlę czysto (`agent_end`); `agentLoopContinue` wznawia z kontekstu, pod warunkiem że ostatnia wiadomość nie jest `assistant` (ten sam niezmiennik co nasz `state.json`). |
| Hooki | 4, wywoływane ręcznie | `beforeToolCall` (może zablokować i zakończyć), `afterToolCall` (może podmienić wynik), `transformContext` (przed każdym requestem), `prepareRequest` / `prepareNextTurn` (zmiana modelu, poziomu myślenia, kontekstu, np. compaction), `finishTurn`. |
| Zdarzenia | `console.log` | Strumień zdarzeń: `agent_start`, `turn_start`, `message_update` (streaming tokenów), `tool_execution_start/update/end`, `agent_end`. UI i logi to subskrybenci. |
| Streaming | brak, czekamy na całą odpowiedź | tak, częściowa wiadomość aktualizowana na bieżąco. |
| Wiadomości w trakcie pracy | brak | Kolejka **steering** (użytkownik pisze, gdy agent pracuje) i **follow-up** (po tym, jak agent by skończył). |
| Przerwanie | Ctrl+C zabija proces | `AbortSignal` sprawdzany przed i w trakcie narzędzi; wynik „Operation aborted”. |
| Narzędzia równolegle | po kolei | domyślnie równolegle, wyniki w kolejności wywołań; narzędzie może wymusić tryb sekwencyjny. |
| Walidacja argumentów | brak (`as { command: string }`) | schemat sprawdzany przed wykonaniem; nieznane narzędzie i błąd walidacji wracają jako `isError`. |
| Ucięta odpowiedź | brak | przy `stopReason: "length"` wszystkie tool calle dostają błąd zamiast wykonania, bo argumenty mogą być ucięte. |
| Zmiana narzędzi w trakcie | brak | `declareToolChanges` dopisuje `toolsAdded/toolsRemoved` jako wiadomość systemową, zamiast zmieniać prefiks. |
| Klucz API | raz, z `.env` | `getApiKey` przed każdym requestem (wygasające tokeny). |
| Stan na dysku | `state.json`, `trace.jsonl` | poza pętlą (`packages/durable`). |
| Limit obrotów | `MAX_TURNS = 10` | brak w pętli; decyduje `finishTurn` albo abort. |

## Wnioski

- Rdzeń jest ten sam: wyślij historię, dopisz odpowiedź, wykonaj tool calle,
  dopisz wyniki, powtórz. Pi nie ma „magii”, tylko dużo punktów wpięcia i
  obsługę przypadków brzegowych.
- Największe różnice to rzeczy, których naiwna pętla nie widzi, dopóki nie
  pracuje z człowiekiem na żywo: streaming, przerwanie, wiadomości w trakcie.
- Odporność na błędy siedzi poza pętlą (dostawca, `durable`), a pętla tylko
  kończy się czysto i daje się wznowić. Nasz step5 robił to w jednym pliku.
- Blokada na poziomie tekstu polecenia jest albo dziurawa (krok 3), albo za
  ciasna (krok 4). Lepsze: dedykowane narzędzia, zgoda człowieka, sandbox
  (Seatbelt na macOS).

## Co dalej

- Kandydat do dokończenia: walidacja argumentów i obsługa `max_tokens` przed
  wykonaniem narzędzi (dwie rzeczy z tabeli, które łatwo dodać).
- Krok dodatkowy (zaproponowany, nie zrobiony): bash w `sandbox-exec` z plikiem
  reguł zamiast listy zakazów.
- Krok 8 z prawdziwym modelem: jedno przebudzenie przeglądu i jeden mail-zdarzenie, potem sprawdzić, czy agent sam ustawił `reschedule` z powodem.
- Krok 8 dalej: terminy kalendarzowe (dni robocze o 9:00), podpis HMAC na `/event`, ten sam `route` w Workerze mail-agenta.
