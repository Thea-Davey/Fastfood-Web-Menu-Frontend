// Shared Component: MenuItemCard.tsx
// Dumb list-row card. Displays image, name, description, price, and inline quantity controls via props only.

import React, { useState } from 'react';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  onCardClick: () => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  variant?: 'compact' | 'stretched';
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  name,
  description,
  price,
  imageUrl,
  onCardClick,
  quantity = 0,
  onIncrement,
  onDecrement,
  variant = 'compact',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        display: 'flex',
        gap: '16px',
        backgroundColor: 'var(--white)',
        borderRadius: '16px',
        padding: variant === 'stretched' ? '20px 16px' : '14px',
        border: isHovered ? '1px solid var(--primary-color)' : '1px solid var(--border-light)',
        boxShadow: isHovered
          ? '0 12px 24px rgba(15,23,42,0.14)'
          : '0 4px 12px rgba(15,23,42,0.10)',
        alignItems: 'center',
        cursor: 'pointer',
        transform: isActive
          ? 'scale(0.98)'
          : isHovered
            ? 'translateY(-2px)'
            : 'translateY(0)',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Product Image */}
      <div style={{
        width: variant === 'stretched' ? '105px' : '90px',
        height: variant === 'stretched' ? '105px' : '90px',
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

          {quantity > 0 ? (
            /* Inline Quantity Selector */
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #9ba6b2ff',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-app)',
                height: '36px',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement?.();
                }}
                style={qtyBtnStyle}
              >
                −
              </button>
              <span style={{
                minWidth: '24px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}>
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement?.();
                }}
                style={qtyBtnStyle}
              >
                +
              </button>
            </div>
          ) : (
            /* Simple Add Button */
            <button
              onClick={(e) => {
                e.stopPropagation();
                onIncrement?.();
              }}
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
          )}
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

export default MenuItemCard;
