import React from 'react';

// ==========================================
// SHARED COMPONENT
// Stateless / Pure UI. Accepts props only.
// Styling bound strictly to global CSS variables.
// ==========================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  style,
  disabled,
  ...props
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return 'var(--secondary-color)';
      case 'danger':
        return 'var(--danger-color)';
      case 'primary':
      default:
        return 'var(--primary-color)';
    }
  };

  const getHoverColor = () => {
    switch (variant) {
      case 'secondary':
        return 'var(--secondary-hover)';
      case 'danger':
        return 'var(--danger-hover)';
      case 'primary':
      default:
        return 'var(--primary-hover)';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return 'var(--text-main)';
      case 'danger':
      case 'primary':
      default:
        return 'var(--white)';
    }
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '8px',
    border: variant === 'secondary' ? '1px solid var(--border-color)' : 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    backgroundColor: disabled ? 'var(--text-light)' : getBackgroundColor(),
    color: getTextColor(),
    transition: 'background-color var(--transition-fast), transform var(--transition-fast)',
    opacity: disabled || isLoading ? 0.7 : 1,
    width: '100%',
    ...style,
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.backgroundColor = getHoverColor();
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.backgroundColor = getBackgroundColor();
          e.currentTarget.style.transform = 'none';
        }
      }}
      {...props}
    >
      {isLoading ? (
        <span style={{ 
          display: 'inline-block', 
          width: '20px', 
          height: '20px', 
          border: '2px solid rgba(255,255,255,0.3)', 
          borderTop: '2px solid var(--white)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
      ) : (
        <>
          {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
