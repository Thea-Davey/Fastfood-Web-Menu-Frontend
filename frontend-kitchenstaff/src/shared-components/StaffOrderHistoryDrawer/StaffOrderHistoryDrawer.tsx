import React from 'react';
import { StaffOrderCard } from '../StaffOrderCard/StaffOrderCard';
import { useStaffCompletedOrdersViewModel } from '../../features/staff-completed-orders/viewmodel/useStaffCompletedOrdersViewModel';

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    opacity: 0,
    visibility: 'hidden' as const,
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
  },
  overlayOpen: {
    opacity: 1,
    visibility: 'visible' as const,
  },
  drawer: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '450px',
    backgroundColor: '#f8f9fa',
    zIndex: 1000,
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-out',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.1)',
  },
  drawerOpen: {
    transform: 'translateX(0)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#1a1a1a',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    lineHeight: 1,
    cursor: 'pointer',
    color: '#666',
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  empty: {
    textAlign: 'center' as const,
    color: '#666',
    marginTop: '40px',
  },
  loader: {
    textAlign: 'center' as const,
    color: '#666',
    marginTop: '40px',
  }
};

export interface StaffOrderHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffOrderHistoryDrawer({ isOpen, onClose }: StaffOrderHistoryDrawerProps) {
  const { completedOrders, isLoading, error } = useStaffCompletedOrdersViewModel({ isOpen });

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{ ...styles.overlay, ...(isOpen ? styles.overlayOpen : {}) }} 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out drawer */}
      <div style={{ ...styles.drawer, ...(isOpen ? styles.drawerOpen : {}) }} aria-hidden={!isOpen}>
        <div style={styles.header}>
          <h2 style={styles.title}>Completed Orders</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close history">&times;</button>
        </div>
        
        <div style={styles.content}>
          {isLoading && <div style={styles.loader}>Loading history...</div>}
          {error && <div style={styles.empty}>Failed to load: {error}</div>}
          {!isLoading && !error && completedOrders.length === 0 && (
            <div style={styles.empty}>No completed orders yet.</div>
          )}
          
          {!isLoading && !error && completedOrders.map((order) => (
            <div key={order.id} style={{ breakInside: 'avoid' }}>
              <StaffOrderCard
                tableLabel="Table #"
                tableValue={order.tableNumber}
                orderTime={order.orderTime}
                createdAt={order.createdAt}
                customerName={order.customerName}
                orderType={order.orderType}
                statusLabel="Status"
                statusText="COMPLETED"
                items={order.items}
                headerTone="cream"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
