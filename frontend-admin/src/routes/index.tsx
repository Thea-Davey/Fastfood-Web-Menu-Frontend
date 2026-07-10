import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from '../shared-components/MainLayout/MainLayout';

const LoginView = lazy(() => import('../features/login/view/LoginView'));
const HomeView = lazy(() => import('../features/home/view/HomeView'));
const OrdersAllView = lazy(() => import('../features/orders-all/view/OrdersAllView'));
const OrdersPendingView = lazy(() => import('../features/orders-pending/view/OrdersPendingView'));
const OrdersCompleteView = lazy(() => import('../features/orders-complete/view/OrdersCompleteView'));
const OrdersCancelView = lazy(() => import('../features/orders-cancel/view/OrdersCancelView'));
const ProfileView = lazy(() => import('../features/profile/view/ProfileView'));
const TablesView = lazy(() => import('../features/tables/view/TablesView'));

const Fallback = (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'sans-serif',
    color: 'var(--text-muted)'
  }}>
    Loading Dashboard...
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={Fallback}>
      <Routes>
        <Route path="/login" element={<Suspense fallback={Fallback}><LoginView /></Suspense>} />
        
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Suspense fallback={Fallback}><HomeView /></Suspense>} />
          <Route path="orders/all" element={<Suspense fallback={Fallback}><OrdersAllView /></Suspense>} />
          <Route path="orders/pending" element={<Suspense fallback={Fallback}><OrdersPendingView /></Suspense>} />
          <Route path="orders/complete" element={<Suspense fallback={Fallback}><OrdersCompleteView /></Suspense>} />
          <Route path="orders/cancel" element={<Suspense fallback={Fallback}><OrdersCancelView /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={Fallback}><ProfileView /></Suspense>} />
          <Route path="tables" element={<Suspense fallback={Fallback}><TablesView /></Suspense>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};
