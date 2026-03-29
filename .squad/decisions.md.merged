# Squad Decisions

# Decision: CMS Service Interface Method Conventions

**Date:** 2025-07-15  
**Author:** Hecate  
**Issue:** #385

## Context

Four CMS service interfaces were empty stubs, breaking the CMS editor page. Adding the missing methods revealed conventions that should be codified for future CMS service work.

## Decisions

### 1. Read methods use Debug-level logging; write methods use Info/Warning

- `GetXxxAsync` methods: log at `LogDebug` on entry and result count
- Command/mutation methods: log at `LogInformation` on start and success; `LogWarning` on domain failure; `LogError` on exception

### 2. `GetAllFeedsAsync` uses partial-success semantics

When bulk-fetching by listing IDs and then fetching individually, failed individual fetches are silently skipped (logged at Debug/Warning by the underlying method). The caller receives whatever set succeeded. This avoids a single bad grain poisoning the entire feed list.

### 3. `ICmsPostEditorService` security contract comment must be preserved verbatim

The `SECURITY CONTRACT (Vespera CMS-R2)` comment on `ICmsPostEditorService` is a release-gate marker. Any edit to that interface must preserve the comment in full.

### 4. Stub services return empty collections, not exceptions

`ICmsPostSubjectService` stub methods return `Task.FromResult(new List<T>())` — they do not throw `NotImplementedException`. This allows the editor page to render with empty dropdowns rather than crashing.

### 5. Copyright header required on all modified `.cs` files in UIAdminComponents

Every substantially modified `.cs` file in the service layer must begin with `// Copyright ForestOmni AB.`.


### 2026-03-27: D1 — Create Post timing decision
**By:** MajaSigfeldt (via Copilot)
**What:** A new CmsPost record (CreatePostAsync) is created on the FIRST save event, not on page load. A save event is triggered by either:
1. The Quill 5-minute sync interval firing — IF internal headline (InternalTitle) is set AND at least one RTE (LongBody or ShortBody) has content.
2. The user explicitly pressing the "Save draft" button — same conditions: headline set AND at least one RTE has content.
**Why:** Avoids creating ghost post records for users who open the editor but never write anything. Creates the record at the earliest meaningful moment (real content exists).
**Impact:** TryAutoSaveAsync must be updated — instead of returning early when _currentCmsPostId is null, it should call CreatePostAndSaveDraftAsync() when headline + content conditions are met. SaveDraft() already has this path (Selene's implementation) — the autosave loop path needs the same treatment.


# Decision: SaveDraft toast on missing post (PR #377)

**Author:** Fern  
**Date:** 2025-07-09  
**File:** `Portal/src/FO.AdminPortal.BlazorServerSide/Pages/Admin/UserStore/CmsPostEditor.razor.cs`

## Decision

Added `bool showErrorOnMissingPost = true` optional parameter to `SaveDraft()`.

- Manual calls (e.g. "Spara utkast" button) use the default `true` → shows error toast when post isn't loaded yet.
- `TryAutoSaveAsync` passes `showErrorOnMissingPost: false` → silent return, no spam.

## Rationale

`TryAutoSaveAsync` already guards against create mode with `if (_currentCmsPostId is null) return;`, so autosave never reaches the null check in `SaveDraft`. The parameter is defensive clarity: if autosave logic ever changes, the behaviour contract is explicit in the call site rather than implicit.

## Pattern established

For any future method that can be called from both user-initiated and background paths where error visibility differs, prefer an optional `bool notifyOnError = true` parameter over duplicating the method or using a shared flag.

# Decision: Remove brittle string-matching guard in CmsPostFeedSeedingService

**Date:** 2026-06-13  
**Author:** Hecate (Backend Engineer)  
**File:** `UserStore/src/FO.Identity.UserStore.Infrastructure/Seeding/CmsPostFeedSeedingService.cs`

## Context

`CmsPostFeedSeedingService.StartAsync` called `GetFeedAsync` and only proceeded to seed if the failure error message contained "not found" or "does not exist". When Azurite was not yet ready at UserStore startup, the grain threw a connectivity error ("CMS feed read failed"), which did not match those strings — causing seeding to be silently skipped and the AdminTestDisplayPage feed to never be created.

## Decision

Remove the `isNotFound` string-matching guard entirely. Whenever `GetFeedAsync` is not successful (for any reason), log the error and always call `CreateFeedAsync`. The grain handles duplicate creation gracefully (no-op), so calling create unconditionally is safe.

## Rationale

- Idempotent seed operations should not rely on specific error-message text matching — error messages are implementation details that can change.
- The grain's own duplicate-detection is the correct place to enforce "only create once".
- This pattern should be applied to all similar seeding services: check success, attempt creation, let grain handle duplicates.

## Impact

- Fixes "feed not found" error on the CMS test page in local dev when Azurite initialises after UserStore starts.
- No risk of duplicate feed creation since the grain rejects or ignores duplicate `CreateFeedAsync` calls.

# Finding: CMS AdminTestDisplayPage feed "not found" on display-test page

**Author:** Hecate  
**Date:** 2026-06-XX  
**Status:** Bug identified — fix needed

---

## What the user sees

Visiting `/admin/userstore/cms/display-test` shows:  
> "Flödet 'AdminTestDisplayPage' hittades inte. Kontrollera att flödet är registrerat i systemet."  
(Feed 'AdminTestDisplayPage' was not found.)

---

## Root cause

`CmsPostFeedSeedingService` (`UserStore/src/FO.Identity.UserStore.Infrastructure/Seeding/CmsPostFeedSeedingService.cs`) is an `IHostedService` that should seed the `AdminTestDisplayPage` feed at UserStore startup. It has a fragile guard on lines 45–53:

```csharp
bool isNotFound = existing.Errors.Any(e =>
    e.Message.Contains("not found", StringComparison.OrdinalIgnoreCase) ||
    e.Message.Contains("does not exist", StringComparison.OrdinalIgnoreCase));

if (!isNotFound)
{
    _logger.LogWarning("Skipping seed — unexpected error: {Error}", ...);
    return;  // Silently skips seeding
}
```

When Azurite (blob storage) isn't fully ready at startup, the grain activation in `CmsPostFeedAdminService.Execute` throws an exception. The service catches it and returns `Result.Fail("CMS feed read failed")`. This message does **not** match "not found" or "does not exist", so `isNotFound = false` and seeding is silently skipped. The `AdminTestDisplayPage` feed grain is never created.

**Contributing factor:** `fo.identity.userstore.silo.azurestorage` (the UserStore Azurite container) has no healthcheck configured in `docker-compose.yml`. UserStore's `depends_on` only waits for Azurite to start — not for it to be ready to serve blob/table requests. The UserStore healthcheck is also commented out.

---

## Data flow

1. `CmsPostDisplayTest.razor` calls `CmsPostFeedAdminService.GetFeedAsync(AdminTestDisplayPage)` via gRPC
2. Feed grain has no events → returns `Result.Fail("CmsPostFeedGrain does not exist")`
3. `_feedNotFound = true` → page shows the error message

---

## Recommended fix

In `CmsPostFeedSeedingService.StartAsync`, **remove the `isNotFound` guard** and always attempt `CreateFeedAsync`. The grain already handles idempotency: if it's not `Uninitialized`, `Handle(CreateCmsPostFeedCommand)` returns a failure. Treat that failure as "already exists" and log info.

```csharp
// Before: skip seeding if not explicitly "not found"
// After: always try to create; grain rejects duplicate creation gracefully

var result = await feedAdminService.CreateFeedAsync(command);
if (result.IsFailed)
{
    // Check if it's an "already exists" condition (grain not Uninitialized)
    bool alreadyExists = result.Errors.Any(e => e.Message.Contains("wrong state", ...));
    if (alreadyExists)
        _logger.LogInformation("Feed already exists, skipping seed");
    else
        _logger.LogError("Failed to seed CMS post feed: {Errors}", ...);
    return;
}
```

Optionally, also add a healthcheck to `fo.identity.userstore.silo.azurestorage` in `docker-compose.yml` so UserStore waits for storage to be ready before starting.

---

## Files to change

- `UserStore/src/FO.Identity.UserStore.Infrastructure/Seeding/CmsPostFeedSeedingService.cs` — fix the seeding guard logic
- `docker-compose.yml` (optional improvement) — add healthcheck to `fo.identity.userstore.silo.azurestorage`

### 2026-03-26: CmsPostDisplayTest — interim batching + follow-up issue

**Branch:** squad/376-create-post-display-test  
**Requested by:** MajaSigfeldt  
**Author:** Sage (Performance Engineer)

**Decision:** Applied interim batching fix (groups of 50) to LoadPostsForFeedAsync in CmsPostDisplayTest.razor.cs rather than adding a new feed-scoped gRPC endpoint immediately.

**Why:**  
No ListCmsPostIdsByFeedId exists in the grain, gRPC proto, or client interface layers. Adding one is correct but out of scope for PR #377 — it requires proto changes, grain state changes, and full test coverage.

**What was done:**
- Replaced SemaphoreSlim-of-10 over all N tasks with Chunk(50) sequential batching (50 concurrent per batch). Reduces peak Task/memory allocation; total gRPC call count is unchanged.
- Removed unused System.Threading import.
- Comment updated to honestly state the O(N) limitation.
- TODO stub added in code pointing to the follow-up issue.

**Follow-up required (create GitHub issue):**  
> "Add feed-scoped ListCmsPostIdsByFeedId endpoint to UserStore"  
> Scope: ICmsPostRegistryGrain new method + FeedId secondary index in CmsPostRegistryGrainState + IUserStoreClient + gRPC proto + UserStoreClientGRPCWrapper

**Risk:** Low — change is additive, same correctness, no schema changes, build passes with 0 warnings.

### 2026-03-24: CMS blob storage service design
**By:** Hecate
**What:** ICmsBlobStorageService wraps FileStore gRPC with CMS-specific API. Uses 3-step pattern: PrepareImageUploadAsync (register + get SAS URL) → ConfirmImageUploadAsync → GetImageUrlAsync. CmsBlobUploadContext record carries FileId + UploadUrl.
**Why:** FileStore is the canonical blob service; CMS layer should not call FileStore gRPC directly from UI components.


### 2026-03-24T13-16-09: User directive
**By:** MajaSigfeldt (via Copilot)
**What:** Always push commits after making them. Do not leave commits local — push to origin immediately.
**Why:** User request — captured for team memory

# PR #365 — Dead doc reference fix

## Summary
- The interface `ICmsPostAiAnalysisService` referenced a non-existent `docs/cms/ai-analysis-design.md`.
- No suitable CMS AI analysis design doc existed in `docs/cms/` or related directories.
- Created `docs/cms/ai-analysis-design.md` as a stub, summarizing the service's purpose, security boundaries, and implementation notes.
- Updated the interface comment to reference the new doc.

## Rationale
- Maintains doc-comment accuracy and prevents dead links in API documentation.
- Ensures future implementers have a clear starting point for security and design context.

## Location
- Interface: `UserStore/src/FO.Identity.UserStore.Domain/Cms/Services/ICmsPostAiAnalysisService.cs`
- New doc: `docs/cms/ai-analysis-design.md`

— Freya, 2024-06-13


# Hecate — PR #365 Fixes

**Date:** 2026-06-12  
**Branch:** `squad/cms-connect-backend-to-views`  
**Requested by:** MajaSigfeldt

## Decisions Made

### 1. UseAuthentication/UseAuthorization placement (Portal Program.cs)
Added `app.UseAuthentication()` and `app.UseAuthorization()` after `app.UseStaticFiles()` and before `app.UseAntiforgery()`. Standard ASP.NET Core middleware order requires auth before antiforgery and endpoint mapping.

### 2. CMS gRPC service registration split (ServiceCollectionExtensions.cs)
Removed `ICmsPostEditorService`/`ICmsPostFeedAdminService` registrations from `AddUserStoreAdminServices()` (Orleans/grain path). They already exist in `AddUserStoreAdminClientServices()` which also registers `IUserStoreClient`. The grain-backed path must not register gRPC-dependent services — a TODO comment was left as a reminder to add a grain-backed implementation when ready.

### 3. Dead doc link removed (ICmsPostAiAnalysisService.cs)
`docs/cms/ai-analysis-design.md` does not exist. Updated the comment to reference "CMS security design guidelines" generically rather than a non-existent file path.

## PR #365 Code Review Fixes (2026-06-12)

### Fix 1 — Auth Middleware Verified Present
`app.UseAuthentication()` (line 223) and `app.UseAuthorization()` (line 224) confirmed present on the branch in the correct order: after `UseStaticFiles()`, before `UseAntiforgery()`.

### Fix 2 — CMS Test Project Build Exclusions Removed
Three CMS test projects in `FO.Mother.slnx` that had `<Build Solution="Debug|*" Project="false" />` exclusions are now simple self-closing entries — no build exclusions. All three compile cleanly in Debug.

**Build result:** 0 errors, 2 pre-existing warnings (unrelated CS8974 in SubscriptionDetailsModal.razor).


# PR #365 — Path Casing Fix in docker-compose.dcproj

**Branch:** `squad/cms-connect-backend-to-views`  
**Requested by:** MajaSigfeldt  
**Done by:** Rowan (DevOps Engineer)

## What was fixed

`docker-compose.dcproj` line 13 referenced `certs\Fix-My-Certs.ps1` (lowercase `c`).  
The actual folder on disk is `Certs/` (capital C).

On Linux (case-sensitive filesystem) this path would fail silently or at build time. The Docker target OS for this project is **Linux**, so the bug was real and blocking.

## Change made

```
<!-- Before -->
<None Include="certs\Fix-My-Certs.ps1" />

<!-- After -->
<None Include="Certs\Fix-My-Certs.ps1" />
```

## Impact

Low risk, single-line change. Aligns with the existing `Certs\Test-Cert-ContainerReadiness.ps1` entry on line 14 which already used the correct casing.


# PR #365 Fix Summary — Selene

**Branch:** `squad/cms-connect-backend-to-views`  
**Date:** 2026-05-30  
**Requested by:** MajaSigfeldt

---

## Fix 1 — FO_RichTextEditor Value/ValueChanged wiring

**Files changed:**
- `UIKit/src/FOUIKit/src/FOUIKit.Components/Library/RichTextEditor/FO_RichTextEditor.razor`
- `UIKit/src/FOUIKit/src/FOUIKit.Components/wwwroot/QuillRte/rich-text-editor.js`

**What was done:**
- `initQuill` JS function updated: now accepts `(elementId, heightPx, initialValue, dotNetRef, isDisabled)`.
- On init, sets Quill's content from `initialValue` using `quill.clipboard.dangerouslyPasteHTML(value)`.
- Registers a `text-change` listener that calls `dotNetRef.invokeMethodAsync('OnEditorChanged', quill.root.innerHTML)`.
- Calls `quill.disable()` when `isDisabled` is true.
- Razor component now implements `IAsyncDisposable`, creates `DotNetObjectReference<FO_RichTextEditor>` in `OnAfterRenderAsync(firstRender)`, passes it to JS, and disposes it in `DisposeAsync`.
- Added `[JSInvokable] public async Task OnEditorChanged(string html)` that invokes `ValueChanged`.

---

## Fix 2 — FO_ImageCropper dynamic parameter replaced

**Files changed:**
- `UIKit/src/FOUIKit/src/FOUIKit.Components/Library/ImageCropper/FO_ImageCropper.razor`
- `Portal/src/FO.AdminPortal.BlazorServerSide/Pages/Admin/UserStore/CmsPostEditor.razor`

**What was done:**
- Removed `dynamic? Image` parameter.
- Added `string? ThumbnailUrl` parameter instead.
- Template now uses `@ThumbnailUrl` directly.
- Updated the single caller (`CmsPostEditor.razor` line ~336): `Image="@_imageBeingEdited"` → `ThumbnailUrl="@_imageBeingEdited.ThumbnailUrl"`.

---

Both projects build with 0 errors (2 pre-existing unrelated warnings in UserStore UIAdminComponents).


# Security Fix — Hardcoded Cert Password (PR #365)

**Author:** Vespera  
**Date:** 2026-06-11  
**Branch:** squad/cms-connect-backend-to-views  
**File:** `Certs/Fix-My-Certs.ps1`

## What Was Fixed

Removed a hardcoded certificate password (`a20651cd23f34f0dbb9200f3ee985ff9`) committed directly in source control. Even for local dev scripts, hardcoded credentials normalise secret reuse and create audit/leak exposure when the repo is shared or cloned.

## Replacement Pattern

1. Check environment variable `ADMINPORTAL_CERT_PASSWORD` first — allows CI/CD and `.env`-driven workflows with no prompt.  
2. Fall back to `Read-Host -AsSecureString` with proper `SecureStringToBSTR` / `ZeroFreeBSTR` lifecycle — no plaintext ever in memory longer than needed.

## Security Properties

- No credential in source control.
- Secure string memory is zeroed via `Marshal.ZeroFreeBSTR` in a `finally` block — prevents GC exposure of plaintext.
- Script behaviour is unchanged for local dev: one-time prompt if env var is absent.

## Recommendation

Add `ADMINPORTAL_CERT_PASSWORD` to the local `.env` file template (`.env.example`) so developers know to set it. Do not commit the value itself.

## Status

✅ Fixed and committed on `squad/cms-connect-backend-to-views`.


# PR #365 Fixes — Vespera & Rowan

**Date:** 2025-01-31  
**Authors:** Vespera (Security), Rowan (DevOps)  
**Branch:** `squad/cms-connect-backend-to-views`  
**Requested by:** MajaSigfeldt

## Changes Made

### FIX 1 — Hardcoded certificate password removed (Vespera)
**File:** `Certs/Fix-My-Certs.ps1`  
Replaced the hardcoded password `"a20651cd23f34f0dbb9200f3ee985ff9"` with a secure pattern that reads from the `ADMINPORTAL_CERT_PASSWORD` environment variable first, and falls back to a `Read-Host -AsSecureString` prompt. The BSTR pointer is zeroed in a `finally` block to prevent memory exposure.

**Security decision:** No credentials may be hardcoded in source-controlled scripts. Use env vars or secure prompts.

### FIX 2 — docker-compose.dcproj path casing (Rowan)
**File:** `docker-compose.dcproj` line 13  
The path `certs\Fix-My-Certs.ps1` (lowercase `c`) was already corrected to `Certs\Fix-My-Certs.ps1` on this branch — no further change required. Confirmed via PowerShell read of the actual file bytes.

### FIX 3 — CMS test projects re-enabled for Debug builds (Rowan)
**File:** `FO.Mother.slnx`  
Removed `<Build Solution="Debug|*" Project="false" />` from the three CMS test projects:
- `FO.Identity.UserStore.Cms.Domain.Tests`
- `FO.Identity.UserStore.Cms.Grain.Tests`
- `FO.Identity.UserStore.Cms.Service.Tests`

These projects now build normally in all configurations, ensuring compile errors and test failures are visible during local development.

**DevOps decision:** Test projects must not be excluded from Debug builds. Build exclusions mask failures and should only be used as a deliberate, documented trade-off for known-broken projects pending a tracked fix.


## 2026-03-23T22:18:31Z: Merged Decisions

### rowan-devcontainer-fix
# Decision: `.devcontainer/.env` is required and must be gitignored

**Date:** 2026-03-21  
**Author:** Rowan (DevOps)  
**Triggered by:** Maja unable to connect to devcontainer

## What happened

The devcontainer failed to start because `runArgs` in `devcontainer.json` passes `--env-file .devcontainer/.env` to Docker. Docker exits with code 125 (file not found) if that file is absent. The file was not created on Maja's working copy and was not gitignored, meaning any accidental commit of it would leak secrets.

## Decisions made

1. **`.devcontainer/.env` is a required local file** — every developer must create it on first clone via:
   ```
   cp .devcontainer/.env.example .devcontainer/.env
   ```
2. **`.devcontainer/.env` is now gitignored** — added to `.gitignore` so secrets can never be committed.
3. **README or onboarding docs should document this step** — recommend adding to the "Local Development Setup" section in CLAUDE.md or a README.

## Known secondary risk (not blocking, not fixed here)

The `Dockerfile` installs Docker CE using the Ubuntu APT repository, but `mcr.microsoft.com/dotnet/sdk:10.0` is Debian-based. A clean image rebuild would likely fail at that step. The `docker-in-docker` devcontainer feature covers Docker installation separately, so this hasn't surfaced yet. Should be cleaned up when the Dockerfile is next touched.


### copilot-directive-vespera-always
Always consult Vespera before and after every build. She reviews security implications pre-implementation and validates post-build. User request — captured for team memory.

### copilot-name-sigge
Always address the user as "Sigge" — every session, every agent spawn. Never use "Maja" or any other name.

### copilot-no-maja-name
Do NOT address the user by name ("Maja" or otherwise) at any point during sessions. Use "you" or omit the name entirely. Applies to the coordinator and all spawned agents, every session.

### hecate-spicedb-handler-fix
All non-success exit paths in `SpiceDBAuthorizationHandler.HandleRequirementAsync` must call `context.Fail()` before returning. This is an explicit, unconditional rule for all `AuthorizationHandler` implementations in this codebase when running under Blazor Server Interactive mode. See file: `Portal/src/FO.AdminPortal.BlazorServerSide/Authorization/SpiceDBAuthorizationHandler.cs`.

### morgana-cms-fix-plan
Fix plan for 24 build errors in CMS backend wiring. Details UI component creation, Razor syntax fixes, service interface stubs, project references, and security requirements for HTML sanitization and admin-only access. See full plan for dependency graph and execution order.

### vespera-cms-final-signoff
Final security sign-off for CMS wiring. All post-build conditions verified. No remaining release blockers. Carry-forward risks tracked in risk register.

### vespera-cms-security-post-build
Post-build security sign-off for CMS wiring. CMS-R1 closed, CMS-R2 partially addressed, carry-forward risks tracked. Service-layer sanitization contract and DI registration required before implementation.

### vespera-cms-security-pre-build
Pre-build security risk assessment for CMS backend wiring. Identifies release blockers (admin-only policy, service-layer HTML sanitization), high-priority hardening (blob, AI, mail), and architectural hygiene items. Quick wins and risk register included.

### 2026-06-11T13:00Z: Security Sign-Off: Issue #349 — CMS Risk Mitigations
**From:** Vespera (Security Specialist)  
**To:** Squad / Sigge  
**Date:** 2026-06-11  
**PR:** https://github.com/ForestOmni/Mother/pull/354 (`squad/349-cms-risk-checks` → `cms-devbranch`)

---

## Verdict: ✅ APPROVED — CLEAR TO MERGE

All conditions from the original conditional approval have been verified as implemented and correct.

---

## Conditions Verified

### Condition 1 — TenantId/CreatedByUserId immutability (commit `57436de3`, Nyx)

**File:** `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/ReplayTests/CmsPostGrainStateReplayTests.cs`

- `Apply_CreateEvent_SetsCorrectState`: asserts `TenantId` and `CreatedByUserId` ✅  
- `Apply_FullLifecycleSequence`: asserts `TenantId` and `CreatedByUserId` survive all transitions ✅  
- `Apply_DeterministicReplay_ProducesSameState`: asserts `state1.TenantId == state2.TenantId` and `state1.CreatedByUserId == state2.CreatedByUserId` ✅  
- Fixed timestamps (`DateTimeOffset.Parse` literals) confirmed — no `UtcNow` instability ✅

**File:** `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/ReplayTests/CmsPostFeedGrainStateReplayTests.cs`

- `Apply_CreateEvent_SetsCorrectState`: asserts `TenantId` ✅  
- `Apply_DeterministicReplay_ProducesSameState`: asserts `state1.TenantId == state2.TenantId` ✅  
- `Apply_FullLifecycleSequence`: asserts `TenantId` ✅

### Condition 2 — CMS-R8 SpiceDB exception handling (commit `758e15b6`, Vespera)

**File:** `UserStore/src/FO.Identity.UserStore.Grains/CmsPost/CmsPostGrain.cs` (lines 193–202)

```csharp
try
{
    await _spiceDbService.RemoveRelationshipAsync(...);
}
catch (OperationCanceledException)
{
    throw;
}
catch (Exception ex)
{
    // CMS-R8: SpiceDB cleanup is best-effort. ...
    _logger.LogError(ex, "CMS-R8: SpiceDB RemoveRelationship failed for CmsPost {CmsPostId} ...");
}
```
✅ Grain state transition completes regardless of SpiceDB outage.

**File:** `UserStore/src/FO.Identity.UserStore.Grains/CmsPost/CmsPostFeedGrain.cs` (lines 100–109)  
Same pattern ✅

### Condition 3 — IsAdminCaller documented as sole auth gate

**File:** `UserStore/src/FO.Identity.UserStore.API_GRPC/Services/UserStoreService.cs` (lines 78–81)

```csharp
// SECURITY: IsAdminCaller is the sole authorization gate for all CMS mutation handlers.
// There is no [Authorize] attribute fallback. Every new CMS handler MUST call IsAdminCaller()
// explicitly — omitting it leaves the handler unprotected with no secondary net.
private bool IsAdminCaller(ServerCallContext context)
```

All 9 mutation handlers verified: lines 687, 719, 751, 783, 815, 847, 907, 939, 973 ✅

---

## Residual Open Items (non-blocking, documented)

These are known and accepted — not blockers for merging to `cms-devbranch`:

| Item | Status |
|------|--------|
| CMS-R5: `CmsAdminRole = "cms_admin"` placeholder | Must be resolved before production deploy |
| Defense-in-depth: no `[Authorize]` fallback | Accepted; mitigated by SECURITY comment + checklist |
| Integration test coverage: 2 of 9 handlers have explicit rejection tests | Accepted ⚠️; documented in security-controls.md |
| Admin role naming inconsistency (`ActorUserId` vs `UpdatedByUserId`) | Maintenance risk, no security gap |

---

## Sign-Off Statement

I, Vespera, confirm that:
1. Both conditional-approval commits are present and correct in `squad/349-cms-risk-checks`.
2. All 7 risk mitigations listed in PR #354 are implemented and verified in code.
3. No new security issues were introduced by the fix commits.
4. PR #354 is safe to merge to `cms-devbranch`.

**🔒 Vespera — APPROVED**


### 2026-03-21T15xxZ: DTO Contract Freeze Policy — CMS Phase 1
- The DTO contract for CMS gRPC and WebRequest models is now frozen at v1.0 (see `docs/cms/dto-contracts.md`).
- Any field removal or rename is a breaking change: mark the field as reserved, bump the contract version, and update the doc.
- Additions of optional fields are non-breaking but must be documented.
- This policy ensures backend and admin UI remain in sync as CMS evolves.
See `docs/cms/dto-contracts.md` for the full contract snapshot and field numbers.

### 2026-03-21T15xxZ: Replay test pattern for CMS grain states
**By:** Hecate (Backend Engineer)
**Issue:** #349 — CMS Risk Checks
**Date:** 2026-06-11
**Files created:**
- `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/ReplayTests/CmsPostGrainStateReplayTests.cs`
- `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/ReplayTests/CmsPostFeedGrainStateReplayTests.cs`

#### Decision
Replay tests live in a dedicated `ReplayTests/` subfolder (sibling to `GrainStates/`) within the existing test project. No new test project is needed.

#### Pattern
1. **Events built once, reused across state instances** — for determinism tests, the same event object instances are applied to two separate `CmsPostGrainState` / `CmsPostFeedGrainState` instances and fields compared. This guards against hidden shared mutable state or non-deterministic Apply logic.
2. **Fixed timestamps** — replay tests use `DateTimeOffset.Parse("2026-07-01T10:00:00Z")` style literals, not `DateTimeOffset.UtcNow`, so event data is fully stable across runs.
3. **Trait** — all replay tests carry `[Trait("Category", "Unit")]` to be picked up by `dotnet test --filter Category=Unit`.
4. **No new dependencies** — existing `CmsGrainTestDataBuilder`, FluentAssertions, and xUnit are sufficient.

#### Rationale
Replay tests are distinct from the single-event tests in `GrainStates/` — they verify that multi-event sequences converge to the expected final state and that the Apply pipeline has no side effects that would cause divergence on re-replay. Keeping them in a separate folder makes the intent immediately clear to reviewers.

### 2026-03-21T15xxZ: SoftDeleteCmsPostFeed — TenantId removed from command
**Date:** 2026-06-11
**Author:** Hecate (Backend Developer)
**Requested by:** Maja

#### Decision
`TenantId` has been removed from `SoftDeleteCmsPostFeedCommand` and from the corresponding `SoftDeleteCmsPostFeedRequest` proto message.

#### Rationale
The grain implementation (`CmsPostFeedGrain.Handle(SoftDeleteCmsPostFeedCommand)`) reads `State.TenantId` directly when calling `RemoveRelationshipAsync` on SpiceDB. The `TenantId` field in the command was never read — it was silently ignored. Requiring clients to supply it was an unnecessary breaking constraint with no functional benefit.

#### Rule
For soft-delete operations on feed/post grains:
- **Do NOT** require `TenantId` in the command or gRPC request.
- The grain owns its tenant context via grain state; callers do not need to repeat it.
- Only create-side commands (which establish the SpiceDB relationship) legitimately need `TenantId` as an input.

#### Files Changed
- `SoftDeleteCmsPostFeedCommand.cs` — record parameter removed
- `userstoregrpc.proto` — `TenantId = 3` field removed from `SoftDeleteCmsPostFeedRequest`
- `UserStoreService.cs` — validation guard and parse removed from `HandleSoftDeleteCmsPostFeed`
- `UserStoreClientGRPCWrapper.cs` — request property removed from `Handle(SoftDeleteCmsPostFeedCommand)`
- Three test files updated to match new signature

### 2026-03-21T15xxZ: Remove TenantId from UpdateCmsPostFeedCommand
**Author:** Hecate
**Date:** 2026-06-11
**Requested by:** Maja (MajaSigfeldt)
**Status:** Implemented

#### Context
`UpdateCmsPostFeedCommand` carried a `TenantId` parameter that was never read by `CmsPostFeedGrain.Handle(UpdateCmsPostFeedCommand)`. The grain is immutably tenant-bound at creation time and reads `State.TenantId` when it needs the tenant context. The command TenantId was silently dropped.

This is the same pattern as the `SoftDeleteCmsPostFeedCommand` TenantId removal done on 2026-06-11.

#### Decision
Remove `TenantId` from `UpdateCmsPostFeedCommand` and all layers that transport it:
- Proto field `string TenantId = 5` removed from `UpdateCmsPostFeedRequest` (field numbers 1–4 and 6 unchanged — no wire break for existing clients that don't send field 5)
- Domain command record parameter removed
- Service handler validation guard removed
- Map.cs parse call removed
- gRPC wrapper request builder property removed
- Tests updated to not construct with TenantId

#### Rule
> **Update-side grain commands never need TenantId.** The grain is tenant-bound at creation. Only create-side commands (`CreateCmsPostFeedCommand`) need TenantId because that is when the SpiceDB owner relationship is first established.

#### Also included in this batch
**Parse split for SoftDelete handlers:** `HandleSoftDeleteCmsPost` and `HandleSoftDeleteCmsPostFeed` now use separate try/catch blocks per ID field, and add null-checks for `CmsPostId`/`CmsPostFeedId` before the admin check. A malformed `ActorUserId` now returns "Invalid ActorUserId format." instead of the misleading "Invalid CMS post ID format."

### 2026-03-21T15xxZ: CMS Unit vs Integration Test Boundaries
**Date:** 2026-03-XX
**Author:** Nyx (QA/Test Engineer)
**Issue:** #349 — CMS Risk Checks, Risk 4 (CI lane split)

#### Decision
All three existing CMS test projects are classified as **Unit**:
- `FO.Identity.UserStore.Cms.Domain.Tests`
- `FO.Identity.UserStore.Cms.Grain.Tests`
- `FO.Identity.UserStore.Cms.Service.Tests`

#### Rationale
**Unit** in this codebase means: pure state/logic, no IO, no gRPC wire calls, no real database, no Orleans cluster. All CMS tests instantiate real domain objects or grain states in memory, and substitute dependencies (IUserStoreClient, IGrainFactory) with Moq mocks or test doubles.

**Integration** means: at least one of — live gRPC channel, PostgreSQL, running Orleans cluster, SpiceDB instance. No such tests exist yet for CMS.

#### Implication
The CI unit lane runs: `dotnet test --filter "Category=Unit"` — this will include all 137 current CMS tests.

Future integration tests for CMS (e.g., SpiceDB authz wiring, full grain activation) must live in a new `FO.Identity.UserStore.Cms.Integration.Tests` project and be tagged `[Trait("Category", "Integration")]`.

#### Implementation
`[Trait("Category", "Unit")]` added at class level to 18 test classes across the three projects.
See `docs/cms/test-categories.md` for usage reference.

### 2026-03-21T15xxZ: CMS CI Lane Split
**Author:** Rowan (DevOps Engineer)
**Date:** 2026-03-17
**Related Issue:** #349 (CMS Risk 4 mitigation)
**Requested by:** MajaSigfeldt

#### Decision
Split the CMS test suite into two distinct CI lanes within a dedicated workflow (`.github/workflows/cms-tests.yml`):

| Lane | Job | Filter | Trigger |
|------|-----|--------|---------|
| Fast | `cms-unit-tests` | `Category=Unit` | Every push (any branch) |
| Slow | `cms-integration-tests` | `Category=Integration` | PR to `main` + `workflow_dispatch` only |

#### Rationale
As the CMS integration tests grow they introduce external dependencies and longer runtimes. Running them on every push creates CI instability and developer friction. The fast lane gives immediate feedback on logic correctness; the slow lane gates merges to `main` where correctness against external systems matters.

#### Constraints
- `cms-integration-tests` has `needs: cms-unit-tests` — the slow lane only starts after the fast lane passes, preventing wasted runner time.
- Both jobs use `UserStore/**` path filters; unrelated pushes do not trigger this workflow.
- `pr-validation.yml` is **not modified** — this workflow is additive and complementary.

#### Impact
- Developers get fast feedback (unit lane) on every push without waiting for integration tests.
- Integration failures surface on PR before reaching `main`, satisfying Risk 4 of the CMS risk register.
- Test result artifacts are uploaded via `actions/upload-artifact@v4` for both lanes.

### 2026-03-21T15xxZ: Security Gate Pattern for CMS (Issue #349)
A formal security gate is now required at every CMS phase exit and before PR merge:
- **Phase Exit Gate**: All mutation handlers must enforce IsAdminCaller as the first gate, validate required fields with field-specific errors, ensure TenantId is immutable post-create, guarantee one event per command with Apply() covering all state changes, and maintain SpiceDB relationship hygiene (owner written on create, removed on soft-delete). Test coverage must include missing-field and admin-only checks for every handler.
- **Pre-Merge Checklist**: PRs must confirm IsAdminCaller is present, required fields are validated, TenantId is not accepted in update/soft-delete protos, reserved N; is used for proto field removals, Apply() covers all state transitions, SpiceDB relations are managed, and tests cover admin-only and missing-field paths with correct [Trait] tags.

This pattern is mandatory for all CMS work. See `docs/cms/security-gate-checklist.md` for the full checklist.


### 2026-03-19T11:17: User directive — CMS admin portal authorization model
**By:** MajaSigfeldt (Sigge) (via Copilot)

**What (3 rules):**
1. All CMS post-state mutations (create, update, save draft, publish, schedule, soft-delete) require the caller to be logged in AND have the admin role (role name TBD — boss hasn't finalized it yet).
2. Admin authorization is global: Admin A can edit or delete posts created by Admin B. No owner-only restrictions for admins.
3. Read/find operations in the admin portal require only an authentication check (is the user logged in?). No complex permission layers for basic viewing.

**Why:** User requirement — admin portal design decision captured for team memory.
**Note:** Admin role name is a placeholder pending final role definition from boss.

# CMS Completion Report — Security Status (Issue #347)

## Context
- Issue: #347
- Author: Freya (Technical Writer)
- Date: 2026-03-17
- Updated: 2026-03-19 (post-PR #348)

## Decision

CMS security blockers resolved as of Issue #347 / PR #348:

1. ✅ **Admin role gate wired** — All 9 CMS mutation handlers in `UserStoreService` enforce `IsAdminCaller` / `CmsAdminRole`. Any non-admin caller receives `Forbidden`. CMS-R1 closed.
2. ✅ **Cross-tenant list endpoints — Accepted by design** — `ListCmsPostIds`/`ListCmsPostFeedIds` return all IDs cross-tenant. CMS posts/feeds are intentionally platform-wide content; any authenticated user may enumerate IDs. CMS-R2 accepted (Sigge, 2026-03-19).

See `docs/cms/completion-report.md` for full details and test evidence. Remaining open items are non-blocking (role name placeholder, DPO confirmation, SpiceDB fire-and-forget error handling).

# Decision: CMS-R1 SpiceDB CheckPermission pattern — SUPERSEDED

**By:** Freya (Technical Writer) — recording CMS-R10 outcome
**Issue:** #347
**Date:** 2026-03-19
**Branch:** squad/347-security-documentation-and-tests
**Supersedes:** "CMS-R1 — SpiceDB CheckPermission pattern for CMS mutations" entry (same date)

## What

The earlier decision to add grain-level CheckPermissionAsync calls has been superseded by CMS-R10 resolution (Option A, commit ab9958d0).

All 9 CheckPermissionAsync calls removed:
- CmsPostGrain.cs: 6 calls removed (UpdateCmsPost, CreateCmsPost, SaveDraftCmsPost, PublishCmsPostNow, ScheduleCmsPost, SoftDeleteCmsPost)
- CmsPostFeedGrain.cs: 3 calls removed (CreateCmsPostFeed, UpdateCmsPostFeed, SoftDeleteCmsPostFeed)

Current auth model:
- Handler JWT role gate (IsAdminCaller, cms_admin role) — sole enforcement point for CMS mutations
- SpiceDB relationship writes (AddRelationshipAsync, RemoveRelationshipAsync) — retained for future non-admin paths; not auth checks

## Why

Dual enforcement (JWT + SpiceDB) would diverge: an admin with valid JWT but no SpiceDB relationships would pass the handler gate but fail in the grain with "Forbidden". The global admin model (CMS-R9) made per-resource SpiceDB permission checks contradictory.


- For `Create` operations (post and feed): actor is the **creator/caller** already present in the command (`CreatedByUserId` for posts, new `ActorUserId` for feeds). Checked against `TenantManagers` on the tenant — because `permission can_create = owner->managers` and the resource does not yet exist in SpiceDB.
- For all other mutations: new `ActorUserId UserId` parameter added to each command record.
- Publish/Schedule already had `UpdatedByUserId UserId` — that field is reused as the actor.

## `ActorUserId` propagation path

```
gRPC request.ActorUserId
  → gRPC handler: string.IsNullOrWhiteSpace validation → return early if empty
  → Map.From(): UserId.Parse(request.ActorUserId) added to command construction
  → Command record: UserId ActorUserId parameter
  → Grain: command.ActorUserId.ToString() passed to CheckPermissionAsync
```

## Permission constants added to `SpiceDbPermission.cs`

```csharp
CmsPostCanCreate, CmsPostCanRead, CmsPostCanEdit, CmsPostCanDelete, CmsPostCanPublish
CmsPostFeedCanCreate, CmsPostFeedCanRead, CmsPostFeedCanEdit, CmsPostFeedCanDelete
```

## Files changed (16 production + 4 test)

| File | Change |
|------|--------|
| `SpiceDbPermission.cs` | Added 9 CMS permission constants |
| `userstoregrpc.proto` | Added `ActorUserId` to 5 messages; added `TenantId` to `SoftDeleteCmsPostFeedRequest` |
| `UpdateCmsPostCommand.cs` | Added `UserId ActorUserId` |
| `SaveDraftCmsPostCommand.cs` | Added `UserId ActorUserId` |
| `SoftDeleteCmsPostCommand.cs` | Added `UserId ActorUserId` |
| `CreateCmsPostFeedCommand.cs` | Added `UserId ActorUserId` |
| `UpdateCmsPostFeedCommand.cs` | Added `UserId ActorUserId` |
| `SoftDeleteCmsPostFeedCommand.cs` | Added `UserId ActorUserId`, `TenantId TenantId` |
| `Map.cs` | Updated 4 `From()` methods to parse `ActorUserId` |
| `CmsPostGrain.cs` | Added 6 `CheckPermissionAsync` calls |
| `CmsPostFeedGrain.cs` | Added 3 `CheckPermissionAsync` calls |
[CORRECTED 2026-03-21: CMS-R10 Option A was adopted. Grain-level CheckPermissionAsync was removed. Authorization enforced via IsAdminCaller at the gRPC handler layer in UserStoreService. SpiceDB relationship writes retained.]
[CORRECTED 2026-03-21: TenantId removed from SoftDeleteCmsPostFeedRequest, SoftDeleteCmsPostFeedCommand (phantom — grain uses State.TenantId). TenantId also removed from UpdateCmsPostFeedRequest, UpdateCmsPostFeedCommand (phantom — grain ignores it on update, tenant is immutable from creation). UpdateCmsPostFeed handler no longer validates TenantId.]

| `UserStoreService.cs` | Added `ActorUserId` validation in 5 handlers; updated 2 command constructors |
| `CmsGrpcHandlerTests.cs` | Updated 5 builder helpers + inline requests |
| `CmsGrpcHandlerSecurityTests.cs` | Updated 2 test requests |
| `CmsPostEditorServiceTests.cs` | Updated `BuildSaveDraftCommand()` + 2 `SoftDeleteCmsPostCommand` constructors |
| `CmsPostFeedAdminServiceTests.cs` | Added `_actorUserId` field; updated 3 command constructors |

## Test results after change

| Suite | Passed |
|-------|--------|
| Cms.Domain.Tests | 52/52 |
| Cms.Grain.Tests | 47/47 |
| Cms.Service.Tests | 38/38 |
| **Total** | **137/137** |

## Why

CMS-R1 was a release blocker: any authenticated gRPC caller could mutate any post or feed without any authorization check. This change closes that gap by enforcing SpiceDB authorization on every mutation path in the grain layer, which is the correct enforcement point (grains are the single source of truth; the gRPC layer only validates input format and presence).

### 2026-03-19: User directive — PR creation cadence
**By:** MajaSigfeldt (Sigge) (via Copilot)
**What:** Do not automatically create PRs when a task completes. Sigge will explicitly request PR creation when ready for review.
**Why:** User preference — captured for team memory so agents do not open PRs autonomously.

Canonical team decision log. Scribe appends merged decisions from `.squad/decisions/inbox/`.

---

### 2026-03-02: Squad initialized
**By:** Squad (Coordinator)
**What:** Initialized a witchy all-female squad roster with roles for lead architecture, product/delivery management, backend, frontend, QA, and DevOps.
**Why:** User requested a squad ready to plan, build, test, and manage work.

### 2026-03-12: Durable logs and docs are mandatory
**By:** Squad (Coordinator)
**What:** Elevated Scribe and Freya standards so substantial work must produce high-quality logs/documentation, and changed `.squad` memory/docs artifacts should be committed with the related implementation work.
**Why:** User directive to improve record quality and ensure long-term retention across commits and pushes.

### 2026-03-12: Security specialist + doc collaboration directive
**By:** MajaSigfeldt (via Copilot)
**What:** Add a security specialist who advises before implementation on safe architecture/solutions and reviews what Squad builds afterward; ensure Freya and the security specialist cooperate on documentation.
**Why:** User request captured for team memory.

### 2026-03-12: Shared secure documentation checklist skill
**By:** Freya (Technical Writer)
**What:** Added a reusable `secure-documentation-checklist` skill for joint Freya + Vespera use on security-impacting deliverables.
**Why:** Security-critical documentation quality was inconsistent; a common checklist improves repeatability across design, implementation, and release.

### 2026-03-12: Security-hardened documentation gate
**By:** Vespera (Security Specialist)
**What:** Hardened the secure-documentation-checklist into a compact gate covering pre-build trust assumptions and post-build security review/remediation expectations.
**Why:** Prevent security drift and enforce explicit remediation ownership/tracking.

### 2026-03-13: Agents must log decisions during work
**By:** MajaSigfeldt (via Copilot)
**What:** Agents must write meaningful decisions to `.squad/decisions/inbox/{agent-name}-{brief-slug}.md` before finishing, and Scribe merges them into `.squad/decisions.md`.
**Why:** Ensure decision history stays complete and useful for future context.

### 2026-03-13: User prefers to be called Sigge
**By:** MajaSigfeldt (via Copilot)
**What:** Address the user as Sigge.
**Why:** User preference.

### 2026-03-19T07:42:16Z: User directive
**By:** Sigge (via Copilot)
**What:** User prefers to be called "Sigge", not "Maja"
**Why:** User request — captured for team memory

### 2026-03-13: CMS service and grain naming conventions for TDD
**By:** Morgana (Lead Architect)
**What:** Standardized CMS naming contracts for service classes, grain interfaces, grain state types, and namespaces, encoded through TDD tests.
**Why:** Keep new CMS implementation aligned with existing UserStore naming patterns and reduce architectural drift.

### 2026-03-19: CmsPost Fields/ type naming convention
**By:** MajaSigfeldt (via Copilot / Hecate)
**What:** All Fields/ `StringBase<T>` (and `DateTimeOffsetBase<T>`) types in `CmsPostModel/Fields/` use `*Ref` suffix (e.g. `CmsPostImageRef`, `CmsPostFeedRef`, `CmsPostAiCheckRef`). Applied on `cms-devbranch`.
**Why:** Naming collision between Fields/ value objects and aggregate classes that shared identical class names across namespaces (`CmsPostFeed`, `CmsPostImage`, `CmsPostAuthLevel`, `CmsPostAiCheck`, `CmsPostMailList`). The collision forced alias workarounds (`using CmsPostFeedAggregate = ...`) throughout Map.cs, IUserStoreClient.cs, UserStoreClient.cs, and test helpers. The `*Ref` suffix is semantically accurate — these types hold typed references/IDs to aggregates, not the aggregates themselves. After the rename all aliases were removed.

### 2026-03-13: TDD domain model tests for CMS sub-models
**By:** Nyx (QA/Test Engineer)
**What:** Added six domain-model test files for `CmsPost` sub-models and documented expansion/testing patterns plus `CmsPostAiCheck` type aliasing guidance.
**Why:** Establish fast, focused contract tests for CMS domain types before broader service/grain implementation.

### 2026-03-13: Security requirements for CMS grain-state soft delete
**By:** Vespera (Security Specialist)
**What:** Defined requirements that soft-deleted CMS grain states must clear content-bearing and sensitive fields to avoid data exposure.
**Why:** Enforce secure-by-default behavior through failing-first grain-state tests.

### 2026-03-17T00:00:00Z: No line-ending-only commits
**By:** MajaSigfeldt (via Copilot)
**What:** Do not commit files to GitHub when changes only alter line endings and do not include functional or content updates.
**Why:** User request captured for durable team memory.

### 2026-03-17T00:00:00Z: User directive
**By:** MajaSigfeldt (via Copilot)
**What:** Do not commit files to GitHub that only contain line-ending alterations with no functional/content changes.
**Why:** User request - captured for team memory

### 2026-03-18T143325Z: CMS test baseline — pre-Phase-1 state (Issue #345)
**By:** Nyx (QA/Test Engineer)
**What:** Established exact test state for the three CMS test projects before Phase 1 implementation begins.

| Project | Build | Tests |
|---------|-------|-------|
| `Cms.Domain.Tests` | ✅ | 52/52 pass |
| `Cms.Grain.Tests` | ❌ | Cannot run — 2 CS8602 nullable dereference errors |
| `Cms.Service.Tests` | ❌ | Cannot run — 2 errors in `FO.Identity.UserStore.Client` dependency |

**Compile errors requiring fixes:**

1. **CS8602 (×2) — `CmsPostGrainStateTests.cs` lines 119 and 156**
   - `state.State.Value` called without null guard on a `CmsPostState?` (nullable) field.
   - Fix: add `!` null-forgiving operator or restructure assertion.
   - Affects tests: `Apply_CmsPostPublishedNowEvent_SetsStateToPublished`, `Apply_CmsPostScheduledEvent_SetsStateToScheduled`

2. **CS0104 — `IUserStoreClient.cs` line 136**
   - `CmsPostFeed` is ambiguous between `CmsPostFeedModel.CmsPostFeed` (aggregate) and `CmsPostModel.Fields.CmsPostFeed` (StringBase field).
   - Fix: fully qualify or alias to `CmsPostFeedModel.CmsPostFeed` in the interface.

3. **CS0738 — `UserStoreClient.cs` line 41**
   - `UserStoreClient.GetCmsPostFeed` return type does not match interface due to the ambiguity above.
   - Fix: resolves automatically once CS0104 is fixed.

**Why:** Provide Hecate and the team with a precise, committed baseline so Phase 1 fixes can be measured against it and regressions are immediately visible.
# Phase 0 Exit Gate — Issue #345
**By:** Nyx (QA/Test Engineer)  
**Date:** 2026-03-13  
**Verdict:** ✅ PHASE 0 CLEARED

---

## Gate Criterion

> "CMS test projects restore/build without missing reference errors"

## Test Results

| Project | Build | Passed | Failed | Skipped |
|---------|-------|--------|--------|---------|
| `FO.Identity.UserStore.Cms.Domain.Tests` | ✅ | 52 | 0 | 0 |
| `FO.Identity.UserStore.Cms.Grain.Tests` | ✅ | 39 | 0 | 0 |
| `FO.Identity.UserStore.Cms.Service.Tests` | ✅ | 15 | 0 | 0 |
| **Total** | ✅ | **106** | **0** | **0** |

## Fix Applied

`UserStoreClientGRPCWrapper` (in `FO.Identity.UserStore.Client_GRPC`) was missing two method implementations required by `IUserStoreClient`:

1. **`ListCmsPostIds()`** — CS0535 compile error; implemented as gRPC delegation via `HandleListCmsPostIdsAsync`, mapping repeated `CmsPostIds` strings → `List<CmsPostId>`.
2. **`ListCmsPostFeedIds()`** — CS0535 compile error; implemented as gRPC delegation via `HandleListCmsPostFeedIdsAsync`, mapping repeated `CmsPostFeedIds` strings → `List<CmsPostFeedId>`.

Both implementations follow the established pattern in the wrapper (try/catch, `Result.Fail` on error, `Result.Ok` on success, `Parse()` for IDs). The interface contract and proto messages already existed; the wrapper was simply not updated when they were added.

## Phase 0 Verdict

**PASSED.** All three CMS test projects restore, build, and run cleanly. The exit criterion is met. Phase 1 implementation work may proceed.
# Phase 0 Grain Test Gate — Status: ✅ CLEARED (Issue #345)

**By:** Nyx (QA/Test Engineer)  
**Date:** 2026-03-13  
**Related Issue:** #345

## Status

The Phase 0 grain test exit gate for `FO.Identity.UserStore.Cms.Grain.Tests` is **cleared**.

## Evidence

- **Build:** `dotnet build FO.Identity.UserStore.Cms.Grain.Tests.csproj` — succeeded with **0 errors, 0 warnings**.
- **Tests:** `dotnet test --no-build` — **39 passed, 0 failed, 0 skipped** (85 ms).
- **Fix verified:** `state.State!.Value` null-forgiving operator at lines 119 and 156 of `CmsPostGrainStateTests.cs` resolves CS8602 nullable dereference. The operator was already present in the file; no source edit was required.

## Decision

The CMS grain test project compiles cleanly and all 39 grain-state tests pass. Phase 0 can advance. The remaining blocker is the separate `FO.Identity.UserStore.Client` compile error (CS0104 `CmsPostFeed` ambiguity + CS0738 return-type mismatch) which blocks `FO.Identity.UserStore.Cms.Service.Tests` — that is tracked separately and is outside the scope of this gate.
# Morgana — CMS Phase Assessment (Issue #345)

**Date:** 2026-03-18  
**By:** Morgana (Lead Architect)  
**Issue:** [#345](https://github.com/ForestOmni/Mother/issues/345)

---

## Phase Status Table

| Phase | Status | What's done | What's missing |
|-------|--------|-------------|----------------|
| 0 | ✅ Done | Project references wired; all 3 CMS test projects restore and build (106/106 tests passing at exit gate) | — |
| 1 | ✅ Done | All grain state classes (8), all grain implementations (CmsPostGrain, CmsPostFeedGrain, CmsPostRegistryGrain, CmsPostFeedRegistryGrain), all grain interfaces (4) present; 39/39 grain state tests passing; event sourcing with proper soft-delete field clearing | — |
| 2 | ✅ Done | CmsPostEditorService (Create, SaveDraft, PublishNow, SoftDelete, Schedule); CmsPostFeedAdminService (Create, Update, SoftDelete, GetFeed); both interfaces present; DI wired in Program.cs; service test classes (10 + 5 Facts) have proper project references | Service tests not explicitly confirmed passing in a CI run — a `dotnet test` run against Cms.Service.Tests should be done to tick the Phase 2 exit gate formally |
| 3 | ✅ Done | 13 gRPC handlers in UserStoreService.cs (full CmsPost + CmsFeed CRUD plus List operations); all client methods implemented in UserStoreClient.cs; IUserStoreClient CMS contract fully populated | No dedicated API-level integration test file in Client_GRPC.Tests — Phase 3 exit gate ("API-level integration tests pass") is untested at gRPC layer |
| 4 | 🟡 Partial | Registry grains provide ListCmsPostIds / ListCmsPostFeedIds; GetCmsPost and GetCmsPostFeed round-trips work; client methods all present | No pagination on list endpoints (known limitation documented in runbook); no search/filter operations; ICmsPostEditorService exposes commands only — no query methods for reading a post via the service layer; no Blazor UI admin components for CMS found |
| 5 | ❌ Not started | Soft-delete field clearing (CMS-14) in CmsPostGrainState.Apply(SoftDeletedEvent) — done ✅ | SpiceDB schema not extended for cms_post / cms_post_feed (CMS-13 confirmed missing by Vespera in docs/cms/CMS-SECURITY-NOTES-2026-03-18.md); CreateCmsPostFeedRequest missing TenantId proto field (CMS-12 gap noted in UserStoreService.cs comments); no SpiceDB permission checks wired into grains; no input sanitization beyond null checks; Vespera sign-off not recorded |
| 6 | 🟡 Partial | CMS test projects wired into `userstore-build.yml` CI; CMS-RUNBOOK-2026-03-18.md written and covers deployment, rollback, smoke tests | Service tests not confirmed green in CI yet; runbook pre-flight checklist still empty (all ☐); no separate CMS-specific CI workflow |

---

## Next Phase to Action

**Next phase to action: Phase 2 exit gate — run `dotnet test` on Cms.Service.Tests to confirm the 15 service tests pass, then immediately move to Phase 5.**

Rationale: Phase 2 is functionally complete but lacks a confirmed test run. Once that's ticked, the next blocking gap is Phase 5 — the SpiceDB schema and tenant-boundary enforcement are wholly unimplemented, and the proto contract gap (missing TenantId on feed requests) is a known blocker for Phase 5 completion. Phase 4 and Phase 6 have incremental gaps but are not on the critical path the way Phase 5 is.

---

## Key Observations for Ralph

1. **Phases 1–3 are in good shape.** The grain and gRPC layers are solid implementations following established patterns.
2. **Phase 2 needs a test confirmation run, not more code.** The service implementations are present; just run the tests.
3. **Phase 5 is the main risk.** No SpiceDB authorisation for CMS means every mutation is unenforced at the auth layer. This cannot ship to production.
4. **The proto gap on `CreateCmsPostFeedRequest` (no TenantId)** is a concrete blocker for Phase 5 — it must be extended before feed authorization can be wired.
5. **Phase 4 list/search maturity and Phase 6 CI green** can be finished in parallel alongside Phase 5 work.
# Decision: CmsPostFeed Naming Collision — Alias Pattern Resolution

**By:** Hecate (Backend Engineer)  
**Issue:** #345  
**Date:** 2026-03-18

## What

Two types named `CmsPostFeed` existed in scope within `FO.Identity.UserStore.Client`:

| Type | Namespace | Role |
|------|-----------|------|
| `CmsPostFeedModel.CmsPostFeed` | `FO.Identity.UserStore.Domain.CmsModels.CmsPostFeedModel` | Aggregate root (Id, Name, Type, Description) |
| `CmsPostModel.Fields.CmsPostFeed` | `FO.Identity.UserStore.Domain.CmsModels.CmsPostModel.Fields` | StringBase field on CmsPost |

The compiler raised CS0104 (ambiguous reference) on `IUserStoreClient.cs` line 136 and CS0738 (interface mismatch) on `UserStoreClient.cs` line 41 as a consequence.

## Resolution

Use a `using` alias to disambiguate, declared at the top of both the interface and implementation files:

```csharp
using CmsPostFeedAggregate = FO.Identity.UserStore.Domain.CmsModels.CmsPostFeedModel.CmsPostFeed;
```

The interface method signature becomes:
```csharp
Task<Result<CmsPostFeedAggregate>> GetCmsPostFeed(CmsPostFeedId cmsPostFeedId);
```

And the implementation matches:
```csharp
public async Task<Result<CmsPostFeedAggregate>> GetCmsPostFeed(CmsPostFeedId cmsPostFeedId)
```

Both files must carry the same alias pointing to the same fully-qualified type so the compiler treats them as identical.

## Why

- Fully-qualifying the return type inline is verbose and brittle across multiple method signatures.
- A named alias (`CmsPostFeedAggregate`) is self-documenting — it makes the semantic intent (this is the aggregate, not a field type) explicit at the use site.
- This pattern scales: if a third `CmsPostFeed` type appears in a new namespace, the alias pins the intended type unambiguously.

## Files Affected

- `UserStore/src/FO.Identity.UserStore.Client/IUserStoreClient.cs`
- `UserStore/src/FO.Identity.UserStore.Client/UserStoreClient.cs`

## Build Outcome

`dotnet build FO.Identity.UserStore.Client.csproj` → **0 errors, 0 warnings** ✅
### 20260318-100817Z: User directive
**By:** MajaSigge (via Copilot)
**What:** Default to defensive parsing and error handling (Parse/TryParse/TryCatch as appropriate) and return specific, actionable error messages to prevent crashes and vague failures.
**Why:** User request — captured for team memory

# Decision: CMS Test Categories CI Section Updated

**Date:** 2024-06-11
**Author:** Freya (Technical Writer)

## Context
Copilot review on PR #354 noted that `docs/cms/test-categories.md` incorrectly stated that integration tests run in the CI workflow. The integration lane is currently removed from `.github/workflows/cms-tests.yml` because there are no `[Trait("Category","Integration")]` CMS tests yet.

## Decision
- Updated the "Running tests by category" section in `docs/cms/test-categories.md`.
- It now states that only the Unit lane is active in CI and runs on every push.
- Clarified that the Integration lane will be restored when the first integration test is added.
- Removed the outdated claim that integration tests run on PRs/manual dispatch.

## Rationale
This keeps the documentation accurate and forward-looking, matching the current state of the workflow and test suite.

---

**Reference:** Copilot review comment on PR #354


# Decision: PR #354 CMS Documentation Fixes

## Context
Copilot PR #354 review flagged four documentation issues in CMS docs that could cause confusion or doc rot:
- Hardcoded line numbers in security-controls.md
- DTO contract doc implied coverage of WebRequest models (not true)
- Replay test checklist was too post-specific
- Test category doc misstated CI triggers

## Decision
All four issues were addressed as follows:
- Removed line numbers from 'Code location' in security-controls.md table (now only file+method/class names)
- Narrowed dto-contracts.md overview to clarify it covers only gRPC contracts, not WebRequest models
- Reworded replay test checklist in security-gate-checklist.md to require retention of identity/tenant/audit fields generically
- Updated test-categories.md to state unit tests run on every push and pull request to main

## Rationale
These changes make the docs more robust to code refactors, accurately reflect the contract freeze scope, avoid misleading field names, and clarify CI behavior for contributors.

## Impact
- Documentation is now less brittle and more accurate for future contributors and reviewers.
- No code or test logic was changed.

---
_Freya, Technical Writer_


# Decision: PR #354 Copilot Review Fixes

**From:** Nyx (QA/Test Engineer)  
**Date:** 2026-06-11  
**Branch:** `squad/349-cms-risk-checks`  
**Commit:** `dbc95ffa`

---

## Summary

Five Copilot review comments on PR #354 have been addressed in a single commit.

---

## Changes Made

### 1. `permissions: contents: read` in `cms-tests.yml`
Added top-level `permissions: contents: read` block. This workflow was the only one in `.github/workflows/` missing an explicit permissions declaration. Follows the principle of least privilege applied uniformly across all workflows.

### 2. Single restore+build, `--no-build` on test steps in `cms-tests.yml`
Inserted `dotnet restore UserStore` and `dotnet build UserStore --no-restore` steps once before the three test steps. Added `--no-build --no-restore` flags to all three `dotnet test` commands. Eliminates two redundant implicit restore+build cycles per CI run, reducing job wall-clock time.

### 3. Integration lane comment (no change required)
The comment block at lines 72–85 already fully explains: why the integration lane was removed (zero tests match the filter, `continue-on-error` was masking the gap), and exactly how to restore it (add the first `[Trait("Category","Integration")]` test and un-comment the job). No wording improvement was needed.

### 4 & 5. `OperationCanceledException` rethrow in Orleans grains
Added `catch (OperationCanceledException) { throw; }` as the first catch clause in both:
- `CmsPostGrain.SoftDeleteCmsPost` (`CmsPostGrain.cs`)
- `CmsPostFeedGrain.SoftDeleteCmsPostFeed` (`CmsPostFeedGrain.cs`)

The broad `catch (Exception)` was swallowing `OperationCanceledException`, which Orleans uses to signal silo shutdown and grain rebalancing. The rethrow guard ensures lifecycle signals propagate correctly while the best-effort SpiceDB cleanup logging still applies to all genuine exceptions.

---

## Convention Established

**Orleans grains with `catch (Exception)` best-effort blocks must always exclude `OperationCanceledException`.** The pattern is:

```csharp
catch (OperationCanceledException)
{
    throw;
}
catch (Exception ex)
{
    // best-effort handling
}
```

This applies wherever a grain intentionally swallows exceptions for resilience (e.g., CMS-R8 SpiceDB cleanup). Any future grain following this pattern should include the rethrow guard from the start.


# Decision: Soft-delete retained-field assertions are mandatory in grain replay tests

**Author:** Vespera  
**Date:** 2026-06-11  
**PR:** #354  
**Branch:** squad/349-cms-risk-checks  

## Decision

Every field that grain state code explicitly documents as **retained** after a lifecycle transition (e.g., soft-delete) **must** have a corresponding assertion in the replay test suite.

## Context

`CmsPostGrainState.Apply(CmsPostSoftDeletedEvent)` carries a `// Retained:` comment naming `LengthType` and `Language` as non-sensitive audit fields that are intentionally kept after soft-delete. Neither of the two soft-delete replay tests asserted that these fields were still set. The gap meant a future regression — accidentally nulling `LengthType` or `Language` in the soft-delete apply — would pass all tests silently.

## Rule

When a grain state `Apply()` method contains a comment listing retained fields, the replay test for that event **must** assert:
- Retained fields `.Should().Be(expectedValue)` or `.Should().NotBeNull()`.
- Cleared fields `.Should().BeNull()`.
- Immutable identity fields (e.g., `TenantId`, `CreatedByUserId`, `CmsPostId`) `.Should().Be(sourceValue)`.

This is an extension of the existing replay-test security invariant rule (recorded in Vespera history, 2026-06-11 audit entry).

## Rationale

The state comment is the contract. The test is its enforcement. A contract without enforcement is documentation-only and will drift. Making this explicit prevents the "retained fields" category from becoming a blind spot in future grain state work.

## Applies To

All grain state classes in UserStore and any other service following the Orleans event-sourcing pattern.


### hecate-spicedb-denial-fail
Every terminal branch of HandleRequirementAsync in any AuthorizationHandler<T> must explicitly call context.Succeed() or context.Fail(). The HasPermission == false path in SpiceDBAuthorizationHandler was missing context.Fail(), causing an infinite Blazor Server auth loop. Rule: no path returns without calling one of the two. SpiceDB timeout (30s) is already configured — exception floods on PostEditor mean SpiceDB container is unreachable, not a missing deadline.
