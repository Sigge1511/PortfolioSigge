# ProjectList Component — Complete Test Specification

**Date:** 2026-03-29  
**Component:** ProjectList + FilterBar + SortControls + ProjectCard  
**Framework:** Vitest + React Testing Library  
**Coverage Target:** Lines ≥90%, Branches ≥85%, Functions ≥90%  

---

## Test Organization

### Directory Structure
```
src/components/ProjectList/
├── index.tsx                    # All component exports
├── styles.css                   # Component styling
└── __tests__/
    ├── ProjectList.test.tsx     # Integration tests
    ├── FilterBar.test.tsx       # Unit tests for FilterBar
    ├── SortControls.test.tsx    # Unit tests for SortControls
    ├── ProjectCard.test.tsx     # Unit tests for ProjectCard
    ├── integration.test.tsx     # Multi-component scenarios
    └── fixtures/
        ├── mockProjects.ts      # Test data
        └── testUtils.ts         # Render helpers
```

### Test Configuration
- **Framework:** Vitest (configured in `vitest.config.ts`)
- **Environment:** jsdom (for DOM simulation)
- **Setup:** `src/__tests__/setup.ts` (cleanup, mocks)
- **Scripts:**
  - `npm test` — Run all tests
  - `npm test -- --watch` — Watch mode
  - `npm test:coverage` — Coverage report

---

## Mock Data Strategy

### Test Data Sets

**1. MOCK_PROJECTS** — Standard data (5 projects)
- Varied titles (normal length, proper casing)
- Diverse descriptions (short to medium)
- 1-4 tags per project
- All status values: active, completed, paused, archived
- Recent dates (within last 3 months)

**2. EDGE_CASE_PROJECTS** — Boundary conditions (5 projects)
- Empty title
- Title > 100 characters
- Special characters and emojis in title/description
- No tags (empty array)
- Unknown status value (tests fallback)
- Very long description (tests truncation)

**3. SAME_DATE_PROJECTS** — Sort stability (3 projects)
- All same date
- Different titles (alphabetically: Alpha, Beta, Zebra)
- Tests stable sort when primary key ties

### Helper Functions
```typescript
// Get all unique tags from a project array
getAllTags(projects): string[]

// Create a mock project (builder pattern)
createProject(overrides): Project

// Create N random projects
createRandomProjects(count): Project[]
```

---

## Unit Test Cases

### ProjectList Component

**Container & Rendering**
- ✅ Renders container div with `data-testid="project-list-container"`
- ✅ Renders FilterBar and SortControls
- ✅ Renders projects list when projects provided

**Data Display**
- ✅ Displays all projects from props
- ✅ Shows result count: "X of Y projects"
- ✅ Shows "Using mock data" label when `useMockData=true`
- ✅ Hides "Using mock data" label when `useMockData=false`

**Loading State**
- ✅ Shows loading message when `isLoading=true`
- ✅ Hides projects list when loading
- ✅ `data-testid="loading-state"` visible

**Empty State**
- ✅ Shows "No projects found" when projects array is empty
- ✅ Role attribute: `role="status"` on empty message
- ✅ Does not render FilterBar/SortControls when empty

**Error State**
- ✅ Shows error message when `error` prop provided
- ✅ Displays error.message in error text
- ✅ Role attribute: `role="alert"` on error container
- ✅ Shows retry button when `onRetry` provided
- ✅ Hides retry button when `onRetry` undefined

**No Results (Filters Applied)**
- ✅ Shows "No projects match your filters" after filtering
- ✅ Role attribute: `role="status"`
- ✅ Hides when results exist

---

### FilterBar Component

**Keyword Search**
- ✅ Input field has `id="keyword-input"` and label
- ✅ Typing updates filter state
- ✅ Filters by project title (case-insensitive)
- ✅ Filters by project description (case-insensitive)
- ✅ Partial match works ("react" matches "React App")
- ✅ Multiple words: "task manager" matches both words in title/description
- ✅ Empty input shows all projects

**Tag Filtering**
- ✅ Renders button for each unique tag in projects
- ✅ Clicking tag adds it to filter
- ✅ Clicking tag again removes it (toggle)
- ✅ Multi-select: selecting multiple tags shows projects with ANY tag (OR logic)
- ✅ Projects without matching tags are filtered out
- ✅ Button has `aria-pressed` state

**Clear Filters Button**
- ✅ Shows when keyword OR tags are active
- ✅ Hides when filters are empty
- ✅ Clicking clears keyword input
- ✅ Clicking clears all selected tags
- ✅ Parent component receives `{ keyword: '', tags: [] }`

**Accessibility**
- ✅ Label for keyword input: `<label htmlFor="keyword-input">`
- ✅ Label for tags section present
- ✅ Tag buttons have `aria-pressed` attribute
- ✅ All inputs keyboard-navigable (Tab key)
- ✅ Buttons activatable with Enter key

---

### SortControls Component

**Dropdown Button & Menu**
- ✅ Button text shows current sort: "Sort: Date (Newest)"
- ✅ Button toggles menu open/close
- ✅ Menu appears/disappears based on `isOpen` state
- ✅ Menu has `role="menu"` attribute
- ✅ Menu items have `role="menuitem"` attribute

**Sort Options**
- ✅ "Date (Newest)" sorts descending by date
- ✅ "Name (A-Z)" sorts ascending by title
- ✅ "Status" sorts by status order: active → completed → paused → archived
- ✅ Selecting option closes menu
- ✅ Selected option highlighted with `active` class or `aria-current="true"`

**Keyboard Navigation**
- ✅ Button accessible via Tab
- ✅ Button can be activated with Enter/Space
- ✅ Menu items navigable with Arrow keys
- ✅ Menu items activatable with Enter
- ✅ Escape key closes menu (if implemented)

**Accessibility**
- ✅ Button has `aria-label` describing sort option
- ✅ Button has `aria-expanded` showing menu state
- ✅ Menu items have appropriate `aria-current` when active
- ✅ Menu structure valid (list with role="menu")

---

### ProjectCard Component

**Content Rendering**
- ✅ Displays project title in `<h3>`
- ✅ Displays project description in `<p>`
- ✅ Displays project date in `<time>` with `dateTime` attribute
- ✅ Displays status badge with `aria-label`

**Status Styling**
- ✅ "active" status → green background (#10b981)
- ✅ "completed" status → blue background (#3b82f6)
- ✅ "paused" status → amber background (#f59e0b)
- ✅ "archived" status → gray background (#6b7280)
- ✅ Unknown status → fallback gray (#9ca3af)
- ✅ No console errors for unknown status

**Tags Rendering**
- ✅ Renders tag for each item in tags array
- ✅ Each tag is a clickable button
- ✅ No tags section shown when tags array is empty
- ✅ Tags have `data-testid="project-tag-{id}-{tag}"`

**Text Truncation**
- ✅ Description truncated at 3 lines
- ✅ Truncated text ends with "…"
- ✅ Full description shown if ≤3 lines
- ✅ Very long single-line description wrapped/truncated

**Edge Cases**
- ✅ Empty title renders without error
- ✅ Empty description renders without error
- ✅ No tags renders without error
- ✅ Very long title (>100 chars) wraps or truncates gracefully
- ✅ Title with emojis/special characters displays correctly
- ✅ Date formatting: renders as locale-appropriate string

**Accessibility**
- ✅ Semantic HTML: `<article>`, `<h3>`, `<time>`
- ✅ Status badge has `aria-label="Status: {status}"`
- ✅ Date element has `dateTime` attribute for parsing
- ✅ Tag buttons are keyboard-accessible

---

## Integration Test Cases

### Filter + Sort Together
- ✅ User filters by tag, then sorts by date → both constraints applied
- ✅ User sorts by name, then filters by keyword → both constraints applied
- ✅ Filtered results are then sorted correctly
- ✅ Results match expected order

### Filter Clearing
- ✅ User applies multiple filters
- ✅ User clicks "Clear All" button
- ✅ List returns to showing all projects
- ✅ Filters reset: keyword = '', tags = []

### Mock Data Toggle
- ✅ Component renders with `useMockData=true`
- ✅ Mock data label displayed
- ✅ Switching to `useMockData=false` updates label
- ✅ Component re-renders without errors

### Error Recovery
- ✅ Error state displayed initially
- ✅ User clicks "Retry" button
- ✅ `onRetry` callback invoked
- ✅ Loading state shows after retry
- ✅ Projects displayed after successful retry

### User Workflow Scenario
1. User views full project list (15 projects)
2. User searches "React" → 5 results shown
3. User clicks tag "TypeScript" → 3 results shown
4. User sorts by Name → 3 results reordered alphabetically
5. User clears filters → 15 projects shown again
6. Each step: correct projects visible, counts update

---

## Edge Cases & Robustness

| Scenario | Input | Expected Result |
|---|---|---|
| Empty list | `projects=[]` | Empty state message, no list rendered |
| Very long name | Title > 100 chars | Text wraps or truncates, layout intact |
| Many tags | 8+ tags on one project | All visible (or scrollable), no overflow |
| Filter matches none | Filters applied, 0 results | "No results" message |
| Special characters | Title/desc with @#$%^&*() | Renders correctly, no encoding issues |
| Null/undefined | Null description passed | No crash, empty fallback |
| Unknown status | Status not in enum | Fallback color applied, no error |
| Same dates | 3+ projects, same date | Stable sort by secondary key |
| Long description | Description 500+ chars | Truncated at 3 lines with "…" |
| Empty tags array | Project with tags: [] | No tag section rendered |
| Rapid filtering | User types fast, many keystrokes | No lag, correct results (if debounced, test it) |

---

## Accessibility (a11y) Requirements

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Shift+Tab backwards navigation works
- [ ] Enter activates buttons
- [ ] Space activates buttons
- [ ] Arrow keys navigate dropdown menu
- [ ] Escape closes menu

### ARIA Attributes
- [ ] FilterBar label: `<label htmlFor="...">` for input
- [ ] Tag buttons: `aria-pressed` when selected
- [ ] Sort button: `aria-label` describing current sort
- [ ] Sort button: `aria-expanded` showing menu state
- [ ] Empty/no-results message: `role="status"` or `aria-live`
- [ ] Error message: `role="alert"`
- [ ] Status badge: `aria-label="Status: {value}"`
- [ ] Menu: `role="menu"`, items: `role="menuitem"`

### Semantic HTML
- [ ] Proper heading hierarchy (h3 for project title)
- [ ] `<article>` for project card
- [ ] `<time>` element with `dateTime` attribute
- [ ] `<button>` for all clickable elements
- [ ] `<label>` for form inputs
- [ ] `<ul>` with `<li>` for lists

### Screen Reader Testing
- [ ] Empty state announced
- [ ] "No results" announced
- [ ] Loading state announced (via aria-busy or similar)
- [ ] Error message announced as alert
- [ ] Filter labels and inputs announced
- [ ] Sort options announced correctly
- [ ] Project cards announced with all content

---

## Performance Considerations

- ✅ `useMemo` on filteredAndSorted to prevent re-renders
- ✅ Sort/filter logic does not block main thread
- ✅ Large project lists (100+) handle gracefully
- ✅ No memory leaks on component unmount
- ✅ Event handlers are stable (useCallback if needed)

---

## Coverage Targets

```
Lines:      ≥ 90%    Target: 450+ lines covered of 500
Branches:   ≥ 85%    Target: 85+ branches covered of 100
Functions:  ≥ 90%    Target: 18+ functions covered of 20
Statements: ≥ 90%    Target: 450+ statements covered of 500
```

**Coverage per component:**
- ProjectList: Lines 95%, Branches 90%
- FilterBar: Lines 92%, Branches 88%
- SortControls: Lines 90%, Branches 85%
- ProjectCard: Lines 88%, Branches 85%

---

## Test Execution Commands

```bash
# Run all ProjectList tests
npm test -- ProjectList

# Run with coverage
npm test:coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- ProjectCard.test.tsx

# Run tests matching pattern
npm test -- --grep "FilterBar"

# Debug in browser (if using @vitest/ui)
npm test -- --ui
```

---

## Regression Risk Assessment

### High-Risk Areas
1. **Filter logic:** Multiple filters applied together
2. **Sort stability:** Projects with equal sort keys
3. **Empty states:** Different empty/error scenarios
4. **Accessibility:** Keyboard nav, ARIA attributes

### Mitigation
- Comprehensive test coverage of all filter/sort combinations
- Edge case fixtures with varied data
- Accessibility tests for each interactive element
- Integration tests for user workflows

---

## Success Criteria

- ✅ All test cases pass
- ✅ Coverage meets targets (90% lines, 85% branches, 90% functions)
- ✅ No console warnings or errors
- ✅ Keyboard navigation works end-to-end
- ✅ Screen reader announces all content
- ✅ Performance acceptable for 100+ projects
- ✅ No accessibility violations (axe-core scan)

---

**Next Steps:**
1. Install dependencies: `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom`
2. Create component files
3. Create test files per specification
4. Run `npm test` and iterate until coverage targets met
