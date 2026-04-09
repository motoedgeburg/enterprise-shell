import { http, HttpResponse } from 'msw';

import { db } from '../../mocks/data';
import { server } from '../../mocks/server';
import { recordsService } from '../recordsService';

// MSW server lifecycle is managed by src/setupTests.js

// UUID of Alice Johnson (seed record 1)
const ALICE_UUID = 'b3a1c5d0-7f2e-4a8b-9c6d-1e0f3a5b7d9e';
// UUID of Bob Martinez (seed record 2)
const BOB_UUID = 'e7d4f2a1-3b6c-48e9-a5d0-2f1c7e9b4a3d';
// UUID of Carol White (seed record 3)
const CAROL_UUID = 'a9c3e5f1-2d4b-4a7c-8e6f-0b3d5a7c9e1f';

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

  it('returns records with uuid and nested structure (no internal id)', async () => {
    const result = await recordsService.getAll(0, 1);
    const first = result.content[0];
    expect(first).toMatchObject({
      uuid: expect.any(String),
      personalInfo: { name: expect.any(String), email: expect.any(String) },
      workInfo: {
        department: expect.any(String),
        status: expect.stringMatching(/^(active|inactive)$/),
      },
      createdAt: expect.any(String),
    });
    expect(first.id).toBeUndefined();
  });
});

// ─── getById ─────────────────────────────────────────────────────────────────

describe('recordsService.getById', () => {
  it('returns the record matching the given uuid (flattened)', async () => {
    const record = await recordsService.getById(ALICE_UUID);
    expect(record.uuid).toBe(ALICE_UUID);
    expect(record.name).toBe('Alice Johnson');
  });

  it('returns all expected flat fields', async () => {
    const record = await recordsService.getById(BOB_UUID);
    expect(record).toMatchObject({
      uuid: BOB_UUID,
      name: 'Bob Martinez',
      email: 'bob.martinez@company.com',
      department: 'Product',
      status: 'active',
    });
  });

  it('throws (404) for a non-existent uuid', async () => {
    await expect(recordsService.getById('non-existent-uuid')).rejects.toThrow();
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

  it('returns the created record with a server-assigned uuid (flattened)', async () => {
    const created = await recordsService.create(newRecord);
    expect(created.uuid).toBeDefined();
    expect(typeof created.uuid).toBe('string');
    expect(created.id).toBeUndefined();
  });

  it('returns a createdAt timestamp', async () => {
    const created = await recordsService.create(newRecord);
    expect(created.createdAt).toBeDefined();
    expect(() => new Date(created.createdAt)).not.toThrow();
  });

  it('reflects the submitted fields in the flattened response', async () => {
    const created = await recordsService.create(newRecord);
    expect(created.name).toBe('Test User');
    expect(created.email).toBe('test@company.com');
    expect(created.department).toBe('Engineering');
    expect(created.status).toBe('active');
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
  it('updates a field and returns the full flattened record', async () => {
    const original = await recordsService.getById(ALICE_UUID);
    const updated = await recordsService.update(ALICE_UUID, { ...original, name: 'Alice Updated' });
    expect(updated.name).toBe('Alice Updated');
    expect(updated.uuid).toBe(ALICE_UUID);
  });

  it('leaves unmodified fields intact', async () => {
    const original = await recordsService.getById(ALICE_UUID);
    const updated = await recordsService.update(ALICE_UUID, { ...original, name: 'New Name' });
    expect(updated.email).toBe(original.email);
    expect(updated.department).toBe(original.department);
  });

  it('can update status', async () => {
    const original = await recordsService.getById(CAROL_UUID);
    const updated = await recordsService.update(CAROL_UUID, { ...original, status: 'active' });
    expect(updated.status).toBe('active');
  });

  it('throws (404) when updating a non-existent uuid', async () => {
    await expect(recordsService.update('non-existent-uuid', { name: 'Ghost' })).rejects.toThrow();
  });
});

// ─── remove ──────────────────────────────────────────────────────────────────

describe('recordsService.remove', () => {
  it('resolves without throwing for an existing record', async () => {
    await expect(recordsService.remove(ALICE_UUID)).resolves.not.toThrow();
  });

  it('reduces the total count after deletion', async () => {
    await recordsService.remove(ALICE_UUID);
    const list = await recordsService.getAll(0, 100);
    expect(list.totalElements).toBe(7);
  });

  it('makes the deleted record unretrievable', async () => {
    await recordsService.remove(ALICE_UUID);
    await expect(recordsService.getById(ALICE_UUID)).rejects.toThrow();
  });

  it('throws (404) when deleting a non-existent uuid', async () => {
    await expect(recordsService.remove('non-existent-uuid')).rejects.toThrow();
  });

  it('throws a second time when deleting the same uuid twice', async () => {
    await recordsService.remove(ALICE_UUID);
    await expect(recordsService.remove(ALICE_UUID)).rejects.toThrow();
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
