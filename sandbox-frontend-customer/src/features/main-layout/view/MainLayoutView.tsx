// View Layer: MainLayoutView.tsx
// Pure UI render. Consumes properties from useMainLayoutViewModel. Renders HeaderBar, Outlet content, and BottomNavigation.

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useMainLayoutViewModel } from '../viewmodel/useMainLayoutViewModel';
import { BottomNavigation } from '../../../shared-components/BottomNavigation/BottomNavigation';
import { HeaderBar } from '../../../shared-components/HeaderBar/HeaderBar';

export const MainLayoutView: React.FC = () => {
  const { tabs, activeTabId, handleTabChange } = useMainLayoutViewModel();

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

      {/* Scrollable content area with offset bounds */}
      <main style={{
        flex: 1,
        paddingTop: '72px',  // Offset height of the top HeaderBar
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
