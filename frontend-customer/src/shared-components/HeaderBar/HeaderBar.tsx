// Shared Component: HeaderBar.tsx
// Pure presentation component for the persistent top application header.
// Contains the stylized brand logo and name, styled to match the wireframe image.

import React from 'react';

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
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main wing/chicken profile loop */}
          <path
            d="M35 30C25 35 20 48 24 60C28 72 40 80 55 78C70 76 78 62 74 50C70 38 58 24 45 22C42 21.5 38 22 35 24C32 26 33 29 36 28C45 26 55 30 62 38C69 46 70 56 65 64C60 72 50 76 40 72C30 68 26 56 30 46C32 41 36 37 41 35"
            stroke="var(--white)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner drumstick/bone detail */}
          <path
            d="M48 42C44 45 42 50 44 55C46 60 52 64 58 62"
            stroke="var(--white)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Feather/winglet back arches */}
          <path
            d="M26 44C20 45 16 50 18 55C20 60 25 59 28 56"
            stroke="var(--white)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

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
