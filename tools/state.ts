// Current state of this base, printed at session start (SessionStart hook).
// Gives the agent an initial state message so it doesn't have to read files to learn it.
// Run: node tools/state.ts

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");

const inbox = readdirSync(join(ROOT, "inbox")).filter((name) => name !== "README.md" && !name.startsWith("."));

const board = readFileSync(join(ROOT, "work/board.md"), "utf8");
const active = (board.split(/^## Active$/m)[1] ?? "").split(/^## /m)[0];
const activeItems = active.split("\n").filter((line) => line.startsWith("- "));

const lastLog = readFileSync(join(ROOT, "log.md"), "utf8").trimEnd().split("\n").at(-1) ?? "";

console.log(
  [
    "State of the knowledge base at session start:",
    `- inbox/: ${inbox.length === 0 ? "empty" : `${inbox.length} item(s) to file: ${inbox.join(", ")}`}`,
    `- Active on work/board.md: ${activeItems.length === 0 ? "nothing" : ""}`,
    ...activeItems.map((line) => `  ${line}`),
    `- Last log.md entry: ${lastLog.replace(/^- /, "")}`,
  ].join("\n"),
);
