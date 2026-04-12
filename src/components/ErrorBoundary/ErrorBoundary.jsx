import { Button, Result } from 'antd';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { ROUTES } from '../../constants/routes.js';
import { createLogger } from '../../utils/logger.js';

import messages from './messages.js';

const log = createLogger('ErrorBoundary');

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    log.error('Uncaught error in component tree', {
      error,
      componentStack: errorInfo?.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Result
            status="error"
            title={<FormattedMessage {...messages.ERROR_BOUNDARY_TITLE} />}
            subTitle={<FormattedMessage {...messages.ERROR_BOUNDARY_SUBTITLE} />}
            extra={[
              <Button key="retry" type="primary" onClick={this.handleReset}>
                <FormattedMessage {...messages.ERROR_BOUNDARY_RETRY} />
              </Button>,
              <Button key="home" href={ROUTES.DASHBOARD}>
                <FormattedMessage {...messages.ERROR_BOUNDARY_HOME} />
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
