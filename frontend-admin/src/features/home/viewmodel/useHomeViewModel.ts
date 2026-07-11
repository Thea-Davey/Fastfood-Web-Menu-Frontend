import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardSummary, RecentOrder } from '../model/home.model';
import { useSocket } from '../../../context/SocketContext';
import { playNotificationSound } from '../../../shared/utils/audio';

export const useHomeViewModel = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary>({
    today_orders: 0,
    pending_orders: 0,
    completed_today: 0,
    cancelled_today: 0,
    revenue_today: 0,
    aov: 0,
    average_prep_time: 0,
    top_items: [],
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Fetch summary metrics from backend API
      const summaryRes = await fetch(`${apiUrl}/api/dashboard/summary?date=${selectedDate}`, { headers });
      if (summaryRes.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
        return;
      }

      if (summaryRes.ok) {
        const summaryJson = await summaryRes.json();
        const data = summaryJson.data?.summary || summaryJson.data || {};

        let orders: any[] = [];
        const ordersRes = await fetch(`${apiUrl}/api/orders?date=${selectedDate}`, { headers });
        if (ordersRes.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
          return;
        }

        if (ordersRes.ok) {
          const ordersJson = await ordersRes.json();
          orders = ordersJson.data?.orders ?? ordersJson.data ?? [];
        } else {
          console.error("Failed to fetch /api/orders", await ordersRes.text());
        }

        setSummary({
          today_orders: orders.length,
          pending_orders: data.pending_orders ?? 0,
          completed_today: data.completed_today ?? 0,
          cancelled_today: data.cancelled_today ?? 0,
          revenue_today: data.revenue_today ?? 0,
          aov: data.aov ?? 0,
          average_prep_time: data.average_prep_time ?? 0,
          top_items: data.top_items ?? [],
        });

        if (data.revenue_trend && Array.isArray(data.revenue_trend)) {
          setChartData(data.revenue_trend);
        } else {
          setChartData([]);
        }

        // Format the 5 most recent orders
        const formatted: RecentOrder[] = orders.slice(0, 5).map((o: any, idx: number) => ({
          id: o.id,
          order_id_display: `#ORD-${String(o.order_number || (orders.length - idx)).padStart(4, '0')}`,
          customer_name: o.customer_name || 'Guest Customer',
          time: o.created_at
            ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '--:--',
          total: o.total_amount || 0,
          status: o.status || 'pending',
          createdAt: o.created_at,
        }));
        setRecentOrders(formatted);
      } else {
        console.error("Failed to fetch dashboard summary", await summaryRes.text());
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data: any) => {
      console.log('New order received via WebSocket:', data);
      
      // Play Ding Sound
      playNotificationSound();

      // We could manually append the data to recentOrders, but fetching ensures 
      // the summary totals (today_orders, pending_orders, revenue_today) are 100% accurate.
      // So we just re-fetch the dashboard data instantly.
      fetchDashboardData();
    };

    socket.on('order:new', handleNewOrder);
    socket.on('order:status_updated', handleNewOrder); // Also refresh if a kitchen staff updates an order

    return () => {
      socket.off('order:new', handleNewOrder);
      socket.off('order:status_updated', handleNewOrder);
    };
  }, [socket]);

  const handleViewAllOrders = () => {
    navigate('/admin/orders/all');
  };

  return {
    summary,
    recentOrders,
    chartData,
    isLoading,
    selectedDate,
    setSelectedDate,
    refreshData: fetchDashboardData,
    handleViewAllOrders,
  };
};
