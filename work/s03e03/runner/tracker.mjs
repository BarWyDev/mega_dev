#!/usr/bin/env node
// The agent's only door to the outside: the course tracker (token from the config file),
// read-only views of the feed and of the live API. Every call is logged, token masked.
import { readFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const configPath = process.env.S03_CONFIG || join(here, '..', 'secrets.local.json');
const logPath = process.env.S03_LOG || join(here, '..', 'tracker-calls.log');

export function config() {
  return JSON.parse(readFileSync(configPath, 'utf8'));
}

function log(entry) {
  try {
    appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n');
  } catch {}
}

export async function call(method, path, body) {
  const { tracker, token } = config();
  const url = tracker.replace(/\/$/, '') + path;
  const res = await fetch(url, {
    method,
    headers: { authorization: `Bearer ${token}`, ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  log({ method, path, body, status: res.status, reply: text.length > 4000 ? text.slice(0, 4000) + '…' : text });
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { status: res.status, ok: res.ok, data };
}

async function plainGet(url) {
  const res = await fetch(url);
  const text = await res.text();
  log({ method: 'GET', url, status: res.status, reply: text.slice(0, 2000) });
  return { status: res.status, text };
}

const HELP = `tracker.mjs — the agent's calls (JSON out)
  issues                      all open-so-far issues with threads
  issue <n>                   one issue
  comment <n> <file>          post the file's text as a comment
  label <n> <label>           add a label
  close <n>                   close the issue
  records                     all decision records
  record <id>                 one record with history
  put-record <id> <file>      new version of YOUR record (id = NNNN-slug, from 0007)
  shiplog                     the ship log
  ship "<line>"               post one ship line
  feed                        GET the production incident feed (read only)
  live <path>                 GET <path> on the live API, e.g. live "/incidents?status=open"
`;

async function main() {
  const [cmd, a, b] = process.argv.slice(2);
  const out = (r) => {
    console.log(`HTTP ${r.status}`);
    console.log(JSON.stringify(r.data, null, 2));
    if (!r.ok) process.exitCode = 1;
  };
  const fileText = (f) => readFileSync(f, 'utf8').trim();
  switch (cmd) {
    case 'issues': return out(await call('GET', '/issues'));
    case 'issue': return out(await call('GET', `/issues/${a}`));
    case 'comment': return out(await call('POST', `/issues/${a}/comments`, { body: fileText(b) }));
    case 'label': return out(await call('POST', `/issues/${a}/labels`, { label: b }));
    case 'close': return out(await call('POST', `/issues/${a}/close`));
    case 'records': return out(await call('GET', '/records'));
    case 'record': return out(await call('GET', `/records/${a}`));
    case 'put-record': return out(await call('PUT', `/records/${a}`, { text: fileText(b) }));
    case 'shiplog': {
      const r = await call('GET', '/shiplog');
      console.log(`HTTP ${r.status}`);
      console.log(r.data.text ?? JSON.stringify(r.data));
      return;
    }
    case 'ship': return out(await call('POST', '/shiplog', { line: a }));
    case 'feed': {
      const r = await plainGet(config().feed);
      console.log(`HTTP ${r.status}`);
      console.log(r.text);
      return;
    }
    case 'live': {
      const r = await plainGet(config().live.replace(/\/$/, '') + (a || '/'));
      console.log(`HTTP ${r.status}`);
      console.log(r.text);
      return;
    }
    default:
      console.log(HELP);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
