import { useState, useEffect } from 'react';
import { CompleteOrder } from '../model/orders-complete.model';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const useOrdersCompleteViewModel = () => {
  const [orders, setOrders] = useState<CompleteOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompleteOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (token === 'mock_token') {
        setOrders([
          {
            id: 'mc1',
            order_id_display: '#ORD-0003',
            date: new Date().toLocaleDateString([], { month: 'long', day: '2-digit', year: 'numeric' }),
            time: '11:15 AM',
            table_number: 'Table 2',
            customer_name: 'Jane Smith',
            details: [
              { id: 'oi2', name: 'UNLI C - Wings Combo', quantity: 1, flavors: ['Honey Garlic'], instructions: '' }
            ],
            total: 349,
            status: 'completed',
            createdAt: new Date().toISOString()
          }
        ]);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/orders?status=completed`, { headers: getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch completed orders');
      const json = await res.json();
      const raw: any[] = json.data?.orders ?? json.data ?? [];

      const formatted: CompleteOrder[] = raw.map((o, idx) => {
        const rawDetails = (o.order_items || []).map((oi: any) => ({
          id: oi.id,
          name: oi.menu_items?.name || 'Wings Item',
          quantity: oi.quantity || 1,
          flavors: oi.selected_flavors || [],
          instructions: oi.special_instructions || oi.notes || '',
        }));

        const details = rawDetails.reduce((acc: any[], cur: any) => {
          const idx = acc.findIndex(
            (i) => i.name === cur.name && i.instructions === cur.instructions &&
              JSON.stringify(i.flavors) === JSON.stringify(cur.flavors)
          );
          if (idx >= 0) {
            acc[idx].quantity += cur.quantity;
          } else {
            acc.push({ ...cur });
          }
          return acc;
        }, []);

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
          status: 'completed',
        };
      });

      setOrders(formatted);
    } catch (err) {
      console.error('Error fetching completed orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleteOrders();
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
    refreshOrders: fetchCompleteOrders,
  };
};
