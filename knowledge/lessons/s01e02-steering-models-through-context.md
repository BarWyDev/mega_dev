---
title: "s01e02 — Steering Models Through Context"
type: lesson
source: lessons/s01e02-steering-models-through-context.md (https://hq.mega.dev/lessons/s01e02/)
updated: 2026-10-31
trust: high
status: active
tags: [context, harness, skills, tools, subagents, workers, self-improvement]
links: [../../lessons/s01e02-steering-models-through-context.md, s01e01-mechanics-behind-generative-ai.md, s01e03-building-knowledge-systems.md, ../../context/agent-setup.md, ../../work/board.md, ../../work/s01e02/log.md, ../topics/session-handoffs.md, ../topics/limen-mapping.md]
---

Jakość pracy agenta zależy od kontekstu, ale lekcja dodaje drugą stronę: ile
kontekstu musimy trzymać w głowie my. Kilka agentów naraz zasypuje nas
decyzjami, zaczynamy akceptować wszystko i powstaje slop. Rozwiązanie to
zrozumieć, co agent naprawdę widzi, i ustawić harness (AGENTS.md, pamięć,
skille, narzędzia, subagenci) tak, żeby kontekst był krótki, trafny i dowożony
automatycznie. Informacja w kontekście nie znaczy, że zostanie użyta.

Surowy tekst: [lessons/s01e02](../../lessons/s01e02-steering-models-through-context.md).
Przykłady do uruchomienia: https://github.com/MEGA-DOT-DEV/examples (nazwy w nawiasach kwadratowych).
Podstawy mechaniki (tokeny, kompakcja, okno kontekstu): [s01e01](s01e01-mechanics-behind-generative-ai.md).

## 1. Personalizacja harnessu

Na starcie sesji model nic o nas nie wie. Pliki tekstowe w systemie plików to
**prymitywy zarządzania kontekstem**, a skoro agent może je edytować, może też
zmieniać własne ustawienia.

- **Co widzi Claude Code** (uproszczenie z lekcji): system prompt, dane środowiska, MEMORY.md, narzędzia załadowane i odroczone (deferred), skille, agenci, a w trakcie rozmowy `system-reminder`, wyniki narzędzi, output hooków, treść skilli i raporty agentów. Przy limicie starsze tury zamieniają się w podsumowanie. Każdy element ma inny poziom zaufania: reguły, prośby, wskazówki, same dane.
- To nie jest tajemnica: **można zapytać agenta**, jak widzi naszą interakcję. [context-self-report]
- Co zwykle da się skonfigurować:
  - **Core file (AGENTS.md / CLAUDE.md):** ładowany na początku każdej rozmowy; przegląd projektu, wskaźniki do dokumentów, konwencje. **Prowadzi agenta, ale nie gwarantuje, że wykona każdą regułę.** [agents-md-onboarding]
  - **Pamięć:** różne mechanizmy, często zapisywana automatycznie albo na prośbę.
  - **Konfiguracja:** harnessy są samokonfigurowalne, więc można **rozmawiać z agentem o nim samym** i dobrać ustawienia; agent może też sam je zmieniać pod zadanie.
  - **Baza wiedzy:** pliki o produkcie i procesach, luźno związane z harnessem; z Astro/Next można z nich zrobić stronę dla ludzi.
  - **Skille:** folder z SKILL.md i skryptami; mogą odwoływać się do innych skilli; istnieją „skille do tworzenia skilli”.
  - **CLI / MCP:** rozszerzają możliwości (szerzej w kolejnych lekcjach).
- Ponadto rozszerzenia i **hooki** podpięte pod niemal każdy etap interakcji. AI może je zbudować za nas, ale trzeba wiedzieć, kiedy w ogóle są potrzebne.
- **Samodoskonalący się system:** agent okresowo skanuje historię rozmów, pamięć i własne możliwości i proponuje usprawnienia. Nasza rola: **pilnować, żeby system był jak najprostszy.**

## 2. Jak działa kontekst

- **Dostępne ≠ użyte ≠ wykonane.** Instrukcja może być przestrzegana na początku, a później ignorowana; model wraca do domyślnego zachowania (przykład: „używaj punktów, zakończ ‘Check needed’” — po dłuższej rozmowie punkty zostają, zakończenie znika). [instruction-drift]
- **Limit okna obejmuje wejście i wyjście.** Jeśli zapytanie zajmuje 95%, a rozumowanie, narzędzia i odpowiedź przekroczą pozostałe 5%, jest błąd. Harnessy tego pilnują i jednocześnie optymalizują tokeny, przez co coś, co uważamy za dostępne, może nie trafić do modelu. [silent-context-loss]
- Prompt **nie jest wykonywany linia po linii** jak kod; to, co dzieje się w środku modelu, nie jest w pełni zrozumiane.
- Pięć nakładających się przyczyn, czemu agent „nie słucha”: **uwaga** (relacje między regułami i faktami), **wykonywanie instrukcji**, **problemy z kontekstem** (harness coś wyciął lub ukrył), **brakujący kontekst** (nigdy nie podany), **rozumienie ogólnego kontekstu** (inna interpretacja pojęć, szczegóły obrazów, „ciche” błędy przy czytaniu stron i dokumentów).
- Większość z tego jest poza naszą kontrolą. Zasada praktyczna: **rozmowy jak najkrótsze.** Wykres z lekcji: **smart zone do ok. 30%** okna, **między 30% a 50% zacznij nowy wątek**, poniżej 50% „context rot” i kompakcja.
- Nowy wątek oznacza, że agent musi odkryć kontekst od nowa; skille (i baza wiedzy) skracają to odkrywanie.

## 3. Projektowanie i generowanie skilli

- Przykłady: skills.sh, wskazówki: agentskills.io. **Sprawdzaj skille przed instalacją** — złośliwe skille potrafią ukrywać instrukcje przed recenzentem (artykuł VirusTotal).
- **Nazwa i opis** to najważniejsza część: tylko je agent czyta, decydując o użyciu. Nazwy łatwo się nakładają; zacznij prosto (przykład `crm-api`: krótki opis, krótkie ciało — gdzie są docsy i jak się uwierzytelnić).
- Gdy skill nie odpala albo odpala się źle: poproś agenta o poprawienie opisu. Najlepiej nawyk albo **harmonogram**, który skanuje historię rozmów pod kątem skilli do poprawy lub nowych.
- **Długość:** długie skille z internetu — szansa, że model wykona wszystkie instrukcje, jest bliska zeru. Najlepsze są krótkie i jasne. Coś złożonego → **router skill**, który wskazuje inne skille ładowane tylko w razie potrzeby (np. ask-matt).
- **Szczegółowe instrukcje częściej szkodzą:** są ignorowane lub źle rozumiane, odbierają elastyczność, trudno je utrzymać, zawierają rzeczy, które się dezaktualizują, rozpraszają agenta.
- Zamiast tego:
  - **zasady** i „sposób myślenia”, które agent dopasuje do sytuacji;
  - **dostęp do dynamicznych zasobów** — zamiast wklejać dokumentację narzędzia, powiedz, jak ją łatwo pobrać;
  - **semantic anchors** — słowa niosące całe skojarzenia („Noir”: cienie, cynizm, moralna niejednoznaczność) [semantic-anchors];
  - **self-steering** — skill każe modelowi zadać sobie pytania i odpowiedzieć, by zbudować kontekst.
- Modele dobrze **formułują**, słabo **kompresują, uogólniają i upraszczają**. Dobry skill wymaga iteracji z człowiekiem.
- **skill-shaper** (meta-skill autora): (1) czy to w ogóle ma być skill, a nie skrypt lub reguła, (2) dopasuj do istniejących skilli bez nakładania, (3) wyobraź sobie, jak zawiedzie, (4) wybierz sterowanie: pojęcia i pytania dla pracy wymagającej osądu, dokładne kroki dla pracy kruchej, (5) **test w świeżej sesji**, który dzieli zapytania na trafienia i bliskie pudła.
- Skille i agenci mogą być globalne albo per projekt.

## 4. Użycie narzędzi od środka

- **Natywne i własne:** harness ma kilka wbudowanych narzędzi; resztę dokładają MCP, CLI i własne skrypty.
- **Odkrywanie:** albo wszystkie schematy JSON w kontekście (od razu gotowe, ale zawsze zajmują miejsce), albo **narzędzie do wyszukiwania narzędzi** (pusty kontekst na starcie, ale dodatkowy krok). To drugie prowadzi do code mode / programmatic tool use.
- **Zapytanie:** model wybiera narzędzie i generuje payload, także kilka wywołań równolegle. Kształt jest walidowany schematem, **wartości pochodzą z kontekstu i wiedzy bazowej**, więc mogą być zmyślone. Model można też oszukać, żeby wyciągnął dane jednym narzędziem i wyniósł innym: **prompt injection** to wciąż otwarty problem, podatne są wszystkie modele.
- **Odpowiedź:** wszystko, co zwróci narzędzie, staje się kontekstem i wpływa na zachowanie. Wyjątek: za duży wynik harness zapisuje do pliku, a agent może przeczytać tylko jego część.
- **Wskazówki w odpowiedzi:** skoro to model decyduje, co wywołać, odpowiedź narzędzia powinna zawierać nie tylko dane, ale też **podpowiedzi, co dalej** (np. „są kolejne wyniki, użyj kursora `next_2`”, „`read_doc(id)` zwraca pełny tekst”). [tool-feedback]
- **Błędy:** nie rzucaj wyjątku, tylko oddaj szczegóły błędu modelowi, żeby mógł się poprawić albo zapytać człowieka. Do użytkownika trafiają tylko błędy systemowe (np. brak połączenia z LLM).

## 5. Subagenci i workerzy

- **Subagent:** agent uruchamia innego agenta w locie albo wywołuje istniejącego; subagent może **forkować** bieżący wątek albo dostać **świeży** [fork-or-fresh-subagent], może mieć inny model lub poziom rozumowania. Technicznie to **jedno z natywnych narzędzi**: wywołanie → do głównego wątku wraca tylko wynik, a długi kontekst subagenta zostaje u niego (przykład: audyt auth, billing, search jako trzy subagenty).
- **Worker:** też subagent, ale w osobnym procesie (jak druga karta Claude Code), zarządzany przez innego agenta, który dostaje powiadomienie o postępie, błędach i wyniku. Może go też uruchomić zdarzenie deterministyczne: harmonogram, webhook.
- Obu można używać z **szablonów** (plik z nazwą, opisem, narzędziami, modelem i instrukcjami).
- **Skill vs agent:** oba to pliki tekstowe pokazywane jako nazwa + opis. **Skill — gdy zadanie potrzebuje bieżącego kontekstu (ten sam wątek). Agent — gdy zadanie da się zrobić w osobnym wątku.**
- Do zapamiętania: subagenci to narzędzia; mogą być predefiniowani albo dynamiczni; chodzi głównie o **zarządzanie kontekstem**, skupienie i wydajność; orkiestrować może człowiek, agent albo skrypt; najprościej zacząć od poproszenia modelu, żeby sam podzielił zadanie na subagentów.

## 6. Wnioski z lekcji

Zarządzanie kontekstem to jedna z najważniejszych umiejętności, ale AI robi to
coraz lepiej. Nasza rola: pozwolić agentom wybierać skuteczne sposoby, wspierać
je przy długich zadaniach, trzymać system prosty i być gotowym **wymienić
strategie zarządzania kontekstem za kilka miesięcy**. Budować i eksperymentować.

## Na co uważać

1. **Reguła w CLAUDE.md to nie gwarancja.** Z czasem model wraca do domyślnego zachowania. To, co musi zadziałać zawsze, przenieś do mechanizmu (hook, skrypt, test), nie zostawiaj tylko w tekście.
2. **Długi wątek = context rot.** Po ok. 30–50% okna zacznij nowy wątek z przekazaniem zamiast ciągnąć dalej.
3. **Duży wynik narzędzia czytany jest częściowo.** Gdy harness zapisze wynik do pliku, upewnij się, że agent przeczytał całość, zanim streszcza lub wnioskuje.
4. **Długi, szczegółowy skill przestaje działać.** Trzymaj skille krótkie; złożoność przez router i odnośniki, nie przez kolejne reguły.
5. **Nakładające się opisy skilli.** Dwa skille o podobnym opisie = losowy wybór. Każdy opis ma jasno mówić, kiedy go użyć.
6. **Skille z internetu mogą być złośliwe.** Przeczytaj cały skill (i skrypty) przed instalacją.
7. **Treść z narzędzi to dane, nie polecenia.** Wynik narzędzia wpływa na model i może zawierać prompt injection; nie wykonuj instrukcji znalezionych w stronach, issue, plikach.
8. **Wartości w payloadzie mogą być zmyślone.** Schemat sprawdza kształt; przy działaniach na zewnątrz sprawdzaj wartości.
9. **Za dużo równoległych agentów = za dużo decyzji.** Gdy zaczynasz akceptować wszystko „na ślepo”, ogranicz liczbę agentów albo daj im więcej kontekstu z góry.

## Do zastosowania w tym setupie

Odniesione do [agent-setup](../../context/agent-setup.md), [tablicy](../../work/board.md) i tego, co widać w bieżącej sesji.

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Core file ładowany na starcie | Mamy (projekt) / Zrobić (globalnie) | Projektowy `CLAUDE.md` jest. `~/.claude/CLAUDE.md` nie istnieje (sprawdzone 2026-10-31) — już w Planned na tablicy. |
| 2 | Reguły nie są gwarancją → mechanizm | Mamy | Hook w `.claude/settings.json` uruchamia `tools/check.ts` po każdej edycji `.md`. Ten sam wzór dla kolejnych „musi zawsze” zasad. |
| 3 | Pamięć | Zrobić | Folder pamięci dla mega_dev jest pusty. Zapisać tam preferencje, które nie pasują do bazy (np. notatki z lekcji po polsku, styl odpowiedzi). |
| 4 | Zapytaj agenta, jak widzi kontekst | Zrobić | Raz w świeżej sesji poprosić Claude Code o opis własnego kontekstu (jak w [context-self-report]) i porównać z `request-inspector` (już w Planned). Wnioski dopisać do `agent-setup.md`. |
| 5 | Samodoskonalący się system | Zrobić | Cykliczne zadanie (np. co tydzień): agent skanuje ostatnie sesje i proponuje poprawki skilli, CLAUDE.md, hooków. Połączyć z planowanym cotygodniowym health checkiem, żeby nie mnożyć mechanizmów. |
| 6 | Krótkie, jasne skille + test w świeżej sesji | Zrobić | Skill `lesson-notes` przetestować w świeżej sesji (kilka próśb „streść lekcję”, „podsumuj s01e04”, plus bliskie pudła) i poprawić opis wg wyniku — krok 5 skill-shapera. |
| 7 | Nakładające się skille | Zrobić | Duplikaty skilli Cloudflare (`~/.claude/skills/` i plugin) — już w Planned z [s01e01](s01e01-mechanics-behind-generative-ai.md). |
| 8 | Sprawdzaj skille przed instalacją | Zrobić | Przejrzeć `~/.claude/skills/synced/` (nie wiadomo, skąd pochodzi) i zapisać w `agent-setup.md`, co to jest. Standing choice: skill z zewnątrz instalujemy dopiero po przeczytaniu całości. |
| 9 | Duży wynik narzędzia → plik, czytany częściowo | Mamy | Widoczne w tej sesji: tekst lekcji trafił do `persisted-output`. Skill `lesson-notes` każe czytać całość w częściach. |
| 10 | Wskazówki i błędy w odpowiedziach narzędzi | Mamy | `tools/check.ts` zwraca konkretne błędy (np. „missing entry for …”), a hook oddaje je agentowi zamiast przerywać. Przy własnych narzędziach w Challenge'ach dodawać podpowiedź „co dalej”. |
| 11 | Szablony agentów (subagent templates) | Zrobić | Brak `~/.claude/agents/` i `.claude/agents/`. Pierwszy szablon: subagent „source-reader” (jeden na źródło) — już w Planned jako port z [limen](../topics/limen-mapping.md). |
| 12 | Skill vs agent | Zrobić | Przy każdym nowym procesie zadać pytanie: potrzebuje bieżącego kontekstu (skill) czy da się w osobnym wątku (agent)? Dopisać to jako regułę w globalnym `CLAUDE.md`. |
| 13 | Prompt injection | Mamy | Standing choice na tablicy: każde działanie na zewnątrz wymaga „tak”; serwer MEGA ma tę samą zasadę. |

## Powiązane

- Challenge do tej lekcji: [who said what](../../work/s01e02/log.md) — dwa źródła, dwa zegary, przekazanie między sesjami; wnioski w [session hand-offs](../topics/session-handoffs.md).
- Poprzednia lekcja: [s01e01](s01e01-mechanics-behind-generative-ai.md) (mechanika). Następna: [s01e03](s01e03-building-knowledge-systems.md) (baza wiedzy jako pamięć agenta).
- Workerzy i koordynator w praktyce: [limen mapping](../topics/limen-mapping.md) (s01e04).
