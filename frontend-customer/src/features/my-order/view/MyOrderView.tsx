// View Layer: MyOrderView.tsx
// Dumb UI shell. Calls ViewModel, renders CartItemRows, summary, and Checkout button.
// NO useState, NO useEffect, NO API calls.

import React from 'react';
import { useMyOrderViewModel } from '../viewmodel/useMyOrderViewModel';
import { CartItemRow } from '../../../shared-components/CartItemRow/CartItemRow';

export const MyOrderView: React.FC = () => {
  const {
    items,
    subtotal,
    total,
    isEmpty,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleCheckout,
  } = useMyOrderViewModel();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: 'var(--white)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      maxWidth: '640px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 12px' }}>
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
      <div style={{ flex: 1, padding: '0 20px 160px', overflowY: 'auto' }}>
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
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'var(--primary-color)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontFamily: 'inherit',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrderView;
