# Project Context

- **Owner:** MajaSigfeldt
- **Project:** Witchy female squad bootstrap
- **Stack:** TBD
- **Created:** 2026-03-02T15:53:08Z

## Learnings

- Initial team seeded for planning, architecture, and review.

### 2026-03-13: CMS Service TDD Contracts

- TDD test suites for `CmsPostEditorService` and `CmsPostFeedAdminService` written before grains/services exist. Tests will not compile until backend is implemented — this is intentional.
- Naming decision documented: services use "Editor" (editorial workflow) vs "Admin" (configuration/management), matching existing `BillingAccountAdminService` convention.
- All CMS grains use `IGrainWithStringKey`; key is always `.ToGuidString()`. Grain interfaces follow `I{Domain}Grain` pattern.
- Grain namespace: `FO.Identity.UserStore.Grains.CmsPost`. Service namespace: `FO.Identity.UserStore.Service.Cms.Services`.
- Used FluentAssertions (`Should().BeTrue()`) not Shouldly — Cms.Service.Tests csproj references FluentAssertions only.
- `SchedulePostAsync_WithPastDate_ReturnsValidationFailure` tests a service-level guard: the grain must never be called when the scheduled date is in the past.
- Decision filed to `.squad/decisions/inbox/morgana-cms-service-naming.md` for Scribe to merge.

### 2026-03-17: CMS backend completion coordination

- Produced an architecture gap map for CMS backend completion using billing/subscription baseline patterns as comparison anchors.
- Shared mapping inputs for Circe planning, Hecate task ordering, and Rowan operational readiness checks.

### 2026-03-18: Phase assessment for Issue #345

Full code inspection of all six CMS phases. Findings:

- **Phase 0:** ✅ Done. 106/106 tests at exit gate.
- **Phase 1:** ✅ Done. 8 grain state classes, 4 grain implementations, 4 grain interfaces, all fully event-sourced. Soft-delete field clearing in CmsPostGrainState complies with Vespera's security requirement. 39/39 grain tests pass.
- **Phase 2:** ✅ Done (unconfirmed CI). CmsPostEditorService and CmsPostFeedAdminService implemented. DI wired. 15 service tests written with correct project references. Needs one confirmed `dotnet test` run to formally close the exit gate.
- **Phase 3:** ✅ Done (exit gate untested). 13 gRPC handlers in UserStoreService.cs. Full client wrapper in UserStoreClient.cs. IUserStoreClient CMS contract complete. No API-level integration test file found in Client_GRPC.Tests — Phase 3 exit gate ("API-level integration tests pass") is formally unmet.
- **Phase 4:** 🟡 Partial. List operations via registry grains, Get round-trips work. Missing: pagination, search/filter, query methods on service interfaces, CMS admin UI components.
- **Phase 5:** ❌ Not started (except CMS-14 soft-delete clearing). SpiceDB schema not updated (cms_post / cms_post_feed resource definitions absent). CMS-12 proto gap: CreateCmsPostFeedRequest missing TenantId. No SpiceDB permission checks in grains. No Vespera sign-off.
- **Phase 6:** 🟡 Partial. CI wired (userstore-build.yml covers all 3 CMS test dirs). Runbook written. Pre-flight checklist not signed off. Service tests not confirmed green in CI.

**Recommended next action:** Confirm Phase 2 exit gate with a test run, then prioritise Phase 5 (SpiceDB schema + proto TenantId fix) as the critical-path blocker for production readiness. Decision filed to `.squad/decisions/inbox/morgana-345-phase-assessment.md`.

### 2025-07-24: CMS Views Build Error Analysis (Issue #364)

- Full investigation of 24 build errors on `squad/cms-connect-backend-to-views` branch in `FO.Identity.UserStore.Service.UIComponents`.
- **Dependency finding:** UIComponents → Service ProjectReference is safe (no cycle). Service.csproj does NOT reference UIComponents. Portal.AdminPortal references UIComponents.
- **Naming mismatch:** Views used `ICmsPostService` and `IFeedService` — correct names are `ICmsPostEditorService` and `ICmsPostFeedAdminService` (already exist in Service/Cms/Services/).
- **5 missing service interfaces** (`ISubjectService`, `ILanguageService`, `IAiAnalysisService`, `IBlobStorageService`, `IMailDispatchService`) — none exist anywhere. Created stub interface specs with `ICmsPost*` naming prefix for consistency.
- **3 missing UIKit buttons** (Danger, Success, Warning) — follow FO_ButtonPrimary inheritance pattern. TailAdmin theme colors: `danger`, `success`, `warning`.
- **FO_RichTextEditor** does not exist in UIKit. GalleryApp has a Quill.js demo page but no reusable component. Spec'd a stub component wrapping Quill.
- **FO_ImageCropper** does not exist anywhere. Spec'd stub with `CropSettings`/`CropSettingsChanged` for `@bind-CropSettings` support.
- **FO_DatePicker and FO_TimePicker** lack `Label` parameter — views pass it, causing errors with `TreatWarningsAsErrors=True`.
- **Ganss.Xss (HtmlSanitizer)** not referenced by any .csproj in the solution. Needs `<PackageReference Include="HtmlSanitizer" Version="8.4.815" />` in UIComponents.csproj.
- **Code-behind files** are empty stubs — will surface additional CS0103 errors after type errors are fixed. Flagged for Hecate scaffolding.
- Fix plan filed to `.squad/decisions/inbox/morgana-cms-fix-plan.md`.

### 2025-07-24: CMS Editor E2E Architecture Audit (Issue #385)

Full end-to-end feature trace of `CmsPostEditor.razor` against all service interfaces, client implementations, domain models, and FOUIKit components.

**Overall verdict:** Of 18 features, 3 are fully wired, 5 partial, 10 are stubs or silent failures.

**Key structural findings:**
- All 20 FOUIKit components referenced in the razor **exist with correct parameter signatures**. No missing components. Previous issue #364 fixes were fully applied.
- `FO_Modal.OnCloseClick` is not wired in any of the 4 modal instances — X button and backdrop click are silent no-ops throughout.
- `FO_ImageCropper` renders but has no JS crop library — it is a visual placeholder.

**Critical gaps (P0 — editor cannot function):**
1. **Create Post path is absent** — no call to `CreatePostAsync()` exists anywhere. New posts cannot be saved.
2. **Edit mode is non-functional** — `[SupplyParameterFromQuery]` is commented out; `OnInitializedAsync` does not load post data; `_currentCmsPostId` and `_loadedPost` are always null.
3. **No `OnInitializedAsync` data loading** — feeds, languages, subjects, audience groups are all empty every page load.

**P1 stubs:**
- `SchedulePost()` and `PublishNow()` return `Task.CompletedTask`.
- Validation popup (`_showValidationErrorPopup`) is never triggered.

**P2 form-data-to-command disconnects:**
- Feed selections (`SelectedFeedsLong/Short` as string names) never written to commands (domain uses `CmsPostFeedId`).
- Audience group selections not wired into commands; `AudienceGroup` (UI-local) unmapped to `CmsPostAuthLevelId`.
- Subject tags have no field on any command or `CmsPost` domain model.

**P3 service contract gaps:**
- `ICmsPostSubjectService` is an **empty interface** — stub methods `GetPopularSubjectsAsync()` and `SearchSubjectsAsync()` exist on the stub but are not declared on the interface.
- `ICmsPostFeedAdminService` has no list operation — only `GetFeedAsync(id)`.
- `ICmsPostEditorService` has no read/get operation for hydrating edit mode.

**Domain mismatches:**
- Push notifications: `_formData.SendPushNotification` has no corresponding domain model field in `CmsPost` or any command.
- Multi-language UI vs. single `Language` field on `CmsPost` — `SaveDraft()` silently discards all but the first selected language.
- Subject tags: no field on `CmsPost`; relationship model undefined.

**5 architectural decisions filed for MajaSigfeldt:** Create Post timing, push notification scope, multi-language model, audience group identity (AudienceGroup = CmsPostAuthLevel?), subject tag persistence model.

Full audit filed to `.squad/decisions/inbox/morgana-cms-e2e-audit.md`.

### 2025-07-25: CmsPost InternalHeadline + Subject Tag Registry (Issue #385 follow-up)

- **InternalHeadline field decided:** `StringBase<CmsPostInternalHeadline>` MaxLength=200. Editor-internal only, never shown publicly. `[Id(15)]` on `CmsPost`, `[Id(16)]` on `CmsPostGrainState`. Added to `CreateCmsPostCommand`, `SaveDraftCmsPostCommand`, and their corresponding events. NOT added to `UpdateCmsPostCommand` (avoids null-means-clear ambiguity).
- **Subject storage confirmed:** Semicolon-separated string in `CmsPostSubject` (StringBase, MaxLength=500). Not a collection type — keeps grain state serialisation clean and avoids live registry type coupling in post state.
- **Subject ≠ InternalHeadline:** The existing `MapPostToFormData` bug (maps `post.Subject.Value` → `_formData.InternalTitle`) is explicitly documented and corrected. Fix: `_formData.InternalTitle = post.InternalHeadline.Value` and split Subject string into `_formData.SubjectTags`.
- **D1 autosave gate kept as-is:** Gate checks InternalHeadline + RTE content. Tags are optional — not a creation gate.
- **Subject Tag Registry grain decided:** Singleton `CmsPostSubjectTagRegistryGrain`, key `"CmsPostSubjectTagRegistry"`. Seeded with 10 forest-domain tags on first access. Interface: `ListAllTagsAsync`, `SearchTagsAsync`, `RegisterTagAsync` (idempotent, case-insensitive, rejects semicolons in names). `RegisterTagAsync` NOT exposed via gRPC until Phase 5 SpiceDB access control is in place.
- **Proto slots assigned:** GetCmsPostStateResponse field 18, CreateCmsPostRequest field 14, SaveDraftCmsPostRequest field 15.
- **PII risk flagged:** InternalHeadline persisted in grain state and returned via gRPC — Vespera must review before Phase 5 gate. Mitigation candidates: role-strip from response, soft-delete clearing.
- Decision filed to `.squad/decisions/inbox/morgana-cms-internalheadline-subject-tags.md`.

### 2026-07-25: CmsPostEditor Iteration 2 — Feed Mapping and Publish Wiring

Full two-iteration code review and fix pass on `CmsPostEditor.razor.cs`.

**Root causes found:**
- `CmsPostFeedViewModel` lacked a `CmsPostFeedId` field — user feed selections were unreachable at save time.
- `SaveDraftInternalAsync` used `_loadedPost.FeedId` as feed, silently discarding any selection the user made.
- `CreatePostAndSaveDraftAsync` used `CmsPostFeedId.NotSet()` — first feed choice on a new post was never persisted.
- `MapPostToFormData` did not restore `SelectedFeedsLong` in edit mode — the feed card always showed "ingen vald" even after a feed was saved.
- `PublishNow` issued the publish command without first syncing Quill or saving draft — body content could be stale at publish time.

**Fixes applied (commit 7c999320):**
- Added `CmsPostFeedId? Id` to `CmsPostFeedViewModel`; populated in `LoadPageDataAsync`.
- Added `ResolveSelectedFeedId(CmsPostFeedId? fallback)` — single resolution point that maps `SelectedFeedsLong[0]` to its domain ID.
- `SaveDraftInternalAsync` returns `Task<bool>`, uses resolved feed ID, updates `_loadedPost.FeedId` after success.
- `CreatePostAndSaveDraftAsync` uses `ResolveSelectedFeedId()` instead of `NotSet()`.
- `MapPostToFormData` restores `SelectedFeedsLong` from `post.FeedId` (long feeds only — domain has single FeedId).
- `PublishNow` syncs Quill and saves draft before publishing; aborts if save fails.

**Build:** `dotnet build FO.Mother.slnx` — 0 errors, 0 warnings. Decision filed to `.squad/decisions/inbox/morgana-iteration2.md`.


Full trace of the new-post creation flow: `OnInitializedAsync` → `LoadPageDataAsync` → `SaveDraft` → `CreatePostAndSaveDraftAsync` → `SaveDraftInternalAsync`.

**What was confirmed working (already fixed by prior Selene/River commits):**
- `SyncQuillContentAsync` called inside `SaveDraft()` before save — content sync works for manual saves.
- Tag deduplication uses OrdinalIgnoreCase name equality — correct.
- Audience groups seeded with 4 hardcoded options — renders correctly.
- Short body conditional enable on `_longBodyHasContent` flag — correct.
- `RebuildBreadcrumb()` method — added by River, populates Home → CMS-inlägg → [Nytt inlägg | Redigerar: {title}].
- `TryAutoSaveAsync` calls `SyncQuillContentAsync()` first — autosave race fixed by River.
- `_loadedPost.Subject ?? CmsPostSubject.Create("untagged")` — null guard in place.
- `_loadedPost.AuthLevelId ?? CmsPostAuthLevelId.NotSet()` — null guard in place.
- Norwegian ("no/Norsk") in language stub — added by River.

**Service contracts verified:**
- `CmsPostLanguageStubService.GetAvailableLanguagesAsync()` — returns sv, en, no. ✅
- `CmsPostSubjectClientService.GetPopularSubjectsAsync()` — calls `client.ListCmsPostSubjectTags()` over gRPC; returns empty list on failure (logged). Correct — empty state is handled gracefully in the UI.
- `CmsPostFeedAdminClientService.GetAllFeedsAsync()` — fetches ID list then fetches each feed individually. Correct for bounded feed counts.
- `CmsPostEditorClientService` — has `CreatePostAsync`, `SaveDraftAsync`, `GetPostAsync`. All three needed for new/edit flow are present. ✅
- `SaveDraftCmsPostCommand` — all required parameters present, non-nullable fields are hardened against null fallbacks. ✅

**Key architectural note:** River's refactor commit (c667402d) had already applied all the priority fixes before Morgana's review pass. Morgana's edits were idempotent — confirmed that the target state was achieved. All changes verified present on `squad/385-fix-cms-editor-metadata` branch.

### 2025-07-25: Portfolio Architecture Plan (Issue #1)

- Produced full architecture document for PortfolioSigge portfolio site, adapted from Issue #1 spec to the existing React/TypeScript/Vite stack.
- **Key decisions:** Single `expandedId` state (not per-card booleans). All components inline in App.tsx. No React Router, no Tailwind, no fetch calls — projects are static data in `projects.ts`. CSS transitions via `.is-expanded` class toggle on `max-height` for click-to-reveal.
- **Existing CSS preserved:** `index.css` `:root` variables, dark mode media query, `#root` layout all kept. Only two new variables added (`--card-bg`, `--card-hover`). `App.css` fully replaced (old weather table styles discarded).
- **File structure:** `projects.ts` (data module), `App.tsx` (2 components: `ProjectCard` + `App`), `App.css` (portfolio styles), `index.html` (title update only), `main.tsx` (untouched).
- Pedagogical C#-comparison comments specified for: interface vs C# interface, useState vs INotifyPropertyChanged, .map() vs LINQ Select, event handlers vs C# delegates.
- 5 sample projects defined: portfolio site, .NET weather API, task tracker (SignalR), C# quiz CLI, recipe book (React).
- Decision filed to `.squad/decisions/inbox/morgana-portfolio-architecture.md`.
