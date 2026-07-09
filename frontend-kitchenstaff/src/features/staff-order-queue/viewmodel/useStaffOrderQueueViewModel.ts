import { useEffect, useMemo, useState } from 'react';
import {
  STAFF_ORDER_QUEUE_DEFAULT,
  StaffOrderQueueEntry,
} from '../model/staffOrderQueue.model';
import { StaffOrderStatus } from '../../staff-pending-orders/model/staffPendingOrders.model';

interface UseStaffOrderQueueViewModelProps {
  onPageReady?: (pageTitle: string, activeOrderCount: number) => void;
}

export function useStaffOrderQueueViewModel({
  onPageReady,
}: UseStaffOrderQueueViewModelProps = {}) {
  const [orders, setOrders] = useState<StaffOrderQueueEntry[]>(STAFF_ORDER_QUEUE_DEFAULT);

  const sortedActiveOrders = useMemo(() => {
    return [...orders]
      .sort((left, right) => {
        const leftTime = new Date(left.createdAt).getTime();
        const rightTime = new Date(right.createdAt).getTime();
        return leftTime - rightTime;
      })
      .filter((order) => order.status === StaffOrderStatus.PENDING);
  }, [orders]);

  const activeOrderCount = sortedActiveOrders.length;

  useEffect(() => {
    onPageReady?.('Order Queue Monitor', activeOrderCount);
  }, [activeOrderCount, onPageReady]);

  const markOrderComplete = (orderId: string) => {
    setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
  };

  return {
    sortedActiveOrders,
    activeOrderCount,
    markOrderComplete,
  };
}