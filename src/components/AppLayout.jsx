import {
  DashboardOutlined,
  TableOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown, Typography, Space, theme } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';

import messages from './messages.js';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const intl = useIntl();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: intl.formatMessage(messages.NAV_DASHBOARD),
    },
    {
      key: '/records',
      icon: <TableOutlined />,
      label: intl.formatMessage(messages.NAV_RECORDS),
    },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: intl.formatMessage(messages.USER_MENU_SIGN_OUT),
      danger: true,
      onClick: () => void logout(),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        style={{ background: colorBgContainer, borderRight: '1px solid #f0f0f0' }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Text strong style={{ fontSize: collapsed ? 0 : 16, transition: 'font-size 0.2s' }}>
            {collapsed ? '★' : intl.formatMessage(messages.APP_TITLE)}
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={navItems}
          style={{ borderRight: 0, marginTop: 8 }}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Space>
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
              aria-label={
                collapsed
                  ? intl.formatMessage(messages.SIDEBAR_EXPAND)
                  : intl.formatMessage(messages.SIDEBAR_COLLAPSE)
              }
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </Space>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              {!collapsed && (
                <Text style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name ?? user?.email ?? intl.formatMessage(messages.USER_FALLBACK_NAME)}
                </Text>
              )}
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
