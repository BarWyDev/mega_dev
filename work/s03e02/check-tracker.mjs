// Step 5 of the triage skill, as a script: checks doc/issues against the requests seen on the API.
// Usage: node check-tracker.mjs <path to sched-prod> <api url> <session>
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [root, api, session] = process.argv.slice(2);
const dir = join(root, 'doc', 'issues');
const errs = [];
const list = (v) => (v ? v.replace(/^\[|\]$/g, '').split(',').map((s) => s.trim()).filter(Boolean) : []);

const issues = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
  const raw = readFileSync(join(dir, f), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { errs.push(`${f}: no frontmatter`); return { f, fm: {}, body: '' }; }
  const fm = Object.fromEntries(m[1].split('\n').map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()]));
  return { f, fm, body: m[2], labels: list(fm.labels), sources: list(fm.sources), blocked: list(fm['blocked-by']) };
});
const keys = new Set(issues.map((i) => i.fm.key));

const specs = ['product.md', 'design.md', 'autonomy.md'].map((f) => readFileSync(join(root, 'specs', f), 'utf8')).join('\n');
const ruleIds = new Set([...specs.matchAll(/\b(PRD|DES|AUT)-\d+\b/g)].map((m) => m[0]).concat(['ADR-0001', 'ADR-0002']));

for (const i of issues) {
  const { f, fm, body, labels } = i;
  if (!fm.key || `${fm.key}.md` !== f) errs.push(`${f}: key does not match file name`);
  if (!['open', 'done', 'closed'].includes(fm.status)) errs.push(`${f}: bad status`);
  const marks = labels.filter((l) => l === 'agent-ready' || l === 'needs-human');
  if (!labels.some((l) => l.startsWith('from:'))) errs.push(`${f}: no from: label`);
  if (fm.status === 'open' && marks.length !== 1) errs.push(`${f}: open issue needs exactly one mark`);
  if (fm.status !== 'open' && marks.length) errs.push(`${f}: mark on a ${fm.status} issue`);
  if (fm.status === 'closed') {
    if (!['duplicate', 'obsolete', 'contradicts-spec', 'not-planned'].includes(fm.reason)) errs.push(`${f}: closed without a valid reason`);
    if (!/\b((PRD|DES|AUT)-\d+|ADR-\d+|SCHED-\d+|IN-\d+)\b/.test(body)) errs.push(`${f}: closed body cites no id`);
    if (fm.reason === 'duplicate' && !keys.has(fm['duplicate-of'])) errs.push(`${f}: duplicate-of missing or unknown`);
  } else if (fm.reason) errs.push(`${f}: reason on a ${fm.status} issue`);
  if (marks[0] === 'agent-ready') {
    for (const h of ['## Intent', '## Acceptance', '## Boundaries']) if (!body.includes(h)) errs.push(`${f}: no ${h}`);
    const acc = body.split('## Acceptance')[1]?.split('## Boundaries')[0] ?? '';
    const lines = acc.split('\n').filter((l) => l.startsWith('- '));
    if (lines.length < 2 || !lines.every((l) => /Given .*, when .*, then /.test(l))) errs.push(`${f}: acceptance lines are not Given/when/then`);
    if (!lines.some((l) => /\b(not?|nothing)\b/.test(l.split(', then ')[1] ?? ''))) errs.push(`${f}: no "must not happen" acceptance line`);
    if (!/- Must not touch /.test(body)) errs.push(`${f}: no Must not touch boundary`);
    if (!/\nAllowed by AUT-1 \(.+\)\.\n$/.test(body)) errs.push(`${f}: no Allowed by line at the end`);
    const quoted = body.match(/Allowed by AUT-1 \((.+)\)\./)?.[1];
    if (quoted && !specs.includes(quoted)) errs.push(`${f}: Allowed by quotes a line that is not in autonomy.md`);
  }
  if (marks[0] === 'needs-human') {
    for (const h of ['## Question', '## Options', '## Recommendation', '## Why']) if (!body.includes(h)) errs.push(`${f}: no ${h}`);
    if (!/\n2\. /.test(body)) errs.push(`${f}: fewer than two options`);
    if (!/## Recommendation\nOption \d/.test(body)) errs.push(`${f}: recommendation names no option`);
    const why = body.split('## Why')[1] ?? '';
    if (!/\b((PRD|DES|AUT)-\d+|ADR-\d+|SCHED-\d+|IN-\d+)\b/.test(why)) errs.push(`${f}: Why cites no id`);
  }
  for (const b of i.blocked) {
    const t = issues.find((x) => x.fm.key === b);
    if (!t) errs.push(`${f}: blocked-by ${b} does not exist`);
    else if (t.fm.status !== 'open') errs.push(`${f}: blocked-by ${b} is ${t.fm.status}`);
  }
  for (const id of body.match(/\b((PRD|DES|AUT)-\d+|ADR-\d+)\b/g) ?? []) if (!ruleIds.has(id)) errs.push(`${f}: cites unknown rule ${id}`);
  for (const id of body.match(/\bSCHED-\d+\b/g) ?? []) if (!keys.has(id)) errs.push(`${f}: cites unknown issue ${id}`);
}

// every request in the ledger (requests.json, kept by collect.sh) sits in exactly one issue's sources.
// A channel read without a cursor gives only its first page, so the API is no check of what was seen.
const ledger = JSON.parse(readFileSync(new URL('./requests.json', import.meta.url), 'utf8'));
const seen = Object.keys(ledger);
const backlog = (await (await fetch(`${api}/backlog?t=${session}`)).json()).issues;
for (const b of backlog) if (!keys.has(b.key)) errs.push(`backlog issue ${b.key} is missing`);
for (const id of seen) {
  const n = issues.filter((i) => i.sources.includes(id)).length;
  if (n !== 1) errs.push(`request ${id} is in the sources of ${n} issues`);
}
for (const i of issues) for (const s of i.sources) if (!seen.includes(s)) errs.push(`${i.f}: source ${s} is not in the ledger`);

const count = (p) => issues.filter(p).length;
console.log(`requests in the ledger: ${seen.length} · backlog: ${backlog.length} · issues: ${issues.length}`);
console.log(`agent-ready ${count((i) => i.labels?.includes('agent-ready'))} · needs-human ${count((i) => i.labels?.includes('needs-human'))} · done ${count((i) => i.fm.status === 'done')} · closed ${count((i) => i.fm.status === 'closed')}`);
console.log(errs.length ? `FAIL\n${errs.join('\n')}` : 'OK');
process.exit(errs.length ? 1 : 0);
