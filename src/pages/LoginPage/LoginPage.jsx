import { LockOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth.js';

import messages from './messages.js';

const { Title, Paragraph } = Typography;

/**
 * Login page — there is no username/password form.
 * The user is redirected to Okta by clicking "Sign in with Okta".
 * After Okta authenticates them, control returns to /login/callback.
 */
const LoginPage = () => {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const intl = useIntl();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      return; // handled by Navigate below
    }
  }, [isAuthenticated, isInitializing]);

  if (isInitializing) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <Card
        style={{ width: 400, textAlign: 'center', borderRadius: 12 }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <LockOutlined style={{ fontSize: 48, color: '#1677ff' }} />

          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              {intl.formatMessage(messages.LOGIN_PAGE_TITLE)}
            </Title>
            <Paragraph type="secondary">
              {intl.formatMessage(messages.LOGIN_SSO_DESCRIPTION)}
            </Paragraph>
          </div>

          <Button type="primary" size="large" block icon={<LockOutlined />} onClick={login}>
            {intl.formatMessage(messages.LOGIN_BUTTON)}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage;
