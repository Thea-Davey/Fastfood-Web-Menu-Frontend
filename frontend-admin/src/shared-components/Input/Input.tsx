import React from 'react';

// ==========================================
// SHARED COMPONENT
// Stateless / Pure UI. Accepts props only.
// Styling bound strictly to global CSS variables.
// ==========================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightElement,
  style,
  ...props
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-dark-slate)',
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    paddingLeft: icon ? '44px' : '16px',
    paddingRight: rightElement ? '44px' : '16px',
    fontSize: '15px',
    borderRadius: '8px',
    border: error ? '1.5px solid var(--danger-color)' : '1px solid var(--border-color)',
    outline: 'none',
    backgroundColor: 'var(--white)',
    color: 'var(--text-main)',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    ...style,
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  };

  const rightElementStyle: React.CSSProperties = {
    position: 'absolute',
    right: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-muted)',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--danger-color)',
    marginTop: '2px',
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        <input
          style={inputStyle}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(159, 35, 5, 0.1)';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          {...props}
        />
        {rightElement && <span style={rightElementStyle}>{rightElement}</span>}
      </div>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};
