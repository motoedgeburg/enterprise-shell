import { http, HttpResponse } from 'msw';

import { server } from '../../mocks/server';
import { lookupsService } from '../lookupsService';

// MSW server lifecycle is managed by src/setupTests.js

describe('lookupsService.getAll', () => {
  it('returns all lookup categories', async () => {
    const data = await lookupsService.getAll();
    expect(data).toHaveProperty('departments');
    expect(data).toHaveProperty('relationships');
    expect(data).toHaveProperty('statuses');
    expect(data).toHaveProperty('employmentTypes');
    expect(data).toHaveProperty('notificationChannels');
    expect(data).toHaveProperty('accessLevels');
  });

  it('returns {value, label} objects for departments', async () => {
    const data = await lookupsService.getAll();
    expect(data.departments.length).toBeGreaterThan(0);
    expect(data.departments[0]).toHaveProperty('value');
    expect(data.departments[0]).toHaveProperty('label');
  });

  it('returns {value, label} objects for statuses', async () => {
    const data = await lookupsService.getAll();
    expect(data.statuses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'active', label: 'Active' }),
        expect.objectContaining({ value: 'inactive', label: 'Inactive' }),
      ]),
    );
  });

  it('rejects when the server returns a 500', async () => {
    server.use(
      http.get('http://localhost:8080/api/lookups', () =>
        HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
      ),
    );
    await expect(lookupsService.getAll()).rejects.toThrow();
  });
});
