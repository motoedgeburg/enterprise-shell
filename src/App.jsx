import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import AuthInitializer from './components/AuthInitializer/AuthInitializer.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import AppRoutes from './routes/index.jsx';
import { useAppDispatch } from './store';
import { setCredentials } from './store/slices/authSlice';

const IS_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true';

/** Seeds a fake user into the Redux store so the full UI works without Okta. */
const MockAuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setCredentials({
        accessToken: 'mock-token',
        user: { name: 'John Doe', email: 'john.doe@company.com' },
      }),
    );
  }, [dispatch]);

  return children;
};

const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#008cff',
          colorBgLayout: '#f1f5f9',
          colorBgContainer: '#ffffff',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: 14,
          borderRadius: 8,
          borderRadiusLG: 12,
        },
        components: {
          Layout: {
            siderBg: '#0f172a',
            triggerBg: '#1e293b',
          },
          Menu: {
            darkItemBg: '#0f172a',
            darkPopupBg: '#0f172a',
            darkItemSelectedBg: '#008cff',
            darkItemHoverBg: '#1e293b',
          },
        },
      }}
    >
      <ErrorBoundary>
        <BrowserRouter>
          {IS_MOCK_AUTH ? (
            <MockAuthProvider>
              <AppRoutes />
            </MockAuthProvider>
          ) : (
            <AuthInitializer>
              <AppRoutes />
            </AuthInitializer>
          )}
        </BrowserRouter>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default App;
