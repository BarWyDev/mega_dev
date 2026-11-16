---
title: "s03e03 — AI-Native Product Development"
type: lesson
source: lessons/s03e03-ai-native-product-development.md (https://hq.mega.dev/lessons/s03e03/)
updated: 2026-11-13
trust: high
status: active
tags: [ai-native, feature-map, meta-workflow, schedules, background-agents, feedback, observability, research]
links: [../../lessons/s03e03-ai-native-product-development.md, s03e02-translating-intent-into-agent-work.md, s03e04-verifying-product-outcomes.md, s03e05-products-that-learn-after-release.md, s03e01-mechanics-behind-product-engineering.md, s02e01-agentic-primitives.md, s02e04-multi-agent-collaboration.md, s01e03-building-knowledge-systems.md, ../topics/barwy-tools.md, ../../work/s03e03/log.md, ../../context/agent-setup.md, ../../work/board.md]
---

Agenci radzą sobie z greenfieldem i brownfieldem bez specjalnego setupu, ale
**szybkość razem z jakością wymaga dodatkowej pracy**. Lekcja pokazuje, jak
system ma się **sam leczyć, podnosić po awariach i poprawiać z czasem**: przez
**meta-workflowy**, które utrzymują mapy funkcji, sprzątają to, co zbędne, i
pozwalają agentom uczyć się na własnych błędach. Główna zmiana jest w głowie:
nie „powiedz agentowi, co ma zrobić", tylko **„zrób tak, żeby wiedział, co
zrobić, i mógł to zrobić"**.

Surowy tekst: [lessons/s03e03-ai-native-product-development.md](../../lessons/s03e03-ai-native-product-development.md).

Punkt wyjścia: narzędzia i wiedza dają agentom autonomię, ale z czasem **system
się zatyka** — narzędzia przestają być potrzebne, stare dokumenty zmieniają się
w szum. Zasada lekcji: **„no document is better than the wrong one"**. Drugi
powód na meta-workflowy: agenci w kółko wpadają na te same problemy; człowiek
zapamiętuje, agent nie — chyba że zbudujemy mu na to workflow (buduje wtedy
własne skille i narzędzia). Produkt z tym wszystkim jest **AI native**, ale
zaczynać trzeba małymi krokami.

Outline lekcji: Exploration, Planning, Execution, Feedback.

## Exploration

- Agent zaczyna pracę od eksploracji i **powtarza ją za każdym razem od zera**,
  czasem się myli, i **nie zostawia po sobie żadnego śladu ani notatki** — chyba
  że mamy na to workflow. Dotyczy to też systemów zewnętrznych: repozytoriów,
  trackerów, kanałów komunikacji, infrastruktury.
- Najprostsze rozwiązanie to **mapa** (wspomniana w S02E01), ale w szybko
  zmieniającym się systemie mapa szybko się dezaktualizuje i **myli bardziej,
  niż pomaga**. To właśnie ten problem ma rozwiązać workflow.
- Nie znamy z góry stanu mapy ani zmiennych, które trzeba uwzględnić. W takich
  sytuacjach szuka się **zasad (principles)**, **zakresu (scope)** i
  **harmonogramu albo triggera** — resztę zostawia się agentowi. Agent musi mieć
  też **dostęp do historii swoich działań**, żeby nie powtarzać błędów; wtedy
  system naprawdę „się uczy".
- To **nie jest mapa kodu** ani nic, co agent łatwo znajdzie sam. To **zestaw
  dokumentów** o funkcjach: czym są, jak z nimi pracować, jak je zweryfikować,
  jaka jest ich rola i o czym pamiętać.
- Rys. 1 — **Feature Map**: małe dokumenty (`checkout.md`, `search.md`,
  `notifications.md`), każdy z czterema sekcjami: **Role, How to get there, How
  to verify, Keep in mind**. Pasek kontrastu: „Found by reading the code"
  (routingi, komponenty, układ katalogów) vs „Written in the Feature Map" (jak
  tam dotrzeć, jak zweryfikować, o czym pamiętać).
- Koncept **Features Map** opisała Lauren Tan przy swoich skillach do
  weryfikacji ([generate](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md),
  [maintain](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md)),
  używanych z Cursor Cloud Agents **w dziennym harmonogramie**.
- Nasza rola: **tworzenie i iterowanie skilli** oraz **zainicjowanie mapy** —
  początkowy kształt mapy wprost decyduje o jej wiarygodności i o tym, jak
  agenci będą ją później poprawiać.
- Zysk jest nie tylko w eksploracji: ten sam kontekst poprawia implementację i
  weryfikację. Rys. 2 — w odtwarzaczu muzyki **poprawka playlisty rusza kolejkę**:
  `playlist.md` mówi „Editing a playlist rebuilds the queue", agent idzie po
  strzałce „rebuilds" do `queue.md` i **dopisuje tam** „Shuffle order is cached";
  `player.md` i `offline.md` zostają nieotwarte.
- Harmonogramy utrzymujące mapy mają szukać nie tylko rzeczy **do dodania**, ale
  też **do zmiany i do usunięcia (archiwizacji)**. Co więcej: **większość agentów
  utrzymaniowych w tle powinna zajmować się sprzątaniem** tego, co już niepotrzebne.
- Warto dać im łatwy sposób komunikacji z nami **zawsze**, nie tylko gdy trzeba —
  **wizualne artefakty**, które da się szybko przeskanować i wyłapać problem.

## Planning

- Mapa funkcji plus zasady z [S03E02](s03e02-translating-intent-into-agent-work.md)
  sprawiają, że rozmowa o zmianach i bugach jest łatwiejsza: **nie trzeba opisywać
  każdego szczegółu ani trzymać wszystkiego w głowie**. Wystarczy napomknąć o
  funkcji, a agent sam łączy, co trzeba. To rozmowa jak **z członkiem zespołu,
  który siedzi w projekcie od lat**.
- Rys. 3 — „Let's add crossfade between tracks. Should work with my downloads
  too."; podkreślone frazy linkują do `player.md`, `queue.md` i `offline.md`,
  a agent odpowiada, że crossfade dotyka trzech obszarów i **radzi zacząć od kolejki**.
- Rozmowa o funkcji to dobry moment na **subagentów i workerów**: główny wątek
  ma zostać **skupiony i interaktywny**, a w tle idzie research i aktualizacja
  grafów, wizualizacji czy labu (S03E02).
- Można pójść dalej: agenci tłumaczą intencję na wysoką jakość, z pewnym
  „common sense" z rozumienia systemu i relacji między komponentami. **Im dłużej
  pracujemy nad systemem, tym lepiej to działa**, bo kontekst rośnie.
- Iterowanie kształtu funkcji (szukanie edge case'ów) da się oddać agentom w tle.
  **Ostateczna decyzja zostaje u nas**, ale to wzmacnia naszą wiedzę i osąd — taki
  plan trudno byłoby wypracować nawet w bezpośredniej rozmowie z AI.
- Rys. 4 — trzy kolumny (Main thread, Background agents, Plan): wiadomość 2
  odpala agentów Explore, Research i Visualize; ich znaleziska (czerwony chip
  „offline track: no preload") trafiają do Shared notes, które iterują plan
  v1 → v2 → v3. **v3 to krótka notatka mówiąca, co funkcja robi, a nie jak ją
  zbudować**, z dołączonym grafem zależności. Wiadomość 5 — „Approve. Max fade
  8 s." — to decyzja człowieka.
- Plan **nie opisuje jak**, tylko **co trzeba zrobić i jak wynik zostanie
  udowodniony**. Sam dokument ma być krótki, może odsyłać do plików zewnętrznych.
  **Pętle feedbacku trzymamy krótkie**, przynajmniej dopóki system nie uniesie
  długich zadań bez nadzoru.
- Ile z tego robimy sami, zależy od funkcji i od **poziomu zaufania** do systemu.

## Execution

Rozwój AI-native redukuje (czasem kasuje) procesy znane sprzed AI i z wczesnego
AI: pisanie kodu, czytanie go, nawet **review** idzie do automatu bez udziału
człowieka; agenci zaczynają zarządzać innymi agentami i podejmować coraz więcej
decyzji. Wygląda, jakby niewiele zostało — w praktyce zostaje sporo.

**Research:**
- Przed AI rozwój produktu zależał od naszych umiejętności i od tego, ile byliśmy
  gotowi się nauczyć: biegli w JavaScripcie rzadko wybierali Rusta, podobnie z
  bibliotekami (Three.js) czy obszarami (programowanie funkcyjne). **Te bariery
  zniknęły albo mocno zmalały.**
- Research stał się częścią naszej pracy. To, że AI używa narzędzia bezbłędnie,
  **nie zwalnia nas ze zrozumienia, jak ono działa** — wręcz przeciwnie. Ale
  zamiast uczyć się wszystkiego, schodzimy **do poziomu, który wystarcza**, i
  musimy **nauczyć się ten poziom rozpoznawać** oraz zbudować wspierające to
  narzędzia i workflowy.
- Rys. 5 — koncentryczne kręgi wokół człowieka (nasze kompetencje): zasięg bez
  AI, **krawędź tego, co umiemy zweryfikować**, i strefa eksplorowana z AI
  (Product docs, Codebase map, Market, Constraints, Prior decisions,
  Conventions). **Dwie z pięciu ścieżek agenta przekraczają krawędź weryfikacji.**
  Cztery pytania kontrolne: *Czy umiem to wyjaśnić własnymi słowami? Czy umiem
  nazwać, jak to sprawdzić? Czy niezależne eksploracje się zgadzają? Czy
  podpisałbym się pod tym?* Zasada: **idź tak daleko, jak jeszcze umiesz
  zweryfikować, a nie tak daleko, jak sięga agent.**

**Structure:**
- Architektura, dokumentacja, usługi zewnętrzne i infrastruktura zostają, ale
  **robotę robią agenci**. Nasza praca to utrzymanie porządku w **procesach**,
  **harmonogramach** i **efektywności** plus mechanika **observability,
  stabilności i poprawy**.
- To praca na **meta-poziomie**: nie **mówić agentom, co mają robić**, tylko
  **zadbać, żeby wiedzieli, co robić** i **mogli to zrobić**. Polecany tekst
  Lauren: sekcja „the art of supervising someone smarter than you" w
  [The Complete Guide to pstack](https://x.com/poteto/status/2097732320606507506).
- Rys. 6 — po lewej jeden człowiek z czterema liniami do czterech agentów:
  „Every question comes back to us". Po prawej „Organizing the system": człowiek
  układa procesy, harmonogramy i efektywność, trzyma system zdrowy przez
  observability, stability, improvement; pudełko „What agents rely on"
  (**Know what to do / Can do it**) zasila agenta wiodącego i łańcuch agentów;
  „Evidence" wraca do Observability, „New tools and skills" do pudełka.
- Zmiana nawyku: przed AI domyślną reakcją było **naprawić samemu**, z AI —
  **kazać agentowi naprawić**. Cel jest inny: **jak sprawić, żeby agent sam
  wiedział o problemie i umiał na niego zareagować.**

**Ecosystem:**
- Przykład: znamy [Axiom](https://axiom.co/), a słabo [Datadog](https://www.datadoghq.com/)
  i [Better Stack](https://betterstack.com/) — przed AI wybralibyśmy Axiom, nawet
  gdyby konkurencja miała lepsze funkcje, bo poznanie nowej platformy kosztowało
  za dużo.
- Z agentami **w godzinę** mamy raport porównujący opcje, opisany pod nas, z mapą
  architektury i szacunkiem wysiłku wdrożenia. Działa to dla **dowolnej usługi**.
- Rys. 7 — ekosystem MEGA: treść lekcji (GitHub, build Astro) zasila MEGA HQ
  **tylko przy deployu**; MEGA HQ (hq.mega.dev na Cloudflare: lekcje odblokowywane
  czasem, Challenge'e, serwer MCP) dzieli dane Studenta z mega.dev (Vercel +
  Next.js: strona, konta, assessment, karty). Usługi: Airtable i Resend pod HQ;
  OpenRouter, Cloudinary, Stripe, Postmark i Sentry pod mega.dev. Komponenty
  wybrano **nie z sympatii ani doświadczenia, tylko z powodów biznesowych i
  organizacyjnych**. Zasada: **wybierz najlepszą usługę do danego zadania.**
- Mimo że da się dziś wygenerować spersonalizowany software, **często nie ma sensu**
  robić tego, co jest z pudełka — za to warto budować **głęboko spersonalizowane
  integracje**, które wyciskają z usług wszystko.

**Schedules:**
- Wielu agentów pracuje równolegle, a **narzędzia nie były pod to budowane**:
  agenci odpalają procesy, testy, kompilatory, sandboxy i maszyny wirtualne.
  Nagle **nawet 128 GB RAM w maksymalnym MacBooku to za mało.**
- Gdy zaczyna brakować zasobów (CPU, GPU, RAM, dysk), pierwszy ruch to
  **poprosić agentów o audyt** wąskich gardeł. Audyt znajdzie rzeczy do zrobienia
  od razu albo takie **na harmonogram**: czyszczenie, sprawdzanie zawieszonych
  procesów i pozostałości. Czasem warto dołożyć **kolejki albo throttling** dla
  najbardziej żarłocznych procesów (kompilacja).
- Rys. 8 — trzy wykresy (krzywe przykładowe, nie pomiary): RAM w ciągu dnia
  (zatrzymywanie zawieszonych procesów **co godzinę** trzyma bazę płasko; bez
  tego piki kompilacji biją w limit **od ok. 15:00**), dysk w ciągu tygodnia
  (**nocne czyszczenie** daje piłokształtną linię zamiast schodów do „Full disk"
  w piątek), sześć kompilacji w godzinę (**kolejka, 2 naraz**). Zasada:
  **zaplanuj sprzątanie i ustaw kolejkę na piki, zanim dokupisz sprzęt.**
- Gdy optymalizacja nie wystarczy — zamiast kupować sprzęt, rozważyć **agentów w
  chmurze** ([codex](https://learn.chatgpt.com/docs/cloud),
  [claude](https://code.claude.com/docs/en/claude-code-on-the-web)): mniej
  elastyczne niż VPS czy fizyczna maszyna, ale **świetnie się skalują**.
- Harmonogramy to też **monitoring**: anomalie, zachowanie użytkowników, problemy
  bezpieczeństwa. To dziś **krytyczna część systemu**, bo ataki idą **nie od
  głupich botów**, tylko od **dynamicznych agentów** szukających wejścia. Warto
  rozważyć skill [security-audit](https://github.com/cloudflare/security-audit-skill)
  i porządny [Sentry](https://sentry.io/), który **zgłasza problemy wprost do agentów**.
- I wreszcie harmonogramy do **samej pracy nad produktem**: issues, bugi, review
  funkcji, refaktory — zwykle **w chmurze**, żeby nie zależały od niczyjej maszyny.
- Podsumowanie: harmonogramy stają się ważnym obszarem i **dobrze ustawione mogą
  być przewagą konkurencyjną**.

## Feedback

- Agenci potrzebują **jak największego dostępu do danych środowiska w czasie
  rzeczywistym** — stan obecny i historyczny. System musi być pod to zorganizowany:
  łatwy dostęp do logów dev i produkcyjnych, eventy aktywności, łatwa interakcja z
  aplikacją, **zrzuty ekranu i nagrania wideo** i więcej.
- Takie interaktywne, bogate w dane środowisko **rzadko istnieje** w software.
  Trzeba więc najpierw **zdecydować, jakie informacje są potrzebne**, a potem
  **przebudować albo rozszerzyć system**, żeby je dostarczał — **nie dla nas,
  tylko dla agentów**.
- Rys. 9 — skąd agent bierze feedback. W **sandboxie (development)** agent
  **steruje aplikacją** (klika, pisze, loguje się), **obserwuje ją** (zrzuty,
  logi, nagrania) i **dokłada dowody** (before/after, przeszłe checki). Aplikacja
  idzie na **produkcję (read-only)**, gdzie agent **tylko czyta sygnały**: logi i
  błędy, session replays, feedback użytkowników.
- To nie jest „prosty logger" — zbudowanie tego wymaga **uznania tego za priorytet**.
- Struktury feedbacku są fundamentem całości, bo **budują zaufanie** i pozwalają
  agentom rzetelnie weryfikować własną pracę. Trudno z góry powiedzieć, co dokładnie
  będzie potrzebne, więc jak zwykle: **zacząć mało**, a potem **dołożyć użyteczne
  harmonogramy**, żeby agenci utrzymywali narzędzia i poprawiali je na podstawie
  wniosków z logów.

## Wnioski

Wyjście poza bezpośrednią pracę z agentami w stronę prawdziwie AI-native cyklu
wytwarzania **kosztuje dużo wysiłku**. Nawet gdy agenci robią robotę na
oprogramowaniu i na samym systemie, zostaje nam **mnóstwo działań, decyzji i
rozumienia**. Wymaga to **nowego sposobu myślenia**: to nie jest „kolejny poziom
abstrakcji", tylko **poszerzenie perspektywy daleko poza kod**, na inne obszary
produktu.

Ostatnia myśl lekcji: produkty AI-native **mogą iść dużo szybciej przy
zachowaniu jakości, a produkty rozwijane przez bezpośrednią pracę z agentami nie
mają szans nadążyć**. Stąd wniosek, że czasem **rozsądniej zbudować całą
platformę od zera**, żeby tę przewagę zyskać.

## Na co uważać

1. Mapa, która się zdezaktualizowała, **myli bardziej niż pomaga** („no document is better than the wrong one").
   → Nie zakładać mapy bez triggera albo harmonogramu, który ją utrzymuje.
2. Harmonogram utrzymaniowy, który tylko **dodaje**.
   → Wymagać w nim jawnie trzech ruchów: dodaj, zmień, **usuń/zarchiwizuj** — sprzątanie jest ważniejsze.
3. Mapa funkcji powtarzająca to, co agent i tak wyczyta z kodu (routingi, komponenty, katalogi).
   → Pisać tylko: Role, How to get there, **How to verify**, Keep in mind.
4. Kiepski początkowy kształt mapy psuje wszystkie późniejsze poprawki agentów.
   → **Zainicjować mapę samemu**, dopiero potem oddać utrzymanie skillowi.
5. Agent sięga dalej, niż umiemy zweryfikować (2 z 5 ścieżek na rys. 5).
   → Cztery pytania przed akceptacją: wyjaśnię własnymi słowami / nazwę sposób sprawdzenia / niezależne eksploracje się zgadzają / podpiszę się pod tym.
6. Plan opisujący **jak**, nie **co**, i rozdęty do dokumentu.
   → Krótka notatka: co funkcja robi i jak wynik zostanie udowodniony; szczegóły w linkach.
7. Równoległi agenci zjadają CPU/RAM/dysk, zanim ktokolwiek zauważy.
   → **Audyt wąskich gardeł u agenta**, potem harmonogram sprzątania i kolejka na piki — przed dokupieniem sprzętu.
8. Ataki od **dynamicznych agentów**, nie od prostych botów.
   → Harmonogram monitoringu anomalii + skill `security-audit` + Sentry raportujący wprost do agentów.
9. Agent eksploruje za każdym razem od zera i **nie zostawia śladu**, więc powtarza te same błędy.
   → Dać mu dostęp do historii własnych działań (dziennik, log tarć).
10. Budowanie feedbacku „dla nas", a nie dla agentów.
   → Najpierw zdecydować, **jakich danych potrzebuje agent**, potem rozszerzyć system; produkcja read-only, sterowanie tylko w sandboxie.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Feature Map: małe dokumenty z Role / How to get there / **How to verify** / Keep in mind | Zrobić | Najbliższy kandydat to [barwy-tools](../topics/barwy-tools.md) (4 narzędzia: `memo_write`, `memo_search`, `upload`, `transcribe`). Założyć `knowledge/features/` z jednym plikiem na narzędzie w tych czterech sekcjach; zainicjować ręcznie (punkt 4 z „Na co uważać"), dopiero potem oddać utrzymanie. Dziś ta wiedza jest rozsiana po `work/s02e03/log.md` i notatce pointer. |
| 2 | Skill, który **utrzymuje** mapę: dodaj / zmień / **usuń** | Zrobić | Po punkcie 1: `.claude/skills/feature-map/` z zakresem, zasadami i triggerem („po każdej zmianie w barwy-tools"). Wzorce do przeczytania: skille Lauren Tan `create-verification-skill` i `maintain-verification-skill` (linki w tekście lekcji). |
| 3 | Agent ma dostęp do **historii własnych działań** | Zrobić (już na tablicy) | Planned z S03E05: `work/friction.md` (co się stało, cel, jak odtworzyć, koszt, status) + reguła „drugi raz ten sam problem → wiersz". To jest dokładnie ten punkt; nie dublować pozycji, tylko dopisać do niej uzasadnienie z tej lekcji. |
| 4 | Harmonogramy: sprzątanie ważniejsze od dodawania | Zrobić (rozszerzyć pozycję) | Planned „tygodniowy health check jako scheduled task" ma już „co usunąć" (s02e03, item 4). Dopisać: ten sam przebieg przegląda `knowledge/` i `work/board.md` pod kątem **zmień / zarchiwizuj**, a nie tylko dodaj. Sprawdzone 2026-11-13: `list_scheduled_tasks` → **zero zadań**, więc nic jeszcze nie chodzi w tle. |
| 5 | Wizualny artefakt zamiast ściany tekstu — zawsze, nie tylko gdy trzeba | Mamy narzędzie | Artifacts (ostatnio macierz wykonalności dla lane Planned, 2026-11-09). Nawyk: wynik rutyny utrzymaniowej i przegląd tablicy **wracają jako artefakt do przeskanowania**, nie jako lista w czacie. |
| 6 | Cztery pytania o krawędź weryfikacji (rys. 5) | Zrobić | Wejdzie do planowanego skilla `agreement` (board, S03E02) obok progów ryzyka z [s03e04](s03e04-verifying-product-outcomes.md): przed odbiorem odpowiedzieć na cztery pytania; „nie" przy którymkolwiek = zawęzić zakres albo dołożyć dowód. |
| 7 | Audyt zasobów (CPU/RAM/dysk) u agenta, zanim dokupisz sprzęt | Zrobić | Jednorazowe zadanie: audyt tej maszyny (zawieszone procesy po headless runach, `node_modules` i `dist` po Challenge'ach, modele whisper, klony starterów w `work/*/repo`). S03E03 zostawił po sobie pętlę pod `caffeinate` — dobry kandydat na pierwszy wpis „leftover". Efekt: lista jednorazówek + to, co idzie na harmonogram. |
| 8 | Agenci w chmurze zamiast obciążania laptopa | Mamy | Claude Code cloud sessions (użyte w S02E04 do job 1). Zapamiętać jako wybór przy zadaniach wymagających długiego biegu — S03E03 biegł lokalnie pod `caffeinate` i to był [wymieniony gap](../../work/s03e03/log.md). |
| 9 | Harmonogram bezpieczeństwa + `security-audit` + Sentry raportujący do agentów | Mamy częściowo | Skill `security-audit` jest w `~/.claude/skills/security-audit` (zestaw Cloudflare). Brak: Sentry i jakiegokolwiek alertu z Workerów (barwy-tools, mail-agent, away-agent działają bez raportowania błędów). Dołożyć do tygodniowego health checku odczyt błędów z `wrangler tail`/logów Workerów; Sentry dopiero, gdy będzie czego pilnować. |
| 10 | Feedback: agent steruje aplikacją w sandboxie, z produkcji **tylko czyta** | Mamy częściowo | Wbudowana przeglądarka (`mcp__Claude_Browser__*`) + metoda czytania nagrań klatka po klatce ze skilla `release-signals`. Produkcja read-only jest już praktyką z S03E03 (allow-list, jedno wyjście do produkcji przez `tracker.mjs`). Brak: łatwego dostępu do logów produkcyjnych — patrz punkt 9. |
| 11 | Research: raport porównujący usługi zamiast wyboru „bo znam" | Nawyk | Najbliższa okazja: wybór między FTS5 a Workers AI + Vectorize dla `memo_search` (Planned). Poprosić o raport z mapą architektury i szacunkiem wysiłku, zamiast decydować z marszu. |

## Powiązane

- Challenge tej lekcji: „out of office" — [log](../../work/s03e03/log.md), https://hq.mega.dev/challenges/out-of-office (rozwiązany 2026-11-11 na pierwszym verdict claimie).
- Sąsiednie lekcje: [s03e02](s03e02-translating-intent-into-agent-work.md) (intencja, umowa, zasady — mapa funkcji je uzupełnia), [s03e04](s03e04-verifying-product-outcomes.md) (lab, dowody, rutyny — rozwinięcie sekcji Feedback), [s03e05](s03e05-products-that-learn-after-release.md) (sygnały po release, log tarć, „usuwanie to też dodawanie").
- [s03e01](s03e01-mechanics-behind-product-engineering.md) (outcome, macierz wykonalności), [s02e01](s02e01-agentic-primitives.md) (mapa jako prymityw, pamięć agenta), [s02e04](s02e04-multi-agent-collaboration.md) (agenci w tle, cloud session), [s01e03](s01e03-building-knowledge-systems.md) (ta baza jako mapa, która nie może zgnić).
- [barwy-tools](../topics/barwy-tools.md) — pierwszy kandydat na mapę funkcji.
- Setup: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
