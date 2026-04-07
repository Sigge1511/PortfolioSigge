import { useState, useMemo } from 'react';
import { Project } from '../../projects';
import { FilterBar } from './FilterBar';
import { SortControls } from './SortControls';
import { ProjectCard } from './ProjectCard';
import { FilterState, SortOrder, ProjectListProps, ProjectListState } from './types';
import { mockProjects } from './mockData';
import './ProjectList.css';

/*
 * ProjectList component: Displays filterable and sortable project cards
 * 
 * USAGE EXAMPLES:
 * 
 * With real projects from src/projects.ts:
 *   import { ProjectList } from '@/components/ProjectList';
 *   import { projects } from '@/projects';
 *   
 *   function ProjectsPage() {
 *     return <ProjectList projects={projects} />;
 *   }
 * 
 * With callbacks for parent state management:
 *   function ProjectsPage() {
 *     const handleSort = (sort) => console.log('Sorted by:', sort);
 *     const handleFilter = (filters) => console.log('Filtered by:', filters);
 *     
 *     return (
 *       <ProjectList 
 *         projects={projects}
 *         onSort={handleSort}
 *         onFilter={handleFilter}
 *       />
 *     );
 *   }
 * 
 * With mock data for demos/testing:
 *   <ProjectList useMockData={true} />
 * 
 * With loading state:
 *   <ProjectList projects={projects} isLoading={true} />
 * 
 * NOTES:
 * - FilterBar: Keyword search + multi-select technology tags
 * - SortControls: Sort by Name, Date, or Status (click to toggle direction)
 * - ProjectCard: Shows index, title, description, tech stack, GitHub link
 * - Fully accessible with semantic HTML, ARIA labels, and data-testid
 * - Responsive: Grid adjusts from multi-column to single column on mobile
 */

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
