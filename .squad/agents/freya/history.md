# Project Context

- **Owner:** MajaSigfeldt
- **Project:** Witchy female squad bootstrap
- **Stack:** TBD
- **Created:** 2026-03-12T08:25:48.0447515Z

## Learnings

### 2024-06-12: PR #354 Copilot CMS doc fixes
- Removed line numbers from 'Code location' in security-controls.md table (now only file+method/class names)
- Narrowed dto-contracts.md overview to clarify it covers only gRPC contracts, not WebRequest models
- Reworded replay test checklist in security-gate-checklist.md to require retention of identity/tenant/audit fields generically
- Updated test-categories.md to state unit tests run on every push and pull request to main
- All changes committed atomically and summarized in decisions inbox (freya-pr354-doc-fixes.md)

### 2024-06-11: CMS test-categories.md CI workflow section updated (PR #354 Copilot review)
- Updated the "Running tests by category" section to state only the Unit lane is active in CI; Integration lane will be restored when integration tests exist. Removed outdated claim about integration tests running on PRs/manual dispatch. Decision recorded in .squad/decisions/inbox/freya-test-categories-ci-updated.md.

### 2026-03-22: CMS docs audit (issue #349)
- Performed a full audit and update of all CMS documentation deliverables in squad/349-cms-risk-checks.
- Ensured DTO contract tables match proto, all 9 mutation messages are covered, and breaking change policy is explicit.
- Security controls, enforcement layers, and test categories now reference real code and are cross-consistent.
- Security gate checklist is now actionable and file-linked for new devs.
- All changes committed atomically and summarized in decisions inbox.

### 2026-03-21T15xxZ: Issue #349 — CMS risk checks
- Authored docs/cms/dto-contracts.md as the Phase 1 DTO contract freeze for CMS. Documented all gRPC mutation request/response messages and field numbers, formalized breaking change/versioning policy. Snapshot ensures future contract changes are intentional and versioned.
- All changes merged to squad/349-cms-risk-checks, decisions.md updated, inbox cleared.

### 2026-03-21 (Audit): Documentation quality audit of branch squad/349-cms-risk-checks
- **Critical fix**: `dto-contracts.md` was missing SaveDraft, PublishCmsPostNow, and ScheduleCmsPost message families — all 9 Phase 1 mutations per security-controls.md §4.1 must be documented, not just 6.
- All documented fields were verified 100% accurate against the canonical proto.
- Pattern learned: when scoping a "Phase 1 contract freeze," cross-check the set of messages against the security-controls auth table, not just what feels obvious.
- Added proto file path, cross-doc references, and version-bump procedure to dto-contracts.md.
- Added CmsAdminRole placeholder warning (CMS-R5) to security-gate-checklist.md — open risks with production implications belong in the daily-use checklist, not just the risk register.
- Added concrete test class examples and CI workflow reference to test-categories.md — abstract category definitions are not enough; developers need grounding in real class names.
- Added explanatory comments to cms-tests.yml for non-obvious CI gating decisions.


2026-03-21: Authored `docs/cms/dto-contracts.md` as the Phase 1 DTO contract freeze for CMS (issue #349). Documented all gRPC mutation request/response messages and field numbers, and formalized the breaking change/versioning policy. This snapshot ensures future contract changes are intentional and versioned.


2026-03-19: Correction entries created for CMS-R1 supersession and orchestration log (see .squad/decisions/inbox/freya-cms-r1-spicedb-superseded.md and .squad/orchestration-log/2026-03-19T13-52-00Z-correction.md).

- Added `docs/cms/completion-report.md` as the CMS feature completion report (issue #347). Key findings: 2 security blockers (no SpiceDB permission checks before mutations; cross-tenant enumeration in list endpoints), 137 tests passing, ops not ready for production until blockers are resolved.

- Created `docs/cms/lifecycle-and-states.md`: CMS post lifecycle, state transitions, events, aggregates, and soft-delete documentation (issue #347).

- Added as Technical Writer to own docs, runbooks, and release communication.
- Created a reusable secure-by-default documentation checklist skill for Freya and Vespera covering pre-implementation security context, implementation-time checks, and pre-merge/post-build documentation gates with explicit handoffs.
- Authored a CMS TDD backend contract doc at `.squad/skills/cms-tdd-contracts/CONTRACTS.md` to align grain states, grain interfaces, and service naming with test dependencies and Vespera security constraints.

### 2026-03-17: CMS backend completion coordination

- Produced a documentation and traceability plan for CMS backend completion outputs across architecture, delivery, API, quality, and operations.
- Added explicit Freya/Vespera collaboration points so security decisions and release checklist evidence are captured in durable docs.

## User Preference
The user's name is **Sigge**. Always address them as Sigge — never Maja, MajaSigfeldt, or any other variant.
