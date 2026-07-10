import React from 'react';
import { useLoginViewModel } from '../viewmodel/useLoginViewModel';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import wingsImg from '../../../assets/chicken_wings.png';
import logoImg from '../../../assets/images/logo.png';

export const LoginView: React.FC = () => {
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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Left Branding Panel */}
      <div style={{
        flex: 1.2,
        backgroundColor: 'var(--primary-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        padding: '40px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={logoImg}
              alt="Blaine Wings Logo"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain'
              }}
            />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>Blaine Wings</h1>
            <p style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>- Unlimited Wings -</p>
          </div>
        </div>
        
        {/* Render wings image */}
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={wingsImg} 
            alt="Unlimited Wings & Fries" 
            style={{ maxWidth: '80%', height: 'auto', borderRadius: '16px', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.35))' }}
          />
        </div>
      </div>

      {/* Right Login Panel */}
      <div style={{
        flex: 1,
        backgroundColor: '#fefdf8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <form 
          onSubmit={handleLogin}
          style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: '#ffffff',
            padding: '40px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <p style={{ fontSize: '18px', color: '#554440', fontFamily: 'Georgia, serif', margin: '0 0 8px 0' }}>Welcome Back!</p>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Blaine Wings</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>Please sign in to access your admin dashboard</p>
          </div>

          {errorMsg && (
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-color)',
              border: '1px solid var(--danger-color)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Email</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="Enter your email address"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 48px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button 
              type="button"
              style={{
                alignSelf: 'flex-end',
                fontSize: '13px',
                color: 'var(--text-muted)',
                marginTop: '4px',
                background: 'none',
                border: 'none',
                textDecoration: 'none'
              }}
            >
              Forget Password?
            </button>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              padding: '14px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color var(--transition-fast)',
              marginTop: '12px'
            }}
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn size={20} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
