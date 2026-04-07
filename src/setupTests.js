// ─── Testing Library matchers ──────────────────────────────────────────────
import '@testing-library/jest-dom';

// ─── Web API polyfills for jsdom ───────────────────────────────────────────
// MSW v2 uses the Fetch API / Web Streams internally. jsdom does not expose
// Node's built-in Web API globals, so we restore them here.
// With Vitest, ESM imports are fine — no Babel hoisting issue.
import { performance } from 'perf_hooks';
import { ReadableStream, TransformStream, WritableStream } from 'stream/web';
import { TextEncoder, TextDecoder } from 'util';
import { BroadcastChannel } from 'worker_threads';

// NOTE: Do NOT polyfill Blob here. jsdom ships its own Blob implementation
// and jsdom's FileReader.readAsArrayBuffer expects that native jsdom Blob type.
Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
  ReadableStream,
  TransformStream,
  WritableStream,
  performance,
  BroadcastChannel,
});

// ─── Axios adapter ─────────────────────────────────────────────────────────
// Force Axios to use the fetch adapter so MSW's Node server intercepts all
// test requests (MSW intercepts fetch/http, not jsdom's XHR).
import axios from 'axios';

axios.defaults.adapter = 'fetch';

// ─── MSW lifecycle ──────────────────────────────────────────────────────────
import { server } from './mocks/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// ─── Browser API stubs ──────────────────────────────────────────────────────
// jsdom doesn't implement window.matchMedia; Ant Design requires it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// Suppress Ant Design's ResizeObserver usage in jsdom.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// crypto.randomUUID used in axiosInstance 401 handler.
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: () => 'test-uuid-1234' },
});
