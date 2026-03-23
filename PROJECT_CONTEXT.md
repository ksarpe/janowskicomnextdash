# Dokumentacja Architektury i Kontekst Projektu (Micro-SaaS)

## 1. Kontekst Biznesowy

Projekt to system Micro-SaaS B2B dla małych firm usługowych (mechanicy, salony beauty itp.).
Głównym celem systemu jest automatyzacja pozyskiwania klientów i rezerwacji wizyt poprzez eleganckie, pływające widżety instalowane bezpośrednio na stronach internetowych klientów.

**Główne moduły:**

- **Chat Widget:** Komunikator pozwalający na wysyłanie wiadomości z poziomu strony.
- **Booking Widget (W trakcie budowy):** Interaktywny kalendarz pozwalający na rezerwację usług w oparciu o dostępne godziny pracy i zablokowane terminy.
- **Dashboard (Panel Klienta):** Miejsce, w którym właściciel firmy zarządza wiadomościami, rezerwacjami, grafikiem pracy i wyglądem widżetów.

---

## 2. Tech Stack

- **Framework:** Next.js (App Router)
- **Język:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion (do płynnych animacji UI)
- **Baza Danych:** PostgreSQL (hostowana na Neon)
- **ORM:** Prisma 7
- **Deployment:** Vercel

---

## 3. Główne Wzorce Architektoniczne (Zasady dla AI)

### A. Izolacja CSS i Iframe (Widgety)

Widgety są wstrzykiwane na strony docelowe jako `iframe`, aby uniknąć konfliktów CSS (tzw. CSS Bleeding).

- **Krok 1:** Czysty skrypt Vanilla JS (`public/booking-widget.js` lub `chat-widget.js`) ładuje się na stronie klienta.
- **Krok 2:** Skrypt tworzy kontener, generuje przycisk/bąbelek i tworzy niewidzialny `iframe`.
- **Krok 3:** `iframe` ładuje wewnętrzne ścieżki Next.js (odpowiednio `/embed/booking` lub `/embed/chat`).

### B. State Injection (Zero DB Hits na start)

Aby widżety ładowały się błyskawicznie i nie obciążały bazy danych, stosujemy technikę State Injection.
Zewnętrzny skrypt JS pobiera konfigurację (np. `themeColor`) z szybkiego cache'u Vercel Edge (`/api/widget/config`), koduje obiekt konfiguracyjny do **Base64** i dokleja go do parametru URL ramki iframe (np. `?config=e3...`).
Pliki `page.tsx` w folderze `/embed/...` (Server Components) rozpakowują ten Base64 i od razu renderują HTML w odpowiednich kolorach bez odpytywania bazy danych.

### C. Komunikacja z Bazą (Server Components vs Server Actions)

- **Server Components:** Używane do pobierania danych startowych (Initial Load), np. pobranie listy usług dla kalendarza bezpośrednio przez `prisma.service.findMany()`.
- **Server Actions (`"use server"`):** Główny sposób na mutację danych i interakcję klienta. Formularze, rezerwacje terminów i zapisywanie grafiku (np. w `WorkingHoursManager.tsx`) wywołują Server Actions.
- **Tradycyjne API Routes (`/api/...`):** Używane **tylko** do komunikacji z podmiotami zewnętrznymi (np. wstrzykiwane skrypty `.js`, Webhooki Stripe).

---

## 4. Baza Danych (Prisma)

**Kluczowa zasada konfiguracji Prisma:**
Plik `schema.prisma` nie zawiera bloku `datasources`. Korzystamy z Prisma 7, w którym ten element nie jest już obsługiwany, a konfiguracja połączenia odbywa się w inny sposób zgodnie z nowymi standardami. Należy bezwzględnie o tym pamiętać przy generowaniu i aktualizowaniu schematu.

**Kluczowe Modele (Encje):**

1. `Client` - Właściciel warsztatu/salonu (subskrybent SaaS-a).
2. `WidgetConfig` - Ustawienia wyglądu (np. `themeColor` przechowywany w polu JSON `extraSettings`).
3. `Message` - Wiadomości z modułu czatu.
4. `Service` - Usługi (np. "Wymiana oleju", posiada pole `duration` kluczowe dla kalendarza).
5. `WorkingHours` - Stały grafik w tygodniu (`dayOfWeek`, `startTime`, `endTime`, `isActive`).
6. `BlockedTime` - Wyjątki w grafiku (urlopy, święta, zablokowane pojedyncze godziny).
7. `Appointment` - Umówione wizyty klientów końcowych.

---

## 5. Standardy UI / UX i Czysty Kod (Zasady dla AI)

1. **Design System:** Styl minimalistyczny, przypominający interfejsy Stripe, Vercel, Linear. Używamy jasnych teł, białych kart (`bg-dash-card`), delikatnych ramek (`border-dash-border`), zaokrągleń (`rounded-xl` lub `rounded-2xl`) i subtelnych cieni.
2. **Top-Down Design:** Rozwój zaczynamy od zrobienia pięknego i przemyślanego UI z mockowanymi (statycznymi) danymi, a dopiero po akceptacji podpinamy logikę serwerową, bazę danych i stany ładowania.
3. **Progressive Disclosure:** Długie formularze (np. rezerwacja) rozbijamy na mniejsze, logiczne kroki (np. 1. Wybór usługi -> 2. Wybór terminu -> 3. Formularz kontaktowy). Zawsze dodajemy pasek postępu i możliwość cofnięcia.
4. **Rozszerzanie obiektów:** Zawsze gdy łączymy ustawienia domyślne z zapisanymi w bazie JSON-ami, używamy Spread Operatora (`...DEFAULT_SETTINGS, ...userSettings`), zamiast pisać logikę sprawdzającą każde pole przy pomocy operatora `||`.

## 6. Środowisko Testowe (Sandbox)

Posiadamy lokalny Sandbox w `src/app/sandbox/page.tsx` pozwalający na testowanie wstrzykniętych skryptów `.js` w środowisku imitującym prawdziwą stronę internetową.
**Zabezpieczenie:** Sandbox posiada dyrektywę `notFound()` dla środowiska produkcyjnego (`process.env.NODE_ENV === "production"`), dzięki czemu na Vercelu zwraca błąd 404.
