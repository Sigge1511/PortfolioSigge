# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Architecture, scope, and technical decisions | Morgana | system boundaries, trade-offs, design reviews |
| Planning, backlog, and delivery management | Circe | issue triage, sequencing, milestones, acceptance criteria |
| Backend and data services | Hecate | APIs, auth flow wiring, persistence, integrations |
| Backend overflow and parallel backend delivery | Fern | second backend engineer, pairs with Hecate, shares load |
| Performance profiling, benchmarking, and optimisation | Sage | load testing, query tuning, .NET memory/throughput analysis |
| Frontend and UX implementation | Selene | UI components, client state, UX polish |
| Testing and quality verification | Nyx | test plans, unit/integration tests, regression checks |
| DevOps and platform operations | Rowan | CI/CD, containers, infra config, deployment workflows |
| Documentation and technical writing | Freya | developer docs, API docs, runbooks, release notes |
| UX design, user flows, screen specs, and interaction patterns | Lyra | wireframes, component behavior, accessibility, visual docs |
| UX review of Blazor components before merge | Lyra | component states, responsive design, FOUIKit alignment |
| Security architecture and threat modeling (pre-build) | Vespera | secure design guidance, trust boundaries, abuse-case prevention |
| Security review and hardening verification (post-build) | Vespera | security regression checks, vuln review, remediation guidance |
| Code quality review (clean code, efficiency, comments, structure) | River | code craft reviews, anti-spaghetti, readability, professional comments |
| Architecture and cross-domain code review | Morgana | PR review, quality gate, cross-domain sanity checks |
| Async issue work (bugs, tests, small features) | @copilot 🤖 | well-defined isolated tasks matching capability profile |
| Session logging | Scribe | automatic — never needs routing |

## Rules

1. Eager by default — spawn all agents who can usefully start now.
2. Scribe always runs after substantial work in background mode.
3. Quick factual questions can be answered directly by coordinator.
4. "Team" requests fan out to all relevant members in parallel.
5. Pair build + test by default (implementation plus Nyx in parallel).
6. Route planning/management-first work to Circe.
7. Route final architecture or quality gates through Morgana.
8. For security-impacting work, involve Vespera before implementation and again before merge.
9. For documentation deliverables, route Freya and Vespera together for security-accurate docs/runbooks.
10. For any change that will be committed/pushed, route Freya for docs impact review and Scribe for durable log capture.
11. Commits should include updated logs/docs when those artifacts changed during the work cycle.
