#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectListDir = path.join(__dirname, 'src', 'components', 'ProjectList');
fs.mkdirSync(projectListDir, { recursive: true });

// Create types.ts
fs.writeFileSync(path.join(projectListDir, 'types.ts'), `import { Project } from '../../projects';

export interface FilterState {
  keywords: string;
  tags: string[];
}

export interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  availableTags: string[];
  currentFilters: FilterState;
}

export interface SortOrder {
  field: 'name' | 'date' | 'status';
  direction: 'asc' | 'desc';
}

export interface SortControlsProps {
  onSortChange: (sort: SortOrder) => void;
  currentSort: SortOrder;
}

export interface ProjectCardProps {
  project: Project;
  index: number;
}

export interface ProjectListProps {
  projects: Project[];
  onSort?: (sort: SortOrder) => void;
  onFilter?: (filters: FilterState) => void;
  isLoading?: boolean;
  useMockData?: boolean;
}

export interface ProjectListState {
  filters: FilterState;
  sort: SortOrder;
  filteredProjects: Project[];
  availableTags: string[];
}
`);

// Create mockData.ts
fs.writeFileSync(path.join(projectListDir, 'mockData.ts'), `import { Project } from '../../projects';

export const mockProjects: Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce platform with React frontend and .NET backend. Features product catalog, shopping cart, and payment integration.',
    techStack: ['React', 'TypeScript', 'C#', 'SQL Server', 'Stripe API'],
    details: 'Implemented a complete e-commerce solution with real-time inventory management, user authentication, and payment processing. Used Entity Framework Core for data access and Redux for state management.',
    githubUrl: 'https://github.com/sigge1511/ecommerce-platform',
  },
  {
    id: 'task-dashboard',
    title: 'Task Management Dashboard',
    description: 'Interactive dashboard for team task management with drag-and-drop functionality. Built with React and TypeScript.',
    techStack: ['React', 'TypeScript', 'CSS', 'Node.js', 'MongoDB'],
    details: 'A responsive dashboard with real-time updates, kanban-style task boards, and team collaboration features. Implemented WebSocket for live notifications.',
    githubUrl: 'https://github.com/sigge1511/task-dashboard',
  },
  {
    id: 'weather-app',
    title: 'Weather Application',
    description: 'Real-time weather application with location services and forecast data. Clean, minimal UI with dark theme.',
    techStack: ['React', 'TypeScript', 'API', 'CSS'],
    details: 'Fetches weather data from OpenWeather API, displays current conditions and 5-day forecast. Includes geolocation support and local storage for favorites.',
  },
  {
    id: 'dotnet-microservices',
    title: '.NET Microservices Architecture',
    description: 'Scalable microservices system built with .NET. Includes API gateway, authentication service, and database per service pattern.',
    techStack: ['C#', 'ASP.NET Core', 'Docker', 'Kubernetes', 'PostgreSQL'],
    details: 'Enterprise-grade microservices implementation with service discovery, circuit breaker pattern, and distributed logging using Serilog.',
    githubUrl: 'https://github.com/sigge1511/microservices',
  },
  {
    id: 'real-time-chat',
    title: 'Real-time Chat Application',
    description: 'Messaging platform with real-time synchronization. Features user authentication, direct messages, and group chats.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
    details: 'Built with Socket.io for real-time communication. Implements JWT authentication, message encryption, and typing indicators.',
    githubUrl: 'https://github.com/sigge1511/realtime-chat',
  },
  {
    id: 'data-visualization',
    title: 'Data Visualization Dashboard',
    description: 'Interactive charts and graphs dashboard for analytics. Displays real-time data with multiple visualization options.',
    techStack: ['React', 'TypeScript', 'D3.js', 'API'],
    details: 'Custom D3.js visualizations with responsive design. Includes filtering, drill-down capabilities, and export functionality.',
  },
  {
    id: 'cli-tool',
    title: 'Project Scaffolder CLI',
    description: 'Command-line tool for generating project boilerplate. Supports multiple project types and customizable templates.',
    techStack: ['Node.js', 'TypeScript', 'Commander.js'],
    details: 'NPM package providing interactive CLI for project setup. Includes template customization and git repository initialization.',
    githubUrl: 'https://github.com/sigge1511/project-scaffolder',
  },
];
`);

// Create ProjectCard.tsx
fs.writeFileSync(path.join(projectListDir, 'ProjectCard.tsx'), `import { ProjectCardProps } from './types';

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article 
      className="project-card" 
      data-testid={\`project-card-\${project.id}\`}
      role="article"
    >
      <div className="project-card__header">
        <span 
          className="project-card__index" 
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="project-card__title">{project.title}</h3>
      </div>
      
      <p className="project-card__description">{project.description}</p>
      
      <div className="project-card__stack" role="list" aria-label="Technology stack">
        {project.techStack.map((tech) => (
          <span 
            key={tech} 
            className="project-card__tag"
            role="listitem"
            data-testid={\`tag-\${tech.toLowerCase().replace(/\\s+/g, '-')}\`}
          >
            {tech}
          </span>
        ))}
      </div>
      
      {project.githubUrl && (
        <a 
          href={project.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="project-card__link"
          aria-label={\`GitHub repository for \${project.title}\`}
        >
          View on GitHub
        </a>
      )}
    </article>
  );
}
`);

// Create FilterBar.tsx
fs.writeFileSync(path.join(projectListDir, 'FilterBar.tsx'), `import { FilterState, FilterBarProps } from './types';
import { ChangeEvent } from 'react';

export function FilterBar({ 
  onFilterChange, 
  availableTags, 
  currentFilters 
}: FilterBarProps) {
  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...currentFilters,
      keywords: e.target.value,
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = currentFilters.tags.includes(tag)
      ? currentFilters.tags.filter((t) => t !== tag)
      : [...currentFilters.tags, tag];
    onFilterChange({
      ...currentFilters,
      tags: newTags,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({ keywords: '', tags: [] });
  };

  const hasFilters = currentFilters.keywords || currentFilters.tags.length > 0;

  return (
    <div className="filter-bar" data-testid="filter-bar">
      <div className="filter-bar__search">
        <input
          type="text"
          placeholder="Search projects..."
          value={currentFilters.keywords}
          onChange={handleKeywordChange}
          className="filter-bar__input"
          data-testid="keyword-input"
          aria-label="Search projects by keyword"
        />
      </div>

      <div className="filter-bar__tags" role="group" aria-label="Filter by technology">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={\`filter-bar__tag-btn\${
              currentFilters.tags.includes(tag) ? ' is-active' : ''
            }\`}
            data-testid={\`filter-tag-\${tag.toLowerCase().replace(/\\s+/g, '-')}\`}
            aria-pressed={currentFilters.tags.includes(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={handleClearFilters}
          className="filter-bar__clear"
          data-testid="clear-filters-btn"
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
`);

// Create SortControls.tsx
fs.writeFileSync(path.join(projectListDir, 'SortControls.tsx'), `import { SortControlsProps, SortOrder } from './types';

export function SortControls({ onSortChange, currentSort }: SortControlsProps) {
  const handleSort = (field: 'name' | 'date' | 'status') => {
    if (currentSort.field === field) {
      onSortChange({
        field,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  };

  const getSortLabel = (field: string) => {
    const label = field.charAt(0).toUpperCase() + field.slice(1);
    const direction = currentSort.field === field 
      ? \` \${currentSort.direction === 'asc' ? '↑' : '↓'}\`
      : '';
    return label + direction;
  };

  return (
    <div className="sort-controls" data-testid="sort-controls" role="group" aria-label="Sort options">
      <div className="sort-controls__label">Sort by:</div>
      <button
        onClick={() => handleSort('name')}
        className={\`sort-controls__btn\${currentSort.field === 'name' ? ' is-active' : ''}\`}
        data-testid="sort-name-btn"
        aria-pressed={currentSort.field === 'name'}
      >
        {getSortLabel('name')}
      </button>
      <button
        onClick={() => handleSort('date')}
        className={\`sort-controls__btn\${currentSort.field === 'date' ? ' is-active' : ''}\`}
        data-testid="sort-date-btn"
        aria-pressed={currentSort.field === 'date'}
      >
        {getSortLabel('date')}
      </button>
      <button
        onClick={() => handleSort('status')}
        className={\`sort-controls__btn\${currentSort.field === 'status' ? ' is-active' : ''}\`}
        data-testid="sort-status-btn"
        aria-pressed={currentSort.field === 'status'}
      >
        {getSortLabel('status')}
      </button>
    </div>
  );
}
`);

// Create index.tsx (will be split due to length)
const indexContent = `import { useState, useMemo } from 'react';
import { Project } from '../../projects';
import { FilterBar } from './FilterBar';
import { SortControls } from './SortControls';
import { ProjectCard } from './ProjectCard';
import { FilterState, SortOrder, ProjectListProps, ProjectListState } from './types';
import { mockProjects } from './mockData';
import './ProjectList.css';

export function ProjectList({ 
  projects: initialProjects = [],
  onSort,
  onFilter,
  isLoading = false,
  useMockData = false,
}: ProjectListProps) {
  const projects = useMockData ? mockProjects : initialProjects;
  
  const [filters, setFilters] = useState<FilterState>({
    keywords: '',
    tags: [],
  });

  const [sort, setSort] = useState<SortOrder>({
    field: 'name',
    direction: 'asc',
  });

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.techStack.forEach((tech) => tags.add(tech));
    });
    return Array.from(tags).sort();
  }, [projects]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(keywords) ||
          project.description.toLowerCase().includes(keywords)
      );
    }

    if (filters.tags.length > 0) {
      result = result.filter((project) =>
        filters.tags.some((tag) => project.techStack.includes(tag))
      );
    }

    result.sort((a, b) => {
      let aValue: string | undefined;
      let bValue: string | undefined;

      if (sort.field === 'name') {
        aValue = a.title;
        bValue = b.title;
      } else if (sort.field === 'date') {
        aValue = a.id;
        bValue = b.id;
      } else {
        aValue = 'completed';
        bValue = 'completed';
      }

      const comparison = aValue.localeCompare(bValue);
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [projects, filters, sort]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleSortChange = (newSort: SortOrder) => {
    setSort(newSort);
    onSort?.(newSort);
  };

  if (isLoading) {
    return (
      <div className="project-list-loading" data-testid="loading-state">
        <div className="project-list-loading__spinner" aria-label="Loading projects" role="status">
          <span className="sr-only">Loading projects...</span>
        </div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="project-list" data-testid="project-list">
      <FilterBar
        onFilterChange={handleFilterChange}
        availableTags={availableTags}
        currentFilters={filters}
      />

      <SortControls
        onSortChange={handleSortChange}
        currentSort={sort}
      />

      <div className="project-list__grid" role="list" aria-label="Projects">
        {filteredAndSortedProjects.length > 0 ? (
          filteredAndSortedProjects.map((project, index) => (
            <div key={project.id} role="listitem">
              <ProjectCard project={project} index={index} />
            </div>
          ))
        ) : (
          <div className="project-list__empty" data-testid="empty-state">
            <p>No projects match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
`;

fs.writeFileSync(path.join(projectListDir, 'index.tsx'), indexContent);

// Create ProjectList.css
const cssContent = `.project-list {
  padding: var(--space-lg) 0;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  align-items: center;
}

.filter-bar__search {
  flex: 1;
  min-width: 200px;
}

.filter-bar__input {
  width: 100%;
  padding: 10px 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 0.95rem;
  transition: border-color var(--transition), background-color var(--transition);
}

.filter-bar__input:focus {
  outline: none;
  border-color: var(--accent-bright);
  background-color: var(--bg);
}

.filter-bar__input::placeholder {
  color: var(--text-muted);
}

.filter-bar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.filter-bar__tag-btn {
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: border-color var(--transition), background-color var(--transition), color var(--transition);
}

.filter-bar__tag-btn:hover {
  border-color: var(--accent-bright);
  color: var(--text-primary);
}

.filter-bar__tag-btn.is-active {
  background-color: var(--accent);
  border-color: var(--accent-bright);
  color: var(--text-primary);
}

.filter-bar__clear {
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color var(--transition), color var(--transition);
}

.filter-bar__clear:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.sort-controls {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  align-items: center;
  flex-wrap: wrap;
}

.sort-controls__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.sort-controls__btn {
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color var(--transition), background-color var(--transition), color var(--transition);
}

.sort-controls__btn:hover {
  border-color: var(--accent-bright);
  color: var(--text-primary);
}

.sort-controls__btn.is-active {
  background-color: var(--accent);
  border-color: var(--accent-bright);
  color: var(--text-primary);
}

.project-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.project-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  transition: border-color var(--transition), background-color var(--transition);
}

.project-card:hover {
  border-color: var(--accent-bright);
  background-color: var(--bg);
}

.project-card__header {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  align-items: flex-start;
}

.project-card__index {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: ui-monospace, Consolas, 'Courier New', monospace;
  font-weight: 600;
  letter-spacing: 0.1em;
  flex-shrink: 0;
  padding-top: 2px;
}

.project-card__title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
}

.project-card__description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  flex-grow: 1;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  list-style: none;
}

.project-card__tag {
  display: inline-flex;
  padding: 4px 10px;
  background-color: var(--accent);
  border: 1px solid var(--accent-bright);
  color: var(--accent-bright);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-card__link {
  align-self: flex-start;
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-decoration: none;
  transition: border-color var(--transition), color var(--transition);
  cursor: pointer;
  display: inline-block;
}

.project-card__link:hover {
  border-color: var(--accent-bright);
  color: var(--accent-bright);
}

.project-list__empty {
  grid-column: 1 / -1;
  padding: var(--space-2xl) var(--space-lg);
  text-align: center;
  color: var(--text-muted);
}

.project-list-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: var(--space-lg);
}

.project-list-loading__spinner {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border);
  border-top-color: var(--accent-bright);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .project-list__grid {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    flex-direction: column;
    gap: var(--space-md);
  }

  .filter-bar__search {
    min-width: 100%;
  }

  .filter-bar__tags {
    width: 100%;
  }

  .sort-controls {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

fs.writeFileSync(path.join(projectListDir, 'ProjectList.css'), cssContent);

console.log('✅ All ProjectList component files created successfully!');
