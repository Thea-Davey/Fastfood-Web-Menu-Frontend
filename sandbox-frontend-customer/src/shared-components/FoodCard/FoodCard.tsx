// Shared Component: FoodCard.tsx
// Pure presentation card. Takes food details via props. Implements sleek styles and hovering animations.

import React from 'react';

interface FoodCardProps {
  title: string;
  imageUrl: string;
  badge?: string;
  price: number;
}

export const FoodCard: React.FC<FoodCardProps> = ({ title, imageUrl, badge, price }) => {
  return (
    <div style={{
      flex: '0 0 180px',
      backgroundColor: 'var(--white)',
      borderRadius: '16px',
      border: '1px solid var(--border-light)',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(15, 23, 42, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(15, 23, 42, 0.04)';
      }}>
      {badge && (
        <span style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'var(--primary-color)',
          color: 'var(--white)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          padding: '4px 8px',
          borderRadius: '20px',
          zIndex: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {badge}
        </span>
      )}
      <div style={{ width: '100%', height: '120px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'space-between' }}>
        <h3 style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-main)',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {title}
        </h3>
        <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default FoodCard;
