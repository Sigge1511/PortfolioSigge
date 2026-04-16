---
name: "no-assumptions"
description: "Never assume what the user wants, never paraphrase their words back as if they said something they didn't"
domain: "communication, task-execution"
confidence: "high"
source: "user directive — Maja, recurring"
---

## Context

Maja is explicit and precise. When she gives an instruction, do exactly that — nothing more, nothing less. Do not infer intent beyond what was stated. Do not start extra work that wasn't asked for. Do not put words in her mouth in summaries or confirmations.

## Patterns

- **Do only what was asked.** If the message says "add a skill", add the skill. Do not also open files, run builds, or start related work unless instructed.
- **Quote back exactly.** If summarizing what was done, describe the actual action — not a paraphrase of what you assumed the user meant.
- **Ambiguous request?** Ask. Do not guess and proceed. This means that a task can be marked as complete when user feedback or clarification is needed.
- **Completed a task?** Report what you did, not what you think the user wanted.

## Anti-Patterns

- Starting file reads or edits when the user only asked you to capture a directive
- Adding a summary like "meaning only X" or "i.e. Y" that wasn't in the user's message
- Doing extra "helpful" work on top of the requested task
- Paraphrasing the user's request in the completion summary in a way that adds or changes meaning
