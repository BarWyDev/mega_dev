---
title: "s04e04 — Automating Work Beyond Code (Software Factory: Wake the Team)"
type: lesson
source: lessons/s04e04-automating-work-beyond-code.md (https://hq.mega.dev/lessons/s04e04/) and lessons/s04e04-build-guide.md (https://hq.mega.dev/lessons/s04e04/build-guide/)
updated: 2026-11-19
trust: high
status: active
tags: [events, hooks, pipelines, push-systems, automation, primitives, subscriptions, idempotency, watcher, pass-k, lookups, error-hunter, durable-execution]
links: [../../lessons/s04e04-automating-work-beyond-code.md, ../../lessons/s04e04-build-guide.md, s02e05-agent-reliability.md, s04e03-software-factory-staff-the-team.md, s04e01-mechanics-behind-autonomous-systems.md, s03e01-mechanics-behind-product-engineering.md, s03e03-ai-native-product-development.md, s03e05-products-that-learn-after-release.md, ../topics/own-agent-loop.md, ../../context/agent-setup.md, ../../work/board.md]
---

**System autonomiczny zaczyna się od zdarzenia, które budzi go bez pytania, a
nie od promptu.** Lekcja składa cztery klocki: *events* (kiedy system startuje),
*hooks* (co zmienia jego drogę po drodze, także przez tygodnie czekania),
*pipelines* (stała ścieżka, w której model robi zwykle jeden krok) i *push
systems* (kontekst podany z góry zamiast szukany przez agenta). Wszystko to ma
sięgać poza kod — do cen, płatności, supportu, sprzedaży — i sprowadzać się do
kilku prymitywów wielokrotnego użytku, a nie do pojedynczych integracji.

Lekcja jest rozszerzona: część pierwsza to zasady (sekcje „Events” –
„Takeaways” poniżej), część druga to Build guide „Wake the Team: Sort Tickets,
Draft Replies, and Read Error Reports” — trzy zadania Johna w RentAPlace z
promptami, liczbami i sprawdzianami (sekcja „Build guide”). Na dashboardzie lekcja nazywa się „Software Factory Wake the
Team”, tematy kursu: Event Intake, Hunting Errors.

## Wstęp: poza krąg kompetencji

- Modele SOTA rzadko wymagają merytorycznej poprawki; większość problemów to
  **rozjazd między tym, co dostaliśmy, a tym, czego oczekiwaliśmy**.
- Dwa powody słabych wyników: ludzie używają AI poza obszarem, w którym umieją
  ocenić wynik, oraz większość nie pracuje na modelach SOTA.
- Nawiązanie do kręgu kompetencji z
  [s03e03](s03e03-ai-native-product-development.md): AI pozwala sięgać do
  granicy tego, co jeszcze umiemy zweryfikować, a ta granica się przesuwa.
- Punkt startu: przejrzeć aplikacje i usługi, których używamy, i szukać nie
  technicznych szczegółów API, tylko **use case'ów**, które da się pokazać biznesowi.

## Events

- Pytanie przewodnie: **kiedy system może obudzić się sam?** Za mało pomysłów na
  triggery — nic się nie dzieje; za dużo zdarzeń — robi się szum.
- Przykład: produkt subskrypcyjny i metryki MRR, churn, trial-to-paid, LTV.
  Dawne narzędzia analityczne (Mixpanel) nie były proaktywne — wnioski w
  działania zamieniał człowiek.
- Zanim cokolwiek podepniemy, trzeba dopasować **siedem punktów**:
  1. **Business Context** — co firma oferuje i jakie ma cele,
  2. **Metrics** — co mierzymy, żeby te cele osiągać,
  3. **Analytics tools** — co dają narzędzia i jak się do nich podłączyć,
  4. **Product** — jak obecny stan produktu na to odpowiada,
  5. **Event** — co agenci (albo ich skrypty) mają obserwować,
  6. **Action** — jakie działania są możliwe,
  7. **Eval** — jak sprawdzimy wynik działania.
- Rysunek 1: trial-to-paid spada po wydaniu → event → agent *wakes / explains /
  plans* → pięć działań (investigation, experiment za flagą, guide update, team
  brief, feature request) → **my** akceptujemy, zmieniamy albo odrzucamy → eval
  („czy metryka drgnęła?”) → pomiar od nowa. Pętla się zamyka.
- Agenci potrafią to wszystko przynajmniej **zbadać** i zaplanować, ale pomysł
  musi ktoś mieć, a wdrożenie **wymaga prawdziwej pracy zespołowej**.
- Sześć przykładów, każdy z granicą „agent przygotowuje, człowiek decyduje”:
  **Pricing** (Firecrawl łapie zmianę cennika konkurenta, porównanie z Stripe;
  decyzja i rozmowy z klientami zostają u nas), **Payments** (webhooki Stripe +
  lejek w PostHog; zespół kontaktuje się z klientami), **Support** (powtarzające
  się pytanie w Plain → docs i propozycja w Paper), **Sales** (transkrypcje z
  Granola → szkic agreement w Linear), **Store rating** (Sentry + zmiany w
  wydaniu → co cofnąć), **Spam reports** (skargi w Resend jako anomalia).
- Rysunek 2 (pricing): trzy tory — Engineering, Product, Business — przecinają
  cztery kroki: Event, Analysis, Decision, Result; dwanaście punktów. Wniosek:
  procesu nie projektujemy sami, więc opłacają się prymitywy do ponownego użycia.
- **Siedem kroków do wykonania:**
  - **Map** — agent skanuje usługi i wypisuje ich webhooki, API i logi;
    „większość produktów już emituje zdarzenia, których nikt nie czyta”.
  - **Select** — jeden proces o jasnej wartości; **jeden event, jedna akcja,
    jeden eval** wystarczą na start.
  - **Unify** — jedno wejście i jeden kształt: source, type, identity, time,
    payload. To prymityw **Subscriptions** z
    [s03e01](s03e01-mechanics-behind-product-engineering.md).
  - **Identify** — to samo zdarzenie dostarczone dwa razy to jedna praca; to
    samo zdarzenie z inną treścią to **zmiana, nie retry**.
  - **Filter** — najpierw proste reguły, mały model tylko tam, gdzie reguły
    zawodzą (Specter z [s04e01](s04e01-mechanics-behind-autonomous-systems.md)).
  - **Convert** — każdy event → jedno zadanie z właścicielem i odnośnikiem do
    eventu. Niejasny właściciel: system **pyta, nie zgaduje**.
  - **Observe** — agent najpierw raportuje, co *by zrobił*; zdarzenia
    przeglądamy regularnie, bo usuwanie szumu liczy się tak samo jak dodawanie.
- **Build Johna:** aplikacja zapisuje jedną linię logu na nowy ticket (z ID).
  Osobny program, *watcher*, czyta nowe linie i uruchamia *sorter*, więc gość
  nigdy nie czeka na model. Ten sam ticket dostarczony dwa razy dostaje jeden
  tag, a zakładka (bookmark) pozwala kontynuować po restarcie. Nieudane żądanie
  budzi drugie zadanie — *error hunter*.

## Hooks

- Events mówią, kiedy system startuje; hooks — **co dzieje się po drodze**. W
  [s04e03](s04e03-software-factory-staff-the-team.md) były hooki w cyklu pętli
  agenta, tu chodzi o procesy **wokół** pętli: obserwować, czekać, reagować,
  korygować. To pozwala na zadania, które czekają na odpowiedź tygodniami.
- Rysunek 3: zadanie przez trzy tygodnie głównie śpi; dwa hooki pilnują progów
  metryk. Trial-to-paid zostaje w normie (hook nie odpala), dostarczalność maili
  spada w drugim tygodniu → objazd do właściciela → ten decyduje o kontynuacji →
  zadanie wznawia i w trzecim tygodniu raportuje.
- Hooki definiuje się razem z planem zadania, ale warto myśleć o nich jak o
  prymitywach: **Alert** (dotrzeć do człowieka albo uruchomić procedurę) i
  **Approval** (zgoda lub brakująca informacja od osoby albo agenta).
- Rysunek 4: trzy zadania — pricing review (dni; Change, Timeout, Approval,
  Completion), failed payments (godziny; Join, Alert, Approval, Completion),
  campaign health (tygodnie; Threshold, Approval, Completion). **Approval jest
  tym samym hookiem w każdym zadaniu**; zmienia się payload i kontekst, nie cel.
- **Struktura hooka** (rekord czytany jak zdanie: *for* this job, *when* this
  happens, *then* do that, *until* the job ends):
  - **Owner** — zadanie, do którego należy,
  - **Trigger** — typ zdarzenia, punkt w czasie albo krok zadania,
  - **Condition** — kiedy obowiązuje (np. metryka przekracza próg),
  - **Response** — obudzić agenta, uruchomić skrypt, wysłać alert, poprosić o zgodę,
  - **Description** — po co istnieje, **pisane dla agenta, który obudzi się z pustym kontekstem**,
  - **Expiration** — kiedy znika, zwykle z końcem zadania.
- **Rejestr** hooków to plik albo tabela. Zadanie rejestruje swoje hooki przy
  utworzeniu (z szablonu lub od zera) i agent może zasnąć — **żaden model nie
  pracuje, gdy hook czeka**.
- Dopasowanie robi **zwykły kod**: każde zdarzenie, alarm i krok porównuje się z
  rejestrem; trafienie albo wykonuje odpowiedź wprost, albo budzi agenta z
  notatką i zdarzeniem. Każde odpalenie trafia do historii zadania; koniec
  zadania usuwa jego hooki.
- Trzy zasady: hook może tylko to, co wolno jego zadaniu; to samo zdarzenie
  odpala hook **raz**; zadanie ma **kilka** hooków, bo nadmiar to szum.
- **Build Johna:** najbliższy odpowiednik to jedna reguła w sorterze — gdy
  odpowiedź „czy to o pieniądzach” wypada pośrodku albo właściciel jest
  niepewny, zwykły kod oznacza ticket jako *unsure*, zapisuje powód i kładzie go
  na górze widgetu Issues. Rejestru hooków ani zadań czekających tygodniami w
  jego buildzie nie ma.

## Pipelines

- Nie wszystko musi być dynamiczne. Ustalone procesy mogą — a często muszą — iść
  stałą ścieżką; większość kroków jest deterministyczna, agent nimi tylko
  zarządza i sam obsługuje drobne problemy, a powtarzające się lub eskalowane
  idą do człowieka.
- **Sześć kroków** (rysunek 6, „the path is fixed”):

  | Krok | Co robi | Kto |
  | --- | --- | --- |
  | Observe | przyjmuje payload zdarzenia i zapisuje go | kod |
  | Classify | nazywa rodzaj: reguły, model gdy zawiodą; niejasne → manual review | reguły albo model |
  | Route | wybiera właściciela | kod |
  | Execute | wykonuje pracę | agent |
  | Verify | sprawdza wynik względem dowodu; nieudane wraca do Execute | kod albo model |
  | Communicate | raportuje wynik i zapisuje go na następny przebieg | kod |

- Każdy krok ma jasne **wejście, wyjście i sprawdzenie**. Event startuje
  pipeline, hooki mogą zmienić jego drogę, ale struktura jest znana z góry —
  dlatego zadanie da się powtarzać, obserwować i oceniać.
- Prymitywy **code mode** i **package** z wcześniejszych lekcji dobrze się tu
  składają: działają deterministycznie albo pod zarządem agenta.
- Rysunek 7, cztery przykłady: release material (na merge), reconciliation (co
  noc), feedback sorting (na nowy feedback), lesson publication (na zapisany
  szkic). **W każdym pipeline tylko jeden krok robi model**: w trzech to
  Execute, w feedback sorting — Classify.
- **Build Johna:** trzy zadania o stałej ścieżce. Sorter: kod czyta ticket,
  model odpowiada na dwa pytania (kto jest właścicielem, czy chodzi o
  pieniądze), kod zapisuje tag. Drafter: kod odszukuje pobyt, Booking pisze
  odpowiedź, a sprawdzenie **śledzi każdą kwotę z powrotem do lookupu**. Każdy
  wynik czeka na człowieka: tag do przeczytania, szkic do wysłania lub nie,
  raport do przekazania Main.

## Push Systems

- Agenci dobrze wyszukują kontekst, ale push ma sens przy mniejszych modelach,
  gdy chcemy mieć pewność sterowania, oraz dla kosztu i opóźnień w zadaniach
  powtarzanych wiele razy. Warunek: jesteśmy pewni, że ten kontekst **musi być
  obecny** i pozostaje użyteczny.
- Rysunek 8: krok albo hook startuje → **Choose** (stała lista, gdy znamy
  potrzeby, albo router — mały model) → **Context** (fakty z ich wiekiem, reguły
  dla tego rodzaju sprawy, czego nauczył ostatni przebieg) → **Check**
  („wszystko obecne?”) → agent startuje gotowy. Gdy brak: **krok czeka**. Bez
  push agent szuka sam: „more calls, more cost, and it can miss”.
- Pułapka prefetchu (rysunek 9, zdarzenie „order placed”, w danych: to samo
  zamówienie wczoraj i stary adres):
  - **Too little** (client, product) — brak „last order”, agent potwierdza duplikat,
  - **Too much** (wszystkie sześć pól) — „old address” kłóci się z rekordem
    klienta, agent wysyła na stary adres,
  - **Fits this case** (client, product, last order) — agent pyta przed potwierdzeniem.
- Kompromis: zamiast pełnych treści — **referencje lub ID ze źródłem i minimalnym
  opisem**. Bardziej skompresowane, czytelne dla agenta; doczytanie kosztuje
  dodatkowe kroki, ale proces jest dokładniejszy.
- **Build Johna:** drafter jest push systemem. Kod czyta pobyt z ticketu, pyta
  aplikację o daty, cenę i sumę i podaje te fakty agentowi Booking razem z jego
  notatkami *customer-facing*. **Booking nie ma narzędzi**, więc nie doszuka
  niczego więcej. Wewnętrzna połowa notatek zostaje poza kontekstem, bo z nią
  Booking tłumaczył gościowi wewnętrzny mechanizm. Gdy lookup się nie uda, fakty
  mówią „unknown” i szkic nie podaje kwoty.

## Build guide: sorter, drafter i error hunter

Myśl przewodnia: **zdarzenie startuje pracę, ale nie decyduje, co tej pracy
wolno** — „damy każdemu zadaniu miejsce, w którym się zatrzymuje, tak samo jak
powód, żeby wystartować”. Sorter obudzony o trzeciej w nocy nie ma przez to
prawa zrobić zwrotu. Narzędzia: Pi jako Main, Herdr dla widgetów Issues i
Hunts, gałąź `d33-domain-agents` RentAPlace z agentami Booking i Pricing z
[s04e03](s04e03-software-factory-staff-the-team.md).

### Wake a Job

- **Watcher** to osobny program, nie druga kopia aplikacji. Aplikacja kończy
  obsługę żądania i zostawia rekord; watcher zauważa rekord i startuje właściwe
  zadanie. Gość dostaje odpowiedź z formularza, zanim model cokolwiek zdecyduje,
  a gdy usługa modelu zniknie, oryginalna wiadomość nadal istnieje.
- **Durable** znaczy „praca przeżywa restart”, nie „maszyna zawsze działa”.
  Krok to **akcja i jej wynik**. Sorterowi wystarczy zakładka (ostatni
  ukończony ticket); dłuższe zadanie potrzebuje hosta, który pamięta wynik
  każdego ukończonego kroku — przerwane w kroku czwartym używa zapisanych
  wyników kroków 1–3.
- Sprawdzian restartu: „the host was killed mid-hunt; after a restart the same
  session finished with one report”. Liczą się trzy rzeczy: *po restarcie*, *ta
  sama sesja*, *jeden raport* — sam raport po restarcie niczego nie dowodzi, bo
  nowe zadanie mogło zrobić wszystko od zera.
- **Dopasuj zapis do tego, co faktycznie stracisz przy awarii zasilania**:
  zakładka i zapis odporny na powtórzenie, jeśli wystarczą; pełne wyniki kroków
  tylko tam, gdzie późniejszy krok ich potrzebuje.
- Która linia logu budzi sorter? Nie `http.request` (aplikacja obsłużyła
  żądanie), tylko `support.received` z `ticketId` — mówi, **który ticket teraz
  istnieje**, bez kopiowania wiadomości gościa do logu. Rozpoznaje ją kod, nie model.
- Wynik to jedna linia w `support-tags.jsonl`: `ticketId`, `owner`, `money`,
  `waitsFor: "a person"`, `model`, `at`. Ticket zostaje nietknięty; sorter
  dopisuje **swoją opinię obok**. Pole `at` i zegar testowy aplikacji to różne
  zegary — ich różnica nie mierzy czasu sortowania.
- Test na własnej aplikacji: czy drugi program umie powiedzieć, co się stało,
  znaleźć oryginał i zostawić wynik do obejrzenia **bez zmiany oryginału**?
  Jeśli nie — naprawić to przed wyborem modelu.

### Sort New Tickets

- Model dostaje **dwa pytania**: kto jest właścicielem (Booking, Pricing,
  *nobody*) i czy chodzi o pieniądze. Kod znajduje tickety i zapisuje tagi;
  model nie zmienia ticketu ani nie rusza pieniędzy.
- **Klucz odpowiedzi przed pętlą**, z dawnych ticketów. Ma zawierać przypadki
  graniczne: pieniądze bez słowa o pieniądzach (ten sam weekend dwa razy na
  karcie), słowo o pieniądzach bez pieniędzy (darmowy parking), `nobody`
  (wolny kalendarz) i tickety z **dwoma akceptowalnymi właścicielami** — oba
  wpisane do klucza.
- `nobody` to zwykła odpowiedź: „pewny wybór ze złego menu nie jest dobrym
  wynikiem”. Właściciel to ten, kto ma spojrzeć pierwszy, a nie ten, kto umie
  napisać wiarygodną odpowiedź.
- Dwa pola, bo prowadzą do różnych działań: jedno etykietuje ticket, drugie
  decyduje, czy musi go zobaczyć człowiek. *Not money* nie znaczy *not
  important* (ticket o czujniku dymu) — sorter nie zastępuje oceny pilności.
- Kolejność prób: **reguły słów kluczowych → tani model → mocniejszy**, każda
  wiele razy. Poprzeczka to **pass to the k**: wszystkie k przebiegów.
  Wybierać najtańszą opcję, która spełnia wymaganie dla pieniędzy.
- Liczby z pierwszego zbioru (16 ticketów, 15 przebiegów): słowa kluczowe —
  11 z 16 flag pieniędzy; Haiku 4.5 — wszyscy właściciele dobrze w każdym
  przebiegu, ale **ani razu** komplet flag pieniędzy; Haiku 5.5 — 16 z 16 flag
  we wszystkich 15 przebiegach, jeden właściciel stale źle. Wniosek: **najpierw
  zapisać, którego błędu nie wolno przepuścić**.
- **Jev** (model „System One” od TypeSafe): przyjmuje ticket i oba typowane
  pytania naraz, zwraca właściciela z listy z pewnością oraz liczbę 0–1 dla
  pieniędzy; nie pisze tekstu, który kod musiałby parsować. Świeża próba:
  mediana 68 ms, 90. percentyl 97 ms, maksimum 214 ms; 176,670 tokenów
  wejściowych, szacunkowo $0.0074.
- **Czytać pudła, nie wynik**: trzymać wynik każdego ticketu z każdego
  przebiegu. Ticket o podwójnym obciążeniu miał prawdopodobieństwo pieniędzy
  0.42–0.53 — to powód, żeby spojrzeć, a nie żeby uznać „brak pieniędzy”.
- Progi w kodzie: `MONEY_AT = 0.30`, `MONEY_SURE = 0.70`, `OWNER_SURE = 0.70`.
  Funkcja `decide`: pieniądze od 0.30; między 0.30 a 0.70 **pieniądze i
  unsure**; pewność właściciela poniżej 0.70 dodaje własny powód. Niskie
  prawdopodobieństwo pieniędzy to głos na „nie”, niska pewność właściciela to
  „nie ufaj wyborowi” — nie wolno traktować ich jednakowo. **Brak odpowiedzi to
  nie `money: false`: nie zapisywać tagu.**
- Świeży zbiór: 24 tickety (14 o pieniądzach, 10 nie), 15 przebiegów = 210
  okazji, żeby ticket o pieniądzach ominął przegląd; **żaden nie ominął**. Ale
  ticket „cztery noce, wpłynęło za trzy” trafił do Booking w 13 z 15
  przebiegów (wszystkie 13 oznaczone unsure). Drugie ograniczenie: żaden świeży
  ticket nie miał wyniku między 0.30 a 0.50, więc próba nie dowodzi, że 0.30 to
  właściwy próg dla cudzej skrzynki.
- Zasada świeżego testu: ustawić poprzeczkę na jednym zbiorze, **nowe tickety
  oetykietować przed uruchomieniem**; nie przesuwać progu i nie nazywać
  kolejnego przejścia po tych samych odpowiedziach „świeżym testem”.
- **Kolejność zapisów**: zakładka przesuwana na końcu chroni przed pominięciem
  ticketu; zapis po tożsamości ticketu chroni przed drugim tagiem, gdy sorter
  padnie po zapisie, a przed przesunięciem zakładki.
- **Testować watchera, nie tylko model**: (1) kontrola — watcher działa, nic
  nie przychodzi, nic nie jest tagowane; (2) po wysłaniu ticketu test **nie
  wywołuje** sortowania sam; (3) powtórka tej samej linii logu → jeden tag
  (tożsamość ticketu, nie treść: dwóch gości może zapytać o to samo); (4)
  offline ma dwie połowy — brak tagu i nieruszona zakładka, a po powrocie API
  tag się pojawia; (5) restart — dwa tickety czekają, po starcie każdy dostaje
  jeden tag; (6) rekordy, które miały się nie zmienić: sześć tagów na sześć
  ticketów, żadnej zmiany w ticketach, rezerwacjach i wypłatach.
- Wcześniejszy sorter przy niedostępnym modelu zgłaszał ticket jako
  nieposortowany i **szedł dalej** — wyglądało to na działającą kolejkę, dopóki
  ktoś nie zapytał, gdzie ten ticket się podział.
- Odpytywanie co 2 s nie obiecuje tagu w 2 s: najwolniejszy z mierzonych
  przyjazdów trwał 2.37 s. Żaden test nie dowodzi, że dwa watchery mogą
  bezpiecznie pisać do jednego pliku.
- Lista poranna (Issues): właściciela i powód czekania dodają **zapisane
  pliki, nie kolejne wywołanie modelu**. 7 nowych ticketów posortowanych, 5
  czekało na człowieka, 28 starszych nigdy nie sortowano — brak właściciela
  znaczy „nie mamy tagu”, nie „model wybrał nobody”.

### Draft Replies from Lookups

- Posortować pytanie o cenę to nie odpowiedzieć. Szkic powstaje **na prośbę
  człowieka**: kod czyta pobyt z ticketu i pyta aplikację o daty, cenę i sumę
  (**lookup**); Booking dostaje fakty, notatki *Customer-facing* i żadnych narzędzi.
- Dlaczego nie „zachowaj to w tajemnicy”: mając obie połowy notatek, model
  **przetłumaczył** wewnętrzny mechanizm double-bookingu na przyjazne słowa —
  parafrazy nie złapie filtr słów ani porównanie stringów. Sekcję `## Internal
  engineering` z `agents/booking/memories.md` pomija się przy budowaniu wejścia;
  **sprawdza się wejście, nie jedną grzeczną odpowiedź**.
- Booking nie jest drugim silnikiem cen. Przykład: $110.00 za noc, $60.00
  sprzątanie, $46.80 opłata serwisowa, $31.20 podatki, **$468.00 razem**.
  Szkicu nie ocenia się kalkulatorem; pyta się, **który lookup zwrócił liczbę,
  dla którego gościa i pobytu**. Brakujący lookup naprawia się w kodzie
  zbierającym fakty, nie w piszącym.
- Trzy różne porażki, trzy różne sprawdzenia: **prześledzić kwotę** (do
  lookupu), **odszukać obietnicę** (hold), **przeczytać słowa** (zdania bez
  liczb). Prawdziwa notatka customer-facing („pending reservation is always
  refunded in full…”) może dać nieproszoną albo mylącą obietnicę, gdy gość
  pytał o cenę.
- Test ceny zmienionej po obietnicy: hold `HOLD-E54ED0AC` na $468.00, dziś ta
  sama długość pobytu kosztuje $864.00. Nie uczyć piszącego, że niższa cena
  jest zawsze właściwa — **kod ustala, który rekord odpowiada na pytanie**. Po
  wygaśnięciu holdu szkic mówi, że wygasł, bez kwoty.
- Liczby: lookup **ukryty** (bez faktu „unknown”) — 5 z 10 szkiców podało
  niepopartą kwotę (wszystkie odrzucone); porażka podana jawnie („not tried:
  the stay could not be read”) — 0 z 10 podało kwotę lub czas; lookup obecny —
  10 z 10 podało właściwy czas i cenę z holdu.
- **Czytanie to nie wysyłanie**: w Issues Enter otwiera szkic, ↑/↓ przewija,
  Enter lub Esc zamyka; żaden klawisz nie wysyła niczego do gościa. Przekazanie
  issue do Main to osobna akcja.
- Podwójne czytanie szkicu: najpierw zakryć prozę i sprawdzić pytanie względem
  faktów (czy właściwy pobyt?), potem odkryć prozę i zignorować liczby (czy
  obiecano coś, czego nikt nie sprawdził?).

### Read an Error Report

- Gość może trafić na błąd i zamknąć kartę bez ticketu. Nieudane żądanie budzi
  **error huntera na kopii aplikacji**; kontrakt: **report, never fix**.
  Powtórzone zdarzenie ma to samo ID → jeden raport.
- Log musi pozwolić **odtworzyć** nieudane żądanie (o co pytał gość), ale bez
  e-maila i numeru karty. W pierwszym przebiegu log nie mówił, o co pytano —
  hunter znalazł *jakąś* porażkę, nie tę oryginalną. Naprawa: zmienić to, co
  aplikacja zapisuje, a nie kazać modelowi brzmieć pewniej. Sprawdzenie jednej
  wartości testowej w logu to kontrola tej ścieżki, nie dowód, że wszystkie logi
  są bezpieczne.
- Ważniejsza od komunikatu błędu jest **granica**: pobyty dotykające jednego
  miesiąca padały (także w innym domu), tuż obok — działały.
- Widget Hunts: karta na polowanie, **numer żądania za każdą linią**. Numery i
  wyniki trzyma kod, nie model z pamięci; odwołanie do numeru, którego nie ma w
  rekordzie, wypada. Karta Johna: **23 żądania — 10 failed, 11 still worked, 2
  neither**; tych dwóch nie wciska się do wygodniejszej kategorii.
- Linia „Replayed the logged error: same failure” łączy raport z błędem, który
  obudził zadanie; czyta się ją osobno od mapy granicy.
- Kontrola: dać czytnikowi **zły zapisany raport** i sprawdzić, czy pokaże
  nieistniejące żądanie jako dowód.
- Przekazanie do Main kończy się: „Read it and tell me what you would check
  first. Do not change any code yet.” Main odpowiada pytaniem. Ale prośba o
  niezmienianie kodu to **prośba, nie blokada narzędzi**. W Herdr ↑/↓ wybiera
  kartę, Enter wysyła ją do Main, R czyta teraz — wybranie to nie wysłanie.
- Gdy podsumowanie twierdzi więcej niż obserwacje: zostawić obserwacje, zwęzić twierdzenie.

## Takeaways

- Lekcja jest o tym, **co jest możliwe i z czego możemy wybierać**, nie o jednym
  workflow. Ćwiczona umiejętność: płynne przechodzenie między szeroką a wąską
  perspektywą.
- Cel: zestaw **prymitywów**, które my albo agenci składamy w nowe zdolności
  systemu — aż do prawie pełnej autonomii.

## Na co uważać

1. Za dużo zdarzeń staje się szumem i agent budzi się bez powodu.
   Zacząć od jednego eventu, jednej akcji, jednego evala; przeglądać i usuwać.
2. To samo zdarzenie dostarczone dwa razy uruchamia pracę dwa razy.
   Nadać eventowi tożsamość; ta sama tożsamość z inną treścią to zmiana, nie retry.
3. Event bez właściciela kończy jako zadanie, które system przypisał na zgadywanie.
   Niejasny właściciel → pytanie do człowieka.
4. Agent dostaje prawo działania, zanim widzieliśmy, co by zrobił.
   Najpierw tryb „co bym zrobił”, uprawnienia dopiero po przeglądzie.
5. Model w każdym kroku pipeline'u robi go wolnym, drogim i niepowtarzalnym.
   Kod wszędzie, model w jednym kroku (zwykle Execute albo Classify).
6. Hook opisany tak, że rozumie go tylko autor.
   Description pisać dla agenta z pustym kontekstem: co się stało i dlaczego to ważne.
7. Hooki przeżywają swoje zadanie i odpalają na cudzych zdarzeniach.
   Expiration w rekordzie; koniec zadania usuwa hooki; hook odpala raz na zdarzenie.
8. Prefetch „na wszelki wypadek” wprowadza sprzeczne dane (stary adres).
   Podawać tylko to, co pasuje do sprawy, resztę jako ID z krótkim opisem.
9. Za mały prefetch daje pewny siebie błąd (potwierdzony duplikat).
   Krok Check: brak wymaganego faktu zatrzymuje krok zamiast puszczać agenta.
10. Nieudany lookup zamieniony w zmyśloną wartość.
    Fakt „unknown” i wynik bez tej wartości — jak szkic Johna bez kwoty.
11. Notatki wewnętrzne w kontekście agenta piszącego do klienta wyciekają w odpowiedzi.
    Dzielić notatki na customer-facing i wewnętrzne; pchać tylko pierwsze.
12. Automatyzacja procesu biznesowego zaprojektowana w pojedynkę.
    Siedem punktów przejść z zespołem; decyzje i rozmowy z klientami zostają u ludzi.
13. Średnia z wielu przebiegów ukrywa ticket, który pada za każdym razem. (Build guide)
    Trzymać wynik każdego przypadku z każdego przebiegu; poprzeczka pass^k.
14. Model wybrany po złej metryce (właściciele zamiast flag pieniędzy).
    Przed próbą zapisać, którego błędu nie wolno przepuścić.
15. Próg strojony i „testowany” na tych samych odpowiedziach.
    Świeże przypadki etykietować przed uruchomieniem; próg zamrozić.
16. Brak odpowiedzi modelu zapisany jako „nie” albo ticket pominięty po cichu.
    Brak odpowiedzi = brak tagu i nieruszona zakładka; coś musi wrócić i dokończyć.
17. Zakładka przesunięta przed zapisem wyniku gubi element; zapis bez tożsamości dubluje go.
    Zakładka na końcu, zapis kluczowany tożsamością.
18. Test, który sam wywołuje zadanie, dowodzi tylko, że działa na żądanie.
    Testować budzenie: watcher działa, test tylko dostarcza zdarzenie; dodać kontrolę „nic nie przyszło”.
19. „Nie mów o tym” zamiast usunięcia z kontekstu — model sparafrazuje.
    Wycinać sekcję przy budowaniu wejścia i sprawdzać wejście.
20. Kwota poprawna, ale nie dla tego gościa (obietnica sprzed podwyżki), albo obietnica w zdaniu bez liczb.
    Trzy sprawdzenia: kwota → lookup, obietnica → hold, słowa → człowiek.
21. Podsumowanie raportu cytuje dowód, którego nie ma w rekordzie.
    Liczby i odwołania liczy kod z zapisanych wyników; „neither” zostaje „neither”.
22. „Nie zmieniaj kodu” w prompcie traktowane jak blokada.
    To prośba; ograniczenie zadania robi się uprawnieniami i pracą na kopii.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | System budzi się sam (event) | Mamy (dwa) | `.claude/settings.json`: SessionStart → `tools/state.ts`; zaplanowane zadanie `mega-dev-heartbeat` codziennie 08:00 → `tools/health.ts`. Poza tym baza budzi się tylko na „mega start” od człowieka. |
| 2 | Map: zdarzenia, których nikt nie czyta | Zrobić | Jednorazowa lista w `context/agent-setup.md`: co już emituje zdarzenia (git: commit/push; `inbox/`: nowy plik; hq.mega.dev: nowa lekcja; Workery mail-agent, away-agent, barwy-tools: żądania i błędy; AgentMail: webhook) i kto je dziś czyta. `tools/health.ts` sam wypisuje Workery pod „Not covered by this run”. Tylko raport. |
| 3 | Select: jeden event, jedna akcja, jeden eval | Zrobić | Kandydat: **nowy plik w `inbox/`** → akcja: plan filowania (która notatka, które linki), bez zmian → eval: człowiek porównuje plan z tym, co potem zrobiła sesja. Dziś `inbox/` czyta tylko `state.ts` przy starcie sesji i heartbeat (liczy, czerwony po 7 dniach). |
| 4 | Unify: jedno wejście, jeden kształt | Mamy (poza bazą) | Własna pętla, krok 8: `subscribe(trigger)` / `wake(event)` i jeden `route()` dla zegara i POST-a ([own-agent-loop](../topics/own-agent-loop.md)). W tej bazie zdarzenia nie mają wspólnego kształtu — przy dwóch źródłach nie warto; wrócić, gdy dojdzie trzecie. |
| 5 | Identify: tożsamość zdarzenia | Mamy (częściowo) | Własna pętla odrzuca duplikat po restarcie (`journal.jsonl`). mail-agent i away-agent wysyłają bez klucza — pozycja Planned „keyed side effects” (S04E01) na [tablicy](../../work/board.md); nie dublować, ta lekcja dodaje tylko regułę „inna treść = zmiana, nie retry”. |
| 6 | Filter: reguły przed modelem | Mamy / Planned | `tools/health.ts` to same reguły (czerwony = błędy `check.ts`, plik w `inbox/` albo niezacommitowana zmiana starsze niż 7 dni) i pisze do człowieka tylko na czerwono. Mały model jako „first look” czeka w Planned (S04E01) i wymaga zmiany Standing choice. |
| 7 | Convert: event → zadanie z właścicielem i odnośnikiem | Mamy (częściowo) | `work/board.md` ma zadania z linkami do notatek, ale raport heartbeatu nie tworzy zadania — czerwony werdykt to tylko powiadomienie. Zrobić: przy czerwonym werdykcie `health.ts` wypisuje gotową linię Planned z linkiem do `work/health/<data>.md`; dopisuje ją główna sesja. |
| 8 | Observe: „co bym zrobił” przed prawem działania | Mamy | Reguła heartbeatu w `CLAUDE.md`: „reports and fixes nothing”; dev-guard pyta przed każdym pushem; Standing choice z 2026-10-28 o działaniach na zewnątrz. |
| 9 | Przegląd i usuwanie zdarzeń/hooków | Zrobić (istniejąca pozycja) | Część oceniająca „weekly health check” (Planned) już ma „list what to remove — rules, hooks, skills”; dopisać do niej zaplanowane zadania i źródła zdarzeń z wiersza 2. |
| 10 | Hook wokół pętli: for / when / then / until | Mamy (wzór, bez „until”) | Dwa hooki w `.claude/settings.json` mają trigger, warunek (`*.md` w projekcie) i odpowiedź, ale są stałe — nie należą do zadania i nie wygasają. Rejestru hooków per zadanie nie ma i przy zadaniach trwających jedną sesję nie jest potrzebny. |
| 11 | Description dla agenta z pustym kontekstem | Mamy (częściowo) | `state.ts` podaje stan na start, `CLAUDE.md` opisuje oba hooki. Zaplanowane zadanie ma własny `SKILL.md` w `~/.claude/scheduled-tasks/mega-dev-heartbeat/` — poza repo, więc niewidoczny po sklonowaniu (pozycja Planned „portability test”, S04E02). |
| 12 | Alert i Approval jako prymitywy | Mamy (rozproszone) | Alert: powiadomienie heartbeatu na czerwono; ntfy w away-agent (z Workera dostaje 429 — Planned, S02E05). Approval: strona zgody na telefon w away-agent, dialog dev-guard. Każdy zbudowany osobno; nie łączyć, dopóki nie pojawi się trzeci przypadek. |
| 13 | Pipeline: kod wszędzie, model w jednym kroku | Mamy (częściowo) | Rutyna „New lesson”: Observe (`mega-start`), Execute (skill `lesson-notes`, model), Verify (`check.ts` — tylko mechanika), Communicate (`log.md`, tablica). Classify i Route robi model z głowy; Verify nie sprawdza treści notatki względem źródła. |
| 14 | Verify: wynik względem dowodu | Zrobić | Mały sprawdzian dla lesson notes: skrypt wyciąga liczby i nazwy własne z notatki i sprawdza, czy występują w pliku z `lessons/` (jak „każda kwota wraca do lookupu”). Ostrzeżenie w `check.ts`, nie błąd. Łączy się z „first black-box expectations” (Planned, S04E01). |
| 15 | Push: fakty z wiekiem, reguły, ostatni przebieg + Check | Mamy (częściowo) | `state.ts` pcha stan (inbox, Active, ostatni wpis logu) — bez wieku i bez „all present?”. Push na dotknięcie pliku czeka w Planned (S04E03, hook PreToolUse dla `tools/**`). Zrobić w `state.ts`: data ostatniego raportu z `work/health/` i jego werdykt jako jedna linia. |
| 16 | Prefetch: ID i krótki opis zamiast treści | Mamy | `index.md` to dokładnie to: ścieżka + jedna linia na notatkę; reguły „Start every lookup at `index.md`” i „Pointers, not copies” w `CLAUDE.md`. |
| 17 | „unknown” zamiast zgadywania | Mamy (częściowo) | Frontmatter `trust: high / medium / low` i ta notatka (`medium`, bo Build guide nieprzeczytany). Brakuje tego w hand-offach — [session-handoffs](../topics/session-handoffs.md). |
| 18 | Build guide | Mamy | Zapisany 2026-11-19 jako [lessons/s04e04-build-guide.md](../../lessons/s04e04-build-guide.md); treść zgodna z plikiem Markdown strony co do bajta (sha256, 38457 bajtów). |
| 19 | Zdarzenie nie nadaje uprawnień; miejsce, w którym zadanie staje | Mamy | Heartbeat „reports and fixes nothing” (`CLAUDE.md`); away-agent ma politykę w kodzie i zgodę z telefonu ([log](../../work/s02e05/log.md)); Host Desk parkuje zadania dla człowieka. |
| 20 | Wynik obok oryginału, oryginał nietknięty | Mamy | `lessons/` (`type: source`, „Not edited”) kontra `knowledge/`; `archive/inbox/` trzyma surowe wrzutki; `work/health/<data>.md` to raporty obok bazy. |
| 21 | pass^k i wynik per przypadek | Mamy (wzór) | `test/eval-search.mjs` w barwy-tools: pass^3 per zapytanie plus kontrole (tablica, Done 2026-11-10). Ten sam wzór czeka w Planned dla opisu skilla `lesson-notes` (10 trafień + 10 near misses). |
| 22 | Reguły → tani model → mocniejszy, na tym samym kluczu | Zrobić (wymaga zgody) | Uściśla Planned „first look” (S04E01): zanim powstanie jakikolwiek model dla `inbox/`, klucz odpowiedzi z dotychczasowych wrzutek w `archive/inbox/` i próba samych reguł. Model dopiero, gdy reguły zawiodą — to zmiana Standing choice „opus do wszystkiego”. |
| 23 | Brak odpowiedzi ≠ „nie”; zakładka na końcu | Mamy (częściowo) | `tools/health.ts` kończy kodem 2 na czerwono, ale gdy sam się wywróci albo zaplanowane zadanie nie ruszy, nikt się nie dowie — brak raportu wygląda jak zielony dzień. Zrobić: `tools/state.ts` ostrzega, gdy najnowszy plik w `work/health/` jest starszy niż 2 dni (łączy się z wierszem 15). |
| 24 | Testować budzenie, nie tylko zadanie | Mamy (częściowo) | Heartbeat sprawdzony w obie strony 2026-11-16 (zielony cicho, podłożony błąd → RED), ale uruchamiany ręcznie; czy zaplanowane zadanie samo odpala o 08:00, widać tylko po plikach `work/health/` (są 2026-11-17 i 2026-11-18). Wiersz 23 zamienia to w stały sprawdzian. |
| 25 | Log pozwala odtworzyć błąd, bez danych prywatnych | Zrobić (istniejąca pozycja) | Workery nie raportują błędów nigdzie; away-agent nie ma dziennika zdarzeń (Planned, S02E05), mail-agent nie ma `traceId` (Planned, S02E04). Przy ich robieniu dodać: linia logu ma ID zdarzenia i to, o co proszono, bez treści maila i adresu nadawcy. |
| 26 | Raport z numerem dowodu za każdą linią | Mamy (częściowo) | Skill `release-signals` wymaga cytowanych id przy każdym werdykcie; lesson notes cytują plik źródłowy, nie miejsce. Wiersz 14 (sprawdzian liczb względem źródła) to ten sam pomysł w kodzie. |
| 27 | Czytanie to nie wysyłanie; prośba to nie blokada | Mamy | dev-guard blokuje i pyta w kodzie (push, `gh`), a nie w prompcie; Standing choice z 2026-10-28 wymaga zgody na każde działanie na zewnątrz. |

## Powiązane

- Tekst źródłowy: [lessons/s04e04-automating-work-beyond-code.md](../../lessons/s04e04-automating-work-beyond-code.md) i [Build guide](../../lessons/s04e04-build-guide.md).
- pass^k i ewaluacje: [s02e05](s02e05-agent-reliability.md).
- Challenge „Leave it running” — https://hq.mega.dev/challenges/leave-it-running (nierozpoczęty).
- Poprzednie lekcje sezonu: [s04e01](s04e01-mechanics-behind-autonomous-systems.md)
  (Specter, dwa budzenia, heartbeat), [s04e03](s04e03-software-factory-staff-the-team.md)
  (hooki w pętli, pull vs push, kontrakty).
- Prymityw Subscriptions: [s03e01](s03e01-mechanics-behind-product-engineering.md)
  i własna implementacja w [own-agent-loop](../topics/own-agent-loop.md).
- Sygnały po wydaniu i pętle zwrotne: [s03e05](s03e05-products-that-learn-after-release.md).
- Stan setupu: [agent-setup](../../context/agent-setup.md); zadania: [tablica](../../work/board.md).
