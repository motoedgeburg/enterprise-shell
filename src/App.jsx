import { ConfigProvider, theme } from 'antd';
import { BrowserRouter } from 'react-router-dom';

import AuthInitializer from './components/AuthInitializer.jsx';
import AppRoutes from './routes/index.jsx';

const IS_MOCK_MODE = import.meta.env.VITE_ENABLE_MOCKS === 'true';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1d4ed8',
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
            darkItemSelectedBg: '#1d4ed8',
            darkItemHoverBg: '#1e293b',
          },
        },
      }}
    >
      <BrowserRouter>
        {IS_MOCK_MODE ? (
          <AppRoutes />
        ) : (
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
        )}
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
