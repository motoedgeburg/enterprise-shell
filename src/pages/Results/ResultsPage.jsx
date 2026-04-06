import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag, Typography, App, Empty } from 'antd';
import { FORM_ERROR } from 'final-form';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { recordsService } from '../../api/recordsService';
import RecordFormModal from '../Records/RecordFormModal.jsx';
import recordsMessages from '../Records/messages.js';

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
  const [selectedRecord, setSelectedRecord] = useState(null);

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

  // ─── CRUD handlers ────────────────────────────────────────────────────────────

  const openCreate = () => { setSelectedRecord(null); setModalOpen(true); };
  const openEdit   = (record) => { setSelectedRecord(record); setModalOpen(true); };

  const handleDelete = async (id) => {
    try {
      await recordsService.remove(id);
      void message.success(intl.formatMessage(recordsMessages.RECORDS_SUCCESS_DELETED));
      void fetchResults(pagination.current, pagination.pageSize);
    } catch {
      void message.error(intl.formatMessage(recordsMessages.RECORDS_ERROR_DELETE));
    }
  };

  const handleFormSubmit = async (values, form) => {
    const dto = {
      name:       values.name,
      email:      values.email,
      address:    values.address,
      department: values.department,
      status:     values.status,
    };
    try {
      if (selectedRecord) {
        await recordsService.update(selectedRecord.id, dto);
        void message.success(intl.formatMessage(recordsMessages.RECORDS_SUCCESS_UPDATED));
      } else {
        await recordsService.create(dto);
        void message.success(intl.formatMessage(recordsMessages.RECORDS_SUCCESS_CREATED));
      }
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
    {
      title: intl.formatMessage(recordsMessages.RECORDS_COL_ACTIONS),
      key: 'actions',
      fixed: 'right',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            aria-label={intl.formatMessage(recordsMessages.RECORDS_EDIT_ARIA, { name: record.name })}
          />
          <Popconfirm
            title={intl.formatMessage(recordsMessages.RECORDS_DELETE_CONFIRM_TITLE)}
            description={intl.formatMessage(recordsMessages.RECORDS_DELETE_CONFIRM_DESC, { name: record.name })}
            onConfirm={() => void handleDelete(record.id)}
            okText={intl.formatMessage(recordsMessages.RECORDS_DELETE_OK)}
            okButtonProps={{ danger: true }}
            cancelText={intl.formatMessage(recordsMessages.RECORDS_DELETE_CANCEL)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label={intl.formatMessage(recordsMessages.RECORDS_DELETE_ARIA, { name: record.name })}
            />
          </Popconfirm>
        </Space>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
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

        {/* Results table */}
        <Table
          dataSource={records}
          columns={columns}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: <Empty description={intl.formatMessage(messages.RESULTS_EMPTY)} />,
          }}
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
        record={selectedRecord}
        onSubmit={handleFormSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </App>
  );
};

export default ResultsPage;
