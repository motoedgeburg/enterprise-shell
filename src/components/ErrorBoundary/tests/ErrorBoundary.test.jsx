import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../renderUtils.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';

const ThrowingChild = () => {
  throw new Error('Test explosion');
};

const GoodChild = () => <p>All good</p>;

function renderBoundary(children) {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <ErrorBoundary>{children}</ErrorBoundary>
    </IntlProvider>,
  );
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    renderBoundary(<GoodChild />);
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders error UI when a child throws', () => {
    renderBoundary(<ThrowingChild />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
  });

  it('logs the error to console.error', () => {
    renderBoundary(<ThrowingChild />);
    expect(console.error).toHaveBeenCalledWith(
      '[ErrorBoundary]',
      'Uncaught error in component tree',
      expect.objectContaining({ error: expect.any(Error), componentStack: expect.any(String) }),
    );
  });

  it('resets error state when Try Again is clicked', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    const MaybeThrow = () => {
      if (shouldThrow) throw new Error('Test explosion');
      return <p>Recovered</p>;
    };

    renderBoundary(<MaybeThrow />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });

  it('has a link to dashboard', () => {
    renderBoundary(<ThrowingChild />);
    const link = screen.getByRole('link', { name: 'Go to Dashboard' });
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
