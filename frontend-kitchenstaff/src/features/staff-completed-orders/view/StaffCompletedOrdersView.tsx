import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { StaffOrderCard } from '../../../shared-components/StaffOrderCard/StaffOrderCard';
import type { StaffLayoutOutletContext } from '../../staff-layout/model/staffLayout.model';
import { useStaffCompletedOrdersViewModel } from '../viewmodel/useStaffCompletedOrdersViewModel';

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
};

export function StaffCompletedOrdersView() {
  const { setActiveOrderCount, setPageTitle } = useOutletContext<StaffLayoutOutletContext>();
  const { completedOrderCount, completedOrders } = useStaffCompletedOrdersViewModel({
    onPageReady: (pageTitle, orderCount) => {
      setPageTitle(pageTitle);
      setActiveOrderCount(orderCount);
    },
  });

  return (
    <section style={styles.page} aria-label="Completed orders">
      <div style={styles.grid}>
        {completedOrders.map((order) => (
          <StaffOrderCard
            key={order.id}
            tableLabel="Table #"
            tableValue={order.tableNumber}
            orderTime={order.orderTime}
            customerName={order.customerName}
            orderType={order.orderType}
            statusLabel="Status"
            statusText="COMPLETED"
            items={order.items}
            headerTone="cream"
          />
        ))}
      </div>
    </section>
  );
}