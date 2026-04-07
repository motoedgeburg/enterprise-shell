import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { formatPhone } from '../../../../components/fields/PhoneField.jsx';

import messages from './messages.js';

const { Text } = Typography;

const RELATIONSHIPS = [
  'Spouse',
  'Partner',
  'Parent',
  'Child',
  'Sibling',
  'Friend',
  'Colleague',
  'Other',
];

const certStatus = (expiryDate) => {
  if (!expiryDate) return { label: 'No Expiry', color: 'blue' };
  return dayjs(expiryDate).isAfter(dayjs())
    ? { label: 'Active', color: 'green' }
    : { label: 'Expired', color: 'red' };
};

// ── Emergency Contacts ────────────────────────────────────────────────────────

const EmergencyContactsTab = () => {
  const intl = useIntl();
  const form = useForm();
  const { values } = useFormState({ subscription: { values: true } });
  const contacts = values.emergencyContacts ?? [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [antForm] = Form.useForm();

  const openAdd = () => {
    antForm.resetFields();
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (record) => {
    antForm.setFieldsValue(record);
    setEditing(record);
    setOpen(true);
  };

  const handleDelete = (id) =>
    form.change(
      'emergencyContacts',
      contacts.filter((c) => c.id !== id),
    );

  const setPrimary = (id) =>
    form.change(
      'emergencyContacts',
      contacts.map((c) => ({ ...c, isPrimary: c.id === id })),
    );

  const handleOk = async () => {
    try {
      const vals = await antForm.validateFields();
      if (editing) {
        form.change(
          'emergencyContacts',
          contacts.map((c) => (c.id === editing.id ? { ...editing, ...vals } : c)),
        );
      } else {
        form.change('emergencyContacts', [
          ...contacts,
          { ...vals, id: `ec-${Date.now()}`, isPrimary: contacts.length === 0 },
        ]);
      }
      setOpen(false);
    } catch {
      // validation failed — keep modal open
    }
  };

  const columns = [
    {
      title: intl.formatMessage(messages.DETAIL_CONTACTS_COL_NAME),
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space size={6}>
          {record.isPrimary ? (
            <StarFilled style={{ color: '#faad14', fontSize: 12 }} />
          ) : (
            <span style={{ display: 'inline-block', width: 12 }} />
          )}
          <Text strong={record.isPrimary}>{name}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage(messages.DETAIL_CONTACTS_COL_RELATIONSHIP),
      dataIndex: 'relationship',
      key: 'relationship',
    },
    {
      title: intl.formatMessage(messages.DETAIL_CONTACTS_COL_PHONE),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: intl.formatMessage(messages.DETAIL_CONTACTS_COL_EMAIL),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '',
      key: 'actions',
      width: 104,
      render: (_, record) => (
        <Space size={4}>
          {!record.isPrimary && (
            <Button
              size="small"
              icon={<StarOutlined />}
              title={intl.formatMessage(messages.DETAIL_CONTACTS_SET_PRIMARY)}
              onClick={() => setPrimary(record.id)}
            />
          )}
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title={intl.formatMessage(messages.DETAIL_CONTACTS_DELETE_CONFIRM)}
            onConfirm={() => handleDelete(record.id)}
            okText={intl.formatMessage(messages.DETAIL_DELETE_OK)}
            cancelText={intl.formatMessage(messages.DETAIL_DELETE_CANCEL)}
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={openAdd}>
          {intl.formatMessage(messages.DETAIL_CONTACTS_ADD)}
        </Button>
      </div>

      <Table
        dataSource={contacts}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ x: 600 }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={intl.formatMessage(messages.DETAIL_CONTACTS_EMPTY)}
            />
          ),
        }}
      />

      <Modal
        open={open}
        title={intl.formatMessage(
          editing ? messages.DETAIL_CONTACTS_EDIT_TITLE : messages.DETAIL_CONTACTS_ADD_TITLE,
        )}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        okText={
          editing
            ? intl.formatMessage(messages.DETAIL_SUBMIT)
            : intl.formatMessage(messages.DETAIL_CONTACTS_ADD)
        }
        destroyOnHidden
        width={480}
      >
        <Form form={antForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label={intl.formatMessage(messages.DETAIL_CONTACTS_COL_NAME)}
            rules={[{ required: true, message: 'Full name is required' }]}
          >
            <Input placeholder="Jane Smith" />
          </Form.Item>
          <Form.Item
            name="relationship"
            label={intl.formatMessage(messages.DETAIL_CONTACTS_COL_RELATIONSHIP)}
            rules={[{ required: true, message: 'Relationship is required' }]}
          >
            <Select
              options={RELATIONSHIPS.map((r) => ({ value: r, label: r }))}
              placeholder="Select relationship"
            />
          </Form.Item>
          <Form.Item name="phone" label={intl.formatMessage(messages.DETAIL_CONTACTS_COL_PHONE)}>
            <Input
              placeholder="(215) 555-0100"
              maxLength={14}
              onChange={(e) => {
                antForm.setFieldValue('phone', formatPhone(e.target.value));
              }}
            />
          </Form.Item>
          <Form.Item name="email" label={intl.formatMessage(messages.DETAIL_CONTACTS_COL_EMAIL)}>
            <Input placeholder="jane@example.com" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// ── Professional Certifications ───────────────────────────────────────────────

const CertificationsTab = () => {
  const intl = useIntl();
  const form = useForm();
  const { values } = useFormState({ subscription: { values: true } });
  const certs = values.certifications ?? [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [antForm] = Form.useForm();

  const openAdd = () => {
    antForm.resetFields();
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (record) => {
    antForm.setFieldsValue({
      ...record,
      issueDate: record.issueDate ? dayjs(record.issueDate) : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
    });
    setEditing(record);
    setOpen(true);
  };

  const handleDelete = (id) =>
    form.change(
      'certifications',
      certs.filter((c) => c.id !== id),
    );

  const handleOk = async () => {
    try {
      const vals = await antForm.validateFields();
      const normalized = {
        ...vals,
        issueDate: vals.issueDate ? vals.issueDate.format('YYYY-MM-DD') : null,
        expiryDate: vals.expiryDate ? vals.expiryDate.format('YYYY-MM-DD') : null,
      };
      if (editing) {
        form.change(
          'certifications',
          certs.map((c) => (c.id === editing.id ? { ...editing, ...normalized } : c)),
        );
      } else {
        form.change('certifications', [...certs, { ...normalized, id: `cert-${Date.now()}` }]);
      }
      setOpen(false);
    } catch {
      // validation failed — keep modal open
    }
  };

  const columns = [
    {
      title: intl.formatMessage(messages.DETAIL_CERTS_COL_NAME),
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => {
        const { label } = certStatus(record.expiryDate);
        return (
          <Space direction="vertical" size={2}>
            <Text style={{ opacity: label === 'Expired' ? 0.45 : 1 }}>{name}</Text>
            {record.credentialId && (
              <Text type="secondary" style={{ fontSize: 11 }}>
                ID: {record.credentialId}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: intl.formatMessage(messages.DETAIL_CERTS_COL_ISSUER),
      dataIndex: 'issuingBody',
      key: 'issuingBody',
    },
    {
      title: intl.formatMessage(messages.DETAIL_CERTS_COL_ISSUE_DATE),
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (d) => (d ? dayjs(d).format('MMM D, YYYY') : '—'),
    },
    {
      title: intl.formatMessage(messages.DETAIL_CERTS_COL_EXPIRY),
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (d) => (d ? dayjs(d).format('MMM D, YYYY') : '—'),
    },
    {
      title: intl.formatMessage(messages.DETAIL_CERTS_COL_STATUS),
      key: 'status',
      width: 100,
      render: (_, record) => {
        const { label, color } = certStatus(record.expiryDate);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: 72,
      render: (_, record) => (
        <Space size={4}>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title={intl.formatMessage(messages.DETAIL_CERTS_DELETE_CONFIRM)}
            onConfirm={() => handleDelete(record.id)}
            okText={intl.formatMessage(messages.DETAIL_DELETE_OK)}
            cancelText={intl.formatMessage(messages.DETAIL_DELETE_CANCEL)}
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={openAdd}>
          {intl.formatMessage(messages.DETAIL_CERTS_ADD)}
        </Button>
      </div>

      <Table
        dataSource={certs}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ x: 700 }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={intl.formatMessage(messages.DETAIL_CERTS_EMPTY)}
            />
          ),
        }}
      />

      <Modal
        open={open}
        title={intl.formatMessage(
          editing ? messages.DETAIL_CERTS_EDIT_TITLE : messages.DETAIL_CERTS_ADD_TITLE,
        )}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        okText={
          editing
            ? intl.formatMessage(messages.DETAIL_SUBMIT)
            : intl.formatMessage(messages.DETAIL_CERTS_ADD)
        }
        destroyOnHidden
        width={480}
      >
        <Form form={antForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label={intl.formatMessage(messages.DETAIL_CERTS_COL_NAME)}
            rules={[{ required: true, message: 'Certification name is required' }]}
          >
            <Input placeholder="AWS Solutions Architect" />
          </Form.Item>
          <Form.Item
            name="issuingBody"
            label={intl.formatMessage(messages.DETAIL_CERTS_COL_ISSUER)}
            rules={[{ required: true, message: 'Issuing body is required' }]}
          >
            <Input placeholder="Amazon Web Services" />
          </Form.Item>
          <Form.Item
            name="credentialId"
            label={intl.formatMessage(messages.DETAIL_CERTS_CREDENTIAL_ID)}
          >
            <Input placeholder="Optional" />
          </Form.Item>
          <Form.Item
            name="issueDate"
            label={intl.formatMessage(messages.DETAIL_CERTS_COL_ISSUE_DATE)}
            rules={[{ required: true, message: 'Issue date is required' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="expiryDate" label={intl.formatMessage(messages.DETAIL_CERTS_COL_EXPIRY)}>
            <DatePicker style={{ width: '100%' }} placeholder="Leave blank if no expiry" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// ── Section wrapper ───────────────────────────────────────────────────────────

const HistorySection = () => {
  const intl = useIntl();

  return (
    <Tabs
      size="small"
      items={[
        {
          key: 'contacts',
          label: intl.formatMessage(messages.DETAIL_TAB_CONTACTS),
          children: <EmergencyContactsTab />,
        },
        {
          key: 'certifications',
          label: intl.formatMessage(messages.DETAIL_TAB_CERTIFICATIONS),
          children: <CertificationsTab />,
        },
      ]}
    />
  );
};

export default HistorySection;
