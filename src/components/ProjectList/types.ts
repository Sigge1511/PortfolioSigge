import type { Project } from '../../projects';

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
