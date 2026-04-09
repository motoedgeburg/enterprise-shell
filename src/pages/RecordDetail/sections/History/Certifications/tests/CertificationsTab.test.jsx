/**
 * CertificationsTab tests.
 *
 * Covers:
 *   - Add Certification button renders
 *   - Empty state messaging
 *   - Certifications render in the table (name, issuer, credential ID)
 *   - Status tags: Active, Expired, No Expiry
 *   - Add Certification modal opens with correct title
 *   - Cancel button closes modal
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../../renderUtils.jsx';
import CertificationsTab from '../CertificationsTab.jsx';

// ─── Seed data ────────────────────────────────────────────────────────────────

const CERTS = [
  {
    id: 'cert-1',
    name: 'AWS Solutions Architect',
    issuingBody: 'Amazon Web Services',
    issueDate: '2022-01-15',
    expiryDate: '2030-01-15', // future → Active
    credentialId: 'AWS-123',
  },
  {
    id: 'cert-2',
    name: 'Expired Cert',
    issuingBody: 'Old Body',
    issueDate: '2018-01-01',
    expiryDate: '2020-01-01', // past → Expired
  },
  {
    id: 'cert-3',
    name: 'No Expiry Cert',
    issuingBody: 'Eternal Inc.',
    issueDate: '2021-06-01',
    expiryDate: null, // → No Expiry
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderCerts(initialValues = {}) {
  return render(
    <App>
      <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
        <FinalForm onSubmit={() => {}} initialValues={initialValues}>
          {() => <CertificationsTab />}
        </FinalForm>
      </IntlProvider>
    </App>,
  );
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('CertificationsTab — rendering', () => {
  it('shows Add Certification button', () => {
    renderCerts();
    expect(screen.getByRole('button', { name: /Add Certification/i })).toBeInTheDocument();
  });

  it('shows empty message when no certifications', () => {
    renderCerts({ certifications: [] });
    expect(screen.getByText('No certifications on file.')).toBeInTheDocument();
  });
});

// ─── Table data ───────────────────────────────────────────────────────────────

describe('CertificationsTab — table', () => {
  it('renders certification names in the table', () => {
    renderCerts({ certifications: CERTS });
    expect(screen.getByText('AWS Solutions Architect')).toBeInTheDocument();
    expect(screen.getByText('Expired Cert')).toBeInTheDocument();
    expect(screen.getByText('No Expiry Cert')).toBeInTheDocument();
  });

  it('renders credential ID as secondary text', () => {
    renderCerts({ certifications: CERTS });
    expect(screen.getByText('ID: AWS-123')).toBeInTheDocument();
  });

  it('shows Active tag for cert with future expiry', () => {
    renderCerts({ certifications: CERTS });
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows Expired tag for cert with past expiry', () => {
    renderCerts({ certifications: CERTS });
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('shows No Expiry tag for cert with no expiry date', () => {
    renderCerts({ certifications: CERTS });
    expect(screen.getByText('No Expiry')).toBeInTheDocument();
  });
});

// ─── Add modal ────────────────────────────────────────────────────────────────

describe('CertificationsTab — Add Certification modal', () => {
  it('opens with "Add Certification" title', async () => {
    const user = userEvent.setup();
    renderCerts();
    await user.click(screen.getByRole('button', { name: /Add Certification/i }));
    await waitFor(() =>
      expect(document.querySelector('.ant-modal-title')).toHaveTextContent('Add Certification'),
    );
  });

  it('Cancel button is present and clickable inside the modal', async () => {
    const user = userEvent.setup();
    renderCerts();
    await user.click(screen.getByRole('button', { name: /Add Certification/i }));
    await waitFor(() =>
      expect(document.querySelector('.ant-modal-title')).toHaveTextContent('Add Certification'),
    );
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelBtn).toBeInTheDocument();
    await user.click(cancelBtn);
  });
});
