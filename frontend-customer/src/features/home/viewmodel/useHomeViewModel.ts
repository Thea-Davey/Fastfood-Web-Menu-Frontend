// ViewModel Layer: useHomeViewModel.ts
// Handles API calls, manages the active carousel index state, and exposes addToCart handlers.

import { useState, useEffect } from 'react';
import { HomeDashboardData, DEFAULT_HOME_DASHBOARD, HomeProductItem } from '../model/home.model';
import { useCart } from '../../../context/CartContext';

export const useHomeViewModel = () => {
  const { addItem } = useCart();
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
        const response = await fetch(`${apiUrl}/api/home`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const result = await response.json();
        
        if (active) {
          setData(result);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'An error occurred while loading content');
          
          // Provide mock fallback data matching wireframe visual sections
          setData({
            banners: [
              {
                id: 'b1',
                title: 'Stacked with Flavor, Bursting with Taste!',
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
              },
              {
                id: 'b2',
                title: 'Try our new Mac & Cheese Burger!',
                imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600',
              },
              {
                id: 'b3',
                title: 'Crispy Onion Rings & Sides Special!',
                imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600',
              }
            ],
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
            deals: [
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

  const handleAddToCart = (item: HomeProductItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl
    });
  };

  return {
    banners: data.banners,
    popularItems: data.popularItems,
    deals: data.deals,
    activeCarouselIndex,
    setActiveCarouselIndex,
    isLoading,
    error,
    handleAddToCart,
  };
};
