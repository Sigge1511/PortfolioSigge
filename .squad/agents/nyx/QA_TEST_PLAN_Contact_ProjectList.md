# QA Testing Plan: Contact Page v2 + ProjectList Integration
**Created by:** Nyx (QA/Test Engineer)  
**Date:** 2026-03-29  
**Requested by:** MajaSigfeldt  
**Phase:** Testing entry (visual regression + functional)  

---

## Executive Summary

Two features are entering QA: **Contact Page (v2 visual overhaul)** and **ProjectList integration into Projects page**. This plan defines acceptance criteria, test scope, manual verification steps, and automation opportunities for both components.

---

# PART 1: CONTACT PAGE QA

## Feature Overview
- **Goal:** Redesigned contact page with full-width parallax banner, prominent contact links, and contact form.
- **Supported browsers:** Chrome, Firefox, Safari (spot check).
- **Responsive breakpoints:** Mobile (320px), Tablet (768px), Desktop (1024px+).
- **Accessibility baseline:** WCAG 2.1 Level AA.

## 1.1 Visual Regression Tests

### Banner (Hero Section)
- [ ] **Visual baseline:** Capture screenshot at 1920px, 1024px, 768px, 320px to establish baseline
- [ ] **Parallax effect:** Scroll from top to 50% viewport down—banner should move at 50% of scroll speed (background-attachment: fixed)
- [ ] **Gradient overlay:** Dark emerald gradient (135deg, rgba(5,51,17,0.6) → rgba(8,64,23,0.6)) visible over hero image
- [ ] **Title positioning:** "Get in touch" centered both horizontally and vertically within banner
- [ ] **Title font:** clamp(2.5rem, 10vw, 4rem)—size responsive, no text overflow
- [ ] **Banner height:** clamp(300px, 50vh, 500px)—responsive, no crushing or excess whitespace
- [ ] **No layout shift:** Banner is below nav (64px), no overlap or jank on page load

### Contact Links Section
- [ ] **Links visible:** All 3 links (GitHub, Email, LinkedIn) render below banner
- [ ] **Link layout:** Flex column, borders between items, proper spacing (24px vertical padding per link)
- [ ] **Link text size:** clamp(1.25rem, 3vw, 1.5rem)—responsive sizing
- [ ] **Link text color:** Matches `--text-primary` (#f5f5f5) in default state
- [ ] **Arrow icon:** Right-pointing arrow (→) appears to right of link text, color `--text-muted` (#525252)
- [ ] **Hover state:** On hover, link text + arrow turn accent color (#053311), arrow translates 8px right
- [ ] **Border styling:** Top and bottom borders (1px solid #2a2a2a), visible and properly spaced
- [ ] **Container max-width:** 1200px, centered with proper left/right padding (40px on desktop, 20px on mobile)

### Contact Form Section
- [ ] **Form visible:** Appears below links, full-width at mobile, right column at desktop (grid: 1fr 1fr at desktop)
- [ ] **Labels present:** Name, Email, Message labels visible, styled in uppercase, letter-spacing: 0.1em, color: `--text-muted`
- [ ] **Input styling:** Background `--bg-secondary` (#1a1a1a), border 1px solid `--border` (#2a2a2a)
- [ ] **Button visible:** "Send" button appears below message textarea
- [ ] **Button styling:** Check button color matches design intent (accent color), proper height/padding
- [ ] **No text overflow:** All form elements responsive, no horizontal scroll on mobile

## 1.2 Responsive Breakpoint Testing

### Mobile (320px – 767px)
- [ ] **Layout:** Single-column stack (contact links + form stacked)
- [ ] **Banner height:** ~250px at 320px viewport
- [ ] **Parallax disabled:** On mobile, parallax effect is not janky (or removed per design intent)
- [ ] **Touch targets:** All clickable elements (links, inputs, button) ≥44px tall
- [ ] **Form inputs:** Full-width, proper vertical spacing between fields
- [ ] **No horizontal scroll:** Content fits within 320px viewport
- [ ] **Font scaling:** Text remains readable at 320px (no tiny font at smaller sizes)

### Tablet (768px – 1023px)
- [ ] **Layout:** Contact links + form may use 2-column grid or adjust based on space
- [ ] **Banner height:** Scales responsively via clamp
- [ ] **Parallax smooth:** No jank, smooth scroll effect observed
- [ ] **Touch targets:** Still ≥44px for form inputs and buttons
- [ ] **Spacing:** Proper gap between sections (80px on desktop → proportionally smaller at tablet)

### Desktop (1024px+)
- [ ] **Layout:** 2-column grid (contact links left, form right), 80px gap
- [ ] **Banner height:** ~400–500px, matches clamp values
- [ ] **Max-width:** 1200px container, centered with padding
- [ ] **Parallax smooth:** Background image moves noticeably slower than scroll
- [ ] **Hover effects:** All interactive elements respond correctly to hover

## 1.3 Form Interaction Tests

### Text Inputs (Name, Email)
- [ ] **Focus state:** Clear focus ring/indicator visible (outline or border change)
- [ ] **Placeholder text:** Visible on all inputs, disappears when user types
- [ ] **Input acceptance:** Can type text without errors
- [ ] **Email validation (client-side):** Email input type="email" shows native browser validation UI
- [ ] **Blur handling:** No console errors when focus leaves field

### Textarea (Message)
- [ ] **Focus state:** Clear focus ring, matches input styling
- [ ] **Rows:** Renders with ~6 rows visible (rows={6})
- [ ] **Resizable:** Can resize (or constrained per design) without breaking layout
- [ ] **Placeholder visible:** Clears when user types

### Submit Button
- [ ] **Click handler:** Currently prevents default (e.preventDefault()), no form submission attempt
- [ ] **Hover state:** Visual feedback on hover (color, shadow, transform)
- [ ] **Disabled state (if applicable):** Not implemented yet, but button should be clickable
- [ ] **Keyboard accessible:** Can reach via Tab and activate via Enter/Space

## 1.4 Keyboard Navigation & Focus Management

- [ ] **Tab order:** Navigation → Banner → Contact Links (all links accessible) → Form inputs (Name → Email → Message → Submit)
- [ ] **Focus visible:** Every interactive element has visible focus indicator (outline or border)
- [ ] **No focus trap:** Tab key moves forward, Shift+Tab backward, wraps appropriately
- [ ] **Skip links:** If nav is present, verify contact page links work in skip-link flow
- [ ] **Link focus:** Links (GitHub, Email, LinkedIn) receive focus, visual feedback on focus
- [ ] **Form focus:** Each form input receives focus in order, focus is visible

## 1.5 Accessibility (WCAG 2.1 Level AA)

### Headings & Semantic Structure
- [ ] **Banner title:** `<h1>` tag (only one on page)
- [ ] **Form labels:** Associated with inputs via `htmlFor` → `id` matching
- [ ] **Headings hierarchy:** Proper nesting, no skipped levels

### Color Contrast
- [ ] **Text vs. background:** All text meets minimum 4.5:1 contrast for normal text, 3:1 for large text
  - [ ] Primary text (#f5f5f5) on dark background (#111111): ✅ ~18:1
  - [ ] Accent text on dark background: Check contrast ratio
  - [ ] Muted text (#525252) on dark (#111111): Check ratio (may be borderline)
- [ ] **Links:** Underlined or sufficient contrast to background; hover state clear

### Form Accessibility
- [ ] **Labels visible:** All inputs have visible labels, not just placeholder text
- [ ] **Label-to-input association:** `<label htmlFor="name">` matches `<input id="name">`
- [ ] **Required fields:** If any, marked with `required` attribute and visual indicator
- [ ] **Error handling:** When implemented, error messages tied to input via `aria-describedby`

### Screen Reader Testing (Keyboard + Screen Reader)
- [ ] **Banner title announces:** "Get in touch, heading level 1"
- [ ] **Links announce destination:** "GitHub, link" / "Email, link" / "LinkedIn, link"
- [ ] **Form field labels:** "Name, text input" / "Email, email input" / "Message, textarea"
- [ ] **Button announces:** "Send, button"
- [ ] **No redundant text:** Form not nested inside form (HTML validation)

### Keyboard-Only Users
- [ ] **All interactions work:** Can navigate entire page, click links, fill form, submit (when implemented)
- [ ] **No keyboard traps:** Can exit any section
- [ ] **Focus management:** Focus moves logically

## 1.6 Cross-Browser Spot Checks

### Chrome (Latest)
- [ ] **Parallax smooth:** No jank, ~60fps on scroll
- [ ] **Styles render correctly:** Colors, spacing, fonts all match design
- [ ] **Form inputs responsive:** No browser-specific artifacts
- [ ] **CSS custom properties:** All `var(--*)` resolve correctly

### Firefox (Latest)
- [ ] **Parallax smooth:** Similar performance to Chrome
- [ ] **CSS Grid:** Contact links and form layout render correctly
- [ ] **Form styling:** No Firefox-specific input styling issues
- [ ] **Focus indicators:** Visible and consistent

### Safari (Latest) — Spot Check
- [ ] **Parallax:** `background-attachment: fixed` works (known Safari quirks)
- [ ] **Clamp values:** Font and dimension clamps render correctly
- [ ] **Flexbox/Grid:** No layout regressions
- [ ] **Links:** Tap and hover work on devices that support hover

---

# PART 2: PROJECTLIST INTEGRATION QA

## Feature Overview
- **Goal:** Integrate ProjectList component into Projects page with real/mock data, filtering (keyword + tags), sorting (name/date/status).
- **Expected behavior:** Instant filtering/sorting with live result count updates.
- **Responsive:** Mobile (320px), Tablet (768px), Desktop (1024px+).
- **Accessibility:** WCAG 2.1 Level AA.
- **Performance:** Smooth interactions, no jank on filter/sort.

## 2.1 Component Rendering Tests

### Basic Render
- [ ] **Component mounts:** ProjectList renders without console errors
- [ ] **Container present:** Main list container visible with `data-testid="project-list-container"`
- [ ] **Filter controls render:** FilterBar and SortMenu visible above project grid
- [ ] **Project grid render:** All projects from data source display in grid layout
- [ ] **No TypeScript errors:** `npm run build` succeeds, no `tsc --noEmit` errors

### Data Source Handling
- [ ] **Mock data mode:** When adapter set to 'mock', displays 5 mock projects (standard test data)
- [ ] **Real API mode (stub):** When adapter set to 'api', component attempts fetch (may fail if endpoint not ready)
- [ ] **Data fallback:** If API fails, graceful error state shown (not a crash)
- [ ] **Loading state:** Shows "Loading projects..." while data fetches
- [ ] **Empty state:** Shows "No projects match your filters" when result set is empty

## 2.2 Keyword Filter (Search Input) Tests

### Search Input Behavior
- [ ] **Input renders:** Search field visible with placeholder "Search projects..."
- [ ] **Focus behavior:** Receives focus, shows focus indicator
- [ ] **Type handling:** Can type characters, input updates in real-time
- [ ] **Instant filter:** Results update as user types (no "Apply" button needed)
- [ ] **Case-insensitive:** Searching "React" matches "react", "React", "REACT"

### Search Logic
- [ ] **Title matching:** Searching "Portfolio" finds projects with "Portfolio" in title
- [ ] **Description matching:** Searching "animation" finds projects with "animation" in description
- [ ] **Partial matching:** Searching "build" finds "builder", "building", "build-tool"
- [ ] **Empty search:** Clears search input → all projects redisplay
- [ ] **No results:** Searching "xyz123notaproject" → "No projects match" message + result count "0 of N"
- [ ] **Result count update:** "X projects shown · Y total" updates instantly as search input changes

### Clear Button
- [ ] **Clear button visible:** When search input has text, "Clear" button appears
- [ ] **Click clears:** Clicking "Clear" empties search input and redisplays all projects
- [ ] **Button hides:** When search empty, Clear button disappears

## 2.3 Technology Tag Filter Tests

### Tag Filter UI
- [ ] **Tags dropdown visible:** Button/dropdown labeled "Tags ▼" or similar
- [ ] **Tag list renders:** Clicking dropdown shows list of all available tech tags (e.g., React, TypeScript, CSS, etc.)
- [ ] **Checkboxes visible:** Each tag has a checkbox or toggle indicator
- [ ] **Selected state visible:** Checked tags have visual indicator (✓, highlight, etc.)

### Tag Filter Behavior
- [ ] **Single tag selection:** Click one tag → projects with that tag display
- [ ] **Multi-tag AND logic:** Select "React" + "TypeScript" → projects with BOTH tags display (confirm logic with designer)
- [ ] **Multi-tag OR logic (alternative):** Select "React" OR "TypeScript" → projects with either tag display (confirm intent)
- [ ] **No results:** If tag combo yields 0 results → "No projects match" message
- [ ] **Clear tags:** Deselect all tags → all projects redisplay
- [ ] **Tag + search interaction:** Search "blog" + filter by "Vue" → results have "blog" in title/desc AND have "Vue" tag

### Result Count with Filters
- [ ] **Count updates:** "3 projects shown · 12 total" reflects current filtered set
- [ ] **Search + filter:** Shows "2 projects shown · 12 total" when both keyword and tags applied
- [ ] **Zero results:** "No projects match your filters" when filtering yields empty set

## 2.4 Sort Control Tests

### Sort Menu UI
- [ ] **Sort dropdown visible:** Button/dropdown labeled "Sort ▼" or "Sort: Name ▼"
- [ ] **Options render:** Clicking sort menu shows "Name", "Date", "Status", "Complexity" (or per spec)
- [ ] **Sort direction control:** ↑ (ascending) / ↓ (descending) toggle visible or integrated in menu

### Sort by Name (A-Z)
- [ ] **Default ascending:** First load sorts projects A-Z by title
- [ ] **Ascending order:** Select "Sort: Name ↑" → projects ordered alphabetically (A → Z)
- [ ] **Descending order:** Select "Sort: Name ↓" → projects ordered reverse alphabetically (Z → A)
- [ ] **Case handling:** "apple", "Apple", "APPLE" sort consistently (case-insensitive)
- [ ] **Special chars:** Projects with special chars in name sort correctly

### Sort by Date
- [ ] **Newest first (default):** Projects ordered by date, newest at top
- [ ] **Ascending (oldest first):** Select "Sort: Date ↑" → oldest projects at top
- [ ] **Descending (newest first):** Select "Sort: Date ↓" → newest projects at top
- [ ] **Same-date stability:** Projects with same date maintain stable order (secondary sort by name or ID)

### Sort by Status
- [ ] **Status sort:** Select "Sort: Status" → projects grouped by status (active, completed, paused, archived)
- [ ] **Status order:** Verify logical order (e.g., active → completed → paused → archived)
- [ ] **Ascending/descending:** Toggle direction if applicable

### Sort by Complexity
- [ ] **Complexity values:** Projects have complexity field (1–5) assigned
- [ ] **Ascending (low complexity first):** Select "Sort: Complexity ↑" → 1 → 5
- [ ] **Descending (high complexity first):** Select "Sort: Complexity ↓" → 5 → 1
- [ ] **Null/missing complexity:** If some projects lack complexity, handle gracefully (sort to end or treat as 0)

### Sort + Filter Interaction
- [ ] **Sort persists with filter:** Apply filter by tag, then sort by name → filtered results are sorted
- [ ] **Clear filter, sort remains:** After clearing filter, sort direction preserved (unless reset by UI)
- [ ] **Multiple sorts:** Change sort type multiple times → each change applies correctly

## 2.5 Responsive Grid Layout Tests

### Desktop (1024px+)
- [ ] **Grid columns:** 3+ columns visible at 1920px (grid: repeat(auto-fill, minmax(320px, 1fr)))
- [ ] **2+ columns at 1024px:** Auto-fill ensures at least 2 columns
- [ ] **Card width:** Each card ~320px–400px, responsive
- [ ] **Gap spacing:** Consistent gap between cards (var(--space-lg) = 24px)
- [ ] **Container width:** Max-width ~1200px, centered
- [ ] **Padding:** Proper padding around grid (left/right at least 40px)

### Tablet (768px – 1023px)
- [ ] **Grid columns:** 2 columns visible (minmax(280px, 1fr) or auto-fill)
- [ ] **Card sizing:** Cards scaled appropriately, not too wide or narrow
- [ ] **Gap spacing:** Tighter gap than desktop (var(--space-md) = 16px) or proportional
- [ ] **Padding:** Reduced padding (20px left/right), full width within safe margins

### Mobile (320px – 767px)
- [ ] **Single column:** One project card per row, full width
- [ ] **Card padding:** Each card has internal padding (var(--space-md) = 16px)
- [ ] **Container width:** Full viewport width minus safe padding (e.g., 320px - 20px left/right = 280px card)
- [ ] **No horizontal scroll:** Content fits fully without overflow
- [ ] **Readable text:** Font sizes not too small, image/banner visible

### All Breakpoints
- [ ] **Grid reflow smooth:** No jank or layout shift when resizing
- [ ] **No card overlap:** Cards never overlap
- [ ] **Touch targets:** Mobile tap targets ≥44px for "Details" button, tag badges
- [ ] **Image aspect ratio:** Project images/banners maintain consistent ratio (or specified ratio per design)

## 2.6 Console & TypeScript Quality Tests

### Console Errors
- [ ] **No console errors:** DevTools Console shows no red errors after render
- [ ] **No console warnings:** No yellow warnings (except third-party library warnings, if acceptable)
- [ ] **React warnings:** No React-specific warnings (e.g., missing keys, prop issues)
- [ ] **No Network 404s:** No failed API calls (unless testing error state intentionally)

### TypeScript Compilation
- [ ] **No build errors:** `npm run build` succeeds without errors
- [ ] **Type checking:** `npx tsc --noEmit` passes (all types valid)
- [ ] **Component props typed:** ProjectList, FilterBar, SortControls have proper `interface` definitions
- [ ] **Data structures typed:** Project interface, filter state, sort state all have proper types

### React Specific
- [ ] **No missing keys:** Grid of projects renders without React "key" warnings
- [ ] **State updates:** Filtering/sorting trigger re-renders without stale closures or missing dependencies
- [ ] **No memory leaks:** Component unmounts cleanly, no lingering event listeners

## 2.7 Performance & Interaction Tests

### Filtering Performance
- [ ] **Instant feedback:** Typing in search input → results update <50ms (perceptually instant)
- [ ] **No jank on filter:** Projects grid reflows smoothly, no frame drops (target 60fps)
- [ ] **Large dataset:** With 50+ projects, filter still responsive (no noticeable lag)

### Sorting Performance
- [ ] **Sort applies instantly:** Clicking sort option → grid reorders in <100ms
- [ ] **Smooth reflow:** Projects grid reorders without jank
- [ ] **No layout shift:** Other page elements (header, sidebar, etc.) don't shift

### Interaction Smoothness
- [ ] **Hover effects smooth:** Hovering over project card shows smooth transition (no lag)
- [ ] **Click response:** Clicking "Details" button responds immediately
- [ ] **Focus/blur smooth:** Moving focus between controls is smooth

## 2.8 Accessibility (ProjectList)

### Keyboard Navigation
- [ ] **Tab through controls:** Can tab through Search → Tags ▼ → Sort ▼ → Project grid → Details buttons
- [ ] **Enter to activate:** Can press Enter on dropdowns to open/close
- [ ] **Arrow keys in dropdown:** If dropdown supports arrow keys, ↑↓ navigate options, Enter selects
- [ ] **Focus visible:** Every interactive element has visible focus ring

### ARIA & Semantic HTML
- [ ] **Search input label:** Associated label or aria-label present
- [ ] **Dropdown buttons:** Have `aria-expanded` to indicate expanded/collapsed state
- [ ] **Project grid:** Semantic `<ul>` or `<article>` for each card (not just divs)
- [ ] **Project title:** Each card has clear heading (h3 or h4), not just div
- [ ] **Result count:** Announced as status region (`role="status"`) so screen readers announce updates

### Screen Reader Testing
- [ ] **Grid announced:** "12 projects in a list" or similar
- [ ] **Filter updates announced:** Changing filter → "3 projects found" announced
- [ ] **Project cards:** Each card announces title, description excerpt, tech tags
- [ ] **Interactive elements:** Buttons, links, dropdowns announce purpose and state

### Color Contrast
- [ ] **All text:** Meets 4.5:1 contrast (normal) or 3:1 (large/bold)
- [ ] **Focus indicator:** Visible against all backgrounds
- [ ] **Disabled state (if any):** Still readable, ≥3:1 contrast

## 2.9 Integration: Filter + Sort + Search Interaction

- [ ] **Search narrows results, sort persists:** Search for "blog" → apply Date sort → results show matching blogs sorted by date
- [ ] **Clear filters independently:** Remove search filter → sort and tag filters still active
- [ ] **Reset all:** If "Clear All" button exists, all filters/search/sort reset to defaults
- [ ] **Tag + sort:** Filter by "React" tag, sort by Name ascending → shows React projects A–Z
- [ ] **Edge case:** Search for non-existent term + tag filter → "No projects match" shown correctly

---

# PART 3: TEST EXECUTION & ACCEPTANCE CRITERIA

## 3.1 Manual Testing Workflow

### Pre-Test Setup
1. **Install dependencies:** `npm install`
2. **Start dev server:** `npm run dev` (Vite development mode)
3. **Open DevTools:** F12 in Chrome/Firefox, ⌘Option+I in Safari
4. **Navigate to pages:**
   - **Contact page:** http://localhost:5173/contact (or current port)
   - **Projects page:** http://localhost:5173/projects

### Manual Test Execution
- **Day 1:** Visual + responsive (Contact), banner parallax, form focus states
- **Day 2:** Contact page a11y, keyboard nav, cross-browser spot checks
- **Day 3:** ProjectList rendering, filter/sort basic functionality
- **Day 4:** ProjectList responsive, keyboard nav, a11y matrix
- **Day 5:** Integration testing (filter + sort combos), performance, edge cases

### Bug Recording Template
```
**Bug:** [Brief title]
**Severity:** Critical / High / Medium / Low
**Reproducibility:** Always / Often / Sometimes / Rare
**Steps to Reproduce:**
1. ...
2. ...
**Expected:** ...
**Actual:** ...
**Environment:** Chrome/Firefox/Safari, Viewport: 1920x1080, Device: Desktop/Mobile
**Screenshot/Video:** [Attached]
**Assignee:** Selene (code) / Lyra (design/CSS)
```

### Sign-Off on Pass
- [ ] All critical/high bugs resolved or documented
- [ ] All medium bugs assigned with target fix date
- [ ] Visual regression baseline captured
- [ ] Accessibility audit completed (axe DevTools or similar)
- [ ] Performance metrics recorded (FCP, LCP, CLS for pages)

## 3.2 Acceptance Criteria Summary

### Contact Page Passes When:
1. ✅ Banner parallax smooth, visually matches spec (colors, spacing, typography)
2. ✅ All responsive breakpoints tested: 320px, 768px, 1024px, 1920px — layout reflows correctly
3. ✅ Form inputs receive focus, tab order logical, submit button reachable via keyboard
4. ✅ Parallax effect visible and smooth (no jank on scroll)
5. ✅ All links functional (GitHub, Email, LinkedIn don't throw errors)
6. ✅ WCAG 2.1 Level AA pass: color contrast ≥4.5:1, all form labels associated, keyboard navigable
7. ✅ Cross-browser: Chrome, Firefox, Safari (latest versions) render consistently
8. ✅ No console errors, no TypeScript build errors

### ProjectList Passes When:
1. ✅ Component renders with real or mock data, no crashes
2. ✅ Keyword filter works: searching "React" shows projects with "React" in title/description
3. ✅ Tag filter works: selecting 1 or more tags filters correctly (confirm AND vs OR logic with designer)
4. ✅ Sorting functional: by Name (A–Z, Z–A), by Date (new→old, old→new), by Status, by Complexity
5. ✅ Responsive at all breakpoints: 320px (1 col), 768px (2 col), 1024px (3 col), 1920px (3–4 col)
6. ✅ No TypeScript errors: `npm run build` succeeds, `tsc --noEmit` passes
7. ✅ No console errors or warnings (except acceptable third-party logs)
8. ✅ Keyboard navigation complete: tab through all controls, arrow keys in dropdowns, Enter activates
9. ✅ Accessibility: ARIA labels, semantic HTML, ≥4.5:1 contrast, screen reader compatible
10. ✅ Performance: filter/sort <100ms, no jank on interactions, 60fps reflow on grid

## 3.3 Critical vs. Nice-to-Have

### Critical (Must Fix Before Merge)
- Contact page parallax smooth (no jank)
- Form labels properly associated (`htmlFor` → `id`)
- ProjectList filters work (keyword + tag)
- Sort controls functional
- No TypeScript build errors
- No console errors

### High Priority (Should Fix)
- Responsive layout at all breakpoints
- Keyboard navigation complete
- Color contrast ≥4.5:1
- Cross-browser consistency (Chrome, Firefox, Safari)
- Performance (filter/sort <100ms)

### Nice-to-Have (Post-MVP)
- Advanced sorting (secondary sort stability)
- Filter reset button with keyboard shortcut
- Mobile touch gesture support
- Animation transitions on filter/sort
- Export or share functionality

## 3.4 Known Limitations & Edge Cases

### Contact Page
- **Known:** Parallax effect may not work on all mobile browsers (e.g., some Android browsers disable `background-attachment: fixed`). Fallback: static banner on mobile is acceptable per spec.
- **Edge case:** Very long contact names (e.g., GitHub username > 50 chars) — test text wrapping
- **Edge case:** Form submission unimplemented — currently prevents default. Document that validation is future work.

### ProjectList
- **Known:** API adapter not yet integrated; mock data only for now. Real API testing deferred until backend ready.
- **Edge case:** Projects with no tags — filter should exclude these from tag-filtered results (or include "No tags" as option)
- **Edge case:** Projects with same date — secondary sort by name ensures stable order
- **Edge case:** Very long project titles or descriptions — test truncation/wrapping in cards
- **Edge case:** 100+ projects — verify performance remains acceptable

## 3.5 Regression Risk Assessment

### High Risk
- **Parallax implementation:** New CSS feature; regression risk on scroll performance
- **Responsive grid changes:** Grid template columns change per breakpoint; layout reflow risk
- **Filter state management:** Complex filter logic; risk of stale state or missing updates

### Medium Risk
- **Form focus management:** New focus handlers; keyboard nav changes could break tab order
- **Sort stability:** Same-date sorting could cause inconsistent ordering
- **Accessibility changes:** ARIA labels added; screen reader compatibility needs verification

### Low Risk
- **Link styling:** Existing link components, minor color/hover changes
- **Button styling:** Existing button component, no logic change
- **Typography scaling:** CSS clamp values; low risk if tested at all breakpoints

---

# PART 4: TOOLS & SCRIPTS

## 4.1 Recommended Tools

### Accessibility
- **axe DevTools** (Chrome/Firefox extension): Automatic a11y audit, contrast checker
- **WAVE** (Web Accessibility Evaluation Tool): Second opinion on HTML structure
- **Lighthouse** (Chrome DevTools): Accessibility, performance, SEO audit
- **Screen Reader Testing:** NVDA (Windows), JAWS (Windows/Mac), VoiceOver (Mac/iOS)

### Visual Regression
- **Percy** or **Chromatic:** Automated visual regression (future integration)
- **Browser Developer Tools Screenshots:** Manual baseline capture
- **Responsive Design Mode:** Chrome/Firefox DevTools for multi-viewport testing

### Performance
- **Chrome DevTools Lighthouse:** Overall performance metrics
- **DevTools Performance Tab:** Frame rate monitoring, layout/paint analysis
- **Cypress/Playwright:** Automated performance testing (future)

### Validation
- **W3C Markup Validator:** HTML structure
- **CSS Validator:** CSS syntax (W3C)
- **WebAIM Contrast Checker:** Color contrast ratio validation

## 4.2 Test Execution Commands

```bash
# Start dev server
npm run dev

# Type check
npm run type-check
# or
npx tsc --noEmit

# Build for production (verify no errors)
npm run build

# Run tests (if test suite exists)
npm test

# Run tests with coverage
npm test:coverage

# Lint code
npm run lint
```

## 4.3 Browser/Device Testing

| Browser | Version | Desktop | Tablet | Mobile | Status |
|---------|---------|---------|--------|--------|--------|
| Chrome  | Latest  | ✅      | ✅     | ✅     | Spot check |
| Firefox | Latest  | ✅      | ✅     | ✅     | Spot check |
| Safari  | Latest  | ✅      | ✅     | ✅     | Spot check |
| Edge    | Latest  | ✓ (if time) | — | — | Optional |

---

# PART 5: QA SIGN-OFF CHECKLIST

## Final QA Review
- [ ] All test cases executed (manual + automated if applicable)
- [ ] Critical bugs resolved or documented with workarounds
- [ ] High-priority issues assigned with fix dates
- [ ] Visual baseline captured (screenshots at key breakpoints)
- [ ] Accessibility audit completed (axe or similar tool)
- [ ] Performance metrics within acceptable range
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] No TypeScript build errors
- [ ] No console errors or warnings
- [ ] Responsive layout verified at 320px, 768px, 1024px, 1920px
- [ ] Keyboard navigation complete (tab, arrow keys, focus indicators)
- [ ] Screen reader testing done (NVDA/JAWS or VoiceOver)
- [ ] Bug report compiled with severity/assignee
- [ ] Test evidence saved (screenshots, videos, browser console logs if applicable)

## Ready for PR Review When:
1. ✅ All critical issues resolved
2. ✅ No TypeScript or build errors
3. ✅ Responsive layout tested at 4 breakpoints
4. ✅ Keyboard nav complete
5. ✅ Color contrast verified
6. ✅ No regressions on existing features (e.g., nav, other pages)
7. ✅ QA sign-off documented in PR or this file

---

## QA Sign-Off

**QA Engineer:** Nyx  
**Date Completed:** [TBD]  
**Status:** ⏳ Awaiting feature completion  

### Bugs Found & Status
- [To be updated during test execution]

### Test Execution Notes
- [To be recorded here]

---

**End of QA Test Plan**
