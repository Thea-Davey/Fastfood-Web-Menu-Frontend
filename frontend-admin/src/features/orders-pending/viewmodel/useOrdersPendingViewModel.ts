import { useState, useEffect } from 'react';
import { PendingOrder } from '../model/orders-pending.model';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const useOrdersPendingViewModel = () => {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const fetchPendingOrders = async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/orders?status=pending`, { headers: getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch pending orders');
      const json = await res.json();
      const raw: any[] = json.data?.orders ?? json.data ?? [];

      const formatted: PendingOrder[] = raw.map((o, idx) => {
        const details = (o.order_items || []).map((oi: any) => ({
          id: oi.id,
          name: oi.menu_items?.name || 'Wings Item',
          quantity: oi.quantity || 1,
          flavors: oi.selected_flavors || [],
          instructions: oi.special_instructions || '',
        }));

        return {
          id: o.id,
          order_id_display: `#ORD-${String(o.order_number || (raw.length - idx)).padStart(4, '0')}`,
          date: o.created_at
            ? new Date(o.created_at).toLocaleDateString([], { month: 'long', day: '2-digit', year: 'numeric' })
            : '--',
          time: o.created_at
            ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '--:--',
          table_number: o.table_number ? `Table ${o.table_number}` : 'N/A',
          customer_name: o.customer_name || 'Guest Customer',
          details,
          order_type: o.order_type === 'takeout' ? 'Takeout' : 'Dine In',
          estimated_time: o.estimated_preparation_time || '10 - 15 mins',
          total: o.total_amount || 0,
          payment_method:
            o.payment_method === 'gcash' ? 'GCash'
            : o.payment_method === 'card' ? 'Card'
            : o.payment_method === 'maya' ? 'Maya'
            : 'Cash',
          status: o.status || 'pending',
          createdAt: o.created_at,
        };
      });

      setOrders(formatted);
    } catch (err) {
      console.error('Error fetching pending orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: 'pending' | 'preparing' | 'completed' | 'cancelled',
    cancellationReason?: string
  ) => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const body: any = { status };
      if (cancellationReason) body.cancellation_reason = cancellationReason;

      const res = await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to update order status');

      if (status === 'completed' || status === 'cancelled') {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setIsLoading(false);
      setActiveDropdownId(null);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.order_id_display.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPayment = selectedPayment === 'All' || o.payment_method === selectedPayment;
    return matchesSearch && matchesPayment;
  });

  return {
    orders: filteredOrders,
    searchQuery,
    setSearchQuery,
    selectedPayment,
    setSelectedPayment,
    page,
    setPage,
    isLoading,
    refreshOrders: fetchPendingOrders,
    updateOrderStatus,
    activeDropdownId,
    setActiveDropdownId,
  };
};
