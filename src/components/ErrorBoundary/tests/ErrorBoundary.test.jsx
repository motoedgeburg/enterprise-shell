import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ErrorBoundary from '../ErrorBoundary.jsx';

const ThrowingChild = () => {
  throw new Error('Test explosion');
};

const GoodChild = () => <p>All good</p>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
  });

  it('logs the error to console.error', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );
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

    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });

  it('has a link to dashboard', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );
    const link = screen.getByRole('link', { name: 'Go to Dashboard' });
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
