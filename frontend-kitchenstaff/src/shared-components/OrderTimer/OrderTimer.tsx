import React from 'react';

export interface OrderTimerProps {
  /** Raw ISO-8601 string from created_at. Optional — timer is hidden if absent. */
  createdAt?: string;
  /** Current order status — timer only ticks for 'pending' and 'preparing' */
  status: string;
}

/**
 * OrderTimer
 * Displays an elapsed time badge that ticks every second.
 * Turns yellow at ≥10 min and red (pulsing) at ≥15 min, matching the admin frontend behaviour.
 */
export function OrderTimer({ createdAt, status }: OrderTimerProps) {
  const [elapsed, setElapsed] = React.useState<string>('');
  const [isDelayed, setIsDelayed] = React.useState(false);
  const [isVeryDelayed, setIsVeryDelayed] = React.useState(false);

  React.useEffect(() => {
    if (!createdAt || (status !== 'pending' && status !== 'preparing')) {
      setElapsed('');
      return;
    }

    const update = () => {
      const diffMs = Date.now() - new Date(createdAt).getTime();
      if (diffMs < 0) { setElapsed('0s'); return; }

      const totalSecs = Math.floor(diffMs / 1000);
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;

      setIsDelayed(mins >= 10 && mins < 15);
      setIsVeryDelayed(mins >= 15);
      setElapsed(mins > 0 ? `${mins}m ${secs}s` : `${secs}s`);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [createdAt, status]);

  if (!elapsed) return null;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '0.68rem',
    fontWeight: 800,
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
  };

  const colorStyle: React.CSSProperties = isVeryDelayed
    ? { background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' }
    : isDelayed
    ? { background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' }
    : { background: 'rgba(0,0,0,0.07)', color: '#4b4b4b' };

  return (
    <span style={{ ...baseStyle, ...colorStyle }}>
      {/* Clock icon inline SVG — no lucide dependency needed */}
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {elapsed}
    </span>
  );
}
