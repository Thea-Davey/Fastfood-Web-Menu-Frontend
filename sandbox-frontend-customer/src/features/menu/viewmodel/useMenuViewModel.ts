// ViewModel Layer: useMenuViewModel.ts
// Owns all state, API/Supabase calls, filtering logic, and cart handler.
// Returns only what the View consumes.

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, MenuCategory, MENU_CATEGORIES, SupabaseMenuItem, MockMenuItem } from '../model/menu.model';
import { menuData } from '../../../data/menuData';
import { supabase } from '../../../lib/supabase';

// Toggle to control whether the "All" category button should be shown in the filters list
const SHOW_ALL_FILTER = false;

// Toggle to control whether to use hardcoded mock menu data or fetch from live Supabase DB
const USE_MOCK_DATA = false;

/**
 * Safely maps MockMenuItem into the unified UI-facing MenuItem shape
 */
export const mapMockToMenuItem = (item: MockMenuItem, rawCategory: string): MenuItem => {
  let categoryName: MenuItem['category'] = 'unlimited';
  const normCategory = rawCategory.toLowerCase();
  
  if (normCategory.includes('unlimited')) categoryName = 'unlimited';
  else if (normCategory.includes('ala carte')) categoryName = 'ala_carte';
  else if (normCategory.includes('wings to share')) categoryName = 'wings_to_share';
  else if (normCategory.includes('sides')) categoryName = 'sides';
  else if (normCategory.includes('dips')) categoryName = 'add_on';
  else if (normCategory.includes('drinks')) categoryName = 'drinks';

  return {
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: item.basePrice,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: categoryName,
    maxFlavors: item.configuration?.flavors?.max,
    maxDips: item.configuration?.dips?.max,
  };
};

/**
 * Safely maps SupabaseMenuItem into the unified UI-facing MenuItem shape
 */
export const mapSupabaseToMenuItem = (item: SupabaseMenuItem): MenuItem => {
  let categoryName: MenuItem['category'] = 'unlimited';
  const categoryRaw = (item.category || '').toLowerCase().replace(/_/g, ' ');
  
  if (categoryRaw.includes('unlimited')) categoryName = 'unlimited';
  else if (categoryRaw.includes('ala carte')) categoryName = 'ala_carte';
  else if (categoryRaw.includes('wings to share')) categoryName = 'wings_to_share';
  else if (categoryRaw.includes('extra') || categoryRaw.includes('sides')) categoryName = 'sides';
  else if (categoryRaw.includes('add on') || categoryRaw.includes('add_on')) categoryName = 'add_on';
  else if (categoryRaw.includes('drink')) categoryName = 'drinks';

  return {
    id: item.id,
    name: item.name || '',
    description: item.is_available ? 'Fresh wings cooked to order.' : 'Not available currently.',
    price: Number(item.price || 0),
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: categoryName,
    maxFlavors: item.max_flavors || 1,
    maxDips: item.max_dips || 1,
  };
};

export const useMenuViewModel = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(
    SHOW_ALL_FILTER ? 'All' : 'Unlimited'
  );

  const categories = useMemo(() => {
    return SHOW_ALL_FILTER ? MENU_CATEGORIES : MENU_CATEGORIES.filter(c => c !== 'All');
  }, []);

  useEffect(() => {
    let active = true;

    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (USE_MOCK_DATA) {
          const parsedItems: MenuItem[] = [];
          menuData.menu.forEach(cat => {
            cat.items.forEach(item => {
              parsedItems.push(mapMockToMenuItem(item as MockMenuItem, cat.category));
            });
          });

          if (active) {
            setMenuItems(parsedItems);
          }
        } else {
          const { data: dbItems, error: dbError } = await supabase
            .from('menu_items')
            .select('*');

          if (dbError) throw dbError;

          const mappedItems = (dbItems || []).map((row: any) => 
            mapSupabaseToMenuItem(row as SupabaseMenuItem)
          );

          if (active) {
            setMenuItems(mappedItems);
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'An error occurred while fetching data');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadMenuData();

    return () => {
      active = false;
    };
  }, []);

  // Derived state: filter by category and search query
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Map view display values to the under-the-hood database category representations
      let isCategoryMatch = false;
      if (activeCategory === 'All') {
        isCategoryMatch = true;
      } else if (activeCategory === 'Unlimited' && item.category === 'unlimited') {
        isCategoryMatch = true;
      } else if (activeCategory === 'Ala Carte' && item.category === 'ala_carte') {
        isCategoryMatch = true;
      } else if (activeCategory === 'Wings to Share' && item.category === 'wings_to_share') {
        isCategoryMatch = true;
      } else if (activeCategory === 'Sides' && item.category === 'sides') {
        isCategoryMatch = true;
      } else if (activeCategory === 'Add on Dips' && item.category === 'add_on') {
        isCategoryMatch = true;
      } else if (activeCategory === 'Drinks' && item.category === 'drinks') {
        isCategoryMatch = true;
      }

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      return isCategoryMatch && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: MenuCategory) => {
    setActiveCategory(category);
  };

  const handleAddToCart = (item: MenuItem) => {
    navigate(`/add-order/${item.id}`);
  };

  return {
    filteredItems,
    isLoading,
    error,
    searchQuery,
    activeCategory,
    categories,
    handleSearchChange,
    handleCategoryChange,
    handleAddToCart,
  };
};
