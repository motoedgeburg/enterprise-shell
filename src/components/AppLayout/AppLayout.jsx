import {
  HomeOutlined,
  SearchOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { App, Layout, Menu, Avatar, Dropdown, Typography, Space } from 'antd';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import logoUrl from '../../assets/logo.svg';
import { useAuth } from '../../hooks/useAuth.js';
import { NavigationGuardProvider, useGuardedNavigate } from '../../hooks/useNavigationGuard.jsx';

import messages from './messages.js';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const SIDEBAR_BG = '#0f172a';

const getInitials = (name) =>
  name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

const AppLayoutInner = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();
  const intl = useIntl();
  const guardedNavigate = useGuardedNavigate();

  const navItems = useMemo(
    () => [
      {
        key: '/dashboard',
        icon: <HomeOutlined />,
        label: intl.formatMessage(messages.NAV_DASHBOARD),
      },
      {
        key: '/search',
        icon: <SearchOutlined />,
        label: intl.formatMessage(messages.NAV_SEARCH),
      },
    ],
    [intl],
  );

  const userMenuItems = useMemo(
    () => [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: intl.formatMessage(messages.USER_MENU_SIGN_OUT),
        danger: true,
        onClick: () => void logout(),
      },
    ],
    [intl, logout],
  );

  const displayName = user?.name ?? user?.email ?? intl.formatMessage(messages.USER_FALLBACK_NAME);
  const initials = getInitials(user?.name);

  return (
    <App>
      <Layout style={{ minHeight: '100vh' }}>
        {/* ── Header (full-width, above everything) ───────────────────────── */}
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
          <Space size={16} align="center">
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
            <img
              src={logoUrl}
              alt="Enterprise App"
              style={{ height: 56, verticalAlign: 'middle' }}
            />
          </Space>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                style={{ backgroundColor: '#008cff', fontWeight: 600, fontSize: 13 }}
                aria-label={displayName}
              >
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

        {/* ── Sidebar + Content ───────────────────────────────────────────── */}
        <Layout>
          <Sider
            collapsible
            collapsed={collapsed}
            trigger={null}
            width={220}
            style={{ background: SIDEBAR_BG }}
          >
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={navItems}
              style={{ background: SIDEBAR_BG, borderRight: 0, marginTop: 8 }}
              onClick={({ key }) => guardedNavigate(key)}
            />
          </Sider>

          <Content style={{ margin: 24, minHeight: 280, overflow: 'auto' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </App>
  );
};

const AppLayout = () => {
  const navigate = useNavigate();
  return (
    <NavigationGuardProvider navigate={navigate}>
      <AppLayoutInner />
    </NavigationGuardProvider>
  );
};

export default AppLayout;
