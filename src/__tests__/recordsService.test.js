import { recordsService } from '../api/recordsService';
import { db } from '../mocks/data';

// server is started/stopped in setupTests.js

describe('recordsService', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('getAll', () => {
    it('returns the first page of records', async () => {
      const result = await recordsService.getAll(0, 5);
      expect(result.content).toHaveLength(5);
      expect(result.totalElements).toBe(8);
      expect(result.number).toBe(0);
    });

    it('returns the second page', async () => {
      const result = await recordsService.getAll(1, 5);
      expect(result.content).toHaveLength(3);
    });
  });

  describe('getById', () => {
    it('returns the record with matching id', async () => {
      const record = await recordsService.getById(1);
      expect(record.id).toBe(1);
      expect(record.name).toBe('Alice Johnson');
    });
  });

  describe('create', () => {
    it('creates a new record and returns it with an id', async () => {
      const dto = {
        name: 'Test User',
        email: 'test@company.com',
        department: 'Engineering',
        status: 'active',
      };
      const created = await recordsService.create(dto);
      expect(created.id).toBeDefined();
      expect(created.name).toBe('Test User');
      expect(created.createdAt).toBeDefined();
    });
  });

  describe('update', () => {
    it('updates an existing record', async () => {
      const updated = await recordsService.update(1, { name: 'Alice Updated' });
      expect(updated.name).toBe('Alice Updated');
      expect(updated.id).toBe(1);
    });
  });

  describe('remove', () => {
    it('deletes the record with matching id', async () => {
      await expect(recordsService.remove(1)).resolves.not.toThrow();
    });
  });
});
