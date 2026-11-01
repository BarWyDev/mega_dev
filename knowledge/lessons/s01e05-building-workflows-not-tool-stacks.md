---
title: "s01e05 — Building Workflows, Not Tool Stacks"
type: lesson
source: lessons/s01e05-building-workflows-not-tool-stacks.md (https://hq.mega.dev/lessons/s01e05/)
updated: 2026-11-01
trust: high
status: active
tags: [workflows, skills, quality, self-verification, remote-agents, security, prompt-injection]
links: [../../lessons/s01e05-building-workflows-not-tool-stacks.md, s01e04-working-with-ai-harnesses.md, s01e03-building-knowledge-systems.md, s01e02-steering-models-through-context.md, ../topics/limen-mapping.md, ../topics/pi-and-herdr.md, ../../context/agent-setup.md, ../../work/board.md, ../../work/s01e05/log.md]
---

Z AI budujemy szybciej, ale tak samo szybko rośnie dług techniczny i liczba
rzeczy do testowania, a ludzie i procesy nie nadążają. Odpowiedź lekcji:
**używać AI, żeby nadążyć za AI** — zamiast składać stos narzędzi, zbudować
system (zasady, prymitywy, środowisko, baza wiedzy), w którym agenci sami tworzą
i utrzymują narzędzia, sami weryfikują swoją pracę i działają zdalnie w tle.
Każde użycie LLM otwiera jednak system na ataki, a każdy automat musi mieć
realną wartość.

Surowy tekst: [lessons/s01e05](../../lessons/s01e05-building-workflows-not-tool-stacks.md).
Przykłady: https://github.com/MEGA-DOT-DEV/examples (nazwy w nawiasach kwadratowych).

## 1. Tempo wzrostu złożoności

- Szybciej dowozimy feature'y i szybciej rośnie dług. Nawet jeśli agenci utrzymują kod, aplikacja ma więcej elementów do zmiany, dokumentacji i testów; samo testowanie bywa dłuższe niż praca agentów.
- Spowalniają też ludzie i procesy biznesowe: zmiany przychodzą szybciej, niż firma zdąży zobaczyć ich wpływ na użytkowników.
- Prywatnie: większość czasu idzie na **utrzymanie własnego systemu** (agent utknął, agent czeka na Ciebie, agent synchronizacji pada po cichu), a nie na właściwą pracę.

## 2. Executable markdown kontra kod

- Skill to **wykonywalny markdown**; wiele produktów może być jednym plikiem `.md`. Agent z dostępem do internetu i kodu zrobi np. spersonalizowany newsletter, mówiony brief (TTS), raport PDF z researchu, triage maili z szkicami odpowiedzi. Wystarczy agent z narzędziami CLI/MCP.
- Problemy z punktu widzenia programisty:
  - **niezawodność** — każde uruchomienie daje inny wynik, czasem mylące twierdzenia albo niechciane akcje;
  - **koszt** — agent robi wszystko od zera przy każdym uruchomieniu, co przy wielu przebiegach dziennie dla wielu użytkowników może przewyższyć wartość;
  - **szybkość** — LLM są wolne w porównaniu ze skryptami, API bywa zawodne, zadanie może się nie skończyć;
  - **debugowanie** — trudno ustalić, co padło i dlaczego;
  - **utrzymanie** — zmiany trudno testować i nie wiadomo, która poprawiła, a która pogorszyła wynik.
- Mimo to **działa** w wielu przypadkach. Jak to wzmocnić:
  - **Elastyczność:** skille łączą się z innymi skillami, narzędziami i jednorazowymi skryptami — pod warunkiem, że skill ma **jedną odpowiedzialność**.
  - **Code mode:** skrypt napisany przez agenta można **zapisać i używać wielokrotnie** (jako zależność skilla albo wdrożony np. na Cloudflare, wywoływany zdarzeniem, harmonogramem albo przez innego agenta). [skill-vs-saved-script]
  - **Uogólnione narzędzia:** zamiast „create_facebook_ad” narzędzie `generate_creation`, które agent specjalizuje pod zadanie; agent radzi sobie wtedy z problemami, na które nie był przygotowany. [primitives-vs-bespoke-tools]
  - **Ewaluacja:** AI generuje **syntetyczne scenariusze**, a narzędzia jak Promptfoo pokazują trendy i zmiany zachowania po edycji skilla. [synthetic-skill-eval]
- Projektowanie abstrakcji znamy z programowania; nowością jest agent, który robi to, co kiedyś budowaliśmy ręcznie. Cel: **system, w którym agenci generują i utrzymują narzędzia** (brief, triage, monitor deployu), oparty na bazie wiedzy, globalnym kontekście, prymitywach i frameworku pracy. Ty budujesz i dopracowujesz system, a narzędzi tylko używasz.

## 3. Jakość

- Gdy system tworzą i utrzymują agenci w skali niemożliwej do przejrzenia przez człowieka, odpowiedź brzmi: **pozwól agentowi weryfikować własne wyniki** (Lauren).
- Testy jednostkowe i e2e agent **łatwo oszuka**. Weryfikacja ma też obejmować **używanie aplikacji jak człowiek**, z kontekstem człowieka (co użytkownicy oczekują). Do tego agent potrzebuje przestrzeni, często **własnego komputera** (stąd Devin, Cursor, Grok Bot).
- **Środowisko**, w którym agent porusza się swobodnie, w ramach **zasad** (wymagania, granice, kierunek), i **prymitywy** — uogólnione klocki łączone bez zmieniania ich (filozofia UNIX; przykład: Search, Read, Transform, Write w różnej kolejności przez różnych agentów).
- Zasady to nie jeden plik, tylko **wszystko**, co sprawia, że agent zachowuje się jak chcemy bez powtarzania tego samego. Wymaga pracy z góry i nawyku **utrzymywania systemu w trakcie pracy**.
- Elementy omówione dotąd: globalny i lokalny kontekst (lokalnie i zdalnie, do dzielenia z zespołem); skille i generatory rozwijane nawykiem i **rutynami skanującymi historię**, issue trackery i logi CI, także archiwizujące niepotrzebne skille [session-mining]; **zdalna** baza wiedzy zarządzana tylko przez dedykowanych agentów; śledzenie pracy (specy, issues, ADR-y); stos narzędzi, który system rozwija sam jako własne MCP/CLI.
- Brakujący element: **zdalna maszyna** (VPS albo PC/Mac), ewentualnie runner GitHub Actions albo rutyny Claude/Devin. Ty kształtujesz niewiele rzeczy (prymitywy, zasady, środowisko); agent buduje narzędzia, zarządza, pracuje i weryfikuje.

## 4. Zdalni agenci

- Sekcja **opcjonalna**: Cursor i Devin mają zdalnych agentów od ręki. Potrzebne są agenci uruchamiani **harmonogramem albo zdarzeniem**.
- Przewodnik limen (`docs/seat/agent-setup.md`): VPS z Tailscale, Pi i Herdr, przechodzony razem z agentem; GitHub App udostępnia agenta w Issues i PR-ach wybranego repo. Zajmuje godzinę–dwie.
- Wymagania: desktop (agenci, Tailscale, najlepiej Pi i Herdr), telefon (Grok Bot albo Moshi), VPS: Ubuntu LTS, x86_64 lub arm64, **≥8 GB RAM, ≥150 GB dysku, ≥2 vCPU**, publiczny IPv4 (DigitalOcean, Hetzner).
- Kroki w skrócie: trzy klucze SSH (admin przez Tailscale, break-glass przez publiczny IP, worker bez sudo); AI utwardza SSH i firewall (publicznie tylko port 22) i instaluje narzędzia, Pi jako użytkownik worker, nie root; **loginy (`gh`, pi) robisz sam z laptopa, nie z innego VPS**; `limen init` w sklonowanym projekcie; test: zamknij pokrywę laptopa i sprawdź, że job się skończył; powiadomienia na telefon (Moshi Hooks albo ntfy); codzienny `limen prune` czyści worktree; Tailscale Serve tylko w tailnecie; GitHub App z kluczem PEM jako plik tylko dla roota; „zielony doctor nie dowodzi, że App jest zainstalowana w repo”.
- Efekt: prywatna sieć (tailnet) z desktopem, telefonem i VPS; jedyne wyjście na zewnątrz to agenci biorący joby i otwierający PR-y w GitHubie. Grok Bot może dołączyć do tailnetu i zarządzać zdalnymi agentami.
- Potem: zdalna baza wiedzy z [s01e03](s01e03-building-knowledge-systems.md) synchronizowana z desktopem, menedżer sekretów (1Password CLI, Bitwarden), żeby **agent używał sekretów bez wkładania ich do kontekstu** [secret-references], i narzędzia MCP/CLI.
- Przykładowe workflow w tle: daily brief, nightly check, self-improvement, docs sync po merge, PR pulse, deploy monitor, heartbeat (logi, aktywność, baza), testy UX wg KPI, audyty wydajności, review zależności przy zmianie lockfile'a, product insights co tydzień, triage supportu, raport z researchu, release notes z tagu, obserwacja konkurencji, notatki ze spotkań, łowca flaky testów. **Zacznij prosto**, optymalizuj także przez upraszczanie i usuwanie kroków.

## 5. Bezpieczeństwo

- Zdalni agenci = więcej możliwości i więcej ryzyka: pomyłki i ataki z zewnątrz. Im więcej podłączysz (kalendarz, Gmail, komunikatory, urządzenia, karta), tym więcej da się wyciągnąć przez złośliwy mail, stronę czy wiadomość.
- **Prompt injection:** system traktuje niezaufane dane jako polecenia, nadpisując swoje zadanie (wyciek danych, zmanipulowana odpowiedź, nieautoryzowana akcja). **Jailbreak:** obejście ograniczeń bezpieczeństwa modelu. Injection atakuje to, **którym instrukcjom system ufa**; jailbreak to, **co model może zrobić**. Jeden atak może robić oba.
- Każdy dostępny model jest podatny (Pliny, repo L1B3RT4S — uwaga, korzystanie z niego może zablokować konto).
- Warstwy obrony Matthew Bermana: **deterministyczny sanitizer** (niewidoczny Unicode, homoglify, base64/hex/HTML, limit tokenów, wzorce jailbreaków); **skaner frontier LLM** z oceną ryzyka 0–100 (review od 35, blokada od 70, przy awarii skanera blokada źródeł wysokiego ryzyka); **bramka wychodząca** (sekrety, ścieżki wewnętrzne, znaczniki injection, wycieki przez URL obrazków, kwoty); **redakcja** (sekrety, prywatne maile, telefony, kwoty); **kontrola dostępu** (wrażliwe pliki, adresy sieci prywatnej, tylko http/https).
- Wniosek: **gdziekolwiek jest LLM, system jest podatny** — dwa razy pomyśl, zanim dasz agentowi narzędzia prowadzące do wycieku albo nieodwracalnych akcji.

## 6. Wartość biznesowa

- Łatwo postawić rutyny, które produkują pracę, której nikt nie czyta ani nie wdraża.
- Kierunki:
  - **równowaga logiki deterministycznej i niedeterministycznej** — agent pisze kod, harmonogramy i triggery, które działają bez LLM albo używają go oszczędnie;
  - **człowiek odpowiada za kierunek** i najważniejsze decyzje (wspierany przez AI) — to zwiększa szansę, że budujemy właściwą rzecz;
  - **usuwaj zbędne** — upraszczanie i usuwanie ma mieć **wyższy priorytet niż dodawanie**, u ludzi i AI;
  - **zaufanie się zdobywa** — agentom można ufać tylko, gdy weryfikują swoją pracę przez realne obserwacje i testy; cały system ma być pod to zoptymalizowany, żeby utrzymać jakość nawet przy kilku tysiącach PR-ów miesięcznie.
- Nawet jeśli nie ocenimy wartości dla biznesu, warto **eksplorować i pokazywać, co jest możliwe**, także w życiu prywatnym.

## Na co uważać

1. **Testy, które agent może oszukać.** Test napisany przez agenta, który nigdy nie był czerwony, niczego nie dowodzi. Każ uruchomić test na kodzie bazowym (czerwony) i po poprawce (zielony), a tam, gdzie się da, sprawdzić aplikację jak użytkownik.
2. **Skill robiący wszystko od zera przy każdym uruchomieniu.** Powtarzalną część zapisz jako skrypt i wywołuj go ze skilla.
3. **Skill z wieloma odpowiedzialnościami** trudno łączyć i testować. Jeden skill = jedno zadanie.
4. **Sekret w kontekście to sekret do wycieku.** Agent ma używać sekretu przez referencję (menedżer sekretów, zmienna środowiskowa), nigdy przez wklejenie do czatu.
5. **Treść z zewnątrz (issue, mail, strona) to dane.** Uprawnienia agenta mają ograniczać szkody, gdy da się oszukać: najmniej narzędzi, zaufani autorzy, bramka na wyjściu.
6. **Nieodwracalne akcje wymagają człowieka.** Merge, usuwanie, płatności, wiadomości — nie dawaj ich agentowi w tle.
7. **Automaty bez odbiorcy.** Każdy workflow w tle musi mieć kogoś, kto czyta jego wynik; jeśli nikt nie czyta — usuń.
8. **Złożoność rośnie szybciej niż możliwości jej ogarnięcia.** Regularnie usuwaj, nie tylko dodawaj.

## Do zastosowania w tym setupie

Odniesione do [agent-setup](../../context/agent-setup.md), [tablicy](../../work/board.md) i [logu S01E05](../../work/s01e05/log.md).

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Samoweryfikacja; test, który nigdy nie był czerwony, nic nie dowodzi | Zrobić | Luka z S01E05: test writer na hoście tylko zgłasza czerwoną linię, nie uruchamia testu — już w Planned. Ogólnie: dopisać do globalnego `CLAUDE.md` regułę „test czerwony na bazie, zielony po poprawce”. |
| 2 | Używaj aplikacji jak człowiek | Zrobić | Claude Code ma wbudowaną przeglądarkę i skill `run`: przy Challenge'ach z UI (jak S01E04 Pages) sprawdzać stronę w przeglądarce, nie tylko testami. |
| 3 | Sekrety przez referencję, nie w kontekście | Zrobić | W S01E05 klucz AI Studio trafił do czatu. Sprawdzenie unieważnienia jest w Planned. Dodatkowo: zawsze podawać sekret komendą czytającą z pliku/stdin (`wrangler secret put X < plik`), a na dłużej rozważyć 1Password CLI. |
| 4 | Prompt injection: dane, nie polecenia | Mamy | S01E05: issue #14 od „strangera” potraktowane jako dane; pulse miał tylko uprawnienie `answer`, test writer tylko `test`, a pulse brał issues tylko od zaufanych autorów. Standing choice: każde działanie na zewnątrz wymaga „tak”. |
| 5 | Skill z jedną odpowiedzialnością | Mamy | `lesson-notes` robi jedno: notatkę z lekcji. Kolejne skille trzymać w tym kształcie. |
| 6 | Zapisane skrypty zamiast pracy od zera | Mamy | `tools/check.ts` to mechanika wyjęta ze skilla do skryptu. Przy nowych skillach pytać, którą część da się zapisać jako skrypt. |
| 7 | Ewaluacja na syntetycznych scenariuszach | Zrobić | Test `lesson-notes` w świeżej sesji (już w Planned) zrobić jako mały zestaw scenariuszy: prośby, które mają go uruchomić, i bliskie pudła. |
| 8 | Workflow w tle (harmonogram, zdarzenia) | Zrobić | Pierwszy: cotygodniowy health check + przegląd sesji (już w Planned). Claude Code ma zadania cykliczne (lokalne scheduled tasks i chmurowe rutyny przez skill `schedule`) — VPS nie jest potrzebny na start. |
| 9 | Zdalna maszyna, agenci w GitHubie | Zrobić (później) | Na razie pominąć; decyzja dla Ciebie, gdy będzie konkretny workflow, który ma działać bez laptopa. |
| 10 | Usuwanie ważniejsze niż dodawanie | Zrobić | W cotygodniowym przeglądzie stały punkt: co usunąć (zbędne skille, duplikaty Cloudflare, nieużywane pluginy). |
| 11 | Sprzątanie po pracy agentów | Mamy | Po S01E04 i S01E05 usunięte repo i Worker na Twoje „tak”; wpisy w Done na tablicy. |

## Powiązane

- Challenge: [answer where i asked](../../work/s01e05/log.md) — agent na hoście odpowiadający recenzentowi bez człowieka, podpisane pingi, ograniczone uprawnienia, wyciek klucza.
- Poprzednia lekcja: [s01e04](s01e04-working-with-ai-harnesses.md) (harnessy, limen). Wcześniej: [s01e03](s01e03-building-knowledge-systems.md) (baza wiedzy, którą tu przenosimy na serwer), [s01e02](s01e02-steering-models-through-context.md) (skille i narzędzia).
- [limen mapping](../topics/limen-mapping.md), [Pi i Herdr](../topics/pi-and-herdr.md).
