# QA Testing Checklist (Quick Reference)
**Date:** 2026-03-29 | **By:** Nyx | **Status:** Ready to Execute

---

## CONTACT PAGE — Visual & Interaction

### Banner & Parallax
- [ ] Banner height responsive (clamp: 300px–500px)
- [ ] Parallax smooth on scroll (50% of scroll speed)
- [ ] Title centered, readable at all sizes
- [ ] Gradient overlay visible over hero image
- [ ] No layout jank or reflow on page load

### Links Section
- [ ] All 3 links visible (GitHub, Email, LinkedIn)
- [ ] Links sized correctly (clamp: 1.25rem–1.5rem)
- [ ] Arrow icon → translates 8px on hover
- [ ] Text color changes to accent on hover
- [ ] Border styling consistent between links

### Form Section
- [ ] Form inputs visible (Name, Email, Message)
- [ ] Labels styled in uppercase, muted color
- [ ] Input backgrounds match design (#1a1a1a)
- [ ] Button visible and clickable
- [ ] No text overflow on mobile

### Responsive Breakpoints
- [ ] **320px (Mobile):** Single column, banner ~250px, no horizontal scroll
- [ ] **768px (Tablet):** Adjusted spacing, parallax smooth
- [ ] **1024px (Desktop):** 2-column grid (links left, form right), max-width 1200px
- [ ] **1920px (Wide):** All elements centered, proper spacing

### Keyboard & A11y
- [ ] Tab order: Nav → Banner → Links → Form → Submit
- [ ] Focus visible on all interactive elements
- [ ] All inputs have associated labels (htmlFor → id)
- [ ] Color contrast ≥4.5:1 (test muted text on dark background)
- [ ] No console errors
- [ ] Screen reader: Announces "Get in touch" h1, link destinations, form labels

### Cross-Browser (Spot Check)
- [ ] Chrome: Parallax smooth, styles correct
- [ ] Firefox: Parallax smooth, grid layout correct
- [ ] Safari: background-attachment:fixed works, clamp values render

---

## PROJECTLIST — Rendering & Interaction

### Component Render
- [ ] Component mounts without console errors
- [ ] Filter controls visible above grid
- [ ] Project grid renders with correct data
- [ ] No TypeScript build errors (`npm run build` succeeds)
- [ ] Result count shown ("X projects shown · Y total")

### Keyword Filter (Search)
- [ ] Search input renders, receives focus
- [ ] Typing updates results instantly (no "Apply" button)
- [ ] Case-insensitive: "react" matches "React"
- [ ] Partial matching: "build" finds "builder"
- [ ] Empty search shows all projects
- [ ] Clear button appears when input has text, clears on click
- [ ] Result count updates in real-time
- [ ] Zero results: "No projects match" shown

### Tag Filter (Multi-Select)
- [ ] Tags dropdown visible and opens/closes correctly
- [ ] Can select 1 or more tags
- [ ] Selected tags highlighted/checked
- [ ] Filter applies instantly (no "Apply" button)
- [ ] Result count reflects tag filter
- [ ] Zero results: "No projects match" shown when tag combo empty
- [ ] Deselecting all tags shows all projects

### Sort Control
- [ ] Sort dropdown visible and opens/closes
- [ ] **Sort by Name:** Ascending (A→Z) and Descending (Z→A) work
- [ ] **Sort by Date:** Newest/Oldest first toggle works
- [ ] **Sort by Status:** Projects grouped by status (active, completed, paused, archived)
- [ ] **Sort by Complexity:** Low→High and High→Low toggle works
- [ ] Sort persists when filters applied
- [ ] Sort direction toggle (↑ ↓) works correctly

### Filter + Sort Integration
- [ ] Search "blog" + sort by Date → filtered results sorted by date
- [ ] Tag filter + Name sort → tagged projects A–Z
- [ ] Clearing search keeps sort active
- [ ] Clearing tag filter keeps sort active
- [ ] Multiple sort changes apply correctly

### Responsive Grid Layout
- [ ] **320px (Mobile):** 1 column, full width, no horizontal scroll
- [ ] **768px (Tablet):** 2 columns, proper gap and padding
- [ ] **1024px (Desktop):** 3+ columns, max-width container
- [ ] **1920px (Wide):** 3–4 columns, proper gaps, centered
- [ ] Cards maintain consistent size/aspect ratio
- [ ] No layout shift or jank on resize

### Keyboard & A11y
- [ ] Tab through: Search → Tags ▼ → Sort ▼ → Grid → Details buttons
- [ ] Focus visible on all controls
- [ ] Arrow keys navigate dropdown options (if supported)
- [ ] Enter activates dropdowns and buttons
- [ ] Result count announced as `role="status"` (screen reader)
- [ ] Project cards semantic HTML (heading, article, or list items)
- [ ] Color contrast ≥4.5:1
- [ ] No console errors or React warnings

### Performance & Polish
- [ ] Filter applies <100ms (perceptually instant)
- [ ] Sort applies <100ms
- [ ] Grid reflow smooth (target 60fps)
- [ ] No jank on interactions
- [ ] Large dataset (50+ projects) still responsive
- [ ] Hover effects smooth on project cards

### Data Quality
- [ ] All projects render with title, description, image
- [ ] Tech tags display correctly
- [ ] Unknown/missing data handled gracefully (no crashes)
- [ ] Date format consistent across projects
- [ ] Status values correct (active, completed, paused, archived)

---

## TypeScript & Console

### Build & Type Check
- [ ] `npm run build` succeeds without errors
- [ ] `npx tsc --noEmit` passes (all types valid)
- [ ] Component props properly typed (interfaces defined)
- [ ] No implicit `any` types

### Runtime Quality
- [ ] No red console errors after page load
- [ ] No yellow console warnings (except acceptable third-party)
- [ ] No React warnings (missing keys, prop issues, etc.)
- [ ] No Network 404s or failed API calls (unless testing error state)
- [ ] No memory leaks (DevTools Memory tab check)

---

## Edge Cases & Known Limitations

### Contact Page Edge Cases
- [ ] Very long GitHub username (>50 chars) — text wraps correctly
- [ ] Form submission behavior documented (currently prevents default, validation future work)
- [ ] Mobile parallax fallback (mobile may show static banner instead of parallax — acceptable per spec)

### ProjectList Edge Cases
- [ ] Projects with no tags — filtered correctly or option to show "No tags"
- [ ] Projects with same date — stable sort by secondary key (name/ID)
- [ ] Very long project titles (>100 chars) — truncated or wrapped gracefully
- [ ] Very long descriptions — text truncated or "read more" visible
- [ ] 100+ projects — filter/sort performance still acceptable

---

## Bug Recording Template

**Bug ID:** [Auto-assigned by tracker]  
**Title:** [One-line summary]  
**Severity:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low  
**Component:** Contact Page | ProjectList | Both  
**Steps to Reproduce:**
1. ...
2. ...

**Expected:** ...  
**Actual:** ...  
**Environment:** [Chrome/Firefox/Safari] [Viewport] [Device]  
**Assignee:** [Selene/Lyra/Auto]  

---

## Sign-Off

**QA Engineer:** Nyx  
**Start Date:** [TBD]  
**Completion Date:** [TBD]  
**Status:** ⏳ Not yet started

- [ ] All test cases executed
- [ ] Bugs documented with severity/assignee
- [ ] Visual baseline captured
- [ ] A11y audit completed
- [ ] Performance metrics recorded
- [ ] Ready for PR review

