import React from 'react';
import { useProfileViewModel } from '../viewmodel/useProfileViewModel';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { profile, isLoading, handleLogout } = useProfileViewModel();

  if (isLoading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading Profile...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>Admin Profile</h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage and verify admin user administration access settings</p>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* User Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(159, 35, 5, 0.1)',
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={40} />
          </div>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
              {profile?.name || 'Administrator'}
            </h3>
            <span className="badge badge-pending" style={{ marginTop: '8px' }}>
              {profile?.role || 'admin'}
            </span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        {/* User Detail Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
            <Mail size={18} style={{ color: 'var(--text-muted)' }} />
            <strong style={{ width: '100px', color: 'var(--text-main)' }}>Email:</strong>
            <span style={{ color: 'var(--text-muted)' }}>{profile?.email}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
            <Shield size={18} style={{ color: 'var(--text-muted)' }} />
            <strong style={{ width: '100px', color: 'var(--text-main)' }}>Role Level:</strong>
            <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{profile?.role} Access Privileges</span>
          </div>

          {profile?.created_at && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
              <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
              <strong style={{ width: '100px', color: 'var(--text-main)' }}>Joined:</strong>
              <span style={{ color: 'var(--text-muted)' }}>{profile?.created_at}</span>
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button 
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: 'var(--danger-color)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-color)'}
          >
            <LogOut size={18} />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
