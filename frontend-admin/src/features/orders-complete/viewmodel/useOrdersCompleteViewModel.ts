import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { CompleteOrder } from '../model/orders-complete.model';

export const useOrdersCompleteViewModel = () => {
  const [orders, setOrders] = useState<CompleteOrder[]>([
    {
      id: '1',
      order_id_display: '#ORD-0001',
      date: 'July 06, 2026',
      time: '10:30 AM',
      table_number: 'Table 5',
      customer_name: 'Juan Dela Cruz',
      details: [
        { id: 'd1', name: 'Classic Wings (6pcs)', quantity: 2, flavors: ['Buffalo', 'Soy Garlic'], instructions: 'Extra crispy' }
      ],
      order_type: 'Dine In',
      estimated_time: '10 - 15 mins',
      total: 200.00,
      payment_method: 'Cash',
      status: 'completed'
    },
    {
      id: '2',
      order_id_display: '#ORD-0003',
      date: 'July 06, 2026',
      time: '10:26 AM',
      table_number: 'Table 1',
      customer_name: 'Pedro Reyes',
      details: [
        { id: 'd3', name: 'Creamy Cajun Wings (6pcs)', quantity: 1, flavors: ['Creamy Cajun'] }
      ],
      order_type: 'Dine In',
      estimated_time: '10 - 15 mins',
      total: 300.00,
      payment_method: 'Cash',
      status: 'completed'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompleteOrders = async () => {
    setIsLoading(true);
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .eq('status', 'completed');

      if (error) {
        console.error('Error fetching completed orders:', error);
      } else if (ordersData && ordersData.length > 0) {
        const formatted: CompleteOrder[] = ordersData.map(o => {
          const details = (o.order_items || []).map((oi: any) => ({
            id: oi.id,
            name: oi.menu_items?.name || 'Wings Item',
            quantity: oi.quantity || 1,
            flavors: oi.selected_flavors || [],
            instructions: oi.special_instructions || ''
          }));

          return {
            id: o.id,
            order_id_display: `#ORD-${String(o.order_number || 1).padStart(4, '0')}`,
            date: o.created_at ? new Date(o.created_at).toLocaleDateString([], { month: 'long', day: '2-digit', year: 'numeric' }) : 'July 06, 2026',
            time: o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM',
            table_number: o.table_session?.table_number ? `Table ${o.table_session.table_number}` : 'Table 5',
            customer_name: o.customer_name || 'Guest Customer',
            details,
            order_type: o.order_type === 'takeout' ? 'Takeout' : 'Dine In',
            estimated_time: o.estimated_preparation_time || '10 - 15 mins',
            total: o.total_amount || 200.00,
            payment_method: o.payment_method === 'gcash' ? 'GCash' : o.payment_method === 'card' ? 'Card' : o.payment_method === 'maya' ? 'Maya' : 'Cash',
            status: 'completed'
          };
        });
        setOrders(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleteOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    refreshOrders: fetchCompleteOrders
  };
};
