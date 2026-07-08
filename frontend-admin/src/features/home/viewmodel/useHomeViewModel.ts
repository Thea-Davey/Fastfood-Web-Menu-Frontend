import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { DashboardSummary, RecentOrder } from '../model/home.model';

export const useHomeViewModel = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary>({
    today_orders: 120,
    pending_orders: 120,
    completed_today: 120,
    cancelled_today: 120,
    revenue_today: 24000
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([
    { id: '1', order_id_display: '#ORD-0008', customer_name: 'Juan Dela Cruz', time: '10:30 AM', total: 200.00, status: 'pending' },
    { id: '2', order_id_display: '#ORD-0007', customer_name: 'Maria Santos', time: '10:28 AM', total: 300.00, status: 'preparing' },
    { id: '3', order_id_display: '#ORD-0006', customer_name: 'Pedro Reyes', time: '10:26 AM', total: 300.00, status: 'completed' },
    { id: '4', order_id_display: '#ORD-0005', customer_name: 'Anna Garcia', time: '10:22 AM', total: 180.00, status: 'pending' },
    { id: '5', order_id_display: '#ORD-0004', customer_name: 'Mark Lopez', time: '10:18 AM', total: 240.00, status: 'cancelled' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-07-07');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch orders from Supabase to dynamically update if data exists
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*');

      if (error) {
        console.error('Supabase fetch error:', error);
      } else if (orders && orders.length > 0) {
        // Calculate dynamic summary
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => o.created_at?.startsWith(today) || true); // Default true for demo
        const pending = orders.filter(o => o.status === 'pending');
        const completed = orders.filter(o => o.status === 'completed');
        const cancelled = orders.filter(o => o.status === 'cancelled');
        const revenue = completed.reduce((sum, o) => sum + (o.total_amount || 0), 0);

        setSummary({
          today_orders: todayOrders.length || 120,
          pending_orders: pending.length || 120,
          completed_today: completed.length || 120,
          cancelled_today: cancelled.length || 120,
          revenue_today: revenue || 24000
        });

        // Format recent orders
        const formatted = orders.slice(0, 5).map((o, idx) => ({
          id: o.id,
          order_id_display: `#ORD-${String(o.order_number || (orders.length - idx)).padStart(4, '0')}`,
          customer_name: o.customer_name || 'Guest Customer',
          time: o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM',
          total: o.total_amount || 200,
          status: o.status || 'pending'
        }));
        setRecentOrders(formatted);
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleViewAllOrders = () => {
    navigate('/admin/orders/all');
  };

  return {
    summary,
    recentOrders,
    isLoading,
    selectedDate,
    setSelectedDate,
    refreshData: fetchDashboardData,
    handleViewAllOrders,
  };
};
