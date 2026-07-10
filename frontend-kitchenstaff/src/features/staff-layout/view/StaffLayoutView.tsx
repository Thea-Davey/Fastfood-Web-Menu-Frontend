import React from 'react';
import { Outlet } from 'react-router-dom';
import { StaffHeader } from '../../../shared-components/StaffHeader/StaffHeader';
import { useStaffLayoutViewModel } from '../viewmodel/useStaffLayoutViewModel';

const styles = {
  pageShell: {
    width: '100%',
    minHeight: '100vh',
    background: 'transparent',
    padding: 0,
    margin: 0,
    overflow: 'hidden',
  } as React.CSSProperties,
  frame: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    minHeight: '100vh',
    borderRadius: 0,
    overflow: 'hidden',
    background: 'transparent',
  } as React.CSSProperties,
  contentArea: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto' as const,
    padding: '0px',
  } as React.CSSProperties,
};

export function StaffLayoutView() {
  const { activeOrderCount, brandSubtitle, brandTitle, logoSrc, pageTitle, outletContext } =
    useStaffLayoutViewModel();

  return (
    <div style={styles.pageShell}>
      <section style={styles.frame} aria-label="Staff main layout">
        <StaffHeader
          logoSrc={logoSrc}
          brandTitle={brandTitle}
          brandSubtitle={brandSubtitle}
          pageTitle={pageTitle}
          activeOrderCount={activeOrderCount}
        />
        <main style={styles.contentArea}>
          <Outlet context={outletContext} />
        </main>
      </section>
    </div>
  );
}