---
title: "s03e02 — Translating Intent into Agent Work"
type: lesson
source: lessons/s03e02-translating-intent-into-agent-work.md (https://hq.mega.dev/lessons/s03e02/)
updated: 2026-11-10
trust: high
status: active
tags: [intent, principles, context, adr, requirements, decomposition, evaluation, labs]
links: [../../lessons/s03e02-translating-intent-into-agent-work.md, s03e01-mechanics-behind-product-engineering.md, s02e05-agent-reliability.md, s02e03-agentic-capabilities.md, s01e05-building-workflows-not-tool-stacks.md, s01e03-building-knowledge-systems.md, s01e01-mechanics-behind-generative-ai.md, ../../context/agent-setup.md, ../../work/board.md]
---

Jeśli agent jest w czymś lepszy od nas, nie mówimy mu **jak** coś zrobić, tylko
**czego potrzebujemy, jakimi zasadami (nie regułami) ma się kierować i jak
udowodni, że wynik jest z nimi zgodny**. Zamiast szczegółowej specyfikacji —
**umowa**: zakres, wynik, granice i dowód. Do tego kontekst spoza kodu (decyzje,
kierunek produktu) i ewaluacja, która nie wymaga od nas czytania każdej zmiany.

Surowy tekst: [lessons/s03e02-translating-intent-into-agent-work.md](../../lessons/s03e02-translating-intent-into-agent-work.md).

## Opisywanie intencji

- Dane autora z dwóch miesięcy (rys. 1): 4.5k jego wiadomości (10%), ok. 13.5k
  odpowiedzi agentów (30%), ok. 27k wiadomości między agentami (60%). Wiadomość
  pisana: ok. 7 słów, dyktowana: ok. 150. Agenci pracowali od 3 do prawie 40 h.
- Praca człowieka to głównie **opisywanie intencji** i **feedback**, rzadko
  dokładne instrukcje.
- **Zasada zamiast reguły** (rys. 2): reguła trzyma agenta w wąskim pasie i może
  minąć cel; zasada wyznacza granicę, w której model sam znajduje drogę.
  Przykłady: „max 100 słów” → „szanuj uwagę czytelnika”; „nigdy nie usuwaj
  plików” → „dopasuj ostrożność do kosztu pomyłki”; „używaj punktorów” →
  „niech treść zdecyduje o formie”.
- **Powód** obok zasady daje szerszy obraz i pozwala agentowi zrozumieć
  **dynamiczne granice**. Przykład (rys. 3): zasada „dziel się informacją tylko z
  tymi, których dotyczy”, powód „ludzie mówią agentowi rzeczy, bo ufają, że
  trafią we właściwe miejsce”. Wynik: DM — pełny kontekst (wizyta u lekarza),
  kanał zespołu — sam fakt, kanał z gośćmi — tylko to, czego goście potrzebują.
  Agent sam rozpozna gości, choć nikt tego nie przewidział.

## Kontekst produktu

- Z kodu agent zna tylko **obecny stan** produktu, nie kierunek, bieżącą pracę
  zespołu ani decyzje biznesowe.
- **ADR w folderze `decisions/`** (repo Kenta, rys. 4): jednakowe rekordy —
  numer, tytuł, status, data, kontekst, decyzja, konsekwencje, opcjonalnie
  datowane kryterium wyjścia. Pisane przez agentów z rozmów z właścicielem;
  następny agent czyta je przed kodowaniem; nowy rekord zastępuje stary.
- Matt Pocock: ADR + skill `/grill-with-docs`; bez ADR agenci zmieniają albo
  usuwają funkcje zrobione z intencją, której nie widać w kodzie.
- Lauren Tan (2,500+ PR miesięcznie): ADR rozpraszają jej agentów; zamiast
  archiwum decyzji — **zasady** zamienione w trwałe wskazówki: skille, typy,
  projekt środowiska, samoweryfikacja.
- Joel Hooks: Effect Schemas + mocne DDD — sam kod opisuje kształt produktu;
  stack „CAFE” (Cloudflare, Alchemy, Foldkit, Effect).
- Wspólny wzorzec: więcej **autonomii** — mniej pytań i lepsze decyzje.

## Wymagania i dekompozycja

- Wymagania przychodzą od biznesu i klientów; przełożenie ich na zakres pracy
  agentów to nasza odpowiedzialność, której nie da się oddać AI.
- Zamiast szczegółowej specyfikacji — **umowa: scope, outcome, boundaries,
  proof**. Najpierw zebrać jak najwięcej materiałów — nie żeby je czytać, tylko
  żeby agent miał kontekst. Jednorazowe interaktywne dokumenty i mini-aplikacje
  pomagają zobaczyć: co mamy, czego chcemy, czy umowa to oddaje.
- Formy:
  - **Wizualizacje** — od Opus 5.5 modele świetnie pokazują kontekst wizualnie;
    skill Anatomy, `/show-me` od HumanLayer do „wizualnych rozmów” (rys. 5:
    „co mamy / czego chcemy / czy umowa pasuje”, zasada: najmniejszy widok,
    który wyjaśnia sprawę).
  - **Porównania side-by-side** — „teraz” vs „proponowane”: logika back-endu,
    zrzuty ekranu, komponenty z design systemu (rys. 6: odrzucony klucz API).
  - **Grafy i diagramy warstwowe** — przełączanie między ogółem a szczegółem;
    HTML trzyma stan (bieżący fokus), który agent może odczytać (rys. 7).
    Framework grafu najlepiej projektuje flota agentów, iterować kilka razy.
  - **Lab** — jeden plik HTML, osobna aplikacja albo moduł `/lab`; pozwala
    doświadczyć wyniku, iteracje w sekundy, może mieć wbudowanych agentów i
    zapisywać artefakty (`runs/0014.json`, transcript, screenshot), które czyta
    agent kodujący (rys. 8).
- Cel narzędzi: martwe pola, przypadki brzegowe, efekty drugiego rzędu, ukryte
  okazje — myślenie systemowe zamiast funkcji w izolacji.
- Wynik to nie jeden plan, tylko **zestaw zadań**, które agent rozdzieli innym.
- Techniki sterowania (z S01E01: self-querying, meta-pytania, tree of thoughts):
  - **Oczywiste pytania** — zapytać o to, co już wiemy, żeby trafiło do wątku;
    potem lista modułów/funkcji i subagenci na każdy.
  - **Parafraza** — podyktować wszystko, co wiemy; agent przeformułowuje i
    wzbogaca o dostępny kontekst.
  - **Rozdziel i scal** — szeroka eksploracja, scalenie, powtórzyć kilka razy.
  - **Modele myślowe** — brzytwa Ockhama, first principles, second-order
    thinking, inwersja.
- Gdy proces się ułoży i wyjdą z niego zasady — agenci mogą grać sami ze sobą.

## Ewaluacja

- Umowa bez sposobu udowodnienia wyniku (bez oszukiwania i bez przeglądania
  każdej zmiany przez nas) nic nie znaczy. Zaufanie = zdefiniowany dowód +
  narzędzia, by agent go dostarczył.
- Do rozważenia:
  - **Możliwości modeli** — kod, narzędzia, wzorce w danych multimodalnych;
    dowody jako logi, pomiary, zrzuty, wideo.
  - **Ograniczenia** — szczegóły, wiele zmiennych naraz, spójność, wszystko
    poza kontekstem.
  - **Zasoby** — koszt, czas, sprzęt; weryfikować tylko to, co ważne.
  - **Narzędzia, które mamy** — lintery, type checkery, kompilatory, testy,
    środowisko dev, konta testowe, maszyny.
  - **Narzędzia, których potrzebujemy** — najpierw je zbudować (agentcomputer,
    browserbase).
  - **Metryki** — LLM na zrzutach ekranu nie widzi detali, pomiary UI w kodzie;
    przy bazie danych historia mutacji rekordów.
  - **Definicja sukcesu** — inaczej agent idzie za daleko albo nie dość daleko
    (feature flagi, backfille, zabezpieczenia budowane domyślnie, choć zbędne).
  - **Definicja porażki** — kiedy dobre jakościowo dowody i tak znaczą „fail”;
    zależy od kontekstu, trudno zgadnąć.
- Wyciągać z tego **ogólne narzędzia i skille** do ponownego użycia; wszystko,
  co da się sprawdzić deterministycznie, sprawdzać kodem.

## Wnioski

Przekładanie intencji to rozszerzanie narzędzi agenta, jego „rozumienia” i
środowiska, z użyciem wiedzy samego modelu. Trzeba przy tym pilnować tempa,
jakości, skali, postępu i własnej energii.

## Na co uważać

1. Reguła zbyt wąska na dynamiczne środowisko — agent trzyma się litery i mija cel.
   → Pisać zasadę z powodem; regułę zostawić tylko na to, co sprawdza kod.
2. Kod pokazuje tylko obecny stan — agent usuwa funkcje, których intencji nie widać (Pocock).
   → Decyzje z powodem zapisać tam, gdzie agent je przeczyta przed zmianą.
3. Rosnące archiwum decyzji rozprasza agenta (Tan).
   → Decyzja, która się utrwaliła, przechodzi w zasadę, skill, typ lub check; stary rekord do archiwum.
4. Brak definicji sukcesu — agent dobudowuje rzeczy zbędne (flagi, backfille) albo kończy za wcześnie.
   → Każde zadanie z „gotowe gdy” i „porażka gdy”.
5. LLM oceniający zrzuty ekranu nie widzi detali.
   → Mierzyć w kodzie; zrzut tylko jako dodatkowy dowód.
6. Weryfikacja wszystkiego kosztuje czas i pieniądze.
   → Wybrać, co naprawdę ważne; deterministyczne rzeczy sprawdzać skryptem.
7. Odpowiedzialności za zakres nie da się oddać agentowi.
   → Umowę (scope, outcome, boundaries, proof) zatwierdza człowiek przed startem.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Zasady z powodem zamiast reguł | Mamy (częściowo) | Reguły w `CLAUDE.md` mają „because …” (2026-11-09). Standing choices na [tablicy](../../work/board.md) nie mają powodów — dopisać po jednym „bo …” do każdej. Tylko człowiek zmienia tę sekcję → wymaga zgody. |
| 2 | Umowa: scope, outcome, boundaries, proof | Zrobić | Skill projektu `.claude/skills/agreement/SKILL.md`: przed większym zadaniem agent pisze 4 pola (zakres, wynik, granice, dowód + „porażka gdy”), człowiek akceptuje, dopiero potem praca. Wypróbować na najbliższej pozycji z Planned. |
| 3 | Definicja sukcesu i porażki | Zrobić | Pozycje w Planned na tablicy mają opis, rzadko „gotowe gdy”. Przy przenoszeniu pozycji do Active dopisać „Gotowe gdy: …” (jeden dowód, który da się sprawdzić). |
| 4 | Decyzje (ADR) jako kontekst | Mamy (lekko) | Standing choices + `log.md` z powodami zmian struktury. Osobnego folderu `decisions/` nie zakładać (rada Tan, baza ma ~50 notatek); wrócić, gdy agent popełni błąd z braku decyzji. |
| 5 | Wizualizacje / porównania / lab | Mamy narzędzie | Narzędzie Artifact użyte do macierzy wykonalności (2026-11-09, S03E01). Przy następnej zmianie UI w Challenge: najpierw artefakt „teraz vs proponowane”, potem kod. |
| 6 | Parafraza z dyktowania | Mamy | barwy-tools `transcribe` + lokalny whisper-cpp ([agent-setup](../../context/agent-setup.md)). Nawyk: przy większym zadaniu podyktować intencję, agent ją przeformułowuje i dopisuje kontekst z bazy. |
| 7 | Deterministyczna weryfikacja | Mamy | `tools/check.ts` po każdej edycji `.md` (hook), dev-guard 0.4.0 z 29 testami. |
| 8 | Unknown unknowns / pytania przed startem | Zrobić (już na tablicy) | Planned S03E01: skill `unknown-unknowns` z github.com/overment/skills — pasuje do kroku „focused questions” umowy. |
| 9 | Ogólne skille z procesu weryfikacji | Zrobić (już na tablicy) | Planned: eval dla `memo_search` (S02E05) i test skilla `lesson-notes`. Bez nowych pozycji. |

## Powiązane

- Poprzednia lekcja: [s03e01](s03e01-mechanics-behind-product-engineering.md) (outcome zamiast output, unknown unknowns, labs).
- [s02e05](s02e05-agent-reliability.md) (evale, guardrails w kodzie), [s02e03](s02e03-agentic-capabilities.md) (zasady z powodem), [s01e05](s01e05-building-workflows-not-tool-stacks.md) (samoweryfikacja), [s01e03](s01e03-building-knowledge-systems.md) (system wiedzy), [s01e01](s01e01-mechanics-behind-generative-ai.md) (generalized steering).
- Setup: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
- Challenge tej lekcji: „nothing ships unmarked” — https://hq.mega.dev/challenges/nothing-ships-unmarked (nie rozpoczęty).
