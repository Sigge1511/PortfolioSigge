import type { SortControlsProps } from './types';

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
      ? ` ${currentSort.direction === 'asc' ? '↑' : '↓'}`
      : '';
    return label + direction;
  };

  return (
    <div className="sort-controls" data-testid="sort-controls" role="group" aria-label="Sort options">
      <div className="sort-controls__label">Sort by:</div>
      <button
        onClick={() => handleSort('name')}
        className={`sort-controls__btn${currentSort.field === 'name' ? ' is-active' : ''}`}
        data-testid="sort-name-btn"
        aria-pressed={currentSort.field === 'name'}
      >
        {getSortLabel('name')}
      </button>
      <button
        onClick={() => handleSort('date')}
        className={`sort-controls__btn${currentSort.field === 'date' ? ' is-active' : ''}`}
        data-testid="sort-date-btn"
        aria-pressed={currentSort.field === 'date'}
      >
        {getSortLabel('date')}
      </button>
      <button
        onClick={() => handleSort('status')}
        className={`sort-controls__btn${currentSort.field === 'status' ? ' is-active' : ''}`}
        data-testid="sort-status-btn"
        aria-pressed={currentSort.field === 'status'}
      >
        {getSortLabel('status')}
      </button>
    </div>
  );
}
