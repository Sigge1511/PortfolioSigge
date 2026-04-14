# ProjectList Test Strategy — Quick Reference Card

**Date:** 2026-03-29  
**Status:** ✅ Ready for Implementation  

---

## 📊 Test Coverage at a Glance

```
Component          Unit Tests    Integration    Edge Cases    A11y Tests
─────────────────────────────────────────────────────────────────────
ProjectCard        8             -              4            2
FilterBar          8             2              3            2
SortControls       8             1              2            3
ProjectList        14            3              3            3
─────────────────────────────────────────────────────────────────────
TOTAL              38            6              12           10
```

**Coverage Targets:**
- Lines: ≥90% | Branches: ≥85% | Functions: ≥90%

---

## 📚 Documentation Files

| File | Lines | Purpose |
|---|---|---|
| **projectlist-test-strategy.md** | ~320 | High-level architecture & goals |
| **projectlist-test-specification.md** | ~450 | Detailed test cases (80+) |
| **projectlist-implementation-guide.md** | ~380 | Developer step-by-step guide |
| **SUMMARY.md** | ~180 | Executive summary |
| **DELIVERABLES.md** | ~220 | Checklist & success criteria |

All files in: `.squad/agents/nyx/`

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage report
npm test:coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- ProjectCard.test.tsx

# Run with UI dashboard
npm test -- --ui
```

---

## 🎯 Implementation Phases

1. **Phase 1:** Create component (ProjectList, FilterBar, SortControls, ProjectCard)
2. **Phase 2:** Create test fixtures (mockProjects.ts, testUtils.ts)
3. **Phase 3:** Write unit tests (ProjectCard → FilterBar → SortControls → ProjectList)
4. **Phase 4:** Write integration tests (user workflows)
5. **Phase 5:** Verify coverage & a11y compliance

**Reference:** `projectlist-implementation-guide.md` Phase checklist

---

## 📋 Test Categories Breakdown

### Unit Tests (38 cases)
- **ProjectList (14):** Loading, empty, error, results, filtering, sorting, combinations
- **FilterBar (8):** Keyword search, tag filtering, clearing, edge cases
- **SortControls (8):** Sort options, dropdown toggle, keyboard nav, highlighting
- **ProjectCard (8):** Content rendering, tags, status colors, truncation, edge cases

### Integration Tests (6 cases)
- Filter + sort together → correct order
- Clear filters → list resets
- Mock/real data toggle → no crash
- Error state + retry → recovers
- User workflows (search → filter → sort → clear)
- State transitions

### Edge Cases (12 cases)
- Empty list, 0 filter results
- Very long names (>100 chars), many tags (8+)
- Special characters, emojis, unknown status
- Null/empty description, same dates
- Text truncation, layout integrity

### Accessibility (10 cases)
- Keyboard navigation (Tab, Arrow, Enter, Escape)
- ARIA attributes (labels, pressed, expanded, role, live)
- Semantic HTML (button, label, article, time)
- Screen reader announcements

---

## 📊 Mock Data Strategy

**MOCK_PROJECTS** (5 standard projects)
- Varied titles, descriptions, tags (1-4 per project)
- All status values (active, completed, paused, archived)
- Recent dates (within 3 months)

**EDGE_CASE_PROJECTS** (5 boundary scenarios)
- Empty title, title >100 chars, emojis/special chars
- No tags, many tags (8+), unknown status
- Very long description (tests truncation)

**SAME_DATE_PROJECTS** (3 projects, same date)
- Tests stable sort when primary key ties
- Alphabetically: Alpha, Beta, Zebra

---

## ✅ Success Checklist

Before merging to main:

- [ ] All 56+ tests pass (`npm test`)
- [ ] Coverage ≥90% lines, ≥85% branches, ≥90% functions
- [ ] No skipped tests (no `it.skip`, `describe.skip`)
- [ ] No console warnings/errors
- [ ] Keyboard nav works end-to-end (Tab, Arrow, Enter)
- [ ] Screen reader announces all content
- [ ] Edge cases handled (empty, long text, special chars)
- [ ] Code review approved
- [ ] QA verified against specification

---

## 🔍 Common Test Patterns

### Testing Filters
```typescript
// User types in keyword
fireEvent.change(input, { target: { value: 'react' } });
expect(mockOnChange).toHaveBeenCalledWith({ keyword: 'react', tags: [] });
```

### Testing Sort
```typescript
// User selects sort option
fireEvent.click(screen.getByTestId('sort-option-name'));
expect(mockOnChange).toHaveBeenCalledWith('name');
```

### Testing Tag Toggle
```typescript
// User clicks tag
fireEvent.click(screen.getByTestId('tag-filter-React'));
expect(mockOnChange).toHaveBeenCalledWith({ keyword: '', tags: ['React'] });
```

### Testing Empty State
```typescript
render(<ProjectList projects={[]} />);
expect(screen.getByTestId('empty-state')).toBeInTheDocument();
expect(screen.getByRole('status')).toBeInTheDocument();
```

---

## 🛠️ Debugging Tips

| Problem | Solution |
|---|---|
| Test fails but unclear why | Add `screen.debug()` to print DOM |
| Async test timeout | Use `waitFor()` or `findBy*()` instead of `getBy*()` |
| Event not triggering | Use `@testing-library/user-event` instead of `fireEvent` |
| Coverage gap | Check `coverage/index.html` for uncovered lines |
| Flaky test | Use fake timers (`vi.useFakeTimers()`) for debounce tests |

---

## 📞 Questions?

Refer to:
- **"How do I implement the tests?"** → `projectlist-implementation-guide.md`
- **"What exactly should this test case check?"** → `projectlist-test-specification.md`
- **"Why did you design it this way?"** → `projectlist-test-strategy.md`
- **"What files do I need to create?"** → `DELIVERABLES.md`

---

## 🎓 Key Design Decisions

| Decision | Why |
|---|---|
| Fixtures over builders | Simpler for most tests; less setup boilerplate |
| Behavior tests not implementation | Catches bugs; more resilient to refactoring |
| role="status" on empty state | Screen readers announce state changes |
| 3-line truncation + "…" | Visible, testable, graceful overflow handling |
| Stable sort by date | Prevents flaky tests when dates are equal |
| Multi-tag OR logic | Common user expectation (show projects with ANY selected tag) |

---

## 🏆 Coverage Targets

```
Minimum Acceptable:
├── Lines: 90%      (450+ of 500 lines)
├── Branches: 85%   (85+ of 100 branches)
├── Functions: 90%  (18+ of 20 functions)
└── Statements: 90% (450+ of 500 statements)

Per Component:
├── ProjectCard: 88% lines, 85% branches
├── FilterBar: 92% lines, 88% branches
├── SortControls: 90% lines, 85% branches
└── ProjectList: 95% lines, 90% branches
```

---

**Version:** 1.0  
**Last Updated:** 2026-03-29  
**Prepared by:** Nyx (QA/Test Engineer)
