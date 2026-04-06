/**
 * Node polyfills for the jsdom test environment.
 *
 * MSW v2 uses the Fetch API internally (via @mswjs/interceptors) which
 * requires TextEncoder / TextDecoder — globals present in Node 11+ but not
 * automatically exposed in jsdom.  Importing them from 'util' and assigning
 * to globalThis resolves the "TextEncoder is not defined" error that would
 * otherwise crash every test suite that transitively imports msw/node.
 *
 * This file is listed under jest.setupFiles in package.json so it runs
 * before setupFilesAfterFramework (setupTests.js) and before any test module
 * evaluation.
 */
const { TextEncoder, TextDecoder } = require('util');

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
