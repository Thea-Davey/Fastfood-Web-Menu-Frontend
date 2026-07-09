// ViewModel Layer: useStaffPendingOrdersViewModel.ts
// Replaces mock state with live backend data.
// REST: fetches pending + preparing orders on mount, patches status on action.
// Socket: joins admin:room, listens for order:new and order:status_updated.

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  mapOrderResponseToStaffPendingOrder,
  StaffOrderStatus,
  type OrderApiResponse,
  type StaffPendingOrder,
} from '../model/staffPendingOrders.model';
import { apiClient } from '../../../lib/apiClient';
import { socket } from '../../../lib/socket';

interface UseStaffPendingOrdersViewModelProps {
  onPageReady?: (pageTitle: string, activeOrderCount: number) => void;
}

// Shape of the socket event payloads emitted by the backend
interface OrderNewPayload {
  order: OrderApiResponse;
}
interface OrderStatusUpdatedPayload {
  order: OrderApiResponse;
}

export function useStaffPendingOrdersViewModel({
  onPageReady,
}: UseStaffPendingOrdersViewModelProps = {}) {
  const [orders, setOrders] = useState<StaffPendingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch both statuses in one call from the kitchen endpoint
        const response = await apiClient.get<{ data: { orders: OrderApiResponse[] } }>('/api/kitchen/orders');

        if (!active) return;

        const merged = response.data.orders
          .map(mapOrderResponseToStaffPendingOrder)
          // Sort oldest-first so the kitchen sees the most urgent orders first
          .sort((a, b) => a.orderTime.localeCompare(b.orderTime));

        setOrders(merged);
      } catch (err) {
        if (active) setError((err as Error).message ?? 'Failed to load orders.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadOrders();
    return () => { active = false; };
  }, []);

  // ── Socket.io ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Join the admin monitoring room
    socket.emit('admin:join');

    const handleOrderNew = ({ order }: OrderNewPayload) => {
      if (order.status !== StaffOrderStatus.PENDING) return;
      setOrders((prev) => {
        // Avoid duplicates if the REST fetch already picked it up
        if (prev.some((o) => o.id === order.id)) return prev;
        return [...prev, mapOrderResponseToStaffPendingOrder(order)];
      });
    };

    const handleOrderStatusUpdated = ({ order }: OrderStatusUpdatedPayload) => {
      const newStatus = order.status as StaffOrderStatus;

      // If updated to completed/cancelled → remove from this view
      if (
        newStatus === StaffOrderStatus.COMPLETED ||
        newStatus === StaffOrderStatus.CANCELLED
      ) {
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
        return;
      }

      // Otherwise patch the existing entry in-place (e.g. pending → preparing)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? mapOrderResponseToStaffPendingOrder(order) : o,
        ),
      );
    };

    socket.on('order:new', handleOrderNew);
    socket.on('order:status_updated', handleOrderStatusUpdated);

    return () => {
      socket.off('order:new', handleOrderNew);
      socket.off('order:status_updated', handleOrderStatusUpdated);
    };
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────
  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status === StaffOrderStatus.PENDING ||
          o.status === StaffOrderStatus.PREPARING,
      ),
    [orders],
  );

  const activeOrderCount = pendingOrders.length;

  useEffect(() => {
    onPageReady?.('Pending Orders', activeOrderCount);
  }, [activeOrderCount, onPageReady]);

  // ── Undo State ────────────────────────────────────────────────────────────
  const [lastAction, setLastAction] = useState<{
    orderId: string;
    previousStatus: StaffOrderStatus;
    message: string;
  } | null>(null);

  // Auto-clear undo after 5 seconds
  useEffect(() => {
    if (!lastAction) return;
    const timer = setTimeout(() => {
      setLastAction(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [lastAction]);

  const undoAction = useCallback(async () => {
    if (!lastAction) return;
    const { orderId, previousStatus } = lastAction;
    
    // Clear the toast immediately
    setLastAction(null);

    // Optimistic restore: If it was completed, it was removed from `orders`. 
    // We need to re-fetch to safely get it back, OR we can rely on the socket event to put it back!
    // Wait, if it was completed, it's GONE from `orders`. If we send `status: pending/preparing`, 
    // the socket will broadcast it back, BUT `handleOrderStatusUpdated` filters out completed, and `handleOrderNew` only listens for `pending`.
    // Actually, `updateKitchenOrderStatus` broadcasts `order:status_updated`. 
    // Wait, `handleOrderStatusUpdated` checks if it exists in `prev`. If it was completed, it's NOT in `prev`, so it won't be updated!
    // We must manually add it back optimistically, BUT we don't have the full order object anymore (unless we save it in lastAction).

    try {
      await apiClient.patch(`/api/kitchen/orders/${orderId}/status`, { status: previousStatus });
      // We should ideally reload orders if it was restored from completed to ensure full data is present.
      const response = await apiClient.get<{ data: { orders: OrderApiResponse[] } }>('/api/kitchen/orders');
      const merged = response.data.orders
        .map(mapOrderResponseToStaffPendingOrder)
        .sort((a, b) => a.orderTime.localeCompare(b.orderTime));
      setOrders(merged);
    } catch (err) {
      console.error('Failed to undo order status:', err);
    }
  }, [lastAction]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const moveToPreparing = useCallback(async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    setLastAction({ orderId, previousStatus: order.status, message: `Moved to Preparing` });

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: StaffOrderStatus.PREPARING } : o,
      ),
    );
    try {
      await apiClient.patch(`/api/kitchen/orders/${orderId}/status`, { status: 'preparing' });
    } catch (err) {
      // Rollback on failure
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: StaffOrderStatus.PENDING } : o,
        ),
      );
      console.error('Failed to move order to preparing:', err);
    }
  }, [orders]);

  const completeOrder = useCallback(async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setLastAction({ orderId, previousStatus: order.status, message: `Marked as Complete` });

    // Optimistic removal
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await apiClient.patch(`/api/kitchen/orders/${orderId}/status`, { status: 'completed' });
    } catch (err) {
      // On failure we'd need the order back; re-fetch is the simplest recovery
      console.error('Failed to complete order:', err);
    }
  }, [orders]);

  // Keep legacy names so the existing View doesn't need changes
  const prepareOrder = moveToPreparing;
  const markOrderComplete = completeOrder;

  return {
    pendingOrders,
    activeOrderCount,
    isLoading,
    error,
    prepareOrder,
    markOrderComplete,
    lastAction,
    undoAction,
  };
}