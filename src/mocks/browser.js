import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

/**
 * MSW Service Worker — used in development mode when REACT_APP_ENABLE_MOCKS=true.
 * The worker intercepts fetch requests in the browser via a Service Worker.
 *
 * Setup: run `npx msw init public/ --save` after npm install to copy the
 * service worker file into /public.
 */
export const worker = setupWorker(...handlers);
