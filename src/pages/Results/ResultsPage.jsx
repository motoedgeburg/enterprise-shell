import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Typography, App, Empty } from 'antd';
import { FORM_ERROR } from 'final-form';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { recordsService } from '../../api/recordsService';
import recordsMessages from '../Records/messages.js';
import RecordFormModal from '../Records/RecordFormModal.jsx';

import messages from './messages.js';

const { Title, Text } = Typography;

const ResultsPage = () => {
  const { message } = App.useApp();
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);

  // Build filters object from URL params
  const filters = {
    name:       searchParams.get('name')       ?? '',
    email:      searchParams.get('email')      ?? '',
    address:    searchParams.get('address')    ?? '',
    department: searchParams.get('department') ?? '',
    status:     searchParams.get('status')     ?? '',
  };

  // ─── Fetch ───────────────────────────────────────────────────────────────────

  const fetchResults = useCallback(
    async (page = 1, size = 10) => {
      setLoading(true);
      try {
        const data = await recordsService.search(filters, page - 1, size);
        setRecords(data.content);
        setPagination((prev) => ({ ...prev, total: data.totalElements }));
      } catch {
        void message.error(intl.formatMessage(recordsMessages.RECORDS_ERROR_LOAD));
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

  // ─── Add handler ─────────────────────────────────────────────────────────────

  const handleFormSubmit = async (values, form) => {
    const dto = {
      name:       values.name,
      email:      values.email,
      address:    values.address,
      department: values.department,
      status:     values.status,
    };
    try {
      await recordsService.create(dto);
      void message.success(intl.formatMessage(recordsMessages.RECORDS_SUCCESS_CREATED));
      setModalOpen(false);
      form.reset();
      void fetchResults(pagination.current, pagination.pageSize);
    } catch {
      return { [FORM_ERROR]: intl.formatMessage(recordsMessages.RECORDS_ERROR_SUBMIT) };
    }
  };

  // ─── Active filter summary ────────────────────────────────────────────────────

  const activeFilters = Object.entries(filters).filter(([, v]) => v);

  // ─── Table columns ────────────────────────────────────────────────────────────

  const columns = [
    {
      title: intl.formatMessage(recordsMessages.RECORDS_COL_NAME),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: intl.formatMessage(recordsMessages.RECORDS_COL_EMAIL),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: intl.formatMessage(recordsMessages.RECORDS_COL_ADDRESS),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: intl.formatMessage(recordsMessages.RECORDS_COL_DEPARTMENT),
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: intl.formatMessage(recordsMessages.RECORDS_COL_STATUS),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <App>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Header */}
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/search')}
            >
              {intl.formatMessage(messages.RESULTS_BACK_TO_SEARCH)}
            </Button>
            <Title level={4} style={{ marginBottom: 0 }}>
              {intl.formatMessage(messages.RESULTS_PAGE_TITLE)}
            </Title>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            {intl.formatMessage(recordsMessages.RECORDS_ADD_BUTTON)}
          </Button>
        </Space>

        {/* Active filter summary */}
        {activeFilters.length > 0 && (
          <Space wrap>
            <Text type="secondary">Filters:</Text>
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
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: <Empty description={intl.formatMessage(messages.RESULTS_EMPTY)} />,
          }}
          onRow={(record) => ({
            onClick: () =>
              navigate(`/records/${record.id}`, {
                state: { search: searchParams.toString() },
              }),
            style: { cursor: 'pointer' },
          })}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) =>
              intl.formatMessage(recordsMessages.RECORDS_PAGINATION_TOTAL, { total }),
            onChange: (page, size) => void fetchResults(page, size),
          }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </Space>

      <RecordFormModal
        open={modalOpen}
        record={null}
        onSubmit={handleFormSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </App>
  );
};

export default ResultsPage;
