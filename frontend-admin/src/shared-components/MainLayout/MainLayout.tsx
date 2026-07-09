import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Clock, ClipboardCheck, ClipboardX, User, ChevronDown, LogOut } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const navItems = [
    { name: 'Home', path: '/admin/home', icon: Home },
    { name: 'All Orders', path: '/admin/orders/all', icon: ClipboardList },
    { name: 'Pending Order', path: '/admin/orders/pending', icon: Clock },
    { name: 'Complete Order', path: '/admin/orders/complete', icon: ClipboardCheck },
    { name: 'Cancel Order', path: '/admin/orders/cancel', icon: ClipboardX },
  ];

  const handleLogout = () => {
    // Navigate to login on logout
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-app)' }}>
      {/* Sidebar Panel */}
      <aside style={{
        width: '280px',
        backgroundColor: 'var(--primary-color)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100
      }}>
        {/* Logo & Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* SVG Chicken Wing Logo */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}>
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.38.13.78-.16.78-.57V18.5c0-.83.67-1.5 1.5-1.5h1.5c.83 0 1.5-.67 1.5-1.5v-1.5c0-.83.67-1.5 1.5-1.5h1.5c.83 0 1.5-.67 1.5-1.5V9.43c0-.4-.4-.7-.78-.57C17.17 10.13 14.42 12 12 12A10 10 0 0 0 12 2Z" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>Blaine Wings</h1>
            <p style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>- Unlimited Wings -</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: isActive ? 'var(--primary-color)' : '#ffffff',
                  backgroundColor: isActive ? 'var(--secondary-color)' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none',
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: '15px' }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Snapshot */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                color: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Admin User</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>Administrator</div>
              </div>
            </div>
            <ChevronDown size={16} />
          </div>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
              marginBottom: '8px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)'
            }}>
              <button 
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  color: 'var(--danger-color)',
                  fontSize: '14px',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: '40px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
