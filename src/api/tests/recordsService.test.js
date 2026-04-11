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

// ─── search ──────────────────────────────────────────────────────────────────

describe('recordsService.search', () => {
  it('returns all records as flat summaries when no filters', async () => {
    const result = await recordsService.search();
    expect(result).toHaveLength(9);
    expect(result[0]).toMatchObject({
      uuid: expect.any(String),
      name: expect.any(String),
      department: expect.any(String),
      status: expect.stringMatching(/^(active|inactive|on-leave|suspended|terminated)$/),
    });
    expect(result[0].id).toBeUndefined();
    expect(result[0].personalInfo).toBeUndefined();
  });

  it('filters by name', async () => {
    const result = await recordsService.search({ name: 'Alice' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Johnson');
  });

  it('filters by department', async () => {
    const result = await recordsService.search({ department: 'Engineering' });
    expect(result.every((r) => r.department === 'Engineering')).toBe(true);
  });

  it('returns empty array when no matches', async () => {
    const result = await recordsService.search({ name: 'ZZZNONEXISTENT' });
    expect(result).toHaveLength(0);
  });
});

// ─── getById ─────────────────────────────────────────────────────────────────

describe('recordsService.getById', () => {
  it('returns the record matching the given uuid (nested)', async () => {
    const record = await recordsService.getById(ALICE_UUID);
    expect(record.uuid).toBe(ALICE_UUID);
    expect(record.personalInfo.name).toBe('Alice Johnson');
  });

  it('returns all expected nested fields', async () => {
    const record = await recordsService.getById(BOB_UUID);
    expect(record).toMatchObject({
      uuid: BOB_UUID,
      personalInfo: { name: 'Bob Martinez', email: 'bob.martinez@company.com' },
      workInfo: { department: 'Product', status: 'active' },
    });
  });

  it('throws (404) for a non-existent uuid', async () => {
    await expect(recordsService.getById('non-existent-uuid')).rejects.toThrow();
  });
});

// ─── create ──────────────────────────────────────────────────────────────────

describe('recordsService.create', () => {
  const newRecord = {
    personalInfo: { name: 'Test User', email: 'test@company.com' },
    workInfo: { department: 'Engineering', status: 'active' },
  };

  it('returns the created record with a server-assigned uuid (nested)', async () => {
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

  it('reflects the submitted fields in the nested response', async () => {
    const created = await recordsService.create(newRecord);
    expect(created.personalInfo.name).toBe('Test User');
    expect(created.personalInfo.email).toBe('test@company.com');
    expect(created.workInfo.department).toBe('Engineering');
    expect(created.workInfo.status).toBe('active');
  });

  it('increments the total count after creation', async () => {
    await recordsService.create(newRecord);
    const list = await recordsService.search();
    expect(list).toHaveLength(10);
  });

  it('throws (400) when name is missing', async () => {
    await expect(
      recordsService.create({
        personalInfo: { email: 'x@y.com' },
        workInfo: { department: 'Human Resources', status: 'active' },
      }),
    ).rejects.toThrow();
  });

  it('throws (400) when email is missing', async () => {
    await expect(
      recordsService.create({
        personalInfo: { name: 'No Email' },
        workInfo: { department: 'Human Resources', status: 'active' },
      }),
    ).rejects.toThrow();
  });
});

// ─── update ──────────────────────────────────────────────────────────────────

describe('recordsService.update', () => {
  it('updates a field and returns the full nested record', async () => {
    const original = await recordsService.getById(ALICE_UUID);
    const updated = await recordsService.update(ALICE_UUID, {
      ...original,
      personalInfo: { ...original.personalInfo, name: 'Alice Updated' },
    });
    expect(updated.personalInfo.name).toBe('Alice Updated');
    expect(updated.uuid).toBe(ALICE_UUID);
  });

  it('leaves unmodified fields intact', async () => {
    const original = await recordsService.getById(ALICE_UUID);
    const updated = await recordsService.update(ALICE_UUID, {
      ...original,
      personalInfo: { ...original.personalInfo, name: 'New Name' },
    });
    expect(updated.personalInfo.email).toBe(original.personalInfo.email);
    expect(updated.workInfo.department).toBe(original.workInfo.department);
  });

  it('can update status', async () => {
    const original = await recordsService.getById(CAROL_UUID);
    const updated = await recordsService.update(CAROL_UUID, {
      ...original,
      workInfo: { ...original.workInfo, status: 'active' },
    });
    expect(updated.workInfo.status).toBe('active');
  });

  it('throws (404) when updating a non-existent uuid', async () => {
    await expect(
      recordsService.update('non-existent-uuid', { personalInfo: { name: 'Ghost' } }),
    ).rejects.toThrow();
  });
});

// ─── remove ──────────────────────────────────────────────────────────────────

describe('recordsService.remove', () => {
  it('resolves without throwing for an existing record', async () => {
    await expect(recordsService.remove(ALICE_UUID)).resolves.not.toThrow();
  });

  it('reduces the total count after deletion', async () => {
    await recordsService.remove(ALICE_UUID);
    const list = await recordsService.search();
    expect(list).toHaveLength(8);
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
    await expect(recordsService.search()).rejects.toThrow();
  });
});
