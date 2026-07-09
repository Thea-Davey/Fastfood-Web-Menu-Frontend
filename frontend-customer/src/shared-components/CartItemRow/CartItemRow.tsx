// Shared Component: CartItemRow.tsx
// Dumb list row. Receives item data, onIncrement, onDecrement, onRemove via props only.

import React from 'react';

interface CartItemRowProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  notes?: string;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

const renderParsedNotes = (notes: string | undefined, itemName: string) => {
  if (!notes) return null;

  // Parse portion size from item name (e.g. 9 from '9pcs Wings')
  const portionMatch = (itemName || '').match(/(\d+)\s*pcs?/i);
  const totalPieces = portionMatch ? parseInt(portionMatch[1], 10) : 0;

  const parts = notes.split(' | ');
  const listItems: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('Flavors: ')) {
      const flavors = trimmed.replace('Flavors: ', '').split(', ');
      const flavorsCount = flavors.length;
      flavors.forEach((flavor) => {
        const qty = totalPieces > 0 ? Math.floor(totalPieces / flavorsCount) : 1;
        listItems.push(
          <div key={`flavor-${flavor}-${index}`} style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500, lineHeight: 1.4 }}>
            {qty} x {flavor}
          </div>
        );
      });
    } else if (trimmed.startsWith('Dips: ')) {
      const dips = trimmed.replace('Dips: ', '').split(', ');
      dips.forEach((dip) => {
        listItems.push(
          <div key={`dip-${dip}-${index}`} style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500, lineHeight: 1.4 }}>
            1 x {dip}
          </div>
        );
      });
    } else if (trimmed.startsWith('Rice: ')) {
      const rice = trimmed.replace('Rice: ', '');
      listItems.push(
        <div key={`rice-${rice}-${index}`} style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500, lineHeight: 1.4 }}>
          1 x {rice}
        </div>
      );
    } else if (trimmed.startsWith('Fries: ')) {
      const fries = trimmed.replace('Fries: ', '');
      listItems.push(
        <div key={`fries-${fries}-${index}`} style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500, lineHeight: 1.4 }}>
          1 x {fries}
        </div>
      );
    } else if (trimmed.startsWith('Beverage: ')) {
      const beverage = trimmed.replace('Beverage: ', '');
      listItems.push(
        <div key={`beverage-${beverage}-${index}`} style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500, lineHeight: 1.4 }}>
          1 x {beverage}
        </div>
      );
    } else {
      // Special Instructions: must wrap in double quotes ""
      listItems.push(
        <div key={`special-${index}`} style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500, lineHeight: 1.4 }}>
          "{trimmed}"
        </div>
      );
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '6px' }}>
      {listItems}
    </div>
  );
};

export const CartItemRow: React.FC<CartItemRowProps> = ({
  id,
  name,
  price,
  imageUrl,
  quantity,
  notes,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px 20px',
      marginBottom: '16px',
      alignItems: 'flex-start',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
      boxSizing: 'border-box',
    }}>
      {/* Column 1: Photo (Left-aligned, Top-aligned) */}
      <div style={{
        width: '90px',
        height: '90px',
        borderRadius: '12px',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'var(--bg-app)',
        alignSelf: 'flex-start',
      }}>
        <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Column 2: Name, Flavors, Dips, Notes (Left-aligned, Top-aligned) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: 0,
        textAlign: 'left',
        alignSelf: 'flex-start',
      }}>
        <p style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--text-main)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {name}
        </p>
        {renderParsedNotes(notes, name)}
      </div>

      {/* Column 3: Price, Stepper + Trashcan in same line */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        flexShrink: 0,
        minHeight: '90px',
      }}>
        {/* Price */}
        <p style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--price-color)',
        }}>
          ₱{(price * quantity).toFixed(2)}
        </p>

        {/* Stepper & Trashcan Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: 'auto',
          alignSelf: 'flex-end',
        }}>
          {/* Qty Selector - top aligned */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid var(--border-color)',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: 'var(--white)',
            height: '36px',
            alignSelf: 'flex-start',
          }}>
            <button
              onClick={() => onDecrement(id)}
              style={qtyBtnStyle}
            >
              −
            </button>
            <span style={{
              minWidth: '24px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 700,
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

          {/* Trash Icon - bottom aligned */}
          <button
            onClick={() => onRemove(id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: 'var(--danger-color)',
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-end',
              height: '36px',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
  width: '32px',
  height: '100%',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  color: 'var(--text-slate)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default CartItemRow;
