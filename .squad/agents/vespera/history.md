# Project Context

- **Owner:** MajaSigfeldt
- **Project:** Witchy female squad bootstrap
- **Stack:** TBD
- **Created:** 2026-03-12T08:35:39.8253538Z

## Learnings

### 2026-07-09: Post-build security review — Issue #1 Portfolio Page Setup (commit 43c14b3 + River's fixes)
- **Scope:** Post-implementation gate review of the full portfolio frontend: `index.html`, `App.tsx`, `projects.ts`, `App.css`, `index.css`.
- **All 3 pre-build mandatories confirmed:** Title = "Sigge — Developer Portfolio" ✅; CSP meta tag in `<head>` ✅; zero `dangerouslySetInnerHTML` ✅ (grep-verified).
- **River's fixes verified:** `aria-hidden={!isExpanded}` correctly inverts `isExpanded` on the card-details div ✅. `connect-src 'self'` replaces `connect-src 'none'` ✅.
- **CSP posture:** `style-src 'unsafe-inline'` is the only non-ideal directive — acceptable for Vite/React v1, negligible practical XSS risk since `script-src` remains `'self'`. `frame-ancestors` cannot be set via meta CSP (browser spec limitation); remains a deployment-phase concern covered by the `.htaccess` template.
- **XSS: clean.** Static data model eliminates the primary risk category entirely. All content flows through React JSX auto-escaping. Template literal IDs (`details-${project.id}`) use hardcoded static values, never user input.
- **External links:** Only one external link (GitHub footer). Has `rel="noopener noreferrer"`. Absent `target="_blank"` is intentional and more secure (no new browsing context). `noreferrer` still suppresses the Referer header on navigation.
- **No sensitive data.** No API keys, tokens, internal paths, or PII beyond the developer's public self-identification.
- **Deployment gate (not merge gate):** `.htaccess` HTTP security headers template must be deployed to Strato before go-live — specifically `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and HSTS after HTTPS is verified.
- **Pattern principle (new):** On a static portfolio, the meta CSP is a defence-in-depth layer, not the primary security boundary — it cannot set `frame-ancestors`. The HTTP headers layer (`.htaccess`) is mandatory for clickjacking and MIME-sniffing protection and must be treated as a go-live gate separate from the merge gate.
- **Verdict: APPROVED FOR MERGE.**

### 2026-07-09: Pre-build security review — Issue #1 Portfolio Page Setup (React 19 + Vite static site)
- **Scope:** Static portfolio SPA — React 19, TypeScript, Vite, ASP.NET Core backend (unused for this issue), Strato hosting target.
- **Threat model:** Very low attack surface by design (no user input, no auth, no DB, no API calls). Primary risk is developer habit: accidental `dangerouslySetInnerHTML` use is the only realistic XSS vector. Secondary risks are clickjacking, MIME-sniffing, and referrer leakage — all mitigated via HTTP headers.
- **Dependency posture:** All packages current (React 19.2.4, Vite 8.0.1, TS 5.9.3). No CVEs found. Established baseline: run `npm audit --audit-level=high` in CI when pipeline is set up.
- **index.html findings (MEDIUM):** Two mandatory changes before merge — (1) update `<title>` from scaffolding default "portfoliosigge.client" to real portfolio name; (2) add CSP meta tag as fallback. Charset and viewport already correct.
- **CSP for Strato (Apache .htaccess):** Authored full `.htaccess` template with `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, CSP, and deferred HSTS (only after HTTPS confirmed). `connect-src 'none'` correct for fully static site — must become `connect-src 'self'` if backend API calls are added in a future issue.
- **Coding rules established:** `dangerouslySetInnerHTML` banned for all project data fields. All project content must render via JSX interpolation (React auto-escaping). External links must carry `rel="noopener noreferrer"`. No secrets in source or committed `.env` files.
- **Green-lit:** Static hardcoded data, CSS class toggle for reveal, pure CSS dark mode, Vite build toolchain, React 19 JSX rendering patterns. Build approved to start.
- **Pattern principle (new for frontend):** For a static site, the security posture is set almost entirely at build time (no `dangerouslySetInnerHTML`, no secrets) and deploy time (HTTP headers). A clean `npm audit` baseline before first commit is the equivalent of the CMS pre-merge checklist for this stack.

### 2026-06-14: Pre-build security review — CmsPost domain overhaul (InternalHeadline + SubjectTagRegistry)
- **Scope:** CmsPostInternalHeadline field, CmsPostSubjectTagRegistryGrain (List + Search gRPC RPCs), RegisterTagAsync internal method, ICmsPostEditorService.GetPostAsync.
- **Highest risk finding (HIGH/BLOCKER):** InternalHeadline is an editor-private field (could contain sensitive internal drafts like "Q2 redundancy notice"). The existing `HandleGetCmsPostState` gRPC handler has no visible `IsAdminCaller` gate — InternalHeadline could leak via this read path. Confirmed existing precedent: all 9 CMS mutation handlers call `IsAdminCaller`, but read handlers are not uniformly gated. Pattern principle: **every handler that returns InternalHeadline must be admin-gated, including read handlers.**
- **Search oracle pattern (MEDIUM/BLOCKER):** `SearchCmsPostSubjectTags` with `OrdinalIgnoreCase Contains` is a search oracle — incremental probing can reveal whether sensitive tag names exist without needing list access. Mitigation: admin gate + minimum query length (≥2 chars) + rate-limit consideration.
- **Singleton grain capacity risk (LOW/NOTE):** `CmsPostSubjectTagRegistryGrain` is a singleton with no documented capacity bound. Before `RegisterTagAsync` is exposed via gRPC, a hard tag count limit (recommended ≤500) and tag name allowlist validation must be added to prevent state bloat and future XSS at rendering sites.
- **Security contract update required (MEDIUM/NOTE):** `ICmsPostEditorService` SECURITY CONTRACT comment (CMS-R2) covers only HTML sanitization. It must be extended with a CMS-R11 clause explicitly forbidding `InternalHeadline` from appearing in public-facing DTOs or API responses.
- **Grain state persistence scope (MEDIUM/NOTE):** InternalHeadline is stored permanently in the event log. If it can contain personal data (names in draft titles), this is in-scope for the existing DPO retention review (CMS-R4 class). Must be confirmed with DPO before implementation ships.
- **Logging/tracing leakage (MEDIUM/BLOCKER):** gRPC transport is TLS-safe, but structured logging (Serilog/Seq) and OpenTelemetry traces (Aspire Dashboard) can capture full gRPC request bodies at Debug level. InternalHeadline must be identified as a scrubbed field, and the proto field must carry a `// SECURITY: Do not log` comment.
- **Idempotency principle reconfirmed:** Grain seeding for tags should follow the established CmsPostFeedSeedingService pattern — always attempt `RegisterTagAsync`, treat "already exists" result as Info, log genuine failures as Error.
- **4 blockers raised** (findings 1, 3, 4, 5) — must be resolved before build ships. 4 notes raised — must be addressed before merge.

### 2026-06-11 (PR #365): Hardcoded cert password removed — Certs/Fix-My-Certs.ps1
- **Finding:** `$password = "a20651cd23f34f0dbb9200f3ee985ff9"` was committed in `Certs/Fix-My-Certs.ps1` on branch `squad/cms-connect-backend-to-views`. Even in dev-only scripts, hardcoded credentials normalise bad habits and leak via clone/fork.
- **Fix applied:** Replaced with env var check (`$Env:ADMINPORTAL_CERT_PASSWORD`) followed by `Read-Host -AsSecureString` fallback. Secure string memory zeroed via `Marshal.ZeroFreeBSTR` in `finally` block.
- **Pattern principle:** Dev scripts committed to source control must never hold plaintext secrets. Env var first, secure prompt second — this order supports both CI/CD pipelines and manual dev use without a committed credential.
- **Follow-up recommendation:** Add `ADMINPORTAL_CERT_PASSWORD` to `.env.example` so developers know to set it locally. The value must never appear in any committed file.

### 2026-06-11 (PR #354 follow-up): Soft-delete retained-field assertions added — CmsPostGrainStateReplayTests
- **Gap closed:** `CmsPostGrainState.Apply(CmsPostSoftDeletedEvent)` explicitly retains `LengthType` and `Language` (documented in state comment as non-sensitive audit fields) but neither soft-delete replay test asserted those fields were still set after the transition.
- **Fix applied:** Added `state.LengthType.Should().Be(...)` and `state.Language.Should().Be(...)` assertions to both `Apply_FullLifecycleSequence_CreatedUpdatedPublishedSoftDeleted_ReachesExpectedFinalState` and `Apply_ShortSequence_CreatedThenSoftDeleted_ReachesExpectedFinalState`. Full lifecycle test checks values from the last `updatedEvent`; short sequence test checks values from `createdEvent`.
- **Regression protection principle:** Every field explicitly documented as "retained" in a grain state transition must have a corresponding test assertion. The state comment is the contract — the test is its enforcement. If the comment says retained, a test must say `.Should().NotBeNull()` or `.Should().Be(expectedValue)`.
- **4/4 replay tests pass** after the change (commit `4849ffc4`).

### 2026-06-11 (final sign-off): PR #354 opened — squad/349-cms-risk-checks → cms-devbranch
- **Final verification passed:** Both conditional-approval commits confirmed present — `57436de3` (Nyx: TenantId/CreatedByUserId immutability in replay tests) and `758e15b6` (Vespera: CMS-R8 try/catch + IsAdminCaller SECURITY comment).
- **Replay test assertions confirmed:** `CmsPostGrainStateReplayTests` asserts `TenantId` and `CreatedByUserId` on full lifecycle, last-update-wins, and determinism tests. `CmsPostFeedGrainStateReplayTests` asserts `TenantId` across all paths. Fixed timestamps (`DateTimeOffset.Parse` literals) confirmed — no `UtcNow` drift risk.
- **CMS-R8 grain fix confirmed:** Both `CmsPostGrain.Handle(SoftDeleteCmsPostCommand)` and `CmsPostFeedGrain.Handle(SoftDeleteCmsPostFeedCommand)` wrap `RemoveRelationshipAsync` in try/catch with structured `LogError`. Grain state transition always completes; SpiceDB orphan is detectable out-of-band.
- **IsAdminCaller documented:** `// SECURITY:` comment at definition (line 78–80), all 9 CMS mutation handlers verified to call it (lines 687, 719, 751, 783, 815, 847, 907, 939, 973).
- **PR already existed:** `gh pr create` reported PR #354 was already open at the correct head/base. This is the expected state — the PR was pre-created. Final sign-off is the authorisation to merge.
- **Sign-off principle:** Final security sign-off is a verification pass, not a rubber stamp. Check each condition individually against the actual code, not just the commit message.

### 2026-06-11 (fix pass): CMS-R8 remediated and IsAdminCaller boundary documented — branch squad/349-cms-risk-checks
- **CMS-R8 fix:** Added try/catch around `RemoveRelationshipAsync` in both `CmsPostGrain.SoftDelete` and `CmsPostFeedGrain.SoftDelete`. The grain state transition now always completes; SpiceDB failure is logged at `Error` with structured context (entity ID, TenantId) so orphaned relationships are detectable out-of-band. Added `ILogger<T>` injection to both grains.
- **Availability principle confirmed:** SpiceDB cleanup on soft-delete is best-effort. An outage in a peripheral service (SpiceDB) must never block a legitimate business operation (soft-delete). Pattern to follow for all future grain-level side-effect calls to external services.
- **IsAdminCaller boundary documented:** Added `// SECURITY:` comment above `IsAdminCaller` in `UserStoreService.cs` and strengthened the pre-merge checklist to explicitly state there is no `[Authorize]` attribute fallback. Every new handler MUST call `IsAdminCaller()` explicitly. This is now a named architectural constraint in both code and checklist.
- **Checklist-as-enforcement:** Pre-merge checklist items should use concrete, negative framing ("NOT silently swallowed, NOT blocking the operation") to reduce ambiguity for future reviewers.

### 2026-06-11: Security audit of branch squad/349-cms-risk-checks (Issue #349 post-delivery review)
- **Verdict:** CONDITIONAL APPROVAL — no critical vulnerabilities; 3 concrete replay-test assertion gaps require fixing before merge.
- **Key finding pattern — replay test completeness:** The most comprehensive lifecycle test (`Apply_FullLifecycleSequence`) must always assert immutable identity fields (`TenantId`, `CreatedByUserId`) are preserved through every state transition, not only in shorter tests. The "last update wins" test must also assert identity fields don't change. This is the replay-test security invariant rule for all future grain state tests.
- **Key finding pattern — update proto documentation:** When `TenantId` is intentionally absent from an update proto, the absence must be documented explicitly (not just silently absent). `UpdateCmsPostFeedRequest` does this correctly with `reserved 5`; `UpdateCmsPostRequest` does not. Asymmetry creates regression risk.
- **Checklist gaps identified:** CMS-R5 (admin role placeholder), CMS-R8 (SpiceDB exception handling), and explicit actor/audit field naming are missing from the security gate checklist. Risk register items that are Open should always have a corresponding gate in the checklist.
- **CI workflow:** Floating action tags (`@v4`) and missing `permissions:` block are consistent low-level hygiene issues to address across all workflows. Low severity for test-only workflows with no secret access.
- **Cross-ref lesson:** DTO contract doc and security gate checklist must be kept in sync with the open items in `security-controls.md`. The risk register is only useful if the checklist gates reflect it.

### 2026-06-01 (second pass): Full security audit — branch squad/349-cms-risk-checks
- All 9 CMS mutation handlers confirmed with `IsAdminCaller` gate (UserStoreService.cs lines 684, 716, 748, 780, 812, 844, 904, 936, 970). TenantId immutability confirmed. `reserved 5` in UpdateCmsPostFeedRequest confirmed. Split try/catch in both SoftDelete handlers confirmed.
- **Doc fix committed (security-controls.md, be673cba):** §6.2 admin gate rejection test coverage was overstated — only 2 of 9 handlers have explicit non-admin rejection tests. Corrected to ⚠️ Partially covered. §6.3 matrix corrected: added audit field retention and replay determinism rows; admin gate row now accurate.
- **Naming inconsistency documented:** `PublishCmsPostNow`/`ScheduleCmsPost` use `UpdatedByUserId`; all others use `ActorUserId`. No security gap but noted in §4.1 as maintenance risk.
- **Highest-risk unmitigated: CMS-R8** — `RemoveRelationshipAsync` awaited but unhandled in soft-delete grain handlers. Could produce SpiceDB/grain state inconsistency if SpiceDB is unavailable at delete time. Graceful degradation required.
- **Defense-in-depth gap:** `IsAdminCaller` is the sole auth enforcement point — no declarative `[Authorize]` attribute fallback. If the method-level check is accidentally omitted in a future handler, no secondary net catches it.
- **CI bypass:** Integration tests only run on PR to main — direct push to main skips integration lane. No secrets scanning or SAST in cms-tests.yml.
- **P0 action item:** `CmsAdminRole = "cms_admin"` placeholder must be replaced with finalized role name before production deploy.



### 2026-03-21T15xxZ: Issue #349 — CMS risk checks
- Authored docs/cms/security-gate-checklist.md: formalized phase exit and pre-merge security gates for CMS. Checklist now required for all CMS phases and PRs.
- All changes merged to squad/349-cms-risk-checks, decisions.md updated, inbox cleared.


2026-06-01: Added CMS security gate checklist (Issue #349) — formalized phase exit and pre-merge security gates for CMS. Checklist covers IsAdminCaller enforcement, input validation, TenantId immutability, event correctness, SpiceDB hygiene, and test coverage. This pattern is now required for all CMS phases and PRs.

2026-03-21: Updated security-controls-cms-347.md to reflect adoption of CMS-R10 Option A (IsAdminCaller replaces grain-level SpiceDB checks), CMS-R2 accepted by design, and all prior release blockers resolved or reclassified.

### 2026-03-19: Three doc accuracy fixes (r2960152262 / r2960152098 / r2960152193)

- **Fix 1 (security-controls.md §1.2 line 72, r2960152262):** Deleted the stale bullet stating that `SpiceDbPermission` does not yet include CMS-specific constants. This was resolved in CMS-R7 (marked Resolved in the risk table); the bullet was misleading and contradicted the risk table.
- **Fix 2 (security-controls.md §5 CMS-R8, r2960152098):** Updated CMS-R8 description from "fire-and-forget" to the accurate characterisation: the call is `awaited` but exceptions propagate unhandled, causing soft-delete to fail unexpectedly. Mitigation text updated to reflect graceful degradation framing.
- **Fix 3 (completion-report.md §7 CMS-R8, r2960152193):** Aligned the open-items checklist entry with the corrected CMS-R8 description — replaced "fire-and-forget" with "awaited but exceptions propagate as unhandled failures".
- Key principle reinforced: "fire-and-forget" and "awaited-but-unhandled" are distinct failure modes with different blast radii — the former silently loses the call, the latter surfaces errors to the caller at an unexpected point.

### 2026-03-19: CMS documentation cleanup (post-Issue #347)

- Resolved contradiction between `security-controls.md` §2.3 (Enumeration Risk) and §5 (Known Risks CMS-R2). Section 2.3 previously carried a HIGH risk warning with numbered mitigation options; updated to an ℹ️ accepted-by-design note referencing CMS-R2 (Sigge decision 2026-03-19).
- Updated `completion-report.md` to reflect post-#347 reality: Section 3 Security Status now correctly states all 9 mutations are admin-gated and that cross-tenant list endpoints are accepted by design. Removed two stale BLOCKER lines and the stale mitigations sentence.
- Section 6 Ops Readiness updated: removed "not production-ready due to two security blockers" language; replaced with accurate description of admin role gate and CMS-R2 acceptance.
- Section 7 Open Items: removed both BLOCKER checklist entries. Kept genuinely open non-blocking items: admin role name placeholder (CMS-R5), DPO retention confirmation (CMS-R4), SpiceDB fire-and-forget error handling (CMS-R8), actor UserId on mutations, and integration tests. Removed items that were either resolved (SpiceDB constants — CMS-R7) or accepted (TenantId validation on update handlers — CMS-R9).

- Added as Security Specialist to provide pre-build security guidance and post-build security review.
- Works with Freya to ensure documentation and runbooks include security-safe guidance.
- Hardened the secure documentation checklist to require threat assumptions, trust boundaries, authn/authz + least privilege, safe logging/PII, supply-chain awareness, and remediation ownership across pre-build and post-build gates.
- Applied grain-state soft-delete security test pattern: after soft delete, sensitive/content-bearing fields must be nulled or otherwise unreadable to prevent projection-layer data leakage.
- Established CMS grain-state TDD pattern: tests intentionally target not-yet-implemented grain states and define lifecycle transitions plus security invariants up front.

### 2026-03-17: CMS backend completion coordination

- Identified security-critical CMS backend gaps and produced a release security checklist for completion readiness.
- Coordinated with Freya so documentation/traceability explicitly captures security controls, residual risk, and release gate expectations.

### 2026-03-19: CMS-R1 closed/fixed

- CMS-R1 (SpiceDB permission checks for all CMS mutations) is now closed and fixed. All mutation handlers enforce authorization checks. Release blocker resolved.

### 2026-03-18: Phase 5 — SpiceDB CMS schema additions (Issue #345)

- Added `cms_post` and `cms_post_feed` resource definitions to **both** schema.zed copies: `SpiceDB/schemas/schema.zed` (canonical) and `UserStore/src/FO.Identity.UserStore.SpiceDB/Schema/schema.zed` (UserStore copy). Both must always be kept in sync per the shared schema policy.
- Permission model pattern: `owner->managers` for all management-level operations (create, delete, publish, admin edit); `owner->internal_contributor + owner->managers` for read access; `creator + owner->managers` for self-service edit on `cms_post` (creator is a `user` relation, enabling content authors to edit their own posts without full manager rights).
- `cms_post_feed` has no `creator` relation — feed management is manager-only by design (feeds are structural, not author-owned).
- Both schema copies must be kept in sync on every future schema change; this is a known maintenance discipline risk for this codebase.

### 2026-03-19: CMS security controls document (Issue #347)

- `CmsPostAuthLevel` / `CmsPostAuthLevelId` is metadata-only — it does not drive any server-side read or write gate. Auth level is a presentation-layer label, not a permission check.
- SpiceDB schema is correctly defined for `cms_post` and `cms_post_feed`, and relationship writes/removes are correctly wired in grains. However, `CheckPermissionAsync` is never called before any CMS mutation — the permission check gate is wholly absent.
- `ListCmsPostIds` and `ListCmsPostFeedIds` return all IDs cross-tenant with no filter — a high-severity enumeration risk.
- Soft-delete field clearing is correctly implemented: `CmsPostGrainState.Apply(CmsPostSoftDeletedEvent)` nulls all content-bearing fields. `CreatedByUserId` is retained — confirm GDPR posture with DPO.
- No actor `UserId` is present in several gRPC mutation request messages (update, save draft, publish, schedule, soft-delete for posts) — this blocks wiring of SpiceDB `can_edit`/`can_delete`/`can_publish` checks.
- `SpiceDbPermission` constants class lacks CMS-specific permission constants — magic strings risk if checks are wired informally.

### 2026-06-11: Pre-build security review — CMS Razor view wiring

- **Two release blockers identified:**
  - CMS-R1: Both `CmsStartPage.razor` and `CmsPostEditor.razor` use bare `@attribute [Authorize]`. Every other admin view in the same solution uses `@attribute [Authorize(Policy = "AdminOnly")]`. Any authenticated user (regular forest-sector user) can reach the CMS admin interface once routes are wired. Fix: apply `AdminOnly` policy before any backend wiring.
  - CMS-R2: `HtmlSanitizer` (Ganss.Xss) is correctly applied in preview popups, but the service layer has no visible sanitization before persisting HTML content to blob/grain state. Preview sanitization is cosmetic — the service is the trust boundary. Stored XSS risk for all post readers if unsanitized HTML reaches storage.
- **High-priority risks:**
  - Blob uploads (`IBlobStorageService`) injected directly into UIComponents — no MIME type validation, no enforced max SAS TTL, no file size cap, tenantId not validated against authenticated claims. Prefer routing through FileStore gRPC.
  - `IAiAnalysisService` receives raw rich-text HTML (user-controlled) — prompt injection vector. Data leakage risk if a third-party model API is used. Requires: strip HTML to plain text before AI, system prompt scoping, structured response validation, rate limiting, documented data boundary.
- **Medium risks:**
  - Mail dispatch: `IMailDispatchService` must bind to predefined `CmsPostMailListId`, not free-form addresses. `From:` must be system-controlled. SPF/DKIM/DMARC confirmation required before production.
  - CMS views in wrong assembly (`UIComponents` not `UIAdminComponents`) — over-privilege in DI registration, no service-layer re-authorization equivalent to `IsAdminCaller` pattern from PR #354.
- **Established pattern reinforced:** `[Authorize(Policy = "AdminOnly")]` + service-layer `IsAdminCaller` check = defense-in-depth. Neither layer alone is sufficient.
- **Key principle:** Preview-time sanitization (client-side) never substitutes for write-time sanitization (service layer). The trust boundary is the service, not the UI.

### 2026-06-11: FINAL SIGN-OFF — CMS wiring scaffold (branch squad/cms-connect-backend-to-views)

- **Verdict: ✅ APPROVED FOR PR** — both post-build conditions verified against live code.
- **Condition 1 (IHtmlSanitizer DI):** `Configuration.cs` line 24 registers `IHtmlSanitizer` as singleton. `CmsPostEditor.razor` line 39 and `CmsStartPage.razor` line 22 both `@inject IHtmlSanitizer HtmlSanitizer`. All 3 render paths (`LongBody`, `ShortBody`, `HtmlBody`) confirmed using `HtmlSanitizer.Sanitize(...)`. No bare `new HtmlSanitizer()` remains.
- **Condition 2 (Service contract):** `ICmsPostEditorService.cs` lines 7–13 carry the SECURITY CONTRACT XML doc comment: names `LongBody`/`ShortBody`, states service is the trust boundary, specifies `IHtmlSanitizer` singleton DI pattern.
- **CMS-R1: ✅ Closed** (resolved prior build — `AdminOnly` policy confirmed).
- **CMS-R2: ✅ Closed** — both conditions satisfied in this build.
- **CMS-R3 to R6: Carry forward** — stubs with embedded security notes; each closes in its own implementation PR. Binding obligation documented in `vespera-cms-final-signoff.md`.
- **Sign-off written to:** `.squad/decisions/inbox/vespera-cms-final-signoff.md`

### 2026-06-11: Post-build security review — CMS Razor view wiring (branch squad/cms-connect-backend-to-views)

- **CMS-R1 CLOSED:** Both `CmsStartPage.razor` (line 27) and `CmsPostEditor.razor` (line 45) confirmed to carry `[Authorize(Policy = "AdminOnly")]`. Authorization blocker fully resolved.
- **CMS-R2 PARTIAL:** All three `(MarkupString)` render paths in the views are correctly guarded by `HtmlSanitizer().Sanitize(...)`. However, `ICmsPostEditorService` interface has no sanitization requirement documented in its contract, and inline `new HtmlSanitizer()` instances were not converted to DI-injected `IHtmlSanitizer`. View-layer XSS risk is covered; service-layer trust boundary is not documented. Must be resolved before service implementations are written.
- **Stub security notes confirmed:** `ICmsPostAiAnalysisService` (CMS-R4), `ICmsBlobStorageService` (CMS-R3), and `ICmsMailDispatchService` (CMS-R5) all carry binding Vespera security notes. These notes are the enforcement path for CMS-R3/R4/R5 in their respective implementation PRs.
- **Code-behind scaffolds — no new release blockers:** `_validationErrors` rendered as Blazor-encoded text (safe). `OnLongBodyChanged`/`OnShortBodyChanged` pass raw HTML to `_formData` — acceptable because sanitization is at service layer, but requires the CMS-R2 condition to be fulfilled.
- **Domain interface placement is a security improvement:** Interfaces in Domain define the contract; implementations must satisfy it. Reduces over-privilege in DI. Consistent with `IsAdminCaller` defense-in-depth pattern from PR #354.
- **Verdict:** ⚠️ CONDITIONAL — CMS-R1 closed, CMS-R2 partially addressed. Two conditions before full approval: (1) add sanitization requirement to `ICmsPostEditorService` XML doc, (2) convert inline `new HtmlSanitizer()` to DI-injected `IHtmlSanitizer` before first non-stub service implementation PR.
- **Principle reinforced:** Interface contracts are where security requirements must be documented — they are the single source of truth that both the UI and the implementation reference. A stub interface without a security comment is a silent gap in the enforcement chain.

## User Preference
The user's name is **Sigge**. Always address them as Sigge — never Maja, MajaSigfeldt, or any other variant.
