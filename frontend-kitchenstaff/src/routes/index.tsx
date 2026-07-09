import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const LoginView = lazy(() =>
  import('../features/login/view/LoginView').then((module) => ({
    default: module.LoginView,
  })),
);

const StaffLayoutView = lazy(() =>
  import('../features/staff-layout/view/StaffLayoutView').then((module) => ({
    default: module.StaffLayoutView,
  })),
);

const StaffPendingOrdersView = lazy(() =>
  import('../features/staff-pending-orders/view/StaffPendingOrdersView').then((module) => ({
    default: module.StaffPendingOrdersView,
  })),
);

const StaffCompletedOrdersView = lazy(() =>
  import('../features/staff-completed-orders/view/StaffCompletedOrdersView').then((module) => ({
    default: module.StaffCompletedOrdersView,
  })),
);

const StaffOrderQueueView = lazy(() =>
  import('../features/staff-order-queue/view/StaffOrderQueueView').then((module) => ({
    default: module.StaffOrderQueueView,
  })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/staff" element={<StaffLayoutView />}>
          <Route index element={<Navigate to="pending-orders" replace />} />
          <Route path="pending-orders" element={<StaffPendingOrdersView />} />
          <Route path="completed-orders" element={<StaffCompletedOrdersView />} />
          <Route path="order-queue" element={<StaffOrderQueueView />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}