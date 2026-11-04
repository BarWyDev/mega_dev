---
title: "s02e03 — Agentic Capabilities"
type: lesson
source: lessons/s02e03-agentic-capabilities.md (https://hq.mega.dev/lessons/s02e03/)
updated: 2026-11-04
trust: high
status: active
tags: [agents-md, personalization, generalization, mcp, skills, tool-design, hooks]
links: [../../lessons/s02e03-agentic-capabilities.md, s02e02-building-an-agent.md, s02e01-agentic-primitives.md, s01e05-building-workflows-not-tool-stacks.md, s01e02-steering-models-through-context.md, ../../context/agent-setup.md, ../../work/board.md]
---

Personalizacja harnessu (AGENTS.md, skille, narzędzia, MCP) ma **zwiększać
szansę**, że agent zrobi to, czego chcemy, ale go nie ograniczać: zasady
zamiast procedur, z podanym powodem, plus deterministyczne hooki, które
wspierają, a nie blokują. MCP to standard host–client–server dający agentowi
nowe możliwości; własny serwer warto zbudować „dla zabawy”, żeby poczuć jego
mocne i słabe strony. Skille łączy się z narzędziami (także przez MCP), żeby
sterować delikatnie. Konfigurację trzeba okresowo przeglądać — również po to,
żeby **usuwać** to, czego modele już nie potrzebują.

Surowy tekst: [lessons/s02e03-agentic-capabilities.md](../../lessons/s02e03-agentic-capabilities.md).

## Personalizacja

- Przykład z agents.md: „Always run `pnpm lint` and `pnpm test` before
  committing”. Reguła w AGENTS.md nie gwarantuje wykonania (agent się
  rozprasza); hook (Husky) wymusza, ale pełny lint/test trwa i ktoś (agent lub
  człowiek) go w końcu wyłączy.
- Modele same umieją dobrać weryfikację do zmiany, więc pełny lint/test przed
  każdym commitem bywa szkodliwy. Lepiej uogólniona instrukcja: **„Verify your
  changes in proportion to their impact. Report what you ran.”** + hooki
  dobrane wspólnie z agentem, które wspierają proces.
- Pętla przeglądu: modele i harness się poprawiają → okresowy przegląd →
  **improve** (nowe możliwości) albo **remove** (ustawienia już zbędne) →
  aktualizacja konfiguracji → kolejny przegląd wg harmonogramu.
- **Core instructions** agenta są rozszerzane (profile użytkownika, zasoby,
  skille), ale nie powinny być nadpisywane. Technicznie nie da się „nadpisać”
  instrukcji — Model Spec mówi, że system prompt waży więcej, ale model nie
  zawsze tego przestrzega.
- Dobre instrukcje:
  - **Zasady zamiast procedur** — model sam je zastosuje.
  - **Powód za zasadą** — agent lepiej się dostosuje albo świadomie ją pominie,
    gdy to da lepszy wynik [rule-with-reason].
  - **Dynamiczne granice** — np. potwierdzanie akcji: inaczej w aplikacji
    mobilnej, inaczej przy wyzwoleniu z harmonogramu (ambient, S02E02);
    sterowane wstrzykiwaną informacją o bieżącym kliencie.
  - **Domyślne zachowanie** — żeby model zachował się inaczej niż zwykle, sam
    system prompt nie wystarczy; instrukcję trzeba powtarzać w trakcie przez **hooki**.
  - **Preferencje** — model ich nie zna; przekazywać bez nadmiernego sterowania.
  - **Rozszerzalność** — jak zachowają się nasze reguły, gdy skille dodadzą nowe zachowania?
- Uogólnienie dotyczy też **augmentowania narzędzi**, nie tylko instrukcji.

## Model Context Protocol

- Standard łączenia agenta/harnessu z aplikacjami, usługami i urządzeniami.
  Trzy pojęcia: **Host** (Claude, Codex, nasza aplikacja), **Client** (w hoście,
  jedno połączenie z dokładnie jednym serwerem), **Server** (lokalny lub zdalny
  proces wystawiający narzędzia i zasoby).
- Minimalny serwer: **nazwa** + **narzędzia (schemat i callback)**. Harness
  często pokazuje modelowi tylko nazwę i opis. Przykład: math-server z narzędziem
  `add` na Streamable HTTP pod `http://127.0.0.1:3000/mcp`; nowy `McpServer` na
  każde żądanie.
- Mechanika jak przy natywnych narzędziach — różnica: schemat przychodzi z
  serwera, a harness prosi serwer o wykonanie callbacku.
- Klient obsługuje dwa transporty: **Streamable HTTP** (zdalne) i **STDIO**
  (lokalne procesy); reszta kodu identyczna.
- Kiedyś MCP uchodził za gorszy od CLI (dla jednego użytkownika), bo harnessy
  ładowały wszystkie narzędzia z góry — **50–90 narzędzi** z jednego serwera
  zapychało kontekst. Dziś code mode pozwala załadować nawet **2500 narzędzi**.
- MCP to też autoryzacja, **resources**, **prompts** i **sampling** (serwer prosi
  host o wywołanie LLM) — wsparcie zależy od klienta.
- Kierunki rozwoju: stateless MCP servers, skills over MCP, Events (draft).
- Start: SDK + agent generuje serwer; szablon autora: streamable-mcp-server-template.
  Hosting: VPS albo Cloudflare.
- Przy projektowaniu (oprócz zasad z S02E02):
  - **Unikalna nazwa serwera** — narzędzia widać jako `server_name__tool_name`
    (np. `spotify__play`) albo `integrations.spotify.play()`.
  - **Server instructions** — większość harnessów je ignoruje lub przycina,
    ale warto mieć krótkie.
  - MCP do dzielenia integracji i wiedzy między agentami wewnętrznie.
  - **Evale** w popularnych harnessach — jak zmiany kształtu narzędzi wpływają
    na zachowanie; automatyzować.
  - MCP jako **warstwa możliwości**, która podróżuje z użytkownikiem między
    harnessami (prymitywy: pamięć, integracje, logika deterministyczna).
  - Wiele serwerów → **global context / mapa**, żeby agenci znali wszystkie.

## Projektowanie własnego MCP

- Agent zbuduje i wdroży serwer z samej dokumentacji usługi; naszą rolą jest
  ułatwić (szablon), uczynić to niezawodnym i dopasować do nas (wiele serwerów,
  kształt, skille augmentujące).
- Zacząć od serwera **dla zabawy**, który wejdzie w codzienne życie — np.
  **Spotify**: personalizacja (pamięć łączy gust z czasem, miejscem, ludźmi),
  zaawansowane wyszukiwanie (opisy, soundtracki), automatyzacja (urządzenia,
  kalendarz, lokalizacja).
- Czego uczy taki projekt:
  - **Connectivity** — awarie są częste; serwer informuje agenta o błędzie.
  - **API issues** — API zawodzi **bez sygnału błędu**: Spotify czasem zwraca
    losowe wyniki wyszukiwania; odtwarzanie blokuje się przy głośniku (Sonos).
  - **Transkrypcja** — sterowanie głosem w różnych warunkach, błędy intencji.
  - **Nieoczywiste przypadki** — zmiana muzyki przy trybie „nie przeszkadzać”,
    przypomnienie utworu po miejscu i czasie.
  - **Niespodzianki** — rosnąca pamięć + urządzenia + strumień zdarzeń dają
    playlisty, na które sami byśmy nie wpadli.
- Nie mapować 100% API. Najtrudniejsze: **filtrowanie, paginacja** i wyniki
  wymagające dociągania szczegółów. Przykład: trzy endpointy Spotify
  (`/v1/search`, `/v1/me/tracks/contains`, `/v1/me/player/devices`) → jedno
  `search({ query, limit })` zwracające utwory z flagą `saved`, aktywne
  urządzenie, kursor i **podpowiedzi** (`play({ uri })`, kolejna strona,
  ogólne `api({ method, path, body })`).
- Proces:
  1. **Typ** — dla procesów lokalnych lepsze CLI niż MCP.
  2. **Zakres** — przypadki użycia wygenerowane przez AI jako HTML/MDX, wybór początkowego kształtu.
  3. **Pierwsza wersja** — jak najchudsza; resztę AI dopisze wg wzorca.
  4. **Harness** — rozważyć przeniesienie części agentów do chmury.
  5. **Iteracje** — global context / mapa serwerów do zarządzania i oceny zmian.
  6. **Deployment** — najprościej Cloudflare Workers albo VPS na subdomenie;
     agent musi wiedzieć, jak dostać się do instancji, czytać logi, monitorować.

## Skille i narzędzia

- Unikać skilli mówiących **dokładnie, co robić** — wyjątek: **procedury**
  specyficzne dla naszego przypadku.
- **Skills extension** dla MCP: serwer wystawia narzędzia i skille, harness
  pokazuje ich nazwy i opisy, agent ładuje skill, gdy potrzebuje.
- Przykład: narzędzie generowania obrazów (Replicate) + skille stylów (concept
  art, pixel art, realistic photo, cartoon). **Opis narzędzia wspomina skille, a
  każdy skill nazywa narzędzie** [tool-skill-links] — ale można użyć każdego osobno.
- **Router skills**: skill-router łączy skille z grup (Image / Video / Audio)
  w workflow, np. „pixel art trailer with a retro soundtrack” → Pixel art →
  Animation → Retro; agent może router pominąć.
- Wniosek: rdzeń agenta czysty i elastyczny, specjalizacja przez narzędzia MCP i skille.

## Wnioski

- Uogólnienie to kluczowa umiejętność — w promptach, narzędziach, skillach,
  serwerach MCP i CLI.
- Dobry agent żyje w sandboxie z dostępem do systemu plików i wykonywania kodu
  — to otwiera zaawansowane zarządzanie kontekstem (historia sesji, wyniki
  narzędzi, artefakty). Czasem wystarczy dostęp tylko do odczytu.
- Najważniejsze zadanie: **zbudować własny serwer MCP**, choćby dla zabawy.

## Na co uważać

1. Procedura w CLAUDE.md („zawsze uruchom X”) bywa pomijana albo marnuje czas.
   → Zasada z powodem w instrukcji + hook, który wspiera (szybki, skupiony), a nie blokuje.
2. Ciężki hook zostaje w końcu wyłączony i nikt tego nie zauważa.
   → Hook ma być szybki; okresowy przegląd sprawdza, czy działa i czy jest potrzebny.
3. Konfiguracja tylko rośnie; stare reguły przeszkadzają nowszym modelom.
   → W przeglądzie szukać też rzeczy **do usunięcia**, nie tylko do dodania.
4. Reguła bez powodu jest stosowana ślepo albo łamana bez sensu.
   → Do każdej reguły dopisać „bo…”.
5. Serwer MCP, który mapuje całe API, zapycha kontekst i myli agenta.
   → Wybrać kilka narzędzi pod przypadki użycia; łączyć wywołania i dawać podpowiedzi następnego kroku.
6. API zawodzi bez błędu (losowe wyniki, 200 przy porażce).
   → Serwer sprawdza wynik i mówi agentowi prawdę o błędzie.
7. Kolizja nazw serwerów/narzędzi albo te same skille podane dwa razy.
   → Unikalna nazwa serwera; usuwać duplikaty skilli.
8. Server instructions są często ignorowane.
   → Kluczowe informacje w opisach narzędzi, nie tylko w instructions.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Zasada + hook wspierający zamiast procedury | Mamy | `CLAUDE.md` (Routines) mówi tylko „napraw, co zgłosi check”, a hook `PostToolUse` w `.claude/settings.json` uruchamia `tools/check.ts` (szybki, zwraca konkretny błąd). |
| 2 | Powód za zasadą | Zrobić | Sekcja „Rules” w `CLAUDE.md` podaje reguły bez „bo…” (np. „The human writes only to `inbox/`”, „Never delete”). Dopisać jedno zdanie powodu do każdej. |
| 3 | Domyślne zachowanie powtarzane przez hooki | Mamy | `SessionStart` → `tools/state.ts` wstrzykuje stan bazy na start sesji. |
| 4 | Okresowy przegląd: improve **i remove** | Zrobić | Punkt „Weekly health check” na [tablicy](../../work/board.md) rozszerzyć o pytanie „co usunąć”: reguły, hooki, skille i pluginy, których agent już nie potrzebuje. |
| 5 | Duplikaty w kontekście (nazwy, skille) | Zrobić | Skille Cloudflare widać dwa razy (`~/.claude/skills/` i plugin `cloudflare:`) — punkt już na tablicy (s01e01, item 5), wymaga zgody. |
| 6 | Procedura jako skill to dozwolony wyjątek | Mamy | `.claude/skills/lesson-notes/SKILL.md` to procedura specyficzna dla tej bazy. |
| 7 | Własny serwer MCP (dla zabawy) | Zrobić | Zbudować mały serwer z szablonu streamable-mcp-server-template, 1–3 narzędzia, podłączyć przez `claude mcp add`. Kandydat: serwer nad tą bazą (`search_notes`, `board_state`) albo nad mail agentem z S02E02 (Cloudflare Worker już jest). Kod w osobnym repo, notatka-wskaźnik tutaj. |
| 8 | Global context / mapa | Zrobić | Globalny `~/.claude/CLAUDE.md` — już na tablicy; dopisać do niego listę własnych serwerów MCP, gdy powstaną. |

## Powiązane

- Poprzednia lekcja: [s02e02](s02e02-building-an-agent.md) (projektowanie narzędzi, fałszywe sukcesy, kontekst w trakcie tury).
- Wcześniej: [s02e01](s02e01-agentic-primitives.md) (pętla, narzędzia), [s01e05](s01e05-building-workflows-not-tool-stacks.md) (code mode), [s01e02](s01e02-steering-models-through-context.md) (skille, sterowanie kontekstem).
- Setup: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
- Challenge tej lekcji: „schema first” — https://hq.mega.dev/challenges/schema-first (nie rozpoczęty).
