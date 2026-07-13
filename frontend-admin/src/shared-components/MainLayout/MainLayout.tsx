import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Clock, ClipboardCheck, ClipboardX, User, ChevronDown, LogOut, QrCode } from 'lucide-react';
import logoImg from '../../assets/images/logo.png';

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

  const navGroups = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Home', path: '/admin/home', icon: Home },
      ]
    },
    {
      title: 'ORDER MANAGEMENT',
      items: [
        { name: 'All Orders', path: '/admin/orders/all', icon: ClipboardList },
        { name: 'Pending Order', path: '/admin/orders/pending', icon: Clock },
        { name: 'Complete Order', path: '/admin/orders/complete', icon: ClipboardCheck },
        { name: 'Cancel Order', path: '/admin/orders/cancel', icon: ClipboardX },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Tables & QR', path: '/admin/tables', icon: QrCode },
      ]
    }
  ];

  const handleLogout = () => {
    // Navigate to login on logout
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'transparent' }}>
      {/* Sidebar Panel */}
      <aside className="sidebar-texture" style={{
        width: '280px',
        backgroundColor: 'var(--primary-color)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100
      }}>
        {/* Content Container (z-index 1 to sit above texture) */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '24px 16px',
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
              <img
                src={logoImg}
                alt="Blaine Wings Logo"
                style={{
                  width: '28px',
                  height: '28px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>Blaine Wings</h1>
              <p style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>- Unlimited Wings -</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, padding: '0 8px' }}>
            {navGroups.map((group) => (
              <div key={group.title}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '8px',
                  letterSpacing: '1px',
                  paddingLeft: '16px'
                }}>
                  {group.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {group.items.map((item) => {
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
                          padding: '10px 16px',
                          borderRadius: '8px',
                          color: isActive ? 'var(--primary-color)' : '#ffffff',
                          backgroundColor: isActive ? 'var(--secondary-color)' : 'transparent',
                          fontWeight: isActive ? '600' : '400',
                          transition: 'all var(--transition-fast)',
                          textDecoration: 'none',
                        }}
                      >
                        <Icon size={18} />
                        <span style={{ fontSize: '14px' }}>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile Snapshot */}
          <div style={{ position: 'relative', marginTop: 'auto' }}>
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
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <main style={{ flex: 1, padding: '40px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
