// ViewModel Layer: useMyOrderViewModel.ts
// Reads cart state from CartContext and exposes derived values + handlers to the View.
// NO direct API calls for this screen — cart is managed via shared context.

import { useMemo } from 'react';
import { useCart } from '../../../context/CartContext';

export const useMyOrderViewModel = () => {
  const { items, removeItem, incrementQty, decrementQty, clearCart } = useCart();

  // Derived: subtotal = sum of (price × quantity)
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // Total equals subtotal (tax/delivery can be added later)
  const total = subtotal;

  const handleIncrement = (id: string) => incrementQty(id);
  const handleDecrement = (id: string) => decrementQty(id);
  const handleRemove = (id: string) => removeItem(id);

  const handleCheckout = () => {
    // Checkout handler — to be wired to payment/order API in future
    alert(`Proceeding to checkout. Total: ₱${total.toFixed(2)}`);
    clearCart();
  };

  return {
    items,
    subtotal,
    total,
    isEmpty: items.length === 0,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleCheckout,
  };
};
