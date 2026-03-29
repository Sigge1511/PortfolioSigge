# Team Decisions

<!-- Append entries below. Format per .squad/templates/skill.md -->
<!-- This file is the canonical decision ledger for PortfolioSigge. -->

# Circe Product Brief: Portfolio Page Setup

## 1. Scope
- Implement a portfolio landing page using React + TypeScript + Vite.
- Pure CSS (no Tailwind), using CSS Variables for theming (dark mode, accent color).
- CSS Grid for project gallery; Flexbox for navigation and hero.
- "Click to Reveal" project details using a CSS `.is-expanded` toggle.
- TypeScript `Project` interface: `id`, `title`, `description`, `techStack[]`, `details`.
- ProjectRenderer as a React component.
- Pedagogical C#/.NET comparison comments in TypeScript files.
- File structure adapted for React: `index.html`, `src/main.tsx`, `src/projects.ts`, `src/styles.css` (or `index.css`).

## 2. React Adaptations
- All UI logic and rendering in React components (not vanilla TS modules).
- `ProjectRenderer` is a React component, not a function.
- CSS lives in `src/index.css` (already present, extend for requirements).
- Use React state for toggling `.is-expanded` on project cards.
- TypeScript interfaces in `.ts`/`.tsx` files, with C# comparison comments inline.

## 3. Acceptance Criteria
- AC-1: Portfolio page renders with navigation, hero, and project gallery.
- AC-2: Pure CSS (no Tailwind, no CSS-in-JS); uses CSS Variables for dark mode and accent color.
- AC-3: Project gallery uses CSS Grid; navigation/hero use Flexbox.
- AC-4: Each project card supports "Click to Reveal" details via `.is-expanded` toggle.
- AC-5: TypeScript `Project` interface matches spec and is used in code.
- AC-6: ProjectRenderer is a React component.
- AC-7: C#/.NET comparison comments present in TypeScript files.
- AC-8: File structure matches React adaptation (see above).
- AC-9: Static build is deployable to Strato (no server-side code required).

## 4. Out of Scope
- No Tailwind, CSS-in-JS, or third-party CSS frameworks.
- No backend/API integration.
- No advanced animations or interactivity beyond "Click to Reveal".
- No non-React/TypeScript code.

## 5. Deployment Note
- Deliver as a static build (Vite `build` output) suitable for Strato static hosting.

---

### 2026-03-29T22:37:39Z: User directive
**By:** MajaSigfeldt (via Copilot)
**What:** Always consult Vespera before AND after every build. Her security review is mandatory in the coven workflow.
**Why:** User request — captured for team memory

# Freya: Pedagogical Comment Review — Portfolio Files

**Date:** 2025-07-15  
**Branch:** `1-start-portfolio-page-setup`  
**Commit reviewed:** 43c14b3 (Selene's implementation)

## Files Reviewed
- `portfoliosigge.client/src/projects.ts`
- `portfoliosigge.client/src/App.tsx`

## Changes Made

### projects.ts
| # | What changed | Why |
|---|---|---|
| 1 | Rewrote interface comment to say "structural (shape-based)" | Adds the plain-English synonym so the C#→TS mental model clicks faster |
| 2 | Replaced `export` comment with one that also explains `Project[]` ≈ `List<Project>` | The typed-array parallel was missing — it's one of the first things a C# dev will wonder about |

### App.tsx
| # | What changed | Why |
|---|---|---|
| 1 | Rewrote `import type` comment — replaced `using` analogy with compile-time generic constraint analogy | The old analogy was misleading; C# `using` is always compile-time, so the contrast didn't land |
| 2 | Added props interface comment (ViewModel / constructor parameter object) | Props are the #1 concept a C# dev needs a mental model for; this was the biggest gap |
| 3 | Removed ternary className comment | Ternaries work identically in C# and TS — the comment taught nothing new |
| 4 | Added `key` prop comment (EF Core change-tracking analogy) | `key` is a React-only concept with no Razor equivalent; deserves its own note |
| 5 | Moved `useState` comment to its own line above the declaration | Inline comments on long lines are hard to scan; own-line is cleaner |
| 6 | Removed verbose `handleToggle` event-delegate comment | The "event delegate" analogy was loose; the code is self-explanatory |
| 7 | Moved `.map()` comment out of the expression into a JSX comment above it | Was awkwardly splitting the function arguments; now reads naturally |

## Principles Applied
- **One new concept per comment** — don't bundle two analogies.
- **Remove comments that explain things identical in both languages** (ternaries, arrow functions).
- **Prioritise comments on React-specific concepts** that have no direct C# equivalent (key, props, hooks, JSX .map rendering).
- **Keep comments on their own line** when the code line is already long.

