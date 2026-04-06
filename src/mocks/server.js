import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * MSW Node server — used in Jest tests.
 * Import and use in test setup files to intercept HTTP requests made by Axios.
 */
export const server = setupServer(...handlers);
