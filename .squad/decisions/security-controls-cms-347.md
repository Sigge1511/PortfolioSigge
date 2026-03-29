# Security Decisions — CMS Controls Document (Issue #347)

**By:** Vespera (Security Specialist)  
**Date:** 2026-06-01  
**Issue:** #347  
**Branch:** squad/347-security-documentation-and-tests

---

## Decision 1: CMS cannot ship to production without SpiceDB permission checks

> **⚠️ SUPERSEDED** — See Status Update (2026-03-21) below. Grain-level SpiceDB gates were removed; `IsAdminCaller` JWT role check in `UserStoreService` is the single enforcement point.

**What:** All CMS mutation handlers (`CmsPostGrain` and `CmsPostFeedGrain`) must call `_spiceDbService.CheckPermissionAsync(...)` before executing any state-changing command. The SpiceDB schema is complete and relationships are written/removed correctly, but the check gate that enforces `can_create`, `can_edit`, `can_delete`, and `can_publish` is absent.

**Why it matters:** Any authenticated gRPC caller can currently create, update, delete, or publish CMS content under any tenant. The only runtime protection is network-level access control to the UserStore gRPC port.

**Blocking conditions to resolve first:**
1. Actor `UserId` is missing from several gRPC mutation request proto messages (`UpdateCmsPostRequest`, `SaveDraftCmsPostRequest`, `PublishCmsPostNowRequest`, `ScheduleCmsPostRequest`, `SoftDeleteCmsPostRequest`). These must be extended before `CheckPermissionAsync` can be wired.
2. `SpiceDbPermission.cs` lacks CMS permission constants — add them before wiring checks.

**Decision:** CMS-R1 (absent permission checks) is a release blocker. Vespera will not sign off until it is resolved and tested.

---

## Decision 2: List endpoints must filter by tenant before release

> **⚠️ SUPERSEDED** — See Status Update (2026-03-21) below. Cross-tenant enumeration accepted by design; no longer a release blocker.

**What:** `HandleListCmsPostIds` and `HandleListCmsPostFeedIds` return all IDs from global registry grains(`CmsPostRegistryGrain` keyed `"CmsPostRegistry"`, `CmsPostFeedRegistryGrain` keyed `"CmsPostFeedRegistry"`). No tenant filter is applied.

**Why it matters:** Cross-tenant ID enumeration is a high-severity information disclosure. Even if content cannot be read, knowing which posts exist in another tenant is a data breach.

**Decision:** Add `TenantId` request parameter to both list endpoints and filter at the registry, OR gate list calls with a SpiceDB `can_read` permission check for the requesting actor. This is a release blocker.

---

## Decision 3: CmsPostAuthLevel is a metadata label — document this explicitly

**What:** `CmsPostAuthLevel` and its grain-state reference `CmsPostAuthLevelId` do not gate any server-side operation. They are audience category metadata. This is a deliberate design choice but must be explicitly documented so that portal/client code does not assume server-side enforcement.

**Decision:** Accepted as-is, documented in `docs/cms/security-controls.md`. Any future work that introduces server-side auth-level filtering must update the security controls document.

---

## Decision 4: Soft-delete field clearing pattern is correct — retain for feeds

**What:** `CmsPostGrainState.Apply(CmsPostSoftDeletedEvent)` correctly clears all content-bearing fields. `CmsPostFeedGrainState.Apply(CmsPostFeedSoftDeletedEvent)` also correctly clears content fields. This pattern is the established security baseline for CMS grain states.

**Open question:** `CreatedByUserId` is retained in `CmsPostGrainState` after soft-delete (explicitly, as an audit field). Under GDPR right-to-erasure, this may need to be cleared. Confirm with DPO and record the outcome in a follow-up decision.

---

## Decision 5: Add CMS permission constants to SpiceDbPermission.cs

**What:** Before wiring SpiceDB permission checks, add typed constants to `SpiceDbPermission.cs`:
- `CmsPostCanCreate = "can_create"`
- `CmsPostCanRead = "can_read"`
- `CmsPostCanEdit = "can_edit"`
- `CmsPostCanDelete = "can_delete"`
- `CmsPostCanPublish = "can_publish"`
- `CmsPostFeedCanCreate = "can_create"`
- `CmsPostFeedCanRead = "can_read"`
- `CmsPostFeedCanEdit = "can_edit"`
- `CmsPostFeedCanDelete = "can_delete"`

**Why:** Using magic strings for permission names risks silent mismatches. Constants also make it easier to grep for all permission check call sites.

---

## Summary of Release Blockers

| ID | Risk | Blocker? |
|---|---|---|
| CMS-R1 | No SpiceDB permission checks | ✅ Release blocker |
| CMS-R2 | Cross-tenant list enumeration | ✅ Release blocker |
| CMS-R5 | Actor UserId missing from mutation request protos | ✅ Blocks CMS-R1 fix |
| CMS-R7 | Missing SpiceDB permission constants | ⚠️ Pre-requisite for clean CMS-R1 fix |
| CMS-R4 | CreatedByUserId retained after soft-delete | ⚠️ Needs DPO confirmation |

---

## Status Update — 2026-03-21

**CMS-R10 Option A adopted:** Grain-level `CheckPermissionAsync` gates were evaluated and removed. Authorization is enforced via `IsAdminCaller` (JWT `cms_admin` role check) in `UserStoreService` for all 9 CMS mutation handlers. This supersedes Decision 1 above.

**CMS-R2 accepted by design:** Cross-tenant list enumeration (`ListCmsPostIds`, `ListCmsPostFeedIds`) was reviewed with Sigge (2026-03-19) and accepted. The global registry pattern is intentional. Decision 2 remains documented as context but is no longer a release blocker.

**Release blocker status:**
- CMS-R1 (no permission checks): ✅ Resolved — `IsAdminCaller` JWT gate enforced in all 9 mutation handlers
- CMS-R2 (cross-tenant enumeration): ✅ Accepted by design — not a blocker
- CMS-R5 (ActorUserId missing from protos): ✅ Resolved — added in this PR
- CMS-R7 (missing SpiceDB constants): ✅ Resolved — added to `SpiceDbPermission.cs`
