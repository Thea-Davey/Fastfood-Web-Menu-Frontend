// ViewModel Layer: useAddOrderViewModel.ts
// Fetches menu item details from the backend API and handles cart submission.

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuData } from '../../../data/menuData';
import { useCart, AddItemPayload } from '../../../context/CartContext';
import { MenuItem, AddOrderState, AddOrderConfig } from '../model/addOrder.model';

export const useAddOrderViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [state, setState] = useState<AddOrderState>({
    item: null,
    selectedFlavors: [],
    selectedDips: [],
    selectedBeverage: null,
    selectedRice: null,
    selectedFriesFlavor: null,
    specialInstructions: '',
    quantity: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadItemData = async () => {
      try {
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/api/menu/${id}`);
        if (!res.ok) throw new Error('Menu item not found');

        const json = await res.json();
        const data = json.data?.item ?? json.data?.menu_item ?? json.data ?? json;

        if (data && active) {
          const config: AddOrderConfig = { 
            specialInstructions: data.has_special_instructions ?? false 
          };

          if (data.max_flavors && data.max_flavors > 0) {
            config.flavors = { min: 1, max: data.max_flavors };
          }
          
          // Fallback: If it is a wings item (has flavors) but max_dips is 0 or null, default to 1 dip
          const maxDips = (data.max_dips && data.max_dips > 0) 
            ? data.max_dips 
            : (data.max_flavors && data.max_flavors > 0) ? 1 : 0;
          if (maxDips > 0) {
            config.dips = { min: 1, max: maxDips };
          }
          if (data.has_rice) {
            config.rice = { min: 1, max: 1, optional: false };
          }
          if (data.has_fries) {
            config.fries = { min: 1, max: 1, optional: false };
          }
          if (data.has_beverage) {
            config.beverages = { min: 1, max: 1, optional: false };
          }
          const mappedItem: MenuItem = {
            id: data.id,
            name: data.name,
            description: data.description || (data.is_available ? 'Fresh wings cooked to order.' : 'Unavailable.'),
            basePrice: Number(data.price || 0),
            imageUrl: data.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
            configuration: config,
          };

          setState(prev => ({ ...prev, item: mappedItem }));
        }
      } catch (err: any) {
        console.error('Failed to load item:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadItemData();
    return () => { active = false; };
  }, [id]);

  const toggleFlavor = (flavor: string) => {
    setState(prev => {
      if (!prev.item?.configuration?.flavors) return prev;
      const max = prev.item.configuration.flavors.max;
      const isSelected = prev.selectedFlavors.includes(flavor);
      if (isSelected) return { ...prev, selectedFlavors: prev.selectedFlavors.filter(f => f !== flavor) };
      if (prev.selectedFlavors.length < max) return { ...prev, selectedFlavors: [...prev.selectedFlavors, flavor] };
      return prev;
    });
  };

  const toggleDip = (dip: string) => {
    setState(prev => {
      if (!prev.item?.configuration?.dips) return prev;
      const max = prev.item.configuration.dips.max;
      const isSelected = prev.selectedDips.includes(dip);
      if (isSelected) return { ...prev, selectedDips: prev.selectedDips.filter(d => d !== dip) };
      if (prev.selectedDips.length < max) return { ...prev, selectedDips: [...prev.selectedDips, dip] };
      return prev;
    });
  };

  const selectBeverage = (bev: string) => {
    setState(prev => ({ ...prev, selectedBeverage: prev.selectedBeverage === bev ? null : bev }));
  };

  const selectRice = (rice: string) => {
    setState(prev => ({ ...prev, selectedRice: prev.selectedRice === rice ? null : rice }));
  };

  const selectFriesFlavor = (flavor: string) => {
    setState(prev => ({ ...prev, selectedFriesFlavor: prev.selectedFriesFlavor === flavor ? null : flavor }));
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
    // Assume Rice and Fries choices are included in base price (as requested by user's example)
    return total * state.quantity;
  }, [state]);

  const handleAddToCart = async () => {
    if (!state.item) return;

    const payload: AddItemPayload = {
      menu_item_id: state.item.id,
      name: state.item.name,
      price: grandTotal / state.quantity,
      imageUrl: state.item.imageUrl || '',
      quantity: state.quantity,
      selectedFlavors: state.selectedFlavors,
      selectedDips: state.selectedDips,
      selectedBeverage: state.selectedBeverage,
      selectedRice: state.selectedRice,
      selectedFriesFlavor: state.selectedFriesFlavor,
      specialInstructions: state.specialInstructions,
    };

    await addItem(payload);
    navigate(-1);
  };

  return {
    state,
    isLoading,
    globalOptions: menuData.globalOptions,
    toggleFlavor,
    toggleDip,
    selectBeverage,
    selectRice,
    selectFriesFlavor,
    incrementQuantity,
    decrementQuantity,
    setSpecialInstructions,
    grandTotal,
    handleAddToCart,
    goBack: () => navigate(-1),
  };
};
