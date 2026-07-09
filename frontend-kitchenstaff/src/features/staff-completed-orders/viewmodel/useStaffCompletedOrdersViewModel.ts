import { useEffect, useMemo, useState } from 'react';
import {
  STAFF_COMPLETED_ORDERS_DEFAULT,
  type StaffCompletedOrder,
} from '../model/staffCompletedOrders.model';

interface UseStaffCompletedOrdersViewModelProps {
  onPageReady?: (pageTitle: string, orderCount: number) => void;
}

export function useStaffCompletedOrdersViewModel({
  onPageReady,
}: UseStaffCompletedOrdersViewModelProps = {}) {
  const [completedOrders] = useState<StaffCompletedOrder[]>(STAFF_COMPLETED_ORDERS_DEFAULT);

  const completedOrderCount = useMemo(() => completedOrders.length, [completedOrders]);

  useEffect(() => {
    onPageReady?.('Completed Orders', completedOrderCount);
  }, [completedOrderCount, onPageReady]);

  return {
    completedOrders,
    completedOrderCount,
  };
}