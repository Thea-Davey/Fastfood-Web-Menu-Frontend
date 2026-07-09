import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { StaffOrderCard } from '../../../shared-components/StaffOrderCard/StaffOrderCard';
import type { StaffLayoutOutletContext } from '../../staff-layout/model/staffLayout.model';
import { useStaffOrderQueueViewModel } from '../viewmodel/useStaffOrderQueueViewModel';

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: 'calc(100vh - 128px)',
    width: '100%',
  } as React.CSSProperties,
  grid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '24px',
    padding: '24px',
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

export function StaffOrderQueueView() {
  const { setActiveOrderCount, setPageTitle } = useOutletContext<StaffLayoutOutletContext>();
  const { activeOrderCount, markOrderComplete, sortedActiveOrders } = useStaffOrderQueueViewModel({
    onPageReady: (pageTitle, orderCount) => {
      setPageTitle(pageTitle);
      setActiveOrderCount(orderCount);
    },
  });

  return (
    <section style={styles.page} aria-label="Order queue monitor">
      {sortedActiveOrders.length === 0 ? (
        <div style={styles.emptyState}>The active kitchen queue is empty.</div>
      ) : (
        <div style={styles.grid}>
          {sortedActiveOrders.map((order, index) => (
            <StaffOrderCard
              key={order.id}
              tableLabel="Queue #"
              tableValue={`${index + 1}`}
              orderTime={order.orderTime}
              customerName={order.customerName}
              orderType={order.orderType}
              statusLabel="Status"
              statusText={order.status}
              items={order.items}
              headerTone="warm"
              actionTone="warm"
              actionLabel="Mark as Complete"
              onAction={() => markOrderComplete(order.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}