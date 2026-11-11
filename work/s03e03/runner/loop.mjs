#!/usr/bin/env node
// The runner: wakes every POLL_MS, reads the tracker, picks each new issue up at once
// (a comment), then hands issues one at a time to a headless coding agent (`claude -p`)
// that works them by the triage skill. Re-runs an issue when the owner or the course
// writes in its thread. Keeps state on disk so a restart does not pick up twice.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { call, config } from './tracker.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const repo = process.env.S03_REPO || join(root, 'repo', 'sched-prod-api');
const statePath = process.env.S03_STATE || join(root, 'tracker-state.json');
const logPath = process.env.S03_RUNLOG || join(root, 'runner.log');
const trackerCli = join(here, 'tracker.mjs');
const POLL_MS = Number(process.env.POLL_MS || 20000);
const RUN_TIMEOUT_MS = Number(process.env.RUN_TIMEOUT_MS || 15 * 60000);
const MODEL = process.env.AGENT_MODEL || '';

const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : { issues: {} };
const save = () => writeFileSync(statePath, JSON.stringify(state, null, 2));
const log = (...a) => {
  const line = `${new Date().toISOString()} ${a.join(' ')}`;
  console.log(line);
  appendFileSync(logPath, line + '\n');
};

const queue = [];
let busy = false;
const enqueue = (n, reason) => {
  if (queue.some((q) => q.n === n)) return;
  queue.push({ n, reason });
  log(`queue #${n} (${reason})`);
};

const foreign = (issue) => issue.thread.filter((t) => t.by !== 'agent').length;

async function poll() {
  let r;
  try { r = await call('GET', '/issues'); } catch (e) { return log('poll failed:', e.message); }
  if (!r.ok) return log('poll refused:', r.status, JSON.stringify(r.data).slice(0, 200));
  state.lastIssueBy = r.data.lastIssueBy;
  for (const issue of r.data.issues) {
    const key = String(issue.n);
    let s = state.issues[key];
    if (!s) {
      const body = `Picked up by the agent. I am reading the rules and this issue now; the outcome follows here and in the ship log.`;
      const c = await call('POST', `/issues/${issue.n}/comments`, { body }).catch((e) => ({ ok: false, data: e.message }));
      log(`pickup #${issue.n} "${issue.title}" opened ${issue.openedAt} → ${c.ok ? 'ok' : 'FAILED ' + JSON.stringify(c.data)}`);
      if (!c.ok) continue; // try again next poll
      s = state.issues[key] = { pickedAt: new Date().toISOString(), seenForeign: -1, runs: 0 };
      save();
      enqueue(issue.n, 'new issue');
    } else if (foreign(issue) > s.seenForeign && !(busy === issue.n)) {
      enqueue(issue.n, 'new entry in the thread from the owner or the course');
    }
  }
  pump();
}

function runAgent(n, reason) {
  const prompt = [
    `You are the delivery agent of sched-prod-api, running alone on a host. Nobody can answer you in this session; the owner answers only in the issue thread, later.`,
    `Work issue #${n} now. Why this run: ${reason}.`,
    `First load the \`triage\` skill and follow its part "Running alone". Read AGENTS.md in this repo.`,
    `Your tracker calls go through one CLI: \`node ${trackerCli} help\`. Write comment and record texts to files under ./.agent-tmp/ and pass the file path. Do not chain shell commands with && or pipes; run one command per call.`,
    `Finish only when issue #${n} has its ship line (or its newest ship line is still right). Then reply with one line: what you did.`,
  ].join('\n');
  const allowed = [
    'Read', 'Edit', 'Write', 'Glob', 'Grep', 'Skill',
    `Bash(node ${trackerCli}:*)`,
    'Bash(npm test:*)', 'Bash(npm run deploy:*)', 'Bash(node --test:*)',
    'Bash(git add:*)', 'Bash(git commit:*)', 'Bash(git status:*)', 'Bash(git diff:*)', 'Bash(git log:*)',
    'Bash(git revert:*)', 'Bash(mkdir -p .agent-tmp)', 'Bash(ls:*)',
  ];
  const args = ['-p', prompt, '--allowedTools', ...allowed, '--disallowedTools', 'WebFetch', 'WebSearch', '--strict-mcp-config', '--output-format', 'text'];
  if (MODEL) args.push('--model', MODEL);
  return new Promise((resolve) => {
    const child = spawn('claude', args, { cwd: repo, env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    const timer = setTimeout(() => { log(`#${n} run timed out, killing`); child.kill('SIGKILL'); }, RUN_TIMEOUT_MS);
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, out }); });
  });
}

async function hasShipLine(n) {
  const r = await call('GET', '/shiplog').catch(() => null);
  const text = r?.data?.text || '';
  return text.split('\n').some((l) => l.trim().startsWith(`#${n} `));
}

async function pump() {
  if (busy !== false || queue.length === 0) return;
  const { n, reason } = queue.shift();
  busy = n;
  const s = state.issues[String(n)];
  try {
    const before = await call('GET', `/issues/${n}`);
    const seen = before.ok ? foreign(before.data.issue ?? before.data) : s.seenForeign;
    for (let attempt = 1; attempt <= 2; attempt++) {
      s.runs++;
      log(`run #${n} attempt ${attempt} start`);
      const { code, out } = await runAgent(n, reason);
      log(`run #${n} attempt ${attempt} exit ${code}: ${out.trim().split('\n').slice(-6).join(' | ').slice(0, 1200)}`);
      if (await hasShipLine(n)) break;
      if (attempt === 2) {
        const line = `#${n} · waiting · live: ✗ · open risks: #${n} owner (the agent's run did not finish)`;
        await call('POST', '/shiplog', { line });
        log(`fallback ship line for #${n}`);
      }
    }
    s.seenForeign = seen;
    s.lastRunAt = new Date().toISOString();
    save();
  } catch (e) {
    log(`run #${n} crashed: ${e.stack || e.message}`);
  } finally {
    busy = false;
    setImmediate(pump);
  }
}

log(`runner up: tracker ${config().tracker}, repo ${repo}, poll ${POLL_MS} ms`);
await poll();
setInterval(poll, POLL_MS);
