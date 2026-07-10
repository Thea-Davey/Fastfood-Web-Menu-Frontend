import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayoutView } from '../features/main-layout/view/MainLayoutView';

// Lazy loading feature components
const HomeView = lazy(() => import('../features/home/view/HomeView'));
const MenuView = lazy(() => import('../features/menu/view/MenuView'));
const MyOrderView = lazy(() => import('../features/my-order/view/MyOrderView'));
const AddOrderView = lazy(() => import('../features/add-order/view/AddOrderView'));

const Fallback = (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'sans-serif',
    color: 'var(--text-muted)'
  }}>
    Loading...
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={Fallback}>
      <Routes>
        {/* Main Shell (Header + Bottom Nav) */}
        <Route path="/" element={<MainLayoutView />}>
          <Route index element={<Suspense fallback={Fallback}><HomeView /></Suspense>} />
          <Route path="home" element={<Suspense fallback={Fallback}><HomeView /></Suspense>} />
          <Route path="menu" element={<Suspense fallback={Fallback}><MenuView /></Suspense>} />
          <Route path="menu/:tableNumber" element={<Suspense fallback={Fallback}><MenuView /></Suspense>} />
          <Route path="my-order" element={<Suspense fallback={Fallback}><MyOrderView /></Suspense>} />
        </Route>

        {/* Independent Pages (No Header / No Nav) */}
        <Route path="/add-order/:id" element={<Suspense fallback={Fallback}><AddOrderView /></Suspense>} />
      </Routes>

    </Suspense>
  );
};
