import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Row, Col, Card, Statistic, Typography, Space, Tag } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';
import { useLookups } from '../hooks/useLookups.js';

import messages from './messages.js';

const { Title, Paragraph, Text } = Typography;

const Dashboard = () => {
  const { user } = useAuth();
  const intl = useIntl();
  const navigate = useNavigate();

  // Fetch reference data on Dashboard mount so lookups are warm for all
  // downstream pages (Search, RecordDetail, RecordFormModal).
  useLookups();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Welcome banner */}
      <Card>
        <Space align="start">
          <UserOutlined style={{ fontSize: 32, color: '#1677ff' }} />
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              {intl.formatMessage(messages.DASHBOARD_WELCOME_TITLE, {
                name: user?.name ?? intl.formatMessage(messages.DASHBOARD_USER_FALLBACK),
              })}
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 8 }}>
              {user?.email}
            </Paragraph>
            {user?.groups?.map((group) => (
              <Tag key={group} color="blue">
                {group}
              </Tag>
            ))}
          </div>
        </Space>
      </Card>

      {/* KPI cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={intl.formatMessage(messages.DASHBOARD_STAT_TOTAL_RECORDS)}
              value={1_284}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={intl.formatMessage(messages.DASHBOARD_STAT_ACTIVE)}
              value={1_102}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={intl.formatMessage(messages.DASHBOARD_STAT_PENDING)}
              value={87}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={intl.formatMessage(messages.DASHBOARD_STAT_INACTIVE)}
              value={95}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick-link tiles */}
      <div>
        <Title level={5} style={{ marginBottom: 12 }}>
          {intl.formatMessage(messages.DASHBOARD_TILES_SECTION_TITLE)}
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              onClick={() => navigate('/search')}
              style={{ cursor: 'pointer' }}
            >
              <Space align="start">
                <SearchOutlined style={{ fontSize: 28, color: '#1677ff' }} />
                <div>
                  <Text strong>{intl.formatMessage(messages.DASHBOARD_TILE_SEARCH_TITLE)}</Text>
                  <Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 4 }}>
                    {intl.formatMessage(messages.DASHBOARD_TILE_SEARCH_DESC)}
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Auth info panel */}
      <Card title={intl.formatMessage(messages.DASHBOARD_SESSION_CARD_TITLE)} size="small">
        <Paragraph>
          <strong>{intl.formatMessage(messages.DASHBOARD_SESSION_SUB)}</strong>{' '}
          {user?.sub ?? intl.formatMessage(messages.DASHBOARD_VALUE_FALLBACK)}
        </Paragraph>
        <Paragraph>
          <strong>{intl.formatMessage(messages.DASHBOARD_SESSION_EMAIL)}</strong>{' '}
          {user?.email ?? intl.formatMessage(messages.DASHBOARD_VALUE_FALLBACK)}
        </Paragraph>
        <Paragraph style={{ marginBottom: 0 }}>
          <strong>{intl.formatMessage(messages.DASHBOARD_SESSION_GROUPS)}</strong>{' '}
          {user?.groups?.length
            ? user.groups.join(', ')
            : intl.formatMessage(messages.DASHBOARD_NO_GROUPS)}
        </Paragraph>
      </Card>
    </Space>
  );
};

export default Dashboard;
