import { useEffect, useMemo, useState } from 'react';
import {
  STAFF_PENDING_ORDERS_DEFAULT,
  StaffOrderStatus,
  type StaffPendingOrder,
} from '../model/staffPendingOrders.model';

interface UseStaffPendingOrdersViewModelProps {
  onPageReady?: (pageTitle: string, activeOrderCount: number) => void;
}

export function useStaffPendingOrdersViewModel({
  onPageReady,
}: UseStaffPendingOrdersViewModelProps = {}) {
  const [orders, setOrders] = useState<StaffPendingOrder[]>(STAFF_PENDING_ORDERS_DEFAULT);

  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === StaffOrderStatus.PENDING || order.status === StaffOrderStatus.PREPARING,
      ),
    [orders],
  );

  const activeOrderCount = pendingOrders.length;

  useEffect(() => {
    onPageReady?.('Pending Orders', activeOrderCount);
  }, [activeOrderCount, onPageReady]);

  const markOrderComplete = (orderId: string) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: StaffOrderStatus.COMPLETED } : order,
      ),
    );
  };

  const prepareOrder = (orderId: string) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: StaffOrderStatus.PREPARING } : order,
      ),
    );
  };

  return {
    pendingOrders,
    activeOrderCount,
    prepareOrder,
    markOrderComplete,
  };
}