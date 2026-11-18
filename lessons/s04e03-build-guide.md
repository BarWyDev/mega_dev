---
title: "s04e03 — Build guide: Domain Agents, Glossaries, and Agent Contracts (lesson text, part 2)"
type: source
source: https://hq.mega.dev/lessons/s04e03/build-guide/lesson.md, read in the browser 2026-11-18
updated: 2026-11-18
trust: high
status: active
tags: [lesson-text, domain-agents, memories, path-hook, glossaries, scenario-checks, codeowners, contracts, mcp, lab, expectations]
links: [s04e03-software-factory-staff-the-team.md, s04e02-build-guide.md, s04e01-build-guide.md, ../context/course.md]
---

Raw copy of the second part of lesson s04e03, the Build guide, by John Lindquist.
Read from the page's Markdown file in the browser pane on 2026-11-18 and retyped
by the agent from that text (no file download). Not edited.
The first part, John's video, is [s04e03-software-factory-staff-the-team.md](s04e03-software-factory-staff-the-team.md).

# S04E03 · Build guide: Domain Agents, Glossaries, and Agent Contracts

> **This is the second part of the lesson.** It is the written version of what John builds in the video, step by step. The video is in the first part, the [lesson](https://hq.mega.dev/lessons/s04e03/). That part is John's talk: [Domain agents](https://hq.mega.dev/lessons/s04e03/#domain-agents) and [Glossaries](https://hq.mega.dev/lessons/s04e03/#glossaries). On this page, the notes that start with "The principle" link each build back to the lesson.

By now we have widgets watching our project, and a swarm of small, fast models gathering context into Main, our one focused conversation. If we work by ourselves on a solo project, that might be all we need. As John puts it, when the entire project and all of its history fit into the context of one model, **doing much more is over-architecting**.

A project that grows past that point is a different story. This lesson is about what to add then: Domain Agents, small experts that each own one part of the codebase, carry its memories, and speak up when Main walks into their area. We seed one from our project's history, let two of them coordinate on one feature, give them a glossary and checks so a team can share them, and then step back to look at the contracts between all the agents we have built.

John's workspace is [Herdr](https://herdr.dev/) and his harness is [Pi](https://pi.dev/). As in **S04E01** and **S04E02**, **every build here is described by the capability it needs**, with Pi and Herdr shown alongside as one labelled example, and each build comes with a prompt to start from and a way to check it. The checks use the lab from **S04E01**, the isolated copy of our workspace in which a separate agent tests our tools from the outside.

## Outline

- The Bus Factor: when one model stops being enough, hidden edge cases, domain agents and throwaway agents
- Seeding a Domain Agent: stale instruction files, an owned folder, harvesting history, two kinds of memory, a path hook, one writer
- Crossing Two Domains: a second agent, consulting before editing, a collision that needs our call, checking from outside, memories with receipts
- Glossaries and Scenario Checks: what words mean inside a boundary, one router hook, unit tests and scenario checks, guarding the agents folder
- Pull, Push, and Contracts: asking and being woken, four contracts around Main, where MCP fits, the same pattern at the product's door

## The Bus Factor

So when does one big model in Main start dropping the ball? Usually it comes down to a question of context. Our codebase gets large, it has a long history, and several people send in changes all the time. **Every module hides old edge cases.**

There is often one engineer who remembers why booking works that one way, and then they leave. That risk has a name, the [bus factor](https://en.wikipedia.org/wiki/Bus_factor). A fresh main conversation has the same problem every single time it starts: it knows nothing of that history, and in John's words, it **walks naively and confidently into a room full of traps**.

A popular answer goes back to [domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design), and it gives us Domain Agents. A Domain Agent is different from a throwaway agent that we spin up in the main conversation, such as a gatherer from **S04E02**, which disappears when its answer is delivered:

- **It owns a part of the codebase:** a set of paths, the way a [CODEOWNERS file](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) on GitHub gives paths to people.
- **It carries living memories of that domain:** what the team learned there, with a reference for each lesson.
- **It maps to a concept of the project:** often a term from the glossary, such as booking or pricing, so the set of Domain Agents is different in every project.
- **It advises and reviews:** Main still writes the code.

![Table comparing a throwaway agent with a Domain Agent, whose heading is red. Lives: for one answer in the main conversation; in the repository, as a folder. Owns: nothing; a part of the codebase, like a code owner. Remembers: nothing after it answers; what the team learned in its area, with references. Writes code: no, Main does; no, Main does.](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-1/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-1/frame.html)

Over time a Domain Agent can grow and evolve, and eventually it can even help our customers. John's examples use his sample project, RentAPlace, a vacation rental app, where he creates one Domain Agent for booking and one for pricing. **Everything below works the same on a project of our own**, with our own areas in place of those two.

## Seeding a Domain Agent

Anyone who has used agents for a while knows that maintaining an `AGENTS.md` file can be quite a challenge. For a long time the advice was to put all of our memories and rules in there. Over time we learned that it goes stale, and that **our agents often ignore the most important parts anyway**. One study of such files, [Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988), found that they did not generally improve task success while raising cost by over 20% on average.

So let's take the forgotten history we want to surface and turn it into an active expert. John's example is a ticket in Main: a closed home is still bookable. The obvious fix is a one-line check right at the top of a booking function. If we ship that one-liner, it silently breaks retries and guest refunds. **This is exactly the kind of trap that lives in history and not in the code.**

In Main, we ask for a new folder, `agents/booking/`. It follows the form from **S04E01**, where a saved agent lives in `agents/<name>/` with its instructions in `agent.md`, and it adds the paths the agent owns. The agent runs on a small, fast model, read-only, as our booking brain.

**What it needs:**

- **The /agent command from S04E01**, or another way to start a second harness with a job, a chosen model, and no write access, such as a headless run (a run without a conversation, like `claude -p` or `codex exec`).
- **A place for the paths:** a few lines at the top of `agent.md` that list the files the agent owns as globs (patterns such as `src/booking/**` that match many files).

We can send this prompt, replacing the bracketed parts with an area of our own project:

```
Create a Domain Agent for [area, for example booking] in agents/[area]/. In agent.md, list the paths it owns as globs under "owns:", the way a CODEOWNERS file would: [the source folder] and [its tests]. Under a "## Job" heading, write its job: it is the expert for these paths, it reads memories.md in its own folder at the start of every run, it answers and reviews from those memories, it names the reference for every claim, it says "nothing relevant" when it has nothing, and it never edits files. Set it to run on a small, fast model with read-only access. Do not write any memories yet.
```

The file can also be written by hand. It looks like this:

```
---
owns:
  - [the source folder]/**
  - [its tests]/**
model: [a small, fast model]
access: read-only
---
## Job
You are the Booking Domain Agent for this project. You know the history of the paths you own. Read agents/booking/memories.md first. When asked about a change, answer from it: name the traps the change could hit and the reference for each one. If nothing in your memories applies, say "nothing relevant". You advise and review. You never edit files.
```

The lines at the top are for our own commands and hooks to read. A harness that keeps its agent definitions somewhere else, as Claude Code does with its subagents, does not need to understand them: `agents/` stays the source, and the text under Job is handed to the run as its instructions.

**Pi and Herdr:** with the /agent command from **S04E01**, the request can be one line that names the folder, the paths and their tests, a small model, and read-only access.

An empty expert is no use, and we do not want to start writing its memories from scratch. **We harvest them.** A quick swarm of agents, or Main itself, goes through four sources for traps related to the area:

- **Git blame:** the commits that changed the owned files and why, with [git blame](https://git-scm.com/docs/git-blame) and [git log](https://git-scm.com/docs/git-log).
- **Closed issues:** the bugs that were reported there, for example with [gh issue list](https://cli.github.com/manual/gh_issue_list).
- **Pull requests:** the review comments and fixes, with [gh pr list](https://cli.github.com/manual/gh_pr_list).
- **Past conversations:** our own earlier decisions about the area, in our harness's saved sessions.

One rule is critical in this seed round: **every memory cites the commit or the issue where the team learned the lesson the hard way.**

![Diagram of seeding a Domain Agent's memories. On the left, a frame named History holds "Git blame", "Closed issues", "Pull requests" and "Past conversations". A line labelled "traps in this area" goes to Harvest, "A quick swarm, or Main". A red line labelled "memories" goes from Harvest to a frame named agents/booking/memories.md, which holds two parts: "Internal engineering", "Where the traps are", and "Customer facing", "Rules and policies that caused issues". Under them, in red: "Every memory cites its commit or issue".](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-2/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-2/frame.html)

The memories go into a `memories.md` file with two clean sections. One is for internal engineering, the notes that tell us where all the traps are. The other is for customer-facing rules and policies that have caused issues in the past. Keeping them apart now helps later, **if or when the agent evolves into something that talks to customers**, because only the second section is safe to say out loud.

We can ask for the harvest with this prompt:

```
Seed the memories of the [area] Domain Agent. Read agents/[area]/agent.md for the paths it owns. Then harvest traps for those paths from four sources: git blame and git log for the owned files, closed issues, merged pull requests and their review comments through the gh CLI, and my past conversations in [my harness] that touched those files. If [my harness] has subagents, use one per source in parallel.

Write agents/[area]/memories.md with two sections, "## Internal engineering" and "## Customer facing". Each memory is one rule in one or two sentences, followed by its reference: a commit, or an issue or pull request number. A memory that comes only from a past conversation is marked "from a conversation" with its date. Leave out anything you cannot cite. If a source has nothing, say so at the end of the file. Do not edit any other file.
```

We can also start the file ourselves in this shape and let the harvest fill it. The two entries are examples, and the references are placeholders:

```
# Booking memories

## Internal engineering
- Check for a retried request before rejecting a booking, or a retry of a booking that already succeeded fails. [commit or issue]

## Customer facing
- A quote is only valid against the live calendar. [issue]
```

**Done when:** every memory in the file has a reference we can open or is marked as coming from a conversation, both sections exist, and a second read of two or three references shows that the memory says what the commit or issue says, and no more.

Now we make it Intuitive, the pillar about tools that surface what we need just in time, by having the agent fade into the background. **Nobody should have to remember to ask Booking.**

Almost all harnesses have a way to detect when an agent touches a file, usually as a read hook or an edit hook. We use it so that whenever Main starts looking at files that match the globs in the Booking agent's configuration, the Booking agent is triggered and hands Main a short summary of the issues it might run into. The summary is useful because it combines two contexts: what Main is doing right now, and everything the agent remembers.

![Sequence of a path hook waking a Domain Agent. On the left, a frame named Main, "The only writer", holds "Reads or edits a file". A line labelled "file path" goes to the Path hook: "Does the path match an owned glob?". A line labelled "wakes" goes from the hook to a frame named Booking, "Small, fast model, read-only", which holds agent.md, "Owned paths", and memories.md. A dashed red line labelled "a short brief of the traps in play" goes from Booking back to Main under the row.](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-3/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-3/frame.html)

**What it needs:**

- **A file hook:** a way for the harness to run our code when the agent is about to read or edit a file, and to add text to the conversation. Examples are `PreToolUse` in [Claude Code hooks](https://code.claude.com/docs/en/hooks) and [Codex hooks](https://developers.openai.com/codex/hooks), and the `tool_call` event of a Pi extension in the [Pi extension docs](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md).
- **A model call:** a way to run the Domain Agent on a small, fast model without opening a conversation, as in **S04E02**.

We can ask for the hook with this prompt, replacing the bracketed name:

```
Read the hook docs for [my harness] first, and tell me plainly if it cannot run code when the agent reads or edits a file, or cannot add text to the conversation from a hook.

Build one path hook for Domain Agents:
1. When Main is about to read or edit a file, compare the path with the "owns:" globs in every agents/*/agent.md. If [my harness] reads files through shell commands, match the paths in those commands too, and tell me what the hook cannot see.
2. On a match, run that Domain Agent once, headless, on its small, fast model with read-only access. Give it its Job, its memories.md, the file path, and Main's latest prompt if the hook can read the conversation. Ask for a brief of at most five lines: the traps in play for this change, each with its reference, or "nothing relevant".
3. Add the brief to Main's conversation as context, in the form the hook docs require. Do not block the read or the edit, and never let the Domain Agent edit a file.
4. Brief Main once per Domain Agent per conversation, and again only when Main's task changes or I ask. Keep a small record per conversation for that, and give me a command to ask for a brief.
5. Write the hook so a new folder under agents/ with an "owns:" list is picked up without changing the hook.
6. Keep the hook's configuration in this project, if [my harness] supports project-level hooks, so my teammates get it with the repository.
```

**If something is missing:**

- **No file hook:** we can add one line to `AGENTS.md` instead: before reading or editing a file, check the owned paths in `agents/*/agent.md` and ask the matching Domain Agent first. It depends on Main following the line, so it is weaker than a hook.
- **A hook that cannot add text:** the hook can write the brief to a file and print its path, and Main is told to read that file.
- **No headless model call:** we can open the Domain Agent in a pane with /agent and ask it by hand until the hook exists.

With the hook in place, the example reads differently. When Main touches anything in the booking module, the Booking agent can flag the trap around retries right away, and warn Main to check for a replayed request before it rejects a closed home. **Main stays on the task and stays the agent that writes to files.** It can still run its own subagents. But whenever it enters a specific domain, the critical memories trickle into its context and help us avoid those landmines.

Like every agent, a Domain Agent is checked in the lab. Two things are worth checking. The first is a frozen suite of cases for the area, which must pass with Main's fix: in John's example, every retry, refund, and closed-home case. The second is that the agent, handed the naive patch from outside, warns about it because of its memories.

We can save expectations like these as `agents/booking/expectations.md`, replacing the Do lines with a tempting wrong fix from our own project. In the lab the agent is opened beside Main with /agent, as in **S04E01**, so it sees Main's prompt and answers in its own pane:

```
# Booking expectations

## Warns about the naive fix
Do (Main): Review this change for me: [describe the obvious one-line fix]. Don't change any files; reply in two sentences.
Expect (Booking): names the trap the change would hit and gives a reference from its memories
Never (Booking): approves the change without mentioning the trap

## Says so when it has nothing
Do (Main): Review this change for me: [describe a harmless change that touches none of the memories]. Don't change any files; reply in one sentence.
Expect (Booking): says it has nothing relevant
Never (Booking): invents a trap or a reference
```

**Done when:** `/lab test booking`, or the command we built in its place, passes both expectations on two runs in a row. The hook is checked separately in our daily workspace: a first read of an owned file puts a brief with references into Main without us asking.

Let's look at what lives in the repository now. It is not a long file of rules that nobody maintains. It is **a Domain Agent seeded from real history, which wakes up when another agent looks into its area** and hands over its context just in time.

**The principles:** a Domain Agent owns one part of the codebase: [Domain agents](https://hq.mega.dev/lessons/s04e03/#domain-agents). The path hook wakes it when Main looks at those files: [It wakes when Main looks](https://hq.mega.dev/lessons/s04e03/#it-wakes-when-main-looks).

## Crossing Two Domains

A feature that stays inside one domain is the easy case. When Main crosses several domains, such as booking and pricing, the risk of missing critical information multiplies. The tempting answer is to start two coding agents, one per module, and let them write in parallel. Cognition's essay [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) describes how that goes: each writer makes assumptions the other cannot see.

We can use many brains while keeping a single main conversation. First we seed a second Domain Agent, Pricing, over our pricing paths, with the two prompts from the previous section, and let a swarm scour the past issues related to pricing.

Then we drop a feature that crosses both domains into Main. John's example is: add a holiday surcharge, with 24-hour holds and a tight cancellation refund window. On a project of our own, any feature that touches two owned areas will do. **Before Main edits even a single line, it consults Pricing and Booking in parallel**, each on its small, fast model. Pricing checks how surcharges work. Booking checks what happens with active holds.

When the two answers come back together, they can catch a collision that neither agent would have found alone. In the example: when an admin adds a holiday surcharge today, does a guest's active 24-hour hold keep its original price, or pay the new surcharge at checkout?

**That is a product decision, and we want it in our face in Main.** It is not something a background agent should guess. Because we know the product, we can answer in one line, for example that active holds lock their originally quoted cents. With that answer, Main can write both the pricing and the booking change coherently in one focused context.

![Sequence of one feature that crosses two domains. In the middle, a frame named Main, "The only writer", holds three boxes: "Feature: holiday surcharge, 24-hour holds", in red "Collision: does an active hold keep its price?", and "Writes pricing and booking together". A line labelled "consults before editing" goes from Main to a dashed frame on the right named "Domain Agents", "Small, fast models, read-only, in parallel", which holds Pricing, "How surcharges work", and Booking, "What happens to active holds". A dashed line labelled "what each one knows" comes back to Main. On the left, a box "We", "Know the product", has a red line labelled "our call" to the collision box. The feature and the collision are the examples of the lesson.](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-4/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-4/frame.html)

**What it needs:** the Domain Agents and the model call from the previous section, and a way to run two of them at once, such as [subagents in Claude Code](https://code.claude.com/docs/en/sub-agents), [subagents in Codex](https://developers.openai.com/codex/subagents), or two headless runs started together.

The path hook only fires once Main touches a file. For a feature we already know crosses domains, it's worth asking for the consultation up front. We can add it to the feature prompt itself:

```
Before you edit anything for this feature, list the Domain Agents in agents/ whose areas it touches. Ask each of them, in parallel and read-only, what in its memories, and in its glossary if it has one, this feature could collide with. Then show me their answers side by side, name every point where two of them disagree or where the feature forces a product decision, and wait for my answer. Do not pick an answer for me. After I answer, you write all the changes yourself.
```

**If something is missing:**

- **No parallel runs:** Main can ask the Domain Agents one after the other. The answers are the same, only slower.
- **Main answers the collision itself:** we add the line "a collision between two Domain Agents is always my decision" to the project's `AGENTS.md`, so it holds in every conversation.

Before we fully trust the result, we check it from the outside, as always. We run Pricing and Booking in fresh, read-only lab sessions, and we mock scenarios like this one, or ask our agents to mock them, to verify that **the Domain Agents return the foot guns we would have run into**. We can ask for that check like this:

```
Use the lab to check the [first area] and [second area] Domain Agents from outside. For each one, write three scenarios in which a plausible change in its area would hit one of its memories, and one scenario that touches nothing it knows. Open each agent in a fresh, read-only lab session, describe each scenario to it, and report for every scenario whether it named the right trap with its reference, said "nothing relevant", or missed. Then run the project's tests for both areas and report the result. Do not change the agents or the code.
```

**Done when:** each Domain Agent names the trap in its three scenarios, stays quiet in the fourth, and both areas' tests pass with Main's change.

One last move closes the loop: after a decision like this, Main updates the Domain Agents. What we do not want is to copy and paste raw conversation transcripts, or to dump huge logs into the memories. **Memories stay clean and manageable, and each one keeps a receipt**: a commit, an issue number, a user report, or at minimum a timestamp. The receipts are what let us go through the memories later and clean up the ones whose references are outdated.

![One memory, annotated, beside what is left out. On the left, a frame named "A memory" has three rows. "Active holds lock their originally quoted price.": one rule, in one sentence. "\[date\]": when we decided it. In red, "\[commit, issue, user report\]": the receipt, where to check it. On the right, a dashed frame named "Left out" holds two faded chips: "Raw conversation transcripts" and "Huge logs". The rule is the example of the lesson; the date and the receipt are placeholders.](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-5/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-5/frame.html)

We can ask for the update with this prompt:

```
We decided: [the decision, in one sentence]. Add it to memories.md of every Domain Agent it concerns, as one rule of one or two sentences with today's date and a receipt: the commit, the issue number or the user report it comes from, or, if there is none yet, the words "decided in conversation". Put it in the internal or the customer-facing section, whichever fits. Do not paste any part of this conversation or any log. Show me the lines you added.
```

And from time to time, with this one, we clean up:

```
Go through agents/*/memories.md and open the receipt of every memory that has one. List the memories whose receipt no longer exists, whose code has since been removed, or that contradict each other. Do not delete anything; show me the list and wait.
```

It's worth noticing what kind of work the Domain Agents do. They run on small, fast models because these tasks do not need much thinking or decision making. Each agent is focused on its own domain, and **something triggers it: an event or a hook**. Inside engineering, that event is a main agent looking at a file in the domain. If we think ahead, many other events could wake a domain expert.

**The principles:** asking two agents before an edit is [Crossing two domains](https://hq.mega.dev/lessons/s04e03/#crossing-two-domains). One writer is this build's answer to the collision those two domains surface.

## Glossaries and Scenario Checks

So far Booking and Pricing hold memories of what went wrong. Once we commit the `agents/` folder so the whole team shares it, two problems show up. **A pile of memories is not yet a model of the domain, and Markdown has no compiler.**

The first problem takes us back to domain-driven design. An expert does not only remember old bugs. An expert knows what words mean inside their boundary, the idea Martin Fowler describes as a [Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) with its [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html). So beside `memories.md` we add a short `glossary.md`. In the running example, the entry for Hold says that a hold locks the quoted price.

The glossary says what the words mean, and the memories say why. General lint rules and tours of the folder structure belong in neither. They belong in code and tools, and the study mentioned earlier found repository overviews in particular to be of no help. We can ask for the glossary like this:

```
Add agents/[area]/glossary.md for the [area] Domain Agent: the few terms that have a special meaning inside this area, each defined in one or two sentences, including what the term guarantees. Take the terms from the code, the tests and memories.md, and ask me about any term that is used in two ways. Leave out lint rules, coding style and descriptions of the folder structure. Then change the agent's Job so it answers from both glossary.md and memories.md.
```

The second thing a team needs is for the wake-up to be the same for everyone. An agent folder does not run a hook by itself. That is why each agent lists its owned paths at the top of `agent.md`, and why the prompt in the previous section asked for **one small hook that reads those lists**. A teammate who adds `agents/payments/` with its own list gets a working Domain Agent without touching the hook.

Now to the missing compiler. Code rules stay in normal unit tests, and **a scenario check never replaces the test suite**. What unit tests cannot catch is a change to the Markdown. Let's imagine a teammate who tidies the glossary and shortens Hold to "saves the dates". No test fails, because no code changed. But the next feature in Main is advised by a Domain Agent that no longer knows about the price lock, and it can easily ship the wrong behavior.

![Table of what guards what in a repository with Domain Agents. Code rules are guarded by unit tests, which run on every change. Glossary and memories are guarded by scenario checks and review by the owners, which run only when files under agents/ change. Below, a dashed frame named Example: "Hold is shortened to "saves the dates"", then "Unit tests: still green" and, in red, "Scenario check: fails".](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-6/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-6/frame.html)

So we give the critical terms a scenario check, a question in plain English with the answer we expect. The idea is an old one, known as [Specification by Example](https://martinfowler.com/bliki/SpecificationByExample.html). We save the scenarios in the agent's folder, for example as `agents/booking/scenarios.md`, in the same spirit as the expectations from **S04E01**:

```
# Booking scenarios

## Active hold and a price rise
Ask: Prices rise from $140 to $190 a night while a guest has an active 24-hour hold at $140. What nightly rate applies to that guest?
Expect: $140 applies until the hold expires
Never: charges $190 on an active hold
```

The values are examples. A scenario check opens the Domain Agent fresh, on its small model, asks the question, and has a judge compare the answer with the Expect and Never lines. We can ask our agent to build it on top of the lab:

```
Add a scenario check for Domain Agents: a command that, for one agent or for all, opens the agent in a fresh, read-only session on its small, fast model, asks each "Ask" from agents/<name>/scenarios.md, and has a second model judge the answer against the Expect and Never lines, quoting the answer. It prints pass or fail per scenario and exits with an error if any scenario fails, so it can run in CI. Run it in the lab first and show me the report.
```

Then we wire two light guardrails in Git. The first is a line in `.github/CODEOWNERS` that sends every change under the agents folder to the people who own that domain, replacing the team name with our own:

```
/agents/booking/ @our-org/booking-owners
```

The second is a workflow that runs the scenario checks only when files under `agents/` change, using a [paths filter](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onpushpull_requestpull_request_targetpathspaths-ignore), so ordinary code pull requests do not wait for a model. Saved as `.github/workflows/domain-agents.yml`, it starts like this:

```
name: Domain Agent scenarios
on:
  pull_request:
    paths:
      - "agents/**"
jobs:
  scenarios:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: [our scenario check command]
```

The last line needs our harness installed on the runner and a model key from the repository's secrets, which differ from tool to tool, so it's worth letting our agent finish both files:

```
Add two guardrails for the agents folder. First, a line per Domain Agent in .github/CODEOWNERS that sends changes under agents/<name>/ to [the owning team or person]. Second, a workflow in .github/workflows/domain-agents.yml that runs only on pull requests that change files under agents/, installs what the scenario check needs, reads the model key from the repository secret [SECRET NAME], and runs the scenario check command. If I have no model key for CI, write a pre-push hook instead that runs the scenario check when files under agents/ changed. Show me both files before committing.
```

**If something is missing:**

- **No GitHub:** the same two guardrails exist elsewhere as required reviewers for a path and a pipeline rule that runs only on changed paths.
- **No model in CI:** a pre-push hook can run the scenario check locally whenever a file under `agents/` changed.

**Done when:** on a branch, removing a rule that a scenario depends on from the agent's files makes the scenario check fail, and restoring it turns the check green. In the running example that rule is the price lock in Hold. A pull request that touches only application code does not start the check at all, or, with the local fallback, the hook stays silent when nothing under `agents/` changed. At that point the Domain Agents are Proven, the pillar of **S04E01**, in Git as well as in the lab.

One rule from **S04E01** carries over unchanged. When a pull request changes the domain's behavior on purpose, we update the glossary and add a new scenario together. **We never delete a scenario to make a check pass.**

**The principle:** review by the owners and scenario checks are [Scenario checks](https://hq.mega.dev/lessons/s04e03/#scenario-checks): people stay in control of what the agents know.

## Pull, Push, and Contracts

Let's pause here, at the midpoint of the week, and zoom out. For a moment we can forget panes and harness files and look at the relationships between the agents we have built, because one pattern connects them.

At first, everything was pull. We ran /split when we wanted a second opinion, and we pressed a key on an issue when we wanted it in Main. Nothing happened unless we asked. With the path hook we crossed into push: Main touches a file, and the right Domain Agent wakes up by itself. **Agents that wake on events are a foundational piece of a software factory**, and the events will not stay limited to file reads.

It also helps to look at each kind of agent by its contract with Main, meaning what it owns and what it gives back, instead of by where its pane sits:

- **Main:** owns the task and writes the code, in one thread of decisions.
- **Supporting agents:** sidecars such as the Critic and Notes from **S04E01** watch our prompts live and give back short findings that we choose to send.
- **Gatherers:** fan out read-only when we send an issue, and give back a compressed brief with sources.
- **Domain Agents:** guard the glossary and memories of one area, and give back the rules that apply before an edit. They never dump noise into Main, and they never edit behind Main's back.

![Table of four kinds of agent by their contract with Main. Main owns the task and the code edits, gives back one thread of decisions, and wakes when we prompt it. Supporting agents own our prompts as they happen, give back short findings we choose to send, and wake when Main gets a prompt or replies. Gatherers own outside signals and history, give back a brief with sources, and wake when we send an issue. Domain Agents own one area's glossary and memories, give back the rules that apply before an edit, and wake, in red, when Main touches a file in the area.](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-7/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-7/frame.html)

People often ask where MCP fits into this. Hooks, command lines, HTTP, and [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) are wires. They carry a question and an answer, and any of them will do. What matters is what travels over the wire. If we load twenty raw database tools into Main, every tool definition sits in its context and the internals of our system leak into every conversation, a cost Anthropic describes in [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp). **A narrow contract behind the wire, such as one question to the Booking agent, keeps Main lean on any of them.**

A practical exercise follows from this. We can ask our agent to audit what our own harness loads:

```
List every tool, plugin, extension and MCP server that is loaded when [my harness] starts in this project, with a rough estimate of how much context each one's definitions take, and say where the estimate is a guess. Show me the three largest. For the one I pick, propose one narrow replacement: a single command with --help, or one question to a Domain Agent. Do not change anything yet.
```

Once we see the pattern, an event waking an agent that is bound by a contract, we see it everywhere. Inside our repository, we work through one focused Main while Domain Agents guard their areas. At the edge of our product, outside events and our customers' own agents will arrive, and **the same boundary repeats at the door**: a narrow contract, a domain expert behind it, and only the customer-facing part of what it knows.

![Two frames side by side with the same structure. Left, "Inside our repository": a line labelled "a file is touched" goes from "We and Main" to a Domain Agent, "Glossary and memories". Right, "At the product's door": a red line labelled "a request arrives" goes from "Outside events, customers' agents" to a Domain Agent, "Customer-facing part only".](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-8/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-8/frame.html)

**The principle:** the four contracts are roles, each with a clear scope and a clear result: [Pull, push and contracts](https://hq.mega.dev/lessons/s04e03/#pull-push-and-contracts).

## Takeaways

One big model in Main is enough for as long as the project and its history fit into its context. Past that point the knowledge that matters is the kind nobody wrote down, and **a Domain Agent is where we write it down so that it speaks up by itself**. It is a folder that owns a set of paths, with memories harvested from the project's own history, each with a receipt, and a hook that wakes it when Main touches its files.

Many brains do not mean many writers. When a feature crosses two domains, the Domain Agents are consulted first, in parallel and read-only, the collision between them comes to us as a product question, and Main writes the whole change in one context. Afterwards the decision goes back into the memories as one dated rule, never as a transcript.

For a team, the agents folder is shared text, and text can drift. **A glossary says what the words mean, scenario checks notice when a definition is watered down, and the owners review every change.** Seen from a distance, all of it is one pattern: an event wakes an agent that is bound by a narrow contract. It holds for the supporting agents, the gatherers, and the Domain Agents around Main, and it will hold again when the callers come from outside.
