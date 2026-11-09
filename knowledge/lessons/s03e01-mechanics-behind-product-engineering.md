---
title: "s03e01 — Mechanics Behind Product Engineering"
type: lesson
source: lessons/s03e01-mechanics-behind-product-engineering.md (https://hq.mega.dev/lessons/s03e01/)
updated: 2026-11-09
trust: high
status: active
tags: [product-engineering, outcome, ownership, judgment, primitives, leverage, feasibility-matrix]
links: [../../lessons/s03e01-mechanics-behind-product-engineering.md, s02e05-agent-reliability.md, s02e02-building-an-agent.md, s01e05-building-workflows-not-tool-stacks.md, s01e03-building-knowledge-systems.md, ../topics/own-agent-loop.md, ../../context/agent-setup.md, ../../work/board.md]
---

Gdy agenci piszą prawie cały kod, przewagą przestaje być kod. Liczy się **co
budujemy, jak dobry jest wynik i jak szybko produkt się zmienia**, plus rzeczy,
których LLM nie wygeneruje: dane z prawdziwego świata, użytkownicy, klienci,
reputacja. Pytanie zmienia się z „czy ticket jest zrobiony?” na „czy użytkownik
może teraz zrobić to, czego potrzebuje?” — przejście od **output do outcome**.
Product engineer decyduje, *co produkt musi robić*, żeby rozwiązać problem
wybrany przez PM-a.

Surowy tekst: [lessons/s03e01-mechanics-behind-product-engineering.md](../../lessons/s03e01-mechanics-behind-product-engineering.md).

## Zmiana (The Shift)

- Założenie skrajne: cały proces developmentu jest autonomiczny. Wtedy różnicę
  robi decyzja *co* zbudować, poziom jakości i tempo ewolucji.
- Przykład (rys. 1, aplikacja do notatek ze spotkań): pętla signal → decide →
  set the bar → build with agents → ship and learn, 1 obrót = 9 dni. Klon
  zbudowany w jeden dzień ma te same 24 funkcje, ale 0 użytkowników, 0 klientów,
  zero danych i reputacji; kopiuje tylko krok „build with agents”.
- Nowe wymagania to **velocity** i **adaptability** we wszystkich częściach
  produktu, nie tylko w kodzie.
- **Agenci stają się pośrednikiem między użytkownikiem a aplikacjami** (rys. 2):
  jedno zdanie użytkownika → 6 wywołań (Gmail, Google Search, ffmpeg, skrypt
  napisany w locie, Stripe, Resend), 41 s. Skala: to, co agent napisze sam
  (skrypt na 12 linii) → co szybciej wywołać (ffmpeg) → czego nie da się
  wygenerować (indeks wyszukiwarki, licencje bankowe, reputacja nadawcy, skrzynka).
  Wniosek: software będzie potrzebny dalej, bo jedna osoba będzie mieć floty agentów.

## Ownership

- Agenci ogarniają jakość, wydajność i bezpieczeństwo, ale **kształt systemu**
  wciąż jest decyzją człowieka. Prymitywy (S02E02) wymagają znajomości domeny i
  użytkowników, nie tylko inżynierii.
- Przykład: **Subscriptions** w Grok Bot (talk Jediaha Katza). Jeden prymityw
  obsługuje e-mail, komunikatory, PR review, alerty i harmonogramy:
  `subscribe(trigger)` / `wake(event)`, a w środku uprawnienia, routing do
  właściwego agenta, dedupe, filtrowanie szumu, budzenie.
- Pułapka (rys. 4): prośba „zintegruj z e-mailem i kalendarzem” → gateway z
  adapterami: 2 → 4 → 6 adapterów, 3 + 5 + 8 = 16 dni i 6 adapterów do
  utrzymania. Wersja outcome: jeden prymityw, 4 + 1 + 0 = 5 dni, bo ostatnie
  źródła agent dodaje sam w runtime.
- PM decyduje **który problem i dlaczego**; PE decyduje **co produkt musi
  robić**. Wspólne pole (rys. 5): wartość biznesowa, zakres, wpływ na
  użytkownika, założenia i tradeoffy.
- Pytania produktowe dla PE: czy ta funkcja powinna istnieć? czy jest jeszcze
  potrzebna? jak połączyć funkcje? co daje najwięcej wartości? co powoduje churn?
- To płynne przejście, nie zmiana roli: większość kodu i produktów nie jest
  gotowa na autonomiczny development. Sygnały postępu: produkt bliżej potrzeb,
  użytkownicy widzą szybsze zmiany, kod się upraszcza (generalizacja, usuwanie
  funkcji), biznes ma więcej narzędzi do pozyskania i utrzymania klientów.

## Judgement

- AI zmieniło reguły: to, co kiedyś było całym produktem, dziś każdy wygeneruje.
  PE musi sięgać szerzej (biznes, produkt) i głębiej (niskopoziomowe szczegóły,
  nieznane technologie).
- **Unknown unknowns** (rys. 7): LLM może podsuwać pytania, o których nie
  wiedzieliśmy, że chcemy je zadać (skill `unknown-unknowns` w repo
  overment/skills). Skill może skrócić pętlę: krótkie wiadomości zamiast ściany
  tekstu, na żądanie mapa myśli, wireframe albo PoC jako artefakt (rys. 8,
  przykład „Offline mode”: gałęzie Conflicts i Sync status jako high signal).
- Decyzje produktowe potrzebują kontekstu spoza modelu i spoza kodu — stąd
  systemy wiedzy (S01E03). Kilku agentów z różnymi modelami może pracować razem
  nad dokumentem `.html` z opcjami do wyboru.
- Narzędzia decyzyjne: **feasibility matrix**, macierz Eisenhowera, drzewo
  decyzyjne, pre-mortem. Przykład (rys. 6): wartość × złożoność, cieniem ryzyko.
  Pojedyncze integracje: niska złożoność, niska wartość. Gateway: więcej
  złożoności, mało więcej wartości, wysokie ryzyko. Subscriptions: wysoka
  złożoność, wysoka wartość, średnie ryzyko. Nowe źródło jako subskrypcja:
  niska złożoność, wysoka wartość, niskie ryzyko — bo stoi na prymitywie.
- Dobry osąd to nie trafienie za pierwszym razem, tylko wybór następnego kroku,
  który odkryje najwięcej niewiadomych przy rozsądnym koszcie.

## Leverage

- Środowisko, w którym agenci sami weryfikują pracę (S01E05), to rdzeń. Ale
  wszystko to jest bezużyteczne, jeśli budujemy złą rzecz.
- „Getting Real” (2006): najlepsi to ci, którzy wiedzą, **co po prostu nie ma
  znaczenia**. Kod łatwo usunąć, ale tego, co trafiło do użytkowników, nie
  cofniemy — tu chodzi o ich zaufanie.
- Fundamenty dźwigni:
  - **Telemetria** — agenci muszą dostawać szczegóły aktywności użytkowników.
  - **Feedback użytkowników** — support, rozmowy, zgłoszenia, także transkrypty
    rozmów z ludźmi, którzy nie zostali klientami.
  - **Kontekst biznesowy** — cele, kierunek, rynek; bez tego nie ma dobrych prymitywów.
  - **Analityka produktowa** — profile użytkowników, podobne produkty (wiedza PM-ów).
  - **Środowisko agentów** — to z S01E05, na zdalnych maszynach lub w chmurze;
    bez niego o autonomii nie ma co myśleć.
  - **Labs** — proste aplikacje html/css do zabawy pomysłami, wbudowane w
    budowany produkt (jak artefakty w Claude, ale u siebie).
  - **Beta channel** — wersja nightly, gdzie funkcje przychodzą i odchodzą.
- Sprawdzić, co już mamy (systemy, zasoby, narzędzia) i przygotować je na
  większe tempo i na agentów działających w imieniu użytkowników (agentready.org).
- Plan: zwykle stopniowo, a potem nagle przesunąć produkt w stronę ery agentów;
  czasem odważna decyzja o nowej wersji systemu.

## Wnioski

Autonomiczny development to nie koniec pracy inżyniera, tylko kolejny rozdział.
Lektury: Getting Real, Empowered, The Mom Test, Shape Up.

## Na co uważać

1. Robienie dokładnie tego, o co poproszono, daje output, nie outcome (gateway z 6 adapterami, 16 dni).
   → Przed budową zapytać: jaki prymityw obsłuży tę prośbę i następne podobne?
2. Szybkość z agentami pozwala szybko jechać w złą stronę.
   → Najpierw ustalić, „co nie ma znaczenia”, i tego nie robić; mierzyć efekt po wdrożeniu.
3. Wdrożonych rzeczy nie da się cofnąć jak kodu — zaufanie użytkowników nie ma `git revert`.
   → Nowe funkcje najpierw w lab albo beta channel.
4. Model i sam kod nie mają kontekstu decyzji produktowych.
   → Decyzje opierać na systemie wiedzy (S01E03), nie na wiedzy bazowej modelu.
5. Szukanie prymitywu kosztuje dodatkowy wysiłek i kontekst z zewnątrz (biznes, użytkownicy, research).
   → Liczyć to jako część pracy, nie jako opóźnienie.
6. Autonomia bez gotowego środowiska (weryfikacja, zdalne maszyny) to iluzja.
   → Najpierw środowisko z S01E05, potem floty agentów.

## Do zastosowania w tym setupie

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Outcome zamiast output | Mamy | Standing choice na [tablicy](../../work/board.md): Challenge jest zrobiony, gdy kurs przyjmie claim, nie gdy praca „wygląda na skończoną”. |
| 2 | Feasibility matrix / „co nie ma znaczenia” | Zrobić | Lane Planned ma ~25 pozycji bez oceny. Ocenić każdą: wartość, złożoność, ryzyko (artefakt HTML z macierzą), wybrać 3 na najbliższy tydzień, resztę, która nic nie da, przenieść do Archived z powodem. |
| 3 | Prymityw Subscriptions zamiast adapterów | Zrobić | Mamy trzy osobne wejścia: mail-agent (AgentMail), away-agent (podpisany HTTPS inbox + zatwierdzanie z telefonu), planowany `schedule.yaml` w [własnej pętli](../topics/own-agent-loop.md). W pętli zamiast `schedule.yaml` zrobić jeden `subscriptions.yaml` z `subscribe(trigger)` / `wake(event)` (typy: schedule, webhook, mail), dedupe i filtr. Rozszerza istniejący Planned S02E02. |
| 4 | System wiedzy jako kontekst decyzji | Mamy | Ta baza: `index.md`, notatki lekcji, Standing choices; skill `lesson-notes` w `.claude/skills/`. |
| 5 | Unknown unknowns (skill z pytaniami) | Zrobić | Przeczytać skill `unknown-unknowns` z github.com/overment/skills i zdecydować, czy dodać go jako skill projektu (link do źródła, nie kopia bez przeglądu). Pobranie kodu z zewnątrz → wymaga zgody człowieka. |
| 6 | Labs (szybkie prototypy html/css) | Mamy narzędzie | Narzędzie Artifact i przeglądarka w aplikacji Claude są dostępne; brakuje nawyku. Przy następnej funkcji w Challenge najpierw jeden artefakt-lab z opcjami, potem kod. |
| 7 | Telemetria | Zrobić (już na tablicy) | Planned: `traceId` w mail-agencie (S02E04) i eksperyment z Langfuse (S02E05). Bez nowych pozycji. |
| 8 | Środowisko agentów zdalnie / w chmurze | Mamy | Workery na Cloudflare (mail-agent, away-agent, barwy-tools), sesja w chmurze Claude Code użyta w S02E04. |
| 9 | „Czy to jest jeszcze potrzebne?” | Zrobić (już na tablicy) | Planned: cotygodniowy health check z listą rzeczy do usunięcia (S02E03, item 4). Dopisać do niego pytanie o działające Workery: czy któryś można wyłączyć. |

## Powiązane

- Poprzednia lekcja: [s02e05](s02e05-agent-reliability.md) (telemetria i evale jako fundament).
- [s02e02](s02e02-building-an-agent.md) (prymitywy agenta: Event, Schedule, Channel), [s01e05](s01e05-building-workflows-not-tool-stacks.md) (środowisko samoweryfikacji), [s01e03](s01e03-building-knowledge-systems.md) (systemy wiedzy).
- Temat: [własna pętla agenta](../topics/own-agent-loop.md).
- Setup: [agent-setup](../../context/agent-setup.md), [tablica](../../work/board.md).
- Challenge tej lekcji: „status for the night” — https://hq.mega.dev/challenges/status-for-the-night (nie rozpoczęty).
