// Shared Component: CartItemRow.tsx
// Dumb list row. Receives item data, onIncrement, onDecrement, onRemove via props only.

import React from 'react';

interface CartItemRowProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  id,
  name,
  price,
  imageUrl,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '14px',
      padding: '16px 0',
      borderBottom: '1px solid var(--border-light)',
      alignItems: 'flex-start',
    }}>
      {/* Product Image */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '12px',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'var(--bg-app)',
      }}>
        <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Right side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: 0 }}>
        {/* Name */}
        <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', textAlign: 'right', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>

        {/* Price */}
        <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--price-color)', textAlign: 'right' }}>
          ₱{(price * quantity).toFixed(2)}
        </p>

        {/* Qty selector + delete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
          {/* Quantity Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid var(--border-color)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => onDecrement(id)}
              style={qtyBtnStyle}
            >
              −
            </button>
            <span style={{
              minWidth: '36px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-main)',
            }}>
              {quantity}
            </span>
            <button
              onClick={() => onIncrement(id)}
              style={qtyBtnStyle}
            >
              +
            </button>
          </div>

          {/* Trash Icon */}
          <button
            onClick={() => onRemove(id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: 'var(--danger-color)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Trash SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const qtyBtnStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px',
  color: 'var(--text-slate)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default CartItemRow;
