import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Empty, Space, Table, Tag, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { recordsService } from '../../api/recordsService';
import { createLogger } from '../../utils/logger.js';

import messages from './messages.js';

const log = createLogger('Results');

const { Title, Text } = Typography;

const ResultsPage = () => {
  const { message } = App.useApp();
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const filters = {
    name: searchParams.get('name') ?? '',
    email: searchParams.get('email') ?? '',
    address: searchParams.get('address') ?? '',
    department: searchParams.get('department') ?? '',
    status: searchParams.get('status') ?? '',
  };

  // ─── Fetch ───────────────────────────────────────────────────────────────────

  const fetchResults = useCallback(
    async (page = 1, size = 10) => {
      setLoading(true);
      try {
        const data = await recordsService.search(filters, page - 1, size);
        setRecords(data.content);
        setPagination((prev) => ({ ...prev, total: data.totalElements }));
      } catch (err) {
        log.error('Failed to load search results', err);
        void message.error(intl.formatMessage(messages.RECORDS_ERROR_LOAD));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, message, intl],
  );

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
        dataIndex: ['personalInfo', 'name'],
        key: 'name',
        sorter: (a, b) => a.personalInfo.name.localeCompare(b.personalInfo.name),
      },
      {
        title: intl.formatMessage(messages.RECORDS_COL_EMAIL),
        dataIndex: ['personalInfo', 'email'],
        key: 'email',
      },
      {
        title: intl.formatMessage(messages.RECORDS_COL_ADDRESS),
        dataIndex: ['personalInfo', 'address'],
        key: 'address',
      },
      {
        title: intl.formatMessage(messages.RECORDS_COL_DEPARTMENT),
        dataIndex: ['workInfo', 'department'],
        key: 'department',
      },
      {
        title: intl.formatMessage(messages.RECORDS_COL_STATUS),
        dataIndex: ['workInfo', 'status'],
        key: 'status',
        render: (status) => (
          <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
        ),
      },
    ],
    [intl],
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/search')}>
          {intl.formatMessage(messages.RESULTS_BACK_TO_SEARCH)}
        </Button>
        <Title level={4} style={{ margin: 0, flex: 1 }}>
          {intl.formatMessage(messages.RESULTS_PAGE_TITLE)}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/records/new', { state: { search: searchParams.toString() } })}
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
          emptyText: <Empty description={intl.formatMessage(messages.RESULTS_EMPTY)} />,
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
          tabIndex: 0,
          role: 'link',
          style: { cursor: 'pointer' },
        })}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => intl.formatMessage(messages.RECORDS_PAGINATION_TOTAL, { total }),
          onChange: (page, size) => void fetchResults(page, size),
        }}
        scroll={{ x: 900 }}
        size="middle"
      />
    </Space>
  );
};

export default ResultsPage;
