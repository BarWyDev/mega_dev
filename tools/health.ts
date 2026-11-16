// Heartbeat for this base: the checks a run makes when nobody asked it to.
// Mechanics only — it reports, it never fixes and it never writes log.md, index.md or work/board.md.
// Run: node tools/health.ts            (Node 23.6+ runs TypeScript directly)
//      node tools/health.ts --no-write (print the report, write no file)
// Writes work/health/<YYYY-MM-DD>.md (same day overwrites) and prints a one-line verdict.
// Exit 2 when something is red (a run that ends red is worth waking the human for),
// 0 when it is green or only warns.

import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const WRITE = !process.argv.includes("--no-write");
// A note left in inbox/ or a change left uncommitted this long is not "in progress" any more.
const STALE_DAYS = 7;

const today = new Date();
const stamp = today.toISOString().slice(0, 10);
const ageDays = (d: Date) => Math.floor((today.getTime() - d.getTime()) / 86_400_000);

type Level = "red" | "warn" | "ok";
type Check = { name: string; level: Level; line: string; detail?: string[] };
const checks: Check[] = [];

// 1. The mechanical check, run as a child so its own exit code is the source of truth.
{
  const run = spawnSync(process.execPath, [join(ROOT, "tools/check.ts")], { cwd: ROOT, encoding: "utf8" });
  const out = (run.stdout ?? "") + (run.stderr ?? "");
  const lines = out.trim().split("\n");
  const summary = lines.at(-1) ?? "no output";
  const problems = lines.filter((l) => l.startsWith("error ") || l.startsWith("warn "));
  checks.push({
    name: "check.ts",
    level: run.status === 0 ? (problems.length ? "warn" : "ok") : "red",
    line: summary,
    detail: problems,
  });
}

// 2. inbox/: raw drops waiting to be filed. Old ones are red, because filing them is the human's ask.
{
  const dir = join(ROOT, "inbox");
  const items = readdirSync(dir).filter((n) => n !== "README.md" && !n.startsWith("."));
  const aged = items.map((n) => ({ n, age: ageDays(statSync(join(dir, n)).mtime) }));
  const old = aged.filter((i) => i.age > STALE_DAYS);
  checks.push({
    name: "inbox",
    level: old.length ? "red" : items.length ? "warn" : "ok",
    line: items.length === 0 ? "empty" : `${items.length} item(s) to file, ${old.length} older than ${STALE_DAYS} days`,
    detail: aged.map((i) => `${i.n} (${i.age} days)`),
  });
}

// 3. Uncommitted work: a note nobody committed is a note one `git checkout` from gone.
{
  const porcelain = execFileSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf8" }).trim();
  const rows = porcelain ? porcelain.split("\n") : [];
  const aged = rows.map((row) => {
    const path = row.slice(3).replace(/^"|"$/g, "");
    const full = join(ROOT, path);
    const age = existsSync(full) ? ageDays(statSync(full).mtime) : 0;
    return { row: row.trim(), age };
  });
  const old = aged.filter((r) => r.age > STALE_DAYS);
  checks.push({
    name: "git",
    level: old.length ? "red" : rows.length ? "warn" : "ok",
    line: rows.length === 0 ? "working tree clean" : `${rows.length} uncommitted path(s), ${old.length} older than ${STALE_DAYS} days`,
    detail: aged.map((r) => `${r.row} (${r.age} days)`),
  });
}

// 4. The board's own size: a Planned lane that only grows stops being a plan (s03e05, s04e01).
{
  const board = readFileSync(join(ROOT, "work/board.md"), "utf8");
  const lane = (name: string) => (board.split(new RegExp(`^## ${name}$`, "m"))[1] ?? "").split(/^## /m)[0];
  const count = (name: string) => lane(name).split("\n").filter((l) => l.startsWith("- ")).length;
  const planned = count("Planned");
  const active = count("Active");
  checks.push({
    name: "board",
    level: planned > 15 ? "warn" : "ok",
    line: `Active ${active}, Planned ${planned}${planned > 15 ? " (over 15: prune, merge or archive)" : ""}`,
  });
}

const red = checks.filter((c) => c.level === "red");
const warn = checks.filter((c) => c.level === "warn");
const verdict: Level = red.length ? "red" : warn.length ? "warn" : "ok";
const mark = { red: "RED", warn: "WARN", ok: "OK" } as const;

const report = [
  `# Health ${stamp}`,
  "",
  `Verdict: **${mark[verdict]}**${red.length ? ` — ${red.map((c) => c.name).join(", ")}` : ""}`,
  "Written by `tools/health.ts`. Mechanical only; nothing here was fixed.",
  "",
  "| Check | State | Result |",
  "| --- | --- | --- |",
  ...checks.map((c) => `| ${c.name} | ${mark[c.level]} | ${c.line} |`),
  "",
  "## Detail",
  "",
  ...checks.flatMap((c) =>
    c.detail && c.detail.length ? [`**${c.name}**`, "", ...c.detail.map((d) => `- ${d}`), ""] : [],
  ),
  "## Not covered by this run",
  "",
  "- Worker health (mail-agent, barwy-tools, away-agent, sched-prod-*): no error reporting anywhere, and `wrangler tail` needs a login, so this run says nothing about them.",
  "- Judgment: duplicate notes, notes that should link but don't, whether a Planned item is still worth doing.",
  "",
].join("\n");

if (WRITE) {
  const out = join(ROOT, "work/health", `${stamp}.md`);
  writeFileSync(out, report);
  console.log(report.trimEnd());
  console.log(`\nwritten ${out}`);
} else {
  console.log(report.trimEnd());
}
console.log(`\nverdict ${mark[verdict]}`);
process.exit(verdict === "red" ? 2 : 0);
