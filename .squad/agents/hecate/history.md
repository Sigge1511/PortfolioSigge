# Project Context

2026-03-23T14:23: Wired CMS gRPC client services, nav, and HtmlSanitizer. See orchestration-log/2026-03-23T14-23-hecate.md.

- **Owner:** MajaSigfeldt
- **Project:** Witchy female squad bootstrap
- **Stack:** TBD
- **Created:** 2026-03-02T15:53:08Z

## Learnings

### 2026-06-XX: CMS posts feed "not found" error — CmsPostDisplayTest page

**Error seen by user:** "Flödet 'AdminTestDisplayPage' hittades inte" (Feed not found). Triggered on `/admin/userstore/cms/display-test`.

**Root cause:** `CmsPostFeedSeedingService` has a brittle `isNotFound` guard that checks error messages for "not found" or "does not exist" before proceeding to seed. When any transient error occurs at startup (Azurite not yet ready, storage access failure), `CmsPostFeedAdminService.Execute` catches the exception and returns `Result.Fail("CMS feed read failed")` — which does NOT match either pattern. The seeder silently skips, no feed is ever created.

**Contributing factor:** `fo.identity.userstore.silo.azurestorage` Azurite has no healthcheck in `docker-compose.yml`, so UserStore's `depends_on` only waits for Azurite to start — not for it to be ready for storage requests.

**Fix location:** `UserStore/src/FO.Identity.UserStore.Infrastructure/Seeding/CmsPostFeedSeedingService.cs` — remove the `isNotFound` pattern-match guard. Always attempt `CreateFeedAsync`; treat "wrong lifecycle state" result as "already exists" and log info. This makes seeding idempotent and resilient to transient startup errors.

### 2026-03-24: CMS blob storage service design
- `ICmsBlobStorageService` defined with 4 methods following the FileStore 3-step upload pattern: `PrepareImageUploadAsync` (register + get SAS URL) → `ConfirmImageUploadAsync` → `GetImageUrlAsync` + `DeleteImageAsync`.
- `CmsBlobUploadContext` record (`FileId`, `UploadUrl`) lives in the same file as the interface, in `FO.Identity.UserStore.Domain.Cms.Services` namespace.
- `CmsBlobStorageStubService` updated to implement all 4 methods with `NotImplementedException` bodies; pre-existing security notes and TODO preserved.
- Decision written to `.squad/decisions/inbox/hecate-blob-service-pattern.md`.

### 2026-06-12: PR #365 — Auth middleware and slnx build exclusion fixes
- `app.UseAuthentication()` and `app.UseAuthorization()` must come **after** `UseStaticFiles()` and **before** `UseAntiforgery()` in the Blazor Server pipeline. Missing them means `[Authorize]` attributes and policy evaluation are completely bypassed.
- In `.slnx` solution files, `<Build Solution="Debug|*" Project="false" />` on a test project hides compile/test failures during local Debug builds. Remove the child element entirely to keep test projects always-buildable.
- Both fixes were already committed on branch `squad/cms-connect-backend-to-views`; verified correct state and confirmed clean build (0 errors, 2 pre-existing warnings unrelated to these changes).

### 2026-03-21T15xxZ: Issue #349 — CMS risk checks
- Authored replay/determinism tests (CmsPostGrainStateReplayTests.cs, CmsPostFeedGrainStateReplayTests.cs) for CMS grains, following the new replay test pattern (fixed events, determinism, [Trait("Category", "Unit")]).
- Removed TenantId from SoftDeleteCmsPostFeedCommand and UpdateCmsPostFeedCommand, updating all layers and tests. Pattern: update/soft-delete commands never require TenantId; only create commands do.
- All changes merged to squad/349-cms-risk-checks, decisions.md updated, inbox cleared.


- Initial team seeded for backend implementation work.

### 2026-06-11: Issue #349 — CMS Risk 1 mitigation: replay tests

Created two new test files under `UserStore/test/FO.Identity.UserStore.Cms.Grain.Tests/ReplayTests/`:

- `CmsPostGrainStateReplayTests.cs` — 4 tests covering full lifecycle sequence (Created→Updated→Published→SoftDeleted), short sequence (Created→SoftDeleted), multiple updates last-wins, and determinism (same events applied to two fresh states yield identical field values).
- `CmsPostFeedGrainStateReplayTests.cs` — 2 tests covering full lifecycle (Created→Updated→SoftDeleted) and determinism replay.

**Pattern used:**
- All tests are `[Fact]` with `[Trait("Category", "Unit")]`, following the same xUnit/FluentAssertions style as existing `GrainStates/` tests.
- Events are built once from `CmsGrainTestDataBuilder` and fixed inline values; the same event instances are applied to multiple `CmsPostGrainState` / `CmsPostFeedGrainState` instances for the determinism assertions.
- Fixed `DateTimeOffset.Parse(...)` values used in replay tests to keep timestamps deterministic (no `UtcNow` in event construction).
- The `Apply()` methods return `this`, allowing chaining — exploited in determinism tests for compactness.
- No new dependencies or project changes needed; no test helper modifications required.

**Build result:** `dotnet build FO.Identity.UserStore.Cms.Grain.Tests.csproj` → Build succeeded, 0 errors.

### 2026-06-11: Fix 1+2 — SoftDelete parse split; Fix 3 — UpdateCmsPostFeed TenantId removed

**Fix 1 & 2 — Split parsing in SoftDelete handlers:**
`HandleSoftDeleteCmsPost` and `HandleSoftDeleteCmsPostFeed` previously used a single try/catch wrapping both `CmsPostId.Parse` and `UserId.Parse`. A malformed `ActorUserId` would produce "Invalid CMS post ID format." — a misleading message. Also, there were no null-checks for `CmsPostId`/`CmsPostFeedId`, so an empty string could reach the parser.

**Pattern applied:**
1. Add `string.IsNullOrWhiteSpace(request.CmsPostId/CmsPostFeedId)` guard before the admin check.
2. Replace the single try/catch with two separate try/catch blocks — one for each ID parse — each returning a message specific to that field.

**Fix 3 — TenantId removed from UpdateCmsPostFeedCommand:**
Same pattern as the SoftDeleteCmsPostFeed TenantId removal (2026-06-11). `CmsPostFeedGrain.Handle(UpdateCmsPostFeedCommand)` never reads `command.TenantId` — the grain is immutably tenant-bound at creation and reads TenantId from `State`. Transporting TenantId in the command was wasted wire bytes and an unnecessary constraint on callers.

**Files changed (7):**
1. `UpdateCmsPostFeedCommand.cs` — Removed `TenantId TenantId` parameter
2. `userstoregrpc.proto` — Removed `string TenantId = 5` from `UpdateCmsPostFeedRequest` (field 6 `ActorUserId` kept as-is — proto field numbers are stable)
3. `UserStoreService.cs` — Removed TenantId validation guard from `HandleUpdateCmsPostFeed`; split parse blocks in both `HandleSoftDeleteCmsPost` and `HandleSoftDeleteCmsPostFeed`; added CmsPostId/CmsPostFeedId null guards
4. `Map.cs` (API_GRPC) — Removed `TenantId.Parse(request.TenantId)` from `From(UpdateCmsPostFeedRequest)`
5. `UserStoreClientGRPCWrapper.cs` — Removed `TenantId = command.TenantId.ToString()` from request builder
6. `CmsPostFeedAdminServiceTests.cs` — Removed `_tenantId` from `BuildUpdateCommand()`
7. `CmsGrpcHandlerTests.cs` — Removed `TenantId` from `BuildValidUpdateCmsPostFeedRequest()`; `CmsGrpcHandlerSecurityTests.cs` — Removed two TenantId validation tests

**Build result:** Domain, API_GRPC, Client_GRPC, Cms.Service.Tests → 0 errors, 0 warnings.

**Pattern reinforcement:** For update-side grain handlers (not create), never require TenantId in the command. The grain already knows its tenant from State. Only create-side commands need TenantId in the command because that's when the tenant relationship is first established.

### 2026-06-11: SoftDeleteCmsPostFeed — TenantId removed from command (Maja request)

**Issue:** `SoftDeleteCmsPostFeedCommand` had a `TenantId` parameter that was never used by the grain. `CmsPostFeedGrain.Handle(SoftDeleteCmsPostFeedCommand)` reads `State.TenantId` for the SpiceDB `RemoveRelationshipAsync` call — it ignores any TenantId passed in the command. Requiring it in the command was an unnecessary breaking change for clients.

**Files changed (7):**
1. `SoftDeleteCmsPostFeedCommand.cs` — Removed `TenantId TenantId` parameter
2. `userstoregrpc.proto` — Removed `string TenantId = 3` from `SoftDeleteCmsPostFeedRequest`
3. `UserStoreService.cs` — Removed `TenantId` validation guard and `TenantId.Parse(request.TenantId)` from command constructor
4. `UserStoreClientGRPCWrapper.cs` — Removed `TenantId = command.TenantId.ToString()` from request builder
5. `CmsPostFeedAdminServiceTests.cs` — Removed `_tenantId` from `SoftDeleteCmsPostFeedCommand` constructor call
6. `CmsGrpcHandlerTests.cs` — Removed `TenantId = TenantId.Create().ToString()` from `SoftDeleteCmsPostFeedRequest`
7. `CmsGrpcHandlerSecurityTests.cs` — Removed `TenantId = TenantId.Create().ToString()` from `SoftDeleteCmsPostFeedRequest`, updated comment

**Build result:** All 4 projects (Domain, Client_GRPC, API_GRPC, Cms.Service.Tests) → 0 errors, 0 warnings.

**Pattern to remember:** For soft-delete handlers on PostFeed grains, the grain always reads TenantId from `State` (not the command) because the grain knows its own tenant. Only commands that _create_ a relationship need TenantId in the command. Delete-side handlers should never require TenantId from callers.

### 2026-03-19: Proto field mismatch fix — HandlePublishCmsPostNow (PR #348, review comment r2960152218)

**Issue:** `HandlePublishCmsPostNow` in `UserStoreService.cs` (line 778-779) validated `request.ActorUserId`, but `PublishCmsPostNowRequest` in the proto only defines `CmsPostId`, `UpdatedByUserId`, and `PublishedAt` — no `ActorUserId` field.

**Fix:** Changed validation to `request.UpdatedByUserId` with matching error message `"UpdatedByUserId is required."`.

**Proto location:** `UserStore/src/FO.Identity.UserStore.GRPC_Contract/Protos/userstoregrpc.proto` (not `API_GRPC/Protos/` — the contract lives in the GRPC_Contract project).

**Build result:** 0 errors, 0 warnings after fix.

### Debug build exclusions removed from FO.Mother.slnx

Three UserStore projects had `<Build Solution="Debug|Any CPU" Project="false" />` entries in `FO.Mother.slnx`, causing them to be skipped in Debug builds. These were temporary exclusions that have since served their purpose.

**Projects restored to normal Debug build:**
- `UserStore/src/FO.Identity.UserStore.Domain/FO.Identity.UserStore.Domain.csproj`
- `UserStore/src/FO.Identity.UserStore.Grains/FO.Identity.UserStore.Grains.csproj`
- `UserStore/src/FO.Identity.UserStore.Service.UIComponents/FO.Identity.UserStore.Service.UIComponents.csproj`

**Where exclusions live:** Only in `FO.Mother.slnx` as `<Build>` child elements on `<Project>` nodes. No exclusions were found in individual `.csproj` files, `Directory.Build.props`, or `Directory.Build.targets`. The `.csproj` files have a standard `Debug|AnyCPU` PropertyGroup with only `TreatWarningsAsErrors` — no suppression.

**Pattern to remember:** In `.slnx` format, `<Build Solution="Debug|Any CPU" Project="false" />` inside a `<Project>` node disables that project for the named solution configuration. Removing the child element entirely restores normal build participation.

### 2026-03-19: CMS admin-role authorization model (Issue #347, supersedes SpiceDB gate)

**What was done:**
Replaced SpiceDB `CheckPermissionAsync` gates in all 9 CMS mutation handlers with an admin role check (`IsAdminCaller`) in `UserStoreService`. Admin A can edit/delete posts from Admin B — global admin, no owner-only restrictions. Read handlers remain ungated (JWT auth at gRPC endpoint is sufficient).

**Pattern:**
- `private const string CmsAdminRole = "cms_admin";` — placeholder, update when boss confirms role name
- `protected virtual ClaimsPrincipal? GetCallerPrincipal(ServerCallContext context)` — virtual so tests override it without needing ASP.NET HttpContext infrastructure
- `private bool IsAdminCaller(ServerCallContext context)` — calls `GetCallerPrincipal` and checks `IsInRole(CmsAdminRole)`
- `try { return context.GetHttpContext()?.User; } catch (InvalidOperationException) { return null; }` — the try-catch is needed because `GetHttpContext()` throws (not returns null) when called on non-ASP.NET Core contexts (e.g., in tests)

**Testability pattern:**
Tests subclass `UserStoreService` and override `GetCallerPrincipal` to return a `ClaimsPrincipal` with the right role. No need for `DefaultHttpContext` or `IHttpContextServerCallContext` infrastructure in unit tests. Both `CmsGrpcHandlerTests` and `CmsGrpcHandlerSecurityTests` use `AdminUserStoreService` nested class for admin-path tests.

**SpiceDB note:** Relationship writes/removals are retained on create and soft-delete (for future non-admin contexts). Only the `CheckPermissionAsync` calls are absent from the admin portal handlers.

**Tests:** 44 CMS service tests pass (was 38).

### 2026-03-19: CMS-R1 resolved — SpiceDB permission checks wired (Issue #347)

**What was done:**
All CMS mutation handlers in `CmsPostGrain`, `CmsPostFeedGrain`, and `UserStoreService` now call `CheckPermissionAsync` before any state change.

**Permission check pattern used (from `SpiceDbService`):**
```csharp
var allowed = await _spiceDbService.CheckPermissionAsync(
    resourceType, resourceId,
    permission,
    SpiceDbObject.User, actorUserId);
if (!allowed)
    return Result.Fail("Forbidden");
```

**Placement:** Permission check runs **after** the lifecycle guard and **before** the event raise. This avoids redundant SpiceDB calls on invalid states while ensuring no unauthorized mutations can proceed.

**Check matrix:**
| Operation | Resource | Permission | Actor source |
|-----------|----------|------------|--------------|
| CreateCmsPost | `tenant` / TenantId | `managers` | command.CreatedByUserId |
| UpdateCmsPost / SaveDraft | `cms_post` / State.CmsPostId | `can_edit` | command.ActorUserId (new) |
| PublishCmsPostNow / Schedule | `cms_post` / State.CmsPostId | `can_publish` | command.UpdatedByUserId |
| SoftDeleteCmsPost | `cms_post` / State.CmsPostId | `can_delete` | command.ActorUserId (new) |
| CreateCmsPostFeed | `tenant` / TenantId | `managers` | command.ActorUserId (new) |
| UpdateCmsPostFeed | `cms_post_feed` / State.CmsPostFeedId | `can_edit` | command.ActorUserId (new) |
| SoftDeleteCmsPostFeed | `cms_post_feed` / State.CmsPostFeedId | `can_delete` | command.ActorUserId (new) |

**Proto field numbers assigned:**
- `UpdateCmsPostRequest.ActorUserId = 12`
- `SaveDraftCmsPostRequest.ActorUserId = 12`
- `SoftDeleteCmsPostRequest.ActorUserId = 2`
- `CreateCmsPostFeedRequest.ActorUserId = 6`
- `UpdateCmsPostFeedRequest.ActorUserId = 6`
- `SoftDeleteCmsPostFeedRequest.ActorUserId = 2`, `TenantId = 3`

**gRPC handler validation order:**
- Create/Update Feed: TenantId first (preserves existing behaviour), then ActorUserId
- SoftDelete endpoints: ActorUserId first (no pre-existing checks)

**Tests:** 137 CMS tests pass (52 domain, 47 grain state, 38 service/gRPC handler). No pre-existing tests broke; 16 test call sites updated to supply the new `ActorUserId` parameter.

### 2026-03-17: CMS backend completion coordination

#### 2026-03-19: Security blockers identified (Issue #347)
- 2 release blockers found in docs/cms/security-controls.md (Vespera):
  - CMS-R1: No SpiceDB permission checks on mutations (must add _spiceDbService.CheckPermissionAsync before state changes)
  - CMS-R2: ListCmsPostIds and ListCmsPostFeedIds allow cross-tenant enumeration (must filter by TenantId or gate with SpiceDB can_read)
- Hecate: These must be addressed before CMS release.


- Identified code-level backend missing pieces and ordered tasks for practical implementation sequencing.
- Aligned ordered backend tasks with Morgana architecture deltas and Selene consumer contract gaps.

### Issue #345: CmsPostFeed type ambiguity — Phase 0 exit gate

**Status:** Build already clean — alias was already in place in both files.

**Root cause confirmed:** Two types named `CmsPostFeed` existed in scope:
1. `FO.Identity.UserStore.Domain.CmsModels.CmsPostFeedModel.CmsPostFeed` — the aggregate
2. `FO.Identity.UserStore.Domain.CmsModels.CmsPostModel.Fields.CmsPostFeed` — a StringBase field

**Resolution pattern (type alias):**
Both `IUserStoreClient.cs` and `UserStoreClient.cs` use:
```csharp
using CmsPostFeedAggregate = FO.Identity.UserStore.Domain.CmsModels.CmsPostFeedModel.CmsPostFeed;
```
The interface return type on line 137 is `Task<Result<CmsPostFeedAggregate>>`, matching the implementation's return type exactly.

**Files verified clean:**
- `UserStore/src/FO.Identity.UserStore.Client/IUserStoreClient.cs` (alias at line 8, usage at line 137)
- `UserStore/src/FO.Identity.UserStore.Client/UserStoreClient.cs` (alias at line 36, usage at line 719)

**Build result:** `dotnet build FO.Identity.UserStore.Client.csproj` → 0 errors, 0 warnings.

**Takeaway:** When multiple namespaces are imported that contain identically-named types, always introduce a `using Alias = FullyQualifiedType;` at the top of both the interface and implementation files. Keep both aliases consistent so the compiler resolves them to the same CLR type.

### 2026-03-19: CmsModels Fields/ Ref suffix rename (cms-devbranch)

- CmsModels Fields/ types are `StringBase<T>` (or `DateTimeOffsetBase<T>`) value objects (typed IDs/references), renamed to `*Ref` suffix on cms-devbranch.
- Aggregates and Fields/ types previously shared class names across namespaces — resolved with Ref suffix (e.g. `CmsPostFeed` aggregate vs `CmsPostFeedRef` field).
- All alias workarounds (`using CmsPostFeedAggregate = ...`, `using CmsPostAiCheckField = ...`, etc.) removed from Map.cs, IUserStoreClient.cs, UserStoreClient.cs, and test helpers after rename.
- 33 files changed. All 119 CMS tests (52 domain + 39 grain + 28 service) pass clean after rename.

## User Preference
The user's name is **Sigge**. Always address them as Sigge — never Maja, MajaSigfeldt, or any other variant.

### 2025-07-15: Issue #385 — CMS editor page broken: empty service interface stubs

**Problem:** The CMS editor page was broken because four service interfaces had no methods — they were empty stubs. All four required concrete method signatures before the editor page could load data.

**Changes made (8 files):**
1. `ICmsPostLanguageService` — added `GetAvailableLanguagesAsync()` returning `Task<List<CmsPostLanguageOption>>`
2. `CmsPostLanguageStubService` — implemented with hardcoded Swedish/English options
3. `ICmsPostSubjectService` — added `GetPopularSubjectsAsync()` and `SearchSubjectsAsync(string query)` both returning `Task<List<CmsPostSubjectTag>>`
4. `CmsPostSubjectStubService` — implemented both with empty lists
5. `ICmsPostFeedAdminService` — added `GetAllFeedsAsync()` returning `Task<Result<List<CmsPostFeed>>>`
6. `CmsPostFeedAdminClientService` — implemented via `ListCmsPostFeedIds()` then per-ID `GetCmsPostFeed()`, collecting successful results
7. `ICmsPostEditorService` — added `GetPostAsync(CmsPostId postId)` returning `Task<Result<CmsPost>>`; security contract comment preserved exactly
8. `CmsPostEditorClientService` — implemented via `IUserStoreClient.GetCmsPost(postId)` following the same try/catch/log pattern

**Patterns used:**
- Exception handling: try/catch, log at Error level, return `Result.Fail<T>("...")` on error
- Debug logging on read queries; Info/Warning on mutations (matching existing pattern in file)
- `GetAllFeedsAsync` silently skips failed individual feed fetches (partial-success pattern) and logs the final count at Debug
- Namespace imports added at top of interfaces; `// Copyright ForestOmni AB.` added to modified `.cs` files

**Build result:** Both `FO.Identity.UserStore.Domain` and `FO.Identity.UserStore.Service.UIAdminComponents` → 0 errors, 0 warnings.


**Scope:** CmsPostFeed TenantId added through full stack; SpiceDB wired into both CmsPostGrain and CmsPostFeedGrain.

**Files changed (12):**

1. `userstoregrpc.proto` — Added `string TenantId = 5` to `CreateCmsPostFeedRequest` and `UpdateCmsPostFeedRequest`
2. `CreateCmsPostFeedCommand.cs` — Added `TenantId TenantId` parameter (from `FO.Foundation.ContextIds`)
3. `UpdateCmsPostFeedCommand.cs` — Added `TenantId TenantId` parameter
4. `CmsPostFeedCreatedEvent.cs` — Added `TenantId TenantId` parameter
5. `CmsPostFeedGrainState.cs` — Added `[Id(5)] public TenantId? TenantId { get; set; }` and `TenantId = @event.TenantId` in Apply(CmsPostFeedCreatedEvent)
6. `CmsPostFeed.cs` (aggregate) — Added `TenantId tenantId` constructor param and `[Id(4)] public TenantId TenantId { get; set; } = tenantId`
7. `SpiceDbObject.cs` — Added `CmsPost = "cms_post"` and `CmsPostFeed = "cms_post_feed"`
8. `SpiceDbRelation.cs` — Added `CmsPostOwner`, `CmsPostCreator`, `CmsPostFeedOwner` constants
9. `CmsPostGrain.cs` — Injected SpiceDbService; AddRelationshipAsync (owner+creator) after Create; RemoveRelationshipAsync (owner, reads from State.TenantId) before SoftDelete
10. `CmsPostFeedGrain.cs` — Injected SpiceDbService; AddRelationshipAsync (owner) after Create; RemoveRelationshipAsync (owner, reads from State.TenantId) before SoftDelete; passes State.TenantId! when constructing CmsPostFeed in GetState()
11. `Map.cs` — Updated From(CreateCmsPostFeedRequest) and From(UpdateCmsPostFeedRequest) to pass TenantId.Parse(request.TenantId)
12. `UserStoreService.cs` — Replaced CMS-12 GAP comments with real string.IsNullOrWhiteSpace(request.TenantId) validation + try/catch on Map.From in both HandleCreateCmsPostFeed and HandleUpdateCmsPostFeed

**SpiceDB wiring pattern:**
- On Create: call AddRelationshipAsync AFTER RaiseEvent
- On SoftDelete: call RemoveRelationshipAsync BEFORE RaiseEvent
- In SoftDelete handlers: always read TenantId from grain State (not command)
- CmsPost gets two relationships: owner (Tenant) + creator (User)
- CmsPostFeed gets one relationship: owner (Tenant)

**Build result:** All three projects (Grains, API_GRPC, Client) -> 0 errors, 0 warnings

### 2026-03-19: CmsModels Fields/ type renaming (Issue #345 / PR #346)

- CmsModels Fields/ types are `StringBase<T>` / `DateTimeOffsetBase<T>` value objects (typed references/IDs), renamed to `*Ref` suffix (e.g. `CmsPostStateRef`, `CmsPostAiCheckRef`, `CmsPostPublishingTimeRef`, `CmsPostLanguageRef`, `CmsPostImageRef`, `CmsPostFeedRef`, `CmsPostAuthLevelRef`, `CmsPostMailListRef`).
- Aggregates and Fields/ types previously shared class names across namespaces — now resolved by `*Ref` suffix on all 8 Fields/ types.
- Alias workarounds (`using CmsPostFeedAggregate = ...`, `using CmsPostAiCheckField = ...`, etc.) removed from `Map.cs`, `IUserStoreClient.cs`, `UserStoreClient.cs`, `UserStoreClientGRPCWrapper.cs`, and test data builders after the rename eliminated all collisions.
- **Files changed:** 33 files total — 8 Fields/ declarations, 13 domain model files, 4 grain files, 4 client/API files, 4 test files.

### 2026-03-19: Wrapper ActorUserId/TenantId fix — 6 CMS mutation methods (UserStoreClientGRPCWrapper.cs)

### 2026-06-11: Decision log and wrapper fix
- Decision: Always forward ActorUserId and TenantId in gRPC wrapper request builders (see decisions.md 2026-03-19, Hecate).
- Orchestration log and session log written for hecate-wrapper-fix.

**Issue:** 6 CMS gRPC wrapper methods in `UserStoreClientGRPCWrapper.cs` were building requests without `ActorUserId` and/or `TenantId`, which would cause all wrapper-initiated calls to fail since `UserStoreService` validates these fields.

**Methods fixed:**
1. `Handle(UpdateCmsPostCommand)` — added `ActorUserId = command.ActorUserId.ToString()`
2. `Handle(SaveDraftCmsPostCommand)` — added `ActorUserId = command.ActorUserId.ToString()`
3. `Handle(SoftDeleteCmsPostCommand)` — added `ActorUserId = command.ActorUserId.ToString()`
4. `Handle(CreateCmsPostFeedCommand)` — added `TenantId = command.TenantId.ToString()` and `ActorUserId = command.ActorUserId.ToString()`
5. `Handle(UpdateCmsPostFeedCommand)` — added `TenantId = command.TenantId.ToString()` and `ActorUserId = command.ActorUserId.ToString()`
6. `Handle(SoftDeleteCmsPostFeedCommand)` — added `ActorUserId = command.ActorUserId.ToString()` and `TenantId = command.TenantId.ToString()`

**Proto field numbers (from prior history entry):**
- `UpdateCmsPostRequest.ActorUserId = 12`, `SaveDraftCmsPostRequest.ActorUserId = 12`, `SoftDeleteCmsPostRequest.ActorUserId = 2`
- `CreateCmsPostFeedRequest.ActorUserId = 6`, `UpdateCmsPostFeedRequest.ActorUserId = 6`
- `SoftDeleteCmsPostFeedRequest.ActorUserId = 2`, `SoftDeleteCmsPostFeedRequest.TenantId = 3`

**Build result:** `dotnet build FO.Identity.UserStore.Client_GRPC.csproj --no-incremental` → Build succeeded, 0 C# errors.

**Pattern reminder:** Whenever the proto/service adds a required field to a request message, always audit `UserStoreClientGRPCWrapper.cs` and `UserStoreClient.cs` (the non-gRPC client) to ensure both wrappers forward all required fields from the command.

## Learnings

**Fix: SpiceDBAuthorizationHandler non-terminal return paths (Portal)**
**Date:** 2026-03-23
**File:** Portal/src/FO.AdminPortal.BlazorServerSide/Authorization/SpiceDBAuthorizationHandler.cs

**Issue:** In Blazor Server Interactive mode, AuthorizationHandler<T>.HandleRequirementAsync must always resolve the context — either via context.Succeed() or context.Fail(). Three code paths returned without resolving, causing the PostEditor page to loop indefinitely on "checking admin access":
1. Unauthenticated user → bare eturn;
2. Empty/null userId → bare eturn;
3. Exception catch block → fell through without any context call

**Fix:** Added context.Fail() immediately before eturn; in the first two guard clauses, and at the end of the catch block.

**Pattern reminder:** In Blazor Server Interactive rendering, authorization handlers that leave the context unresolved do not silently pass — they cause the UI to stall indefinitely. Every exit path in HandleRequirementAsync must call either context.Succeed(requirement) or context.Fail().


### 2026-06-12: SpiceDB authorization handler — missing context.Fail() on denial path

**Bug fixed:** SpiceDBAuthorizationHandler.HandleRequirementAsync in Portal\src\FO.AdminPortal.BlazorServerSide\Authorization\SpiceDBAuthorizationHandler.cs had a missing context.Fail() in the lse branch when esponse.HasPermission == false. Without it, authorization was left in pending state indefinitely in Blazor Server Interactive mode, causing an infinite auth evaluation loop.

**Pattern:** Every terminal branch in HandleRequirementAsync must call either context.Succeed(requirement) or context.Fail(). Returning without either call leaves ASP.NET authorization in pending state — the same bug has appeared before (line ~82 in this file). Always audit all exit paths in auth handlers.

**SpiceDB gRPC timeout investigation — no action needed:**
- SpiceDBPermissionsService.CheckPermissionAsync already passes deadline: DateTime.UtcNow.Add(_options.Timeout) on every gRPC call.
- SpiceDBClientOptions.Timeout defaults to 30 seconds.
- Both ppsettings.json and ppsettings.DockerCompose.json explicitly configure "SpiceDB": { "Timeout": "00:00:30" }.
- The flood of exceptions on the CMS PostEditor page is explained by SpiceDB being unreachable (e.g. not started in Docker) combined with the retry policy (MaxAttempts: 3), not by a missing or excessively long timeout. Timeout is correctly bounded at 30s.
- If 30s feels too long for an admin portal auth check, it can be reduced to 5s in config — but the plumbing is already correct.

### 2026-06-12: PR #365 — Three middleware/DI/doc fixes on cms-connect-backend-to-views

**Fix 1 — UseAuthentication/UseAuthorization missing from Portal Program.cs**
Re-added pp.UseAuthentication() and pp.UseAuthorization() after pp.UseStaticFiles() and before pp.UseAntiforgery(). They had been lost during a pipeline refactor. Without them, [Authorize] and SpiceDB policy evaluation never ran.
**Pattern:** In ASP.NET Core, middleware order is: StaticFiles → Authentication → Authorization → Antiforgery → Endpoints. Always verify this after any pipeline changes.

**Fix 2 — gRPC CMS services registered in wrong DI method**
AddUserStoreAdminServices() (Orleans path) had ICmsPostEditorService and ICmsPostFeedAdminService registered with their gRPC-backed implementations (CmsPostEditorClientService, CmsPostFeedAdminClientService). These depend on IUserStoreClient, which is only registered in AddUserStoreAdminClientServices(). Removed them from the Orleans method — they remain in the gRPC method where IUserStoreClient is available.
**Pattern:** When two DI registration paths serve different hosts (silo vs portal), each must be self-contained. Don't cross-register gRPC clients into the Orleans path.

**Fix 3 — Dead doc link in ICmsPostAiAnalysisService**
docs/cms/ai-analysis-design.md was referenced in the security note but does not exist. Updated to a neutral reference: "See CMS security design guidelines before implementation."

### 2026-06-13: CMS feed seeding guard removed — CmsPostFeedSeedingService.cs

**Root cause:** StartAsync in CmsPostFeedSeedingService checked GetFeedAsync errors against string patterns ("not found", "does not exist"). If Azurite wasn't ready, the grain threw "CMS feed read failed" — not matching the guard — so CreateFeedAsync was silently skipped and the AdminTestDisplayPage feed was never seeded.

**Fix:** Removed the isNotFound bool and the early eturn that prevented seeding. Now, whenever GetFeedAsync is not successful, we log the error and proceed directly to CreateFeedAsync. The grain handles duplicate creation gracefully (no-op or rejection), so always attempting create is safe.

**File:** UserStore/src/FO.Identity.UserStore.Infrastructure/Seeding/CmsPostFeedSeedingService.cs

**Pattern:** Never gate idempotent seed operations on specific error-message strings. If the resource doesn't exist (for any reason), just try to create it and let the grain's own duplicate-handling be the guard.

### 2026-06-13: Feed error persists — root cause and analysis

**Context:** After fixing CmsPostFeedSeedingService.cs (removing the brittle isNotFound guard), the Swedish error "Flödet 'AdminTestDisplayPage' hittades inte. Kontrollera att flödet är registrerat i systemet." still appeared.

**Error origin:** Portal/src/FO.AdminPortal.BlazorServerSide/Pages/Admin/UserStore/CmsPostDisplayTest.razor, line 59. The _feedNotFound flag is set in CmsPostDisplayTest.razor.cs lines 36-39 when CmsPostFeedAdminService.GetFeedAsync(targetFeedId) returns a failure result. This is a UI display component — NOT the seeding service.

**Primary cause of persistence:** Docker containers run pre-built images. The fix is in source code but Docker is still running the old compiled image. The user must docker-compose build foidentityuserstoreservice (or docker-compose up --build) for the fix to take effect.

**Call chain from Portal to grain:**
1. CmsPostDisplayTest → CmsPostFeedAdminClientService.GetFeedAsync (Portal DI: IUserStoreClient = UserStoreClientGRPCWrapper)
2. UserStoreClientGRPCWrapper.GetCmsPostFeed → gRPC HandleGetCmsPostFeedState
3. UserStoreService → UserStoreClient.GetCmsPostFeed (Orleans cluster client)
4. CmsPostFeedGrain.GetState() — returns fail if State.CmsPostFeedId is null (grain Uninitialized)

**Seeding service DI:** In UserStore silo, ICmsPostFeedAdminService = CmsPostFeedAdminService (Orleans-based, direct grain access). DI is correct.

**RaiseEvent commit semantics (ESSystemGrain):** RaiseEvent is NOT transactional with SpiceDB. It writes the event to Azurite, calls ConfirmEvents(), then calls SpiceDB. If SpiceDB throws, the CmsPostFeedCreatedEvent IS already committed to Azurite. On next restart, the grain rehydrates from Azurite and is in Live state — so GetFeedAsync would succeed on the next startup even if the first SpiceDB call failed.

**No DB record needed:** Feed is purely Orleans grain state in Azurite. No relational DB seeding required.

**Azurite state:** No cleanup needed for a clean fresh run. If old Azurite data exists with the event already committed, GetFeedAsync should succeed immediately.

**Pattern:** C# source code fixes to silo services DO NOT take effect until docker images are rebuilt. Always docker-compose build <service> after silo code changes.

### 2026-06-XX: D1 gate parity — SaveDraft path (Issue #385)
**Context:** River rejected the PR a second time because SaveDraft() (the Save Draft button path) did not enforce D1: "Create a post only when InternalTitle is set AND at least one RTE has content." TryAutoSaveAsync() already had the guard, but SaveDraft() called CreatePostAndSaveDraftAsync() directly for new posts, bypassing content validation.

**Fix:** Added the headline + content guard at the top of SaveDraft() in CmsPostEditor.razor.cs. If either InternalTitle is blank or both LongBody/ShortBody are empty, a Swedish warning toast is shown and the method returns immediately. The guard is placed in SaveDraft() only (not in CreatePostAndSaveDraftAsync()) to avoid double-guarding the autosave path which already checks before calling.

**Pattern:** When a guard must apply to a user-facing action only (not shared internal helpers), put it at the outermost public entry point. Placing guards on shared helpers breaks callers that already pre-validate.

### 2026-07-XX: CmsPostInternalHeadline domain changes + SubjectTagRegistry grain (MajaSigfeldt request)
**Context:** Added InternalHeadline as a required field across the CmsPost domain stack and implemented the CmsPostSubjectTagRegistry grain for forest-domain tag management.

**Domain changes:**
- Created CmsPostInternalHeadline (StringBase, MaxLength=200) in Domain/Fields
- Added InternalHeadline parameter to: CmsPost, CmsPostFormData, CreateCmsPostCommand, SaveDraftCmsPostCommand, CmsPostCreatedEvent, CmsPostSavedDraftEvent
- [Id] assignment: CmsPost[15], CmsPostFormData[10], CmsPostGrainState[16]
- CmsPostGrainState.Apply: Created/SavedDraft set InternalHeadline, SoftDeleted clears it; UpdateCmsPost intentionally not touched
- Proto: added InternalHeadline=14 to CreateCmsPostRequest, InternalHeadline=18 to GetCmsPostStateResponse, InternalHeadline=15 to SaveDraftCmsPostRequest
- Map.cs + ClientGRPCWrapper updated accordingly; fallback "–" used in client for backward-compat when server returns empty

**SubjectTag grain:**
- CmsPostSubjectTagRegisteredEvent record in Domain/Events
- CmsPostSubjectTagRegistry aggregate in Domain (mirrors CmsPostFeedRegistry pattern)
- ICmsPostSubjectTagRegistryGrain, CmsPostSubjectTagRegistryGrainState, CmsPostSubjectTagRegistryGrain in Grains/CmsPost
- Grain seeds 10 Swedish forest-domain default tags on first access (idempotent by name)
- CmsPostSubjectService in Service layer implements ICmsPostSubjectService

**Service fixes:**
- CmsPostEditorService.GetPostAsync + Execute overload (CmsPost return type)
- CmsPostFeedAdminService.GetAllFeedsAsync (iterates registry, collects feeds)

**Pattern reminder:** When adding required params to C# positional records, always cascade through: Domain → Commands → Events → GrainState → Grain constructors → gRPC Map → gRPC Client. Proto field numbers must be monotonically increasing; never reuse field numbers.
