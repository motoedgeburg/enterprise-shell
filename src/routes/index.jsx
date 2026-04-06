import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import OktaCallback from '../pages/OktaCallback.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';

// Code-split protected pages
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const RecordsPage = lazy(() => import('../pages/Records/RecordsPage.jsx'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
    <Spin size="large" />
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/callback" element={<OktaCallback />} />

      {/* Protected routes — nested under AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<RecordsPage />} />
          {/* Fallback inside protected zone */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
