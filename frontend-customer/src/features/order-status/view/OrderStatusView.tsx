import React, { useState } from 'react';
import { useOrderStatusViewModel } from '../viewmodel/useOrderStatusViewModel';
import { PlacedItemRow } from '../components/PlacedItemRow';

interface OrderStatusViewProps {
  orderId: string;
  sessionId: string;
  onCancel?: () => void;
}

export const OrderStatusView: React.FC<OrderStatusViewProps> = ({ orderId, sessionId, onCancel }) => {
  const { order, isLoading, error, isCancelling, handleCancelOrder } = useOrderStatusViewModel(orderId, sessionId);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const submitCancel = async () => {
    if (!cancelReason.trim()) return;
    const success = await handleCancelOrder(cancelReason);
    if (success) {
      setShowCancelModal(false);
      if (onCancel) onCancel();
      else window.location.href = '/';
    }
  };

  if (isLoading && !order) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <span className="spinner" style={{ width: '24px', height: '24px', border: '3px solid var(--border-light)', borderTop: '3px solid var(--primary-color)', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-light)' }}>
        <p>{error || 'Order not found.'}</p>
        <button onClick={() => window.location.href = '/'} style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--white)', cursor: 'pointer' }}>
          Back to Menu
        </button>
      </div>
    );
  }

  // If the order was cancelled, immediately show the back to menu state or let it gracefully redirect
  if (order.status === 'cancelled') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-main)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--danger-color)" strokeWidth="2" style={{ marginBottom: '16px' }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <h2 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>Order Cancelled</h2>
        <button onClick={() => window.location.href = '/'} style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: 'transparent',
      maxWidth: '640px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 12px', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: '#ffedd5', // light orange
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Table icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18" />
              <rect x="3" y="3" width="18" height="5" rx="1" />
              <path d="M5 21h14" />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'capitalize' }}>
              {order.table_number.toLowerCase().includes('table') ? order.table_number : `Table ${order.table_number}`}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-light)' }}>See status of your orders.</p>
          </div>
        </div>
        <hr style={{ marginTop: '16px', border: 'none', borderTop: '1px solid var(--border-light)' }} />
      </div>

      {/* Item List */}
      <div style={{ flex: 1, padding: '16px 20px 120px', overflowY: 'auto' }}>
        {order.items.map((item) => (
          <PlacedItemRow
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
            status={order.status}
          />
        ))}
      </div>

      {/* Fixed bottom Cancel Action */}
      <div style={{
        position: 'fixed',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '640px',
        padding: '20px',
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--white)',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
        zIndex: 100,
        boxSizing: 'border-box',
      }}>
        <button
          onClick={() => setShowCancelModal(true)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'transparent',
            color: 'var(--danger-color)',
            border: '2px solid var(--danger-color)',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Cancel Order
        </button>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '16px',
            padding: '32px 24px', // Increased top and bottom padding
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>Cancel Order Reason</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-light)' }}>Tell us why you want to cancel your order.</p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. changed my mind"
              rows={5}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '8px',
                border: '1.5px solid #9ca3af', // Darkened stroke for visibility
                backgroundColor: 'var(--bg-app)',
                fontSize: '14px',
                fontFamily: 'inherit',
                color: 'var(--text-main)',
                resize: 'none',
                marginBottom: '24px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={submitCancel}
                disabled={isCancelling || !cancelReason.trim()}
                style={{
                  padding: '18px',
                  backgroundColor: (isCancelling || !cancelReason.trim()) ? '#CBD5E1' : 'var(--primary-color)',
                  color: (isCancelling || !cancelReason.trim()) ? '#94A3B8' : 'var(--white)',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: (isCancelling || !cancelReason.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {isCancelling ? 'Submitting...' : 'Submit'}
              </button>

              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                style={{
                  padding: '14px',
                  backgroundColor: 'transparent',
                  color: 'var(--primary-color)',
                  border: '2px solid var(--primary-color)',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: isCancelling ? 'not-allowed' : 'pointer',
                  opacity: isCancelling ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusView;
