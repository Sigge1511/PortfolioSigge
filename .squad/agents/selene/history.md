### 2026-07-10: Full portfolio build (React Router + design system)
- Built complete 5-page portfolio with React Router v6.
- Design tokens: dark theme, emerald accent, Inter font, no border-radius.
- CSS architecture: global.css, component CSS, per-page CSS in styles/pages/.
- Components: Navbar (mobile hamburger), Footer, HeroBanner. Pages: Home, About, Projects, Skills, Contact.
- react-router-dom ^6.22.0 added to package.json.

### 2026-03-29: ProjectList Component Integration

**Context:** Integrated ProjectList component into Projects.tsx. Parallel phase with Lyra (Contact UX validation) and Nyx (QA planning). Architecture approved by Morgana (Morgana-ProjectList-Architecture decision).

**Implementation Details:**
- **Components created:**
  - `src/components/ProjectList/ProjectList.tsx` — Orchestrator (state, filtering, sorting, rendering)
  - `src/components/ProjectList/FilterControls.tsx` — Tech stack filter UI
  - `src/components/ProjectList/SortMenu.tsx` — Sort menu (name/date/status/complexity)
- **Integration in Projects.tsx:** Updated page to use ProjectList component; removed inline filter/sort logic
- **CSS integration:** Mapped to portfolio design system (--color-*, --spacing-*, no border-radius)
- **Filtering:** Keyword input + multi-select tech stack tags; state updated on user input
- **Sorting:** Name (A-Z), date (newest/oldest), status (draft/published), complexity (1–5)
- **Responsive grid:** CSS Grid auto-fill + minmax(320px, 1fr); reflows on all breakpoints
- **Data flow:** Adapter pattern (projectsAdapter.ts) abstracts mock vs. real API
- **TypeScript:** Zero errors; all interfaces match Morgana architecture (explicit props, single-responsibility components)

**Key Learning:**
- Layered composition (ProjectList + FilterControls + SortMenu) enables independent testing and reuse. Single-responsibility principle worked well; no cross-component coupling.
- Adapter pattern for data source abstraction is essential for testing. Mock/real toggle via environment flag is clean and maintainable.
- CSS Grid auto-fill is perfect for this gallery layout. No need for explicit breakpoint switches; responsive behavior is automatic.
- Explicit props contracts make data flow traceable. A reader follows props in/out without hunting for hidden state or defaults.

**TypeScript Learnings:**
- `Set<string>` for selectedTechs is more performant than array lookups when checking "is tech selected?"
- Callback signatures (onFilterChange, onSortChange) give test seams without spying on internal component state.
- Morgana's architecture precluded context overkill; useState in ProjectList is sufficient for single-page use.

**Outcome:** Integration complete. All 3 components created, CSS variables mapped, filters/sorting wired, responsive grid verified, zero TypeScript errors. Ready for Nyx testing.
