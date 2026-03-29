# Team Update: Selene
2026-07-01T000000Z: Fixed editor code-behind for InternalHeadline and subject tag registry. MapPostToFormData, SaveDraft, CreatePost, _loadedPost constructor updated.
# Project Context

2026-03-23T14:23: Moved CMS Razor files to UIAdminComponents. See orchestration-log/2026-03-23T14-23-selene.md.

- **Owner:** MajaSigfeldt
- **Project:** Witchy female squad bootstrap
- **Stack:** TBD
- **Created:** 2026-03-02T15:53:08Z

## Learnings

- Initial team seeded for frontend implementation work.

### 2026-03-17: CMS backend completion coordination

- Mapped CMS backend API contract gaps from a consumer perspective to prevent integration surprises late in delivery.
### 2026-05-30: Quill RTE UMD bundle approach

- The Quill setup decision: UMD bundle in wwwroot committed to git, loaded via script tag as global. rich-text-editor.js uses window.Quill not ES module imports. core.js was a broken fragment and is deleted.

### 2026-05-30: FO_RichTextEditor Value/ValueChanged wiring

- DotNetObjectReference must be created in OnAfterRenderAsync (firstRender) and disposed in DisposeAsync.
- `initQuill` now takes (elementId, heightPx, initialValue, dotNetRef, isDisabled) — order matters for JS interop.
- Use `quill.clipboard.dangerouslyPasteHTML(value)` to set initial HTML (not innerHTML assignment), so Quill's delta is consistent.
- The `[JSInvokable]` callback `OnEditorChanged` must be public.
- `IAsyncDisposable` is the correct interface for Blazor components that hold a DotNetObjectReference.

### 2026-05-30: FO_ImageCropper dynamic parameter removed

- Replaced `dynamic? Image` with `string? ThumbnailUrl` — callers must pass `.ThumbnailUrl` explicitly.
- Single caller was CmsPostEditor.razor: updated `Image="@_imageBeingEdited"` → `ThumbnailUrl="@_imageBeingEdited.ThumbnailUrl"`.
### 2026-06-13: CmsPostEditor autosave pattern

- Autosave uses `System.Threading.PeriodicTimer` (2-minute interval) started fire-and-forget from `OnInitializedAsync` via `_ = RunAutosaveLoopAsync()`.
- `RunAutosaveLoopAsync` loops on `WaitForNextTickAsync(_autosaveCts.Token)` and catches `OperationCanceledException` for clean teardown.
- Headline condition: `string.IsNullOrWhiteSpace(_formData.InternalTitle)` blocks autosave — no headline = no save.
- ShortBody condition is delegated to the `SaveDraft()` implementation (TODO comment): only save ShortBody if non-empty.
- `IAsyncDisposable` implemented via `CancelAsync` + `Dispose` on the `CancellationTokenSource` and `PeriodicTimer`.
- Toast shown via `ToastNotificationService.ShowToastNotification` (empty title, Swedish message "Utkast sparat automatiskt", `ToastNotificationLevel.Info`).

### 2026-06-13: Autosave exception guard pattern

- Wrap the `await TryAutoSaveAsync()` call inside the `PeriodicTimer` while-loop with an inner `try/catch` that swallows non-cancellation exceptions: `catch (Exception ex) when (ex is not OperationCanceledException)`. This keeps the timer loop alive even if a single autosave call throws unexpectedly.
- The outer `catch (OperationCanceledException)` at the loop level remains unchanged — it handles clean component disposal.

### 2026-06-13: JS debounce pattern for Blazor RTE

- For `text-change` in rich-text-editor.js, use a closure-scoped `var debounceTimer = null` + `clearTimeout`/`setTimeout(fn, 300)` pattern. This avoids per-keystroke Blazor Server round-trips while keeping C# form state (`_formData`) up-to-date well within the 2-minute autosave window.
- The debounce delay (300 ms) is intentionally conservative — sufficient to batch rapid keystrokes without introducing noticeable lag for the user.
- Component attribute name is `IsDisabled` (not `Disabled`) on `FO_ButtonSecondary` and `FO_ButtonDanger`. Always use `IsDisabled` at call sites.

### 2026-06-13: RTE 5-minute sync pattern

- Replaced 300ms debounce (`text-change` event) with a `setInterval` every 5 minutes — eliminates constant Blazor Server round-trips during typing; content syncs periodically instead.
- `window.quillInstances` registry (keyed by `elementId`) holds `{ quill, dotNetRef, syncInterval }` per instance — required for lifecycle management.
- `setQuillContent(elementId, html)` temporarily nulls `dotNetRef` before `dangerouslyPasteHTML` so a racing interval tick won't fire a callback during the paste — prevents feedback loops when Blazor pushes new `Value` externally (edit mode async load).
- `disposeQuill(elementId)` clears the interval and nulls `dotNetRef` before removing the registry entry — prevents callbacks to disposed Blazor components.
- C# side: `_isInitialized` flag + `_lastPushedValue` string guard in `OnParametersSetAsync` — skips pushing `Value` to Quill if it matches what we last set, preventing re-pushing content that arrived via the sync callback.
- `DisposeAsync` calls `disposeQuill` and catches `JSDisconnectedException` (circuit already gone — JS cleanup impossible, safe to swallow).
### 2025-07-11: CMS editor code-behind fix (Issue #385)

- Added [Parameter][SupplyParameterFromQuery(Name = "postId")] for edit-mode routing — Blazor SSR requires this attribute combo for query params, not just [Parameter].
- OnParametersSetAsync uses CmsPostId.TryParse(PostId, out var postId) — IdentityBase.TryParse accepts a raw GUID string (not the prefixed Namespace-{guid} format that Parse expects).
- LoadPageDataAsync fans out with Task.WhenAll then re-awaits the typed tasks; re-awaiting a completed Task<T> is safe and returns the cached result immediately.
- CreatePostAndSaveDraftAsync constructs a synthetic _loadedPost from the create command values to avoid a second grain round-trip before calling SaveDraftInternalAsync.
- TenantId.NotSet() (Guid.Empty) is the agreed placeholder until a Portal-level tenant context service exists — flagged with a TODO comment.
- CmsPostFeed.Name is a CmsPostFeedName (StringBase) — use .Value to get the raw string for the ViewModel.
- IdentityBase.NotSet() is the null-equivalent for all GUID-based CMS IDs (FeedId, ImageId, MailListId, AuthLevelId).
- UpdateSubjectSuggestions must be sync void (event handler pattern) with StateHasChanged() at the end, not sync Task.

### 2025-07-11: CmsPostEditor advisory fixes + D1 (Issue #385 follow-up)

- ILogger<T> injection on Blazor components: use `[Inject] private ILogger<T> Logger { get; set; } = default!;` — property syntax is required for Blazor DI injection; injected properties do NOT use underscore prefix.
- Silent `catch` blocks in Blazor components are dangerous — always log with `Logger.LogWarning(...)` before returning null or showing a toast. Bare catch swallows context that is critical for diagnosing production auth failures.
- `async void` event handlers (Blazor pattern for DOM events) MUST wrap their entire body in try/catch — an unhandled exception crashes the Blazor circuit with no recovery path.
- Private fields that hold mutable state should NOT use `{ get; set; }` property syntax. `_currentCmsPostId` and `_loadedPost` converted to plain fields — underscore prefix + property accessor syntax is misleading and inconsistent.
- D1 decision (TryAutoSaveAsync): autosave now creates a new post on the first timer tick when both `InternalTitle` is set AND at least one RTE body has content. Previously it returned early for null `_currentCmsPostId` — now it delegates to `CreatePostAndSaveDraftAsync()`. Subsequent ticks (post exists) call `SaveDraft()` and show the "Utkast sparat automatiskt" info toast.

### 2025-07-11: InternalHeadline ↔ Subject split (Issue follow-up)

- `CmsPost.InternalHeadline` (type `CmsPostInternalHeadline`) is the editor's private working title — never public. `CmsPost.Subject` is a semicolon-separated string of tag names.
- `MapPostToFormData`: reads `post.InternalHeadline?.Value` (null-safe — old grains may lack the field) → `_formData.InternalTitle`; reads `post.Subject.Value` and splits on `;` into `_formData.SubjectTags` as `CmsPostSubjectTagViewModel` list with `Id = Guid.Empty`.
- `SaveDraftInternalAsync`: builds `Subject` from `_formData.SubjectTags` joined by `;`; falls back to `_loadedPost.Subject` when list is empty (CmsPostSubject rejects empty strings). Passes `CmsPostInternalHeadline.Create(_formData.InternalTitle)` as the new `InternalHeadline` command param.
- `CreatePostAndSaveDraftAsync`: same tag-join pattern; defaults to `"untagged"` sentinel when no tags (brand-new post, no loaded state to fall back to). Passes `CmsPostInternalHeadline.Create(_formData.InternalTitle)` as last param in `CreateCmsPostCommand`. `_loadedPost = new CmsPost(...)` updated to pass `command.InternalHeadline` (14th param, now required).
- `TryAutoSaveAsync` autosave gate unchanged — `string.IsNullOrWhiteSpace(_formData.InternalTitle)` is still correct since InternalTitle maps to InternalHeadline.
- 2026-03-29: Implemented Issue #1 portfolio UI in `portfoliosigge.client` using typed project data, accessible click-to-reveal cards, responsive CSS Grid/Flex layout, required CSP/referrer meta hardening, and confirmed a clean `npm run build` pass.
