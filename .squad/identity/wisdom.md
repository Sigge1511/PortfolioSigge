---
last_updated: 2026-02-26T11:48:54.943Z
---

# Team Wisdom

Reusable patterns and heuristics learned through work. NOT transcripts — each entry is a distilled, actionable insight.

## Patterns

<!-- Append entries below. Format: **Pattern:** description. **Context:** when it applies. -->

## Anti-Patterns

<!-- Things we tried that didn't work. **Avoid:** description. **Why:** reason. -->


## Session Protocol
**Pattern:** Use neutral, second-person language ("you") when addressing the user. Do not address the user by a personal name in agent output — names are read from `git config user.name` for context only and are not used as a salutation in responses.
**Context:** Every session, every message, every agent spawn.
