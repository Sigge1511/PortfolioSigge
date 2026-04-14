# ProjectList Component — Test Strategy

**Date:** 2026-03-29  
**Component:** ProjectList with FilterBar, SortControls, ProjectCard  
**Testing Framework:** Vitest + React Testing Library  
**Coverage Goals:** Lines ≥90%, Branches ≥85%, Functions ≥90%  

---

## 1. Test Suite Architecture

```
src/components/ProjectList/
  ├── ProjectList.tsx
  ├── FilterBar.tsx
  ├── SortControls.tsx
  ├── ProjectCard.tsx
  └── __tests__/
      ├── ProjectList.test.tsx       (integration + main component)
      ├── FilterBar.test.tsx         (unit: keyword search, tags, clearing)
      ├── SortControls.test.tsx      (unit: sort options, dropdown)
      ├── ProjectCard.test.tsx       (unit: rendering, tags, status)
      └── fixtures/
          ├── mockProjects.ts        (test data)
          └── testUtils.ts           (render helpers, custom matchers)
```

---

## 2. Test Data Fixtures

### Core Mock Projects (mockProjects.ts)

**Include:**
- **Varied project names:** Normal, very long (>50 chars), Unicode, special chars
- **Varied descriptions:** Short, long (>200 chars), null/empty, markdown
- **Tags:** No tags, 1-3 tags, many (8+) tags
- **Status values:** "active", "completed", "paused", "archived"
- **Dates:** Recent, old (>1 year), mixed
- **Tech stacks:** Empty, 1-2 items, 5+ items

**Example structure:**
```typescript
export const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'Developer Portfolio',
    description: 'A fully custom portfolio...',
    tags: ['React', 'TypeScript', 'CSS'],
    status: 'active',
    date: '2026-01-15',
  },
  // More varied projects...
];

export const EDGE_CASE_PROJECTS = [
  { id: 'e1', title: '', description: null, tags: [], status: 'unknown' },
  { id: 'e2', title: 'A'.repeat(100), description: 'Very long description...', tags: [...] },
  // More edge cases...
];
```

---

## 3. Unit Tests

### 3.1 ProjectList Component Tests

**Behavior-focused test cases:**

| # | Test Case | Expected Outcome |
|---|---|---|
| 1 | Renders project list when data provided | All projects visible in DOM |
| 2 | Applies filter when FilterBar emits `onFilter` | List updates, non-matching projects hidden |
| 3 | Applies sort when SortControls emits `onSort` | Projects reordered per sort key |
| 4 | Combines filter + sort correctly | Both constraints applied simultaneously |
| 5 | Shows `isLoading=true` state | Spinner/skeleton visible, list hidden |
| 6 | Shows empty state when `projects=[]` | "No projects found" message visible |
| 7 | Handles `useMockData=true` toggle | Renders mock data, no API calls |
| 8 | Handles `useMockData=false` toggle | Calls fetch, renders API response |
| 9 | Shows error state on API failure | Error message + retry button visible |
| 10 | Retry button re-fetches on error | Second fetch attempt triggered |

---

### 3.2 FilterBar Component Tests

| # | Test Case | Expected Outcome |
|---|---|---|
| 1 | Keyword input filters by title/description | Projects matching keyword only |
| 2 | Keyword debounce delay (if applied) | No spurious re-renders |
| 3 | Tag filter (single select) | Only projects with selected tag shown |
| 4 | Tag filter (multi-select) | Projects with ANY selected tag shown |
| 5 | Clear all button resets filters | Full list returned, inputs empty |
| 6 | Clear individual filter | Only that filter removed, others persist |
| 7 | Keyword search is case-insensitive | "react" matches "React" and "REACT" |
| 8 | Tag filter handles projects with no tags | Such projects excluded from results |

---

### 3.3 SortControls Component Tests

| # | Test Case | Expected Outcome |
|---|---|---|
| 1 | Sort by Name (A-Z) | Projects alphabetically ordered |
| 2 | Sort by Name (Z-A) | Projects reverse alphabetically ordered |
| 3 | Sort by Date (newest first) | Most recent date appears first |
| 4 | Sort by Date (oldest first) | Oldest date appears first |
| 5 | Sort by Status (custom order) | Status order respected (e.g., active → paused → archived) |
| 6 | Dropdown opens on click | Menu items visible |
| 7 | Dropdown closes on selection | Menu hidden after selection |
| 8 | Current sort option highlighted | Visual indicator of active sort |

---

### 3.4 ProjectCard Component Tests

| # | Test Case | Expected Outcome |
|---|---|---|
| 1 | Renders all required fields | Name, description, tags, status all visible |
| 2 | Tags render as clickable badges | Each tag is a button/link element |
| 3 | Status color matches status value | "active" → green, "paused" → yellow, etc. |
| 4 | Long description truncates | Text ends with "…" after 3 lines |
| 5 | Long title handles overflow | Text wraps or truncates without breaking layout |
| 6 | Empty tags list | Card renders, no tag section shown or empty state |
| 7 | Unknown status value | Fallback color applied, no console error |
| 8 | Project with no description | Card renders, description area empty or hidden |

---

## 4. Integration Tests

| # | Test Case | Expected Outcome |
|---|---|---|
| 1 | Filter by tag, then sort by date | Both constraints applied, correct order |
| 2 | Clear filters after sorting | List returns to original state |
| 3 | Toggle mock/real data | Component re-renders, no crash |
| 4 | API call fails, user retries | Retry button triggers new fetch attempt |
| 5 | User searches, then sorts | Both constraints persist |
| 6 | Tag filter + clear all | All filters removed, full list shown |

---

## 5. Edge Case & Robustness Tests

| Category | Edge Case | Test Assertion |
|---|---|---|
| **Data** | Empty project list | "No projects found" message appears |
| **Data** | Project with null description | Card renders without error |
| **Data** | Very long project name (>100 chars) | Text wraps or truncates, layout intact |
| **Data** | Project with 10+ tags | All tags visible (or scrollable in tag area) |
| **Data** | Unknown status value | Fallback styling applied |
| **Network** | API timeout (>30s) | Timeout error shown, not hanging |
| **Network** | Network becomes offline mid-fetch | Error state shown |
| **Filter** | Filter matches no projects | "No results" message appears |
| **Sort** | Projects with equal dates | Stable sort (insertion order preserved or secondary sort) |

---

## 6. Accessibility Tests (a11y)

| # | Requirement | Test |
|---|---|---|
| 1 | Filter button keyboard-accessible | Tab focus visible, Enter triggers dropdown |
| 2 | Sort dropdown keyboard-accessible | Arrow keys navigate options, Enter selects |
| 3 | Project card link keyboard-accessible | Tab focus, Enter navigates or expands |
| 4 | Tag buttons keyboard-accessible | Tab focus, Enter filters by tag |
| 5 | FilterBar has associated labels | `<label for="...">` present for all inputs |
| 6 | "No projects" message announced | `role="status"` or `aria-live="polite"` |
| 7 | Loading spinner announced | `aria-label` or `aria-busy` attribute |
| 8 | Error message announced | `role="alert"` on error container |
| 9 | Sort dropdown has aria-label | "Sort by" or descriptive label present |
| 10 | Tag badges have descriptive text | `aria-label` or visible text on badge button |

---

## 7. Test Utilities & Helpers (testUtils.ts)

```typescript
// Custom render function with providers (if using Context, etc.)
export function renderWithProviders(component: React.ReactElement) {
  // Wrap with router, theme, API mock provider
}

// Helper to wait for data load
export async function waitForProjectLoad() {
  await screen.findByRole('listitem'); // Wait for first project
}

// Mock API responses
export const mockApiResponses = {
  success: () => MSW.use(handlers.getProjects()),
  error: () => MSW.use(handlers.getProjectsError()),
};
```

---

## 8. Coverage Goals

```
Lines:     ≥ 90%    (ProjectList, FilterBar, SortControls, ProjectCard)
Branches:  ≥ 85%    (conditional logic in filters, sorts, error states)
Functions: ≥ 90%    (handlers, callbacks, sort comparators)
```

---

## 9. Testing Mindset

- **Behavior, not implementation:** Test "when user filters, list updates", not "setFilter() called".
- **Data-driven:** Use fixtures with varied edge cases; avoid repetitive test setup.
- **Accessibility first:** Each interactive element must be keyboard-accessible and announced.
- **Regression prevention:** Cover error paths, edge data values, and state transitions.
- **Real-world scenarios:** Test filter + sort together, user clears filters, etc.

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Flaky async tests (debounce delays) | Use fake timers or wait for specific DOM changes |
| API mock mismatch | Use MSW (Mock Service Worker) to intercept real fetch calls |
| Accessibility oversight | Run axe-core in tests, test keyboard navigation manually |
| Coverage gap in error paths | Dedicated error-state fixtures; test retry logic |

---

## 11. Test Execution

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run ProjectList tests only
npm test -- ProjectList

# Run in watch mode
npm test -- --watch
```

---

**Next Steps:** Implement test setup (vitest.config.ts, package.json test script), create fixtures, then build test suites incrementally.
