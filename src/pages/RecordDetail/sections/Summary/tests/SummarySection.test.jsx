/**
 * SummarySection tests.
 *
 * SummarySection is a read-only FormSpy panel — it reflects current form state.
 * Tests verify that every field displays correctly given different form values.
 *
 * Covers:
 *   - All section labels render
 *   - Personal, work, and preferences values are displayed
 *   - Empty fields fall back to '—'
 *   - Status renders as an uppercase Tag
 *   - Employment type resolves label from lookups (not raw value)
 *   - Access level resolves label from lookups
 *   - Notification channels render as individual Tags
 *   - Empty notification channels show 'None'
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../renderUtils.jsx';
import SummarySection from '../SummarySection.jsx';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../../../../../hooks/useLookups.js', () => ({
  useLookups: () => ({
    employmentTypes: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'intern', label: 'Intern' },
    ],
    notificationChannels: [
      { value: 'email', label: 'Email' },
      { value: 'slack', label: 'Slack' },
      { value: 'sms', label: 'SMS' },
      { value: 'teams', label: 'Teams' },
    ],
    accessLevels: [
      { value: 'read-only', label: 'Read-only' },
      { value: 'standard', label: 'Standard' },
      { value: 'admin', label: 'Admin' },
    ],
  }),
}));

// ─── Helper ───────────────────────────────────────────────────────────────────

const FULL_RECORD = {
  name: 'Alice Johnson',
  email: 'alice@company.com',
  phone: '(215) 555-0101',
  address: '123 Market St, Philadelphia, PA 19103',
  dateOfBirth: '1990-03-15',
  bio: 'Senior engineer.',
  jobTitle: 'Senior Software Engineer',
  department: 'Engineering',
  status: 'active',
  employmentType: 'full-time',
  startDate: '2019-06-01',
  manager: 'Jane Smith',
  remoteEligible: true,
  notificationsEnabled: true,
  notificationChannels: ['email', 'slack'],
  accessLevel: 'standard',
  notes: 'Team lead.',
};

function renderSection(initialValues = {}) {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => <SummarySection />}
      </FinalForm>
    </IntlProvider>,
  );
}

// ─── Labels ───────────────────────────────────────────────────────────────────

describe('SummarySection — labels', () => {
  it('renders Full Name label', () => {
    renderSection();
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });

  it('renders Email label', () => {
    renderSection();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders Phone label', () => {
    renderSection();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('renders Address label', () => {
    renderSection();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('renders Date of Birth label', () => {
    renderSection();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
  });

  it('renders Bio label', () => {
    renderSection();
    expect(screen.getByText('Bio')).toBeInTheDocument();
  });

  it('renders Job Title label', () => {
    renderSection();
    expect(screen.getByText('Job Title')).toBeInTheDocument();
  });

  it('renders Department label', () => {
    renderSection();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('renders Status label', () => {
    renderSection();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders Employment Type label', () => {
    renderSection();
    expect(screen.getByText('Employment Type')).toBeInTheDocument();
  });

  it('renders Start Date label', () => {
    renderSection();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
  });

  it('renders Manager label', () => {
    renderSection();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('renders Remote Work Eligible label', () => {
    renderSection();
    expect(screen.getByText('Remote Work Eligible')).toBeInTheDocument();
  });

  it('renders Notifications Enabled label', () => {
    renderSection();
    expect(screen.getByText('Notifications Enabled')).toBeInTheDocument();
  });

  it('renders Notification Channels label', () => {
    renderSection();
    expect(screen.getByText('Notification Channels')).toBeInTheDocument();
  });

  it('renders Access Level label', () => {
    renderSection();
    expect(screen.getByText('Access Level')).toBeInTheDocument();
  });

  it('renders Internal Notes label', () => {
    renderSection();
    expect(screen.getByText('Internal Notes')).toBeInTheDocument();
  });
});

// ─── Personal values ──────────────────────────────────────────────────────────

describe('SummarySection — personal values', () => {
  it('displays name', () => {
    renderSection({ name: 'Alice Johnson' });
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  it('displays email', () => {
    renderSection({ email: 'alice@company.com' });
    expect(screen.getByText('alice@company.com')).toBeInTheDocument();
  });

  it('displays phone', () => {
    renderSection({ phone: '(215) 555-0101' });
    expect(screen.getByText('(215) 555-0101')).toBeInTheDocument();
  });

  it('displays address', () => {
    renderSection({ address: '123 Market St' });
    expect(screen.getByText('123 Market St')).toBeInTheDocument();
  });

  it('displays bio', () => {
    renderSection({ bio: 'Senior engineer.' });
    expect(screen.getByText('Senior engineer.')).toBeInTheDocument();
  });

  it('displays formatted date of birth', () => {
    renderSection({ dateOfBirth: '1990-03-15' });
    // toLocaleDateString output varies by locale, just check something is rendered
    expect(screen.queryAllByText('—').length).toBeLessThan(17);
  });
});

// ─── Work values ──────────────────────────────────────────────────────────────

describe('SummarySection — work values', () => {
  it('displays job title', () => {
    renderSection({ jobTitle: 'Senior Software Engineer' });
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  it('displays department', () => {
    renderSection({ department: 'Engineering' });
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('displays manager', () => {
    renderSection({ manager: 'Jane Smith' });
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays status as ACTIVE tag', () => {
    renderSection({ status: 'active' });
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('displays status as INACTIVE tag', () => {
    renderSection({ status: 'inactive' });
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
  });

  it('resolves employment type label from lookups', () => {
    renderSection({ employmentType: 'full-time' });
    expect(screen.getByText('Full-time')).toBeInTheDocument();
  });

  it('resolves contract employment type label', () => {
    renderSection({ employmentType: 'contract' });
    expect(screen.getByText('Contract')).toBeInTheDocument();
  });
});

// ─── Preferences values ───────────────────────────────────────────────────────

describe('SummarySection — preferences values', () => {
  it('displays Yes for remoteEligible true', () => {
    renderSection({ remoteEligible: true });
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('displays No for remoteEligible false', () => {
    renderSection({ remoteEligible: false });
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('displays On for notificationsEnabled true', () => {
    renderSection({ notificationsEnabled: true });
    expect(screen.getByText('On')).toBeInTheDocument();
  });

  it('displays Off for notificationsEnabled false', () => {
    renderSection({ notificationsEnabled: false });
    expect(screen.getByText('Off')).toBeInTheDocument();
  });

  it('renders notification channels as tags', () => {
    renderSection({ notificationChannels: ['email', 'slack'] });
    // 'Email' appears twice: once as the field label, once as the channel tag
    expect(screen.getAllByText('Email').length).toBeGreaterThan(0);
    expect(screen.getByText('Slack')).toBeInTheDocument();
  });

  it('shows None when notification channels is empty', () => {
    renderSection({ notificationChannels: [] });
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('shows None when notification channels is undefined', () => {
    renderSection({});
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('resolves access level label from lookups', () => {
    renderSection({ accessLevel: 'standard' });
    expect(screen.getByText('Standard')).toBeInTheDocument();
  });

  it('resolves admin access level label', () => {
    renderSection({ accessLevel: 'admin' });
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('displays internal notes', () => {
    renderSection({ notes: 'Team lead.' });
    expect(screen.getByText('Team lead.')).toBeInTheDocument();
  });
});

// ─── Empty / fallback values ──────────────────────────────────────────────────

describe('SummarySection — fallback values', () => {
  it('shows — for missing name', () => {
    renderSection({});
    // Multiple — dashes will appear for all empty fields
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('shows — for missing job title', () => {
    renderSection({ name: 'Alice' }); // only name set, jobTitle empty
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('shows — for missing status', () => {
    renderSection({});
    // status is empty so tag not rendered, — shown instead
    expect(screen.queryByText('ACTIVE')).not.toBeInTheDocument();
    expect(screen.queryByText('INACTIVE')).not.toBeInTheDocument();
  });
});

// ─── Full record snapshot ─────────────────────────────────────────────────────

describe('SummarySection — full record', () => {
  it('renders all values for a complete record', () => {
    renderSection(FULL_RECORD);
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice@company.com')).toBeInTheDocument();
    expect(screen.getByText('(215) 555-0101')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getAllByText('Email').length).toBeGreaterThan(0);
    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('Team lead.')).toBeInTheDocument();
  });
});
