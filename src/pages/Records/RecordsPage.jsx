import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag, Typography, App, Input } from 'antd';
import { FORM_ERROR } from 'final-form';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { recordsService } from '../../api/recordsService';

import messages from './messages.js';
import RecordFormModal from './RecordFormModal.jsx';

const { Title } = Typography;

const RecordsPage = () => {
  const { message } = App.useApp();
  const intl = useIntl();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  const fetchRecords = useCallback(
    async (page = 1, size = 10) => {
      setLoading(true);
      try {
        const data = await recordsService.getAll(page - 1, size);
        setRecords(data.content);
        setPagination((prev) => ({ ...prev, total: data.totalElements }));
      } catch {
        void message.error(intl.formatMessage(messages.RECORDS_ERROR_LOAD));
      } finally {
        setLoading(false);
      }
    },
    [message, intl],
  );

  useEffect(() => {
    void fetchRecords();
  }, [fetchRecords]);

  // ─── CRUD handlers ─────────────────────────────────────────────────────────

  const openCreate = () => {
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await recordsService.remove(id);
      void message.success(intl.formatMessage(messages.RECORDS_SUCCESS_DELETED));
      void fetchRecords(pagination.current, pagination.pageSize);
    } catch {
      void message.error(intl.formatMessage(messages.RECORDS_ERROR_DELETE));
    }
  };

  const handleFormSubmit = async (values, form) => {
    const dto = {
      name: values.name,
      email: values.email,
      department: values.department,
      status: values.status,
    };

    try {
      if (selectedRecord) {
        await recordsService.update(selectedRecord.id, dto);
        void message.success(intl.formatMessage(messages.RECORDS_SUCCESS_UPDATED));
      } else {
        await recordsService.create(dto);
        void message.success(intl.formatMessage(messages.RECORDS_SUCCESS_CREATED));
      }
      setModalOpen(false);
      form.reset();
      void fetchRecords(pagination.current, pagination.pageSize);
    } catch {
      return { [FORM_ERROR]: intl.formatMessage(messages.RECORDS_ERROR_SUBMIT) };
    }
  };

  // ─── Table columns ──────────────────────────────────────────────────────────

  const columns = [
    {
      title: intl.formatMessage(messages.RECORDS_COL_NAME),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(String(value).toLowerCase()) ||
        record.email.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: intl.formatMessage(messages.RECORDS_COL_EMAIL),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: intl.formatMessage(messages.RECORDS_COL_DEPARTMENT),
      dataIndex: 'department',
      key: 'department',
      filters: [
        'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'HR',
      ].map((d) => ({ text: d, value: d })),
      onFilter: (value, record) => record.department === value,
    },
    {
      title: intl.formatMessage(messages.RECORDS_COL_STATUS),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage(messages.RECORDS_COL_CREATED),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: intl.formatMessage(messages.RECORDS_COL_ACTIONS),
      key: 'actions',
      fixed: 'right',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            aria-label={intl.formatMessage(messages.RECORDS_EDIT_ARIA, { name: record.name })}
          />
          <Popconfirm
            title={intl.formatMessage(messages.RECORDS_DELETE_CONFIRM_TITLE)}
            description={intl.formatMessage(messages.RECORDS_DELETE_CONFIRM_DESC, {
              name: record.name,
            })}
            onConfirm={() => void handleDelete(record.id)}
            okText={intl.formatMessage(messages.RECORDS_DELETE_OK)}
            okButtonProps={{ danger: true }}
            cancelText={intl.formatMessage(messages.RECORDS_DELETE_CANCEL)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label={intl.formatMessage(messages.RECORDS_DELETE_ARIA, { name: record.name })}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filtered = searchText
    ? records.filter(
        (r) =>
          r.name.toLowerCase().includes(searchText.toLowerCase()) ||
          r.email.toLowerCase().includes(searchText.toLowerCase()),
      )
    : records;

  return (
    <App>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4} style={{ marginBottom: 0 }}>
            {intl.formatMessage(messages.RECORDS_PAGE_TITLE)}
          </Title>
          <Space>
            <Input
              placeholder={intl.formatMessage(messages.RECORDS_SEARCH_PLACEHOLDER)}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 260 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              {intl.formatMessage(messages.RECORDS_ADD_BUTTON)}
            </Button>
          </Space>
        </Space>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) =>
              intl.formatMessage(messages.RECORDS_PAGINATION_TOTAL, { total }),
            onChange: (page, size) => void fetchRecords(page, size),
          }}
          scroll={{ x: 800 }}
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

export default RecordsPage;
