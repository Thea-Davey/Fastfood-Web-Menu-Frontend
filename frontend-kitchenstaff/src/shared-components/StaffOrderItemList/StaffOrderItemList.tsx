import React from 'react';

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  } as React.CSSProperties,
  item: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  } as React.CSSProperties,
  line: {
    display: 'flex',
    gap: '8px',
    alignItems: 'baseline',
  } as React.CSSProperties,
  quantity: {
    color: 'var(--color-deep-red)',
    fontWeight: 800,
    fontSize: '1.1rem',
  } as React.CSSProperties,
  name: {
    color: 'var(--color-text)',
    fontWeight: 800,
    fontSize: '1.1rem',
  } as React.CSSProperties,
  meta: {
    color: '#8c8c8c',
    fontSize: '0.95rem',
    paddingLeft: '20px',
    fontWeight: 600,
  } as React.CSSProperties,
  instructions: {
    color: '#7f7f7f',
    fontSize: '0.9rem',
    paddingLeft: '20px',
  } as React.CSSProperties,
};

type StaffOrderItemListItem = {
  quantity: number;
  name: string;
  specialInstructions?: string;
  flavors?: string[];
  dips?: string[];
};

export interface StaffOrderItemListProps {
  items: StaffOrderItemListItem[];
}

export function StaffOrderItemList({ items }: StaffOrderItemListProps) {
  return (
    <ul style={styles.list}>
      {items.map((item, index) => {
        return (
          <li key={`${item.name}-${index}`} style={styles.item}>
            <div style={styles.line}>
              <span style={styles.quantity}>{item.quantity} &times;</span>
              <span style={styles.name}>{item.name}</span>
            </div>
            {item.flavors && item.flavors.map((flavor) => (
              <div key={flavor} style={styles.meta}>{flavor}</div>
            ))}
            {item.dips && item.dips.map((dip) => (
              <div key={dip} style={styles.meta}>{dip}</div>
            ))}
            {item.specialInstructions ? (
              <div style={styles.instructions}>{item.specialInstructions}</div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}