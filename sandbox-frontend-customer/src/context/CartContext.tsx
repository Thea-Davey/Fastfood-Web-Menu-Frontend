// Shared Cart Context: CartContext.tsx
// Provides global cart state. Consumed by both MenuView (add) and MyOrderView (read/mutate).
// This is the single source of truth for cart items across the app.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from '../features/my-order/model/cart.model';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  incrementQty: (id: string) => void;
  decrementQty: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const SIMULATE_ITEMS_IN_CART = true; // Set to true for demo, false for real cart

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(
    SIMULATE_ITEMS_IN_CART
      ? [
        {
          id: 'c1',
          name: 'Cheesy Burger',
          price: 120,
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
          quantity: 1,
        },
        {
          id: 'c2',
          name: 'French Fries',
          price: 60,
          imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
          quantity: 1,
        },
        {
          id: 'c3',
          name: 'Iced Tea',
          price: 40,
          imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
          quantity: 2,
        },
      ]
      : []
  );

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = newItem.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
        );
      }
      return [...prev, { ...newItem, quantity: qtyToAdd } as CartItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const incrementQty = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }, []);

  const decrementQty = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
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
