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
  onOpenHistory?: () => void;
}

export function StaffHeader({
  logoSrc,
  brandTitle,
  brandSubtitle,
  pageTitle,
  activeOrderCount,
  onOpenHistory,
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
        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 214, 0.4)',
              borderRadius: '12px',
              padding: '10px 16px',
              color: '#FFFFD6',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginRight: '12px',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 214, 0.8)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 214, 0.4)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l4 2" />
            </svg>
            HISTORY
          </button>
        )}
        <span style={styles.statusLabel}>Total Active Orders:</span>
        <div style={styles.countBox} aria-label={`Active order count ${activeOrderCount}`}>
          {activeOrderCount}
        </div>
      </div>
    </header>
  );
}