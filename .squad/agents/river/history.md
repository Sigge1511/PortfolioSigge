# River — History

## Core Context
- **Project:** ForestOmni — collaborative platform for the forest sector
- **Stack:** C# (.NET 10), Blazor Server-Side, TailwindCSS, Orleans grains, gRPC, SpiceDB, Azure
- **Owner:** MajaSigfeldt
- **Team:** Custom Witch Coven — Morgana (Lead), Circe (Delivery), Hecate (Backend), Selene (Frontend), Nyx (QA), Rowan (DevOps), Freya (Docs), Vespera (Security), Lyra (UX)
- **Active branch:** squad/385-fix-cms-editor-metadata
- **Solution file:** FO.Mother.slnx

## Key Conventions (learn these first)
- C# guidelines: `.github/instructions/csharp.md`
- Blazor guidelines: `.github/instructions/blazor.md`
- Test guidelines: `.github/instructions/test-xuni.instructions.md`
- FOUIKit components use `FO_` prefix; layout components use `Shell` prefix
- Buttons expose `IsDisabled` (NOT `Disabled`)
- Orleans grains: `[GenerateSerializer]` on state, inherit `ESGrain<>` for event-sourced
- No commented-out code committed — remove or implement
- `// Copyright ForestOmni AB.` must be line 1 of every new `.cs`, `.razor`, `.razor.cs` file; applies to new files only (not retroactively)
- Comments explain *why*, not *what*

## Learnings

### Hired 2026-03-24
- Joined the coven as Code Reviewer
- Focus: clean flow, efficiency, professional comments, anti-spaghetti
- Reviewer authority: can approve or reject with lockout enforcement
- Does NOT implement — flags issues for domain agents to fix

### Copyright standard (2026-03-24)
- All new `.cs`, `.razor`, `.razor.cs`, `.ts`, `.js` files in the Mother solution MUST start with: `// Copyright ForestOmni AB.`
- Missing header on new files = reject
- Existing files not retroactively flagged; config/JSON/YAML/Bicep/markdown exempt

### CMS Editor Metadata Review — #385 (2026-03-27)
- **Verdict:** REJECTED — 10 new `.cs` files missing copyright header; assigned fix to Hecate
- Files missing header: all 7 domain interface files in `UserStore/.../Cms/Services/` + 3 stub services (`CmsBlobStorageStubService`, `CmsMailDispatchStubService`, `CmsPostAiAnalysisStubService`)
- The four client/stub services that correctly carried the header were: `CmsPostEditorClientService`, `CmsPostFeedAdminClientService`, `CmsPostLanguageStubService`, `CmsPostSubjectStubService` — inconsistency within one PR is a common pattern to watch for
- **N+1 in GetAllFeedsAsync:** sequential per-ID fetch loop is an infrastructure gap (no bulk endpoint exists), acceptable now but flagged for future
- **`async void` event handlers** in Blazor code-behind need try/catch — unhandled exceptions are silently swallowed since they cannot propagate to the caller
- **`CreatePostAndSaveDraftAsync`** at ~58 lines is the largest method; cohesive enough to be advisory not blocking, but worth noting against the ~30-line guideline
- **`_currentCmsPostId { get; set; }` / `_loadedPost { get; set; }`** — private properties using field-naming convention (`_` prefix) is inconsistent; prefer plain private fields unless property semantics are needed
- `TenantId.NotSet()` TODO with clear infrastructure-gap comment = acceptable per review standards; do not reject for this pattern

### CMS Editor Bug Fixes Review — #385 (2026-03-27, Selene's changes)
- **Verdict:** APPROVED WITH FIXES — Selene's core logic is sound; River applied 4 direct refactors; 1 logic issue flagged to Morgana
- **JS (`rich-text-editor.js`):** `getQuillContent` function is correct — returns `''` for unregistered instances, comma placement after `disposeQuill` is correct. Added missing JSDoc comment (direct fix).
- **C# (`FO_RichTextEditor.razor`):** `GetCurrentContentAsync` guards correctly for `_isInitialized`. Added `JSDisconnectedException` catch to mirror `DisposeAsync` pattern (direct fix). XML doc comment was already present.
- **Regex in `HasQuillContent`:** `System.Text.RegularExpressions.Regex.Replace` inline was called on every sync — extracted to `private static readonly Regex _stripTagsRegex = new(..., Compiled)` (direct fix).
- **Audience sentinel GUIDs:** Four `new Guid("000...00x")` magic values in `LoadPageDataAsync` extracted to `private static readonly Guid _audiencePublicId/RegisteredId/SubscriberId/AdminId` (direct fix).
- **`TryAutoSaveAsync` logic issue — flagged to Morgana:** The `hasContent` guard checks `_formData.LongBody` BEFORE `SyncQuillContentAsync()` runs (which is only called inside `SaveDraft()`). If the Quill 5-minute interval hasn't fired yet, the form fields are stale and a legitimate autosave tick is silently skipped. Not Selene's bug to fix — her PR introduced `SyncQuillContentAsync` but didn't own `TryAutoSaveAsync`. Assigned to Morgana for the correct fix (move sync before the guard, or merge the guard into `SyncQuillContentAsync`'s result).
- **`AddSubjectTag`:** No `StateHasChanged()` needed — called from `@onclick` (Blazor event handler, auto re-renders). ✅
- **`OnLongBodyChanged` style:** `private Task` returning `Task.CompletedTask` without `async` — consistent with `OnShortBodyChanged` and `SaveFeedSelections`. ✅
- **`@ref` placement and `IsDisabled` binding:** Correctly placed on their respective `FO_RichTextEditor` components. `IsDisabled="@(!_longBodyHasContent)"` on short body is correct. ✅
- **`[Inject]` vs `@inject` alignment:** `Logger` and `AuthStateProvider` are `[Inject]` in code-behind; all service injections live in `@inject` in the razor. No mismatch. ✅
- **Pattern learned:** `JSDisconnectedException` should be caught in every JS interop method exposed as public API on a component, not just `DisposeAsync`.

### CmsPost InternalHeadline + Subject Tag Registry Review (2026-03-27)
- **Verdict:** APPROVED — all new files had copyright headers; all Vespera blockers resolved
- **InternalHeadline propagation:** field is wired end-to-end: domain → events → grain state Apply() × Create/SaveDraft/SoftDelete → gRPC contract → Map.cs → Blazor code-behind
- **Registry grain idempotency:** confirmed — RegisterTagAsync has case-insensitive duplicate guard; Apply() has the same guard as belt-and-suspenders; seeding is safe to call multiple times
- **gRPC field numbers:** no conflicts; InternalHeadline appended as new last field in each affected message; UpdateCmsPostRequest intentionally omits it (consistent with Update command scope)
- **Portal has its own `CmsPostFormData`** (in `Pages/Admin/UserStore/`) that uses `InternalTitle: string` as a UI binding target — distinct from the Domain's `CmsPostFormData` with `InternalHeadline: CmsPostInternalHeadline`. Two classes, same name, different namespaces. Mapping is correct (`InternalHeadline.Value` → `InternalTitle`), but the dual naming is a cognitive load risk.
- **Silent catch pattern in client services:** `CmsPostSubjectClientService` uses bare `catch { return []; }` — no logging. Advisory: client services should log at LogError on transport failure, consistent with server-side counterparts and team decision on logging levels.
- **Copyright inconsistency on modified files:** `CreateCmsPostCommand`, `CmsPostCreatedEvent`, `CmsPostFormData` (domain), `CmsPostGrainState`, `CmsPostEditorService`, `ServiceCollectionExtensions`, `IUserStoreClientGRPC` were substantially modified without copyright headers. Their PR-siblings (`SaveDraftCmsPostCommand`, `CmsPostSavedDraftEvent`) DO have headers — inconsistency is the tell. Per team decision #5, service-layer files that are substantially modified need headers. Advisory item; not a rejection since the charter rejection criterion is for NEW files only.
- **`async void UpdateSubjectSuggestions`** has try/catch — the previous issue (review #385) was addressed.

### CMS Editor Code Quality Pass — #385 Iteration 2 (2026-03-27)
- **Verdict:** APPROVED WITH DIRECT FIXES — all quality issues fixed in-place by River
- **Methods extracted:** `BuildSaveDraftCommand(UserId, CmsPost, CmsPostFeedId)` from 67-line `SaveDraftInternalAsync`; `BuildCreatePostCommand(UserId, CmsPostId)` + `TransitionToEditMode(CmsPostId, CreateCmsPostCommand, UserId)` from 71-line `CreatePostAndSaveDraftAsync`
- **Helpers extracted:** `BuildSubjectString()` and `ResolveSelectedAuthLevelId()` to eliminate duplication
- **View logic moved to code-behind:** `StatusLabel` and `StatusVariant` computed properties replace inline `@{...}` block in razor
- **`_vibeCheckResult = null` kept** — removing it causes CS0649 error (project has TreatWarningsAsErrors); stub is intentional for unconnected AI service; added explanatory comment
- **Razor cleaned:** 13 noise/TODO/indecision comment blocks removed; commented-out `FO_ButtonPrimary` (translation check) removed; `@* @attribute [SupplyParameterFromQuery] *@` removed (superseded by code-behind)
- **Advisory — double-toast on autosave:** `TryAutoSaveAsync` calls `SaveDraft()` which calls `SaveDraftInternalAsync()`, producing both "Utkast sparat automatiskt" and "Utkast sparat" toasts. Cosmetic issue; flagged for Selene/Morgana follow-up.
- **Advisory — collocated view models:** `CmsPostFeedViewModel`, `AudienceGroup`, vibe types etc. live in `CmsPostEditor.razor.cs`. Should migrate to own files once editor stabilises.
