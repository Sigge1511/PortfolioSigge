# ProjectList Component — Test Implementation Guide

**For:** Development team (Atlas & other coders)  
**Purpose:** Step-by-step guidance on implementing tests to Nyx's spec  
**Status:** Ready for implementation  

---

## Quick Start

### 1. Install Dependencies
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

### 2. Configuration Files
- ✅ `vitest.config.ts` — Already created
- ✅ `src/__tests__/setup.ts` — Already created
- ✅ `package.json` scripts — Already updated

### 3. Create Component Structure
```
src/components/ProjectList/
├── index.tsx                    # Export all components
├── types.ts                     # Type definitions
├── styles.css                   # Component styling
└── __tests__/
    ├── ProjectList.test.tsx
    ├── FilterBar.test.tsx
    ├── SortControls.test.tsx
    ├── ProjectCard.test.tsx
    ├── integration.test.tsx
    └── fixtures/
        ├── mockProjects.ts
        └── testUtils.ts
```

---

## Implementation Checklist

### Phase 1: Component Implementation
- [ ] Create `src/components/ProjectList/types.ts` with interface definitions
- [ ] Create `src/components/ProjectList/index.tsx` with all 4 components
- [ ] Create `src/components/ProjectList/styles.css` with styling

### Phase 2: Test Infrastructure
- [ ] Create `src/components/ProjectList/__tests__/fixtures/mockProjects.ts`
- [ ] Create `src/components/ProjectList/__tests__/fixtures/testUtils.ts`
- [ ] Run `npm test -- --no-coverage` to verify setup works

### Phase 3: Unit Tests
- [ ] Create `ProjectCard.test.tsx` (simplest component)
- [ ] Create `FilterBar.test.tsx`
- [ ] Create `SortControls.test.tsx`
- [ ] Create `ProjectList.test.tsx`

### Phase 4: Integration Tests
- [ ] Create `integration.test.tsx`
- [ ] Run full suite: `npm test`
- [ ] Check coverage: `npm test:coverage`

### Phase 5: Accessibility & Polish
- [ ] Add axe-core tests (optional)
- [ ] Verify all a11y requirements met
- [ ] Document any deviations from spec
- [ ] Update this guide with learnings

---

## Component Implementation Reference

### File: `src/components/ProjectList/types.ts`
```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: 'active' | 'completed' | 'paused' | 'archived';
  date: string; // ISO 8601 format: '2026-01-15'
}

export type SortKey = 'name' | 'date' | 'status';

export type FilterType = {
  keyword: string;
  tags: string[];
};

export interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  useMockData?: boolean;
}

export interface FilterBarProps {
  filters: FilterType;
  allTags: string[];
  onFilterChange: (filters: FilterType) => void;
}

export interface SortControlsProps {
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}

export interface ProjectCardProps {
  project: Project;
}
```

### File: `src/components/ProjectList/__tests__/fixtures/testUtils.ts`
```typescript
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function (add providers if needed later)
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // If using Router, Context, Theme, etc., wrap here
  return render(ui, { ...options });
}

// Common wait helpers
export async function waitForProjectLoad() {
  const { screen } = await import('@testing-library/react');
  return screen.findByTestId('projects-list');
}

// Common assertions
export const expect_a11y = {
  hasLabel: (element: HTMLElement, labelText: string) => {
    // Check for associated label
  },
  isKeyboardAccessible: (element: HTMLElement) => {
    // Check tabindex, role, etc.
  },
};
```

---

## Test Template

### ProjectCard.test.tsx Structure
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../index';
import { MOCK_PROJECTS } from './fixtures/mockProjects';

describe('ProjectCard', () => {
  describe('Rendering', () => {
    it('renders all required fields', () => {
      render(<ProjectCard project={MOCK_PROJECTS[0]} />);
      
      expect(screen.getByText(MOCK_PROJECTS[0].title)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(MOCK_PROJECTS[0].description.slice(0, 20)))).toBeInTheDocument();
      expect(screen.getByText(MOCK_PROJECTS[0].status)).toBeInTheDocument();
    });
  });

  describe('Tags', () => {
    it('renders tag button for each tag', () => {
      render(<ProjectCard project={MOCK_PROJECTS[0]} />);
      
      MOCK_PROJECTS[0].tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles project with no tags', () => {
      const noTagProject = { ...MOCK_PROJECTS[0], tags: [] };
      const { container } = render(<ProjectCard project={noTagProject} />);
      
      expect(container.querySelector('[data-testid*="tags"]')).not.toBeInTheDocument();
    });
  });
});
```

### FilterBar.test.tsx Structure
```typescript
describe('FilterBar', () => {
  describe('Keyword Search', () => {
    it('filters projects by title (case-insensitive)', () => {
      const mockOnChange = vi.fn();
      render(
        <FilterBar
          filters={{ keyword: '', tags: [] }}
          allTags={['React']}
          onFilterChange={mockOnChange}
        />
      );
      
      const input = screen.getByTestId('keyword-input');
      fireEvent.change(input, { target: { value: 'react' } });
      
      expect(mockOnChange).toHaveBeenCalledWith({
        keyword: 'react',
        tags: [],
      });
    });
  });

  describe('Tag Filtering', () => {
    it('toggles tag selection on click', () => {
      const mockOnChange = vi.fn();
      render(
        <FilterBar
          filters={{ keyword: '', tags: [] }}
          allTags={['React', 'TypeScript']}
          onFilterChange={mockOnChange}
        />
      );
      
      fireEvent.click(screen.getByTestId('tag-filter-React'));
      
      expect(mockOnChange).toHaveBeenCalledWith({
        keyword: '',
        tags: ['React'],
      });
    });
  });

  describe('Clear Filters', () => {
    it('resets filters when clear button clicked', () => {
      const mockOnChange = vi.fn();
      render(
        <FilterBar
          filters={{ keyword: 'test', tags: ['React'] }}
          allTags={['React']}
          onFilterChange={mockOnChange}
        />
      );
      
      fireEvent.click(screen.getByTestId('clear-filters-button'));
      
      expect(mockOnChange).toHaveBeenCalledWith({
        keyword: '',
        tags: [],
      });
    });
  });
});
```

### SortControls.test.tsx Structure
```typescript
describe('SortControls', () => {
  describe('Dropdown', () => {
    it('opens menu on button click', () => {
      const mockOnChange = vi.fn();
      render(
        <SortControls sortKey="date" onSortChange={mockOnChange} />
      );
      
      fireEvent.click(screen.getByTestId('sort-dropdown-button'));
      
      expect(screen.getByTestId('sort-menu')).toBeInTheDocument();
    });
  });

  describe('Sort Options', () => {
    it('calls onSortChange with "name" when Name option clicked', () => {
      const mockOnChange = vi.fn();
      render(
        <SortControls sortKey="date" onSortChange={mockOnChange} />
      );
      
      fireEvent.click(screen.getByTestId('sort-dropdown-button'));
      fireEvent.click(screen.getByTestId('sort-option-name'));
      
      expect(mockOnChange).toHaveBeenCalledWith('name');
    });
  });
});
```

### ProjectList Integration Test Structure
```typescript
describe('ProjectList Integration', () => {
  it('filters and then sorts projects correctly', () => {
    render(
      <ProjectList
        projects={MOCK_PROJECTS}
        useMockData={true}
      />
    );

    // 1. Filter by tag
    fireEvent.click(screen.getByTestId('tag-filter-React'));
    expect(screen.getAllByTestId(/^project-item-/)).toHaveLength(2); // React projects

    // 2. Sort by name
    fireEvent.click(screen.getByTestId('sort-dropdown-button'));
    fireEvent.click(screen.getByTestId('sort-option-name'));
    
    const items = screen.getAllByTestId(/^project-item-/);
    expect(items[0]).toHaveAttribute('data-testid', 'project-item-1'); // Developer Portfolio
    expect(items[1]).toHaveAttribute('data-testid', 'project-item-3'); // Task Manager
  });
});
```

---

## Running Tests

### Commands
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with UI
npm test -- --ui

# Run specific file
npm test -- ProjectCard.test.tsx

# Run with coverage
npm test:coverage

# Watch mode
npm test -- --watch

# Debugging
node --inspect-brk node_modules/.bin/vitest
```

### Expected Output
```
✓ ProjectList/ProjectCard.test.tsx (8 tests)
✓ ProjectList/FilterBar.test.tsx (12 tests)
✓ ProjectList/SortControls.test.tsx (10 tests)
✓ ProjectList/ProjectList.test.tsx (15 tests)
✓ ProjectList/integration.test.tsx (8 tests)

Test Files  5 passed (5)
     Tests  53 passed (53)
  Start at  14:23:05
  Duration  1.23s
```

---

## Debugging Tips

### Test Failing?
1. Check test output for specific error
2. Use `screen.debug()` to print DOM
3. Use `screen.logTestingPlaygroundURL()` for playground
4. Check fixture data matches test expectations
5. Verify component exports and imports

### Coverage Gap?
1. Run `npm test:coverage` to see report
2. Open `coverage/index.html` in browser
3. Look for red (uncovered) lines
4. Add test case for that branch
5. Rerun coverage

### Accessibility Issues?
1. Check all interactive elements have `data-testid`
2. Verify labels are associated with inputs
3. Check `role` attributes on custom components
4. Test with keyboard only (no mouse)
5. Use browser accessibility inspector

---

## Common Patterns

### Testing State Changes
```typescript
const mockOnChange = vi.fn();
render(<Component onChange={mockOnChange} />);
fireEvent.change(element, { target: { value: 'new' } });
expect(mockOnChange).toHaveBeenCalledWith('new');
```

### Testing Visibility
```typescript
expect(screen.getByTestId('element')).toBeInTheDocument();
expect(screen.queryByTestId('element')).not.toBeInTheDocument();
```

### Testing User Interaction
```typescript
import { userEvent } from '@testing-library/user-event';
const user = userEvent.setup();
await user.click(element);
await user.keyboard('{Tab}{Enter}');
```

### Testing Lists
```typescript
const items = screen.getAllByTestId(/^item-/);
expect(items).toHaveLength(5);
items.forEach((item, i) => {
  expect(item).toHaveTextContent(expectedData[i].name);
});
```

---

## Success Checklist

- [ ] All tests pass: `npm test`
- [ ] Coverage ≥90% lines: `npm test:coverage`
- [ ] No console warnings/errors
- [ ] No skipped tests (no `it.skip`, `describe.skip`)
- [ ] All accessibility requirements met
- [ ] Integration tests verify user workflows
- [ ] Edge cases covered (empty, errors, long text)
- [ ] Code review approved by Nyx

---

## Questions or Issues?

Refer to:
- `projectlist-test-strategy.md` — High-level strategy & goals
- `projectlist-test-specification.md` — Detailed test cases
- `.squad/decisions.md` — Team decisions
- Vitest docs: https://vitest.dev/
- RTL docs: https://testing-library.com/react
