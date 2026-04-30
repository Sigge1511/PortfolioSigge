# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Maja Sigfeldt (sigge1511) built with React 19, TypeScript, and Vite. Features include project showcase with filtering/sorting, contact form with EmailJS integration, and responsive design.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router DOM
- **Styling**: CSS with CSS modules approach
- **Testing**: Vitest with jsdom environment
- **Contact Form**: EmailJS (@emailjs/browser)

### Project Structure
```
src/
├── pages/           # Route pages (Home, About, Projects, Skills, Contact, Recommendations)
├── components/       # Reusable components (Navbar, Footer, HeroBanner, ProjectList)
├── styles/          # Global and page-specific CSS
│   ├── global.css   # CSS variables and global styles
│   └── pages/       # Page-specific CSS files
├── assets/          # Static assets (images, fonts)
├── projects.ts      # Project data type definitions
└── main.tsx         # Application entry point
```

### Key Components

**ProjectList** (`src/components/ProjectList/`):
- Complex component with filtering, sorting, and project display
- Sub-components: FilterBar, SortControls, ProjectCard
- Supports both real project data and mock data
- Fully accessible with ARIA labels and data-testid attributes
- Usage: `<ProjectList projects={projects} />` or `<ProjectList useMockData={true} />`

**Contact Form** (`src/pages/Contact.tsx`):
- Form validation with regex for email
- EmailJS integration for sending messages
- Dynamic import of EmailJS to prevent crashes if dependency missing
- Environment variables: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

### CSS Architecture

- **CSS Variables**: Defined in `src/styles/global.css` using `--variable-name` pattern
- **Naming Convention**: BEM-like with double underscores for modifiers (e.g., `project-card__title`)
- **Organization**: Separate CSS files per component/page, imported in respective TSX files
- **Responsive**: Mobile-first approach with media queries

### Routing

React Router setup in `src/App.tsx`:
- `/` → Home
- `/about` → About
- `/projects` → Projects
- `/skills` → Skills
- `/contact` → Contact
- `/recommendations` → Recommendations

### TypeScript Configuration

- **Strict mode enabled**: All type checking enforced
- **Module resolution**: Bundler mode for Vite compatibility
- **JSX**: React JSX transform
- **Target**: ES2023

### Testing

- **Framework**: Vitest with jsdom environment
- **Coverage**: 90%+ coverage targets (lines, functions, statements), 85% for branches
- **Test files**: Should be named `*.test.tsx` or `*.test.ts`
- **Setup**: `src/__tests__/setup.ts` for global test configuration

### Build Configuration

- **Vite**: Build tool with React plugin
- **Base path**: Set to `'./'` for correct asset paths in production
- **Path aliases**: `@` maps to `./src`
- **TypeScript**: Build runs `tsc -b && vite build`

### Environment Variables

- EmailJS configuration in `.env.emailjs` (gitignored)
- Variables must be prefixed with `VITE_` to be available in client code
- Example: `VITE_EMAILJS_SERVICE_ID=your_service_id`

### Security

- **Content Security Policy**: Defined in `index.html` with strict rules
- **Referrer Policy**: Set to `no-referrer`
- **Form Action**: Set to `none` to prevent form submission to external domains

### Git Workflow

- **Main branch**: `master`
- **Current branch**: `Adding-personal-info`
- **Remote**: `https://sigge1511@github.com/sigge1511/PortfolioSigge.git`

### Common Patterns

**Component Structure**:
```tsx
import React from 'react';
import './ComponentName.css';

interface ComponentProps {
  // props
}

export function ComponentName({ prop }: ComponentProps) {
  return (
    <div className="component-name">
      {/* content */}
    </div>
  );
}

export default ComponentName;
```

**CSS Variable Usage**:
```css
.component-name {
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  padding: var(--space-lg);
}
```

**Form Handling**:
- Use controlled components with useState
- Validate on submit, clear errors on input change
- Show loading/error states appropriately

### Accessibility

- Semantic HTML elements (article, section, nav, etc.)
- ARIA labels for interactive elements
- data-testid attributes for testing
- Keyboard navigation support
- Screen reader friendly text

### Performance Considerations

- Dynamic imports for large dependencies (e.g., EmailJS)
- useMemo for expensive computations
- Lazy loading where appropriate
- Code splitting via Vite

### Deployment Notes

- Build output goes to `dist/` directory
- Static assets are served from root
- Base path configured for production deployment
- CSP headers configured in HTML