import { ConfigProvider, theme } from 'antd';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes/index.jsx';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary:      '#1d4ed8',
          colorBgLayout:     '#f1f5f9',
          colorBgContainer:  '#ffffff',
          fontFamily:        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize:          14,
          borderRadius:      8,
          borderRadiusLG:    12,
        },
        components: {
          Layout: {
            siderBg:    '#0f172a',
            triggerBg:  '#1e293b',
          },
          Menu: {
            darkItemBg:         '#0f172a',
            darkPopupBg:        '#0f172a',
            darkItemSelectedBg: '#1d4ed8',
            darkItemHoverBg:    '#1e293b',
          },
        },
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
