import { useState, useEffect } from 'react';
import { CancelledOrder } from '../model/orders-cancel.model';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const useOrdersCancelViewModel = () => {
  const [orders, setOrders] = useState<CancelledOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCancelOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (token === 'mock_token') {
        setOrders([
          {
            id: 'm1-cancel',
            order_id_display: '#ORD-0004',
            date: new Date().toLocaleDateString([], { month: 'long', day: '2-digit', year: 'numeric' }),
            time: '02:30 PM',
            table_number: 'Table 4',
            customer_name: 'Bob Johnson',
            details: [
              { id: 'oi4', name: 'UNLI A - Wings & Rice', quantity: 1, flavors: ['Soy Garlic'], instructions: '' }
            ],
            total: 299,
            status: 'cancelled',
            cancel_reason: 'Change of mind',
            createdAt: new Date().toISOString()
          }
        ]);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/orders?status=cancelled`, { headers: getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch cancelled orders');
      const json = await res.json();
      const raw: any[] = json.data?.orders ?? json.data ?? [];

      const formatted: CancelledOrder[] = raw.map((o, idx) => {
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
          estimated_time: o.estimated_preparation_time || '10 - 15 mins',
          total: o.total_amount || 0,
          status: 'cancelled',
          cancellation_reason: o.cancellation_reason || o.cancel_reason || 'N/A',
        };
      });

      setOrders(formatted);
    } catch (err) {
      console.error('Error fetching cancelled orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.order_id_display.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredOrders.length, page, totalPages]);

  const paginatedOrders = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return {
    orders: paginatedOrders,
    totalOrders: filteredOrders.length,
    totalPages,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    isLoading,
    refreshOrders: fetchCancelOrders,
  };
};
