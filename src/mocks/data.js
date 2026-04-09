// Seed data that mirrors a Spring Boot backend response (nested structure)
export const seedRecords = [
  {
    id: 1,
    personalInfo: {
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      phone: '(215) 555-0101',
      address: '123 Market St, Philadelphia, PA 19103',
      dateOfBirth: '1990-03-15',
      ssn: '123-45-6789',
      bio: 'Senior software engineer with 8 years of experience in distributed systems and cloud infrastructure.',
    },
    workInfo: {
      jobTitle: 'Senior Software Engineer',
      manager: 'Jane Smith',
      department: 'Engineering',
      status: 'active',
      startDate: '2019-06-01',
      employmentType: 'full-time',
    },
    preferences: {
      remoteEligible: true,
      notificationsEnabled: true,
      notificationChannels: ['email', 'slack'],
      accessLevel: 'standard',
      notes: 'Team lead for the infrastructure squad. Eligible for senior staff promotion in Q3.',
    },
    emergencyContacts: [
      {
        id: 'ec-1-1',
        name: 'Michael Johnson',
        relationship: 'Spouse',
        phone: '(215) 555-0199',
        email: 'michael.j@personal.com',
        isPrimary: true,
      },
    ],
    certifications: [
      {
        id: 'cert-1-1',
        name: 'AWS Solutions Architect – Professional',
        issuingBody: 'Amazon Web Services',
        issueDate: '2022-03-15',
        expiryDate: '2025-03-15',
        credentialId: 'AWS-SAP-001234',
      },
      {
        id: 'cert-1-2',
        name: 'Certified Kubernetes Administrator',
        issuingBody: 'Cloud Native Computing Foundation',
        issueDate: '2023-06-01',
        expiryDate: '2026-06-01',
        credentialId: 'CKA-2023-5678',
      },
    ],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    personalInfo: {
      name: 'Bob Martinez',
      email: 'bob.martinez@company.com',
      phone: '(412) 555-0202',
      address: '456 Liberty Ave, Pittsburgh, PA 15222',
      dateOfBirth: '1985-07-22',
      ssn: '234-56-7890',
      bio: 'Product manager focused on enterprise SaaS with a background in UX research.',
    },
    workInfo: {
      jobTitle: 'Product Manager',
      manager: 'Karen Lee',
      department: 'Product',
      status: 'active',
      startDate: '2020-02-10',
      employmentType: 'full-time',
    },
    preferences: {
      remoteEligible: true,
      notificationsEnabled: true,
      notificationChannels: ['email', 'teams', 'sms'],
      accessLevel: 'admin',
      notes: 'Owns the roadmap for the B2B product line.',
    },
    emergencyContacts: [
      {
        id: 'ec-2-1',
        name: 'Linda Martinez',
        relationship: 'Parent',
        phone: '(412) 555-0299',
        email: 'linda.m@family.net',
        isPrimary: true,
      },
    ],
    certifications: [
      {
        id: 'cert-2-1',
        name: 'Project Management Professional (PMP)',
        issuingBody: 'Project Management Institute',
        issueDate: '2020-11-10',
        expiryDate: '2023-11-10',
        credentialId: 'PMI-PMP-4521',
      },
      {
        id: 'cert-2-2',
        name: 'Pragmatic Product Management',
        issuingBody: 'Pragmatic Institute',
        issueDate: '2022-04-05',
        expiryDate: null,
        credentialId: 'PRAG-PM-9876',
      },
    ],
    createdAt: '2024-02-03T08:00:00Z',
  },
  {
    id: 3,
    personalInfo: {
      name: 'Carol White',
      email: 'carol.white@company.com',
      phone: '(717) 555-0303',
      address: '789 Penn Ave, Harrisburg, PA 17101',
      dateOfBirth: '1993-11-08',
      ssn: '345-67-8901',
      bio: 'UX designer specializing in accessibility and design systems.',
    },
    workInfo: {
      jobTitle: 'UX Designer',
      manager: 'Tom Baker',
      department: 'Design',
      status: 'inactive',
      startDate: '2021-09-15',
      employmentType: 'part-time',
    },
    preferences: {
      remoteEligible: false,
      notificationsEnabled: false,
      notificationChannels: ['email'],
      accessLevel: 'read-only',
      notes: 'On extended leave. Return date TBD.',
    },
    emergencyContacts: [],
    certifications: [],
    createdAt: '2024-01-22T14:15:00Z',
  },
  {
    id: 4,
    personalInfo: {
      name: 'David Kim',
      email: 'david.kim@company.com',
      phone: '(610) 555-0404',
      address: '321 E Hamilton St, Allentown, PA 18101',
      dateOfBirth: '1995-05-30',
      ssn: '456-78-9012',
      bio: 'Full-stack engineer passionate about React and microservices.',
    },
    workInfo: {
      jobTitle: 'Software Engineer',
      manager: 'Alice Johnson',
      department: 'Engineering',
      status: 'active',
      startDate: '2022-03-01',
      employmentType: 'full-time',
    },
    preferences: {
      remoteEligible: true,
      notificationsEnabled: true,
      notificationChannels: ['slack'],
      accessLevel: 'standard',
      notes: 'Mentoring two junior developers on the team.',
    },
    emergencyContacts: [
      {
        id: 'ec-4-1',
        name: 'Sarah Kim',
        relationship: 'Spouse',
        phone: '(610) 555-0499',
        email: 'sarah.kim@personal.com',
        isPrimary: true,
      },
      {
        id: 'ec-4-2',
        name: 'Robert Kim',
        relationship: 'Parent',
        phone: '(610) 555-0498',
        email: '',
        isPrimary: false,
      },
    ],
    certifications: [
      {
        id: 'cert-4-1',
        name: 'Meta Front-End Developer',
        issuingBody: 'Meta',
        issueDate: '2023-01-20',
        expiryDate: null,
        credentialId: 'META-FED-9012',
      },
    ],
    createdAt: '2024-03-10T09:45:00Z',
  },
  {
    id: 5,
    personalInfo: {
      name: 'Eva Brown',
      email: 'eva.brown@company.com',
      phone: '(484) 555-0505',
      address: '654 Main St, Bethlehem, PA 18015',
      dateOfBirth: '1988-01-14',
      ssn: '567-89-0123',
      bio: 'Marketing manager with expertise in digital campaigns and brand strategy.',
    },
    workInfo: {
      jobTitle: 'Marketing Manager',
      manager: 'Karen Lee',
      department: 'Marketing',
      status: 'active',
      startDate: '2018-11-12',
      employmentType: 'full-time',
    },
    preferences: {
      remoteEligible: true,
      notificationsEnabled: true,
      notificationChannels: ['email', 'sms'],
      accessLevel: 'standard',
      notes: 'Leading the Q2 product launch campaign.',
    },
    emergencyContacts: [
      {
        id: 'ec-5-1',
        name: 'James Brown',
        relationship: 'Spouse',
        phone: '(484) 555-0599',
        email: 'james.b@personal.com',
        isPrimary: true,
      },
    ],
    certifications: [],
    createdAt: '2024-03-18T11:00:00Z',
  },
  {
    id: 6,
    personalInfo: {
      name: 'Frank Lee',
      email: 'frank.lee@company.com',
      phone: '(610) 555-0606',
      address: '987 Penn Ave, Reading, PA 19601',
      dateOfBirth: '1982-09-03',
      ssn: '678-90-1234',
      bio: 'Sales representative with a strong track record in enterprise accounts.',
    },
    workInfo: {
      jobTitle: 'Sales Representative',
      manager: 'Sam Rivera',
      department: 'Sales',
      status: 'inactive',
      startDate: '2023-01-05',
      employmentType: 'contract',
    },
    preferences: {
      remoteEligible: false,
      notificationsEnabled: false,
      notificationChannels: [],
      accessLevel: 'read-only',
      notes: 'Contract ending Q2. Renewal under review.',
    },
    emergencyContacts: [],
    certifications: [],
    createdAt: '2024-02-28T16:30:00Z',
  },
  {
    id: 7,
    personalInfo: {
      name: 'Grace Chen',
      email: 'grace.chen@company.com',
      phone: '(717) 555-0707',
      address: '147 Queen St, Lancaster, PA 17602',
      dateOfBirth: '1991-06-19',
      ssn: '789-01-2345',
      bio: 'Operations manager who specializes in process improvement and supply chain optimization.',
    },
    workInfo: {
      jobTitle: 'Operations Manager',
      manager: 'Jane Smith',
      department: 'Operations',
      status: 'active',
      startDate: '2017-08-20',
      employmentType: 'full-time',
    },
    preferences: {
      remoteEligible: false,
      notificationsEnabled: true,
      notificationChannels: ['email', 'teams'],
      accessLevel: 'admin',
      notes: 'Key contact for vendor onboarding.',
    },
    emergencyContacts: [
      {
        id: 'ec-7-1',
        name: 'Wei Chen',
        relationship: 'Parent',
        phone: '(717) 555-0799',
        email: 'wei.chen@family.com',
        isPrimary: true,
      },
    ],
    certifications: [
      {
        id: 'cert-7-1',
        name: 'Lean Six Sigma Black Belt',
        issuingBody: 'American Society for Quality',
        issueDate: '2019-05-10',
        expiryDate: '2022-05-10',
        credentialId: 'ASQ-LSSBB-3456',
      },
      {
        id: 'cert-7-2',
        name: 'Project Management Professional (PMP)',
        issuingBody: 'Project Management Institute',
        issueDate: '2021-09-15',
        expiryDate: '2027-09-15',
        credentialId: 'PMI-PMP-7890',
      },
    ],
    createdAt: '2024-04-01T08:30:00Z',
  },
  {
    id: 8,
    personalInfo: {
      name: 'Henry Davis',
      email: 'henry.davis@company.com',
      phone: '(570) 555-0808',
      address: '258 Spruce St, Scranton, PA 18503',
      dateOfBirth: '1987-12-27',
      ssn: '890-12-3456',
      bio: 'HR business partner supporting engineering and product teams.',
    },
    workInfo: {
      jobTitle: 'HR Business Partner',
      manager: 'Jane Smith',
      department: 'HR',
      status: 'active',
      startDate: '2016-04-11',
      employmentType: 'full-time',
    },
    preferences: {
      remoteEligible: true,
      notificationsEnabled: true,
      notificationChannels: ['email', 'slack', 'teams'],
      accessLevel: 'admin',
      notes: 'Point of contact for performance review cycle.',
    },
    emergencyContacts: [
      {
        id: 'ec-8-1',
        name: 'Patricia Davis',
        relationship: 'Spouse',
        phone: '(570) 555-0899',
        email: 'patricia.d@personal.com',
        isPrimary: true,
      },
      {
        id: 'ec-8-2',
        name: 'Marcus Davis',
        relationship: 'Sibling',
        phone: '(570) 555-0897',
        email: 'marcus.d@personal.com',
        isPrimary: false,
      },
    ],
    certifications: [
      {
        id: 'cert-8-1',
        name: 'SHRM Senior Certified Professional',
        issuingBody: 'SHRM',
        issueDate: '2020-07-22',
        expiryDate: '2026-07-22',
        credentialId: 'SHRM-SCP-2020',
      },
      {
        id: 'cert-8-2',
        name: 'Certified Compensation Professional',
        issuingBody: 'WorldatWork',
        issueDate: '2018-03-14',
        expiryDate: '2021-03-14',
        credentialId: 'CCP-2018-1122',
      },
    ],
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

  /**
   * Filter records by any combination of fields, then paginate.
   * Filters reference nested fields (personalInfo.name, workInfo.department, etc.).
   * Empty / absent filter values are ignored (match all).
   */
  search: (filters = {}, page = 0, size = 10) => {
    const { name, email, department, status, address } = filters;
    let result = records;

    if (name)
      result = result.filter((r) => r.personalInfo.name.toLowerCase().includes(name.toLowerCase()));
    if (email)
      result = result.filter((r) =>
        r.personalInfo.email.toLowerCase().includes(email.toLowerCase()),
      );
    if (department) result = result.filter((r) => r.workInfo.department === department);
    if (status) result = result.filter((r) => r.workInfo.status === status);
    if (address)
      result = result.filter((r) =>
        r.personalInfo.address?.toLowerCase().includes(address.toLowerCase()),
      );

    const start = page * size;
    return {
      content: result.slice(start, start + size),
      totalElements: result.length,
      totalPages: Math.ceil(result.length / size),
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
        updated = {
          ...r,
          personalInfo: { ...r.personalInfo, ...dto.personalInfo },
          workInfo: { ...r.workInfo, ...dto.workInfo },
          preferences: { ...r.preferences, ...dto.preferences },
          emergencyContacts: dto.emergencyContacts ?? r.emergencyContacts,
          certifications: dto.certifications ?? r.certifications,
        };
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
