// View Layer: MenuView.tsx
// Dumb UI shell. Calls ViewModel, renders SearchBar, CategoryFilter, and MenuItemCard list.
// NO useState, NO useEffect, NO API calls.

import React from 'react';
import { useMenuViewModel } from '../viewmodel/useMenuViewModel';
import { SearchBar } from '../../../shared-components/SearchBar/SearchBar';
import { CategoryFilter } from '../../../shared-components/CategoryFilter/CategoryFilter';
import { MenuItemCard } from '../../../shared-components/MenuItemCard/MenuItemCard';
import { MenuCategory } from '../model/menu.model';

const SHOW_MOCK_NOTICE = false; // Set to true to show notice, false to hide

export const MenuView: React.FC = () => {
  const {
    filteredItems,
    isLoading,
    error,
    searchQuery,
    activeCategory,
    categories,
    handleSearchChange,
    handleCategoryChange,
    handleAddToCart,
  } = useMenuViewModel();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-app)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      maxWidth: '640px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Sticky Header: Search + Category Filter */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'var(--bg-app)',
        padding: '16px 16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search wing flavors, sides, or dips"
        />
        <CategoryFilter<MenuCategory>
          categories={categories}
          activeCategory={activeCategory}
          onSelect={handleCategoryChange}
        />
      </div>

      {/* Scrollable Food Item List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {isLoading && (
          <div style={{ textAlign: 'center', color: 'var(--text-light)', paddingTop: '40px', fontSize: '14px' }}>
            Loading menu...
          </div>
        )}

        {SHOW_MOCK_NOTICE && !isLoading && error && (
          <div style={{
            backgroundColor: 'var(--alert-bg)',
            border: '1px solid var(--alert-border)',
            padding: '12px 16px',
            borderRadius: '12px',
            color: 'var(--danger-hover)',
            fontSize: '12px',
          }}>
            Notice: {error}. Showing demo data.
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-light)', paddingTop: '40px', fontSize: '14px' }}>
            No items found for "{searchQuery || activeCategory}".
          </div>
        )}

        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuView;
