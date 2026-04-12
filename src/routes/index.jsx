import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout/AppLayout.jsx';
import { ROUTES } from '../constants/routes.js';
import LoginPage from '../pages/LoginPage/LoginPage.jsx';
import OktaCallback from '../pages/OktaCallback/OktaCallback.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';

// Code-split protected pages
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard.jsx'));
const SearchPage = lazy(() => import('../pages/Search/SearchPage.jsx'));
const ResultsPage = lazy(() => import('../pages/Results/ResultsPage.jsx'));
const RecordDetailPage = lazy(() => import('../pages/RecordDetail/RecordDetailPage.jsx'));

const PageLoader = () => (
  <div
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
  >
    <Spin size="large" />
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.LOGIN_CALLBACK} element={<OktaCallback />} />

      {/* Protected routes — nested under AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />
          <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
          <Route path={ROUTES.RECORDS_NEW} element={<RecordDetailPage />} />
          <Route path={ROUTES.RECORD_DETAIL} element={<RecordDetailPage />} />
          {/* Fallback inside protected zone */}
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
