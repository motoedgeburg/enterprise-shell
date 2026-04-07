import {
  DashboardOutlined,
  SearchOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { App, Layout, Menu, Avatar, Dropdown, Typography, Space } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';

import messages from './messages.js';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const SIDEBAR_BG = '#0f172a';
const SIDEBAR_DARK = '#1e293b';

const getInitials = (name) =>
  name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const intl = useIntl();

  const navItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: intl.formatMessage(messages.NAV_DASHBOARD),
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: intl.formatMessage(messages.NAV_SEARCH),
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

  const displayName = user?.name ?? user?.email ?? intl.formatMessage(messages.USER_FALLBACK_NAME);
  const initials = getInitials(user?.name);

  return (
    <App>
      <Layout style={{ minHeight: '100vh' }}>
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={220}
          style={{ background: SIDEBAR_BG }}
        >
          {/* Brand */}
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? 0 : '0 20px',
              borderBottom: `1px solid ${SIDEBAR_DARK}`,
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 700,
                fontSize: 16,
                color: '#fff',
              }}
            >
              E
            </div>
            {!collapsed && (
              <Text strong style={{ color: '#f8fafc', fontSize: 15, letterSpacing: '-0.01em' }}>
                {intl.formatMessage(messages.APP_TITLE)}
              </Text>
            )}
          </div>

          {/* Nav */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={navItems}
            style={{ background: SIDEBAR_BG, borderRight: 0, marginTop: 8 }}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>

        <Layout>
          {/* ── Header ───────────────────────────────────────────────────────── */}
          <Header
            style={{
              background: '#ffffff',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
                color: '#64748b',
                padding: '4px 8px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={
                collapsed
                  ? intl.formatMessage(messages.SIDEBAR_EXPAND)
                  : intl.formatMessage(messages.SIDEBAR_COLLAPSE)
              }
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1d4ed8', fontWeight: 600, fontSize: 13 }}>
                  {initials}
                </Avatar>
                <Text
                  style={{
                    maxWidth: 180,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#374151',
                  }}
                >
                  {displayName}
                </Text>
              </Space>
            </Dropdown>
          </Header>

          {/* ── Content ──────────────────────────────────────────────────────── */}
          <Content style={{ margin: 24, minHeight: 280, overflow: 'auto' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </App>
  );
};

export default AppLayout;
