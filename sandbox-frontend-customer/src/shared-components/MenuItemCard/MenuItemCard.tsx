// Shared Component: MenuItemCard.tsx
// Dumb list-row card. Displays image, name, description, price, and '+' button via props only.

import React from 'react';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  onAddToCart: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      backgroundColor: 'var(--white)',
      borderRadius: '16px',
      padding: '14px',
      border: '1px solid var(--border-light)',
      boxShadow: '0 2px 6px rgba(15,23,42,0.05)',
      alignItems: 'center',
    }}>
      {/* Product Image */}
      <div style={{
        width: '90px',
        height: '90px',
        borderRadius: '12px',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'var(--bg-image)',
      }}>
        <img
          src={imageUrl}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--text-main)',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </h3>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-light)',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {description}
        </p>

        {/* Price + Button Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--price-color)' }}>
            ₱{price.toFixed(2)}
          </span>
          <button
            onClick={onAddToCart}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '22px',
              color: 'var(--white)',
              fontWeight: 300,
              lineHeight: 1,
              transition: 'background-color 0.15s ease, transform 0.1s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
