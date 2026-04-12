import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useLookups } from '../../hooks/useLookups.js';

import messages from './messages.js';

const Dashboard = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  // Warm lookups for all downstream pages.
  useLookups();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Button
        type="primary"
        onClick={() => navigate('/search')}
        style={{
          width: 200,
          height: 200,
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        <SearchOutlined style={{ fontSize: 64 }} />
        <span style={{ fontSize: 16, fontWeight: 500 }}>
          {intl.formatMessage(messages.DASHBOARD_SEARCH_BUTTON)}
        </span>
      </Button>
    </div>
  );
};

export default Dashboard;
