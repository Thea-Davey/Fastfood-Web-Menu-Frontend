import React from 'react';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '22px 24px',
    background: '#9F2305',
    borderBottom: '1px solid rgba(159, 35, 5, 0.14)',
  } as React.CSSProperties,
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    minWidth: 0,
  } as React.CSSProperties,
  logoImage: {
    width: '65px',
    height: 'auto',
    flex: '0 0 auto',
    objectFit: 'contain' as const,
    display: 'block',
  } as React.CSSProperties,
  brandStack: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    minWidth: 0,
  } as React.CSSProperties,
  brandTitle: {
    margin: 0,
    color: '#FFFFD6',
    fontSize: '2rem',
    lineHeight: 1,
    letterSpacing: '0.02em',
  } as React.CSSProperties,
  brandSubtitle: {
    margin: '4px 0 0',
    color: '#FFFFD6',
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '0.22em',
  } as React.CSSProperties,
  divider: {
    width: '1px',
    alignSelf: 'stretch',
    background: '#FFFFFF',
  } as React.CSSProperties,
  pageTitle: {
    margin: 0,
    color: '#FFFFD6',
    fontSize: '2rem',
    fontWeight: 700,
  } as React.CSSProperties,
  statusGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '0 0 auto',
  } as React.CSSProperties,
  statusLabel: {
    color: '#FFFFD6',
    fontSize: '1rem',
    fontWeight: 700,
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  countBox: {
    display: 'grid',
    placeItems: 'center',
    minWidth: '88px',
    padding: '14px 18px',
    borderRadius: '18px',
    background: 'var(--color-cream)',
    border: '2px solid var(--color-deep-red)',
    color: 'var(--color-deep-red)',
    fontSize: '1.8rem',
    fontWeight: 800,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.75)',
  } as React.CSSProperties,
};

export interface StaffHeaderProps {
  logoSrc: string;
  brandTitle: string;
  brandSubtitle: string;
  pageTitle: string;
  activeOrderCount: number;
}

export function StaffHeader({
  logoSrc,
  brandTitle,
  brandSubtitle,
  pageTitle,
  activeOrderCount,
}: StaffHeaderProps) {
  return (
    <header style={styles.header}>
      <div style={styles.brandGroup}>
        <img style={styles.logoImage} src={logoSrc} alt="Blaine Wings logo" />
        <div style={styles.brandStack}>
          <h1 style={styles.brandTitle}>{brandTitle}</h1>
          <p style={styles.brandSubtitle}>{brandSubtitle}</p>
        </div>
        <div style={styles.divider} aria-hidden="true" />
        <h2 style={styles.pageTitle}>{pageTitle}</h2>
      </div>

      <div style={styles.statusGroup}>
        <span style={styles.statusLabel}>Total Active Orders:</span>
        <div style={styles.countBox} aria-label={`Active order count ${activeOrderCount}`}>
          {activeOrderCount}
        </div>
      </div>
    </header>
  );
}