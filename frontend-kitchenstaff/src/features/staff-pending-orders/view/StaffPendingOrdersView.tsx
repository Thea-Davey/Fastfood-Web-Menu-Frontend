import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { StaffOrderCard } from '../../../shared-components/StaffOrderCard/StaffOrderCard';
import type { StaffLayoutOutletContext } from '../../staff-layout/model/staffLayout.model';
import { useStaffPendingOrdersViewModel } from '../viewmodel/useStaffPendingOrdersViewModel';
import { StaffOrderStatus } from '../model/staffPendingOrders.model';

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: 'calc(100vh - 72px)',
    width: '100%',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    alignItems: 'start',
    padding: '20px 24px',
    overflowY: 'auto' as const,
    flex: 1,
  } as React.CSSProperties,
  emptyState: {
    display: 'grid',
    placeItems: 'center',
    minHeight: '280px',
    padding: '32px',
    border: '1px dashed rgba(159, 35, 5, 0.25)',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.5)',
    color: 'var(--color-muted)',
    textAlign: 'center' as const,
    margin: 'auto',
  } as React.CSSProperties,
};


export function StaffPendingOrdersView() {
  const { setActiveOrderCount, setPageTitle } = useOutletContext<StaffLayoutOutletContext>();
  const { activeOrderCount, markOrderComplete, pendingOrders, prepareOrder } = useStaffPendingOrdersViewModel({
    onPageReady: (pageTitle, orderCount) => {
      setPageTitle(pageTitle);
      setActiveOrderCount(orderCount);
    },
  });

  return (
    <section style={styles.page} aria-label="Pending orders">
      {pendingOrders.length === 0 ? (
        <div style={styles.emptyState}>All pending orders have been completed.</div>
      ) : (
        <div style={styles.grid}>
          {pendingOrders.map((order) => (
            <StaffOrderCard
              key={order.id}
              tableLabel="Table #"
              tableValue={order.tableNumber}
              orderTime={order.orderTime}
              customerName={order.customerName}
              orderType={order.orderType}
              statusLabel="Status"
              statusText={order.status}
              items={order.items}
              actionLabel={order.status === StaffOrderStatus.PENDING ? 'Prepare Order' : 'Mark as Complete'}
              actionTone={order.status === StaffOrderStatus.PENDING ? 'warm' : 'success'}
              headerTone={order.status === StaffOrderStatus.PENDING ? 'warm' : 'cream'}
              onAction={
                order.status === StaffOrderStatus.PENDING
                  ? () => prepareOrder(order.id)
                  : () => markOrderComplete(order.id)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}