import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';

import { server } from '../../mocks/server';
import lookupsReducer, { fetchLookups } from '../slices/lookupsSlice';

// MSW server lifecycle is managed by src/setupTests.js

function createStore(preloadedState) {
  return configureStore({
    reducer: { lookups: lookupsReducer },
    preloadedState: preloadedState ? { lookups: preloadedState } : undefined,
  });
}

describe('lookupsSlice — fetchLookups thunk', () => {
  it('transitions from idle → loading → succeeded', async () => {
    const store = createStore();
    expect(store.getState().lookups.status).toBe('idle');

    const promise = store.dispatch(fetchLookups());
    expect(store.getState().lookups.status).toBe('loading');

    await promise;
    expect(store.getState().lookups.status).toBe('succeeded');
  });

  it('populates lookup arrays on success', async () => {
    const store = createStore();
    await store.dispatch(fetchLookups());

    const { departments, statuses, employmentTypes, notificationChannels, accessLevels } =
      store.getState().lookups;
    expect(departments.length).toBeGreaterThan(0);
    expect(statuses.length).toBeGreaterThan(0);
    expect(employmentTypes.length).toBeGreaterThan(0);
    expect(notificationChannels.length).toBeGreaterThan(0);
    expect(accessLevels.length).toBeGreaterThan(0);
  });

  it('sets status to failed and stores error on rejection', async () => {
    server.use(
      http.get('http://localhost:8080/api/lookups', () =>
        HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
      ),
    );

    const store = createStore();
    await store.dispatch(fetchLookups());

    expect(store.getState().lookups.status).toBe('failed');
    expect(store.getState().lookups.error).toBeDefined();
  });

  it('skips fetch when status is already succeeded (condition guard)', async () => {
    const store = createStore();
    await store.dispatch(fetchLookups());
    expect(store.getState().lookups.status).toBe('succeeded');

    // Second dispatch should be a no-op
    const result = await store.dispatch(fetchLookups());
    expect(result.meta.condition).toBe(true);
  });

  it('skips fetch when status is loading', async () => {
    const store = createStore({
      status: 'loading',
      error: null,
      departments: [],
      relationships: [],
      statuses: [],
      employmentTypes: [],
      notificationChannels: [],
      accessLevels: [],
    });

    const result = await store.dispatch(fetchLookups());
    expect(result.meta.condition).toBe(true);
  });

  it('retries fetch when status is failed', async () => {
    const store = createStore({
      status: 'failed',
      error: 'Previous error',
      departments: [],
      relationships: [],
      statuses: [],
      employmentTypes: [],
      notificationChannels: [],
      accessLevels: [],
    });

    await store.dispatch(fetchLookups());
    expect(store.getState().lookups.status).toBe('succeeded');
    expect(store.getState().lookups.error).toBeNull();
  });
});
