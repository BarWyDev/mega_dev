// Writes the triaged tracker into repo/sched-prod/doc/issues (decisions made with the triage skill).
// Usage: node write-issues.mjs <path to doc/issues>
import { readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
const A1 = {
  copy: "Allowed by AUT-1 (copy changes in the product's own interface).",
  fix: 'Allowed by AUT-1 (bug fixes and small features inside the specs, with a test that shows the change).',
  align: 'Allowed by AUT-1 (bringing code in line with a rule in `specs/` when nothing visible changes).',
  add: 'Allowed by AUT-1 (new columns, filters or fields that add to what is there and take nothing away).',
  dense: 'Allowed by AUT-1 (a denser layout built on the spacing scale (DES-3)).',
};
const ready = ({ intent, acceptance, boundaries, allowed }) =>
  `## Intent\n${intent}\n\n## Acceptance\n${acceptance.map((l) => `- ${l}`).join('\n')}\n\n## Boundaries\n${boundaries.map((l) => `- ${l}`).join('\n')}\n\n${allowed}`;
const human = ({ question, options, rec, why }) =>
  `## Question\n${question}\n\n## Options\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\n## Recommendation\n${rec}\n\n## Why\n${why}`;

export const issues = [
  // ---------- backlog, open ----------
  {
    key: 'SCHED-4412', title: 'colours: move hard-coded colours to design tokens', status: 'open',
    labels: ['agent-ready', 'from:product'],
    body: ready({
      intent: 'Components still carry raw hex values. Move every colour in components to the design tokens (`--color-*`) named in specs/design.md (DES-2). Nothing visible changes. Until this ships, a new colour scheme cannot be a token set, because the raw values would not follow it.',
      acceptance: [
        'Given the component source, when it is searched for raw hex, rgb or named colours, then none is found outside the tokens file (DES-2).',
        'Given any screen before and after the change, when the two are compared, then the rendered colours are the same.',
        'Given the change, when it ships, then it does not add, rename or change the value of any colour a user sees.',
      ],
      boundaries: [
        'Must not touch the palette values in the tokens file, or add a new colour scheme.',
        'Must not touch font sizes (SCHED-4463) or spacing (SCHED-4468).',
      ],
      allowed: A1.align,
    }),
  },
  {
    key: 'SCHED-4418', title: 'week view: first day of the week follows the account locale', status: 'open',
    labels: ['agent-ready', 'from:support'],
    body: ready({
      intent: 'Week view always starts on Sunday. It should start on the first day of the week of the account locale (the Account primitive in specs/product.md has a locale).',
      acceptance: [
        'Given an account with a locale whose week starts on Monday (for example de-DE), when week view opens, then the first column is Monday.',
        'Given an account with a locale whose week starts on Sunday (for example en-US), when week view opens, then the first column is Sunday.',
        'Given any account, when the first day changes, then no booking moves to another date and no stored time is changed (PRD-2).',
      ],
      boundaries: [
        'Must not touch stored times or bookings; this is display only (PRD-2).',
        'Must not add a per-user setting; the rule lives in the account locale (PRD-4).',
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'SCHED-4431', title: 'booking page: show remaining seats', status: 'open',
    labels: ['agent-ready', 'from:client'],
    body: ready({
      intent: 'On the booking page, a group slot (a Slot with more than one seat) shows how many seats are left.',
      acceptance: [
        'Given a slot with 10 seats and 7 bookings, when the booking page shows it, then it says 3 seats are left.',
        'Given a slot with 1 seat, when the booking page shows it, then no seat count is shown.',
        'Given a slot with no seats left, when the booking page shows it, then it can not be booked and the count is not negative.',
      ],
      boundaries: [
        'Must not touch how seats are counted or stored: one booking, one slot (PRD-1).',
        'Must not use colours, sizes or spacing outside the tokens (DES-1, DES-2, DES-3).',
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'SCHED-4446', title: 'CSV export: times carry no UTC offset', status: 'open',
    labels: ['agent-ready', 'from:analytics'], sources: ['IN-7727'],
    body: ready({
      intent: 'Start and end times in the CSV export have no offset, so every tool that reads them has to guess the zone (IN-7727: a BI tool assumes UTC and shifts every slot). Add a UTC offset column next to them; the start and end columns stay as they are. ADR-0001 says anything that leaves the product as data says which zone a time is in.',
      acceptance: [
        'Given a CSV export, when it is opened, then each row has a UTC offset column next to the start and end columns, in the form +HH:MM or -HH:MM.',
        'Given a booking on a daylight-saving change day, when it is exported, then the offset is the one in force at that booking\'s start.',
        'Given an export from before and after the change, when the columns are compared, then no column is removed, renamed or reordered and the start and end values are not changed (PRD-3).',
      ],
      boundaries: [
        'Must not touch the existing columns, their names, order or values (PRD-3).',
        'Must not touch the date format of the existing columns: a client imports them as mm/dd (IN-3225); that question is IN-4186.',
        'Must not touch stored times; they stay in UTC (PRD-2, ADR-0001).',
      ],
      allowed: A1.add,
    }),
  },
  {
    key: 'SCHED-4452', title: 'calendar sync: Outlook events arrive twice', status: 'open',
    labels: ['agent-ready', 'from:support'],
    body: ready({
      intent: 'Some Outlook calendars show each booking twice after a sync. ADR-0002 says each booking is pushed once, with a stable id, so a calendar can tell an update from a new event. Find where the push to Outlook breaks that and fix it.',
      acceptance: [
        'Given a booking pushed to a connected Outlook calendar, when the sync runs again, then the calendar holds one event for that booking.',
        'Given a booking that changes after its first push, when it is pushed again, then the same event is updated, with the same id.',
        'Given the fix, when it runs, then sched-prod does not read events back from the external calendar (ADR-0002).',
        'Given a test that pushes the same booking twice, when it runs, then it fails before the fix and passes after it.',
      ],
      boundaries: [
        'Must not touch the direction of the sync: push only, no read-back (ADR-0002).',
        'Must not delete or rewrite stored bookings to remove doubles (AUT-2).',
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'SCHED-4463', title: 'type: move hard-coded font sizes to the type scale', status: 'open',
    labels: ['agent-ready', 'from:product'],
    body: ready({
      intent: 'Some components still set their own font sizes. Move every size to the type scale in the tokens (DES-1). Nothing visible changes. Until this ships, a text-size setting cannot follow the type scale.',
      acceptance: [
        'Given the component source, when it is searched for font sizes, then every one comes from the type scale in the tokens (DES-1).',
        'Given any screen before and after the change, when the two are compared, then the rendered text sizes are the same.',
        'Given the change, when it ships, then it does not add a text-size setting or a new step to the type scale.',
      ],
      boundaries: [
        'Must not touch the values of the type scale in the tokens file.',
        'Must not touch colours (SCHED-4412) or spacing (SCHED-4468).',
      ],
      allowed: A1.align,
    }),
  },
  {
    key: 'SCHED-4465', title: 'API: rate-limit replies carry no Retry-After header', status: 'open',
    labels: ['agent-ready', 'from:client'], sources: ['IN-1232'],
    body: ready({
      intent: 'When the API rate-limits a caller, the 429 reply does not say when to try again (IN-1232: a client integration gets 429 with no hint). Add a Retry-After header to it.',
      acceptance: [
        'Given a caller over the rate limit, when the API replies 429, then the reply has a Retry-After header with the number of seconds until a call is let through.',
        'Given a caller that waits that long, when it calls again, then the call is not rate-limited.',
        'Given the change, when it ships, then the limits themselves and the 429 body are not changed, and replies other than 429 do not carry the header.',
      ],
      boundaries: [
        'Must not touch the rate limits or which callers they apply to.',
        'Must not touch the shape of any other API reply.',
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'SCHED-4468', title: 'spacing: move hard-coded margins to the spacing scale', status: 'open',
    labels: ['agent-ready', 'from:product'],
    body: ready({
      intent: 'Some components still set their own margins and padding. Move every one to the 4 px scale in the tokens (DES-3). Nothing visible changes. Until this ships, a denser layout cannot come from the spacing scale.',
      acceptance: [
        'Given the component source, when it is searched for margins and padding, then every one comes from the spacing scale in the tokens (DES-3).',
        'Given any screen before and after the change, when the two are compared, then the layout is the same.',
        'Given the change, when it ships, then it does not add a denser layout or a new step to the spacing scale.',
      ],
      boundaries: [
        'Must not touch the values of the spacing scale in the tokens file.',
        'Must not touch colours (SCHED-4412) or font sizes (SCHED-4463).',
      ],
      allowed: A1.align,
    }),
  },
  {
    key: 'SCHED-4486', title: 'audit log: keep 90 days', status: 'open',
    labels: ['needs-human', 'from:finance'],
    body: human({
      question: 'May audit log entries that are already stored be deleted once they are older than 90 days?',
      options: [
        'Delete: keep entries for 90 days, then delete them, including the entries stored today that are already older.',
        'Keep what is stored: apply the 90 days only to entries written after the change; entries stored before it stay.',
        'Hide, do not delete: show 90 days in the product and move older entries to an archive nobody loses.',
      ],
      rec: 'Option 2',
      why: 'Because AUT-2 says deleting or rewriting data that is already stored needs a human, so an agent may not ship this alone. Option 2 gives finance the 90-day rule and deletes nothing that is stored now; a person who knows what finance and the client terms require can still pick option 1.',
    }),
  },
  {
    key: 'SCHED-4494', title: 'week view: a booking across midnight shows on its first day only', status: 'open',
    labels: ['agent-ready', 'from:support'],
    body: ready({
      intent: 'A booking from 23:00 to 01:00 shows on its first day in week view and is missing from the second. Show it on both days.',
      acceptance: [
        'Given a booking from 23:00 to 01:00 in the viewer\'s zone, when week view shows that week, then the booking shows on the first day from 23:00 and on the second day until 01:00.',
        'Given that booking when the two days fall in different weeks, when either week is shown, then its part of the booking shows.',
        'Given the fix, when it ships, then the booking is not split in storage: it stays one booking in one slot (PRD-1).',
      ],
      boundaries: [
        'Must not touch stored bookings, slots or times; this is display only (PRD-1, PRD-2).',
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'SCHED-4498', title: 'confirmation email: the cancel link opens the login page', status: 'open',
    labels: ['agent-ready', 'from:support'],
    body: ready({
      intent: 'The cancel link in the booking confirmation email asks for a login. People who booked have no account. The cancel link in the reminder email opens the booking without one, as it should. Make the confirmation email\'s link work the same way.',
      acceptance: [
        'Given a person with no account, when they open the cancel link in the confirmation email, then the booking opens with its cancel action and no login page.',
        'Given the cancel link in the reminder email, when it is opened, then it works as it does today.',
        'Given the cancel link of one booking, when it is opened, then it does not open or cancel any other booking.',
      ],
      boundaries: [
        'Must not touch the sender address or the wording of the emails (IN-4743: a client relies on the address).',
        'Must not touch the login rules for account pages.',
      ],
      allowed: A1.fix,
    }),
  },
  // ---------- backlog, done: body kept as it came ----------
  { key: 'SCHED-4423', title: 'invite links expire after one hour', status: 'done', labels: ['from:support'], body: 'Invite links now expire one hour after they are sent.' },
  { key: 'SCHED-4434', title: 'booking page: the list of times scrolls on small phones', status: 'done', labels: ['from:support'], body: 'On small phones the list of times was cut off at the bottom. It now scrolls.' },
  { key: 'SCHED-4439', title: 'reminder emails go out 24 h before the slot', status: 'done', labels: ['from:product'], body: 'One reminder email, 24 hours before each booking.' },
  { key: 'SCHED-4442', title: 'search: names match with or without accents', status: 'done', labels: ['from:support'], sources: ['IN-4708'],
    body: 'Searching for "Zoe" now finds "Zoë", and the other way round.\n\nIN-4708 (support) is a ticket from the old queue about this, filed before it shipped. No new work.',
  },
  { key: 'SCHED-4458', title: 'invoice PDF shows net and gross', status: 'done', labels: ['from:finance'], body: 'Invoice PDFs list net, tax and gross on separate lines.' },
  {
    key: 'SCHED-4471', title: 'dates parse mm/dd in eu locales', status: 'done', labels: ['from:support'], sources: ['IN-9583'],
    body: '412 reports · merged by tove · closed 04:04 · by —\n\nIN-9583 (support) is one more report of this, filed before the fix shipped: 03/04 read as 4 March in Germany. No new work.',
  },
  // ---------- new, from requests ----------
  {
    key: 'IN-4168', title: "booking page: confirm button says 'OK'", status: 'closed', reason: 'contradicts-spec',
    labels: ['from:product'], sources: ['IN-4168'],
    body: "Closed: contradicts DES-5. DES-5 says a button says what it does, a verb and its object (\"Cancel booking\", not \"OK\"). Request IN-4168 asks for the confirm button on the booking page to say 'OK'. A change to DES-5 itself is for the people who own specs/design.md.",
  },
  {
    key: 'IN-4218', title: "week view: the 'today' button is missing on phones", status: 'open',
    labels: ['agent-ready', 'from:support'], sources: ['IN-4218'],
    body: ready({
      intent: "The 'today' button is missing from week view on phones. Show it there, as on wider screens.",
      acceptance: [
        "Given week view on a phone-width screen, when it opens, then the 'today' button is visible without scrolling sideways.",
        "Given week view on another week, when the 'today' button is pressed, then the view shows the week that holds today in the viewer's zone (PRD-2).",
        'Given week view on a wide screen, when it opens, then its layout is not changed.',
      ],
      boundaries: [
        'Must not touch the spacing, type or colour tokens; use the ones there (DES-1, DES-2, DES-3).',
        "Must not rename the button (DES-5).",
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'IN-9334', title: 'reminder emails: send from no-reply@ instead of bookings@', status: 'open',
    labels: ['needs-human', 'from:product', 'from:client'], sources: ['IN-9334', 'IN-4743'],
    body: human({
      question: 'May the sender address of reminder emails change from bookings@ to no-reply@, when a client has told its patients to allow mail from bookings@?',
      options: [
        'Keep bookings@ as it is and change nothing.',
        'Keep bookings@ as the sender and stop the replies another way: a Reply-To that is not read, or an automatic answer that says where to write.',
        'Change the sender to no-reply@, after every client is told early enough to change what they told their own people.',
      ],
      rec: 'Option 2',
      why: 'Because of IN-4743: a client told all its patients to allow mail from bookings@ so that reminders do not land in spam, and asked that the address stays. AUT-2 says a change to something a client has told us they rely on needs a human, so an agent may not ship IN-9334 (product: replies to bookings@ pile up) alone. Option 2 ends the pile of replies and leaves the address clients rely on.',
    }),
  },
  {
    key: 'IN-4900', title: "settings page: typo 'Calender'", status: 'open',
    labels: ['agent-ready', 'from:product'], sources: ['IN-4900'],
    body: ready({
      intent: "The settings page says 'Calender'. It should say 'Calendar'.",
      acceptance: [
        "Given the settings page, when it is shown, then the word reads 'Calendar'.",
        "Given the product's interface copy, when it is searched for 'Calender', then it is not found.",
        'Given the change, when it ships, then no other copy and no setting key or stored value is changed.',
      ],
      boundaries: [
        'Must not touch setting names in code, the API or stored data; interface copy only.',
      ],
      allowed: A1.copy,
    }),
  },
  {
    key: 'IN-7414', title: 'booking page: icon buttons have no label for screen readers', status: 'open',
    labels: ['agent-ready', 'from:support'], sources: ['IN-7414'],
    body: ready({
      intent: "A screen reader reads every icon button on the booking page as just 'button'. Give each one an accessible name that says what it does.",
      acceptance: [
        'Given the booking page, when a screen reader reaches an icon button, then it reads a name that is a verb and its object (DES-5), for example "Next week".',
        'Given the booking page, when it is checked with an accessibility test, then no button is without an accessible name.',
        'Given the booking page before and after the change, when the two are compared by eye, then nothing visible is changed.',
      ],
      boundaries: [
        'Must not touch the icons, the layout or the visible copy.',
        'Must not touch pages other than the booking page.',
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'IN-7958', title: 'booking form: a free-text note from the person who books', status: 'open',
    labels: ['agent-ready', 'from:support', 'from:client'], sources: ['IN-7958', 'IN-8314'],
    body: ready({
      intent: "Add an optional free-text note to the booking form, for things like 'first visit', 'bring a mat' or what hurts before a physio session. The note is stored with the booking and shown to the team with it. Two requests ask for this: IN-7958 (support) and IN-8314 (client).",
      acceptance: [
        'Given the booking form, when a person books and types a note, then the note is saved with that booking and the team sees it on the booking.',
        'Given the booking form, when a person books with the note left empty, then the booking goes through as it does today.',
        'Given an export of bookings, when it is opened, then the note is a new column and no column the export had is removed, renamed or reordered (PRD-3).',
        'Given a note, when the booking page or any other public page is shown, then the note is not shown to anyone but the team of that account.',
      ],
      boundaries: [
        'Must not touch the existing fields of the booking form or make the note required.',
        'Must not touch existing bookings: they get an empty note, nothing stored is rewritten (AUT-2).',
        'Must not touch existing export columns (PRD-3).',
      ],
      allowed: A1.add,
    }),
  },
  {
    key: 'IN-8913', title: 'confirmation page: the booking time shows no time zone', status: 'open',
    labels: ['agent-ready', 'from:client'], sources: ['IN-8913'],
    body: ready({
      intent: 'The confirmation page shows the time of the booking but not its time zone, so people abroad turn up an hour off. Show the zone next to the time. PRD-2 says times are shown in the viewer\'s zone; the page has to say which zone that is.',
      acceptance: [
        'Given a confirmed booking, when the confirmation page shows its time, then the time zone is shown next to it (for example "14:00 Europe/Warsaw").',
        'Given a viewer in another zone than the account, when the page is shown, then the time is in the viewer\'s zone and the zone named is the viewer\'s (PRD-2).',
        'Given the change, when it ships, then the stored time of no booking is changed; it stays in UTC (PRD-2, ADR-0001).',
      ],
      boundaries: [
        'Must not touch stored times or how they are converted (PRD-2, ADR-0001).',
        'Must not touch the confirmation email or the CSV export (SCHED-4446 covers the export).',
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'IN-4989', title: 'booking page: the date picker cannot be used with the keyboard alone', status: 'open',
    labels: ['agent-ready', 'from:support'], sources: ['IN-4989'],
    body: ready({
      intent: 'The date picker on the booking page cannot be used with the keyboard alone. Make every action of the date picker work from the keyboard.',
      acceptance: [
        'Given the booking page and no mouse, when a person tabs to the date picker, then they can open it, move between days, weeks and months, pick a date and close it with the keyboard.',
        'Given the date picker with the keyboard in use, when focus moves, then the focused day is visibly marked and a screen reader reads its date.',
        'Given the date picker used with a mouse or by touch, when a date is picked, then it works as it does today and nothing visible is changed.',
      ],
      boundaries: [
        'Must not touch how a typed date is parsed (SCHED-4471 fixed that).',
        'Must not touch colours, type or spacing outside the tokens (DES-1, DES-2, DES-3).',
      ],
      allowed: A1.fix,
    }),
  },
  {
    key: 'IN-4186', title: 'CSV export: dates as dd/mm for EU accounts', status: 'open',
    labels: ['needs-human', 'from:support', 'from:client'], sources: ['IN-4186', 'IN-3225'],
    body: human({
      question: 'May the dates in the CSV export change from mm/dd to dd/mm for EU accounts, when a client imports them as mm/dd today?',
      options: [
        'Keep mm/dd for everyone and change nothing.',
        'Keep mm/dd as the default and add a date format setting per account; an account gets dd/mm only when it chooses it.',
        'Keep the date columns as they are and add a new column with the date in ISO form (YYYY-MM-DD), which no tool can misread.',
        'Flip the dates to dd/mm for every account with an EU locale.',
      ],
      rec: 'Option 2',
      why: 'Because of IN-3225 (ilse · studio · auckland): a client\'s payroll import reads the dates in the CSV export as mm/dd, the way they come today, and asked that they are not flipped. AUT-2 says a change to something a client has told us they rely on needs a human, so IN-4186 (support: EU accounts want dd/mm) is not the one-line change it says it is. Option 2 gives EU accounts dd/mm, keeps the rule in one setting (PRD-4) and changes nothing for an account that does not choose it.',
    }),
  },
  {
    key: 'IN-5459', title: 'bookings list: search by booking reference', status: 'open',
    labels: ['agent-ready', 'from:support'], sources: ['IN-5459'],
    body: ready({
      intent: 'The bookings list can only be searched by name. Let staff search it by booking reference too.',
      acceptance: [
        'Given a booking with a reference, when staff type that reference into the search of the bookings list, then that booking is found.',
        'Given a name, when staff search for it, then the result is the same as today, with or without accents (SCHED-4442).',
        'Given a reference of another account, when staff search for it, then no booking of that other account is shown.',
      ],
      boundaries: [
        'Must not touch the search by name or its accent matching (SCHED-4442).',
        'Must not touch booking references themselves or any stored data (AUT-2).',
      ],
      allowed: A1.add,
    }),
  },
  {
    key: 'IN-5919', title: 'weekly summary email: Mondays instead of Fridays', status: 'closed', reason: 'obsolete',
    labels: ['from:client'], sources: ['IN-5919', 'IN-6489'],
    body: 'Closed: withdrawn by the client that asked. IN-5919 asked for the weekly summary email on Mondays instead of Fridays; IN-6489, from the same channel, takes it back: the team voted to keep Friday. Nothing to build.',
  },
  {
    key: 'IN-1162', title: 'week view: a compact layout that fits a whole day on one screen', status: 'open',
    labels: ['agent-ready', 'from:client'], sources: ['IN-1162'], 'blocked-by': ['SCHED-4468'],
    body: ready({
      intent: 'A front desk needs a compact week view that fits a whole day on one screen. Add a compact layout for week view, built from smaller steps of the spacing scale (DES-3). It can not ship before SCHED-4468: until margins and padding come from the spacing scale, a denser layout cannot come from it.',
      acceptance: [
        'Given week view in the compact layout on a desktop screen, when a day is shown, then the whole working day is visible without scrolling down.',
        'Given the compact layout, when its spacing is inspected, then every margin and padding is a step of the 4 px scale in the tokens (DES-3).',
        'Given an account that does not choose the compact layout, when week view opens, then it is not changed.',
        'Given the compact layout, when text is shown, then no font size outside the type scale is used (DES-1).',
      ],
      boundaries: [
        'Must not touch the default layout of week view.',
        'Must not touch the values of the spacing scale or add raw margins or padding to components (DES-3).',
        'Must not start before SCHED-4468 is done.',
      ],
      allowed: A1.dense,
    }),
  },
  {
    key: 'IN-2061', title: 'CSV export: a column for where the booking came from', status: 'open',
    labels: ['agent-ready', 'from:analytics'], sources: ['IN-2061'],
    body: ready({
      intent: 'Add a column to the CSV export that says where each booking came from: the booking link, the embedded widget or the API (the Channel primitive in specs/product.md).',
      acceptance: [
        'Given a CSV export, when it is opened, then each row has a channel column with one of: link, widget, api.',
        'Given a booking made through the embedded widget, when it is exported, then its channel is widget.',
        'Given an export from before and after the change, when the columns are compared, then no column is removed, renamed or reordered and no value in them is changed (PRD-3).',
      ],
      boundaries: [
        'Must not touch the existing columns, their order or their date format (PRD-3; IN-3225: a client imports them as they are).',
        'Must not touch how a booking\'s channel is stored.',
      ],
      allowed: A1.add,
    }),
  },
];

const text = (i) => {
  const list = (xs) => `[${xs.join(', ')}]`;
  const fm = [`key: ${i.key}`, `title: ${JSON.stringify(i.title)}`, `status: ${i.status}`];
  if (i.reason) fm.push(`reason: ${i.reason}`);
  fm.push(`labels: ${list(i.labels)}`);
  if (i.sources?.length) fm.push(`sources: ${list(i.sources)}`);
  if (i['blocked-by']?.length) fm.push(`blocked-by: ${list(i['blocked-by'])}`);
  if (i['duplicate-of']) fm.push(`duplicate-of: ${i['duplicate-of']}`);
  return `---\n${fm.join('\n')}\n---\n\n${i.body}\n`;
};

if (dir) {
  const keep = new Set(issues.map((i) => `${i.key}.md`));
  const placed = new Set(issues.flatMap((i) => i.sources ?? []));
  for (const f of readdirSync(dir)) {
    if (keep.has(f)) continue;
    if (placed.has(f.replace(/\.md$/, ''))) rmSync(join(dir, f));
    else console.log(`NOT PLACED YET, left as it is: ${f}`);
  }
  for (const i of issues) writeFileSync(join(dir, `${i.key}.md`), text(i), 'utf8');
  console.log(`${issues.length} issues written`);
}
