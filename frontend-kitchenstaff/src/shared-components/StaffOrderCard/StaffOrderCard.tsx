import React from 'react';
import { StaffOrderItemList } from '../StaffOrderItemList/StaffOrderItemList';
import { OrderTimer } from '../OrderTimer/OrderTimer';

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    overflow: 'hidden',
    borderRadius: '10px',
    background: '#ffffff',
    border: '1px solid rgba(47, 47, 47, 0.1)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.10)',
  } as React.CSSProperties,

  // ── Top bar (order id + timestamp) ─────────────────────────────────────────
  metaBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    background: 'rgba(0,0,0,0.04)',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
  } as React.CSSProperties,
  metaText: {
    fontSize: '0.70rem',
    color: '#8a8a8a',
    fontWeight: 600,
    letterSpacing: '0.04em',
  } as React.CSSProperties,

  // ── Name + type row ─────────────────────────────────────────────────────────
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px 6px',
    borderBottom: '1.5px dotted rgba(0,0,0,0.15)',
  } as React.CSSProperties,
  customerName: {
    fontSize: '0.92rem',
    fontWeight: 800,
    color: '#1a1a1a',
    margin: 0,
  } as React.CSSProperties,
  typeBadge: {
    fontSize: '0.70rem',
    fontWeight: 800,
    letterSpacing: '0.10em',
    textTransform: 'uppercase' as const,
    padding: '3px 8px',
    borderRadius: '4px',
    background: 'rgba(159, 35, 5, 0.10)',
    color: 'var(--color-deep-red)',
  } as React.CSSProperties,
  typeBadgeDelivery: {
    background: 'rgba(79, 143, 70, 0.12)',
    color: '#2e6b27',
  } as React.CSSProperties,

  // ── Status chip (warm / preparing) ─────────────────────────────────────────
  statusChipWarm: {
    display: 'inline-block',
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '2px 7px',
    borderRadius: '4px',
    background: '#ffeeba',
    color: '#7d5a00',
  } as React.CSSProperties,
  statusChipGreen: {
    display: 'inline-block',
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '2px 7px',
    borderRadius: '4px',
    background: '#d4edda',
    color: '#155724',
  } as React.CSSProperties,

  // ── Table + status header ───────────────────────────────────────────────────
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '8px 12px 4px',
    background: 'linear-gradient(135deg, #f1a62d 0%, #ffd76a 100%)',
  } as React.CSSProperties,
  headerRowGreen: {
    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
  } as React.CSSProperties,
  tableLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(47,47,47,0.6)',
    marginBottom: '1px',
  } as React.CSSProperties,
  tableValue: {
    fontSize: '1.25rem',
    fontWeight: 900,
    color: '#1a1a1a',
    lineHeight: 1,
  } as React.CSSProperties,
  orderTimeMeta: {
    fontSize: '0.72rem',
    color: 'rgba(47,47,47,0.65)',
    marginTop: '2px',
  } as React.CSSProperties,

  // ── Body ───────────────────────────────────────────────────────────────────
  body: {
    padding: '8px 12px 4px',
    borderBottom: '1.5px dotted rgba(0,0,0,0.12)',
  } as React.CSSProperties,

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  actionButton: {
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.80rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    transition: 'filter 0.15s ease',
  } as React.CSSProperties,
  actionButtonWarm: {
    background: 'var(--color-deep-red)',
    color: '#ffffff',
  } as React.CSSProperties,
  actionButtonSuccess: {
    background: '#4f8f46',
    color: '#ffffff',
  } as React.CSSProperties,
};

export type StaffOrderCardProps = {
  tableLabel: string;
  tableValue: string;
  orderTime: string;
  /** Raw ISO-8601 timestamp — drives the elapsed timer. Optional for completed orders. */
  createdAt?: string;
  customerName: string;
  orderType: string;
  statusLabel: string;
  statusText: string;
  items: Array<{
    quantity: number;
    name: string;
    specialInstructions?: string;
    flavors?: string[];
    dips?: string[];
  }>;
  headerTone: 'warm' | 'cream';
  actionTone?: 'warm' | 'success';
  actionLabel?: string;
  onAction?: () => void;
};

export function StaffOrderCard({
  tableLabel,
  tableValue,
  orderTime,
  createdAt,
  customerName,
  orderType,
  statusText,
  items,
  headerTone,
  actionTone,
  actionLabel,
  onAction,
}: StaffOrderCardProps) {
  const isDelivery = orderType.toLowerCase().includes('delivery');
  const headerStyle = headerTone === 'cream' ? { ...styles.headerRow, ...styles.headerRowGreen } : styles.headerRow;
  const buttonStyle = actionTone === 'success' ? styles.actionButtonSuccess : styles.actionButtonWarm;
  const statusChipStyle = actionTone === 'success' ? styles.statusChipGreen : styles.statusChipWarm;
  const typeBadgeStyle = isDelivery
    ? { ...styles.typeBadge, ...styles.typeBadgeDelivery }
    : styles.typeBadge;

  return (
    <article style={styles.card}>

      {/* Meta bar: order ID + time + elapsed timer */}
      <div style={styles.metaBar}>
        <span style={styles.metaText}>Order #{tableValue}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={styles.metaText}>{orderTime}</span>
          <OrderTimer createdAt={createdAt} status={statusText} />
        </span>
      </div>

      {/* Header: table number + status */}
      <div style={headerStyle}>
        <div>
          <div style={styles.tableLabel}>{tableLabel}</div>
          <div style={styles.tableValue}>{tableValue}</div>
          <div style={styles.orderTimeMeta}>{orderTime}</div>
        </div>
        <span style={statusChipStyle}>{statusText}</span>
      </div>

      {/* Name + order type row */}
      <div style={styles.nameRow}>
        <p style={styles.customerName}>{customerName}</p>
        <span style={typeBadgeStyle}>{orderType}</span>
      </div>

      {/* Items list */}
      <div style={styles.body}>
        <StaffOrderItemList items={items} />
      </div>

      {/* Action button */}
      {actionLabel && onAction ? (
        <div style={styles.footer}>
          <button
            type="button"
            style={{ ...styles.actionButton, ...buttonStyle }}
            onClick={onAction}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.12)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'none'; }}
          >
            {actionLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}