import React from 'react';
import { useLoginViewModel } from '../viewmodel/useLoginViewModel';
import logoSrc from '../../../assets/blaine-logo.png';

const styles = {
  container: {
    display: 'grid',
    placeItems: 'center',
    width: '100vw',
    height: '100vh',
    background: 'var(--color-background)',
    margin: 0,
    padding: '24px',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--color-surface)',
    borderRadius: '24px',
    boxShadow: 'var(--shadow-soft)',
    padding: '40px',
    border: '1px solid rgba(47, 47, 47, 0.05)',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    marginBottom: '32px',
  } as React.CSSProperties,
  logo: {
    width: '80px',
    height: 'auto',
    objectFit: 'contain' as const,
    marginBottom: '16px',
  } as React.CSSProperties,
  title: {
    fontSize: '2rem',
    color: 'var(--color-deep-red)',
    margin: 0,
    fontWeight: 800,
  } as React.CSSProperties,
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--color-muted)',
    margin: '4px 0 0',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  } as React.CSSProperties,
  error: {
    background: 'rgba(159, 35, 5, 0.08)',
    border: '1px solid rgba(159, 35, 5, 0.2)',
    color: 'var(--color-deep-red)',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: 600,
  } as React.CSSProperties,
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,
  label: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  input: {
    width: '100%',
    border: '1px solid rgba(47, 47, 47, 0.15)',
    borderRadius: '12px',
    padding: '12px 16px',
    background: '#ffffff',
    color: 'var(--color-text)',
    fontSize: '0.95rem',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  passwordWrapper: {
    position: 'relative' as const,
    width: '100%',
  } as React.CSSProperties,
  showButton: {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--color-muted)',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    padding: '4px 8px',
  } as React.CSSProperties,
  submitButton: {
    background: 'var(--color-deep-red)',
    color: 'var(--color-cream)',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
  } as React.CSSProperties,
};

export function LoginView() {
  const {
    credentials,
    setCredentials,
    showPassword,
    setShowPassword,
    isLoading,
    errorMsg,
    handleLogin,
  } = useLoginViewModel();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img src={logoSrc} style={styles.logo} alt="Blaine Wings Logo" />
          <h1 style={styles.title}>Blaine Wings</h1>
          <p style={styles.subtitle}>Kitchen Staff Platform</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          {errorMsg && <div style={styles.error}>{errorMsg}</div>}

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              style={styles.input}
              value={credentials.email || ''}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="staff@blainewings.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={{ ...styles.input, paddingRight: '60px' }}
                value={credentials.password || ''}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                style={styles.showButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
