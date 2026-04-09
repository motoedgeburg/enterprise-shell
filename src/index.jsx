import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import App from './App.jsx';
import appMessages from './i18n/messages.js';
import { store } from './store';

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'true') {
    return;
  }
  const { worker } = await import('./mocks/browser.js');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <App />
        </IntlProvider>
      </Provider>
    </StrictMode>,
  );
});
