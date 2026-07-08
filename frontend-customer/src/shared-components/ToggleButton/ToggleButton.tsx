import React from 'react';

interface ToggleButtonProps {
  label: string;
  subLabel?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ label, subLabel, selected, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled && !selected}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 8px',
        border: selected ? '1px solid var(--secondary-hover)' : '1px solid var(--border-color)',
        borderRadius: '8px',
        backgroundColor: selected ? 'var(--secondary-color)' : 'var(--bg-app)',
        color: 'var(--text-main)',
        cursor: (disabled && !selected) ? 'not-allowed' : 'pointer',
        opacity: (disabled && !selected) ? 0.5 : 1,
        transition: 'all var(--transition-fast)',
        minHeight: '60px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 500, textAlign: 'center' }}>{label}</span>
      {subLabel && <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{subLabel}</span>}
    </button>
  );
};
