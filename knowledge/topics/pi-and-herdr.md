---
title: Pi and Herdr — what each does and why the course pairs them
type: topic
source: lessons s01e04 and s01e05; https://pi.dev/docs/latest and https://herdr.dev/ (read 2026-10-31)
updated: 2026-10-31
trust: medium
status: active
tags: [pi, herdr, harness, multi-agent, setup]
links: [limen-mapping.md, ../../lessons/s01e04-working-with-ai-harnesses.md, ../../lessons/s01e05-building-workflows-not-tool-stacks.md, ../../context/agent-setup.md]
---

Pi is the agent (a terminal harness like Claude Code or Codex). Herdr holds the
agents: it owns their terminals and keeps them running after the window closes.
Together they give one coordinator agent many durable workers. Read from the
docs, not run here; trust is medium.

## Pi (https://pi.dev/docs/latest)

- Terminal agent: given a goal and a folder, it reads files, runs commands,
  edits, works through multi-step tasks.
- **Provider-agnostic:** subscription, API key, local model or any compatible
  endpoint. `/login` picks the provider, `/model` the model.
- **Deep customization:** [extensions](https://pi.dev/docs/latest/extensions)
  change lifecycle, tools, commands, shortcuts, event handlers, prompt. Also
  skills, prompt templates, packages, sessions with resume and branching.
- **Self-configuration:** ask it to read its own docs and change its settings.
- **Embeddable:** print mode, JSON event stream, RPC mode, TypeScript SDK — can
  be the core of a custom agent, not just a coding tool.
- Install `curl -fsSL https://pi.dev/install.sh | sh`, then `cd <project> && pi`.
  Config lives in `~/.pi/agent/`.
- Tools and extensions run with the user's permissions; project trust controls
  what loads but does not sandbox.

## Herdr (https://herdr.dev/)

- Native app plus a small server (herdr-core). Agents live in the server, so
  closing or updating the app does not stop them; stopping the server or a
  reboot does.
- Structure: space/workspace per repo → tab per task → pane = a real terminal
  with one agent.
- Agent state shown as working / waiting on you / done. Needs the agent to
  speak OSC 7501; others run but show no state.
- Runs any terminal agent, not only Pi. Remote machines join over SSH
  (`hc machine add vps`) and appear in the same sidebar.
- Install `curl -fsSL https://releases.herdr.dev/app/install.sh | sh`. Keys in
  `~/.config/herdr-app/keys.json`.
- **CLI drift:** the s01e04 lesson uses `herdr tab create`, `herdr agent start`,
  `herdr agent prompt`, `herdr agent read`. The site on 2026-10-31 shows `hc run
  --bg …`, `hc send <tab> "…"`. Check current docs before scripting against it.

## How they work together (s01e04)

1. Start Herdr, run Pi in it: this Pi is the coordinator.
2. The coordinator calls Herdr: opens a background tab, starts a worker Pi,
   types the task, reads the worker's screen.
3. A worker is like a subagent but fully interactive: you can step into its
   tab, it can have its own hooks, it can start on an outside event.
4. Full version is limen ([limen-mapping](limen-mapping.md)): agents talk only
   through files (job folder with `state`, `log`, `steer/inbox`); a supervisor
   uses Herdr to check workers are alive; Pi extensions wake the coordinator
   when a job ends and deliver steering between tool calls.
5. s01e05 moves the same setup to a VPS behind Tailscale, with GitHub Apps so
   agents pick up Issues and open PRs; you steer from desktop or phone.

## Why this setup

- Durable: agents outlive the terminal, and on a VPS the laptop.
- One coordinator runs many workers in parallel; you step into any of them.
- Clear view of who works, who waits on you, who is done.
- Both tools manage themselves: build the setup by chatting, not by hand.
- No lock-in to one model provider.
- Files and git are the truth, so runs can be checked and replayed.

Caveats: no sandbox (a worktree separates work, it does not protect); the lesson
itself says keep the setup simple and that Claude Code or Cursor is still a fair
choice.

## Here

Per [limen-mapping](limen-mapping.md), the Claude Code desktop app already
covers most of it: background sessions with finish notices (Herdr tabs,
supervisor), `SendMessage` (steering inbox), built-in worktrees. Pi and Herdr
earn their place if non-Claude models or a 24/7 VPS seat (s01e05) become goals.
