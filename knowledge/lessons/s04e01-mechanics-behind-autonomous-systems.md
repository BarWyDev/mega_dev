---
title: "s04e01 — Mechanics Behind Autonomous Systems"
type: lesson
source: lessons/s04e01-mechanics-behind-autonomous-systems.md (https://hq.mega.dev/lessons/s04e01/) and lessons/s04e01-build-guide.md (https://hq.mega.dev/lessons/s04e01/build-guide/)
updated: 2026-11-16
trust: high
status: active
tags: [autonomy, runtime, state, control, observability, recovery, durable-objects, heartbeat, split, lab, black-box-testing, expectations, critic]
links: [../../lessons/s04e01-mechanics-behind-autonomous-systems.md, ../../lessons/s04e01-build-guide.md, s03e05-products-that-learn-after-release.md, s03e04-verifying-product-outcomes.md, s02e05-agent-reliability.md, s02e04-multi-agent-collaboration.md, s02e02-building-an-agent.md, s02e01-agentic-primitives.md, s01e05-building-workflows-not-tool-stacks.md, ../topics/own-agent-loop.md, ../topics/pi-and-herdr.md, ../topics/barwy-tools.md, ../../context/agent-setup.md, ../../work/board.md, ../../work/s02e05/log.md, ../../work/s03e03/log.md]
---

**System autonomiczny to zwykła aplikacja backendowa, w której jeden klocek —
„inteligencja” — jest nieprzewidywalny.** Dlatego celem projektowym jest *pełna
autonomia* i *maksymalna prostota* (poziom „wykonywalnego Markdowna”), a
wynikiem praktycznym **bounded independence**: agent swobodny w granicach, które
wyznacza kod, nie prompt. Resztę robią znane klocki: zdarzenia, kolejki, alarmy,
checkpointy, dziennik, bramki zgody i pętla naprawy. Najlepsza droga do nauki to
zbudować taki system **dla siebie** i używać go codziennie.

Surowy tekst: [lessons/s04e01-mechanics-behind-autonomous-systems.md](../../lessons/s04e01-mechanics-behind-autonomous-systems.md).
Lekcja jest **rozszerzona**: druga część, [Build guide](https://hq.mega.dev/lessons/s04e01/build-guide/)
(„Splitting Conversations, the Lab, and Your First Agents” — krok po kroku, prompty
i checki), nie przychodzi z MCP; jej tekst jest w
[lessons/s04e01-build-guide.md](../../lessons/s04e01-build-guide.md), a streszczenie
w sekcji [Build guide](#build-guide-split-lab-i-agenci-wspierający) niżej.
Tytuł na dashboardzie: „Software Factory Make an Agent”.

## Autonomy

- Chodzi o software, który **wykonuje zadania, do których nie był
  zaprojektowany**, dostosowuje się do zmian środowiska, wstaje po błędzie
  krytycznym i ewoluuje. Nie da się przewidzieć wszystkich scenariuszy, a rdzeń
  logiki jest niedeterministyczny (ten sam task, wiele przebiegów, bez
  wyjaśnienia).
- Dwa cele projektowe to **narzędzia myślowe**, nie deklaracje: (1) pełna
  autonomia — żeby zobaczyć, ile naprawdę da się oddać programowi; (2) prostota
  dociśnięta do „executable Markdown” albo zwykłego skilla. Z tego punktu widać,
  **co trzeba dodać**, by osiągnąć wymaganą niezawodność, efektywność i
  bezpieczeństwo — i zwykle wychodzi, że możliwy poziom autonomii jest wyższy,
  niż się zakładało.
- Odruch programisty (reguły i guardrails na wejściu) jest naturalny, ale
  kosztuje elastyczność. Część barier **da się później usunąć**, bo modele są
  coraz lepsze — to ta sama zasada „logika, która poprawia się razem z
  modelami”.
- Rys. 1: schody pięciu stopni pod linią „Full autonomy”, każdy stopień to
  jedna rzecz przejęta przez program: **Limits** (nie pilnuję każdej próby),
  **Delivery** (nie dopytuję o wynik), **State** (nie tłumaczę drugi raz),
  **Decisions** (tylko prawdziwe pytania), **Recovery** (nie debuguję ręcznie).
  „Dziś” stoi między pierwszym a drugim stopniem; pytanie do zadania brzmi: **co
  jest potrzebne, żeby dodać następny stopień?**
- Autonomia znaczy **brak człowieka w domyślnym przebiegu**, ale z zachowaniem
  dwóch dróg: agent musi móc dosięgnąć nas, a my jego. Oba kierunki równie ważne.
- **Proaktywność** jest na końcu listy — ma sens dopiero, gdy pozostałe elementy
  działają.
- Dwie drogi budowania: **cloud agents** (skille + agent w cloudzie / harnessie,
  np. Hermes, Grok Bot, Muse) dla automatyzacji osobistych i procesów
  wewnętrznych; **custom agents** (własna implementacja, pełna kontrola) dla
  produktów dla wielu użytkowników.
- Przykład referencyjny: **[Specter](https://github.com/MEGA-DOT-DEV/examples/tree/main/examples/specter)**
  — ambientowy agent do researchu i prowadzenia bazy wiedzy dla jednej osoby.
  Śpi; budzą go **dwie rzeczy**: (1) aktywność użytkownika (zapisany link,
  edycja notatki, wiadomość, a także to, co użytkownik robi z wcześniejszym
  wynikiem Spectera: linkuje, edytuje, usuwa), (2) **alarm, który sam sobie
  ustawił** („wyślij digest za godzinę”). Każde zdarzenie to jeden wiersz logu.
  Mały, tani model (albo model decyzyjny) porównuje działanie użytkownika z
  `focus.md` — jeśli ma znaczenie, agent wstaje; jeśli nie, nie dzieje się nic.
  Alarmy pomijają ten check, bo agent ustawił je sam. Kontaktuje się z
  użytkownikiem tylko wtedy, gdy wynik jest wart przerwania, a przed zaśnięciem
  ustawia następny alarm (rys. 3).
- Mechanika autonomii Spectera: **Perception** (aktywność → zdarzenia, ale bez
  automatycznej obsługi), **Decision** (mały model porównujący ze `focus.md`),
  **Loop** (główny agent zarządza też sobą), **Reflection** (własne alarmy,
  także jako heartbeat do samonaprawy), **Awareness** (każde działanie zostawia
  ślad — **również decyzja, by nic nie robić, razem z powodem**).
- Polecane źródło: DeepSeek Harness, „Exploring Super-agent Design: Towards a
  More Autonomous Agent System” (https://x.com/DeepSeekHarness/status/2116857257245987236).
- **W buildzie Johna:** Critic jako mała wersja bounded independence — działa
  obok głównej rozmowy na małym, szybkim modelu, czyta każdy prompt i każdą
  odpowiedź bez pytania, pisze krótkie findings we własnym panelu. Granica:
  **nic nie wraca do głównej rozmowy, dopóki tego nie wyślemy.**

## Runtime

- Autonomiczny system to w rdzeniu backend z jakimś API; składa się z rzeczy
  znanych z drugiego tygodnia: **events, triggers, jobs, queues, schedules,
  heartbeats, long-running loops**.
- Specter stoi na **[celld](https://github.com/denoland/celld)** — self-hosted
  runtime dla [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
  — plus **[pi-durable](https://github.com/earendil-works/pi/tree/main/packages/durable)**,
  które zapisuje każdy krok runu, więc po restarcie run **wraca do ostatniego
  zapisanego kroku**, a nie startuje od nowa.
- Durable Object = mały serwerowy obiekt ze stałym ID i własnym SQLite; jak
  funkcja serverless, tylko stanowa. Każde żądanie trafia do **tej samej jednej
  instancji**, więc dwa procesy nie zmieniają stanu równocześnie; obiekt może
  też ustawić **alarm** i obudzić się bez żadnego żądania. W Specterze **cały
  agent siedzi w jednym obiekcie** (log, workspace, bieżący run, następny
  alarm), a **outbox w osobnym** — dzięki temu crash nigdy nie wyśle tego samego
  maila dwa razy (rys. 2).
- Komponenty Spectera: **Node** (celld: trzyma dane na dysku, budzi obiekty po
  alarmie), **Router** (cienki worker bez własnej logiki, kieruje zdarzenie /
  odczyt dashboardu / wywołanie MCP do właściwego obiektu), **Log**
  (append-only: każde zdarzenie, decyzja, krok runu i receipt), **Decision**
  (mały model + `focus.md`), **Run** (jedna rozmowa na jedno wybudzenie, start
  bez pamięci, zapis każdego kroku, po crashu kontynuacja), **Workspace**
  (wersjonowane pliki: focus, notes, agenda, skills — jedyna pamięć między
  runami, każda zmiana do wyśledzenia i cofnięcia), **Alarm** (jeden timer
  ustawiony na najbliższą rzecz: agenda, retry albo heartbeat w czasie runu),
  **Checks** (kod, nie prompt: zaufane źródła, dozwolone ścieżki zapisu, limity,
  send key na każdym mailu), **Outbox** (osobny obiekt, jeden mail na send key).
- Te komponenty służą przede wszystkim **przeżywalności** i **budowaniu
  zaufania** — agent rzadziej powtarza działania, z których część jest
  nieodwracalna.
- Drugi przykład, **agent ogólny** (autorska implementacja, bez Pi): trwałe
  wątki z własnymi dziennikami, praca zaplanowana, agenci uruchamiający innych
  agentów na nowych wątkach, check uprawnień przy każdej akcji, recovery po
  restarcie **bez powtórzenia żadnego efektu** — wszystko na **jednej pętli
  wspólnej dla każdego agenta**.
- Stacje tej pętli (rys. 4): **Scheduler → Claim** (zajęcie wątku na czas
  jednego kawałka interakcji) **→ Next step → Context** (składany z wielu
  warstw) **→ Model** (wybiera następną akcję) **→ Grants check** (wolno? albo
  pytanie do użytkownika) **→ Dispatch**. Pod nią osiem prymitywów: **Files,
  Values, Secrets, Integrations, Code, Runs, Events, Grants**; `Runs` potrafi
  spawnować wątek potomny, który zwraca **jeden gotowy wynik**. Warstwa trwałego
  stanu zapisuje i odczytuje każdy krok, a `Work row` wraca na początek pętli.
- Cała warstwa durability w tym przykładzie była pisana ręcznie — runtime typu
  celld daje ją dziś z półki.
- **W buildzie Johna:** ta sama idea w małej skali — agenta pomocniczego budzą
  **dwa zdarzenia**: wysłany prompt i zakończona odpowiedź; harness zgłasza oba
  przez hooki albo przez plik rozmowy. W tym buildzie **nie ma** alarmów,
  kolejek ani trwałych runów — na to wzorcem zostaje Specter.

## State

- Wywołania LLM są **bezstanowe** (choć Responses API ma tryb stanowy), więc
  stan trzyma nasza strona. Rodzajów stanu jest kilka.
- Grok Bot wprowadził UI **bez wątków** — jedna ciągła rozmowa, bot sam
  dobiera, co potrzebne. Wniosek: **każdy wyuczony wzorzec o agentach da się
  złamać**, bo modele i tooling idą dalej. Ale łamać go wolno dopiero wtedy, gdy
  rozumiemy zasadę, która za nim stoi.
- Specter **nie przechowuje wątków** po zakończeniu runu, bo długowieczny jest
  agent, nie sesja czatu. W trakcie runu zapisane kroki działają jak
  **checkpointy** (crash → wracamy do ostatniego). Po runie rozmowa jest
  niepotrzebna. Ciągłość między runami daje **to, co run zapisał**: nowe wiersze
  logu, nowe wersje plików (`focus.md`, notatki, agenda) i następny alarm.
  Kolejny run **startuje pusty**, czyta nieprzeczytane wiersze logu i potrzebne
  pliki (rys. 5). Czyli: **Specter nic nie pamięta — tylko czyta to, co sam
  zapisał**, dzięki czemu pamięć da się przejrzeć, poprawić i cofnąć.
- Agent ogólny trzyma cztery rodziny stanu — **interactions, execution,
  workspace, temporary variables** — w szczegółach:
  - **Journal** — append-only, każdy szczegół interakcji; kontekst dla modelu i
    materiał do recovery. Zapisuje też zgody, powtórzone wywołania i **model
    użyty w każdym żądaniu**, więc zawsze widać, co się naprawdę stało.
  - **Observations** — gdy historia rośnie, model wyciąga z niej kluczowe fakty,
    każdy z linkiem do rekordu źródłowego; przebudowywane z dziennika na każdym
    kroku, więc **dziennik zostaje jedynym źródłem prawdy**.
  - **Catalog** — lista wątków, wyszukiwanie, indeks załączników; budowany z
    dzienników, więc odtwarzalny.
  - **Work rows** — jeden wiersz na wątek: due / running / waiting / finished i
    jak daleko pętla przeczytała dziennik; scheduler z tego wybiera następny job.
  - **Schedules** — praca na później albo cykliczna; gdy się odpali, obsługuje
    ją **zwykła pętla**, jak każdy inny job.
  - **Effect ledger** — krótki zapis wszystkiego, co zrobił jeden przebieg
    **code mode**, trzymany tylko na czas runu.
  - **Agents and skills** — każdy agent to plik (nazwa, reguły, skille, model),
    czytany ponownie **przed każdym wywołaniem modelu**, więc zmiana działa od
    razu.
  - **Grants** — reguły uprawnień, które musi przejść każda akcja: allow, deny
    albo pytanie. Reguły o zasobach urządzenia (np. podlinkowane foldery)
    **nigdy go nie opuszczają**.
  - **Documents** — notatki i pliki; każdy załącznik zapisany raz, pod hashem
    treści.
  - **Values / Secrets** — values to typowane wiersze (np. preferencje)
    współdzielone przez agentów z dostępem; secrets to hasła i klucze, a agent
    dostaje **tylko handle**, nigdy wartości.
  - **Claims** — który worker wykonuje teraz kawałek wątku i które okno patrzy.
  - **Events** — powiadomienia na żywo dla okna, **nigdy nie zapisywane**: po
    reconnect okno czyta dziennik i work rows jeszcze raz.
- Autor składał tę architekturę iterując z AI nad logiką rdzenia (**kernel**),
  bo gotowego opisu nie było. Wniosek dla nas: **inżynierowie mają już większość
  potrzebnej wiedzy** — start od „smart cron jobs”, które robią trywialne
  rzeczy, szybko prowadzi do bardziej złożonej logiki.
- **W buildzie Johna:** agent pomocniczy też trzyma stan w plikach — folder
  `agents/critic/` z zadaniem w `agent.md`, checkami w `expectations.md` i
  wynikami w `reports/`. Agent jest otwierany z tych plików, a lab testuje go
  względem nich.

## Control

- Pytania, od których się zaczyna: czy kontrola jest w ogóle potrzebna, czy to
  w ogóle powinno być autonomiczne, jak agent ma nas dosięgnąć i jak zrobić
  zgody **użyteczne, niezawodne i wygodne**.
- Najważniejsze: **zgoda musi być deterministyczna** — przepuszcza albo odrzuca
  **kod, nie model**. Trudność jest w szczegółach: które akcje wymagają zgody,
  czy inne mogą iść dalej w tym czasie i jak obsłużyć czekanie, które może
  trwać dniami. Tu pomaga durability: interakcję da się odtworzyć po długim
  czasie, nawet gdy zerwało połączenie.
- Rys. 6 (oś czasu jednej pętli, przykład: mail do klienta): kod sprawdza
  reguły, trzy wyniki — **run / refuse / ask**. Przy „ask” pętla **pauzuje i
  zapisuje żądanie**, mija „minuty albo dni” (inna praca w tym czasie leci
  dalej), odpowiedź **jest zapisana przed czymkolwiek innym**, kod sprawdza
  jeszcze raz i wykonuje akcję **tylko dla tego samego żądania**. Zasada: **brak
  odpowiedzi nigdy nie staje się „tak”**. Trzy odpowiedzi z kart: które akcje
  wymagają zgody — reguły w kodzie, za każdym razem; czy inna praca leci —
  tak, pauzuje tylko ta pętla; co przy wielodniowym czekaniu — żądanie
  przeżywa restarty.
- Kontrola to nie tylko zgody na wywołania narzędzi: agenci zarządzają też
  zasobami, integracjami i interakcjami z innymi ludźmi i agentami. To wszystko
  idzie przez **prymitywy**, najlepiej centralnie, żeby uprawnieniami dało się
  zarządzać.
- Rys. 7 (Grants): **Agent → Find** (widzi tylko to, czego może użyć) **→ Plan**
  (akcja i jej ryzyko) **→ Grants check** (allow / deny / ask). Reguły czytane
  **przy każdym wywołaniu**, w dwóch rodzajach: **portable** (pliki, które się
  synchronizują; zły zestaw jest odrzucany) i **device** (tylko to urządzenie,
  nigdy nie synchronizowane). Reguły obowiązują **wszędzie tam, gdzie używany
  jest prymityw** — integracja użyta w czacie i w aplikacji podlega tym samym
  uprawnieniom. Wywołanie z `Code` wraca do checku **ponownie**.
- Są akcje, których użytkownik **nie może oznaczyć jako zaufane** — np.
  **utworzenie integracji**: rzadkie, ale potencjalnie groźne.
- Praktyczny problem: zbyt ciasne reguły → użytkownik potwierdza wszystko,
  autonomia traci sens, a potwierdzenia przestają być czytane. Dlatego **zgody
  czasowe** i **zgody kontekstowe**.
- **Code mode** znaczy, że agent pisze skrypty i komendy, których użytkownik
  może nie rozumieć, a wszystkich groźnych akcji nie da się opisać regułami
  deterministycznie (co jest groźne, zależy od kontekstu użytkownika). Stąd
  **modele decyzyjne** — [jev](https://openrouter.ai/docs/guides/community/jev)
  albo [Decisions API](https://developers.openai.com/api/docs/guides/decisions).
  Rys. 8: najpierw reguły w kodzie (nigdy zgadywane) → „nigdy nie wolno” =
  refuse, „zawsze pytaj” = pytanie do użytkownika, brak dopasowanej reguły →
  model decyzyjny dostaje akcję i kontekst użytkownika i zwraca **mały,
  typowany wynik** (etykieta + pewność), na którym **routuje kod**: pewne, że
  bezpieczne → akcja idzie i nikt nie jest przerywany; niepewne → pytanie z
  powodem po ludzku; pewne, że groźne → odmowa, a agent widzi dlaczego.
- Część kontroli bierze się z samych modeli (mniej halucynacji, lepsze
  trzymanie instrukcji) — to zmniejsza ryzyko, ale nie daje gwarancji.
- **W buildzie Johna:** kontrola jest **ręczna domyślnie** — Critic pokazuje
  numerowane findings, a my wybieramy, które wysłać do głównej rozmowy. Wysłanie
  **nie przerywa** trwającej odpowiedzi i **nie zmienia** wpisanego tekstu.
  Automatyczne przerywanie jest opcjonalne, tylko dla zmian destrukcyjnych, i
  **lab musi je najpierw udowodnić**.

## Observation i Recovery

- Wiedza z **S02E05** (observability, evale) jest tu jeszcze ważniejsza, bo
  dochodzą mechanizmy **proaktywne**: iterują po systemie i łapią problemy
  zaraz po tym, jak wystąpią.
- Przy wielu agentach na wielu urządzeniach **ręczne pilnowanie przestaje być
  możliwe** — celem jest, żeby **inni agenci obserwowali, reagowali i
  naprawiali** od razu.
- Platformy jak **Langfuse** dają monitoring i **online evale**, które mogą
  powiadomić naszych agentów i dać im informacje potrzebne do wejścia w system i
  naprawy. Dlatego trzeba świadomie wybierać, **jakie dane zapisujemy** — nie
  tylko z perspektywy użytkownika, ale i systemu, który ma **rozumieć siebie**
  na tyle, by iterować po własnym zachowaniu.
- Wszystko spina się w siedmiu stacjach (rys. 9, pętla zamknięta, w środku „the
  system keeps itself running”): **Survive** (trwały stan + efekty z kluczem),
  **Record** (logi i dzienniki, łącznie z decyzją o nierobieniu niczego),
  **Notice** (schedules i heartbeaty — system widzi siebie, gdy nikt nie
  patrzy), **Fix** (agenci w tle, ale **każda naprawa startuje od odtworzonej
  awarii**), **Verify** (evale pokazują wpływ zmiany, zanim jej zaufamy),
  **Escalate** (**jedno** dotknięcie użytkownika, z jedną akcją do wykonania),
  **Improve** (prymitywy, nie łatanie objawów) → i znów Survive. **Tylko
  Escalate** ma linię do użytkownika.
- **W buildzie Johna:** lab to ta sekcja w praktyce — drugi agent testuje
  narzędzie **z zewnątrz**, w odizolowanej kopii workspace'u, pisze jak człowiek,
  czyta **tylko ekran** i raportuje „próbowałem X, oczekiwałem Y, dostałem Z”.
  Gdy check nie przechodzi, zmieniamy **zadanie agenta** i uruchamiamy **ten sam
  check** ponownie. **Nigdy nie rozluźniamy expectation.**

## Build guide: /split, lab i agenci wspierający

Druga część lekcji (John Lindquist). **Fabryka oprogramowania = zastępowanie
tarć w cyklu wytwarzania agentami**, a zaczyna się nie od roju agentów, tylko od
jednej skupionej rozmowy **Main**, wokół której rosną małe narzędzia. Każdy build
jest opisany przez *zdolność*, której potrzebuje; Pi i Herdr to tylko jeden
podpisany przykład.

### Pięć filarów

- **Composable** — jedna rozmowa w środku; agentów dokładamy, wymieniamy i
  rozwijamy po kawałku.
- **Intuitive** — nikt nie pamięta, co robi każdy agent, więc każde narzędzie
  pokazuje przykłady, podpowiedzi i autouzupełnianie w chwili użycia — nam **i
  agentom**.
- **Proven** — narzędzia budowane pod evale (spisane checki uruchamiane w kółko);
  duży model rozlicza mały, więc **nasze oczekiwania są sufitem**.
- **Glanceable** — ocena, status, porównanie albo przykłady zamiast ściany tekstu.
- **Homegrown** — fabryka wyrasta z własnego produktu i własnego labu, dopiero
  potem służy zespołowi i klientom.

Dwa narzędzia: **workspace** trzyma panele i procesy, **harness** uruchamia agenta
w panelu. Sześć zdolności do sprawdzenia przed budową:

| Zdolność | Skąd | Komu potrzebna | Przykład |
| --- | --- | --- | --- |
| Custom commands | harness | /split, /lab, /agent | skille w Claude Code |
| Fork rozmowy | harness | /split | `--fork-session`, `codex fork` |
| Otwarcie panelu z CLI | workspace | /split, /lab, /agent | tmux `split-window`, Zellij `new-pane` |
| Odczyt tekstu panelu | workspace | /lab | tmux `capture-pane`, Zellij `dump-screen` |
| Transkrypt albo hooki | harness | /agent | `UserPromptSubmit` i `Stop` ze ścieżką transkryptu |
| Wysłanie wiadomości do rozmowy | dowolne | /lab, /agent | tmux `send-keys`, Zellij `write-chars` |

- Zwykłe karty terminala bez CLI do paneli nie wystarczą — Main trzeba
  uruchomić w multiplekserze (tmux, Zellij).
- **Jeśli custom command jest sam wiadomością do modelu** (dodaje turę w Main),
  każde narzędzie buduje się jako **polecenie powłoki albo skrót workspace'u**.
- Projekt przykładowy: RentAPlace (https://github.com/johnlindquist/rentaplace),
  z `GLOSSARY.md` — wspólne słowa produktu, jedno znaczenie na słowo, słowa z
  kodu i słowa zakazane. We własnym projekcie warto zacząć od takiego pliku.

### /split

- Kopiuje rozmowę **do wybranej wiadomości** (albo całą) do nowej sesji i otwiera
  ją w panelu obok. **Main zostaje nietknięty, bez nowej tury.**
- Podział pracy: harness kopiuje rozmowę i dodaje notkę, workspace otwiera panel
  w tym samym katalogu. Buduje się przez rozszerzenia i komendy, nie przez
  grzebanie we wnętrznościach narzędzi.
- **Notka na końcu odgałęzienia jest konieczna:** „to rozmowa odłączona od innej,
  która nadal działa; nie kontynuuj wcześniejszej pracy; spodziewaj się zmian w
  plikach; rób tylko to, o co zaraz poproszę”. Bez niej agent dziedziczy otwarte
  plany i nadpisuje pliki Main.
- Przed budową: repozytoria harnessu i workspace'u na dysku (albo oficjalna
  dokumentacja), prompt orientacyjny o lokalnej terminologii, `gh` do szukania
  podobnych rozszerzeń i — przy problemie — podobnych issues.
- Drugi filar w praktyce: `--help` na wszystkim, co budujemy, plus przykłady i
  ghost text tam, gdzie harness je wspiera.
- Do czego: **eksploracja i research**, bez edycji plików kolidujących z Main.
  Wynik wart zachowania → samodzielna strona HTML w `.notes/` (katalog w
  globalnym gitignore).
- Czego split nie ma: nie obserwuje Main dalej i nic nie odsyła.
- Gotowe, gdy: panel obok ma rozmowę do wybranej wiadomości, ostatni wpis to
  notka, agent czeka, Main nie ma nowej tury, `--help` się drukuje.

### Lab

- Powód: pierwszy /split Johna został zgłoszony jako gotowy z przechodzącymi
  testami, a agent **tylko zasymulował workspace**. Zasada: **agent nigdy nie
  ocenia własnego kodu**; agentom wspierającym nie ufamy, dopóki nie „ukończą”
  labu.
- Trzy części: **agent testowany** („agent w pudełku”, w izolowanym workspace),
  **agent labu** (tester bez wiedzy, jak tamten powstał) i **black-box
  expectations** (co jest wpisywane, co musi się pojawić na ekranie, co nigdy).
- Trzy kroki każdego przebiegu: **Isolate** (osobna kopia workspace'u, czysta
  kopia śledzonych plików projektu, te same loginy do modeli), **Drive** (tester
  pisze i naciska klawisze jak człowiek, czyta tylko widoczny tekst i opcjonalne
  zrzuty; sprawdza też podpowiedzi — *jeśli zgubi się tester, zgubimy się i my*),
  **Report and clean up** („próbowałem X, oczekiwałem Y, dostałem Z”, potem
  zamknięcie wyłącznie tego, co lab uruchomił).
- Pułapki: osobna **tożsamość**, nie tylko nazwa; **czyste środowisko** (odziedziczony
  socket wysyła polecenie do codziennego workspace'u); na macOS ścieżka socketu
  **poniżej ok. 100 znaków** (krótki folder w `/tmp`); kopia projektu **bez
  folderów agentów i plików expectations**; bez VM lab działa z naszymi
  uprawnieniami, więc jest dla własnych narzędzi, nie dla niezaufanego kodu, i
  każdy przebieg kosztuje tokeny.
- Komendy: `/lab doctor`, uruchomienie scenariusza albo pliku scenariuszy,
  `/lab stop`, `/lab --help`; te same operacje wywoływalne z powłoki, żeby mógł
  ich użyć agent. Tester ma **cytować ekran dosłownie**, a lab odrzuca cytat,
  którego na ekranie nie ma.
- Pierwsze dwa checki (`lab-scenarios.md`): „lab działa” (otwórz panel, `ls`,
  odczytaj, zamknij) i „rozszerzenia się przenoszą” (/split otwiera panel z notką).
- **Pętla główna:** prosimy o narzędzie → agent buduje → lab → poprawki w labie,
  aż raporty mówią „gotowe” → dopiero wtedy codzienny workspace.
- Pomysł opcjonalny: nagrania nocnych przebiegów labu dla modelu oglądającego
  wideo („video-driven hill climbing”: jedna zmiana, te same checki, zostaje
  tylko to, co poprawia wynik).

### Agenci wspierający (/agent)

- `/agent <name> <job>` otwiera panel obok Main i **śledzi rozmowę Main na żywo**.
  Domyślnie **mały, szybki, tani model** (u Johna Haiku) — narzędzie poboczne nie
  jest krytyczne; zmiana modelu jest w porządku, nawet jeśli wynik lekko odejdzie
  od tego, co udowodnił lab.
- Przekazywany jest **tylko tekst nowych promptów i odpowiedzi** — bez wywołań
  narzędzi, wyników, obrazów i rozumowania.
- Findings są **numerowane** i nigdy nie wracają same. Wysyłamy jeden po numerze
  (`/agent send main #2`); wysłanie **nie przerywa** odpowiedzi Main i **nie
  zmienia** wpisanego szkicu. Gdy harness tego nie umie: plik-kolejka dołączany
  hookiem do następnego prompta albo licznik oczekujących i ręczne wklejenie.
- Zapisany agent: `agents/<name>/agent.md` (sekcja `## Job`), `expectations.md`,
  `reports/`.
- Test instalacji: agent „Repeater”, który powtarza ostatni prompt Main w
  najwyżej pięciu słowach.
- **Format expectations** — jeden nagłówek na oczekiwanie, panel w nawiasie:
  `Do (Main):` dokładny tekst wpisywany przez lab; `Expect (Critic):` zachowanie
  oceniane z ekranu, z dosłownym cytatem; `Never (Critic):` to, co oblewa
  przebieg; `See` / `Absent` — dokładny tekst sprawdzany przez sam lab;
  `## Before` — linie `Do` wpisywane, zanim agent się otworzy.
- Tester **nigdy nie czyta `agent.md`**; testowany agent dostaje tylko sekcję Job;
  `expectations.md`, `agent.md` i raporty nie trafiają do kopii projektu w labie.
- `/lab new <name>` zadaje kilka pytań (z proponowaną odpowiedzią), pisze
  `expectations.md`, **czeka na akceptację**, dopiero potem pisze `agent.md` i
  uruchamia `/lab test <name>`. Flagi `--agent-model`, `--tester-model`, `--behind`.
- Critic sprawdza przy każdym prompcie trzy rzeczy: czy jest dość informacji, by
  skończyć zadanie; czy użytkownik rozumie **blast radius**; czy prompt trzeba
  rozbić na mniejsze kroki.
- Pierwszy Critic oblał check blast radius **w jednym z dwóch przebiegów** —
  podawał zasięg jako fakt, bez sprawdzenia. Takiego nawyku nie widać w
  instrukcjach agenta. Reguła naprawy: **zmieniamy Job, nigdy nie luzujemy
  expectation**; nowe zachowanie = nowe expectation.
- Gotowe, gdy: każde expectation przechodzi z cytatem z ekranu **w dwóch
  przebiegach z rzędu**, żadne nie zostało poluzowane, a zatrzymanie labu nie
  zostawia procesów, socketów ani folderów roboczych.

### Critic w codziennym workspace

- Po czystych raportach wystarczy komenda /agent (i jej hooki) w codziennym
  workspace — `agents/critic/` już leży w projekcie.
- Wynik agenta ma być **do przeczytania w sekundę** (Glanceable).
- Przerwanie Main robimy sami. **Automatyczne przerywanie** jest opcjonalne i
  ryzykowne (niespodziewany stop psuje długie zadanie zostawione bez nadzoru);
  tylko dla zmian destrukcyjnych i **dopiero po udowodnieniu w labie**, z linią
  `Never` na przerwanie przy nieszkodliwej prośbie.
- Następny agent bierze się z własnego tarcia (łapacz notatek, strażnik luk w
  testach, kontroler migracji) — zawsze **najpierw expectations, potem agent**.

### Pi i Herdr w tym buildzie

- Herdr = workspace (CLI `hc`, „core” to proces w tle trzymający panele, „app
  home” to folder ustawień aplikacji), Pi = harness; oba open source, więc agent
  budujący ma ich kod na dysku (`~/dev/pi`, `~/dev/herdr-app`) i dlatego prompty
  Johna mogą być krótkie (prompt na /agent ma pięć linii). Tło:
  [pi-and-herdr](../topics/pi-and-herdr.md).
- Trzy rozszerzenia Pi, każde instalowane przez `pi install git:github.com/johnlindquist/<repo>`
  i `/reload`: **herdr-pi-split** (/split z wyszukiwarką wiadomości i ghost
  textem `["name"] [handoff focus]`), **herdr-pi-lab** (/lab z `<new|test|doctor>`,
  druga kopia Herdr z własnym core i app home, kopia projektu w `~/.lab/<project>`,
  raporty w `lab-reports/`; `TESTING.md` opisuje pułapki), **herdr-pi-role**
  (/agent, dawniej /role; startowe joby `critic`, `notes`, `research`).
- Rozszerzenie w `~/.pi/agent/extensions/` ładuje się po `/reload`; to w
  `.pi/extensions/` projektu dopiero po zaufaniu projektowi.

## Takeaways

Systemy autonomiczne budowane **najpierw dla siebie** dają wartość bez naszego
udziału i są najlepszą szkołą: uczymy się na awariach i znajdujemy techniki,
które potem idą do pracy. Jednocześnie, nawet jeśli taki system działa bez nas,
**zbudowanie go kosztuje dużo pracy** — i to nie tylko inżynierskiej, ale z
niemal każdego obszaru Product Engineering.

## Na co uważać

1. **Odruch „najpierw guardrails”.** Programista domyślnie zaczyna od ciasnych
   reguł i traci elastyczność → projektuj od pełnej autonomii i prostoty, a
   dodawaj tylko to, czego wymaga niezawodność; część barier usuwaj, gdy modele
   dorosną.
2. **Zgoda rozstrzygnięta przez model to nie zgoda.** Decyduje kod, za każdym
   razem, a **brak odpowiedzi nigdy nie staje się „tak”**.
3. **Za dużo pytań = zgody przestają być czytane.** Jeśli wszystko wymaga
   kliknięcia, autonomia traci sens → zgody czasowe i kontekstowe.
4. **Code mode wymyka się regułom.** Nie opiszesz wszystkich groźnych skryptów
   deterministycznie → reguły w kodzie najpierw, a przy braku dopasowania model
   decyzyjny z typowanym wynikiem, na którym routuje kod.
5. **Efekt bez klucza powtórzy się po crashu** (ten sam mail dwa razy) → osobny
   outbox i send key na każdym wysłaniu.
6. **Wzorzec skopiowany bez zasady psuje się.** Specter wyrzuca wątki po runie,
   Grok Bot wyrzucił wątki w ogóle — zrozum zasadę, zanim złamiesz regułę.
7. **Naprawa bez odtworzonej awarii i bez evala to zgadywanie.** Agent w tle
   startuje od reprodukcji, a zmianę przepuszcza eval.
8. **Rozluźnienie expectation zamiast poprawy agenta** fałszuje wynik labu →
   zmień zadanie agenta i uruchom **ten sam** check.
9. **Proaktywność zbyt wcześnie.** Ma sens dopiero, gdy percepcja, stan,
   kontrola i recovery już stoją.
10. **Ręczne pilnowanie wielu agentów nie skaluje się.** Agenci obserwują
    agentów, a użytkownik jest dotykany raz — przez Escalate, z jedną akcją.
11. **Dziennik bez decyzji „nic nie robię, bo…”** nie pozwala później odtworzyć
    przebiegu → zapisuj też pominięcia, z powodem.
12. **Agent ocenia własną pracę.** „Testy przechodzą” mogło znaczyć symulację →
    ocenia osobny tester, z zewnątrz, cytując ekran.
13. **Odgałęzienie bez notki kontynuuje pracę Main** i nadpisuje jego pliki →
    notka na końcu sesji i split tylko do researchu.
14. **Lab bez własnej tożsamości i środowiska trafia w codzienny workspace**
    (odziedziczony socket) → osobna tożsamość, czyste środowisko, krótka ścieżka
    socketu.
15. **Testowany agent czyta własny test** → kopia projektu bez folderów agentów i
    expectations; tester bez dostępu do `agent.md`.
16. **Komenda, która dodaje turę w Main,** psuje to, co miała chronić → polecenie
    powłoki albo skrót workspace'u.
17. **Jeden zielony przebieg to za mało** (Critic oblał w jednym z dwóch) → dwa
    przebiegi z rzędu.
18. **Automatyczne przerywanie Main** może zniszczyć długie zadanie → ręcznie
    domyślnie; automat tylko dla zmian destrukcyjnych i po labie.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Notice: schedules i heartbeat | Mamy (od 2026-11-16) | `tools/health.ts` + zadanie cykliczne `mega-dev-heartbeat` (codziennie 08:00, świeża sesja): odpala `check.ts`, liczy `inbox/`, niezacommitowane zmiany i lane Planned, zapisuje `work/health/<data>.md` i **powiadamia tylko przy czerwonym** (błędy `check.ts`, pozycja w `inbox/` albo niezacommitowana zmiana starsza niż 7 dni). Sprawdzone w obie strony: czysty run cicho, podłożona notatka bez frontmattera → RED i powiadomienie. Logów Workerów ten run nie czyta — raport mówi to wprost w sekcji „Not covered”. |
| 2 | Awareness: ślad także z decyzji o nierobieniu | Zrobić | `log.md` zapisuje to, co zrobiliśmy; pominięcia (np. pozycja z `inbox/` uznana za nieistotną) nie zostawiają śladu. Reguła w `CLAUDE.md`: decyzja „nie robię tego, bo…” to wiersz w `log.md`. Łączy się z friction logiem (Planned, s03e05). |
| 3 | Zgoda rozstrzygana przez kod, nie model | Mamy | `dev-guard` 0.4.0 (hooki w `~/.claude/mods/dev-guard`, [agent-setup](../../context/agent-setup.md)) pyta przed `git push` i `gh repo/pr/issue`; away-agent ma policy check w kodzie (`policy.ts`, [s02e05 log](../../work/s02e05/log.md)); Standing choice „każda akcja na zewnątrz = osobne tak” to zgoda kontekstowa (jedno tak na nazwany zestaw pushy w jednym repo). |
| 4 | Pliki jako jedyna pamięć między runami | Mamy | `index.md`, notatki, `log.md` i `work/board.md` to workspace; hook SessionStart (`tools/state.ts`, `.claude/settings.json`) podaje świeżej sesji stan na wejściu — dokładnie „run startuje pusty i czyta, co zapisał poprzedni”. |
| 5 | Checkpointy w trakcie runu | Mamy poza tą bazą / Zrobić nawyk | `~/dev/personal/agent-loop` ma retry/resume i `journal.jsonl` ([own-agent-loop](../topics/own-agent-loop.md)); sesja w tej bazie nie ma checkpointów — nawyk z profilu („zapisz postęp przed końcem”) zrobić regułą: w trakcie Challenge'a `work/<id>/log.md` rośnie na bieżąco, nie na końcu. |
| 6 | Dwa sposoby wybudzenia: zdarzenie i własny alarm | Mamy (częściowo) | Zdarzenia z harnessu (SessionStart, PostToolUse) plus od 2026-11-16 jeden alarm z zewnątrz — `mega-dev-heartbeat` o 08:00. Czego nadal nie ma: alarmu, który agent ustawia **sam sobie** („wróć do tego za tydzień”) i triggera na `inbox/` — najbliższy odpowiednik to prymityw `subscribe/wake` w `agent-loop` ([notatka](../topics/own-agent-loop.md)). |
| 7 | First look: tani model decyduje, czy warto wstawać | Zrobić | Standing choice z 2026-10-29: „opus do wszystkiego, bez routingu”. Kandydat na pierwszy wyjątek: tani model ocenia pozycję z `inbox/` względem Active lane i Planned (odpowiednik `focus.md`) i tylko istotne otwiera sesję. Zmiana Standing choice wymaga zgody człowieka; wiąże się z eksperymentem o efforcie (board). |
| 8 | Efekty z kluczem (outbox, jeden mail na send key) | Zrobić | mail-agent (AgentMail + Worker) i away-agent wysyłają bez klucza idempotencji, więc retry może wysłać dwa razy ([s02e02 log](../../work/s02e02/log.md), [s02e05 log](../../work/s02e05/log.md)). Dodać `send key` per przychodzącą wiadomość i odrzucać duplikaty — razem z planowanym dziennikiem zdarzeń away-agenta (Planned, S02E05). |
| 9 | Escalate: jedno dotknięcie, jedna akcja | Mamy (częściowo) | away-agent ma stronę zgody i ping na telefon, a raporty kończą się „Needed from you”. Dziura: ntfy odpowiada 429 na egress Cloudflare (Planned, S02E05), więc kanał „agent dosięga człowieka” z Workera nie działa. |
| 10 | Record + Verify: ślady, koszty, online evale | Zrobić | Workery (mail-agent, barwy-tools, away-agent, `sched-prod-*`) nie raportują błędów nigdzie — żadnego Langfuse ani nawet czytania `wrangler tail` (board: Planned Langfuse, health check). Minimum: health check z wiersza 1 czyta logi Workerów i dopisuje je do raportu. |
| 11 | Durable Objects / celld / pi-durable jako runtime | Zrobić (nauka) | Skill `durable-objects` jest zainstalowany (lista skilli tej sesji), a Cloudflare jest już naszym hostem — brakuje jednego agenta, który trzyma w jednym obiekcie log, workspace i alarm. Najmniejszy krok: przepisać away-agenta albo health check na DO z alarmem, zamiast nowego Workera bez stanu. Deploy wymaga zgody. |
| 12 | Lab, black-box testing, expectations (Build guide) | Zrobić | Tekst Build guide jest już w bazie ([źródło](../../lessons/s04e01-build-guide.md)). Tu nie ma ani `expectations.md`, ani testera z zewnątrz: skille `lesson-notes` i `release-signals` sprawdza ta sama sesja, która je pisze. Najmniejszy krok bez tmuxa: `expectations.md` (Do / Expect / Never) obok jednego skilla i świeża sesja-tester, która nie czyta `SKILL.md`, tylko wynik. Pełny lab ze sterowaniem panelami wymaga multipleksera — `tmux` i `zellij` nie są zainstalowane (sprawdzone 2026-11-16). Idea zahacza o [s03e04](s03e04-verifying-product-outcomes.md) (agentic lab) i o pozycję „agreement” na boardzie. |
| 13 | Bounded independence: które bariery można już zdjąć | Zrobić (przegląd) | Standing choices rosną od 2026-10-28 i nic z nich nie zniknęło. Przy przeglądzie Planned (Planned, s03e05) dołożyć pytanie: która bariera istnieje tylko dlatego, że model był słabszy? Zmiana wymaga zgody człowieka. |
| 14 | /split: odgałęzienie bez psucia Main | Mamy (częściowo) | Aplikacja Claude Code otwiera sesję poboczną z kopią rozmowy, a CLI ma `--fork-session` z `--resume` — ale tylko całą rozmowę, nie do wybranej wiadomości. Odpowiednik notki: reguła w `CLAUDE.md` „Side sessions don't write `log.md`, `index.md` or `work/board.md`”. Brakuje zdania „nie kontynuuj wcześniejszej pracy” na starcie odgałęzienia. |
| 15 | Agent wspierający (Critic) na małym modelu | Zrobić | Hooki `UserPromptSubmit` i `Stop` dostają ścieżkę transkryptu, a `.claude/settings.json` ma dziś tylko SessionStart i PostToolUse. Critic na Haiku łamie Standing choice „opus do wszystkiego” — wymaga zgody człowieka (ta sama decyzja co wiersz 7). Najpierw expectations, potem agent. |
| 16 | Intuitive: `--help` na każdym narzędziu | Zrobić | `tools/check.ts`, `tools/health.ts` i `tools/state.ts` nie mają `--help` (sprawdzone grepem 2026-11-16); opis jest tylko w `CLAUDE.md`. Dodać `--help` z przykładem i kodami wyjścia. |

## Powiązane

- Poprzednia: [s03e05](s03e05-products-that-learn-after-release.md) (sygnały po
  wydaniu, pętle feedbacku — tam Notice i Escalate pojawiły się pierwszy raz).
- [s03e04](s03e04-verifying-product-outcomes.md) (agentic lab, dowody,
  deterministyczne bramki), [s02e05](s02e05-agent-reliability.md) (guardrails,
  observability, evale), [s02e04](s02e04-multi-agent-collaboration.md)
  (heartbeat, kontrakty, agenci obserwujący agentów),
  [s02e02](s02e02-building-an-agent.md) (prymitywy Event, Schedule, Journal),
  [s02e01](s02e01-agentic-primitives.md) (pętla agenta, recovery),
  [s01e05](s01e05-building-workflows-not-tool-stacks.md) (skille jako
  wykonywalny Markdown, agenci w tle).
- [own-agent-loop](../topics/own-agent-loop.md) (własna pętla: journal, retry/
  resume, `subscribe/wake`), [pi-and-herdr](../topics/pi-and-herdr.md) (Pi i
  utrzymywanie agentów przy życiu — stąd pi-durable),
  [barwy-tools](../topics/barwy-tools.md) (nasz Worker z MCP).
- Setup i praca: [agent-setup](../../context/agent-setup.md),
  [tablica](../../work/board.md), [runner bez nadzoru z S03E03](../../work/s03e03/log.md).
- Challenge tej lekcji: „twenty payouts” — https://hq.mega.dev/challenges/twenty-payouts (rozwiązany 2026-11-16, [log](../../work/s04e01/log.md)).
