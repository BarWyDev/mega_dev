---
title: "s04e03 — Software factory: Staff the Team"
type: lesson
source: lessons/s04e03-software-factory-staff-the-team.md (https://hq.mega.dev/lessons/s04e03/) and lessons/s04e03-build-guide.md (https://hq.mega.dev/lessons/s04e03/build-guide/)
updated: 2026-11-18
trust: high
status: active
tags: [domain-agents, glossaries, memories, scenario-checks, contracts, hooks, small-models, path-hook, codeowners, mcp]
links: [../../lessons/s04e03-software-factory-staff-the-team.md, ../../lessons/s04e03-build-guide.md, s04e02-building-portable-agent-control-planes.md, s04e01-mechanics-behind-autonomous-systems.md, s02e04-multi-agent-collaboration.md, s02e05-agent-reliability.md, s01e03-building-knowledge-systems.md, ../../context/agent-setup.md, ../../work/board.md, ../../work/s04e02/log.md]
---

**Domain agent to mały, szybki, tylko czytający agent, który „posiada” kawałek
kodu (jak wpis w CODEOWNERS) i nosi jego pamięć: pułapki z historii, każda z
odnośnikiem do commita albo issue.** Budzi się sam, gdy Main zagląda do plików
jego domeny, i podaje ostrzeżenie w chwili potrzeby; kod nadal pisze tylko Main.
Obok pamięci leży krótki glosariusz (co słowo znaczy *tutaj*), a najważniejsze
definicje pilnują scenario checks, bo Markdown nie ma kompilatora. Wspólny wzór
całego sezonu: **trigger budzi agenta z jednym jasnym kontraktem**.

Lekcja ma dwie części: wideo Johna Lindquista (sekcje „Domain Agents” i
„Glossaries” poniżej) oraz Build guide „Domain Agents, Glossaries, and Agent
Contracts” — prompty, kształty plików i warunki „Done when” (sekcja „Build
guide”). Tematy kursu: Domain Agents, Glossaries. Projekt przykładowy: RentAPlace.

## Domain Agents

### Gdzie kończą się widgety i roje

- Widgety patrzą na projekt, roje zbierają kontekst do Main
  ([s04e02](s04e02-building-portable-agent-control-planes.md)). Przy projekcie
  solo to może wystarczyć: **jeśli cały projekt z historią mieści się w
  kontekście jednego modelu, dokładanie czegokolwiek to over-architecting**.
- Granica to znowu kontekst: duży kod, długa historia, wiele osób i zmian. Każdy
  moduł kryje stare edge case'y; inżynier, który pamięta, „dlaczego booking
  działa właśnie tak”, odchodzi, a świeży Main „wchodzi naiwnie i pewnie do
  pokoju pełnego pułapek”.

### Czym jest domain agent

- Pomysł z domain-driven design. W odróżnieniu od jednorazowego subagenta
  **posiada część kodu** (jak plik CODEOWNERS na GitHubie) i niesie jej żywą pamięć.
- Często odpowiada pojęciom z glosariusza; tworzony osobno dla każdego projektu.
- **Main nadal pisze kod.** Domain agenci doradzają, robią review, rosną — a z
  czasem mogą pomagać klientom.
- Przykład: agenci Booking i Pricing w RentAPlace.

### Zasiew (seed)

- Punkt wyjścia: `AGENTS.md` z całą pamięcią i regułami **się starzeje, a agenci
  i tak pomijają najważniejsze części**. Zapomnianą historię zamieniamy w
  aktywnego eksperta.
- Przykład: ticket „zamknięty dom nadal da się zarezerwować”. Oczywista poprawka
  to jednolinijkowy check na górze funkcji bookingu — a ona **po cichu psuje
  retry i zwroty dla gości**.
- Folder `agents/booking`: ścieżki (globy) plików bookingu i ich testów, jak w
  CODEOWNERS. Agent działa na **małym, szybkim modelu, read-only**, jako „booking brain”.

### Zbieranie historii

- Pamięci nie pisze się od zera: rój albo Main przeszukuje **git blame, zamknięte
  issues, pull requesty i dawne rozmowy** pod kątem pułapek danej domeny.
- Krytyczne: **każda pamięć z zasiewu cytuje commit albo issue**, na którym
  zespół nauczył się tego na własnej skórze.
- `memories.md` ma dwie czyste sekcje: **wewnętrzną inżynierską** (gdzie są
  pułapki) i **customer-facing** (reguły i polityki, które już sprawiały
  kłopoty) — druga przyda się, gdy agent zacznie rozmawiać z klientami.

### Budzi się, gdy Main patrzy

- Prawie każdy harness umie wykryć dotknięcie pliku przez agenta (hook na read
  albo edit). Gdy Main zagląda do plików pasujących do globów domeny, domain
  agent **sam podaje streszczenie możliwych problemów**, łącząc kontekst
  rozmowy Main ze swoimi pamięciami.
- W przykładzie: Main dotyka modułu booking → agent od razu zgłasza pułapkę z
  retry i każe sprawdzić replaye oraz odrzucanie zamkniętych domów.
- Main zostaje przy zadaniu, jest jedynym piszącym i dalej może uruchamiać
  subagentów; krytyczne pamięci „sączą się” do kontekstu dopiero przy wejściu w domenę.

### Lab

- W labie ([s04e01](s04e01-mechanics-behind-autonomous-systems.md)) stoi
  zamrożony zestaw testów bookingu (retry, zwroty, zamknięte domy — wszystko
  przechodzi). Domain agent dostaje **z zewnątrz** naiwną łatkę „na górze
  funkcji” i ma ostrzec agenta labu na podstawie pamięci.

### Dwie domeny naraz

- Zadanie przecinające domeny mnoży ryzyko przeoczenia. Rozwiązanie: wiele
  „mózgów”, jedna rozmowa Main.
- Przykład: „dodaj dopłatę świąteczną z 24-godzinnymi holdami i ciasnym oknem
  zwrotu przy anulowaniu”. **Zanim Main zmieni choć linię**, konsultuje Pricing
  i Booking równolegle, na małych modelach: Pricing sprawdza, jak działają
  dopłaty, Booking — co się dzieje z aktywnymi holdami.
- Wychodzi **kolizja, której żaden z nich sam by nie zobaczył**: czy aktywny
  24-godzinny hold zachowuje pierwotną cenę, czy gość płaci nową dopłatę przy checkout?
- Rysunek: Main („The only writer”) → „consults before editing” → Domain Agents
  („Small, fast models, read-only, in parallel”) → „what each one knows” wraca do
  Main; my („Know the product”) rozstrzygamy kolizję („our call”).

### Decyzja produktowa, nie zgadywanie

- Taka kolizja to **decyzja produktowa, którą chcemy zobaczyć w Main**, a nie
  zgadywanka agenta w tle. Odpowiedź z lekcji: aktywne holdy blokują pierwotnie
  wycenione centy („lock their original quoted cents”). Potem Main pisze pricing
  i booking spójnie w jednym kontekście.
- Przed zaufaniem — sprawdzić z zewnątrz: Pricing i Booking w świeżych sesjach
  labu read-only, na zamockowanych scenariuszach; mają zwrócić te same „footguny”.

### Czyste pamięci, małe modele

- Pamięci domain agentów **aktualizuje Main**. Nie wklejać surowych transkryptów
  ani wielkich logów.
- Każda pamięć ma odnośnik: commit, numer issue, zgłoszenie użytkownika,
  **w ostateczności timestamp** — „paragony” z projektu, dzięki którym
  przestarzałe wpisy da się łatwo wyczyścić.
- Małe, szybkie modele wystarczają, bo zadanie jest wąskie i nie wymaga decyzji.
  Budzi je event albo hook; w inżynierii wewnętrznej eventem jest spojrzenie Main
  na plik domeny, ale triggerów może być więcej.

## Glossaries

- Po zacommitowaniu folderów agentów (współdzieli je zespół) wychodzą dwa
  problemy: **stos pamięci to nie model domeny** i **Markdown nie ma kompilatora**.
- Ekspert wie, co słowa znaczą w jego domenie. Krótki glosariusz obok pamięci:
  **pamięci trzymają „dlaczego”, glosariusz — „co to słowo znaczy tutaj”**.
  Przykład: *hold* — trzyma noce **i** blokuje cenę, którą gość dostał w wycenie.
- Ma być krótki, żeby się nie zestarzał jak duży `AGENTS.md`.
- Testy jednostkowe dalej pilnują kodu i **check agenta nigdy ich nie zastępuje**.
  Ale żaden test nie padnie, gdy ktoś „uporządkuje” definicję i hold po cichu
  stanie się czymś, co tylko rezerwuje daty. Nic się nie psuje od razu — dopiero
  następna funkcja zbudowana na złym znaczeniu.

### Scenario checks

- Dla słów, które naprawdę się liczą: **zwykłe pytanie i to, czego oczekujemy w
  odpowiedzi** — ta sama idea co expectations w labie. Pytać o samo słowo:
  „co hold zachowuje dla gościa?”.
- Puszczać na domain agencie, na jego małym modelu, **więcej niż raz**.
- Foldery agentów pilnowane jak kod: zmiany przeglądają właściciele domeny, a
  scenario checks biegną **tylko gdy te pliki się zmieniają**, więc pozostałe
  pull requesty zostają szybkie.
- Rozwodniona definicja zostaje złapana przed merge'em. Nowa lekcja zespołu
  wchodzi **razem ze scenariuszem, który ją dowodzi**.

### Pull, push i kontrakty

- Na początku pomoc była **pull** (split, wybór issue — gdy chcieliśmy
  kontekstu). Critic i widgety już patrzyły same. Z domain agentami wiedza
  przechodzi na **push**: Main patrzy na plik, właściwy ekspert budzi się nieproszony.
- Role: **Main** — zadanie i kod; **agenci wspierający** (Critic) — patrzą i się
  odzywają; **widgety** — patrzą na projekt i wysyłają pracę; **rój** — rozchodzi
  się i przynosi tylko to, co ważne; **domain agent** — pilnuje jednej części kodu.
- To jest **kontrakt: co wchodzi, co wraca i czego nigdy nie dotyka**. Nikt nie
  edytuje za plecami Main.

### Hooki, CLI, HTTP, MCP: tylko przewody

- Hooki, CLI, HTTP i MCP to „tylko przewody”. Stos surowych narzędzi wpięty
  prosto w Main zapełnia kontekst przed startem pracy. **Agent z jasnym
  kontraktem za przewodem** trzyma szum u siebie, a Main zostaje szczupły —
  niezależnie od przewodu.
- Dziś wszystko dzieje się przy klawiaturze, ale wzór „trigger budzi agenta z
  jednym kontraktem” nas nie wymaga — i odbije się „przy drzwiach”, gdy do
  produktu przyjdą cudzy agenci.

## Build guide: prompty, pliki i sprawdziany

Zakłada lab i `/agent` z [s04e01](s04e01-mechanics-behind-autonomous-systems.md)
oraz wywołanie modelu bez rozmowy z [s04e02](s04e02-building-portable-agent-control-planes.md).
Każdy build opisany zdolnością, której potrzebuje; Pi i Herdr to jeden przykład.
Poniżej tylko to, czego nie ma w części pierwszej.

### Bus factor

- Ryzyko „jeden inżynier pamięta” ma nazwę: **bus factor**. Świeża rozmowa
  główna ma ten problem przy każdym starcie.
- Throwaway agent vs Domain Agent: żyje **na jedną odpowiedź** / **w repo jako
  folder**; nie posiada niczego / posiada część kodu; nic nie pamięta / pamięta
  z odnośnikami; **kodu nie pisze żaden z nich** — pisze Main.
- Badanie „Evaluating AGENTS.md” (arxiv 2602.11988): takie pliki generalnie nie
  poprawiały skuteczności zadań, a podnosiły koszt **o ponad 20% średnio**;
  przeglądy struktury repo okazały się w szczególności bezużyteczne.

### Folder agenta

- `agents/<area>/agent.md`: na górze `owns:` (globy źródeł i testów), `model:`
  (mały, szybki), `access: read-only`; pod `## Job` — ekspert od tych ścieżek,
  czyta `memories.md` na starcie każdego runu, odpowiada i robi review z pamięci,
  **podaje odnośnik do każdego twierdzenia, mówi „nothing relevant”, gdy nic nie
  ma, nigdy nie edytuje plików**.
- Linie na górze czytają **nasze** komendy i hooki. Harness, który trzyma
  definicje agentów gdzie indziej (Claude Code i jego subagenci), nie musi ich
  rozumieć: `agents/` zostaje źródłem, a tekst spod Job idzie do runu jako instrukcje.
- Potrzebne: `/agent` albo run headless (`claude -p`, `codex exec`) z wybranym
  modelem i bez prawa zapisu.

### Zasiew pamięci

- Cztery źródła: git blame i git log dla posiadanych plików, zamknięte issues,
  zmergowane PR-y z komentarzami review (`gh`), dawne rozmowy w harnessie.
  Jeden subagent na źródło, równolegle.
- `memories.md`: `## Internal engineering` i `## Customer facing`. Pamięć to
  **jedna reguła w jednym–dwóch zdaniach + odnośnik**; pochodząca tylko z rozmowy
  dostaje „from a conversation” z datą; **czego nie da się zacytować, odpada**;
  źródło bez wyników jest wymienione na końcu pliku.
- Tylko sekcję customer-facing „bezpiecznie powiedzieć na głos”.
- Done when: każda pamięć ma odnośnik, który da się otworzyć (albo znacznik
  rozmowy), obie sekcje istnieją, a ponowne przeczytanie 2–3 odnośników
  pokazuje, że pamięć mówi to, co commit lub issue, **i nic więcej**.

### Path hook

- Filar „Intuitive”: **nikt nie powinien pamiętać, żeby zapytać Booking**.
- Potrzebne: hook plikowy, który uruchamia nasz kod przed odczytem/edycją i
  **może dodać tekst do rozmowy** (`PreToolUse` w Claude Code i Codex, event
  `tool_call` w rozszerzeniu Pi) oraz wywołanie modelu bez rozmowy.
- Sześć wymagań z promptu: (1) porównać ścieżkę z `owns:` w każdym
  `agents/*/agent.md`, także ścieżki w komendach shella, i powiedzieć, czego
  hook nie widzi; (2) przy trafieniu uruchomić agenta raz, headless, read-only,
  z Job, `memories.md`, ścieżką i ostatnim promptem Main — brief **najwyżej
  pięć linii**, każda z odnośnikiem, albo „nothing relevant”; (3) dodać brief
  jako kontekst, **nie blokować** odczytu ani edycji; (4) **raz na agenta na
  rozmowę**, ponownie tylko przy zmianie zadania albo na prośbę (mały zapis per
  rozmowa + komenda na żądanie); (5) nowy folder w `agents/` działa bez zmiany
  hooka; (6) konfiguracja hooka w projekcie, żeby zespół dostał ją z repo.
- Gdy czegoś brak: bez hooka — jedna linia w `AGENTS.md` (słabsze, bo zależy od
  posłuszeństwa Main); hook nie umie dodać tekstu — zapisuje brief do pliku i
  wypisuje ścieżkę; bez runu headless — agent w panelu przez `/agent`.
- `agents/booking/expectations.md` (Do / Expect / Never): **ostrzega przed
  naiwną poprawką** (nazywa pułapkę i odnośnik; nigdy nie zatwierdza bez
  wzmianki) i **mówi, gdy nic nie ma** (nigdy nie wymyśla pułapki ani odnośnika).
- Done when: `/lab test booking` przechodzi oba oczekiwania **dwa razy z
  rzędu**; hook sprawdzany osobno w codziennym workspace — pierwszy odczyt
  posiadanego pliku wkłada brief z odnośnikami do Main bez pytania.

### Dwie domeny

- Kusząca odpowiedź — dwóch agentów piszących równolegle, po jednym na moduł —
  kończy się tak, jak opisuje esej Cognition „Don't Build Multi-Agents”: każdy
  piszący robi założenia, których drugi nie widzi. Stąd **wiele mózgów, jeden piszący**.
- Path hook odpala się dopiero przy dotknięciu pliku, więc przy zadaniu, o
  którym wiemy, że przecina domeny, konsultację zamawia się **w prompcie
  zadania**: wypisz agentów, zapytaj równolegle i read-only o kolizje z pamięcią
  i glosariuszem, pokaż odpowiedzi obok siebie, nazwij każdą niezgodność i
  wymuszoną decyzję produktową, **czekaj; nie wybieraj za mnie**; potem pisz sam.
- Gdy Main rozstrzyga kolizję sam: linia w `AGENTS.md` „a collision between two
  Domain Agents is always my decision”.
- Sprawdzian z zewnątrz: na agenta **trzy scenariusze**, w których wiarygodna
  zmiana trafia w jego pamięć, i **jeden**, który niczego nie dotyka. Done when:
  nazywa pułapkę w trzech, milczy w czwartym, testy obu obszarów przechodzą.
- Po decyzji Main dopisuje ją do `memories.md` każdego agenta, którego dotyczy:
  jedna reguła, **dzisiejsza data i paragon** (commit, issue, zgłoszenie albo
  „decided in conversation”), bez wklejania rozmowy.
- Sprzątanie co jakiś czas: otworzyć paragon każdej pamięci, wypisać te, których
  paragon nie istnieje, kod usunięto albo które sobie przeczą — **niczego nie
  usuwać, pokazać listę i czekać**.

### Glosariusz i scenario checks

- Tło: Bounded Context i Ubiquitous Language (Fowler). `agents/<area>/glossary.md`:
  **kilka** terminów o szczególnym znaczeniu w obszarze, jedno–dwa zdania,
  **łącznie z tym, co termin gwarantuje**; terminy z kodu, testów i pamięci;
  o termin używany na dwa sposoby agent pyta nas. Reguły lintu, styl i opis
  folderów nie należą ani do glosariusza, ani do pamięci — tylko do kodu i narzędzi.
- `agents/<area>/scenarios.md` (Specification by Example): Ask / Expect / Never.
  Przykład: ceny rosną z $140 do $190 za noc przy aktywnym 24-godzinnym holdzie
  na $140 → Expect: $140 do wygaśnięcia holdu; Never: $190 na aktywnym holdzie.
- Komenda scenario check: świeża sesja read-only na małym modelu zadaje każde
  Ask, **drugi model ocenia** odpowiedź względem Expect i Never i ją cytuje;
  pass/fail na scenariusz, kod błędu przy porażce (do CI); najpierw w labie.
- Dwa strażniki w Gicie: linia w `.github/CODEOWNERS`
  (`/agents/booking/ @our-org/booking-owners`) i workflow
  `.github/workflows/domain-agents.yml` z filtrem `paths: "agents/**"` — zwykłe
  PR-y nie czekają na model. Bez klucza modelu w CI: **hook pre-push**, który
  puszcza check, gdy zmieniły się pliki w `agents/`.
- Done when: usunięcie na gałęzi reguły, od której zależy scenariusz, wywala
  check, przywrócenie go zazielenia; PR z samym kodem checku nie uruchamia.
- Reguła z S04E01 bez zmian: celowa zmiana zachowania = aktualizacja glosariusza
  **i** nowy scenariusz razem. **Nigdy nie usuwamy scenariusza, żeby check przeszedł.**

### Cztery kontrakty i audyt narzędzi

| Agent | Posiada | Oddaje | Budzi się |
| --- | --- | --- | --- |
| Main | zadanie i edycje kodu | jeden wątek decyzji | gdy go promptujemy |
| Wspierający (Critic, Notes) | nasze prompty na żywo | krótkie ustalenia, które sami wysyłamy | gdy Main dostaje prompt albo odpowiada |
| Zbieracze | sygnały z zewnątrz i historię | brief ze źródłami | gdy wysyłamy issue |
| Domain Agents | glosariusz i pamięci jednego obszaru | reguły obowiązujące przed edycją | gdy Main dotyka pliku obszaru |

- Przewody: liczy się to, co nimi płynie. **Dwadzieścia surowych narzędzi bazy**
  w Main = każda definicja siedzi w kontekście, a wnętrzności systemu przeciekają
  do każdej rozmowy (Anthropic, „Code execution with MCP”). Wąski kontrakt —
  jedno pytanie do agenta Booking — trzyma Main szczupłym na każdym przewodzie.
- Ćwiczenie: audyt tego, co ładuje harness przy starcie w projekcie (narzędzia,
  pluginy, rozszerzenia, serwery MCP) z szacunkiem kontekstu i oznaczeniem, co
  jest zgadywaniem; **trzy największe**; dla wybranego jedna wąska zamiana
  (jedna komenda z `--help` albo jedno pytanie do Domain Agenta). Bez zmian na razie.
- „Przy drzwiach produktu”: ten sam wzór, ale agent domeny oddaje **tylko część
  customer-facing**.

## Na co uważać

1. Domain agenci w projekcie, który mieści się w jednym kontekście.
   To over-architecting; najpierw sprawdzić, czy Main naprawdę coś gubi.
2. Pamięć bez „paragonu”.
   Każdy wpis z commitem, issue, zgłoszeniem albo przynajmniej datą — inaczej nie da się go potem zweryfikować ani usunąć.
3. Surowe transkrypty i logi wklejane do pamięci.
   Jedna czysta linia na lekcję; pamięci aktualizuje Main, nie automat.
4. Wszystko w jednym `AGENTS.md` / `CLAUDE.md`.
   Starzeje się i jest pomijane; wiedzę domenową trzymać przy domenie i podawać w chwili potrzeby.
5. Domain agent, który pisze do plików.
   Read-only; jedynym piszącym jest Main.
6. Oczywista jednolinijkowa poprawka w starym module.
   Zanim wejdzie, zapytać historię (retry, zwroty) — po to jest agent domeny.
7. Agent w tle rozstrzyga kolizję między domenami.
   Kolizja trafia do Main i do nas jako decyzja produktowa.
8. Zaufanie do domain agenta bez próby z zewnątrz.
   Świeża sesja labu, zamockowany scenariusz, oczekiwany „footgun” w odpowiedzi.
9. Glosariusz, który puchnie.
   Krótki, tylko słowa, na których coś się buduje.
10. Definicja „uporządkowana” bez niczyjej wiedzy.
    Scenario check na słowo + review właściciela domeny przy zmianie folderu.
11. Scenario check puszczony raz.
    Mały model bywa niestabilny — kilka przebiegów ([s02e05](s02e05-agent-reliability.md), pass^k).
12. Scenario checks zamiast testów jednostkowych albo przy każdym PR.
    Testy zostają; checki biegną tylko przy zmianie plików agenta.
13. Surowe narzędzia MCP wpięte prosto w Main.
    Za przewodem postawić agenta z kontraktem; do Main wraca tylko wynik.
14. Dwóch agentów piszących równolegle, po jednym na moduł.
    Każdy robi założenia niewidoczne dla drugiego; konsultować wielu, pisać w jednym kontekście.
15. Pamięć mówiąca więcej niż jej paragon.
    Przy zasiewie przeczytać ponownie 2–3 odnośniki; czego nie da się zacytować, nie wpisywać.
16. Domain agent, który wymyśla pułapkę albo odnośnik, żeby coś powiedzieć.
    „Nothing relevant” to poprawna odpowiedź i osobne oczekiwanie w labie.
17. Hook, który blokuje pracę albo odzywa się przy każdym pliku.
    Brief do pięciu linii, raz na agenta na rozmowę, bez blokowania odczytu i edycji.
18. Hook nie widzi plików czytanych przez komendy shella.
    Dopasowywać też ścieżki w komendach i wiedzieć, czego hook nie zobaczy.
19. Usunięcie scenariusza albo pamięci, żeby było zielono lub czysto.
    Scenariuszy nie usuwamy; przy sprzątaniu pamięci agent pokazuje listę i czeka.
20. Opis struktury repo i reguły lintu w glosariuszu lub pamięci.
    Tam nie pomagają (badanie AGENTS.md: koszt +20%); trzymać je w kodzie i narzędziach.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Nie budować, póki projekt mieści się w kontekście | Mamy (świadomie) | Ta baza to 69 plików i jeden piszący; `index.md` jest routingiem. Pełnych domain agentów tu nie budujemy — tylko ich tanie części (wiersze 3, 5, 6). |
| 2 | Domain agent: folder, globy, read-only, mały model | Zrobić (w Challenge'u) | `.claude/agents/` nie istnieje ani w projekcie, ani w `~/.claude` (sprawdzone 2026-11-18). Naturalne miejsce to Host Desk (`work/s04e01/repo/host-desk/`: `roles/`, `why/`, `factory/CHECKLIST.md`) — Challenge „Three small changes”. Mały model łamie Standing choice „opus do wszystkiego” — decyzja człowieka. |
| 3 | Pamięci z paragonem | Mamy (częściowo) | `log.md` ma daty, lesson notes mają `source:`, Host Desk ma `why/` (`nights.md`, `payout-date.md`, `payout-rounding.md`). Pamięć projektu (`MEMORY.md`, 1 wpis) nie ma daty ani źródła. Zrobić: w regule pamięci dopisywać datę i sesję do każdego wpisu. |
| 4 | Zasiew z historii | Zrobić | Jednorazowy zbiór pułapek tej bazy z `log.md` i `work/*/log.md` (np. urllib 403 na hq.mega.dev, dev-guard blokujący push na `main`, `check.ts` i linki w blokach kodu) — to zarazem zasiew `work/friction.md` z pozycji Planned (S03E05). Każda linia z datą wpisu w logu. |
| 5 | Budzenie na dotknięcie pliku (push) | Mamy (częściowo) / Zrobić | `.claude/settings.json` ma hook PostToolUse na `Write\|Edit` (uruchamia `check.ts`) i SessionStart (`state.ts`). Nie ma hooka na **Read** ani żadnego, który podaje pamięć pasującą do ścieżki. Eksperyment bez modelu: hook PreToolUse na `Read\|Edit` dla `tools/**` wypisuje 3–5 linii pułapek z pliku obok. Gotowe, gdy otwarcie `tools/check.ts` w świeżej sesji pokazuje te linie bez pytania. |
| 6 | Glosariusz obok pamięci | Zrobić | Żadnego glosariusza w bazie (grep 2026-11-18). Krótki `context/glossary.md`: słowa, które tu znaczą coś konkretnego (Standing choice, Planned/Active/Done, source vs lesson note, heartbeat, „red”, side session, receipt). Najwyżej ~15 haseł, po jednej linii. |
| 7 | Scenario checks na definicje | Zrobić | Po wierszu 6: 3 pytania z oczekiwaną odpowiedzią (np. „kto może zmienić Standing choice?”, „kiedy heartbeat pisze do człowieka?”) zadawane świeżej sesji, która czyta tylko glosariusz i `CLAUDE.md`. Łączy się z „first black-box expectations” (Planned, S04E01). |
| 8 | Check tylko przy zmianie pilnowanych plików | Mamy (wzór) | Hook PostToolUse odpala `check.ts` tylko dla `*.md` w projekcie — ten sam pomysł, tylko mechaniczny. Scenario checks podpiąć tak samo: tylko przy zmianie `CLAUDE.md` lub glosariusza. |
| 9 | Kontrakt: co wchodzi, co wraca, czego nie dotyka | Mamy (częściowo) | `CLAUDE.md`: sesje poboczne nie piszą do `log.md`, `index.md`, `work/board.md` i zwracają linie do dopisania; heartbeat „reports and fixes nothing”. Brakuje kontraktu zapisanego przy samym agencie — przyjdzie z `source-reader` (Planned, S02E04). |
| 10 | Main jedynym piszącym | Mamy | Reguły „The agent owns the structure” i „The human writes only to `inbox/`” w `CLAUDE.md`. |
| 11 | Kolizja = decyzja człowieka | Mamy | Standing choices zmienia tylko człowiek ([tablica](../../work/board.md)); w S04E02 zaparkowane zadanie rozstrzygnął człowiek ([log](../../work/s04e02/log.md)). |
| 12 | Agent z kontraktem za przewodem zamiast surowych narzędzi | Zrobić (przegląd) | Ta sesja ma kilkadziesiąt skilli Cloudflare/Supabase i trzy serwery MCP czekające na autoryzację, mimo że baza ich nie używa. Sprawdzić, co da się wyłączyć dla tego projektu (ustawienia projektu); zmiana globalna wymaga zgody. |
| 13 | Build guide | Mamy | Zapisany 2026-11-18 jako [lessons/s04e03-build-guide.md](../../lessons/s04e03-build-guide.md); treść zgodna z oryginałem co do bajta (sha256 porównany w przeglądarce). |
| 14 | Hook plikowy, który dodaje tekst do rozmowy | Mamy (zdolność) | Claude Code ma `PreToolUse`; nasz PostToolUse w `.claude/settings.json` już zwraca tekst agentowi (błędy `check.ts`). Wiersz 5 używa tej samej drogi, bez modelu. Wersja z modelem wymaga `claude -p` na małym modelu — Standing choice. |
| 15 | Audyt tego, co ładuje się przy starcie | Zrobić | Uściśla wiersz 12: lista skilli, pluginów i serwerów MCP tej sesji z szacunkiem kontekstu, trzy największe, jedna propozycja zamiany. Bez zmian, tylko raport. |
| 16 | „Kolizja to zawsze moja decyzja” jako linia w instrukcjach | Mamy (częściowo) | Standing choices mówią, kto zmienia decyzje, ale `CLAUDE.md` nie ma linii „gdy dwie reguły albo notatki sobie przeczą, pokaż obie i czekaj”. Dopisać jedną linię do Rules. |
| 17 | Sprzątanie pamięci po paragonach | Mamy (częściowo) | `tools/check.ts` łapie zepsute linki i `updated` starsze niż 30 dni; nie sprawdza, czy źródło notatki nadal mówi to samo. Zostaje w „weekly health check” (część oceniająca). |
| 18 | Strażnik w Gicie tylko dla zmienionych ścieżek, pre-push zamiast CI | Zrobić (po wierszu 7) | Scenario checks z wiersza 7 podpiąć jako hook pre-push, który rusza tylko przy zmianie `CLAUDE.md` lub `context/glossary.md`. Workflow GitHub Actions z kluczem modelu wymagałby zgody (sekret, push). |

## Powiązane

- Poprzednie: [s04e02](s04e02-building-portable-agent-control-planes.md)
  (widgety, zbieracze, „każda linia ze źródłem”, wiedza wypychana w chwili
  potrzeby), [s04e01](s04e01-mechanics-behind-autonomous-systems.md) (lab,
  expectations, Critic, `/split`).
- [s02e04](s02e04-multi-agent-collaboration.md) (subagenci, kontrakty),
  [s02e05](s02e05-agent-reliability.md) (evale, pass^k),
  [s01e03](s01e03-building-knowledge-systems.md) (pamięć i jej starzenie się).
- Teksty źródłowe: [część 1](../../lessons/s04e03-software-factory-staff-the-team.md), [Build guide](../../lessons/s04e03-build-guide.md).
- Setup i praca: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
- Challenge tej lekcji: „Three small changes” — https://hq.mega.dev/challenges/three-small-changes (nierozwiązany, stan na 2026-11-18).
