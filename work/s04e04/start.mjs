// One-time: put the ticket into the Host Desk vars, fetch the manual once, store the attempt, read the board.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
const DESK = new URL('../s04e01/repo/host-desk/', import.meta.url).pathname;
const HQ = 'https://hq.mega.dev/challenges/leave-it-running';
const mask = (s) => String(s).replace(/v1\.[A-Za-z0-9_-]{12}[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+/g, (m) => `${m.slice(0, 14)}…`);
const log = (t) => appendFileSync('out/requests.log', `${new Date().toISOString()} ${mask(t)}\n`);
const vars = JSON.parse(readFileSync(DESK + 'vars.json', 'utf8'));
vars.TICKET = JSON.parse(readFileSync('secrets.local.json', 'utf8')).ticket;
const res = await fetch(`${HQ}/manual`, { headers: { Authorization: `Bearer ${vars.TICKET}` }, redirect: 'manual' });
const text = await res.text();
log(`GET ${HQ}/manual -> ${res.status} ${text}`);
if (res.status !== 200) { console.log('manual refused', res.status, mask(text)); process.exit(1); }
const man = JSON.parse(text);
vars.ATTEMPT = man.attempt;
writeFileSync(DESK + 'vars.json', JSON.stringify(vars, null, 2), { mode: 0o600 });
writeFileSync('out/manual.json', mask(JSON.stringify(man, null, 2)));
console.log('attempt stored; expires', man.attemptExpiresAt);
console.log(man.manual); console.log('next:', man.next);
const b = await fetch(`${HQ}/board`, { headers: { Authorization: `Bearer ${vars.ATTEMPT}` }, redirect: 'manual' });
const bt = await b.text();
log(`GET ${HQ}/board -> ${b.status} ${bt}`);
writeFileSync('out/board-0.json', mask(bt));
console.log('board', b.status); console.log(mask(JSON.stringify(JSON.parse(bt), null, 2)));
