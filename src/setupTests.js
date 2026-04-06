// ─── Web API polyfills for jsdom ─────────────────────────────────────────────
// MSW v2 uses the Fetch API / Web Streams internally.  jsdom (the Jest
// environment) does not expose Node's built-in Web API globals, so we restore
// them from Node's own modules before any MSW code is evaluated.
//
// Babel hoists `import` declarations above all other statements, so these must
// be `require` calls (not imports) to run before the `require('./mocks/server')`
// below, which transitively loads msw/node.
const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream, TransformStream, WritableStream } = require('stream/web');
const { performance } = require('perf_hooks');
const { BroadcastChannel } = require('worker_threads');

// NOTE: Do NOT polyfill Blob here.  jsdom ships its own Blob implementation
// and jsdom's FileReader.readAsArrayBuffer expects that native jsdom Blob type.
// Replacing globalThis.Blob with Node's Blob breaks the MSW XHR interceptor
// (via whatwg-fetch) when it tries to read response bodies.

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
  ReadableStream,
  TransformStream,
  WritableStream,
  performance,
  BroadcastChannel,
});

// ─── Testing Library matchers ─────────────────────────────────────────────────
// This import IS hoisted by Babel — that is fine because jest-dom has no
// dependency on TextEncoder.
import '@testing-library/jest-dom';

// ─── Axios adapter ───────────────────────────────────────────────────────────
// In CRA's jsdom environment Axios defaults to the XHR adapter (window.XMLHttpRequest).
// MSW's setupServer intercepts Node's http module, not jsdom's XHR, so we
// force Axios to use the http (Node) adapter so all test requests go through MSW.
const axios = require('axios');
axios.defaults.adapter = 'fetch';

// ─── MSW lifecycle ────────────────────────────────────────────────────────────
// Use require (not import) so this executes AFTER the polyfill above.
// Start the mock server before all tests, reset handlers between tests, and
// close it after all tests have run.
const { server } = require('./mocks/server');

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// ─── Browser API stubs ───────────────────────────────────────────────────────
// jsdom doesn't implement window.matchMedia; Ant Design requires it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Suppress Ant Design's ResizeObserver usage in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// crypto.randomUUID used in axiosInstance 401 handler
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: () => 'test-uuid-1234' },
});
