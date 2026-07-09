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
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);

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

      localStorage.removeItem('session_id');
      localStorage.removeItem('participant_id');

      clearCart();
      setCheckoutSuccess(true);

    } catch (err: any) {
      setCheckoutError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!checkoutOrderId || !checkoutSessionId) return;
    
    const reason = prompt('Please enter a reason for cancellation:');
    if (!reason || !reason.trim()) return;

    try {
      setIsCheckingOut(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${checkoutOrderId}/customer-cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: checkoutSessionId, cancellation_reason: reason.trim() })
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || 'Failed to cancel order.');
      }

      // Automatically go back to menu after cancellation
      window.location.href = '/';
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setIsCheckingOut(false);
    }
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
    handleCancelOrder,
  };
};
