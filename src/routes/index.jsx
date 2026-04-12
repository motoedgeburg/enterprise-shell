import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout/AppLayout.jsx';
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/callback" element={<OktaCallback />} />

      {/* Protected routes — nested under AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/records/new" element={<RecordDetailPage />} />
          <Route path="/records/:id" element={<RecordDetailPage />} />
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
