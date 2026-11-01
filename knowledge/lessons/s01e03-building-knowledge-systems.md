---
title: "s01e03 — Building Knowledge Systems"
type: lesson
source: lessons/s01e03-building-knowledge-systems.md (https://hq.mega.dev/lessons/s01e03/)
updated: 2026-11-01
trust: high
status: active
tags: [knowledge-base, retrieval, context, self-management]
links: [../../lessons/s01e03-building-knowledge-systems.md, s01e02-steering-models-through-context.md, s01e04-working-with-ai-harnesses.md, s01e05-building-workflows-not-tool-stacks.md, ../../context/course.md, ../../context/agent-setup.md, ../../work/board.md, ../../work/s01e03/log.md]
---

Agenci stają się głównymi czytelnikami i opiekunami baz wiedzy, więc bazę
buduje się dla nich: tekst jako rdzeń, LLM, który ją tworzy i utrzymuje, oraz
dodatkowe warstwy kontekstu, żeby agent naprawdę dotarł do właściwej notatki.
Nie projektujemy struktury sami — kształtujemy środowisko, w którym agent ją
buduje i poprawia, i dajemy mu jasną definicję „wystarczająco dobrze”.

Surowy tekst: [lessons/s01e03](../../lessons/s01e03-building-knowledge-systems.md).
Przykłady: https://github.com/MEGA-DOT-DEV/examples (nazwy w nawiasach kwadratowych).
Ta baza to zastosowanie tej lekcji (patrz [CLAUDE.md](../../CLAUDE.md)).

## 1. Pliki tekstowe kontra platformy w chmurze

- Google Drive i Notion mają świetne edytory i współpracę, ale agenci mają w nich trudny dostęp do **czytania i pisania** (często nie odczytają nawet obrazka).
- Markdown i HTML są dla agentów naturalne i łatwo je zamienić na stronę (Astro, Next). W zamian tracimy uprawnienia i współpracę w czasie rzeczywistym. Są narzędzia „przerabiane na AI-native” (agenci nie mają dostępu do wszystkiego) i nowe AI-native (brakuje im funkcji).
- Trend: wiedza dociera do ludzi przez agenta, dokumenty czytają i utrzymują agenci, często potrzebny jest tylko wynik, nie dokument. Dziś to nie jest prawda w większości firm, ale szybko się zmienia → **baza budowana dla agentów, nie ludzi**; Notion/Drive jako mosty, nie rdzeń.
- Wnioski z bazy wiedzy Karpathy'ego: wiki buduje **LLM, nie człowiek**; surowe treści są dla AI, ładnie podane — dla Ciebie; edytory Markdown (Obsidian) głównie do **czytania**; w małej osobistej bazie **nie trzeba wyszukiwarki** [summary-index]; największa zmiana to, że LLM **utrzymuje** bazę, nie tylko ją buduje.

## 2. Poza Markdownem

- `mdx` i `svx` pozwalają wstawiać komponenty do Markdowna: czytelne źródło plus interaktywność, a nawet stan (np. działająca checklista). Komponenty można używać wielokrotnie. [guided-components]
- Przydaje się przy złożonych tematach: najpierw szeroki obraz, szczegóły na żądanie, bez ściany tekstu.
- Skill `explainer` (overment) to nie tylko prompt, ale też szablony i logika do **spójnych** wizualizacji; działa najlepiej z modelami SOTA. Inspiracja do skilli typu: wyjaśnienie issue, raport aktywności, decyzje architektoniczne.
- **Artefakty i skille mogą być częścią bazy wiedzy** — mają prowadzić model do oczekiwanych wyników, nie ograniczając go.

## 3. Cel bazy wiedzy i dotarcie do kontekstu

- Dawniej wiki służyły ludziom, którzy znali szerszy kontekst. Agent czyta szybciej, ale łatwo się myli. Typowy błąd: pytanie o proces deployu → agent znajduje kilka notatek, które **wyglądają na kompletne** → **nigdy nie dociera** do notatki z szerszym kontekstem → halucynacja albo źle zrobiony feature. Nie ma gwarancji, można tylko zwiększać szanse.
- Agent szuka w pętli, w wielu turach:
  - **bash / grep / ripgrep** — dopasowuje słowa kluczowe i eksploruje, aż uzna, że ma dość. Świetne dla tekstu i kodu, **prawie bezużyteczne dla obrazów i PDF-ów** (rozwiązanie: notatki-opisy obok plików) [image-sidecar-notes];
  - **wyszukiwanie semantyczne** — model embeddingów zamienia znaczenie na wektor, porównujemy wektory zapytania i dokumentów. Znajduje to, czego regex nie złapie, ale wymaga indeksowania, dzielenia długich dokumentów na fragmenty, a model embeddingów ma własny knowledge cutoff. Embeddingi multimodalne obsługują obrazy. **Podobne znaczeniowo ≠ istotne**;
  - **modele decyzyjne** — szybki model wybiera pliki z góry (np. jevgrep), agent mniej eksploruje i mniej kosztuje [file-picker];
  - **hybrydowe** — wzorce + podobieństwo; najbardziej złożone, zwykle najlepsze [hybrid-search].
- Dodatkowe warstwy, które pomagają dotrzeć do wiedzy [unreached-notes]:
  - **kontekst globalny** — system, środowisko, projekty, zainstalowane narzędzia, ogólne zasady;
  - **kontekst projektu** — opis, **wizja**, mapa feature'ów, styleguide, strona biznesowa;
  - **metadane** — kategorie, tagi, źródło. Open Knowledge Format: Markdown z frontmatterem YAML, który mówi też, **skąd jest notatka, na ile jej ufać i czy jest aktualna**.
- **Strukturę niech wybierze agent** — to on będzie zarządzał dokumentami; my tylko sterujemy pod nasze potrzeby. Można nawet sięgnąć po nieznane nam narzędzia (np. neo4j), bo AI nas wdroży.
- Modele znają popularne strategie budowy baz; warto, żeby ta wiedza pojawiła się w rozmowie (zapytaj o nie model), bo to, co jest w kontekście, wpływa na to, co model wygeneruje.

## 4. Pętla budowy: knowledge skill

Nie budujemy systemu sami, tylko kształtujemy środowisko, w którym robi to agent. Skill `knowledge` (overment):

1. **Cel** — kilka pytań do nas o bazę.
2. **Kontekst** — agent ustala najlepsze metody i zasady.
3. **Struktura** — agent iteruje nad strukturą i relacjami, próbując kilku podejść.
4. **Szablony** — kształt dokumentów jako ogólne wskazówki, nie sztywne sekcje.
5. **Instrukcje** — agent tworzy skill do pracy z bazą.
6. **Test** — subagenci lub osobne sesje używają skilla; razem ustalamy poprawki.

Przy danych wymaganiach proces może działać **sam**, aż LLM uzna, że jest gotowe, i może wracać, gdy baza rośnie. Działa dla wszystkiego, co da się jakoś zweryfikować; tu nie ma ścisłej weryfikacji, więc potrzebna jest **jasna definicja „wystarczająco dobrze”**.

## 5. Samozarządzanie

Podpięcie bazy do Claude Code to „magia”, ale reaktywna — wymaga naszego udziału. Da się ją uczynić proaktywną:

- **Jedno wejście** — wszystko trafia przez **inbox**, skąd agent porządkuje i łączy z istniejącą wiedzą. [inbox-filing]
- **Harmonogramy** — codzienne lub cotygodniowe porządki i synchronizacja. [knowledge-health-check] Największe wyzwanie: rutyny w pełni autonomiczne, ale **proste**, żeby nie psuły bazy i nie gubiły informacji.
- **Zdarzenia** — webhooki serwisów, urządzenia, lokalne demony. Przykłady: zmergowany PR (agent decyduje, co warto zapisać), nowe repo (od razu do kontekstu globalnego), zgłoszenia supportu (stan produktu i tematy użytkowników, nie same zgłoszenia), issues (**destylować, nie kopiować**), oznaczone maile i wiadomości, zakładki „read later” (z linkami do istniejącej wiedzy).

## 6. Szerszy kontekst

- Agent widzi tylko to, co jest teraz w bazie, i traci wątek tego, **co było i co będzie**.
- Rozwiązanie: lista feature'ów **zrobionych, aktywnych, zaplanowanych i zarchiwizowanych** (prosta tablica Kanban). Agent w folderze zadań od razu widzi wąski i szeroki kontekst. [task-board-context] Pomaga przy implementacji, a też przy kształtowaniu wymagań i ADR-ów.

## 7. Przykład: osobisty „drugi mózg”

- Zasady: **dostępność** (baza zdalna, osiągalna z chmury, komputera, telefonu; synchronizacja np. `mutagen sync`); **źródło prawdy** dla własnych notatek, bez dwukierunkowej synchronizacji — rzeczy dobrze trzymane gdzie indziej zostają tam, a baza ma **notatki-wskaźniki** [pointer-notes]; **samorozwój** (rośnie prawie sama, cała interakcja przez agenta); **prostota** (polegać na rosnących możliwościach agentów, nie walczyć z ich wadami).
- Wygenerowany skill rozdziela osąd (SKILL.md + notatki referencyjne) od mechaniki (skrypty do linków i ID). Struktura: inbox → context / work (planned → active → review → done) / knowledge.

## 8. Wnioski z lekcji

Bazę wiedzy łatwo zacząć i trudno opanować, ale warto zacząć — osobista baza
pokazuje wiele możliwości i problemów, także w aplikacjach i usługach, które
nie są gotowe na erę AI.

## Na co uważać

1. **Notatki, które „wyglądają na kompletne”.** Agent przestaje szukać za wcześnie. Linkuj powiązane notatki i trzymaj indeks z jednozdaniowymi opisami.
2. **Obrazy i PDF-y są niewidoczne dla grep.** Każdy taki plik potrzebuje notatki-opisu obok.
3. **Podobne ≠ istotne.** Wyszukiwanie semantyczne zwraca rzeczy o podobnym znaczeniu, nie te potrzebne; nie wprowadzaj go, dopóki indeks wystarcza.
4. **Kopiowanie zamiast wskaźników.** Kopie się rozjeżdżają; dla rzeczy trzymanych gdzie indziej zostaw notatkę-wskaźnik z URL.
5. **Autonomiczne rutyny mogą psuć bazę.** Trzymaj je proste, z mechanicznym sprawdzeniem po zmianach i bez usuwania (archiwizuj).
6. **Projektowanie struktury samemu.** Daj ją agentowi i steruj; zmiany struktury zapisuj w logu.
7. **Brak definicji „wystarczająco dobrze”.** Bez niej pętla ulepszania nie wie, kiedy przestać.

## Do zastosowania w tym setupie

Ta baza jest zastosowaniem lekcji, więc większość punktów to „Mamy”. Sprawdzone w repo 2026-11-01.

| # | Punkt z lekcji | Stan | Co zrobić |
| --- | --- | --- | --- |
| 1 | Markdown jako rdzeń, LLM buduje i utrzymuje | Mamy | Cała baza w `.md`; reguła w `CLAUDE.md`: agent zarządza strukturą, człowiek pisze tylko do `inbox/`. |
| 2 | Mała baza: indeks zamiast wyszukiwarki | Mamy | `index.md`, jedna linia na notatkę; `tools/check.ts` pilnuje, że każda notatka jest w indeksie. |
| 3 | Metadane: źródło, zaufanie, aktualność | Mamy | Frontmatter z `source`, `trust`, `status`, `updated`; check ostrzega o `updated` starszym niż 30 dni. |
| 4 | Jedno wejście (inbox) | Mamy | `inbox/` i rutyna filowania w `CLAUDE.md`; przetworzone trafiają do `archive/inbox/`. |
| 5 | Szerszy kontekst (board) | Mamy | `work/board.md`: Standing choices, Active, Planned, Done, Archived. |
| 6 | Notatki-wskaźniki | Mamy | Reguła „Pointers, not copies” w `CLAUDE.md`; np. `context/course.md`. |
| 7 | Osąd w notatkach, mechanika w skryptach | Mamy | `tools/check.ts` + hook; osąd w `CLAUDE.md` i skillu `lesson-notes`. |
| 8 | Kontekst globalny | Zrobić | `~/.claude/CLAUDE.md` nie istnieje — już w Planned. |
| 9 | Test dotarcia (reach) | Zrobić | Test w świeżej sesji z pytaniem bez wspólnych słów kluczowych — już w Active na tablicy; uruchomić. |
| 10 | Harmonogramy | Zrobić | Cotygodniowy health check + przegląd sesji jako zadanie cykliczne — już w Planned. |
| 11 | Obrazy bez notatek-opisów | Zrobić | `work/s01e02/out/frames/*.png` i `contact.png` nie mają opisów; dodać jedną notatkę-opis dla folderu, jeśli te klatki mają być jeszcze potrzebne. |
| 12 | Dostępność z każdego urządzenia | Zrobić (później) | Baza ma remote na GitHubie (`BarWyDev/mega_dev`), więc da się ją sklonować wszędzie. Pełna synchronizacja/serwer dopiero razem ze zdalnym agentem z [s01e05](s01e05-building-workflows-not-tool-stacks.md). |
| 13 | Zdarzenia (PR, repo, issues) | Pominąć na razie | Bez zdalnego agenta nie ma kto reagować; wrócić po decyzji o zdalnej maszynie. |

## Powiązane

- Challenge: [what it shows](../../work/s01e03/log.md) — strona `.svx` z komponentami, render przez SvelteKit + mdsvex ([tools/kb-render](../../tools/kb-render/README.md)); decydujące było ponowne przeczytanie strony źródłowej.
- Poprzednia lekcja: [s01e02](s01e02-steering-models-through-context.md) (skille, kontekst). Następna: [s01e04](s01e04-working-with-ai-harnesses.md) (harnessy, board i vision w limen), potem [s01e05](s01e05-building-workflows-not-tool-stacks.md) (baza zdalna).
- Luki w setupie wykryte przez tę lekcję: [agent-setup](../../context/agent-setup.md).
