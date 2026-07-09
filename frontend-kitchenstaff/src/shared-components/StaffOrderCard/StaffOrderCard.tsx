import React from 'react';
import { StaffOrderItemList } from '../StaffOrderItemList/StaffOrderItemList';

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: '0 0 360px',
    minHeight: '540px',
    height: '100%',
    scrollSnapAlign: 'start',
    overflow: 'hidden',
    borderRadius: '12px',
    background: '#ffffff',
    border: '1px solid rgba(47, 47, 47, 0.08)',
    boxShadow: '0 0 18px rgba(0, 0, 0, 0.17)',
  } as React.CSSProperties,
  topBar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '16px 18px',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  topBarWarm: {
    background: 'linear-gradient(135deg, #f1a62d 0%, #ffd76a 100%)',
  } as React.CSSProperties,
  topBarCream: {
    background: 'linear-gradient(135deg, #fff7c8 0%, #ffffd6 100%)',
  } as React.CSSProperties,
  headerCopy: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  } as React.CSSProperties,
  tableLabel: {
    color: 'rgba(47, 47, 47, 0.65)',
    fontSize: '0.8rem',
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  orderLabel: {
    margin: 0,
    color: 'var(--color-deep-red)',
    fontSize: '1.5rem',
    fontWeight: 800,
  } as React.CSSProperties,
  orderMeta: {
    margin: 0,
    fontSize: '0.92rem',
    color: 'rgba(47, 47, 47, 0.72)',
  } as React.CSSProperties,
  statusBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '4px',
  } as React.CSSProperties,
  statusLabel: {
    color: 'rgba(47, 47, 47, 0.65)',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  statusText: {
    color: 'var(--color-deep-red)',
    fontSize: '1.50rem',
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: '0.01em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  body: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    gap: '14px',
    padding: '18px',
  } as React.CSSProperties,
  orderType: {
    margin: 0,
    color: 'var(--color-deep-red)',
    fontSize: '1.50rem',
    fontStyle: 'italic',
    fontWeight: 800,
    letterSpacing: '0.08em',
  } as React.CSSProperties,
  divider: {
    width: '100%',
    height: '1px',
    background: 'rgba(47, 47, 47, 0.1)',
  } as React.CSSProperties,
  footer: {
    padding: '0 18px 18px',
  } as React.CSSProperties,
  actionButton: {
    width: '100%',
    border: '2px solid rgba(0, 0, 0, 0.09)',
    borderRadius: '12px',
    padding: '16px 16px',
    color: '#ffffff',
    fontWeight: 800,
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
    // boxShadow: '0 0 18px rgba(0, 0, 0, 0.16)',
  } as React.CSSProperties,
  actionButtonWarm: {
    background: '#fdf7b7ff',
    color: 'var(--color-black)',
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
  customerName,
  orderType,
  statusLabel,
  statusText,
  items,
  headerTone,
  actionTone,
  actionLabel,
  onAction,
}: StaffOrderCardProps) {
  const topBarToneStyle = headerTone === 'warm' ? styles.topBarWarm : styles.topBarCream;
  const buttonToneStyle = actionTone === 'success' ? styles.actionButtonSuccess : styles.actionButtonWarm;

  return (
    <article style={styles.card}>
      <div style={{ ...styles.topBar, ...topBarToneStyle }}>
        <div style={styles.headerCopy}>
          <div style={styles.tableLabel}>{tableLabel}</div>
          <h4 style={styles.orderLabel}>{tableValue}</h4>
          <p style={styles.orderMeta}>
            {orderTime} | {customerName}
          </p>
        </div>
        <div style={styles.statusBlock}>
          <div style={styles.statusLabel}>{statusLabel}</div>
          <div style={styles.statusText}>{statusText}</div>
        </div>
      </div>

      <div style={styles.body}>
        <p style={styles.orderType}>{orderType}</p>
        <div style={styles.divider} aria-hidden="true" />
        <StaffOrderItemList items={items} />
      </div>

      {actionLabel && onAction ? (
        <div style={styles.footer}>
          <button type="button" style={{ ...styles.actionButton, ...buttonToneStyle }} onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}