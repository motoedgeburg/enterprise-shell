import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import App from './App.jsx';
import componentMessages from './components/messages.js';
import pageMessages from './pages/messages.js';
import recordsMessages from './pages/Records/messages.js';
import { store } from './store';

// Merge all message descriptors into a flat id→defaultMessage map
// that IntlProvider accepts as its `messages` prop.
const buildMessageMap = (...descriptorObjects) => {
  const map = {};
  for (const descriptors of descriptorObjects) {
    for (const descriptor of Object.values(descriptors)) {
      map[descriptor.id] = descriptor.defaultMessage;
    }
  }
  return map;
};

const appMessages = buildMessageMap(componentMessages, pageMessages, recordsMessages);

async function enableMocking() {
  if (process.env.REACT_APP_ENABLE_MOCKS !== 'true') {
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
