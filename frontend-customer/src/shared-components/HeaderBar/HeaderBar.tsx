// Shared Component: HeaderBar.tsx
// Pure presentation component for the persistent top application header.
// Contains the stylized brand logo and name, styled to match the wireframe image.

import React from 'react';
import logoImg from '../../images/logo.png';

export const HeaderBar: React.FC = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      backgroundColor: 'var(--primary-color)', // Matches the light grey wireframe background
      borderBottom: '1px solid var(--header-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1010,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        {/* BRAND LOGO */}
        <img
          src={logoImg}
          alt="Blaine Wings Logo"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'contain'
          }}
        />

        {/* Brand Text Stack */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <span style={{
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--white)',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
          }}>
            Blaine Wings
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            color: 'var(--secondary-color)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>
            - Unlimited Wings -
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
