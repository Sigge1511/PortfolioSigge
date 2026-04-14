/**
 * ProjectList Component Documentation
 * ====================================
 * 
 * A fully-featured, filterable and sortable project list component for React.
 * 
 * FEATURES:
 * - Keyword search filtering across project titles and descriptions
 * - Multi-select technology tag filtering
 * - Sorting by name, date, or status with toggleable direction
 * - Support for both real API data and mock data
 * - Loading states with spinner animation
 * - Empty state messaging
 * - Fully accessible (ARIA labels, semantic HTML, data-testid)
 * - Responsive grid layout (multi-column to single-column on mobile)
 * 
 * COMPONENT STRUCTURE:
 * ProjectList/
 *   ├── index.tsx           (Main component with filtering & sorting logic)
 *   ├── FilterBar.tsx       (Keyword search + technology tag filters)
 *   ├── SortControls.tsx    (Sort buttons: Name, Date, Status)
 *   ├── ProjectCard.tsx     (Individual project card display)
 *   ├── types.ts            (TypeScript interfaces)
 *   ├── mockData.ts         (Sample project data for demos)
 *   └── ProjectList.css     (Component styles using CSS variables)
 * 
 * USAGE EXAMPLES:
 * ═════════════════════════════════════════════════════════════════════
 * 
 * 1. BASIC USAGE WITH REAL DATA:
 * ──────────────────────────────
 * import { ProjectList } from '@/components/ProjectList';
 * import { projects } from '@/projects';
 * 
 * export function ProjectsPage() {
 *   return <ProjectList projects={projects} />;
 * }
 * 
 * 
 * 2. WITH CALLBACKS FOR PARENT STATE:
 * ────────────────────────────────────
 * import { ProjectList } from '@/components/ProjectList';
 * import { projects } from '@/projects';
 * 
 * export function ProjectsPage() {
 *   const handleSort = (sort) => {
 *     console.log('Sorted by:', sort);
 *     // { field: 'name' | 'date' | 'status', direction: 'asc' | 'desc' }
 *   };
 * 
 *   const handleFilter = (filters) => {
 *     console.log('Filtered by:', filters);
 *     // { keywords: string, tags: string[] }
 *   };
 * 
 *   return (
 *     <ProjectList
 *       projects={projects}
 *       onSort={handleSort}
 *       onFilter={handleFilter}
 *     />
 *   );
 * }
 * 
 * 
 * 3. USING MOCK DATA FOR DEMOS/TESTING:
 * ──────────────────────────────────────
 * import { ProjectList } from '@/components/ProjectList';
 * 
 * export function ProjectsPage() {
 *   return <ProjectList useMockData={true} />;
 * }
 * 
 * 
 * 4. WITH LOADING STATE:
 * ──────────────────────
 * import { ProjectList } from '@/components/ProjectList';
 * import { projects } from '@/projects';
 * 
 * export function ProjectsPage() {
 *   const [isLoading, setIsLoading] = useState(false);
 *   const [projectData, setProjectData] = useState(projects);
 * 
 *   useEffect(() => {
 *     // Simulate API call
 *     setIsLoading(true);
 *     setTimeout(() => {
 *       setProjectData(projects);
 *       setIsLoading(false);
 *     }, 1000);
 *   }, []);
 * 
 *   return (
 *     <ProjectList
 *       projects={projectData}
 *       isLoading={isLoading}
 *     />
 *   );
 * }
 * 
 * 
 * 5. TOGGLING BETWEEN MOCK AND REAL DATA:
 * ────────────────────────────────────────
 * import { ProjectList } from '@/components/ProjectList';
 * import { projects } from '@/projects';
 * 
 * export function ProjectsPage() {
 *   const [useMock, setUseMock] = useState(false);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setUseMock(!useMock)}>
 *         {useMock ? 'Show Real Data' : 'Show Mock Data'}
 *       </button>
 *       <ProjectList projects={projects} useMockData={useMock} />
 *     </>
 *   );
 * }
 * 
 * 
 * PROPS INTERFACE:
 * ═════════════════════════════════════════════════════════════════════
 * 
 * interface ProjectListProps {
 *   projects: Project[];        // Array of projects to display
 *   onSort?: (sort: SortOrder) => void;    // Callback when sort changes
 *   onFilter?: (filters: FilterState) => void; // Callback when filters change
 *   isLoading?: boolean;        // Show loading spinner if true (default: false)
 *   useMockData?: boolean;      // Use mock data instead of props (default: false)
 * }
 * 
 * 
 * PROJECT INTERFACE (from src/projects.ts):
 * ═════════════════════════════════════════════════════════════════════
 * 
 * interface Project {
 *   id: string;                // Unique identifier
 *   title: string;             // Project title
 *   description: string;       // Short project description
 *   techStack: string[];       // Array of technologies/tags
 *   details: string;           // Long-form project details
 *   githubUrl?: string;        // Optional link to GitHub repo
 * }
 * 
 * 
 * FILTERING & SORTING:
 * ═════════════════════════════════════════════════════════════════════
 * 
 * Filtering:
 *   - Keywords: Searches project title and description (case-insensitive)
 *   - Tags: Multi-select filter by technology (OR logic: matches ANY tag)
 *   - Clear Filters button appears when filters are active
 * 
 * Sorting:
 *   - Name: Alphabetical sort by project title
 *   - Date: Sort by project ID (proxy for date)
 *   - Status: Sort by status (default: 'completed')
 *   - Direction: Toggle between ascending (↑) and descending (↓)
 *   - Click a sort button to activate; click again to toggle direction
 * 
 * 
 * ACCESSIBILITY:
 * ═════════════════════════════════════════════════════════════════════
 * 
 * - Semantic HTML: <article>, <h3>, role="article", role="list"
 * - ARIA labels: aria-label, aria-pressed, aria-hidden on visual elements
 * - data-testid: All interactive elements have test selectors
 *   - project-card-{id}: Individual project cards
 *   - filter-tag-{tag}: Tag filter buttons
 *   - keyword-input: Search input
 *   - sort-{field}-btn: Sort control buttons
 *   - project-list: Main container
 * - Screen reader text (.sr-only) for loading indicator
 * 
 * 
 * STYLING:
 * ═════════════════════════════════════════════════════════════════════
 * 
 * Uses design system CSS variables (src/index.css):
 * - Colors: --color-bg, --color-surface, --color-text, --color-accent
 * - Spacing: --space-xs, --space-sm, --space-md, --space-lg, --space-xl
 * - Typography: --font-main, --font-mono
 * - Transitions: --transition-fast, --transition-normal
 * 
 * No border-radius (sharp corners per design system)
 * Responsive: Single-column grid on mobile (768px breakpoint)
 * 
 * 
 * TESTING SELECTORS:
 * ═════════════════════════════════════════════════════════════════════
 * 
 * const { getByTestId } = render(<ProjectList projects={projects} />);
 * 
 * // Container
 * getByTestId('project-list');          // Main container
 * getByTestId('loading-state');         // Loading spinner
 * getByTestId('empty-state');           // No results message
 * 
 * // Filter bar
 * getByTestId('filter-bar');            // Filter container
 * getByTestId('keyword-input');         // Search input
 * getByTestId('filter-tag-react');      // Specific tag button
 * getByTestId('clear-filters-btn');     // Clear button
 * 
 * // Sort controls
 * getByTestId('sort-controls');         // Sort container
 * getByTestId('sort-name-btn');         // Name sort button
 * getByTestId('sort-date-btn');         // Date sort button
 * getByTestId('sort-status-btn');       // Status sort button
 * 
 * // Project cards
 * getByTestId('project-card-portfolio'); // Specific project card
 * getByTestId('tag-typescript');         // Tech tag within card
 * 
 */
