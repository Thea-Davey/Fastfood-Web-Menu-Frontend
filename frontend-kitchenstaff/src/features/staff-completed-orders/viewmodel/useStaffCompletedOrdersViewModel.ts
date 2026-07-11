import { useEffect, useMemo, useState } from 'react';
import { type StaffCompletedOrder } from '../model/staffCompletedOrders.model';
import { apiClient } from '../../../lib/apiClient';
import {
  mapOrderResponseToStaffPendingOrder,
  type OrderApiResponse
} from '../../staff-pending-orders/model/staffPendingOrders.model';

interface UseStaffCompletedOrdersViewModelProps {
  onPageReady?: (pageTitle: string, orderCount: number) => void;
  // This prop allows triggering a refetch when the drawer is opened
  isOpen?: boolean;
}

export function useStaffCompletedOrdersViewModel({
  onPageReady,
  isOpen = true,
}: UseStaffCompletedOrdersViewModelProps = {}) {
  const [completedOrders, setCompletedOrders] = useState<StaffCompletedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completedOrderCount = useMemo(() => completedOrders.length, [completedOrders]);

  useEffect(() => {
    onPageReady?.('Completed Orders', completedOrderCount);
  }, [completedOrderCount, onPageReady]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<{ data: { orders: OrderApiResponse[] } }>('/api/kitchen/orders/history');
        if (!active) return;
        const merged = response.data.orders
          .map(mapOrderResponseToStaffPendingOrder)
          .sort((a, b) => {
            const timeA = new Date(a.updatedAt || 0).getTime();
            const timeB = new Date(b.updatedAt || 0).getTime();
            return timeB - timeA; // Newest completed orders first
          });
        setCompletedOrders(merged);
      } catch (err) {
        if (active) setError((err as Error).message ?? 'Failed to load completed orders.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadOrders();
    return () => { active = false; };
  }, [isOpen]);

  return {
    completedOrders,
    completedOrderCount,
    isLoading,
    error,
  };
}