// Health check for this knowledge base. Mechanics only; judgment stays in notes.
// Run: node tools/check.ts   (Node 23.6+ runs TypeScript directly)
// Exit 1 on errors. Warnings (stale notes) are printed but don't fail.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const STALE_DAYS = 30;

const REQUIRED = ["title", "type", "source", "updated", "trust", "status", "tags", "links"] as const;
const ENUMS: Record<string, string[]> = {
  type: ["context", "lesson", "topic", "task", "pointer"],
  trust: ["high", "medium", "low"],
  status: ["active", "stale", "archived"],
};
// Files that carry no frontmatter by design.
const NO_FRONTMATTER = new Set(["index.md", "log.md", "CLAUDE.md"]);
const SKIP_DIRS = new Set([".git", "node_modules", "inbox"]);

type Frontmatter = Record<string, string | string[]>;

const errors: string[] = [];
const warnings: string[] = [];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      // Skip inbox/ and archive/inbox/: raw drops, not notes.
      return SKIP_DIRS.has(name) ? [] : walk(path);
    }
    return name.endsWith(".md") ? [path] : [];
  });
}

// Minimal parser for the flat YAML this base uses: `key: value` and `key: [a, b]`.
function parseFrontmatter(text: string): Frontmatter | null {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const fm: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*?)\s*(#.*)?$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    fm[key] = raw.startsWith("[")
      ? raw.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean)
      : raw.replace(/^["']|["']$/g, "");
  }
  return fm;
}

// Relative Markdown links in the body: [text](path) or [text](path#anchor).
function bodyLinks(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((m) => m[1].split("#")[0])
    .filter((href) => href && !/^[a-z]+:/i.test(href));
}

function checkLink(from: string, href: string, where: string) {
  const target = resolve(dirname(from), href);
  if (!existsSync(target)) errors.push(`${rel(from)}: broken ${where} link -> ${href}`);
}

const rel = (p: string) => relative(ROOT, p);

const files = walk(ROOT);
const today = new Date();

for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const href of bodyLinks(text)) checkLink(file, href, "body");

  if (NO_FRONTMATTER.has(rel(file))) continue;

  const fm = parseFrontmatter(text);
  if (!fm) {
    errors.push(`${rel(file)}: missing frontmatter`);
    continue;
  }
  for (const key of REQUIRED) {
    if (!(key in fm) || fm[key] === "") errors.push(`${rel(file)}: missing field '${key}'`);
  }
  for (const [key, allowed] of Object.entries(ENUMS)) {
    const value = fm[key];
    if (typeof value === "string" && value && !allowed.includes(value)) {
      errors.push(`${rel(file)}: ${key} '${value}' not in [${allowed.join(", ")}]`);
    }
  }
  for (const href of Array.isArray(fm.links) ? fm.links : []) checkLink(file, href, "frontmatter");

  if (rel(file).startsWith("archive/") && fm.status !== "archived") {
    errors.push(`${rel(file)}: in archive/ but status is '${fm.status}'`);
  }

  const updated = typeof fm.updated === "string" ? new Date(fm.updated) : null;
  if (!updated || isNaN(updated.getTime())) {
    errors.push(`${rel(file)}: 'updated' is not a date`);
  } else if (fm.status === "active") {
    const age = Math.floor((today.getTime() - updated.getTime()) / 86_400_000);
    if (age > STALE_DAYS) warnings.push(`${rel(file)}: active but updated ${age} days ago`);
  }
}

// Every note (outside archive/) must be listed in index.md.
const index = readFileSync(join(ROOT, "index.md"), "utf8");
const indexed = new Set(bodyLinks(index).map((href) => rel(resolve(ROOT, href))));
for (const file of files) {
  const path = rel(file);
  if (path === "index.md" || path.startsWith("archive/")) continue;
  if (!indexed.has(path)) errors.push(`index.md: missing entry for ${path}`);
}

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`error ${e}`);
console.log(`${files.length} files checked, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
