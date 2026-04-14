import { FilterState, FilterBarProps } from './types';
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
            className={`filter-bar__tag-btn${
              currentFilters.tags.includes(tag) ? ' is-active' : ''
            }`}
            data-testid={`filter-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
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
