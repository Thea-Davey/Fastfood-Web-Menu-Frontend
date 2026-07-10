import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { OrderItemStatus } from '../components/PlacedItemRow';

export interface OrderDetails {
  id: string;
  order_number: number;
  table_number: string;
  status: OrderItemStatus;
  items: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
  }>;
}

// Set to true to bypass backend cancellation API constraints and test locally.
const TEST_CANCEL_ORDER = false;

export const useOrderStatusViewModel = (orderId: string, sessionId: string) => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        // Fetch from supabase
        const { data, error: fetchErr } = await supabase
          .from('orders')
          .select('*, order_items(*, menu_items(*))')
          .eq('id', orderId)
          .single();

        if (fetchErr) throw fetchErr;

        if (active && data) {
          const items = (data.order_items || []).map((oi: any) => {
            const noteParts: string[] = [];
            if (oi.selected_flavors?.length) noteParts.push(`Flavors: ${oi.selected_flavors.join(', ')}`);
            if (oi.selected_dips?.length) noteParts.push(`Dips: ${oi.selected_dips.join(', ')}`);
            if (oi.selected_rice) noteParts.push(`Rice: ${oi.selected_rice}`);
            if (oi.selected_fries_flavor) noteParts.push(`Fries: ${oi.selected_fries_flavor}`);
            if (oi.selected_beverage) noteParts.push(`Beverage: ${oi.selected_beverage}`);
            if (oi.special_instructions) noteParts.push(oi.special_instructions);

            return {
              id: oi.id,
              name: oi.menu_items?.name || 'Unknown Item',
              description: noteParts.join(' | '),
              price: Number(oi.unit_price || 0),
              imageUrl: oi.menu_items?.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
              quantity: oi.quantity || 1,
            };
          });

          setOrder({
            id: data.id,
            order_number: data.order_number,
            table_number: data.table_number,
            status: data.status as OrderItemStatus,
            items,
          });
        }
      } catch (err: any) {
        if (active) {
          console.error('Failed to fetch order status:', err);
          setError('Could not load order status.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();

    // Set up polling every 10 seconds to refresh status
    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId]);

  const handleCancelOrder = async (reason: string) => {
    if (!orderId || !sessionId) return false;

    if (TEST_CANCEL_ORDER) {
      try {
        setIsCancelling(true);
        console.log('[TestMode] Simulating successful cancel with reason:', reason);
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
        setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
        localStorage.removeItem('checkout_order_id');
        localStorage.removeItem('checkout_session_id');
        return true;
      } finally {
        setIsCancelling(false);
      }
    }

    try {
      setIsCancelling(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/customer-cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, cancellation_reason: reason.trim() })
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || 'Failed to cancel order.');
      }

      // Update local state to cancelled instantly
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);

      // Clean up local storage
      localStorage.removeItem('checkout_order_id');
      localStorage.removeItem('checkout_session_id');

      return true; // Return success
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order.');
      return false; // Return failure
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    order,
    isLoading,
    error,
    isCancelling,
    handleCancelOrder,
  };
};
