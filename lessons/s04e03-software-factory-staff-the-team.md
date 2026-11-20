---
title: "s04e03 — Software factory: Staff the Team (lesson text)"
type: source
source: MEGA MCP mega-start, 2026-11-18; https://hq.mega.dev/lessons/s04e03/
updated: 2026-11-18
trust: high
status: active
tags: [lesson-text, domain-agents, glossaries, memories, scenario-checks, contracts, hooks]
links: [../context/course.md, s04e02-building-portable-agent-control-planes.md, s04e02-build-guide.md]
---

Raw copy of the lesson text as the MEGA MCP returned it on 2026-11-18. Not edited.
This is part 1, John's video. Part 2 is the Build guide at
https://hq.mega.dev/lessons/s04e03/build-guide/ (needs a login).

# Software factory Staff the Team

Domain Agents · Glossaries

> **This lesson is extended.** It has two parts. This part is John's video. The [Build guide](https://hq.mega.dev/lessons/s04e03/build-guide/) is the written version of what he builds, step by step, with the prompts and the checks.

## Domain Agents

### Where widgets and swarms stop

So we've now got widgets watching our project, swarms gathering context into Main. And if you're working by yourself on a solo project, this might be all you need. Because if your entire project and all of its history can fit into context of one model, then doing too much more right now is pretty much over-architecting. But when your project goes past that point, when does a big model start dropping the ball? As usual, it comes down to a question of context. When your codebase is so large and it has a long history, and you have multiple people working on it, sending in multiple changes all the time, every module in your project hides old edge cases. And there's one engineer who remembers why booking works that one way, and then they leave. And a fresh new Main conversation will walk naively and confidently into a room full of traps.

### Domain agents

A popular solution goes back to the concept of domain-driven design and domain agents. So, unlike a throwaway agent that you spin up in your Main conversation, a domain agent owns a part of the codebase, like a CODEOWNERS file on GitHub, and it can carry those living memories of that domain along with it. The domain agents often map to concepts established in a glossary or other files. And these will be created on a project-to-project basis. Your Main session will still write the code. It'll just allow your domain agents to advise and review and grow and evolve to eventually even help your customers. So let's see what that looks like on our RentAPlace project. We're going to create a domain agent for booking and a domain agent for pricing, and discuss some memory strategies so that they truly become experts in their field.

### Seed a domain agent

You have probably been using agents long enough to know that maintaining an AGENTS.md file can be quite the challenge. For a long time everyone thought you should put all of your memories and rules in there. But over time we learned that it goes stale. And your agents often ignore the most important parts anyway. So let's see what we can do to take some of that forgotten history we want to surface and turn it into an active expert agent. For example, let's look at this ticket in Main. We have a closed home that is still bookable. Now, the obvious fix is this one-line check right at the top of a booking function. But if we ship that one-liner, you silently break retries and guest refunds. So let's see what a booking domain agent can do. In Main, we ask for a new folder, agents/booking, and in this folder we're gonna manage the paths for our booking files and its tests, just like a GitHub CODEOWNERS file. Now this booking domain agent will run on a small, fast model, read-only, and will act as your booking brain.

### Harvest your history

Now we don't want to just start writing memories in there from scratch. We can actually have a quick swarm of agents or your main agent harvest Git blame, closed issues, pull request, and even past conversations for traps related to anything having to do with booking. Critically, you want every memory you put in there from this seed round to cite the commit or the issue where your team learned the lesson the hard way. So we'll create a memories.md file and we'll keep two clean sections, one for internal engineering and one for customer-facing. So we can store memories related to engineering notes, so that we know where all the traps are. We can store memories related to customer-facing rules and policies that have caused issues in the past. And this will actually help us if or when we eventually evolve this agent into something that can be more customer-facing.

### It wakes when Main looks

We're going to make this intuitive by having it fade into the background. Now almost all harnesses have a way to detect when a file is being touched by an agent. This is like a read hook or an edit hook. And we're going to make it so that whenever our main conversation starts looking at files that are defined as globs inside of our booking agent configuration, it can trigger our booking agent to automatically hand a smart summary of potential issues the main conversation might run into, because it can combine context from the main conversation with the context of all of its memories that it knows about. So if we watch what happens in this run when Main touches anything in the booking module, the booking domain agent flags that trap around retry right away. And it can warn the main agent about checking replays and rejecting closed homes. So your main agent can stay on the task and be the agent that writes to files, and still run subagents. But whenever it enters a specific domain, critical memories will trickle into context and save you from those landmines.

### Run it in the lab

So we can run this in our lab where we have a frozen booking suite, and every retry, refund, and closed-home case passes. And we hand that booking domain agent this naive top-of-function patch from the outside. And it should report back that the outside lab agent should be careful because of those past memories. So if you look at what lives in your repo now, you'll see a booking domain agent seeded from real history, which wakes up automatically whenever another agent starts looking into its domain, anything inside of the booking module. And then it hands over that precious context just in time, just when Main is looking at it, and helps your main agents from repeating those old mistakes.

### Crossing two domains

Now, if your main agent crosses multiple domains, such as booking and pricing, that multiplies the risk of missing critical information. So we can keep many brains while still maintaining our single main conversation. We can seed the second domain agent, Pricing, and run it over our pricing paths, and have a swarm scour past issues related to pricing. And now when we drop a feature that crosses the domains into Main, like "add a holiday surcharge with 24-hour holds and a tight cancellation refund window," before Main edits even a single line, it will have to consult with Pricing and Booking in parallel, where they both spin up on their small, fast models. And Pricing will check how surcharges work, and Booking checks what happens with active holds. And right away they catch a collision that neither domain agent could see by itself. In a specific example: when an admin adds a holiday surcharge, it might trigger an active 24-hour hold and keep the original price, or you might trigger paying a new surcharge at checkout.

![Sequence of one feature that crosses two domains. In the middle, a frame named Main, "The only writer", holds three boxes: "Feature: holiday surcharge, 24-hour holds", in red "Collision: does an active hold keep its price?", and "Writes pricing and booking together". A line labelled "consults before editing" goes from Main to a dashed frame on the right named "Domain Agents", "Small, fast models, read-only, in parallel", which holds Pricing, "How surcharges work", and Booking, "What happens to active holds". A dashed line labelled "what each one knows" comes back to Main. On the left, a box "We", "Know the product", has a red line labelled "our call" to the collision box. The feature and the collision are the examples of the lesson.](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-4/frame.png)

[Open figure](https://hq.mega.dev/figures/s04e03/artifacts/build-guide/figure-4/frame.html)

### A product decision, not a guess

And that's an actual product decision that you want in your face with a main agent. It's not a guess that you want for a background agent to handle. So after that surfaced to you, because of your product knowledge, you can tell them that active holds should lock their original quoted cents. And now Main can write both pricing and booking coherently in one focused context. Now again, before you fully trust this, you could check it from the outside. You can run Pricing and Booking in fresh, read-only lab sessions by mocking scenarios like this, or asking your agents to mock scenarios like this, and verify that the domain agents return the footguns that you would have run into.

### Clean memories, small fast models

And in general, you just have your main agent update the domain agents. You don't want to copy and paste raw conversation transcripts or dump huge logs into memories. You want these to stay clean and manageable, and ensure that they always have a reference like a commit, or an issue number, or a user report, or at minimum a timestamp, so that it has actual receipts from your project. So that if those receipts are ever outdated for some reason, you can easily go through and clean them up. So again, we're using small, fast models for these tasks that don't require a lot of thinking. They don't require a lot of decision making, because they're focused on their specific domain. And then something like an event or a hook or something triggers them. And when you're working with internal engineering, that's an event like a main agent looking at a file inside of that domain. And if you're thinking ahead, I'm sure you can think of many other scenarios where specific triggers would want to talk to domain experts.

## Glossaries

So now Booking and Pricing each have a folder full of memories. And the moment you commit those folders so your whole team shares them, two problems show up. A pile of memories isn't a domain model, and Markdown has no compiler. Let's take the first one. An expert doesn't just remember old bugs, they know what the words mean inside their domain. So ask your agent to add a short glossary right beside the memories. The memories hold the why, and the glossary holds what a word means here. Like the word hold: it keeps the nights, and it locks the price the guest was quoted. And keep it short, so it doesn't go stale the way a big AGENTS.md does. Now the second problem. Your unit tests still guard your code, and an agent check should never replace them. But no test fails when a teammate tidies up that definition, and a hold quietly turns into something that just saves the dates. Nothing breaks right away, until the next feature gets built on the wrong meaning.

### Scenario checks

So for the words that really matter, ask for a scenario check. It's the same idea as the expectations you gave the lab: a plain question, and what you expect back. And ask about the word itself: what does a hold keep for the guest? Run it against your domain agent, on its small, fast model, more than once. Then ask your agent to guard those folders the way your team already guards code. Changes to a domain agent get reviewed by the people who own that domain, and the scenario checks run whenever those files change, so every other pull request stays fast. So when someone waters down a definition, a check can catch it before it merges. And when your team learns something new, the lesson goes in along with a scenario that proves it. That's a domain agent your whole team can share, and trust.

### Pull, push and contracts

Let's zoom out for a minute. Forget the panes and the files. Look at how the agents you've built relate to Main, because one pattern connects all of them. At first, getting help was pull. You ran a split, or you picked an issue, when you wanted context. Your critic and your widgets were already watching on their own. And with domain agents, expertise starts to shift to push too: Main looks at a file, and the right expert wakes up without being asked. You're still at the keyboard. But agents that wake on a trigger are what a software factory runs on. And look at how clear each job is. Main owns the task and writes the code. Supporting agents, like your critic, watch and speak up. Widgets watch the project and send work in. A swarm fans out and brings back only what matters. And a domain agent guards one part of the codebase. That's a contract: what goes in, what comes back, and what it never touches. None of them edit behind Main's back.

### Hooks, CLIs, HTTP, MCP: just wires

And if you're wondering where MCP fits in all this: hooks, CLIs, HTTP, MCP, those are all just wires. Plug a big pile of raw tools straight into Main, and you can fill its context before the work even starts. Put an agent with a clear contract behind the wire, the noise stays in its context, and Main stays lean, whichever wire you use. So here's how to think about it. Right now, all of this happens while you're at the keyboard. But the pattern, a trigger wakes an agent with one clear contract, doesn't need you there. And when other people's agents show up at your product, that same pattern mirrors at the door.
