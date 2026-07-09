// CartContext.tsx
// Global cart state connected to the backend cart API.
// Uses session_id and participant_id from SessionContext to sync with the server.

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem } from '../features/my-order/model/cart.model';
import { useSession } from './SessionContext';

interface CartContextValue {
  items: CartItem[];
  addItem: (payload: AddItemPayload) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  incrementQty: (cartItemId: string) => void;
  decrementQty: (cartItemId: string) => void;
  clearCart: () => void;
  totalCount: number;
}

export interface AddItemPayload {
  menu_item_id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedFlavors?: string[];
  selectedDips?: string[];
  selectedBeverage?: string | null;
  selectedRice?: string | null;
  selectedFriesFlavor?: string | null;
  specialInstructions?: string;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { sessionId, participantId, tableNumber, isReady } = useSession();

  useEffect(() => {
    let active = true;
    const fetchCart = async () => {
      if (!isReady || !sessionId || !tableNumber) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/api/tables/${tableNumber}/session/cart`);
        if (!res.ok) return;
        
        const json = await res.json();
        if (active && json.data?.cart?.items) {
          const loadedItems: CartItem[] = json.data.cart.items.map((ci: any) => ({
            id: ci.id,
            name: ci.menu_items?.name || 'Unknown Item',
            price: Number(ci.unit_price || 0),
            imageUrl: ci.menu_items?.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            quantity: ci.quantity || 1,
          }));
          setItems(loadedItems);
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };
    
    fetchCart();
    return () => { active = false; };
  }, [isReady, sessionId, tableNumber]);

  const addItem = useCallback(async (payload: AddItemPayload) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    // Build a human-readable notes string from selections
    const noteParts: string[] = [];
    if (payload.selectedFlavors?.length) noteParts.push(`Flavors: ${payload.selectedFlavors.join(', ')}`);
    if (payload.selectedDips?.length) noteParts.push(`Dips: ${payload.selectedDips.join(', ')}`);
    if (payload.selectedRice) noteParts.push(`Rice: ${payload.selectedRice}`);
    if (payload.selectedFriesFlavor) noteParts.push(`Fries: ${payload.selectedFriesFlavor}`);
    if (payload.selectedBeverage) noteParts.push(`Beverage: ${payload.selectedBeverage}`);
    if (payload.specialInstructions) noteParts.push(payload.specialInstructions);
    const notes = noteParts.join(' | ');

    try {
      if (sessionId && participantId) {
        // Call the backend cart API
        const res = await fetch(`${apiUrl}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            participant_id: participantId,
            menu_item_id: payload.menu_item_id,
            quantity: payload.quantity,
            notes,
            special_instructions: payload.specialInstructions || '',
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const cartItemId: string = json.data?.id ?? json.data?.cart_item_id ?? (payload.menu_item_id + '-' + Date.now());

          setItems(prev => {
            const existing = prev.find(i => i.id === cartItemId);
            if (existing) {
              return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + payload.quantity } : i);
            }
            return [...prev, {
              id: cartItemId,
              name: payload.name,
              price: payload.price,
              imageUrl: payload.imageUrl,
              quantity: payload.quantity,
            }];
          });
          return;
        }
      }
    } catch (err) {
      console.error('Cart API error, falling back to local cart:', err);
    }

    // Fallback: add to local cart only (no session yet or API error)
    const localId = payload.menu_item_id + '-' + Date.now();
    setItems(prev => {
      const existing = prev.find(i => i.id === localId);
      if (existing) {
        return prev.map(i => i.id === localId ? { ...i, quantity: i.quantity + payload.quantity } : i);
      }
      return [...prev, { id: localId, name: payload.name, price: payload.price, imageUrl: payload.imageUrl, quantity: payload.quantity }];
    });
  }, [sessionId, participantId]);

  const removeItem = useCallback(async (cartItemId: string) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      if (sessionId) {
        await fetch(`${apiUrl}/api/cart/${cartItemId}`, { method: 'DELETE' });
      }
    } catch (err) {
      console.error('Failed to remove item from backend cart:', err);
    }
    setItems(prev => prev.filter(i => i.id !== cartItemId));
  }, [sessionId]);

  const incrementQty = useCallback((cartItemId: string) => {
    setItems(prev => prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i));
  }, []);

  const decrementQty = useCallback((cartItemId: string) => {
    setItems(prev =>
      prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity - 1 } : i)
         .filter(i => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, incrementQty, decrementQty, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
