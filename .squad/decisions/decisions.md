# Squad Decisions

# Decision: CMS InternalHeadline + Subject Tag Registry (2026-07-01)

## 1. Architecture (Morgana)
- InternalHeadline field added to domain, grain state, commands, events, proto (editor-internal only, never public).
- Subject tags stored as semicolon-separated string in CmsPostSubject (max 500 chars).
- Subject tag registry grain (singleton) created with seed tags, gRPC list/search exposed, register internal-only.

## 2. Security (Vespera)
- 4 blockers: InternalHeadline PII exposure in read paths, gRPC logging, subject tag list/search require admin gate, search oracle risk.
- 4 notes: grain state persistence, ICmsPostEditorService contract, future gRPC exposure, seeding idempotency.
- Remediation: IsAdminCaller gate, proto comments, contract docs, query length check, future rate limiting.

## 3. Implementation (Hecate, Fern, Selene, Coordinator)
- Domain, grain, proto, gRPC, client, editor, and test code updated per above.
- All builds pass, 0 errors.

## 4. Risks & Follow-ups
- InternalHeadline PII risk flagged for DPO review.
- Registry grain access control to be completed in Phase 5.
- gRPC register method not exposed until access control in place.

# DTO Contract Freeze Policy — CMS Phase 1 (2026-03-21)
- The DTO contract for the CMS gRPC surface is now frozen at v1.0 (see `docs/cms/dto-contracts.md`). WebRequest models follow the normal API versioning process and are not covered by this specific contract-freeze.
- Any field removal or rename is a breaking change: mark the field as reserved, bump the contract version, and update the doc.
- Additions of optional fields are non-breaking but must be documented.
- This policy ensures backend and admin UI remain in sync as CMS evolves.
See `docs/cms/dto-contracts.md` for the full contract snapshot and field numbers.

# Decision: Replay test pattern for CMS grain states
**By:** Hecate (Backend Engineer)
**Issue:** #349 — CMS Risk Checks
**Date:** 2026-06-11
Files created:
- `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/ReplayTests/CmsPostGrainStateReplayTests.cs`
- `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/ReplayTests/CmsPostFeedGrainStateReplayTests.cs`

## Decision
Replay tests live in a dedicated `ReplayTests/` subfolder (sibling to `GrainStates/`) within the existing test project. No new test project is needed.

## Pattern
1. **Events built once, reused across state instances** — for determinism tests, the same event object instances are applied to two separate `CmsPostGrainState` / `CmsPostFeedGrainState` instances and fields compared. This guards against hidden shared mutable state or non-deterministic Apply logic.
2. **Fixed timestamps** — replay tests use `DateTimeOffset.Parse("2026-07-01T10:00:00Z")` style literals, not `DateTimeOffset.UtcNow`, so event data is fully stable across runs.
3. **Trait** — all replay tests carry `[Trait("Category", "Unit")]` to be picked up by `dotnet test --filter Category=Unit`.
4. **No new dependencies** — existing `CmsGrainTestDataBuilder`, FluentAssertions, and xUnit are sufficient.

## Rationale
Replay tests are distinct from the single-event tests in `GrainStates/` — they verify that multi-event sequences converge to the expected final state and that the Apply pipeline has no side effects that would cause divergence on re-replay. Keeping them in a separate folder makes the intent immediately clear to reviewers.

# Decision: SoftDeleteCmsPostFeed — TenantId removed from command
**Date:** 2026-06-11
**Author:** Hecate (Backend Developer)
**Requested by:** Maja

## Decision
`TenantId` has been removed from `SoftDeleteCmsPostFeedCommand` and from the corresponding `SoftDeleteCmsPostFeedRequest` proto message.

## Rationale
The grain implementation (`CmsPostFeedGrain.Handle(SoftDeleteCmsPostFeedCommand)`) reads `State.TenantId` directly when calling `RemoveRelationshipAsync` on SpiceDB. The `TenantId` field in the command was never read — it was silently ignored. Requiring clients to supply it was an unnecessary breaking constraint with no functional benefit.

## Rule
For soft-delete operations on feed/post grains:
- **Do NOT** require `TenantId` in the command or gRPC request.
- The grain owns its tenant context via grain state; callers do not need to repeat it.
- Only create-side commands (which establish the SpiceDB relationship) legitimately need `TenantId` as an input.

## Files Changed
- `SoftDeleteCmsPostFeedCommand.cs` — record parameter removed
- `userstoregrpc.proto` — `TenantId = 3` field removed from `SoftDeleteCmsPostFeedRequest`
- `UserStoreService.cs` — validation guard and parse removed from `HandleSoftDeleteCmsPostFeed`
- `UserStoreClientGRPCWrapper.cs` — request property removed from `Handle(SoftDeleteCmsPostFeedCommand)`
- Three test files updated to match new signature

# Decision: Remove TenantId from UpdateCmsPostFeedCommand
**Author:** Hecate
**Date:** 2026-06-11
**Requested by:** Maja (MajaSigfeldt)
**Status:** Implemented

## Context
`UpdateCmsPostFeedCommand` carried a `TenantId` parameter that was never read by `CmsPostFeedGrain.Handle(UpdateCmsPostFeedCommand)`. The grain is immutably tenant-bound at creation time and reads `State.TenantId` when it needs the tenant context. The command TenantId was silently dropped.

This is the same pattern as the `SoftDeleteCmsPostFeedCommand` TenantId removal done on 2026-06-11.

## Decision
Remove `TenantId` from `UpdateCmsPostFeedCommand` and all layers that transport it:
- Proto field `string TenantId = 5` removed from `UpdateCmsPostFeedRequest` (field numbers 1–4 and 6 unchanged — no wire break for existing clients that don't send field 5)
- Domain command record parameter removed
- Service handler validation guard removed
- Map.cs parse call removed
- gRPC wrapper request builder property removed
- Tests updated to not construct with TenantId

## Rule
> **Update-side grain commands never need TenantId.** The grain is tenant-bound at creation. Only create-side commands (`CreateCmsPostFeedCommand`) need TenantId because that is when the SpiceDB owner relationship is first established.

## Also included in this batch
**Parse split for SoftDelete handlers:** `HandleSoftDeleteCmsPost` and `HandleSoftDeleteCmsPostFeed` now use separate try/catch blocks per ID field, and add null-checks for `CmsPostId`/`CmsPostFeedId` before the admin check. A malformed `ActorUserId` now returns "Invalid ActorUserId format." instead of the misleading "Invalid CMS post ID format."

# Decision: CMS Unit vs Integration Test Boundaries
**Date:** 2026-06-XX
**Author:** Nyx (QA/Test Engineer)
**Issue:** #349 — CMS Risk Checks, Risk 4 (CI lane split)

## Decision
All three existing CMS test projects are classified as **Unit**:
- `FO.Identity.UserStore.Cms.Domain.Tests`
- `FO.Identity.UserStore.Cms.Grain.Tests`
- `FO.Identity.UserStore.Cms.Service.Tests`

## Rationale
**Unit** in this codebase means: pure state/logic, no IO, no gRPC wire calls, no real database, no Orleans cluster. All CMS tests instantiate real domain objects or grain states in memory, and substitute dependencies (IUserStoreClient, IGrainFactory) with Moq mocks or test doubles.

**Integration** means: at least one of — live gRPC channel, PostgreSQL, running Orleans cluster, SpiceDB instance. No such tests exist yet for CMS.

## Implication
The CI unit lane runs: `dotnet test --filter "Category=Unit"` — this will include all 137 current CMS tests.

Future integration tests for CMS (e.g., SpiceDB authz wiring, full grain activation) must live in a new `FO.Identity.UserStore.Cms.Integration.Tests` project and be tagged `[Trait("Category", "Integration")]`.

## Implementation
`[Trait("Category", "Unit")]` added at class level to 18 test classes across the three projects.
See `docs/cms/test-categories.md` for usage reference.

# Decision: CMS CI Lane Split
**Author:** Rowan (DevOps Engineer)
**Date:** 2026-03-17
**Related Issue:** #349 (CMS Risk 4 mitigation)
**Requested by:** MajaSigfeldt

## Decision
Split the CMS test suite into two distinct CI lanes within a dedicated workflow (`.github/workflows/cms-tests.yml`):

| Lane | Job | Filter | Trigger |
|------|-----|--------|---------|
| Fast | `cms-unit-tests` | `Category=Unit` | Every push (any branch) |
| Slow | `cms-integration-tests` | `Category=Integration` | PR to `main` + `workflow_dispatch` only |

## Rationale
As the CMS integration tests grow they introduce external dependencies and longer runtimes. Running them on every push creates CI instability and developer friction. The fast lane gives immediate feedback on logic correctness; the slow lane gates merges to `main` where correctness against external systems matters.

## Constraints
- `cms-integration-tests` has `needs: cms-unit-tests` — the slow lane only starts after the fast lane passes, preventing wasted runner time.
- Both jobs use `UserStore/**` path filters; unrelated pushes do not trigger this workflow.
- `pr-validation.yml` is **not modified** — this workflow is additive and complementary.

## Impact
- Developers get fast feedback (unit lane) on every push without waiting for integration tests.
- Integration failures surface on PR before reaching `main`, satisfying Risk 4 of the CMS risk register.
- Test result artifacts are uploaded via `actions/upload-artifact@v4` for both lanes.

# Security Gate Pattern for CMS (Issue #349)
A formal security gate is now required at every CMS phase exit and before PR merge:
- **Phase Exit Gate**: All mutation handlers must enforce IsAdminCaller as the first gate, validate required fields with field-specific errors, ensure TenantId is immutable post-create, guarantee one event per command with Apply() covering all state changes, and maintain SpiceDB relationship hygiene (owner written on create, removed on soft-delete). Test coverage must include missing-field and admin-only checks for every handler.
- **Pre-Merge Checklist**: PRs must confirm IsAdminCaller is present, required fields are validated, TenantId is not accepted in update/soft-delete protos, reserved N; is used for proto field removals, Apply() covers all state transitions, SpiceDB relations are managed, and tests cover admin-only and missing-field paths with correct [Trait] tags.
This pattern is mandatory for all CMS work. See `docs/cms/security-gate-checklist.md` for the full checklist.


# Decision: Always forward ActorUserId and TenantId in gRPC wrapper request builders

**Date:** 2026-03-19  
**Author:** Hecate (Backend Developer)  
**Requested by:** Maja (Sigge)

## Context

`UserStoreClientGRPCWrapper.cs` contains wrapper methods that translate domain commands into gRPC request messages. When the proto contract and service-side validation for CMS mutations were updated (Issue #347) to require `ActorUserId` (and `TenantId` for feed operations), 6 wrapper methods were not updated to include these fields. Any call routed through the wrapper would fail with service-side validation errors.

## Decision

**All gRPC request builders in `UserStoreClientGRPCWrapper.cs` must include every field that `UserStoreService` validates as required.**

Specifically:
- CMS post mutation requests (`Update`, `SaveDraft`, `SoftDelete`) must forward `ActorUserId`.
- CMS post feed mutation requests (`Create`, `Update`, `SoftDelete`) must forward both `TenantId` and `ActorUserId`. [CORRECTED 2026-03-21: TenantId is no longer required for SoftDeleteCmsPostFeed or UpdateCmsPostFeed; grain uses State.TenantId and ignores request.TenantId.]

## Fix Applied

6 methods updated in `UserStoreClientGRPCWrapper.cs`:

| Method | Field(s) Added |
|--------|---------------|
| `Handle(UpdateCmsPostCommand)` | `ActorUserId` |
| `Handle(SaveDraftCmsPostCommand)` | `ActorUserId` |
| `Handle(SoftDeleteCmsPostCommand)` | `ActorUserId` |
| `Handle(CreateCmsPostFeedCommand)` | `TenantId`, `ActorUserId` |
| `Handle(UpdateCmsPostFeedCommand)` | `TenantId`, `ActorUserId` |
| `Handle(SoftDeleteCmsPostFeedCommand)` | `ActorUserId` |

## Rule Going Forward

When a proto request message gains a new required field (validated in `UserStoreService`), the following files **must** be updated atomically:
1. `UserStoreClientGRPCWrapper.cs` — the gRPC client wrapper
2. `UserStoreClient.cs` — the non-gRPC client (if it has a parallel method)
3. Any test data builders that construct the command

Failure to update wrapper files results in silent runtime validation failures, not compile-time errors, making them easy to miss in PR review.


# Decision: CMS documentation corrected to reflect post-#347 security state

**Date:** 2026-06-02  
**Author:** Vespera (Security Specialist)  
**Requested by:** MajaSigfeldt  

## Context

Two CMS documentation files contained stale security language that contradicted the actual post-Issue #347 implementation state and the accepted-by-design decision logged in the known risks table.

## Decisions recorded

### 1. CMS-R2 is accepted by design — no mitigation required on list endpoints

`security-controls.md` §2.3 previously framed cross-tenant ID enumeration as a HIGH risk with a required mitigation list. This contradicted §5 (Known Risks), where CMS-R2 is marked "Accepted by design" per Sigge's decision on 2026-03-19 (CMS content is platform-wide; any authenticated user may enumerate all IDs).

**Decision:** §2.3 now reflects the accepted state with an ℹ️ note. The HIGH warning and numbered mitigation options have been removed. The factual description of what the code does (global singleton registry, returns all IDs) is retained.

### 2. completion-report.md security status updated to reflect Issue #347 resolution

The report was written before Issue #347 work was complete. It contained two BLOCKER items that are now resolved or accepted:

- "No SpiceDB permission checks before any CMS mutation" → **Resolved**: admin role gate wired in all 9 handlers.
- "ListCmsPostIds/ListCmsPostFeedIds cross-tenant enumeration" → **Accepted by design** (CMS-R2).

**Decision:** Sections 3 (Security Status), 6 (Ops Readiness), and 7 (Open Items) have been updated to reflect accurate current state. No new architectural decisions were made — this is a documentation alignment to match the existing codebase and existing accepted-by-design record.

## No open decisions created

All relevant decisions (CMS-R1 resolution, CMS-R2 acceptance) were already logged. This file records the documentation alignment only.

