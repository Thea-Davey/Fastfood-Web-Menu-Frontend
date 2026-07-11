// View Layer: MyOrderView.tsx
// Dumb UI shell. Calls ViewModel, renders CartItemRows, summary, and Checkout button.
// NO useState, NO useEffect, NO API calls.

import React from 'react';
import { useMyOrderViewModel } from '../viewmodel/useMyOrderViewModel';
import { CartItemRow } from '../../../shared-components/CartItemRow/CartItemRow';
import { OrderStatusView } from '../../order-status/view/OrderStatusView';

export const MyOrderView: React.FC = () => {
  const {
    items,
    subtotal,
    total,
    isEmpty,
    isCheckingOut,
    checkoutError,
    checkoutSuccess,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleCheckout,
    handleCancelSuccess,
    showOrderStatus,
    handleCheckOrderStatus,
    checkoutOrderId,
    checkoutSessionId,
  } = useMyOrderViewModel();

  if (showOrderStatus && checkoutOrderId && checkoutSessionId) {
    return <OrderStatusView orderId={checkoutOrderId} sessionId={checkoutSessionId} onCancel={handleCancelSuccess} />;
  }

  if (checkoutSuccess) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 194px)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', padding: '0 24px' }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" style={{ marginBottom: '12px' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0' }}>Order Placed!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>The kitchen has received your order.</p>
        
        <button onClick={handleCheckOrderStatus} style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', width: '200px' }}>
          Check Order Status
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
            backgroundColor: 'var(--cart-icon-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Bag icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cart-icon-stroke)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>Your Order</h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-light)' }}>Review your items before checkout.</p>
          </div>
        </div>
        <hr style={{ marginTop: '16px', border: 'none', borderTop: '1px solid var(--border-light)' }} />
      </div>

      {/* Item List */}
      <div style={{ flex: 1, padding: '16px 20px 180px', overflowY: 'auto' }}>
        {isEmpty ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 0',
            color: 'var(--text-light)',
            gap: '12px',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-color)" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <p style={{ fontSize: '14px', margin: 0 }}>Your cart is empty.</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItemRow
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              imageUrl={item.imageUrl}
              quantity={item.quantity}
              notes={item.notes}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      {/* Order Summary + Checkout */}
      {!isEmpty && (
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
          {checkoutError && (
            <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {checkoutError}
            </div>
          )}

          {/* Subtotal row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Subtotal</span>
            <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>₱{subtotal.toFixed(2)}</span>
          </div>

          {/* Total row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>Total</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger-color)' }}>₱{total.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: isCheckingOut ? 'var(--text-muted)' : 'var(--primary-color)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isCheckingOut ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontFamily: 'inherit',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
            }}
          >
            {isCheckingOut ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner" style={{ width: '18px', height: '18px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                Processing...
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Checkout
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrderView;
