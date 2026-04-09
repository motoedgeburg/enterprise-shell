import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth.js';
import { useLookups } from '../../hooks/useLookups.js';

import messages from './messages.js';

const { Title, Paragraph, Text } = Typography;

const Dashboard = () => {
  const { user } = useAuth();
  const intl = useIntl();
  const navigate = useNavigate();

  // Warm lookups for all downstream pages.
  useLookups();

  const name = user?.name ?? intl.formatMessage(messages.DASHBOARD_USER_FALLBACK);

  return (
    <div style={{ padding: '48px 24px', maxWidth: 960, margin: '0 auto' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 56, textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: 8, fontWeight: 700, color: '#0f172a' }}>
          {intl.formatMessage(messages.DASHBOARD_WELCOME_TITLE, { name })}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          {intl.formatMessage(messages.DASHBOARD_WELCOME_SUBTITLE)}
        </Text>
      </div>

      {/* Search tile */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          hoverable
          onClick={() => navigate('/search')}
          style={{
            width: 480,
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
          styles={{ body: { padding: '56px 48px' } }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
            }}
          >
            <SearchOutlined style={{ fontSize: 32, color: '#1d4ed8' }} />
          </div>

          <Title level={3} style={{ margin: '0 0 12px', fontWeight: 600, color: '#0f172a' }}>
            {intl.formatMessage(messages.DASHBOARD_TILE_SEARCH_TITLE)}
          </Title>

          <Paragraph type="secondary" style={{ fontSize: 15, margin: '0 0 32px', lineHeight: 1.6 }}>
            {intl.formatMessage(messages.DASHBOARD_TILE_SEARCH_DESC)}
          </Paragraph>

          <Button type="primary" size="large" icon={<SearchOutlined />}>
            {intl.formatMessage(messages.DASHBOARD_TILE_SEARCH_CTA)}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
