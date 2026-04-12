import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Empty, Space, Table, Tag, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { recordsService } from '../../api/recordsService';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import { ROUTES } from '../../constants/routes.js';
import { createLogger } from '../../utils/logger.js';

import messages from './messages.js';

const log = createLogger('Results');

const { Text } = Typography;

const STATUS_COLOR = {
  active: 'green',
  inactive: 'default',
  'on-leave': 'orange',
  terminated: 'red',
};

const ResultsPage = () => {
  const { message } = App.useApp();
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = {
    name: searchParams.get('name') ?? '',
    email: searchParams.get('email') ?? '',
    address: searchParams.get('address') ?? '',
    department: searchParams.get('department') ?? '',
    status: searchParams.get('status') ?? '',
  };

  // ─── Fetch ───────────────────────────────────────────────────────────────────

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recordsService.search(filters);
      setRecords(data);
    } catch (err) {
      log.error('Failed to load search results', err);
      void message.error(intl.formatMessage(messages.RECORDS_ERROR_LOAD));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, message, intl]);

  useEffect(() => {
    void fetchResults();
  }, [fetchResults]);

  // ─── Active filter summary ────────────────────────────────────────────────────

  const activeFilters = Object.entries(filters).filter(([, v]) => v);

  // ─── Table columns ────────────────────────────────────────────────────────────

  const columns = useMemo(
    () => [
      {
        title: intl.formatMessage(messages.RECORDS_COL_NAME),
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: intl.formatMessage(messages.RECORDS_COL_ADDRESS),
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: intl.formatMessage(messages.RECORDS_COL_DEPARTMENT),
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: intl.formatMessage(messages.RECORDS_COL_STATUS),
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={STATUS_COLOR[status] ?? 'default'}>{status.toUpperCase()}</Tag>
        ),
      },
    ],
    [intl],
  );

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Breadcrumbs
          items={[
            {
              label: intl.formatMessage(messages.RESULTS_BREADCRUMB_DASHBOARD),
              path: ROUTES.DASHBOARD,
            },
            { label: intl.formatMessage(messages.RESULTS_BREADCRUMB_SEARCH), path: ROUTES.SEARCH },
            { label: intl.formatMessage(messages.RESULTS_BREADCRUMB) },
          ]}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.SEARCH)}>
          {intl.formatMessage(messages.RESULTS_BACK_TO_SEARCH)}
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            navigate(ROUTES.RECORDS_NEW, { state: { search: searchParams.toString() } })
          }
        >
          {intl.formatMessage(messages.RESULTS_NEW_RECORD)}
        </Button>
      </div>

      {/* Active filter summary */}
      {activeFilters.length > 0 && (
        <Space wrap>
          <Text type="secondary">{intl.formatMessage(messages.RESULTS_FILTERS_LABEL)}</Text>
          {activeFilters.map(([key, val]) => (
            <Tag key={key} color="blue">
              {key}: {val}
            </Tag>
          ))}
        </Space>
      )}

      {/* Results table — click a row to open Record Detail */}
      <Table
        dataSource={records}
        columns={columns}
        rowKey="uuid"
        loading={loading}
        locale={{
          emptyText: (
            <Empty description={intl.formatMessage(messages.RESULTS_EMPTY)}>
              <Space>
                <Button onClick={() => navigate(ROUTES.SEARCH)}>
                  {intl.formatMessage(messages.RESULTS_EMPTY_REFINE)}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    navigate(ROUTES.RECORDS_NEW, { state: { search: searchParams.toString() } })
                  }
                >
                  {intl.formatMessage(messages.RESULTS_NEW_RECORD)}
                </Button>
              </Space>
            </Empty>
          ),
        }}
        onRow={(record) => ({
          onClick: () =>
            navigate(`/records/${record.uuid}`, {
              state: { search: searchParams.toString() },
            }),
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(`/records/${record.uuid}`, {
                state: { search: searchParams.toString() },
              });
            }
          },
          onMouseEnter: (e) =>
            e.currentTarget.querySelectorAll('td').forEach((td) => {
              td.style.backgroundColor = '#f0f5ff';
              td.style.transition = 'background-color 0.15s';
            }),
          onMouseLeave: (e) =>
            e.currentTarget.querySelectorAll('td').forEach((td) => {
              td.style.backgroundColor = '';
            }),
          tabIndex: 0,
          role: 'link',
          style: { cursor: 'pointer' },
        })}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => intl.formatMessage(messages.RECORDS_PAGINATION_TOTAL, { total }),
        }}
        scroll={{ x: 900 }}
        size="middle"
      />
    </Space>
  );
};

export default ResultsPage;
