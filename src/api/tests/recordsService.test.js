import { http, HttpResponse } from 'msw';

import { recordsService } from '../recordsService';
import { db } from '../../mocks/data';
import { server } from '../../mocks/server';

// MSW server lifecycle is managed by src/setupTests.js

beforeEach(() => {
  db.reset();
});

// ─── getAll ───────────────────────────────────────────────────────────────────

describe('recordsService.getAll', () => {
  it('returns the first page of records', async () => {
    const result = await recordsService.getAll(0, 5);
    expect(result.content).toHaveLength(5);
    expect(result.totalElements).toBe(8);
    expect(result.number).toBe(0);
    expect(result.size).toBe(5);
  });

  it('returns the second page', async () => {
    const result = await recordsService.getAll(1, 5);
    expect(result.content).toHaveLength(3);
    expect(result.number).toBe(1);
  });

  it('defaults to page 0 size 10', async () => {
    const result = await recordsService.getAll();
    expect(result.number).toBe(0);
    expect(result.size).toBe(10);
    expect(result.content).toHaveLength(8);
  });

  it('totalPages is calculated correctly', async () => {
    const result = await recordsService.getAll(0, 3);
    expect(result.totalPages).toBe(3); // ceil(8/3)
  });

  it('returns empty content for a page beyond the last', async () => {
    const result = await recordsService.getAll(10, 10);
    expect(result.content).toHaveLength(0);
  });

  it('returns correct record fields', async () => {
    const result = await recordsService.getAll(0, 1);
    const first = result.content[0];
    expect(first).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      department: expect.any(String),
      status: expect.stringMatching(/^(active|inactive)$/),
      createdAt: expect.any(String),
    });
  });
});

// ─── getById ─────────────────────────────────────────────────────────────────

describe('recordsService.getById', () => {
  it('returns the record matching the given id', async () => {
    const record = await recordsService.getById(1);
    expect(record.id).toBe(1);
    expect(record.name).toBe('Alice Johnson');
  });

  it('returns all expected fields', async () => {
    const record = await recordsService.getById(2);
    expect(record).toMatchObject({
      id: 2,
      name: 'Bob Martinez',
      email: 'bob.martinez@company.com',
      department: 'Product',
      status: 'active',
    });
  });

  it('throws (404) for a non-existent id', async () => {
    await expect(recordsService.getById(9999)).rejects.toThrow();
  });
});

// ─── create ──────────────────────────────────────────────────────────────────

describe('recordsService.create', () => {
  const newRecord = {
    name: 'Test User',
    email: 'test@company.com',
    department: 'Engineering',
    status: 'active',
  };

  it('returns the created record with a server-assigned id', async () => {
    const created = await recordsService.create(newRecord);
    expect(created.id).toBeDefined();
    expect(typeof created.id).toBe('number');
  });

  it('returns a createdAt timestamp', async () => {
    const created = await recordsService.create(newRecord);
    expect(created.createdAt).toBeDefined();
    expect(() => new Date(created.createdAt)).not.toThrow();
  });

  it('reflects the submitted fields', async () => {
    const created = await recordsService.create(newRecord);
    expect(created).toMatchObject(newRecord);
  });

  it('increments the total count after creation', async () => {
    await recordsService.create(newRecord);
    const list = await recordsService.getAll(0, 100);
    expect(list.totalElements).toBe(9);
  });

  it('throws (400) when name is missing', async () => {
    await expect(
      recordsService.create({ email: 'x@y.com', department: 'HR', status: 'active' }),
    ).rejects.toThrow();
  });

  it('throws (400) when email is missing', async () => {
    await expect(
      recordsService.create({ name: 'No Email', department: 'HR', status: 'active' }),
    ).rejects.toThrow();
  });
});

// ─── update ──────────────────────────────────────────────────────────────────

describe('recordsService.update', () => {
  it('updates a single field and returns the full record', async () => {
    const updated = await recordsService.update(1, { name: 'Alice Updated' });
    expect(updated.name).toBe('Alice Updated');
    expect(updated.id).toBe(1);
  });

  it('leaves unmodified fields intact', async () => {
    const original = await recordsService.getById(1);
    const updated = await recordsService.update(1, { name: 'New Name' });
    expect(updated.email).toBe(original.email);
    expect(updated.department).toBe(original.department);
  });

  it('can update status', async () => {
    const updated = await recordsService.update(3, { status: 'active' });
    expect(updated.status).toBe('active');
  });

  it('throws (404) when updating a non-existent id', async () => {
    await expect(recordsService.update(9999, { name: 'Ghost' })).rejects.toThrow();
  });
});

// ─── remove ──────────────────────────────────────────────────────────────────

describe('recordsService.remove', () => {
  it('resolves without throwing for an existing record', async () => {
    await expect(recordsService.remove(1)).resolves.not.toThrow();
  });

  it('reduces the total count after deletion', async () => {
    await recordsService.remove(1);
    const list = await recordsService.getAll(0, 100);
    expect(list.totalElements).toBe(7);
  });

  it('makes the deleted record unretrievable', async () => {
    await recordsService.remove(1);
    await expect(recordsService.getById(1)).rejects.toThrow();
  });

  it('throws (404) when deleting a non-existent id', async () => {
    await expect(recordsService.remove(9999)).rejects.toThrow();
  });

  it('throws a second time when deleting the same id twice', async () => {
    await recordsService.remove(1);
    await expect(recordsService.remove(1)).rejects.toThrow();
  });
});

// ─── network error ────────────────────────────────────────────────────────────

describe('recordsService — network errors', () => {
  it('rejects when the server returns a 500', async () => {
    server.use(
      http.get('http://localhost:8080/api/records', () =>
        HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
      ),
    );
    await expect(recordsService.getAll()).rejects.toThrow();
  });
});
