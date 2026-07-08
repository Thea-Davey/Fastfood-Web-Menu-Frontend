// Shared Component: CategoryFilter.tsx
// Stateless horizontal pill-filter bar. Accepts categories list, active category, and onChange via props.


interface CategoryFilterProps<T extends string> {
  categories: T[];
  activeCategory: T;
  onSelect: (category: T) => void;
}

export function CategoryFilter<T extends string>({
  categories,
  activeCategory,
  onSelect,
}: CategoryFilterProps<T>) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      {categories.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              flex: '0 0 auto',
              padding: '8px 16px',
              borderRadius: '999px',
              border: isActive ? 'none' : '1.5px solid var(--border-color)',
              backgroundColor: isActive ? 'var(--primary-color)' : 'var(--white)',
              color: isActive ? 'var(--white)' : 'var(--text-slate)',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
