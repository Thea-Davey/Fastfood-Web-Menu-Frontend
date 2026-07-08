// ViewModel Layer: useAddOrderViewModel.ts
// Handles complex form state, selection constraints, dynamic pricing, and cart logic.

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuData } from '../../../data/menuData';
import { useCart } from '../../../context/CartContext';
import { MenuItem, AddOrderState, AddOrderConfig } from '../model/addOrder.model';
import { supabase } from '../../../lib/supabase';

// Toggle to control whether to use hardcoded mock menu data or fetch from live Supabase DB
const USE_MOCK_DATA = false;

export const useAddOrderViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [state, setState] = useState<AddOrderState>({
    item: null,
    selectedFlavors: [],
    selectedDips: [],
    selectedBeverage: null,
    specialInstructions: '',
    quantity: 1,
  });

  useEffect(() => {
    let active = true;

    const loadItemData = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Fetch from static mock file
          let foundItem: MenuItem | null = null;
          for (const category of menuData.menu) {
            const item = category.items.find(i => i.id === id);
            if (item) {
              foundItem = item as MenuItem;
              break;
            }
          }
          
          if (foundItem && active) {
            foundItem.imageUrl = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600';
            setState(prev => ({ ...prev, item: foundItem }));
          }
        } else {
          // Fetch directly from live Supabase DB
          const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (data && active) {
            const config: AddOrderConfig = {
              specialInstructions: true
            };

            if (data.max_flavors && data.max_flavors > 0) {
              config.flavors = { min: 1, max: data.max_flavors };
            }

            if (data.max_dips && data.max_dips > 0) {
              config.dips = { min: 1, max: data.max_dips };
            }

            // Map drinks or unlimited wings to display corresponding optional items
            const isWings = data.category?.toLowerCase().includes('wings') || data.category?.toLowerCase().includes('share') || data.category?.toLowerCase().includes('unlimited');
            if (isWings) {
              config.beverages = { min: 1, max: 1, optional: true };
            }

            const mappedItem: MenuItem = {
              id: data.id,
              name: data.name,
              description: data.is_available ? 'Available' : 'Unavailable currently.',
              basePrice: Number(data.price || 0),
              imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
              configuration: config
            };

            setState(prev => ({ ...prev, item: mappedItem }));
          }
        }
      } catch (err: any) {
        console.error("Failed to load item configuration:", err);
      }
    };

    loadItemData();

    return () => {
      active = false;
    };
  }, [id]);

  const toggleFlavor = (flavor: string) => {
    setState(prev => {
      if (!prev.item?.configuration?.flavors) return prev;
      const max = prev.item.configuration.flavors.max;
      const isSelected = prev.selectedFlavors.includes(flavor);
      
      if (isSelected) {
        return { ...prev, selectedFlavors: prev.selectedFlavors.filter(f => f !== flavor) };
      } else if (prev.selectedFlavors.length < max) {
        return { ...prev, selectedFlavors: [...prev.selectedFlavors, flavor] };
      }
      return prev;
    });
  };

  const toggleDip = (dip: string) => {
    setState(prev => {
      if (!prev.item?.configuration?.dips) return prev;
      const max = prev.item.configuration.dips.max;
      const isSelected = prev.selectedDips.includes(dip);
      
      if (isSelected) {
        return { ...prev, selectedDips: prev.selectedDips.filter(d => d !== dip) };
      } else if (prev.selectedDips.length < max) {
        return { ...prev, selectedDips: [...prev.selectedDips, dip] };
      }
      return prev;
    });
  };

  const selectBeverage = (bev: string) => {
    setState(prev => ({ ...prev, selectedBeverage: prev.selectedBeverage === bev ? null : bev }));
  };

  const incrementQuantity = () => setState(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  const decrementQuantity = () => setState(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }));
  
  const setSpecialInstructions = (text: string) => setState(prev => ({ ...prev, specialInstructions: text }));

  const grandTotal = useMemo(() => {
    if (!state.item) return 0;
    let total = state.item.basePrice;
    if (state.selectedBeverage) {
      const bevData = menuData.menu.find(c => c.category === 'Drinks')?.items.find(i => i.name === state.selectedBeverage);
      if (bevData) total += bevData.basePrice;
    }
    return total * state.quantity;
  }, [state]);

  const handleAddToCart = () => {
    if (state.item) {
      addItem({
        id: state.item.id + '-' + Date.now(),
        name: state.item.name,
        price: grandTotal / state.quantity,
        imageUrl: state.item.imageUrl || '',
        quantity: state.quantity
      });
      navigate(-1);
    }
  };

  const goBack = () => navigate(-1);

  return {
    state,
    globalOptions: menuData.globalOptions,
    toggleFlavor,
    toggleDip,
    selectBeverage,
    incrementQuantity,
    decrementQuantity,
    setSpecialInstructions,
    grandTotal,
    handleAddToCart,
    goBack
  };
};
