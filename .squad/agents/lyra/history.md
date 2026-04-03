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

### PortfolioSigge CSS Design System (2026-07-10)

**Context:** React/TypeScript/Vite portfolio — pure CSS, no Tailwind. Always-dark design (no prefers-color-scheme). Sharp corners, dark emerald accent (#065f46 / #10b981), Inter from Google Fonts.

**Design decisions made:**
- Color tokens use --color-* prefix to match the new brief from Maja.
- NO border-radius anywhere — including badges, buttons, cards, inputs, skill bars.
- Inter via Google Fonts @import — can swap for local files when performance matters.
- Mobile-first breakpoints: base=phone, 768px=mobile overrides, 1024px=tablet.
- Hero uses background-attachment: fixed for parallax — degrades to scroll on mobile.
- Hero overlay: semi-transparent dark gradient keeps text legible on any photo.
- Project grid: CSS Grid auto-fill + minmax(300px, 1fr) — auto-responsive.
- .section-title uses ::before pseudo-element for a left accent bar.
- Contact inputs: 1px solid --color-border, focus border swaps to --color-accent-light.
- Skills: custom CSS bar where fill width is set via inline style from React.
- prefers-reduced-motion kills all transitions including skill bars.

**Files written:**
- src/index.css — tokens, resets, base typography, Google Fonts import
- src/App.css — nav, hero, cards, grid, footer, responsive
- src/styles/pages/home.css — home hero with parallax and overlay
- src/styles/pages/projects.css — project grid, filter tabs, card images
- src/styles/pages/about.css — two-column about layout, timeline
- src/styles/pages/contact.css — contact form, input styles, sidebar
- src/styles/pages/skills.css — skill bars, tag cloud, CV entries

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

### PortfolioSigge Design Spec (2025-01-28)

**Context:** React/TypeScript/Vite portfolio site, pure CSS (no Tailwind). Dark mode via `prefers-color-scheme`.

**Design decisions made:**
- 6-step spacing scale (4/8/16/24/48/64px) — near-doubling progression feels natural for a portfolio.
- Card expand/collapse uses `max-height` + `opacity` transition (0.4s, cubic-bezier ease-out). Avoids `display:none` which kills transitions. 500px ceiling for max-height is generous enough for any card content.
- `auto-fill` + `minmax(320px, 1fr)` grid handles responsive columns without explicit breakpoints. Only override to `1fr` below 640px as a safety net.
- Sticky nav with `backdrop-filter: blur(12px)` and semi-transparent bg for frosted glass effect.
- Badge pills use monospace font (`var(--mono)`) to visually distinguish tech terms from prose.
- Focus ring uses `box-shadow` (not `outline`) so it respects `border-radius` on rounded elements.
- `prefers-reduced-motion` kills all transitions — essential for accessibility.
- Existing `--accent` purple (#aa3bff light / #c084fc dark) passes contrast checks on all proposed card/badge backgrounds.
