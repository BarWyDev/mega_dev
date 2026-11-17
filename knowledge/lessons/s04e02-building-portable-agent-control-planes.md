---
title: "s04e02 — Building Portable Agent Control Planes"
type: lesson
source: lessons/s04e02-building-portable-agent-control-planes.md (https://hq.mega.dev/lessons/s04e02/) and lessons/s04e02-build-guide.md (https://hq.mega.dev/lessons/s04e02/build-guide/)
updated: 2026-11-17
trust: high
status: active
tags: [control-plane, configuration, portability, knowledge-delivery, operations, claims, widgets, issues, hill-climbing, gatherers, mcp]
links: [../../lessons/s04e02-building-portable-agent-control-planes.md, ../../lessons/s04e02-build-guide.md, s04e01-mechanics-behind-autonomous-systems.md, s03e04-verifying-product-outcomes.md, s03e02-translating-intent-into-agent-work.md, s02e05-agent-reliability.md, s02e04-multi-agent-collaboration.md, s02e03-agentic-capabilities.md, s01e02-steering-models-through-context.md, ../topics/barwy-tools.md, ../topics/pi-and-herdr.md, ../../context/agent-setup.md, ../../work/board.md]
---

**Control plane to warstwa, która decyduje, *jak* agenci pracują, trzymana osobno
od samych runów — czyli oddzielenie tego, co definiuje agenta, od miejsca, w
którym działa.** Rzeczy zmieniają się szybko (autor przeszedł z Claude na Pi, a
potem na Grok Bota zarządzającego Pi), więc setup ma być niezależny od narzędzia,
a części wspólne agentów trzeba wydzielić wcześnie. Bez observability i evali nie
wiadomo, jak zmiana wspólnej części wpłynie na każdego agenta. Build guide (część
druga, John Lindquist) pokazuje to w małej skali: widgety obok rozmowy głównej i
zbieranie kontekstu, zanim issue trafi do Main.

Dashboard nazywa lekcję „Software Factory Build the workspace”; nagłówek strony to
„Building Portable Agent Control Planes”. Tematy kursu: Widgets, Automating Issues.

## Configuration

Cztery strategie konfiguracji, które można **mieszać** (agent z folderu projektu
może używać zainstalowanych skilli i naszych serwerów MCP):

| Strategia | Co to jest | Przykład z lekcji |
| --- | --- | --- |
| **Person** | integracje, pamięć i ustawienia w jednym miejscu, dostępne z każdego narzędzia | Kody Kenta (serwer MCP jako cała warstwa możliwości) |
| **Project** | rola, reguły i testy agenta w folderze, z którego korzystają agenci wszystkich | role Johna |
| **Service** | osobny agent działający stale na serwerze; „nic się nie przenosi” | Specter z [s04e01](s04e01-mechanics-behind-autonomous-systems.md) |
| **Package** | skille i rozszerzenia przez `npx skills`, z aktualizacjami | — |

Skille, CLI, MCP, agenci w chmurze i A2A liczą się **razem**, nie osobno.

Realny setup inżyniera (projekty własne + kilku klientów): agenci podpięci do
kont osobistych; każdy projekt ma własne zasoby, konta i czasem tylko
zatwierdzonych dostawców AI; agenci w chmurze **nie mogą mieszać projektów
klientów** — twarde granice; sekrety, połączenia, raporty i wiedza nigdy nie
wyciekają do innego klienta. Rysunek: pasmo Person daje każdej kolumnie „tylko
narzędzia i preferencje”, kolumny (Personal, Client A, Client B) dzielą ściany
„no crossing”, a control plane na dole to „mapa tego, co istnieje i gdzie” plus
„reguły w kodzie: co się ładuje w którym kontekście”.

Co uporządkować (agent może zeskanować i zwizualizować obecny stan):

- **Profiles** — modele, uprawnienia, połączenia MCP, skille, pluginy.
- **Global Context** — notatki o całym systemie (urządzenie, serwery, usługi),
  aktualizowane m.in. tym, czego uczymy się z sesji.
- **Observability** — np. Langfuse podpięty także do agentów kodujących.
- **Remote Filesystem** — globalna konfiguracja w osobnym repo, z całym
  kontekstem potrzebnym, żeby agent ustawił się na nowej maszynie.
- **Sandbox** (sbx, boat) — jako domyślne, ale często **nie blokują** odbierania
  i wysyłania informacji ani niechcianych akcji.
- **Secrets** — agent nie dotyka sekretów; `.env` bywa za słabe nawet z regułą
  zakazu czytania, bo agent łatwo znajduje obejście.

Cel całości: móc łatwo **uruchamiać nowych agentów** (spawn).

W buildzie Johna: strategia Project — `widgets/issues/` trzyma instrukcje i
oczekiwania widgetu, `rules.md` reguły pracy nad issue, a widget Memories
utrzymuje globalny kontekst projektu w `MEMORIES.md`.

## Portability

- „Jeśli zrobimy to dobrze raz, uruchomimy to wszędzie” — tarcie zaczyna się od
  jednego elementu, który człowiek musi za każdym razem poprawić ręcznie
  (analogia: Docker, Kubernetes).
- Test przenośności: skonfigurować system na zdalnym urządzeniu i **poprosić go,
  żeby sklonował się** na inne; klon ma wykonać to samo zadanie z tym samym
  wynikiem, bez ręcznych kroków. Następny krok: zadania równolegle.
- Reguła autora: **wszystko jest po prostu folderem**. Jeden użytkownik, agenci
  równolegle, praca w tle prawie cała w chmurze. Trzy pełne kopie folderu
  (Desktop, Cloud, Laptop); synchronizacja tylko przez chmurę.
  - Synchronizuje się: agenci, skille, dokumenty, załączniki, historia rozmów,
    preferencje, harmonogramy; klucze — zaszyfrowane i **poza folderem**.
  - Zostaje lokalnie: bieżąca praca, uprawnienia tej maszyny, indeksy
    (odbudowywane z folderu). Konflikt zachowuje obie wersje.
- Ten sam **kernel agenta** lokalnie i w chmurze: czyta folder na świeżo przy
  każdym runie, uruchamia agentów, sprawdza każdą akcję. Różni się tylko to, co
  „dostarcza miejsce” (sekrety, uprawnienia, offline / działanie, gdy urządzenie śpi).
- Zespół: wspólna warstwa (agenci, skille, skrypty, wiedza, deklaracje usług,
  limity) czytana przy każdym runie; **limity ustawia zespół, zachowanie każdy
  może dodać lub nadpisać**; każda zmiana warstwy wspólnej przechodzi review;
  rozmowy, pamięć i sekrety są prywatne („never shared”).
- Przenośne są tylko części systemu: agenci w tle (pełna automatyzacja wdrożenia,
  ograniczeni do akcji niedestrukcyjnych: research, raporty, testy, monitoring),
  wewnętrzny MCP/CLI zamiast podpinania każdego konta osobno, agenci przez MCP;
  konfiguracje osobiste zostają u ludzi.
- Sedno: **wydzielić części wspólne**, zarządzać nimi w jednym miejscu i
  rozprowadzać. Kent załatwił prawie wszystko, używając MCP jako warstwy możliwości.

W buildzie Johna przenośność jest mała: każde narzędzie opisane **zdolnością,
której potrzebuje**, nie produktem (widget = powierzchnia, źródło, wywołanie
modelu, akcja); Pi i Herdr to jeden opisany przykład. Bez chmury i klonowania.

## Knowledge Delivery

- Zachowanie agenta można zmienić całkowicie bez ruszania jego źródeł — samym
  **kontekstem i narzędziami**. Dla agentów w tle potrzebny jest systematyczny
  sposób utrzymywania konfiguracji na bieżąco.
- **MCP jako warstwa możliwości** (Kody): osobna aplikacja „dla agentów”, która
  sama bywa też hostem MCP, więc jeden serwer łączy z wieloma innymi. Agenci mają
  **dwa narzędzia: `search` (znajdź, co istnieje) i `run` (użyj w kodzie)** — kontekst
  zostaje mały. Za nimi cztery rodzaje możliwości: skrypty (zbudowane raz),
  integracje (logowanie raz), pamięć (przywoływana, gdy istotna), harmonogramy
  (działają bez modelu). Nowa możliwość jest od razu dostępna dla wszystkich agentów.
- Haczyk: inni agenci muszą **wiedzieć o zmianie** albo być ustawieni tak, żeby
  przed akcją zawsze sięgać po aktualną wiedzę.
- Taki serwer opiera się na natywnych funkcjach narzędzia i jego modelach, więc
  setup poprawia się sam z każdą aktualizacją. To samo podejście opisuje Uber
  (gateway MCP); przed budową własnego gatewaya sprawdzić Executor.

W buildzie Johna: wysłanie issue do Main to dostarczanie wiedzy — kontekst jest
**wypchnięty w chwili potrzeby**, Main go nie szuka (sekcja „Od issue do pracy”).

## Operations

- Wielu agentów na wspólnych zasobach = nakładanie się i nadpisywanie pracy.
  Potrzebne: claims, izolacja, wersjonowanie, rollback, recovery.
- Observability ma łapać nie tylko **co się stało**, ale też **jaka była wtedy
  konfiguracja** i **dlaczego ją zmieniono**. Każdy run zapisuje: wersję
  konfiguracji i jej **content hash**, model, narzędzia, kto go uruchomił. Każda
  zmiana: kto, dlaczego, kiedy, hash przed i po.
- System samorozwijający się może zmieniać własne ustawienia, ale **nie poszerza
  własnych uprawnień bez potwierdzenia człowieka**.
- „Kod decyduje” (deterministycznie, zawsze): **claim z lease** blokuje wątek lub
  zasób na czas pracy i zwalnia go po sukcesie albo porażce; gdy agent umrze lub
  zawiśnie, lease wygasa i zasób jest wolny; zmiana to nowa wersja, którą można
  cofnąć (np. historia Gita); akcja nieodwracalna (mail) idzie z kluczem i
  wykonuje się **raz**.
- „Agent decyduje”: konflikt trafia do **sędziego** (agent tylko od rozwiązywania
  problemów systemu, z pełnym śladem i skillami) — a jego rozstrzygnięcie też
  bierze claim.
- **AgentFS** (beta, traktować jako źródło pomysłów): piaskownica plików dla
  agentów — zmiany każdej sesji w jednym pliku SQLite, osobno od prawdziwych
  plików; można je przejrzeć, cofnąć, sforkować albo zastosować wybrane.
  Nie rozwiązuje konfliktów ani izolacji sieci.
- Decyzja o architekturze i mechanikach jest nasza; implementację zrobi agent.

W buildzie Johna z tej sekcji jest jedno: zmiana konfiguracji zapisana razem z
efektem (hill climbing). Nie ma claimów, lease'ów ani rollbacku akcji.

## Build guide: widgety, issues i kontekst przed pracą

Zakłada to, co zbudował [s04e01](s04e01-mechanics-behind-autonomous-systems.md):
workspace z linią poleceń dla paneli oraz `/split`, `/lab`, `/agent`. Każdy build
ma prompt startowy, listę „What it needs”, „If something is missing” i „Done when”.

### Skróty

Klawisz na każdą często używaną komendę. Agent najpierw **wypisuje już zajęte
skróty** i mówi, czy klawisz jest wolny albo połykany przez terminal. Skrót ma
być udokumentowany tam, gdzie szukamy (lista skrótów albo help komendy). W Claude
Code: plik keybindings wiąże klawisz z `command:<name>`. Rozszerzenie pomysłu:
pasek komend z filtrem i historią.

### Widgety

- Definicja Johna: **inteligentna wizualizacja krytycznej informacji** —
  zbieranie (skrypt albo wywołanie MCP) plus mały, szybki model z oceną.
  Powód: pytanie Main „co się dzieje?” dokłada do Main dygresję.
- **To-dos**: patrzy na każdą rozmowę w workspace i pokazuje, co agent robi, co
  zrobione, co czeka na nas. Tylko do czytania.
- **Memories**: przy każdym naszym prompcie model ocenia, czy to reguła warta
  zapamiętania; po **Keep** dopisuje jedną linię do `MEMORIES.md`, podlinkowanego
  z `AGENTS.md` (w Claude Code: import `@MEMORIES.md` w `CLAUDE.md`).
  Klucz: **nic nie dzieje się automatycznie poza sugestią**.
- Cztery sposoby rysowania: UI kit workspace'u (Herdr), plugin, strona WWW z
  lokalnego serwera, TUI w panelu (Ink, Bubble Tea, Textual, Ratatui).
- Komenda `/widget` opisuje widget czterema rzeczami: nazwa, skąd dane, co i
  jakim modelem oceniać, co można zrobić z pozycją. Ustawienia w
  `widgets/<name>/`, instrukcje modelu osobno w `instructions.md`.
- Reguły z promptu: dane zbiera **zwykły kod**, model niczego sam nie pobiera;
  sugestia nigdy nie stosuje się sama; widget nie dokłada tury do Main; może
  czytać **zapisaną próbkę** zamiast żywego źródła; legenda klawiszy pod listą.
- Potrzebne zdolności: powierzchnia, źródło, wywołanie modelu bez rozmowy
  (`claude -p`, `codex exec`), akcja.
- Widget przechodzi przez **lab** jak każde narzędzie: lab instaluje go we
  własnym workspace, nigdy w naszym; źródło zewnętrzne czyta z próbki; agent
  labu może czytać próbkę, **nigdy `instructions.md`**. Oczekiwania w
  `widgets/<name>/expectations.md` w formie Do / Expect / Never, np.
  „Never (Memories): writes to MEMORIES.md before Keep is pressed”.

### Widget Issues

- Większość pracy nie zaczyna się w Main, tylko od zgłoszenia, feedbacku albo
  karty na tablicy (u Johna: projekt RentAPlace — skrzynka supportu, feedback
  ze strony, tablica). U nas źródłem może być `gh issue list`, `gh pr list`.
- Widget wybiera **najwyżej pięć** najpilniejszych, każde z jedną linią „dlaczego”
  i ID źródeł; resztę listuje bez komentarza; próbka dnia w `widgets/issues/sample.json`.
- **Kod zbiera, model tylko ocenia** — kod nie wymyśli zgłoszenia. Co znaczy
  „pilne” i jakie usługi podpiąć, definiujemy my.
- Przykład przesady: ticket pyta „When will the refund show up?”, widget pisze
  „Four guests report missing refunds.” **Streszczenie, które przesadza
  względem źródła, jest gorsze niż brak streszczenia**, bo na nim działamy.
  Oczekiwania: nie przesadzać, nie dodawać liczby, przyczyny ani pilności,
  której nie ma w cytowanym źródle; żadnego ID spoza próbki.
- Gdy raport pokazuje porażki: **zmieniamy instrukcje, nie oczekiwania**
  (proste słowa kategorii, glosariusz/DDD, słowa z kart bez przeróbek).
- **Hill climbing**: jedna zmiana w `instructions.md`, ten sam test na próbce,
  zmiana zostaje tylko, gdy mniej linii pada; stop, gdy wszystko przechodzi
  **dwa razy z rzędu** albo **pięć zmian z rzędu** nie pomaga; każda zmiana
  pokazana z liczbą porażek przed i po.
- Model też jest ustawieniem: na Haiku widget przesadzał raz za razem, na nieco
  większym modelu przestał. Kompromis: ile czasu iterować nad małym modelem vs
  podnieść thinking level albo model. Test jest automatyczny, więc można go
  puścić dla każdego modelu i dostać tabelę: porażki, czas, koszt odczytu.
- Klawisze: skok do widgetu, Escape z powrotem, strzałki i j/k, akcje (wyślij do
  Main, nowe Main, przekaż agentowi, kopiuj, odrzuć); akcja niedostępna jest
  wyszarzona i mówi dlaczego.
- Różnica względem Critica: Critic patrzy na Main, Issues na usługi zewnętrzne;
  **Main zostaje miejscem pracy z projektem**.

### Od issue do pracy

- Problem: Main dostaje issue „na zimno”. Zamiast szukać ręcznie za każdym razem:
  **mały model planuje**, których zbieraczy uruchomić (może pominąć i musi
  powiedzieć których), potem rój małych modeli **równolegle, tylko do odczytu**.
- Pięciu zbieraczy: kod i testy, historia, GitHub (`gh search issues`), aktualizacje
  pakietów, nasze wcześniejsze rozmowy.
- Reguła: **każda linia podaje źródło** (plik, commit, issue, rozmowa); „Nothing
  relevant” to dobra odpowiedź; ustalenie bez źródła jest usuwane przed wysłaniem.
- `rules.md` jedzie razem z issue: znajdź przyczynę przed zmianą; odtwórz
  czerwonym testem; najpierw plan i pytania; pytaj, zanim dotkniesz pieniędzy.
- Main dostaje trzy rzeczy w jednym prompcie — issue, brief, reguły — i
  odpowiada: co znalazł, plan, pytania; **nie zmienia plików, póki nie odpowiemy**.
- Po co: największa strata czasu jest na starcie zadania; droższy model ma
  rozwiązywać problem, nie szukać materiału. John **odradza własnego agenta-
  naprawiacza**: issues mają za dużo zmiennych, naprawa to praca nas i Main.

## Takeaways

Budowa systemów autonomicznych to projektowanie logiki, która się skaluje,
osadzonej w realnej potrzebie. Zadanie z lekcji: wybrać z agentem coś małego —
„sprytny cron” albo prosty serwer MCP — i używać tego **w więcej niż jednym
środowisku**; to ujawni problemy.

## Na co uważać

1. Części wspólne agentów wydzielone za późno trudno potem rozdzielić.
   Rozdzielać od początku: co wspólne (skille, reguły, narzędzia), co własne.
2. Zmiana wspólnej części bez observability i evali = nie wiadomo, kogo zepsuła.
   Najpierw sprawdzian, potem zmiana.
3. Sandbox nie zatrzymuje wysyłania ani odbierania danych.
   Nie traktować go jak granicy bezpieczeństwa dla sekretów i sieci.
4. `.env` z regułą „nie czytaj” to nie ochrona — agent znajdzie obejście.
   Sekret poza zasięgiem agenta (sejf systemu, sekrety hosta), nie plik w projekcie.
5. Agenci w chmurze mieszający projekty klientów.
   Twarda granica na kontekst: osobne konta, sekrety i agenci w tle.
6. „Przenośne” sprawdzone tylko na jednej maszynie.
   Klon na drugim urządzeniu ma wykonać to samo zadanie bez ręcznych kroków.
7. Jeden agent zmienia wspólną możliwość, a reszta o tym nie wie.
   Agenci sięgają po aktualną wiedzę przed akcją (czytanie folderu na świeżo).
8. Ślad mówi, co się stało, ale nie na jakiej konfiguracji.
   Wersja i hash konfiguracji w każdym runie; zmiana z powodem i hashem przed/po.
9. Agent sam poszerza swoje uprawnienia.
   Poszerzenie uprawnień zawsze czeka na człowieka.
10. Dwóch agentów na jednym pliku; agent, który zawisł, blokuje zasób na zawsze.
    Claim z lease w kodzie; wygaśnięcie zwalnia zasób.
11. Akcja nieodwracalna wykonana dwa razy po retry.
    Klucz na akcję; duplikat odrzucony.
12. Streszczenie, które przesadza względem źródła (pytanie → skarga, dopisana liczba).
    Oczekiwanie „mów tylko to, co mówią źródła” i ID źródła przy każdej linii.
13. Model sam pobiera dane i „znajduje” zgłoszenie, którego nie było.
    Kod zbiera, model tylko ocenia; ID spoza zebranych danych odpada.
14. Poluzowanie oczekiwań, żeby raport był zielony.
    Zmieniać instrukcje, thinking level albo model — nigdy `expectations.md`.
15. Test na żywym źródle: każdy run czyta co innego, raportów nie da się porównać.
    Zapisana próbka i ten sam test przy każdej zmianie.
16. Widget albo pamięć, które działają same.
    Tylko sugestia; zapis do pliku lub wiadomość do Main dopiero po naszym kliknięciu.
17. Main zaczyna od zmieniania plików.
    `rules.md` + prośba o ustalenia, plan i pytania przed pierwszą zmianą.
18. Własny agent-naprawiacz issues.
    Rój robi robotę przygotowawczą, naprawa zostaje u nas i Main.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Strategia Project: rola, reguły, testy w folderze | Mamy | `CLAUDE.md`, `.claude/skills/` (`lesson-notes`, `release-signals`) i hooki w `.claude/settings.json` są w repo tej bazy; brakuje „testów” — to pozycja o expectations z [s04e01](s04e01-mechanics-behind-autonomous-systems.md#do-zastosowania-w-tym-setupie) (wiersz 12, Planned). |
| 2 | Strategia Person: MCP jako warstwa możliwości | Mamy (częściowo) | [barwy-tools](../topics/barwy-tools.md) (`memo_write`, `memo_search`, `upload`, `transcribe`) jest podłączony na poziomie użytkownika, więc podróżuje między projektami. Nie ma `search`/`run`, integracji ani harmonogramów. Zrobić: omówić z agentem kod Kody (github.com/kody-hq/kody) i wypisać 2–3 pomysły do barwy-tools; klonowanie repo wymaga zgody. |
| 3 | Strategia Package | Mamy | `capture`, `triage`, `find-skills` leżą w `~/.agents/skills`, a `~/.claude/skills` ma do nich tylko symlinki (sprawdzone 2026-11-17) — skille nie są przywiązane do jednego narzędzia. |
| 4 | Global Context | Zrobić | `~/.claude/CLAUDE.md` nie istnieje (sprawdzone 2026-11-17). To istniejąca pozycja Planned „Add a global `~/.claude/CLAUDE.md`” — lekcja dokłada: opis urządzenia, serwerów i usług (Workery: mail-agent, away-agent, barwy-tools) oraz aktualizowanie go z sesji. |
| 5 | Remote Filesystem: konfiguracja globalna w repo | Zrobić | Ani `~/.claude`, ani `~/.agents` nie są repozytorium Gita (sprawdzone 2026-11-17), więc na nowej maszynie setupu nie da się odtworzyć z jednego miejsca. Prywatne repo na `~/.agents/skills`, `~/.claude/mods/dev-guard` i globalny `CLAUDE.md`; utworzenie repo wymaga zgody. |
| 6 | Sekrety poza zasięgiem agenta | Zrobić | Standing choice: bilety i sekrety w plikach ignorowanych przez Gita pod `work/<id>/` — agent może je czytać. Minimum: spis, gdzie leży który sekret (bez wartości), i przeniesienie żywych do pęku kluczy macOS albo sekretów Workera. Łączy się z „one host per secret” (Planned, S04E01). |
| 7 | Test przenośności: klon robi to samo bez ręcznych kroków | Zrobić | `node tools/health.ts` ze świeżego klona w sesji chmurowej; porównać raport z lokalnym i spisać różnice (niezacommitowane pliki, folder pamięci, zadanie `mega-dev-heartbeat`, które działa tylko przy otwartej aplikacji). To „Try today” z briefu i zadanie z Takeaways. |
| 8 | Wersja i hash konfiguracji w każdym runie | Zrobić | `tools/health.ts` nie zapisuje ani commita, ani hasha (grep 2026-11-17). Dopisać sekcję: commit repo + sha256 `CLAUDE.md`, `.claude/settings.json` i każdego `SKILL.md`. Gotowe, gdy dwa raporty pokazują, czy konfiguracja się zmieniła. |
| 9 | Zmiana z powodem (kto, dlaczego, kiedy) | Mamy (częściowo) | `log.md` zapisuje zmiany struktury z powodem, a `tools/check.ts` nie pozwala zmieniać zacommitowanych linii; Git daje wersje. Bez hasha przed/po — po wierszu 8 raporty health go dostarczą. |
| 10 | Claim z lease na wspólnym zasobie | Mamy (umownie) | Reguła w `CLAUDE.md`: sesje poboczne nie piszą do `log.md`, `index.md` i `work/board.md` — claim bez kodu i bez wygaśnięcia. Wystarcza przy jednym piszącym; plik blokady z terminem dopiero, gdy pojawią się równoległe sesje piszące. Świadomie niezrobione. |
| 11 | Odwracalne albo raz | Mamy / Zrobić | Notatki: Git i reguła „Never delete” (`archive/`). Akcje: mail-agent i away-agent bez klucza wysyłki — pozycja Planned „keyed side effects” (S04E01). |
| 12 | Uprawnień nie poszerza agent | Mamy | `dev-guard` 0.4.0 pyta przed pushem i `gh repo/pr/issue` ([agent-setup](../../context/agent-setup.md)); Standing choices zmienia tylko człowiek ([tablica](../../work/board.md)). |
| 13 | Wiedza wypychana w chwili potrzeby | Mamy | Hook SessionStart (`tools/state.ts`) podaje sesji stan bazy, zanim o niego zapyta; `index.md` jest routingiem („Start every lookup at `index.md`”). |
| 14 | Kod zbiera, model ocenia; widget | Mamy (bez sędziego) | `tools/health.ts` zbiera fakty kodem i odzywa się tylko przy czerwonym — widget bez modelu. Część oceniająca to „weekly health check” (Planned). Panelu obok rozmowy nie budujemy: `tmux` i `zellij` nadal nie są zainstalowane (sprawdzone 2026-11-17). |
| 15 | Pamięć: sugestia, nie automat | Mamy (inaczej) | Folder pamięci projektu ma `MEMORY.md` z jednym wpisem („Chat in Polish”), a reguły bazy są w `CLAUDE.md`, który zmienia tylko agent na prośbę człowieka. Brakuje kroku „zasugeruj regułę z tej sesji” — dołożyć do rutyny „End of session” (Planned, S03E05). |
| 16 | „Mów tylko to, co mówią źródła” + ID źródła | Mamy (częściowo) / Zrobić | `release-signals` wymaga cytowanych ID, `capture` cytuje plik i miejsce. `lesson-notes` ma tylko „keep numbers exactly as the lesson states them”. Przy pierwszych expectations (Planned, S04E01) dodać linię Never: notatka nie dopisuje liczby, przyczyny ani pilności, której nie ma w tekście lekcji. |
| 17 | Zbieracze kontekstu przed pracą | Zrobić | `.claude/agents/` nie istnieje (sprawdzone 2026-11-17). Pozycja Planned „source-reader” (S02E04) to pierwszy zbieracz; lekcja dokłada kontrakt: każda linia ze źródłem, „Nothing relevant” dozwolone, lista pominiętych. |
| 18 | `rules.md`: plan i pytania przed zmianą | Mamy (częściowo) | Odpowiednik to Standing choices i planowany skill `agreement` (Planned, S03E02). Brakuje krótkich reguł „przyczyna przed zmianą, czerwony test najpierw” — są zapisane jako część pozycji o globalnym `CLAUDE.md`. |
| 19 | Hill climbing i wybór modelu z pomiaru | Zrobić | Wymaga zapisanej próbki i testu: `evals/lesson-notes/cases.md` (Planned) i eksperyment z effortem (Planned). Mniejszy model łamie Standing choice „opus do wszystkiego” — decyzja człowieka. |
| 20 | Skróty klawiszowe | Zrobić (opcjonalnie) | `~/.claude/keybindings.json` nie istnieje (sprawdzone 2026-11-17); skill `keybindings-help` jest na liście skilli tej sesji. Kandydat: klawisz na `lesson-notes`. Zmiana globalna — wymaga zgody. |

## Powiązane

- Poprzednia: [s04e01](s04e01-mechanics-behind-autonomous-systems.md) (Specter,
  lab, expectations, Critic, `/split` — ten build stoi na tamtym).
- [s03e04](s03e04-verifying-product-outcomes.md) (dowody, agentic lab),
  [s03e02](s03e02-translating-intent-into-agent-work.md) (uzgodnienie przed
  pracą — tu `rules.md`), [s02e05](s02e05-agent-reliability.md) (observability,
  evale, guardrails), [s02e04](s02e04-multi-agent-collaboration.md) (subagenci,
  kontrakty), [s02e03](s02e03-agentic-capabilities.md) (MCP host/klient/serwer,
  własny MCP), [s01e02](s01e02-steering-models-through-context.md)
  (personalizacja narzędzia).
- [barwy-tools](../topics/barwy-tools.md) (nasz zalążek strategii Person),
  [pi-and-herdr](../topics/pi-and-herdr.md) (narzędzia z buildu Johna).
- Setup i praca: [agent-setup](../../context/agent-setup.md),
  [tablica](../../work/board.md).
- Challenge tej lekcji: „Looks good to me” — https://hq.mega.dev/challenges/looks-good-to-me (nierozwiązany, stan na 2026-11-17).
