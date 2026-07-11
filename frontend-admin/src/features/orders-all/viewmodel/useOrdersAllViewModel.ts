import { useState, useEffect } from 'react';
import { AllOrder } from '../model/orders-all.model';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const formatOrder = (o: any, idx: number, total: number): AllOrder => {
  const details = (o.order_items || []).map((oi: any) => ({
    id: oi.id,
    name: oi.menu_items?.name || 'Wings Item',
    quantity: oi.quantity || 1,
    flavors: oi.selected_flavors || [],
    instructions: oi.special_instructions || '',
  }));

  return {
    id: o.id,
    order_id_display: `#ORD-${String(o.order_number || (total - idx)).padStart(4, '0')}`,
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
    status: o.status || 'pending',
    cancellation_reason: o.cancellation_reason,
  };
};

export const useOrdersAllViewModel = () => {
  const [orders, setOrders] = useState<AllOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const url = selectedDate ? `${apiUrl}/api/orders?date=${selectedDate}` : `${apiUrl}/api/orders`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch orders');
      const json = await res.json();
      const raw: any[] = json.data?.orders ?? json.data ?? [];
      setOrders(raw.map((o, idx) => formatOrder(o, idx, raw.length)));
    } catch (err) {
      console.error('Error fetching all orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [selectedDate]);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.order_id_display.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / 10);
  const paginatedOrders = filteredOrders.slice((page - 1) * 10, page * 10);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredOrders.length, page, totalPages]);

  return {
    orders: paginatedOrders,
    totalOrders,
    totalPages,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate,
    page,
    setPage,
    isLoading,
    refreshOrders: fetchAllOrders,
  };
};
