// View Layer: MainLayoutView.tsx
// Pure UI render. Consumes properties from useMainLayoutViewModel. Renders HeaderBar, Outlet content, and BottomNavigation.

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useMainLayoutViewModel } from '../viewmodel/useMainLayoutViewModel';
import { BottomNavigation } from '../../../shared-components/BottomNavigation/BottomNavigation';
import { HeaderBar } from '../../../shared-components/HeaderBar/HeaderBar';
import { useSession } from '../../../context/SessionContext';

export const MainLayoutView: React.FC = () => {
  const { tabs, activeTabId, handleTabChange } = useMainLayoutViewModel();
  const { participantCount } = useSession();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-app)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* Fixed top brand header */}
      <HeaderBar />

      {/* Barkada Cart Session Users Indicator Bar */}
      <div style={{
        position: 'fixed',
        top: '72px',
        left: 0,
        right: 0,
        height: '42px',
        backgroundColor: '#FEFCE8',
        borderBottom: '1.5px solid var(--primary-color)', // Added primary color stroke
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1009,
        boxSizing: 'border-box'
      }}>
        <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-main)' }}>
          Numbers of users in session
        </span>
        <div style={{
          border: '1.5px solid var(--primary-color)',
          borderRadius: '20px',
          padding: '2px 14px',
          backgroundColor: 'var(--white)',
          color: 'var(--primary-color)',
          fontWeight: 700,
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '32px',
          boxSizing: 'border-box'
        }}>
          {participantCount}
        </div>
      </div>

      {/* Scrollable content area with offset bounds */}
      <main style={{
        flex: 1,
        paddingTop: '114px',  // Offset height of the top HeaderBar (72px) + Indicator Bar (42px)
        paddingBottom: '80px', // Clearance offset for BottomBar
        overflowY: 'auto'
      }}>
        <Outlet />
      </main>

      {/* Fixed bottom navigation */}
      <BottomNavigation
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={(id) => {
          const matchedTab = tabs.find(t => t.id === id);
          if (matchedTab) {
            handleTabChange(matchedTab);
          }
        }}
      />
    </div>
  );
};

export default MainLayoutView;
