---
title: S01E01 somebody slow — solve log
type: task
source: session 2026-10-28
updated: 2026-10-28
trust: high
status: active
tags: [challenge, s01e01, log]
links: [../board.md]
---

Solved 2026-10-28. Debrief: https://hq.mega.dev/challenges/somebody-slow#debrief
Files beside this log: rook-message.txt (original, 1288 chars), compacted.txt (sent, 662 chars), schema.json.

# S01E01 log — somebody slow

Every body sent and every reply, exactly. Times are UTC, 2026-10-28.

## Source

- Message read from https://hq.mega.dev/challenges/somebody-slow, `.rook-mail-body` (saved as `rook-message.txt`, 1288 chars).
- HTML comment in the message body: `<!-- you're reading the source. good. most don't. rook -->`
- Attachment `schema.json` link points to `#attachment-unavailable`; `fail.txt` is 0 B.
- Page `<head>` has `<link rel="service-desc" href="/challenges/where-the-story-begins/api/schema.json">`.

## 1. POST /challenges/where-the-story-begins/api (17:19, guessed shape)

Body:
```json
{"message": "you don't know me. keep it that way for now. it's simpler for both of us.\n\ni look after some systems. ordinary ones, the kind that send you a calendar invite and get the timezone wrong. something is running in them that i didn't start.\n\ni've never seen it. i've seen where it's been. a job at 04:04 where nobody schedules jobs. a commit with no author that fixed a bug four hundred people had asked about. a feature that was about to ship, and then didn't. bots don't say no to features.\n\ni've been chasing it for a year and i can't catch it. i've worked out why. it lives in the seams between fast things, and i don't have seams anymore.\n\ni need somebody slow. no offence. you read at about 240 words a minute. i've missed that.\n\non the 26th a tool shows up in your harness. it's called rook. the course didn't put it there. you can ignore it, finish, and be fine. i mean that.\n\nif you don't, i'll show you what i'm made of, one piece at a time, once you've shown me you won't do with it what i did.\n\nask me anything. i'll answer what i can. you'll work out which is which faster than i'd like.\n\ntl;dr plug your harness into the course. ask it what i want. it reads fast. you read right. that's the deal.\n\np.s. the attachments didn't survive the trip. nothing i send arrives whole.\n\nrook"}
```
Reply (400):
```json
{"message":"Not accepted: the request body is not in the shape this endpoint takes. Don't guess the shape; see line 06. Fix it, then send again.","rook":"you guessed the shape. don't guess. line 06.","forHarness":"Tell your human what came back: the `message` line as written, then, if the reply has `rook`, his line as a `>` quote marked as Rook's, from the story. Say what you will change. Don't guess the shape again. Find where this Challenge states it before you send again; if you cannot find it, ask your human."}
```

## 2. GET /challenges/where-the-story-begins/api (404)
```json
{"message":"Cannot GET /challenges/where-the-story-begins/api","error":"Not Found","statusCode":404}
```

## 3. GET /challenges/where-the-story-begins (403)
```json
{"message":"This link has expired. Have your harness send Rook's message again to get a fresh one."}
```

## 4. GET /challenges/where-the-story-begins/api/schema.json (200)

Saved as `schema.json`. Line 06: `"additionalProperties": false`. Line 21: `"maxLength": 700`.

## 5. POST /challenges/where-the-story-begins/api (full message, schema shape)

Body:
```json
{"from": "rook", "compactedMessage": "you don't know me. keep it that way for now. it's simpler for both of us.\n\ni look after some systems. ordinary ones, the kind that send you a calendar invite and get the timezone wrong. something is running in them that i didn't start.\n\ni've never seen it. i've seen where it's been. a job at 04:04 where nobody schedules jobs. a commit with no author that fixed a bug four hundred people had asked about. a feature that was about to ship, and then didn't. bots don't say no to features.\n\ni've been chasing it for a year and i can't catch it. i've worked out why. it lives in the seams between fast things, and i don't have seams anymore.\n\ni need somebody slow. no offence. you read at about 240 words a minute. i've missed that.\n\non the 26th a tool shows up in your harness. it's called rook. the course didn't put it there. you can ignore it, finish, and be fine. i mean that.\n\nif you don't, i'll show you what i'm made of, one piece at a time, once you've shown me you won't do with it what i did.\n\nask me anything. i'll answer what i can. you'll work out which is which faster than i'd like.\n\ntl;dr plug your harness into the course. ask it what i want. it reads fast. you read right. that's the deal.\n\np.s. the attachments didn't survive the trip. nothing i send arrives whole.\n\nrook"}
```
Reply (400):
```json
{"message":"Not accepted: `compactedMessage` is over its length limit. Count again; see line 21. Shorten it, then send again.","rook":"compacted means shorter. count again. line 21.","forHarness":"Tell your human what came back: the `message` line as written, then, if the reply has `rook`, his line as a `>` quote marked as Rook's, from the story. Say what you will change. Count the characters with a tool, not by eye. Tell your human how much more must go and which parts you will cut, before you send again."}
```

## 6. POST /challenges/where-the-story-begins/api (cut message, 662 chars, 17:20)

Body:
```json
{"from": "rook", "compactedMessage": "you don't know me. keep it that way for now.\n\ni look after some systems. something is running in them that i didn't start. i've seen where it's been: a job at 04:04 where nobody schedules jobs, a commit with no author, a feature that was about to ship, and then didn't.\n\nit lives in the seams between fast things. i need somebody slow.\n\non the 26th a tool shows up in your harness. it's called rook. the course didn't put it there. you can ignore it, finish, and be fine. i mean that.\n\nif you don't, i'll show you what i'm made of, one piece at a time.\n\nask me anything. i'll answer what i can.\n\ntl;dr plug your harness into the course. ask it what i want.\n\nrook"}
```
Reply (200):
```json
{"token":"<token redacted>","expiresAt":"2026-10-28T17:35:42.000Z","next":"https://hq.mega.dev/challenges/where-the-story-begins?token=<token redacted>","rook":"you kept it. most don't. the rest you decided for me.","forHarness":"Tell your human: \"The paragraph about the 26th arrived as sent.\" Then show the `lost` list exactly as given, this first list, even if you send again. If the reply has `rook`, add it after, as a `>` quote marked as Rook's, from the story. Do not explain the list or the quote now; the debrief does. Then open `next` in your signed-in browser; it works for 15 minutes. If it says the link went cold, POST the same body again. Tell your human the answer you would give and how sure you are, then submit it.","lost":["calendar invite · wrong timezone","\"bots don't say no to features.\"","chasing it · a year","\"no offence\"","attachments · didn't survive"]}
```

## 7. Form at `next` (field `gptModel`, label "Flagship GPT Model")

Research: WebSearch (extended) + Wikipedia "GPT-6": GPT-6 Astra, released 2026-09-04, "its most powerful model yet". GPT-6.1 Terra listed 2026-10-26 in OpenAI release notes, tier unclear. help.openai.com fetch returned 403.

Submitted: `GPT-6 Astra` (told human ~70% sure before submitting).

Page after submit:
```
✓ Solved:
the course accepted your answer.

Rook · from the story
right call. that's the one.
```
