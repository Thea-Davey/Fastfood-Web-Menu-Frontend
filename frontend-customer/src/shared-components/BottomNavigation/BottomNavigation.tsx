// Shared Component: BottomNavigation.tsx
// Pure, reusable UI navigation component. Accepts props only, with zero direct router or state dependencies.

import React from 'react';

export interface NavigationTab {
  id: string;
  label: string;
  icon: string;
}

interface BottomNavigationProps {
  tabs: NavigationTab[];
  activeTabId: string;
  onTabSelect: (id: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
}) => {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: 'var(--white)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      zIndex: 1000
    }}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onTabSelect(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
              padding: '6px 0',
              flex: 1,
              transition: 'color 0.2s ease, transform 0.1s ease',
              outline: 'none',
            }}
          >
            <span className="material-icons" style={{ fontSize: '24px', marginBottom: '2px' }}>
              {tab.icon}
            </span>
            <span style={{ fontSize: '12px', fontWeight: isActive ? '600' : '400' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
