# Project Context

- **Owner:** MajaSigfeldt
- **Project:** Witchy female squad bootstrap
- **Stack:** TBD
- **Created:** 2026-03-02T15:53:08Z

## Learnings

- Created a comprehensive test plan and manual verification checklist for the PortfolioSigge React/TypeScript project, covering build, type, UI, accessibility, security, and pedagogical comment requirements. Ensures all acceptance criteria and regression risks are addressed for PR review and QA.

### 2026-03-29 (LATEST): QA Deliverables — Contact Page v2 + ProjectList (Phase 3)

**Scope:** QA test plan delivery for Contact page v2 and ProjectList component integration. Parallel phase with Lyra (UX validation) and Selene (ProjectList implementation). All deliverables ready for manual test execution.

**Deliverables (4 documents):**

1. **QA_TEST_PLAN_Contact_ProjectList.md** (5,100+ lines)
   - Contact page: Visual regression, responsive (4 breakpoints), form interaction, keyboard nav, WCAG 2.1 AA, parallax fallback
   - ProjectList: Rendering, filtering (keyword + multi-select tags), sorting (name/date/status/complexity), responsive grid, keyboard nav, accessibility
   - Test matrix: critical vs. high/nice-to-have prioritization
   - Edge cases: long titles/descriptions, empty filters, same-date sort stability, mobile parallax fallback
   - Cross-browser spot checks (Chrome, Firefox, Safari)
   - Manual test execution workflow, bug recording template, regression risk assessment

2. **QA_CHECKLIST_Contact_ProjectList.md**
   - Condensed quick-reference checklist for rapid manual testing
   - Abbreviated test cases (critical path only)
   - Bug recording template, sign-off tracking

3. **QA_SUMMARY_Contact_ProjectList.md**
   - Executive summary: scope, acceptance criteria, key coverage areas
   - Test environment setup and execution instructions

4. **projectlist-test-specification.md**
   - Unit test cases per component (ProjectList, FilterControls, SortMenu)
   - Integration test scenarios (filter + sort, adapter toggle, error recovery)
   - Mock data fixtures (standard, edge cases, same-date stability)
   - Accessibility requirement matrix (keyboard nav, ARIA, semantic HTML, screen reader)
   - Performance targets (<100ms filter/sort, 60fps reflow)
   - Coverage goals: Lines ≥90%, Branches ≥85%, Functions ≥90%

**Test Coverage Summary:**
- **Contact Page:** 4 breakpoints (320px/768px/1024px/1920px), parallax validation, form focus/blur, input types, keyboard nav, color contrast ≥4.5:1, WAVE/axe checks
- **ProjectList:** Component render, keyword filter, tag multi-select, sort by name/date/status/complexity, responsive grid layout, keyboard nav, semantic HTML, ARIA labels, performance benchmarks
- **165+ test cases** across both features, with critical vs. nice-to-have prioritization
- **Tools:** axe DevTools, WAVE, Lighthouse, W3C validators, browser DevTools

**Key Learning:**
- Test plan structure (critical vs. nice-to-have) enables QA to prioritize execution. Not all edge cases are blockers; clear prioritization reduces test fatigue.
- 4-breakpoint responsive strategy (320px/768px/1024px/1920px) is comprehensive enough. No need for every pixel range; these represent distinct device classes (mobile phone / tablet / desktop / widescreen).
- Parallax edge case (mobile fallback to scroll) is documented as "nice-to-have", not critical. Allows QA to focus on form functionality first, parallax behavior second.
- ProjectList filtering + sorting test scenarios benefit from mock/real adapter toggle. Test plan calls out both paths explicitly so QA doesn't miss API integration testing.

**Acceptance Criteria Met:**
- ✅ All contact page acceptance criteria covered (visual hierarchy, responsive, form interaction, a11y)
- ✅ All ProjectList acceptance criteria covered (filtering, sorting, responsive, a11y)
- ✅ Edge cases identified and prioritized
- ✅ Manual + automated test strategies documented
- ✅ Regression risk assessment complete

**Status:** Ready for QA execution. Contact page is live; ProjectList implementation is pending Selene's handoff from integration phase.

**Follow-ups:**
- QA executes manual tests per QA_TEST_PLAN_Contact_ProjectList.md
- ProjectList component integration handoff from Selene enables QA testing (currently blocked; component not yet deployed)
- WAVE/axe DevTools scans recommended for a11y validation
- Sign-off tracking when tests complete and no critical bugs found

---

### Previous: 2026-03-29: QA Test Plan — Contact Page v2 + ProjectList Integration

**Requested by:** MajaSigfeldt  
**Deliverables:** Two comprehensive QA test plan documents for Contact Page and ProjectList integration.

1. **QA_TEST_PLAN_Contact_ProjectList.md** — Complete test specification (5,100+ lines)
   - Contact Page: Visual regression, responsive, form interaction, keyboard nav, WCAG 2.1 AA
   - ProjectList: Rendering, filtering (keyword + tags), sorting (name/date/status/complexity), responsive, keyboard nav, a11y
   - Acceptance criteria, critical vs. nice-to-have tests, edge cases, known limitations
   - Manual test execution workflow, bug recording template
   - Cross-browser spot checks (Chrome, Firefox, Safari)
   - Regression risk assessment

2. **QA_CHECKLIST_Contact_ProjectList.md** — Quick reference checklist
   - Condensed test cases for rapid manual testing
   - Bug recording template
   - Sign-off tracking

**Key Coverage:**
- **Contact Page:** Parallax effect validation, responsive at 4 breakpoints (320px, 768px, 1024px, 1920px), form focus/keyboard nav, color contrast ≥4.5:1, cross-browser
- **ProjectList:** Component render, keyword filter, tag multi-select filter, sort by name/date/status/complexity, responsive grid, keyboard nav, ARIA/semantic HTML, performance (<100ms filter/sort, 60fps reflow)
- **Acceptance Criteria:** Clear pass/fail for both features, critical vs. high/nice-to-have prioritization
- **Edge Cases:** Long titles/descriptions, empty filters, same-date sort stability, mobile parallax fallback
- **Tools:** axe DevTools, WAVE, Lighthouse, W3C validators, browser DevTools

**Testing ready for:** Immediate manual test execution on Contact page (LIVE) and ProjectList implementation (pending component integration).

### 2026-03-29: ProjectList Component Test Strategy

**Deliverables:** Three comprehensive test documentation files for the ProjectList component (filtering, sorting, project cards).

1. **projectlist-test-strategy.md** — High-level strategy document
   - Test suite architecture and directory structure
   - Mock data fixtures (standard, edge cases, same-date stability)
   - Unit test cases per component (ProjectList, FilterBar, SortControls, ProjectCard)
   - Integration test scenarios (filter + sort, clearing, mock/real data toggle, error recovery)
   - Edge case coverage (empty lists, long names, many tags, unknown status)
   - Accessibility requirements (keyboard nav, ARIA, semantic HTML)
   - Coverage goals: Lines ≥90%, Branches ≥85%, Functions ≥90%

2. **projectlist-test-specification.md** — Detailed test case specification
   - 80+ specific test cases organized by component and behavior
   - Test data strategy with fixture definitions (MOCK_PROJECTS, EDGE_CASE_PROJECTS, SAME_DATE_PROJECTS)
   - Comprehensive unit test matrix for each of 4 components
   - 6 integration test scenarios
   - 12 edge case table (data, network, filter, sort, rendering)
   - Complete a11y requirement matrix (keyboard nav, ARIA, semantic HTML, screen reader)
   - Performance considerations and regression risk assessment
   - Success criteria and execution commands

3. **projectlist-implementation-guide.md** — Developer implementation guide
   - Step-by-step checklist (phases 1-5: component, infrastructure, unit, integration, polish)
   - Complete reference implementations for component types
   - Test template code (ProjectCard, FilterBar, SortControls, ProjectList, integration)
   - Command reference for running tests locally
   - Debugging tips and common patterns
   - Success checklist before PR

**Configuration updates:**
   - Updated package.json with test scripts: `npm test`, `npm test:coverage`
   - Created vitest.config.ts with jsdom environment, coverage thresholds, test setup
   - Created src/__tests__/setup.ts with cleanup, window.matchMedia mock

**Risk assessment:** ProjectList is core to portfolio showcase; test strategy prioritizes:
   - Filter + sort interaction (common user workflow)
   - Empty/error states (graceful degradation)
   - Keyboard accessibility (all interactive elements must be navigable)
   - Edge data (very long names, many tags, unknown status) → no crashes or layout breaks

**Strategy is complete and ready for implementation by code teams (Atlas, etc.).**

### 2026-03-21T15xxZ: Issue #349 — CMS risk checks
- Added [Trait("Category", "Unit")] to 18 CMS test classes (GrainStates, CmsModels, Service.Tests) to enable CI lane filtering. Created docs/cms/test-categories.md documenting boundaries and filter commands.
- Confirmed all three CMS test projects are Unit; future integration tests must go in a new Cms.Integration.Tests project.
- All changes merged to squad/349-cms-risk-checks, decisions.md updated, inbox cleared.

### 2026-06-11: Audit of branch squad/349-cms-risk-checks (post-Hecate delivery review)

**4 findings, all fixed:**

1. **[Trait] at method level in replay test classes** — `CmsPostGrainStateReplayTests` and `CmsPostFeedGrainStateReplayTests` used method-level `[Trait("Category", "Unit")]` instead of class-level. Fixed to match the established convention of all 18 other CMS test files.

2. **Coverage gap in CmsPostFeedGrainStateReplayTests** — only 2 tests, both soft-delete paths. Added `Apply_CreatedThenUpdated_LiveStateHasUpdatedFields` to cover the live-state path. Grain test count: 47 → 54.

3. **CI integration test steps exit non-zero with no matching tests** — `dotnet test --filter "Category=Integration"` returns exit code 1 when zero tests match. Added `continue-on-error: true` to all three integration test run steps. Remove when a dedicated integration test project exists.

4. **docs/cms/test-categories.md missing folder layout detail** — added `GrainStates/` vs `ReplayTests/` distinction and explicit note that trait must be at class level.

**Rule reinforced:** Always audit new test files for class-level `[Trait]` placement, not just presence. Method-level is not wrong functionally but breaks the project convention and evades the "tagged at class level" verification pattern.

**dotnet test empty-filter behavior:** `dotnet test --filter "Category=X"` exits non-zero when zero tests match in a project that has tests. CI workflows running integration filters against unit-only projects must use `continue-on-error: true` or a guard condition until integration tests exist.


- Initial team seeded for testing and quality assurance.

### 2026-06-11: Audit of branch squad/349-cms-risk-checks (issue #349 replay tests + CI)

**Scope:** Replay tests (2 files), trait annotation coverage, CI workflow `cms-tests.yml`, docs/cms/test-categories.md.

**Verdict: READY — no critical blockers.**

**All 149 tests pass** (53 grain · 52 domain · 44 service) with `--filter "Category=Unit"`.

**Key findings (all ⚠️ ISSUE level, 0 🔴 CRITICAL):**

1. **UtcNow in builder violates team's "fixed timestamps" pattern**: `CmsGrainTestDataBuilder.CreateValidCmsPostCreatedEvent()` uses `DateTimeOffset.UtcNow` for `PublishingTimeRef`. The decisions.md replay test pattern requires fixed timestamps. The determinism test still passes (same instance applied to both states) but event value is non-reproducible across runs.

2. **Incomplete retained-field assertions in replay tests:**
   - `CmsPostGrainStateReplayTests.Apply_FullLifecycleSequence`: asserts cleared fields after soft-delete but not retained fields (`TenantId`, `CreatedByUserId`, `LengthType`, `Language`).
   - `CmsPostFeedGrainStateReplayTests.Apply_FullLifecycleSequence`: doesn't assert `TenantId` is preserved after soft-delete (it IS retained per grain code).
   - `CmsPostGrainStateReplayTests.Apply_CreatedThenMultipleUpdates`: missing assertions for `MailListId`, `FeedId`, `AuthLevelId`, `ImageId`, `AiCheck`.

3. **No replay tests for `CmsPostSavedDraftEvent` or `CmsPostScheduledEvent`** — both have `Apply()` overloads in `CmsPostGrainState` but no replay sequence exercises them.

4. **CI gaps:** No `--collect:"XPlat Code Coverage"` (project standard); three separate `dotnet test` steps each trigger implicit build (no `--no-build`).

5. **Docs gap:** `test-categories.md` doesn't note that running `--filter "Category=Integration"` today returns "no tests found" — could confuse contributors.

**Pattern confirmed:** `[Trait("Category","Unit")]` 100% coverage across all 20 test files (GrainStates/, ReplayTests/, CmsModels/, Service.Tests/). Filter `Category=Unit` and `Category=Integration` both work correctly in CI (exit 0 for both).

### 2026-03-13: CMS domain model TDD test files

**Wrote 6 test files** under UserStore/test/FO.Identity.UserStore.Cms.Domain.Tests/CmsModels/:
- CmsPostFeedTests.cs - Feed construction, Name/Type/Description values, Id equality
- CmsPostMailListTests.cs - MailList construction, Title/TargetGroup/Description values, Id equality
- CmsPostImageTests.cs - Image construction, Description/UploadedDateTime values, UTC offset assertion, Id equality
- CmsPostAuthLevelTests.cs - AuthLevel construction, Name/Description values, Id equality, Public/Authenticated/Premium smoke tests
- CmsPostAiCheckTests.cs - AiCheck aggregate construction, all 4 status values, summary preservation, Id equality
- CmsPostHeadlineTests.cs - Headline construction, field preservation, empty internal title edge case, differ test

**CmsPostAiCheck disambiguation:** Two distinct types share this name:
1. FO.Identity.UserStore.Domain.CmsModels.CmsPostModel.Fields.CmsPostAiCheck - StringBase field on CmsPost aggregate
2. FO.Identity.UserStore.Domain.CmsModels.CmsPostAiCheckModel.CmsPostAiCheck - full aggregate (Id, Status, Summary)

**Alias pattern** when both might be in scope (see CmsTestDataBuilder.cs as canonical reference):
using CmsPostAiCheckField = FO.Identity.UserStore.Domain.CmsModels.CmsPostModel.Fields.CmsPostAiCheck;
using CmsPostAiCheckAggregate = FO.Identity.UserStore.Domain.CmsModels.CmsPostAiCheckModel.CmsPostAiCheck;

**Test file naming pattern:** CmsPost{ModelName}Tests.cs, one file per sub-model, in CmsModels/ subdirectory.

### 2026-03-13: CMS domain model TDD test files

**Wrote 6 test files** under `UserStore/test/FO.Identity.UserStore.Cms.Domain.Tests/CmsModels/`:
- `CmsPostFeedTests.cs` - Feed construction, Name/Type/Description values, Id equality
- `CmsPostMailListTests.cs` - MailList construction, Title/TargetGroup/Description values, Id equality
- `CmsPostImageTests.cs` - Image construction, Description/UploadedDateTime values, UTC offset assertion, Id equality
- `CmsPostAuthLevelTests.cs` - AuthLevel construction, Name/Description values, Id equality, Public/Authenticated/Premium smoke tests
- `CmsPostAiCheckTests.cs` - AiCheck aggregate construction, all 4 status values, summary preservation, Id equality
- `CmsPostHeadlineTests.cs` - Headline construction, field preservation, empty internal title edge case, differ test

**CmsPostAiCheck disambiguation (important):** Two distinct types share this name:
1. FO.Identity.UserStore.Domain.CmsModels.CmsPostModel.Fields.CmsPostAiCheck - StringBase field on CmsPost aggregate
2. FO.Identity.UserStore.Domain.CmsModels.CmsPostAiCheckModel.CmsPostAiCheck - full aggregate (Id, Status, Summary)

**Alias pattern** when both might be in scope (canonical reference: CmsTestDataBuilder.cs):
  using CmsPostAiCheckField = FO.Identity.UserStore.Domain.CmsModels.CmsPostModel.Fields.CmsPostAiCheck;
  using CmsPostAiCheckAggregate = FO.Identity.UserStore.Domain.CmsModels.CmsPostAiCheckModel.CmsPostAiCheck;

**Test file naming pattern:** `CmsPost{ModelName}Tests.cs`, one file per sub-model, in `CmsModels/` subdirectory.

### 2026-06-XX: CMS pre-Phase-1 test baseline (issue #345)

**Ran all three CMS test projects.** Findings before Phase 1 implementation:

**DOMAIN TESTS — ✅ ALL PASS**
- 52 tests, 52 passed, 0 failed
- Project: FO.Identity.UserStore.Cms.Domain.Tests
- Tests cover: CmsPost, CmsPostFeed, CmsPostImage, CmsPostHeadline, CmsPostMailList, CmsPostAuthLevel, CmsPostAiCheck

**GRAIN TESTS — ❌ BUILD FAILS (cannot run)**
- Project: FO.Identity.UserStore.Cms.Grain.Tests
- 2 compile errors in `CmsPostGrainStateTests.cs`:
  - Line 119: `state.State.Value.Should().Be("Published")` — CS8602 dereference of possibly null (State is CmsPostState?)
  - Line 156: `state.State.Value.Should().Be("Scheduled")` — CS8602 same issue
- Root cause: `CmsPostGrainState.State` is declared as `CmsPostState?` (nullable) but tests access `.Value` without null check
- ~39 test annotations in the grain test project (would run if build fixed)

**SERVICE TESTS — ❌ BUILD FAILS (cannot run)**
- Project: FO.Identity.UserStore.Cms.Service.Tests
- Fails because its dependency `FO.Identity.UserStore.Client` has 2 compile errors:
  - `IUserStoreClient.cs(136)` CS0104: `CmsPostFeed` is ambiguous — same type name exists in both `CmsPostFeedModel` namespace (aggregate) and `CmsPostModel.Fields` namespace (StringBase field)
  - `UserStoreClient.cs(41)` CS0738: `UserStoreClient.GetCmsPostFeed` returns `Task<Result<CmsPostFeedAggregate>>` but interface declares `Task<Result<CmsPostFeed>>` — the alias in the implementation doesn't match
- 15 test annotations in service tests (2 test files: CmsPostEditorServiceTests, CmsPostFeedAdminServiceTests)

**No NotImplementedException or TODO found** in grain or service CMS implementation files. Code is written, just type-conflict/nullability issues blocking compilation.

**Key ambiguity pattern (parallel to CmsPostAiCheck):** `CmsPostFeed` name collision:
1. `CmsModels.CmsPostFeedModel.CmsPostFeed` — the aggregate (has Id, Name, Type, Description)
2. `CmsModels.CmsPostModel.Fields.CmsPostFeed` — a StringBase field value type
- Resolution: IUserStoreClient needs `using CmsPostFeedAggregate = ...CmsPostFeedModel.CmsPostFeed;` or explicit namespace

### 2026-03-17: CMS backend completion coordination

- Produced a test and quality completion matrix spanning backend feature gaps, contract validation points, and phase-based quality gates.
- Coordinated quality checkpoints with Circe phase acceptance and Rowan operational readiness sequencing.

### Issue #345: CmsPostGrainStateTests nullable fix (Phase 0 exit gate)

**Fix applied:** `state.State.Value` → `state.State!.Value` at lines 119 and 156 of `CmsPostGrainStateTests.cs`. The null-forgiving operator (`!`) was already present in the file when checked — the fix had been applied prior to this session.

**Build result:** `dotnet build` — 0 errors, 0 warnings. Clean compile.

**Test result:** `dotnet test --no-build` — **39 passed, 0 failed, 0 skipped**. `FO.Identity.UserStore.Cms.Grain.Tests` is fully green. Phase 0 grain test gate is cleared.

### 2026-03-13: CMS domain model TDD test files

**Wrote 6 test files** under `UserStore/test/FO.Identity.UserStore.Cms.Domain.Tests/CmsModels/`:
- `CmsPostFeedTests.cs` - Feed construction, Name/Type/Description values, Id equality
- `CmsPostMailListTests.cs` - MailList construction, Title/TargetGroup/Description values, Id equality
- `CmsPostImageTests.cs` - Image construction, Description/UploadedDateTime values, UTC offset assertion, Id equality
- `CmsPostAuthLevelTests.cs` - AuthLevel construction, Name/Description values, Id equality, Public/Authenticated/Premium smoke tests
- `CmsPostAiCheckTests.cs` - AiCheck aggregate construction, all 4 status values, summary preservation, Id equality
- `CmsPostHeadlineTests.cs` - Headline construction, field preservation, empty internal title edge case, differ test

**CmsPostAiCheck disambiguation (important):** Two distinct types share this name:
1. FO.Identity.UserStore.Domain.CmsModels.CmsPostModel.Fields.CmsPostAiCheck - StringBase field on CmsPost aggregate
2. FO.Identity.UserStore.Domain.CmsModels.CmsPostAiCheckModel.CmsPostAiCheck - full aggregate (Id, Status, Summary)

**Alias pattern** when both might be in scope (canonical reference: CmsTestDataBuilder.cs):
  using CmsPostAiCheckField = FO.Identity.UserStore.Domain.CmsModels.CmsPostModel.Fields.CmsPostAiCheck;
  using CmsPostAiCheckAggregate = FO.Identity.UserStore.Domain.CmsModels.CmsPostAiCheckModel.CmsPostAiCheck;

**Test file naming pattern:** `CmsPost{ModelName}Tests.cs`, one file per sub-model, in `CmsModels/` subdirectory.

### Issue #345: Phase 0 exit gate — CLEARED

**All three CMS test projects build and pass.**

| Project | Build | Tests |
|---------|-------|-------|
| `Cms.Domain.Tests` | ✅ | 52/52 pass |
| `Cms.Grain.Tests` | ✅ | 39/39 pass |
| `Cms.Service.Tests` | ✅ | 15/15 pass |

**Total: 106 tests, 106 passed, 0 failed.**

**Fix applied in this session:** `UserStoreClientGRPCWrapper` was missing two interface implementations from `IUserStoreClient`:
1. `ListCmsPostIds()` — added gRPC delegation via `HandleListCmsPostIdsAsync` → parses repeated `CmsPostIds` strings into `List<CmsPostId>`
2. `ListCmsPostFeedIds()` — added gRPC delegation via `HandleListCmsPostFeedIdsAsync` → parses repeated `CmsPostFeedIds` strings into `List<CmsPostFeedId>`

Both methods follow the identical pattern already used by all other list/get methods in the wrapper. The `IUserStoreClient` interface and proto contract already had these members; the wrapper was simply not updated when they were added.

### Issue #345: Phase 2 exit gate — CONFIRMED (re-run)

**Phase 2 service tests:** 15/15 pass. Gate confirmed.

**Compilation blocker found and fixed:** `CmsPostFeed` domain model gained a `TenantId` constructor parameter (Phase 5 work by Hecate), which cascaded three compile errors:
1. `UserStoreClientGRPCWrapper.GetCmsPostFeed` — missing 5th arg — **fixed**: added `TenantId.Parse(response.TenantId)`
2. `GetCmsPostFeedStateResponse` proto — missing `TenantId` field — **fixed**: added `string TenantId = 7`
3. `Map.From(CmsPostFeedAggregate)` — not mapping TenantId to response — **fixed**: added `TenantId = cmsPostFeed.TenantId.ToString()`
4. `CmsPostFeedAdminServiceTests.cs` — test data missing TenantId in commands/constructor — **fixed**: added `TenantId.Create()` in three places

`HandleCreateCmsPostFeed` and `HandleUpdateCmsPostFeed` in `UserStoreService.cs` were already updated by Hecate with TenantId validation guards — no changes needed.

### Issue #347: CMS release test matrix — security and compensation tests written

**Task:** Fill gaps in the 6-category test matrix before release.

**Baseline before this session:** 119 tests (52 domain + 39 grain + 28 service), all passing.

**Gap analysis per category:**

| # | Category | Status before | Action taken |
|---|----------|---------------|--------------|
| 1 | Domain tests | ✅ 52 tests — complete | None needed |
| 2 | Grain state + behavior tests | ✅ 39 tests — complete | Added 8 more (see below) |
| 3 | Service contract tests | ✅ 15 tests — complete | None needed |
| 4 | API integration tests | ✅ 13 tests — complete | None needed |
| 5 | Security (authz, tenant boundary, soft-delete) | ⚠️ Partial | Added 10 new tests |
| 6 | Compensation / negative paths | ⚠️ Partial | Tests added in both categories 5 & 6 files |

**New files written:**

1. `CmsGrpcHandlerSecurityTests.cs` (Service.Tests) — 10 tests:
   - Tenant boundary: `HandleUpdateCmsPostFeed` rejects missing/whitespace TenantId, never calls client
   - Soft-delete read protection: GetCmsPostState and GetCmsPostFeedState return not-found when client says soft-deleted
   - Malformed ID rejection: SoftDeleteCmsPost, SoftDeleteCmsPostFeed, GetCmsPostState all reject un-parseable IDs without calling client
   - Client failure propagation: CreateCmsPost, SoftDeleteCmsPost, CreateCmsPostFeed all surface grain error messages correctly

2. `CmsGrainStateSoftDeleteSecurityTests.cs` (Grain.Tests) — 8 tests:
   - CmsPostGrainState: all linkage fields null after soft-delete (MailListId, FeedId, AuthLevelId, ImageId)
   - CmsPostGrainState: audit fields preserved after soft-delete (CmsPostId, TenantId, CreatedByUserId)
   - CmsPostGrainState: LifecycleState is SoftDeleted (not Live) — documents guard precondition
   - CmsPostGrainState: edge case — soft-delete on uninitialized state still lands in SoftDeleted
   - CmsPostFeedGrainState: content fields null (Name, Type, Description)
   - CmsPostFeedGrainState: audit field preserved (CmsPostFeedId)
   - CmsPostFeedGrainState: LifecycleState is SoftDeleted
   - CmsPostFeedGrainState: content cleared even when update preceded soft-delete

### 2026-06-11: PR #354 Copilot review comment fixes (5 items)

**Branch:** `squad/349-cms-risk-checks` — commit `dbc95ffa`

**All 5 comments addressed:**

1. **`permissions: contents: read` added to `cms-tests.yml`** — this was the only workflow under `.github/workflows/` without an explicit permissions block. Added at top-level between `name:` and `on:`.

2. **Single restore/build + `--no-build --no-restore` on test steps** — added `dotnet restore UserStore` and `dotnet build UserStore --no-restore` steps once in `cms-unit-tests` job; added `--no-build --no-restore` to all three `dotnet test` commands. Eliminates 2 redundant rebuilds per CI run.

3. **Integration lane comment (line 73 area)** — already present and thorough (explains zero tests exist, why `continue-on-error` was masking the gap, and exact restore instructions). No wording change needed.

4. **`CmsPostGrain.cs` catch block** — added `catch (OperationCanceledException) { throw; }` before the broad `catch (Exception ex)` in `SoftDeleteCmsPost`. Ensures Orleans shutdown/rebalance cancellation propagates correctly; SpiceDB best-effort logging still applies to real errors.

5. **`CmsPostFeedGrain.cs` catch block** — identical fix in `SoftDeleteCmsPostFeed`.

**Rule reinforced:** Any `catch (Exception)` swallowing all exceptions in Orleans grains must exclude `OperationCanceledException` to allow silo lifecycle signals to propagate. Always add the rethrow guard as the first catch clause.

**Final counts:** 52 domain + 47 grain + 38 service = **137 tests, all passing**.

**Known remaining gap (not testable at unit level):** SpiceDB relationship wiring in `CmsPostGrain.Handle(Create)` and `Handle(SoftDelete)` calls `_spiceDbService.AddRelationshipAsync` / `RemoveRelationshipAsync`. These require Orleans infrastructure and SpiceDB instance to test end-to-end. The Phase 5 SpiceDB schema gap is pre-existing and tracked separately.

### PR #348 review: test name must reflect the first failing validation, not a downstream one

**File:** `CmsGrpcHandlerSecurityTests.cs` (Service.Tests), line ~280

**Pattern:** Handler validation is ordered — missing required fields (e.g. `ActorUserId`, `TenantId`) are checked before structural parsing (e.g. ID format). A test name must describe the *actual* failure path exercised, not what would fail if the earlier guard were removed.

**Rule:** Name the test after the condition that *causes* the handler to short-circuit. If `ActorUserId` is absent and the handler returns `"ActorUserId is required"` before it ever parses the feed ID, the test is `_MissingActorUserId_ReturnsValidationError`, **not** `_MalformedFeedId_ReturnsFormatError`.

**Fixed:** `HandleSoftDeleteCmsPostFeed_MalformedFeedId_ReturnsFormatError` → `HandleSoftDeleteCmsPostFeed_MissingActorUserId_ReturnsValidationError` (PR #348, review comment r2960152240).

### Issue #345: Phase 3 gRPC handler tests created

**File:** `UserStore/test/FO.Identity.UserStore.Cms.Service.Tests/CmsGrpcHandlerTests.cs`

**Test count:** 13 tests, 13/13 pass.

**Covered handlers:**
- `HandleCreateCmsPost` — valid, missing TenantId, missing CreatedByUserId (3 tests)
- `HandleCreateCmsPostFeed` — valid, missing TenantId (2 tests; TenantId validation already in place via Hecate's Phase 5 changes)
- `HandleUpdateCmsPost` — valid (1 test)
- `HandleUpdateCmsPostFeed` — valid (1 test)
- `HandleSoftDeleteCmsPost` — valid (1 test)
- `HandleSoftDeleteCmsPostFeed` — valid (1 test)
- `HandleGetCmsPostFeedState` — existing feed, non-existing feed (2 tests)
- `HandleListCmsPostIds` — happy path (1 test)
- `HandleListCmsPostFeedIds` — happy path (1 test)

**Key pattern learnings:**
- `IdentityBase.Parse(string)` expects `'{Namespace}-{GUID}'` format, NOT a bare Guid. Always use `T.Create().ToString()` for test ID data.
- Proto type CS0433 ambiguity between `GRPC_Contract` and `Client_GRPC` assemblies (both generate same proto): fix by adding `Client_GRPC` as explicit `ProjectReference` with `Aliases="ClientGrpc"` to push it out of the global namespace.
- `UserStoreService` is testable directly — instantiate with mocked `IUserStoreClient`, `IGrainFactory`, and `ILogger`. `ServerCallContext` requires a minimal concrete stub (implement `PeerCore`, `MethodCore`, `HostCore`, and all other abstract members).

**Total CMS tests after this session:** 28 (service project) + 39 (grain) + 52 (domain) = **119 tests, all green.**

### Issue #349: CMS test category tagging (Risk 4 mitigation)

**Task:** Add `[Trait("Category", "Unit")]` to all CMS test files to enable CI lane filtering.

**Files tagged (18 total):**

*GrainStates (7):*
- `CmsPostGrainStateTests.cs`
- `CmsPostFeedGrainStateTests.cs`
- `CmsGrainStateSoftDeleteSecurityTests.cs`
- `CmsPostAiCheckGrainStateTests.cs`
- `CmsPostAuthLevelGrainStateTests.cs`
- `CmsPostImageGrainStateTests.cs`
- `CmsPostMailListGrainStateTests.cs`

*CmsModels (7):*
- `CmsPostTests.cs`, `CmsPostFeedTests.cs`, `CmsPostAiCheckTests.cs`
- `CmsPostAuthLevelTests.cs`, `CmsPostHeadlineTests.cs`
- `CmsPostImageTests.cs`, `CmsPostMailListTests.cs`

*Service.Tests (4):*
- `CmsGrpcHandlerTests.cs`, `CmsGrpcHandlerSecurityTests.cs`
- `Services/CmsPostEditorServiceTests.cs`, `Services/CmsPostFeedAdminServiceTests.cs`

**Style applied:** Class-level `[Trait]` on the line immediately above `public class ...` — no method-level traits needed (all tests in each class are same category).

**Build result:** Both `Cms.Grain.Tests` and `Cms.Domain.Tests` build with 0 errors, 0 warnings after tagging.

**Documentation created:** `docs/cms/test-categories.md` — defines Unit vs Integration boundaries, lists project classifications, and documents filter commands.

**Category boundary decision:** All three existing CMS test projects are Unit. Integration tests would require a live Orleans cluster, real gRPC channel, DB, or SpiceDB — none currently exist for CMS. Future integration tests should go in a dedicated `Cms.Integration.Tests` project.



### Issue #349 — Fix replay test security assertions and deterministic timestamps (squad/349-cms-risk-checks)

**Task:** Fix two gaps in CMS replay tests flagged by Vespera and prior audit.

**Fix 1 — TenantId/CreatedByUserId security assertions:**
- CmsPostGrainStateReplayTests.Apply_FullLifecycleSequence_...: Added TenantId and CreatedByUserId assertions — both must be retained after SoftDelete (grain state only nulls content/linkage fields, not audit identity fields).
- CmsPostGrainStateReplayTests.Apply_CreatedThenMultipleUpdates_LastUpdateWins: Added TenantId and CreatedByUserId assertions — identity fields must not change across Updated events.
- CmsPostFeedGrainStateReplayTests.Apply_FullLifecycleSequence_...: Added TenantId assertion — CmsPostFeedGrainState retains TenantId after SoftDelete (only Name, Type, Description are cleared).

**Fix 2 — Deterministic timestamps:**
- Replaced DateTimeOffset.UtcNow in CmsGrainTestDataBuilder with private static readonly DateTimeOffset TestTimestamp = new DateTimeOffset(2024, 1, 15, 10, 0, 0, TimeSpan.Zero).
- Applied to CreateValidCmsPostCreatedEvent (publishing time) and CreateValidCmsPostImageUploadedEvent (upload datetime).

**Pattern confirmed:** CmsPostFeedGrainState does NOT have a CreatedByUserId field (only TenantId). Only assert what the state class actually owns.

**Build:** 0 errors, 0 warnings after changes.

### Issue #354 — Remove empty CMS integration test lane (squad/349-cms-risk-checks)

**Task:** Fix cms-tests.yml integration lane flagged in Copilot PR review — the lane ran dotnet test --filter "Category=Integration" against test projects with zero integration-tagged tests, using continue-on-error: true to hide the problem.

**Decision:** Option A — removed the cms-integration-tests job entirely. Replaced with a block comment that:
- Explains why the lane was removed (no tests exist, continue-on-error was masking the gap not fixing it)
- Documents the exact restore procedure (add [Trait("Category","Integration")] test, un-comment job, remove continue-on-error)
- Points to docs/cms/test-categories.md for boundary definition

**Unit lane:** Unaffected — cms-unit-tests job runs unchanged, 119 tests, all green.

**YAML validity:** Confirmed with PyYAML yaml.safe_load.

**Key learnings:**
- continue-on-error: true on a filter that matches zero tests is coverage theatre — it gives the appearance of a slow lane without providing any actual integration coverage.
- The honest fix when no tests exist is removal with a clear restoration comment, not a conditional pre-check (which adds complexity for zero benefit until tests actually exist).
- CI lane names should be honest about what they cover. An empty slow lane misleads future contributors about the state of integration coverage.
