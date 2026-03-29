# Lyra — History & Learnings

## Core Context

**Project:** ForestOmni (FO.Mother) — collaborative platform for the forest sector  
**Owner:** MajaSigfeldt  
**Stack:** C# (.NET 10), Blazor Server-Side, TailwindCSS, Orleans (distributed grains), Azure Container Apps  
**UI System:** FOUIKit — based on TailAdmin v1.3. Components use "FO_" prefix. Layout components use "Shell" prefix.  
**Component Reference:** `UIKit/src/FOUIKit/` — gallery app at `FOUIKit.GalleryApp`  
**Design Source:** https://v1-demo.tailadmin.com/ | Mapping: `UIKit/src/FOUIKit/FOUI-TAILADMIN-MAPPING.md`  
**Visual Docs:** Playwright-MCP available for screenshot capture (configured in `.mcp.json`)  
**Breakpoints:** Mobile, tablet, desktop — all screens must be designed for all three  

**Key services with UI components:**
- Portal (`Portal/`) — main Blazor SSR web app, the primary user-facing surface
- UserStore UIAdminComponents — admin UI for user/token management
- BuckingControl — simulation UI
- MachineSuite, ForestRegistry, ObjectManagement — domain UIs

**HprViewer data flow:** Filter → Map → optional selection → drives Summary, Donut, Scatterplot, Stem Table  
Selection-aware components use `GetStemsForVisualization()`.

## Learnings

<!-- Lyra appends her learnings here as she works -->

### CMS Post Editor UX Walk-through (squad/385)

**Confirmed patterns that work well:**
- `FO_Badge` (with `ShowDot="true"`) is the right component for inline status indicators. Use `BadgeVariant.Success/Warning/Default` for Published/Scheduled/Draft states.
- `FO_Text` inside an `FO_InputContainer` is a valid helper text pattern — renders as `<p>` directly below the input without needing a separate container.
- `FO_InputText` supports `Placeholder` param — always populate it on search fields so users know the minimum interaction (e.g. "Skriv minst 2 tecken...").
- `@if (!_flagHasContent)` guard inside `<EditForm>` before an RTE is a clean way to show a conditional disabled-state explanation.

**UX decisions made / confirmed:**
- Audience groups: domain only supports ONE auth level; changed `ToggleAudienceGroup` to single-select (Clear then Add). Card title updated to "Behörighet (välj en)" to set expectation.
- `fo-autocomplete-dropdown` and `fo-tag`/`fo-tag-list` CSS must be explicitly defined — FOUIKit has no built-in tag chip or autocomplete dropdown utility.
- Empty-state messages for required fields (feeds) should include a call-to-action ("välj via knappen nedan"), not just a status message.
- Inline `@{...}` code blocks in razor for computed badge variants are clean and buildable — no need to push to code-behind for simple render-logic.

**What to watch for in future CMS work:**
- `BreadcrumbItems` was empty — always check navigation context is populated in both `OnInitializedAsync` and `OnParametersSetAsync`.
- `FO_Badge.BadgeVariant` enum is a nested type; reference as `FO_Badge.BadgeVariant.Success` from inline razor `@{}` blocks.
- Short body RTE gated on `_longBodyHasContent` — always pair a disabled input with an explanation of WHY it's disabled.
