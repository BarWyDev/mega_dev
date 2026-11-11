---
title: "s03e03 — AI-Native Product Development (lesson text)"
type: source
source: MEGA MCP mega-start, 2026-11-11; https://hq.mega.dev/lessons/s03e03/
updated: 2026-11-11
trust: high
status: active
tags: [lesson-text, ai-native, feature-map, schedules, feedback, observability]
links: [../context/course.md]
---

Raw copy of the lesson text as the MEGA MCP returned it on 2026-11-11. Not edited.
Topics: Exploration, Planning, Execution, Feedback, Engineering, Delivery.
Figures are linked on hq.mega.dev and need a login there.

# AI-Native Product Development

Agents can handle both "greenfield" and "brownfield" projects almost natively. Without any special setup, they can answer questions and make changes with some degree of accuracy. But in both cases, moving fast with agents while also ensuring quality and alignment with business needs takes additional work. We've already seen many of the reasons for this, so now we'll look in detail at how our system can **heal itself**, **recover from issues** and **get better over time**.

The lessons so far have shown how agents' capabilities can expand through tools and knowledge, giving them a higher degree of autonomy. This lets them take care of things we normally have to keep in mind and are constantly asked for. The problem with this is that over time, the system gets overloaded - some tools won't be needed anymore and old documents turn into noise and that's an issue as **"no document is better than the wrong one"**.

Another reason we may want **meta-workflows** for maintaining a system is that agents will often face the same problems during their work. When this happens to us, we remember it for next time. Agents need something similar so they can build and adjust their skills or create tools.

Having all this makes the product AI native. In practice however we may want to start small, as building everything takes time but also is simply not defined.

## Outline

- Exploration: synthetic user flows, interactive maps, historical changes, architecture visualizations
- Planning: scope expansion and contraction, risk mapping, graphs, high-level implementation strategies
- Execution: direct work, handoffs, parallel agents, merge points, delegated work
- Feedback: system logs, visual feedback, human feedback, artifacts

## Exploration

Agents start their work by exploring, because they need to gather the context to understand the task and make changes. Then they repeat this process every time, as if doing it for the first time. Sometimes they even fail, which hurts their work, and yet they **don't leave any trail or take any notes about it** unless we build a workflow for that.

Scenarios like that happen all the time, and they're not limited to the codebase. They also involve navigating external systems: remote repositories, issue trackers, communication channels, and infrastructure. The most straightforward solution is **a map**, which we mentioned in **S02E01**. The problem is, in systems that evolve fast, such a document quickly becomes outdated and adds more confusion than guidance. And that exact issue our workflow needs to address.

The problem is that we don't know the exact state of the map, or which variables we'll need to consider to improve it. But we already know that in such cases we should look for **principles**, **scope**, and the **schedule or trigger**. Everything else should be left for an agent to figure out. The agent should also have access to the history of its actions, so it won't repeat the same mistakes and the system will actually "learn".

And to be clear, we're not talking about a codebase map or anything an agent can easily find. We're talking about context that isn't obvious from the code alone. It's more like **a set of documents** explaining the features, how to interact with them, verify them, what's their role and what's worth keeping in mind about them.

[Figure 1: a Feature Map frame holds small documents (checkout.md, search.md, notifications.md); an open document has four sections: Role, How to get there, How to verify, Keep in mind. A strip contrasts "Found by reading the code" (routes, components, folder layout) with "Written in the Feature Map" (how to get there, how to verify, what to keep in mind).](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-1/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-1/frame.html)

Lauren Tan described the **Features Map** concept in relation to her verification skills ([generate](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md), [maintain](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md)). She uses them with Cursor Cloud Agents that run on a daily schedule. The two skills generate small files that describe the areas of her apps she wants her agents to understand. That's exactly what we need in production systems, where changing the behavior of one feature may have a non-obvious impact on another.

So our role here focuses mainly on crafting and iterating skills, but also on **initializing maps**, because a map's initial shape directly affects its reliability and usefulness, and it shapes the improvements agents make to it later.

As a result, feature maps improve how agents go through the exploration phase, and not only that. Having this context also makes them better at implementing features and verifying them afterward. The example below shows how it may work in practice: **in a music player app, solving a bug with playlists may affect queues**. That's easy to miss, but thanks to the feature map, the agent takes care of it.

[Figure 2: an agent uses a Feature Map to fix a music-player bug ("after editing a playlist, shuffle plays the same track twice"). playlist.md says "Editing a playlist rebuilds the queue." A "rebuilds" arrow joins it to queue.md, where the agent writes a new line "Shuffle order is cached". player.md and offline.md stay unopened.](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-2/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-2/frame.html)

Schedules or triggers that maintain the maps must look for more than things **to add**. They must also look for things **to modify and remove (archive)**. In fact, most background agents that handle maintenance should focus on cleaning up what's no longer needed. It's also worth considering an easy way for them to communicate with us not only when needed, but **always**, using visual artifacts that let us quickly scan the changes and spot issues.

## Planning

Having a features map along with the principles discussed in **S03E02** makes conversations about changes and bug fixes much easier for us. We no longer need to describe every detail or **keep it all in our heads**. Even if we mention a feature only briefly, the agent connects it with everything that's needed and helps us reason about what to do. In fact, a conversation with an agent that has this knowledge is like a discussion with a teammate who has spent years on the project and knows the answers to nearly all questions.

[Figure 3: a conversation ("Let's add crossfade between tracks. Should work with my downloads too.") with underlined phrases linked to player.md, queue.md and offline.md in the Feature Map; the agent replies that crossfade touches player, queue and offline and says to start with queue.](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-3/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-3/frame.html)

Discussing features is also a perfect moment for subagents or workers, as in our interest is to keep the main thread focused on the most important aspects, but also keep it interactive. In the background agents may focus on the research or updating graphs, visualizations or lab we discussed in **S03E02**.

But now we can push this **much further**, because agents can translate our intent into high-quality while maintaining quality and, to some extent, a "common sense" that comes from "understanding" the system and the relationships between its components. And the best part is that the longer we work on the system, the better this process becomes, because the available context keeps improving.

In fact, this process can be easily delegated to background agents that can iterate on the shape of features, seeking for edge cases and the best way to addressing them. It does not mean, we're entirely excluded from the process as the final decision is on us **but, this approach let us amplify our own knowledge, skills and judgement** as proposed plan would be hard for us to develop even in direct interaction with AI.

[Figure 4: three columns (Main thread, Background agents, Plan). Message 2 spawns Explore, Research and Visualize agents; findings (one red chip: "offline track: no preload") go into Shared notes that iterate the plan v1, v2, v3. v3 is a short note saying what the feature does, not how to build it, with a dependency graph attached. Message 5, "Approve. Max fade 8 s.", is the human decision.](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-4/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-4/frame.html)

As we discussed, the plan shouldn't describe **how things should be done**. Instead, it should focus on what needs to be done and how the result will be proven. The document itself should be fairly short, although it can refer to external files. In general, it's in our interest to keep the feedback loops as quick as possible, at least until the system is ready to handle longer tasks without supervision.

Now, if we look at this through the lens of every lesson we've gone through, it should be clear how we can **combine our knowledge with custom tools and setups** to shape a system tailored to our product. And it's up to us to decide which parts we'd like to be involved in. That largely depends on the feature we're working on, but also on **the level of trust** we have in the system.

## Execution

AI-native product development reduces, and sometimes eliminates, many of the processes we know not only from the pre-AI era but also from the early days of AI, when we worked with agents directly. Activities such as **[writing code, reading it](https://x.com/unclebobmartin/status/2080257779395154409?s=20)**, and even **reviewing it** are getting automated to the point where humans aren't involved at all. And if that doesn't sound crazy enough, agents are starting to manage other agents and make more and more decisions on their own. It feels like there isn't much left.

In practice, however, there are many things we need to take care of.

**Research:**
Before AI, product development mostly depended on our current skills and what we were willing to learn in a reasonable amount of time. For example, if we were fluent in the JavaScript ecosystem, we rarely decided to build something in Rust. The same went for libraries (such as Three.js) or areas (such as Functional Programming) that were simply too demanding to grasp. But now these barriers are either gone or much easier to overcome.

This way research and exploration became part of our job. And the fact AI can use almost any tool flawlessly, does not mean there is no need for us to understand how does it work. In fact, it's opposite, but instead of learning everything, we need to dig down to the level that is enough and **we need to learn how to recognize this** and build tools and workflows that will help us with it.

[Figure 5: concentric rings around a person (our competence): reach without AI, the edge of what we can verify, and the zone explored with AI (Product docs, Codebase map, Market, Constraints, Prior decisions, Conventions). Two of five agent paths cross the verify edge. Four checks: Can I explain it in my own words? Can I name how to check it? Do separate explorations agree? Would I sign off on it? Principle: go as far as we can still verify, not as far as the agent can reach.](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-5/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-5/frame.html)

**Structure:**
As engineers, part of our job was to manage things like architecture, documentation, external services and infrastructure. AI-native development keeps most of these in place, but agents are the ones doing the actual work. Our job now is to keep it all organized in terms of **processes**, **schedules** and **efficiency**, along with the mechanics behind the system's observability, stability and improvement. And as we saw, this requires working on a sort of "meta-level," because it's not about **telling agents what to do, but making sure they know what to do** and **ensuring they can do it**. There's a great read from Lauren about this in section "*the art of supervising someone smarter than you*" in [The Complete Guide to pstack](https://x.com/poteto/status/2097732320606507506).

[Figure 6: left, one person with four lines to four agents, "Every question comes back to us". Right, "Organizing the system": the person organizes processes, schedules and efficiency and keeps the system healthy with observability, stability and improvement; a box "What agents rely on" (Know what to do / Can do it) feeds a lead agent and a chain of agents; "Evidence" goes back to Observability and "New tools and skills" back to the box.](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-6/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-6/frame.html)

Doing this requires us to apply everything we've learned so far, but also to shift the way we think about and look at our work. That's because before AI, our default solution to a problem was fixing it ourselves. With AI, it's often telling an agent to fix it. But what we're trying to figure out is **how to make an agent aware of the issue and able to respond to it properly.**

**Ecosystem:**
Let's say we're familiar with [Axiom](https://axiom.co/) but know very little about [Datadog](https://www.datadoghq.com/) and [Better Stack](https://betterstack.com/). If our product needed observability, Axiom would be the obvious choice for us, even if its alternatives offered better features. Before AI, understanding and adapting to an entirely new platform took effort we rarely chose to make.

With agents on our side, we can have a report within an hour that compares our options and clearly explains their features in a way tailored to us, including a map of the architecture and the effort needed to get it done. This can be applied to literally every single service.

For example, below is the stack we use at mega.dev and MEGA HQ. We chose its components not because of our personal preferences or experience, but because of business opportunities and organizational factors. I'm not saying the stack is perfect, but even if any of its components needed to change, AI would make that effortless, especially thanks to good architectural decisions that keep integrations simple.

[Figure 7: the MEGA ecosystem. Lesson content (GitHub, Astro build) feeds MEGA HQ at deploy only. MEGA HQ (hq.mega.dev on Cloudflare: lessons locked by time, challenges, MCP server) shares Student data with mega.dev (Vercel and Next.js: website, accounts, assessment, cards). Services: Airtable and Resend under HQ; OpenRouter, Cloudinary, Stripe, Postmark and Sentry under mega.dev. Principle: pick the best service for each job.](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-7/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-7/frame.html)

Even though we can generate personalized software today, there's often no point spending time on things we can get out of the box. And since we have agents that can build deeply personalized integrations that make full use of what external services offer, we should definitely use that to our advantage.

**Schedules:**
AI-native product development brings challenges because many agents may work simultaneously. This quickly reveals that the tools we use **weren't built for that**, as agents spawn processes and run tests, compilers, or entire sandboxes and virtual machines. Suddenly, even 128 GB of RAM in a maxed-out MacBook is not enough.

The moment we start noticing that we're running out of resources (CPU, GPU, RAM, or storage), the first thing we can do is **ask agents for an audit** that identifies bottlenecks. Depending on the stack, the audit may find one-off solutions we can implement right away, or issues that need to be handled on a schedule, such as pruning or checking for stale processes and leftovers. In some cases it is worth considering adding queues or throttling for the most demanding processes, such as compilation.

[Figure 8: three charts. RAM over a workday (stale-process stop every hour keeps the base flat; without it compilation spikes hit the limit from about 15:00), disk over a week (nightly prune makes a sawtooth instead of a staircase to "Full disk" on Friday), six compilations in one hour (queue, 2 at a time). Principle: schedule the cleanup and queue the peaks before we buy more hardware. Curves are examples, not measured data.](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-8/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-8/frame.html)

When optimization won't be enough, instead of buying additional hardware, we may consider **cloud agents** ([codex](https://learn.chatgpt.com/docs/cloud), [claude](https://code.claude.com/docs/en/claude-code-on-the-web), etc.). They don't offer as much flexibility as VPS or physical machine, but scale very well.

Besides optimization, schedules are useful for system monitoring focused on anomalies, user behavior and security issues. These days, such schedules are a **critical part of the system**, as we may expect **constant attacks** that come not from dumb bots we can reliably fight off, but from **dynamic agents** that will look for a way into our system. It's worth considering skills such as **[security-audit](https://github.com/cloudflare/security-audit-skill)** and a proper [Sentry](https://sentry.io/) setup that reports issues directly to agents.

And lastly, we have schedules for managing workflows that handle the actual work on the product: solving issues, fixing bugs, reviewing features, refactoring, etc. These are often set up in the cloud, so they don't depend on anyone's machine.

So overall, schedules are becoming an important area to cover in AI-native development. Getting them right can easily make a real difference and even become a competitive advantage.

## Feedback

Agents need as much access to real-time environment data as possible. This data helps them understand the system, including both its current and historical state. To make that possible, the system itself has to be organized with this in mind. We might consider things like easy access to development and production logs, activity events, an easy way to interact with the app, the ability to take screenshots and record videos, and more.

Such an interactive, data-rich environment rarely exists in software. This means we first need to **decide what information is needed** and then **rebuild or extend the system** to actually deliver it. Not for us, but for agents.

Below is an example architecture of a system that includes a whole set of structures, tools and services **dedicated to agents**. They let agents **interact with the app** in the development environment and also give them easy access to almost anything about the production system. This diagram clearly shows we're not talking about a simple logger. And building this requires making it an actual priority.

[Figure 9: where an agent gets feedback. In the sandbox (development) the agent drives the app (click, type, sign in), observes it (screenshots, logs, recordings) and attaches proof (before and after, checks passed). The app ships to production (read-only), where the agent only reads signals: logs and errors, session replays, user feedback.](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-9/frame.png)

[Open figure](https://hq.mega.dev/figures/s03e03/artifacts/lesson/figure-9/frame.html)

Building structures for agents to get valuable feedback is crucial and makes the foundation of the entire system as they play big role in **building trust** and letting agents reliably verify their work. Regardless if we have existing system or build something from scratch, it is hard to tell upfront what exactly do we need, so as always **it's a good idea to start small** and then put **useful schedules** to let agents maintain the tools and improve based on the insights from available logs.

## Takeaways

Going beyond working directly with agents and building a truly AI-native development lifecycle takes a lot of effort. And even though agents handle the actual work on the software and the system itself, our responsibilities still involve a lot of activities, decisions and understanding. And importantly, working this way requires **a new way of thinking** about building software, because we're not simply "moving to the next level of abstraction". We also need to expand our perspective and look way beyond code, into other areas of the entire product.

The last thing to consider after this lesson is that when we look back at what we've discussed today, we may realize that **AI-native products may move much faster while maintaining quality, and products developed through direct work with agents have no chance of keeping up.** And this may lead us to the conclusion that, in some scenarios, it's wiser to build an entire platform from scratch just to gain this advantage.
