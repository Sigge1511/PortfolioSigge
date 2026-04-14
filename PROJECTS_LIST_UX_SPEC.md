# Projects List Component — UX Design Spec

**Designer:** Lyra  
**Date:** 2025-07-16  
**Implementation Partner:** Selene  
**Status:** Ready for build  

---

## Overview

This spec describes the user experience for a **Projects List component** that displays a collection of projects with real-time filtering and sorting. The component accepts both mock data and live API responses, supports all three responsive breakpoints (mobile, tablet, desktop), and follows the existing PortfolioSigge design system (pure CSS, sharp corners, dark theme, emerald accent).

---

## 1. User Flow

### Step 1: Browse
User lands on the Projects page and sees the full gallery of projects arranged in a responsive grid. Default sort is by date (newest first).

### Step 2: Filter  
User types keywords in the search input OR clicks tag badges to filter. Results update **instantly** (no "Apply" button). Result count updates in real-time: "12 projects · 3 results shown" or "No projects match".

### Step 3: Explore  
User clicks a project card to expand details, or clicks a tech tag to filter by that tag. User can sort by name, date, or status while keeping filters active.

---

## 2. Screen Spec — Projects List View

### 2.1 Desktop Layout (1024px+)

```
┌─────────────────────────────────────────────────────────┐
│  Page Header                                             │
│  "Selected work"                                         │
│  "Projects"                                              │
│  "A collection of things I have built..."               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ┌──────────────────┐          ┌──────────┐ ┌────────┐ │
│  │ Search Projects  │  Clear   │ Sort ▼   │ │Tags ▼  │ │
│  │ (keyword filter) │          │          │ │        │ │
│  └──────────────────┘          └──────────┘ └────────┘ │
│                                                          │
│  Results: 12 projects (3 filtered)                      │
└─────────────────────────────────────────────────────────┘

Grid Layout (auto-fill, minmax(320px, 1fr)):

┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────┐
│ Project Card        │ │ Project Card        │ │ Project Card    │
│ ─────────────────── │ │ ─────────────────── │ │ ─────────────── │
│ [Image or Banner]   │ │ [Image or Banner]   │ │ [Image/Banner]  │
│                     │ │                     │ │                 │
│ Title               │ │ Title               │ │ Title           │
│ Short desc...       │ │ Short desc...       │ │ Short desc...   │
│                     │ │                     │ │                 │
│ [Tech] [Tag] [Tag]  │ │ [Tech] [Tag] [Tag]  │ │ [Tech] [Tag]    │
│ ┌─────────────────┐ │ │ ┌─────────────────┐ │ │ ┌─────────────┐ │
│ │ Details ▼       │ │ │ │ Details ▼       │ │ │ │Details ▼    │ │
│ └─────────────────┘ │ │ └─────────────────┘ │ │ └─────────────┘ │
└─────────────────────┘ └─────────────────────┘ └─────────────────┘

┌─────────────────────┐ ┌─────────────────────┐ ...
│ Project Card        │ │ Project Card        │
│ ...                 │ │ ...                 │
└─────────────────────┘ └─────────────────────┘
```

**Key measurements (Desktop, 1024px+):**
- Container max-width: 100% (full width with padding)
- Grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-lg);`
- Card padding: `var(--space-lg)` (24px)
- Filter bar padding: `var(--space-lg)` top/bottom, `var(--space-lg)` sides
- Gap between controls: `var(--space-md)` (16px)

---

### 2.2 Tablet Layout (768px - 1023px)

```
Grid changes to 2 columns:
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))

Filter bar wraps if needed:
- Search box on its own line if space is tight
- Sort and Tags dropdowns stack below on mobile

┌─────────────────────┐ ┌─────────────────────┐
│ Project Card        │ │ Project Card        │
│ ...                 │ │ ...                 │
└─────────────────────┘ └─────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ Project Card        │ │ Project Card        │
│ ...                 │ │ ...                 │
└─────────────────────┘ └─────────────────────┘
```

**Key measurements (Tablet, 768px-1023px):**
- Grid: `repeat(auto-fill, minmax(280px, 1fr))`
- Card padding: `var(--space-md)` (16px)
- Filter bar: Controls may wrap; ensure touch-friendly tap targets (44px min height)

---

### 2.3 Mobile Layout (< 768px)

```
┌──────────────────────────────┐
│  Page Header (narrower)       │
│  "Selected work"              │
│  "Projects"                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│ ┌────────────────────────────┤
│ │ Search Projects            │
│ └────────────────────────────┤
│                               │
│ ┌────────────────────────────┤
│ │ Sort ▼                      │
│ └────────────────────────────┤
│                               │
│ ┌────────────────────────────┤
│ │ Tags ▼                      │
│ └────────────────────────────┤
│                               │
│ Results: 3 projects (12 total)│
└──────────────────────────────┘

Single-column stack:
┌──────────────────────────────┐
│ Project Card                 │
│ ─────────────────────────────│
│ [Image/banner, full width]   │
│                              │
│ Title                        │
│ Description continues...     │
│                              │
│ [Badge] [Badge] [Badge]      │
│ ┌────────────────────────────┤
│ │ Details ▼                  │
│ └────────────────────────────┤
└──────────────────────────────┘

┌──────────────────────────────┐
│ Project Card                 │
│ ...                          │
└──────────────────────────────┘
```

**Key measurements (Mobile, <768px):**
- Grid: `1fr` (single column)
- Card padding: `var(--space-md)` (16px)
- Filter controls: Full-width stacked buttons/inputs, 44px min touch height
- Page padding: `var(--space-md)` left/right, `var(--space-lg)` top/bottom

---

## 3. Component Layout Details

### 3.1 Project Card Structure

Each project card is a `<article>` with:

```
<article class="project-card" role="listitem">
  
  <!-- Optional: card image or banner (if API provides image) -->
  <div class="project-card__image">
    <img src="..." alt="..." />
  </div>
  
  <!-- Content area -->
  <div class="project-card__content">
    
    <!-- Title -->
    <h3 class="project-card__title">Project Name</h3>
    
    <!-- Description (1-2 lines) -->
    <p class="project-card__desc">Short description...</p>
    
    <!-- Tech stack (inline badges) -->
    <div class="project-card__stack">
      <span class="tech-badge">React</span>
      <span class="tech-badge">TypeScript</span>
      <span class="tech-badge">API</span>
    </div>
    
    <!-- Optional: Status indicator if provided -->
    <div class="project-card__status">
      <span class="status-indicator" data-status="active">Live</span>
    </div>
    
    <!-- Expand button (existing toggle pattern) -->
    <button
      class="project-card__toggle"
      aria-expanded="false"
      aria-controls="details-xyz"
    >
      Details ▼
    </button>
    
    <!-- Expandable details section -->
    <div class="project-card__details" id="details-xyz" role="region" aria-hidden="true">
      <p>Detailed description, learnings, or call-to-action...</p>
    </div>
  </div>
  
</article>
```

**Card Dimensions:**
- Min-width: 280px (tablet/mobile), 320px (desktop)
- No fixed height — allows content to flow naturally
- Padding: `var(--card-padding)` = 24px (desktop), 16px (mobile)
- Border: `1px solid var(--color-border)`
- Background: `var(--color-surface)`
- Sharp corners (no border-radius) — consistent with design system

---

### 3.2 Filter Bar Structure

```
<div class="projects-filter-bar">
  
  <!-- Search input -->
  <div class="filter-group filter-group--search">
    <label for="search-projects">Search</label>
    <input
      type="text"
      id="search-projects"
      placeholder="Search by name or description..."
      class="filter-input"
      value={searchKeyword}
      onChange={handleSearch}
      aria-label="Search projects by keyword"
    />
  </div>
  
  <!-- Clear filters (hidden if no active filters) -->
  <button
    class="filter-btn filter-btn--secondary"
    onClick={handleClearFilters}
    aria-label="Clear all filters"
    style={{ display: activeFilters ? 'inline-block' : 'none' }}
  >
    Clear
  </button>
  
  <!-- Sort dropdown -->
  <div class="filter-group filter-group--select">
    <label for="sort-select">Sort</label>
    <select
      id="sort-select"
      class="filter-select"
      value={sortBy}
      onChange={handleSort}
      aria-label="Sort projects"
    >
      <option value="date-desc">Newest First</option>
      <option value="date-asc">Oldest First</option>
      <option value="name-asc">Name (A–Z)</option>
      <option value="name-desc">Name (Z–A)</option>
      <option value="status">Status</option>
    </select>
  </div>
  
  <!-- Optional: Tech tag filter (if API provides tags) -->
  <div class="filter-group filter-group--tags">
    <label for="tags-select">Filter by Tech</label>
    <select
      id="tags-select"
      class="filter-select filter-select--multi"
      multiple
      value={selectedTags}
      onChange={handleTagFilter}
      aria-label="Filter by technology tags"
    >
      <option value="react">React</option>
      <option value="typescript">TypeScript</option>
      <option value="csharp">C#</option>
      <option value="sql">SQL</option>
      <!-- ... dynamic from all projects -->
    </select>
  </div>
  
</div>

<!-- Result summary (below filter bar) -->
<div class="projects-summary" role="status" aria-live="polite">
  <p>
    {totalProjects} projects
    {activeFilters && ` • ${filteredCount} results`}
  </p>
</div>
```

---

## 4. States Documentation

### 4.1 Empty State (No Projects)

**When:** User has filters active but no results match.

```
┌──────────────────────────────────────┐
│  Projects                             │
│                                       │
│         ⚠️  No projects found         │
│                                       │
│  Try adjusting your search or        │
│  filters, or view all projects.      │
│                                       │
│       ┌────────────────────────┐    │
│       │  Clear Filters         │    │
│       └────────────────────────┘    │
│                                       │
│       ┌────────────────────────┐    │
│       │  View All Projects     │    │
│       └────────────────────────┘    │
└──────────────────────────────────────┘
```

**HTML:**
```
<div class="projects-empty" role="status">
  <div class="empty-icon">⚠️</div>
  <h2 class="empty-title">No projects found</h2>
  <p class="empty-message">Try adjusting your search or filters.</p>
  <div class="empty-actions">
    <button onClick={clearFilters} class="btn btn--primary">
      Clear Filters
    </button>
    <button onClick={viewAll} class="btn btn--secondary">
      View All
    </button>
  </div>
</div>
```

**Styling:**
- Icon: Large (48px), centered, color: `var(--color-text-muted)`
- Title: 1.25rem, font-weight 600, color: `var(--color-text)`
- Message: 0.95rem, color: `var(--color-text-muted)`, max-width 300px
- Buttons: Primary (emerald) + secondary (gray), full-width on mobile

---

### 4.2 Loading State (Projects Fetching)

**When:** API is fetching projects.

```
┌──────────────────────────────────────┐
│ [Search skeleton]                    │
│                                       │
│ [Sort skeleton] [Tags skeleton]       │
│                                       │
│ ┌──────────────┐ ┌──────────────┐   │
│ │ ▌▌▌▌▌▌▌▌▌▌  │ │ ▌▌▌▌▌▌▌▌▌▌  │   │
│ │ ▌▌▌▌▌▌       │ │ ▌▌▌▌▌▌       │   │
│ │ ▌▌▌▌▌▌▌▌▌▌  │ │ ▌▌▌▌▌▌▌▌▌▌  │   │
│ │ ▌▌▌▌▌        │ │ ▌▌▌▌         │   │
│ └──────────────┘ └──────────────┘   │
│                                       │
│ ┌──────────────┐ ┌──────────────┐   │
│ │ ▌▌▌▌▌▌▌▌▌▌  │ │ ▌▌▌▌▌▌▌▌▌▌  │   │
│ │ ...          │ │ ...          │   │
│ └──────────────┘ └──────────────┘   │
└──────────────────────────────────────┘
```

**Implementation:** Skeleton loader component with:
- 3–6 skeleton cards depending on viewport
- Each card shows: image placeholder, title shimmer, description shimmer, badge shimmer
- Shimmer animation: `background linear-gradient`, animation: `slide 1.5s infinite`
- Cards are NOT clickable during load
- Filter bar is disabled (greyed out, pointer-events: none)

**HTML:**
```
<div class="projects-loading" role="status" aria-label="Loading projects">
  <div class="skeleton skeleton--card"></div>
  <div class="skeleton skeleton--card"></div>
  <div class="skeleton skeleton--card"></div>
</div>
```

---

### 4.3 Filtered/Results State (Normal with Active Filters)

**When:** User has active filters. Show result count and allow clear.

```
┌──────────────────────────────────┐
│ [Search: "react"]  [Clear]       │
│                                   │
│ 12 projects · 3 results           │
│                                   │
│ [Card] [Card] [Card]              │
│ [Card] [Card]                     │
└──────────────────────────────────┘
```

**Behavior:**
- "Clear" button visible only if filters are active
- Result count updates in real-time as user types/selects
- Color: `var(--color-text-muted)` for count, normal text for summary
- Summary has `role="status"` + `aria-live="polite"` for screen readers

---

### 4.4 Error State (Failed to Fetch)

**When:** API request fails or returns error.

```
┌──────────────────────────────────────┐
│         ❌ Failed to Load             │
│                                       │
│   We couldn't load your projects.    │
│   Please check your connection and   │
│   try again.                         │
│                                       │
│       ┌────────────────────────┐    │
│       │  Try Again             │    │
│       └────────────────────────┘    │
│                                       │
│       ┌────────────────────────┐    │
│       │  View Mock Data        │    │
│       └────────────────────────┘    │
└──────────────────────────────────────┘
```

**HTML:**
```
<div class="projects-error" role="alert">
  <div class="error-icon">❌</div>
  <h2 class="error-title">Failed to Load</h2>
  <p class="error-message">We couldn't load your projects. Please check your connection.</p>
  <div class="error-actions">
    <button onClick={retry} class="btn btn--primary">
      Try Again
    </button>
    <button onClick={useMockData} class="btn btn--secondary">
      Use Mock Data
    </button>
  </div>
</div>
```

**Styling:**
- Icon: 48px, color: `var(--color-text-muted)` (or light red if available)
- Title: 1.25rem, font-weight 600
- Message: Small, muted text
- Buttons: Primary (retry) + secondary (fallback to mock)

---

## 5. Interaction Patterns

### 5.1 Search / Keyword Filter
- **Trigger:** User types in "Search projects" input
- **Behavior:** Real-time filtering; no debounce initially (can add 300ms debounce if performance needed)
- **Scope:** Filters by project title, description, AND tech stack keywords
- **Result:** Shows only projects matching the keyword
- **Clear:** Keyword filter clears when user clicks "Clear" button or manually empties the input

### 5.2 Tag Filter (Clickable in Cards + Dropdown)
- **Trigger:** User clicks a tech badge within a card OR selects from "Filter by Tech" dropdown
- **Behavior:** 
  - Clicking a tag in a card immediately filters to show only projects with that tag
  - Clicking the same tag again toggles it OFF
  - Multiple tags can be active (AND logic — must have ALL selected tags)
  - Selected tags are visually highlighted in the dropdown
- **Result:** Grid updates in real-time
- **Clear:** "Clear" button removes all active tag filters

### 5.3 Sort Dropdown
- **Trigger:** User opens "Sort" dropdown and selects an option
- **Behavior:** 
  - Dropdown closes immediately after selection
  - Grid re-sorts without losing any filtered results
  - Current sort value is visible in the dropdown button: "Sort: Newest First"
- **Options:**
  - Newest First (date descending) — default
  - Oldest First (date ascending)
  - Name A–Z (alphabetical ascending)
  - Name Z–A (alphabetical descending)
  - Status (if provided; groups by status type)

### 5.4 Project Card Click / Expand
- **Trigger:** User clicks the "Details ▼" button
- **Behavior:**
  - Card expands to show full details section
  - Button text changes to "Details ▲" (or "Close")
  - Details section slides in smoothly (max-height transition, 0.4s ease)
  - Only ONE card can be expanded at a time (close previous if user expands another)
- **Accessibility:** 
  - Button has `aria-expanded="true/false"`
  - Button has `aria-controls="details-{id}"`
  - Details div has `id="details-{id}"` and `role="region"`
  - Details div has `aria-hidden="true"` when collapsed

### 5.5 Tag Badge Click Within Card
- **Trigger:** User clicks a tech badge inside a project card (e.g., "React")
- **Behavior:**
  - That tag is added to the tag filter
  - Grid immediately filters to show only projects with that tag
  - If the tag is already filtered, clicking it removes the filter
  - Visual feedback: Badge pulses or highlights briefly to show it was clicked
- **Not:** Navigates away; stays on the Projects page

---

## 6. Accessibility Requirements

### 6.1 Keyboard Navigation
- All interactive elements (buttons, inputs, dropdowns) are keyboard-focusable (`tabindex="0"` or native)
- Tab order follows left-to-right, top-to-bottom visual flow
- Dropdowns are operable via arrow keys (open, navigate, select, close)
- Escape key closes any open dropdown
- Enter key activates buttons; Space activates checkboxes in multi-select

### 6.2 ARIA Labels & Roles

| Element | ARIA Attribute | Value |
|---------|---|---|
| Search input | `aria-label` | "Search projects by keyword" |
| Sort dropdown | `aria-label` | "Sort projects" |
| Tag filter | `aria-label` | "Filter by technology tags" |
| "Clear" button | `aria-label` | "Clear all filters" |
| Details button | `aria-expanded` | "true" or "false" |
| Details button | `aria-controls` | `details-{projectId}` |
| Details section | `id` | `details-{projectId}` |
| Details section | `role` | "region" |
| Details section | `aria-hidden` | "true" or "false" |
| Result summary | `role` | "status" |
| Result summary | `aria-live` | "polite" |
| Empty state | `role` | "status" |
| Error state | `role` | "alert" |
| Loading state | `role` | "status" |
| Card | `role` | "listitem" |
| Card list | `role` | "list" |

### 6.3 Color Contrast
- Text: `var(--color-text)` (#f5f5f5) on `var(--color-surface)` (#111111) = 17:1 ✓ (WCAG AAA)
- Muted text: `var(--color-text-muted)` (#888888) on surface = 7:1 ✓ (WCAG AA)
- Accent: `var(--color-accent-light)` (#016922) on surface — check and ensure ≥4.5:1
- Buttons: Emerald primary on dark surface = sufficient contrast

### 6.4 Focus Indicators
- All focusable elements have visible `:focus-visible` ring using `box-shadow: var(--focus-ring)`
- Focus ring is 3px, color: `var(--accent-border)` = semi-transparent emerald
- No elements use `outline: none` without a replacement focus style

### 6.5 Reduced Motion
- Respect `prefers-reduced-motion: reduce`
- All transitions (expand, sort, filter) are removed if user has set this preference
- Skeleton loaders have NO animation (static appearance)
- CSS rule:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
  ```

### 6.6 Form Labels
- Every input has an associated `<label>` with `for={inputId}`
- Placeholder text is NOT a substitute for label; label is always visible or off-screen (sr-only class)

---

## 7. Design System Alignment

### 7.1 Typography
- **Page Title:** 
  - Font: Inter 700 (bold)
  - Size: 2.5rem (desktop), 2rem (tablet), 1.5rem (mobile)
  - Color: `var(--color-text)`
  - Spacing: `letter-spacing: 0.02em`

- **Card Title (project name):**
  - Font: Inter 600 (semi-bold)
  - Size: 1.25rem
  - Color: `var(--color-text)`
  - Line-height: 1.4

- **Description text:**
  - Font: Inter 400 (regular)
  - Size: 0.95rem
  - Color: `var(--color-text-muted)`
  - Line-height: 1.6

- **Tech badges / Tags:**
  - Font: monospace (`var(--font-mono)`) — visually distinct from prose
  - Size: 0.85rem
  - Text-transform: uppercase
  - Letter-spacing: 0.04em
  - Color: `var(--color-accent-light)`

- **Filter labels:**
  - Font: Inter 500 (medium)
  - Size: 0.875rem
  - Color: `var(--color-text-muted)`
  - Text-transform: uppercase
  - Letter-spacing: 0.03em

### 7.2 Spacing Scale
All spacing uses the design system scale:

```
--space-xs:  4px  (rarely used)
--space-sm:  8px  (gaps within components)
--space-md:  16px (standard gap, padding)
--space-lg:  24px (card padding, section padding)
--space-xl:  48px (section margin, large gaps)
--space-2xl: 64px (header spacing, hero padding)
```

**Applied to this component:**
- Filter bar padding: `--space-lg` vertical, `--space-lg` horizontal
- Gap between filter controls: `--space-md`
- Grid gap between cards: `--space-lg`
- Card padding: `--space-lg` (desktop/tablet), `--space-md` (mobile)
- Gap between card elements (title → desc → stack): `--space-sm`

### 7.3 Colors

| Element | Token | Value | Usage |
|---------|-------|-------|-------|
| Background | `--color-bg` | #0a0a0a | Page background |
| Card surface | `--color-surface` | #111111 | Card, input backgrounds |
| Surface hover | `--color-surface-2` | #1a1a1a | Hover state |
| Border | `--color-border` | #222222 | Dividers, card borders |
| Text primary | `--color-text` | #f5f5f5 | All headings, main text |
| Text muted | `--color-text-muted` | #888888 | Labels, secondary text |
| Accent primary | `--color-accent` | #01421d | CTA buttons, active states |
| Accent light | `--color-accent-light` | #016922 | Hover, focus, links, badges |
| Accent semi | `--accent-border` | rgba(16, 185, 129, 0.4) | Focus ring glow |

**Status colors (if project status is included):**
- Active / Published: `var(--color-accent-light)` (emerald)
- Draft / In Progress: `var(--color-text-muted)` (gray)
- Archived: `var(--color-text-muted)` (gray, dimmer)

### 7.4 Borders & Corners
- **Border radius:** NONE — all elements have sharp corners (0px)
- **Border style:** `1px solid var(--color-border)` for cards and inputs
- **Border on hover:** Optional, can remain same or lighten to `var(--accent-border)` for card on hover

### 7.5 Shadows
- No drop shadows on cards (flat design; use border for definition)
- Focus ring uses `box-shadow: var(--focus-ring)` (3px glow, no blur)

### 7.6 Transitions

| Interaction | Timing | Easing | Use |
|---|---|---|---|
| Hover state (color, border) | `var(--transition-fast)` (0.20s) | ease | Quick feedback |
| Card expand/collapse | `var(--transition-expand)` (0.7s) | cubic-bezier(0.4, 0, 0.2, 1) | Smooth, leisurely |
| Focus ring | `var(--transition-fast)` (0.20s) | ease | Keyboard navigation feedback |
| Dropdown open/close | `var(--transition-normal)` (0.52s) | cubic-bezier | Smooth reveal |
| Filter update (grid sort) | `var(--transition-fast)` (0.20s) | ease | Quick re-sort |

---

## 8. Mock Data Structure

For testing before API integration, use this shape:

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  details: string;
  techStack: string[];
  status?: 'active' | 'draft' | 'archived';
  dateCreated?: Date; // for sorting
  imageUrl?: string;  // optional card image
  githubUrl?: string; // optional link
}

const mockProjects: Project[] = [
  {
    id: 'portfolio',
    title: 'Developer Portfolio',
    description: 'Personal portfolio site - React, TypeScript, Vite, CSS',
    details: 'A fully custom portfolio...',
    techStack: ['React', 'TypeScript', 'Vite', 'CSS'],
    status: 'active',
    dateCreated: new Date('2025-01-01'),
  },
  // ... more projects
];
```

---

## 9. Component API (Props)

The component should accept:

```typescript
interface ProjectsListProps {
  // Data
  projects: Project[];
  isLoading?: boolean;
  error?: string | null;
  
  // Handlers
  onFilterChange?: (filters: FilterState) => void;
  onProjectClick?: (projectId: string) => void;
  onRetry?: () => void;
  
  // Options
  defaultSort?: 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';
  enableImagePreload?: boolean;
  gridColumns?: 'auto' | '2' | '3';
}

interface FilterState {
  searchKeyword: string;
  selectedTags: string[];
  sortBy: string;
}
```

---

## 10. Implementation Notes for Selene

1. **Filter input:** Use a native `<input type="text">` with `placeholder="Search projects..."` and `onChange` handler for real-time filtering.

2. **Dropdowns:** Use native `<select>` elements for sort and tag filter. No third-party library required. Make them keyboard-friendly by default.

3. **Grid responsiveness:** Use CSS Grid with `repeat(auto-fill, minmax(320px, 1fr))` on desktop. Override to `1fr` below 768px. No media queries needed if you use `auto-fill` + `minmax`.

4. **Expand/collapse:** Reuse the existing pattern from `src/pages/Projects.tsx` — toggle state with `useState`, use `max-height` + `opacity` CSS transition for smooth expand.

5. **Real-time updates:** As filter state changes, update the displayed grid immediately. No "Apply" button. Use `Array.filter()` + `Array.sort()` to derive filtered/sorted results in render.

6. **Accessibility:** Add all ARIA attributes listed in Section 6.2. Test with keyboard and a screen reader (NVDA or JAWS).

7. **CSS:** Write new styles in a separate `projects-list.css` file (or extend existing `projects.css`). Use only the tokens defined in `src/index.css` — no hardcoded colors or sizes.

8. **Error fallback:** If API fails, show the error state and offer a "View Mock Data" button to load from `projects.ts`.

---

## 11. Visual Hierarchy Summary

**Desktop view:**
```
┌─ Page Title (h1, 2.5rem, bold)
├─ Subtitle (smaller text)
│
├─ Filter Bar
│  ├─ Search input
│  ├─ Clear button (if filters active)
│  ├─ Sort dropdown
│  └─ Tag filter dropdown
│
├─ Result summary (small, muted)
│
└─ Project Grid (3 columns)
   ├─ Card 1
   │  ├─ Image/banner
   │  ├─ Title (h3, 1.25rem)
   │  ├─ Description (0.95rem)
   │  ├─ Tech badges (0.85rem, monospace)
   │  └─ Details button
   │
   ├─ Card 2 ...
   └─ Card 3 ...
```

---

## 12. Success Criteria

✅ User can search projects by keyword in real-time  
✅ User can filter by clicking tech badges in cards  
✅ User can sort by date, name, or status without losing filters  
✅ Grid responds fluidly across mobile (1 col), tablet (2 col), desktop (3 col)  
✅ Empty state shows when no results; error state shows on API failure  
✅ All buttons, inputs, and dropdowns are keyboard-navigable  
✅ Focus ring visible and clear on all interactive elements  
✅ Screen reader announces filter updates via `role="status"` + `aria-live`  
✅ Card expand transitions smoothly; only one card expanded at a time  
✅ All text contrasts meet WCAG AA (7:1) or AAA (10:1) standards  
✅ No transitions if user has `prefers-reduced-motion: reduce`  
✅ Matches existing design system (sharp corners, dark theme, emerald accent, Inter font)  

---

## Appendix: CSS Utility Classes (to define or reuse)

```css
/* Buttons */
.btn {
  padding: var(--space-md) var(--space-lg);
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.btn--primary {
  background-color: var(--color-accent-light);
  color: var(--color-bg);
}

.btn--primary:hover {
  background-color: var(--color-accent);
}

.btn--secondary {
  background-color: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn--secondary:hover {
  background-color: var(--color-border);
}

.btn:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* Inputs */
.filter-input,
.filter-select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-main);
  font-size: 0.95rem;
  transition: border-color var(--transition-fast);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-accent-light);
  box-shadow: var(--focus-ring);
}

/* Badge */
.tech-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background-color: rgba(1, 66, 29, 0.25);
  border: 1px solid var(--color-accent-light);
  color: var(--color-accent-light);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.tech-badge:hover {
  background-color: var(--color-accent-light);
  color: var(--color-bg);
}

/* Skeleton loader shimmer */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 0%,
    var(--color-surface-2) 50%,
    var(--color-surface) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

---

**End of spec. Selene, you have everything you need to build this. Ask Lyra if anything needs clarification.**
