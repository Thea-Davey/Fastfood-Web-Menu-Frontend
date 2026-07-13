// ViewModel Layer: useHomeViewModel.ts
// Handles API calls, manages the active carousel index state, and exposes addToCart handlers.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeDashboardData, DEFAULT_HOME_DASHBOARD, HomeProductItem } from '../model/home.model';
import { useCart } from '../../../context/CartContext';


const POPULAR_IDS = [
  'ccd66a27-1879-43a7-b974-6fa91ff0d364',
  '9bf59b12-11b8-4d3e-aeea-33b36aec786f',
  'bcf67c6d-e7ec-4947-b940-3539e3db6aae'
];

const BEST_SELLER_IDS = [
  'f13dd83e-6dfb-45a2-a697-486c1876f08b',
  '4bac5b85-ecbf-413a-b103-748161d65240',
  '4a524920-4b3e-4189-a547-7bfafd70bd7d',
  '405dc7f0-06cc-4cdf-817c-4f0adfa6c00b'
];

const mapApiToHomeProduct = (item: any): HomeProductItem => {
  let categoryName = 'unlimited';
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
  };
};

export const useHomeViewModel = () => {
  const navigate = useNavigate();
  const { items: cartItems, addItem: addToCart, incrementQty, decrementQty } = useCart();
  const [data, setData] = useState<HomeDashboardData>(DEFAULT_HOME_DASHBOARD);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchHomeDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;

        // Fetch Banners
        let bannersList: BannerItem[] = [];
        try {
          const bannersResponse = await fetch(`${apiUrl}/api/banners`);
          if (bannersResponse.ok) {
            const bannersJson = await bannersResponse.json();
            bannersList = bannersJson.data || [];
          } else {
            console.warn("Failed to fetch banners.");
          }
        } catch (bannerErr) {
          console.warn("Error fetching banners", bannerErr);
        }

        // Fetch full menu items
        const menuResponse = await fetch(`${apiUrl}/api/menu`);

        let menuItems: HomeProductItem[] = [];
        if (menuResponse.ok) {
          const menuJson = await menuResponse.json();
          const rawItems: any[] = menuJson.data?.items ?? menuJson.data?.menu_items ?? menuJson.data ?? [];
          menuItems = rawItems.map(mapApiToHomeProduct);
        } else {
          throw new Error('Failed to fetch menu items from database');
        }

        // Filter items matching the requested popular IDs, maintaining order
        let popularItems = POPULAR_IDS.map(id => menuItems.find(item => item.id === id))
          .filter((item): item is HomeProductItem => !!item);

        if (popularItems.length === 0 && menuItems.length > 0) {
          popularItems = menuItems.slice(0, 3);
        }

        // Filter items matching the requested best seller IDs, maintaining order
        let bestSellers = BEST_SELLER_IDS.map(id => menuItems.find(item => item.id === id))
          .filter((item): item is HomeProductItem => !!item);

        if (bestSellers.length === 0 && menuItems.length > 0) {
          bestSellers = menuItems.slice(Math.min(3, menuItems.length), Math.min(7, menuItems.length));
        }

        if (active) {
          setData({
            banners: bannersList,
            popularItems,
            bestSellers
          });
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'An error occurred while loading content');

          // Provide mock fallback data matching wireframe visual sections if database is completely offline
          setData({
            banners: [],
            popularItems: [
              {
                id: 'p1',
                name: 'Food item 1',
                description: 'Food item description detail',
                price: 120.00,
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
              },
              {
                id: 'p2',
                name: 'Food item 2',
                description: 'Food item description detail',
                price: 60.00,
                imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
              },
              {
                id: 'p3',
                name: 'Food item 3',
                description: 'Food item description detail',
                price: 40.00,
                imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
              }
            ],
            bestSellers: [
              {
                id: 'd1',
                name: 'Wings Combo Deal',
                description: 'Flavor-packed wings with double dip option',
                price: 299.00,
                imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
              },
              {
                id: 'd2',
                name: 'Double Cheeseburger Deal',
                description: 'Two cheese patties with signature sauce',
                price: 180.00,
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
              }
            ]
          });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchHomeDashboard();

    return () => {
      active = false;
    };
  }, []);

  // Auto-swipe carousel effect
  useEffect(() => {
    if (data.banners.length <= 1) return;

    const intervalId = setInterval(() => {
      setActiveCarouselIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.banners.length;
        if (nextIndex === 0) {
          clearInterval(intervalId);
        }
        return nextIndex;
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, [data.banners.length]);

  const handleIncrement = (item: HomeProductItem) => {
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

  const handleDecrement = (item: HomeProductItem) => {
    const matches = cartItems.filter(ci => ci.menuItemId === item.id);
    if (matches.length > 0) {
      decrementQty(matches[matches.length - 1].id);
    }
  };

  return {
    banners: data.banners,
    popularItems: data.popularItems,
    bestSellers: data.bestSellers,
    activeCarouselIndex,
    setActiveCarouselIndex,
    isLoading,
    error,
    cartItems,
    handleCardClick: (item: HomeProductItem) => navigate(`/add-order/${item.id}`),
    handleBannerClick: (banner: any) => {
      if (banner.link) navigate(banner.link);
    },
    handleIncrement,
    handleDecrement,
  };
};
