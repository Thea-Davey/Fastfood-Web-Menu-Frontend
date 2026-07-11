// ViewModel Layer: useMenuViewModel.ts
// Fetches menu items from the backend API and exposes filtering logic to the View.

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, MenuCategory, MENU_CATEGORIES } from '../model/menu.model';
import { useCart } from '../../../context/CartContext';

const SHOW_ALL_FILTER = false;

const mapApiToMenuItem = (item: any): MenuItem => {
  let categoryName: MenuItem['category'] = 'unlimited';
  const raw = (item.category || '').toLowerCase().replace(/_/g, ' ');

  if (raw.includes('unlimited')) categoryName = 'unlimited';
  else if (raw.includes('ala carte')) categoryName = 'ala_carte';
  else if (raw.includes('wings to share')) categoryName = 'wings_to_share';
  else if (raw.includes('sides') || raw.includes('extra')) categoryName = 'sides';
  else if (raw.includes('add on') || raw.includes('add_on') || raw.includes('dip')) categoryName = 'add_on';
  else if (raw.includes('drink')) categoryName = 'drinks';

  return {
    id: item.id,
    name: item.name || '',
    description: item.description || (item.is_available ? 'Fresh wings cooked to order.' : 'Not available.'),
    price: Number(item.price || 0),
    imageUrl: item.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: categoryName,
    maxFlavors: item.max_flavors || 1,
    maxDips: item.max_dips || 1,
  };
};

export const useMenuViewModel = () => {
  const navigate = useNavigate();
  const { items: cartItems, addItem: addToCart, incrementQty, decrementQty } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const getInitialCategory = (): MenuCategory => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && MENU_CATEGORIES.includes(cat as MenuCategory)) {
      return cat as MenuCategory;
    }
    return SHOW_ALL_FILTER ? 'All' : 'Unlimited';
  };

  const [activeCategory, setActiveCategory] = useState<MenuCategory>(getInitialCategory);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && MENU_CATEGORIES.includes(cat as MenuCategory)) {
      setActiveCategory(cat as MenuCategory);
    }
  }, [window.location.search]);

  const categories = useMemo(() => {
    return SHOW_ALL_FILTER ? MENU_CATEGORIES : MENU_CATEGORIES.filter(c => c !== 'All');
  }, []);

  useEffect(() => {
    let active = true;

    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/api/menu`);
        if (!res.ok) throw new Error('Failed to fetch menu items');

        const json = await res.json();
        const raw: any[] = json.data?.items ?? json.data?.menu_items ?? json.data ?? [];

        if (active) {
          setMenuItems(raw.filter(i => i.is_available !== false).map(mapApiToMenuItem));
        }
      } catch (err: any) {
        if (active) setError(err.message || 'Failed to load menu.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadMenuData();
    return () => { active = false; };
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      let isCategoryMatch = false;
      if (activeCategory === 'All') isCategoryMatch = true;
      else if (activeCategory === 'Unlimited' && item.category === 'unlimited') isCategoryMatch = true;
      else if (activeCategory === 'Ala Carte' && item.category === 'ala_carte') isCategoryMatch = true;
      else if (activeCategory === 'Wings to Share' && item.category === 'wings_to_share') isCategoryMatch = true;
      else if (activeCategory === 'Sides' && item.category === 'sides') isCategoryMatch = true;
      else if (activeCategory === 'Add on Dips' && item.category === 'add_on') isCategoryMatch = true;
      else if (activeCategory === 'Drinks' && item.category === 'drinks') isCategoryMatch = true;

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return isCategoryMatch && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const handleIncrement = (item: MenuItem) => {
    const matches = cartItems.filter(ci => ci.menuItemId === item.id);
    if (matches.length > 0) {
      incrementQty(matches[matches.length - 1].id);
    } else {
      addToCart({
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      });
    }
  };

  const handleDecrement = (item: MenuItem) => {
    const matches = cartItems.filter(ci => ci.menuItemId === item.id);
    if (matches.length > 0) {
      decrementQty(matches[matches.length - 1].id);
    }
  };

  return {
    filteredItems,
    isLoading,
    error,
    searchQuery,
    activeCategory,
    categories,
    cartItems,
    handleSearchChange: (q: string) => setSearchQuery(q),
    handleCategoryChange: (c: MenuCategory) => setActiveCategory(c),
    handleCardClick: (item: MenuItem) => navigate(`/add-order/${item.id}`),
    handleIncrement,
    handleDecrement,
  };
};
