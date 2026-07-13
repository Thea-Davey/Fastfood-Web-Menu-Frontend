// ViewModel Layer: useMyOrderViewModel.ts
// Reads cart state from CartContext and handles real checkout via backend API.

import { useMemo, useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useSession } from '../../../context/SessionContext';

export const useMyOrderViewModel = () => {
  const { items, removeItem, incrementQty, decrementQty, clearCart } = useCart();
  const { sessionId } = useSession();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | null>(
    () => localStorage.getItem('checkout_order_id')
  );
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(
    () => localStorage.getItem('checkout_session_id')
  );
  const [showOrderStatus, setShowOrderStatus] = useState<boolean>(
    () => !!localStorage.getItem('checkout_order_id')
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const total = subtotal;

  const handleIncrement = (id: string) => incrementQty(id);
  const handleDecrement = (id: string) => decrementQty(id);
  const handleRemove = (id: string) => removeItem(id);

  const handleCheckout = async () => {
    if (!sessionId) {
      setCheckoutError('No active table session. Please scan the QR code again.');
      return;
    }
    if (items.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    if (sessionId.startsWith('local-dev-session')) {
      setTimeout(() => {
        const mockOrderId = 'mock-order-' + Date.now();
        setCheckoutOrderId(mockOrderId);
        setCheckoutSessionId(sessionId);
        localStorage.setItem('checkout_order_id', mockOrderId);
        localStorage.setItem('checkout_session_id', sessionId);
        clearCart();
        setCheckoutSuccess(true);
        setIsCheckingOut(false);
      }, 1000);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const json = await res.json();
      
      if (!res.ok) {
        const errMsg = json.errors?.[0]?.msg || json.message || 'Checkout failed';
        
        // If the backend tells us the session is already closed/expired, auto-recover
        if (errMsg.toLowerCase().includes('closed') || errMsg.toLowerCase().includes('expired')) {
          localStorage.removeItem('session_id');
          localStorage.removeItem('participant_id');
          window.location.reload();
          return;
        }
        
        throw new Error(errMsg);
      }

      const orderId = json.data?.order?.id;
      setCheckoutOrderId(orderId);
      setCheckoutSessionId(sessionId);

      if (orderId) {
        localStorage.setItem('checkout_order_id', orderId);
        localStorage.setItem('checkout_session_id', sessionId);
      }

      // Do NOT remove session_id and participant_id here so the user can still be tied to the table.
      // If we remove them, they can't place a second order without re-scanning.

      clearCart();
      setCheckoutSuccess(true);

    } catch (err: any) {
      setCheckoutError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCancelSuccess = () => {
    // Clear the local storage and state after cancellation
    localStorage.removeItem('checkout_order_id');
    localStorage.removeItem('checkout_session_id');
    setCheckoutOrderId(null);
    setCheckoutSessionId(null);
    setShowOrderStatus(false);
    setCheckoutSuccess(false);

    // Automatically go back to menu after cancellation
    window.location.href = '/';
  };

  return {
    items,
    subtotal,
    total,
    isEmpty: items.length === 0,
    isCheckingOut,
    checkoutError,
    checkoutSuccess,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleCheckout,
    handleCancelSuccess,
    showOrderStatus,
    handleCheckOrderStatus: () => setShowOrderStatus(true),
    checkoutOrderId,
    checkoutSessionId,
  };
};
