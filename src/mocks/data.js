// Seed data that mirrors a Spring Boot backend response
export const seedRecords = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    department: 'Engineering',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Bob Martinez',
    email: 'bob.martinez@company.com',
    department: 'Product',
    status: 'active',
    createdAt: '2024-02-03T08:00:00Z',
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol.white@company.com',
    department: 'Design',
    status: 'inactive',
    createdAt: '2024-01-22T14:15:00Z',
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@company.com',
    department: 'Engineering',
    status: 'active',
    createdAt: '2024-03-10T09:45:00Z',
  },
  {
    id: 5,
    name: 'Eva Brown',
    email: 'eva.brown@company.com',
    department: 'Marketing',
    status: 'active',
    createdAt: '2024-03-18T11:00:00Z',
  },
  {
    id: 6,
    name: 'Frank Lee',
    email: 'frank.lee@company.com',
    department: 'Sales',
    status: 'inactive',
    createdAt: '2024-02-28T16:30:00Z',
  },
  {
    id: 7,
    name: 'Grace Chen',
    email: 'grace.chen@company.com',
    department: 'Operations',
    status: 'active',
    createdAt: '2024-04-01T08:30:00Z',
  },
  {
    id: 8,
    name: 'Henry Davis',
    email: 'henry.davis@company.com',
    department: 'HR',
    status: 'active',
    createdAt: '2024-04-05T13:00:00Z',
  },
];

let records = [...seedRecords];
let nextId = records.length + 1;

export const db = {
  getAll: (page, size) => {
    const start = page * size;
    const content = records.slice(start, start + size);
    return {
      content,
      totalElements: records.length,
      totalPages: Math.ceil(records.length / size),
      size,
      number: page,
    };
  },

  getById: (id) => records.find((r) => r.id === id) ?? null,

  create: (dto) => {
    const newRecord = {
      ...dto,
      id: nextId++,
      createdAt: new Date().toISOString(),
    };
    records = [...records, newRecord];
    return newRecord;
  },

  update: (id, dto) => {
    let updated = null;
    records = records.map((r) => {
      if (r.id === id) {
        updated = { ...r, ...dto };
        return updated;
      }
      return r;
    });
    return updated;
  },

  remove: (id) => {
    const existed = records.some((r) => r.id === id);
    records = records.filter((r) => r.id !== id);
    return existed;
  },

  reset: () => {
    records = [...seedRecords];
    nextId = seedRecords.length + 1;
  },
};
