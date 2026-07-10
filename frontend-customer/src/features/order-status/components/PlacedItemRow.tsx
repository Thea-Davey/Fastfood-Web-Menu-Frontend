import React from 'react';

export type OrderItemStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

interface PlacedItemRowProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: OrderItemStatus;
}

export const PlacedItemRow: React.FC<PlacedItemRowProps> = ({
  name,
  description,
  price,
  imageUrl,
  status,
}) => {
  // Status Box Colors
  let badgeBg = '#fed7aa'; // light orange for pending
  let badgeText = '#9a3412'; // dark orange for pending
  let statusText = 'Pending';

  if (status === 'preparing') {
    badgeBg = '#fef08a'; // light yellow
    badgeText = '#854d0e'; // dark yellow
    statusText = 'Preparing';
  } else if (status === 'completed') {
    badgeBg = '#bbf7d0'; // light green
    badgeText = '#166534'; // dark green
    statusText = 'Complete';
  } else if (status === 'cancelled') {
    badgeBg = '#fee2e2'; // light red
    badgeText = '#991b1b'; // dark red
    statusText = 'Cancelled';
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        backgroundColor: 'var(--white)',
        borderRadius: '16px',
        padding: '14px',
        border: '1px solid var(--border-light)',
        boxShadow: '0 4px 12px rgba(15,23,42,0.05)',
        alignItems: 'center',
        marginBottom: '12px',
      }}
    >
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

        {/* Price + Status Badge Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <div style={{
            backgroundColor: badgeBg,
            color: badgeText,
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {statusText}
          </div>
          
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--price-color)' }}>
            ₱{price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlacedItemRow;
