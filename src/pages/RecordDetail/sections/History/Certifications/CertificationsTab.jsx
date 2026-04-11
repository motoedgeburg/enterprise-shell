import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Form as FinalForm, useForm, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { DateField, TextField } from '../../../../../components/fields/index.js';
import { useValidators } from '../../../../../hooks/useValidators.js';

import messages from './messages.js';

const { Text } = Typography;

const certStatus = (expiryDate) => {
  if (!expiryDate) return { label: 'No Expiry', color: 'blue' };
  return dayjs(expiryDate).isAfter(dayjs())
    ? { label: 'Active', color: 'green' }
    : { label: 'Expired', color: 'red' };
};

const CertificationsTab = () => {
  const intl = useIntl();
  const form = useForm();
  const { values } = useFormState({ subscription: { values: true } });
  const certs = values.certifications ?? [];
  const { required } = useValidators();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setOpen(true);
  };

  const handleDelete = (id) =>
    form.change(
      'certifications',
      certs.filter((c) => c.id !== id),
    );

  const handleSubmit = (vals) => {
    if (editing) {
      form.change(
        'certifications',
        certs.map((c) => (c.id === editing.id ? { ...editing, ...vals } : c)),
      );
    } else {
      form.change('certifications', [...certs, { ...vals, id: `cert-${Date.now()}` }]);
    }
    setOpen(false);
  };

  const columns = [
    {
      title: intl.formatMessage(messages.DETAIL_CERTS_COL_NAME),
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => {
        const { label } = certStatus(record.expiryDate);
        return (
          <Space orientation="vertical" size={2}>
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
        footer={null}
        destroyOnHidden
        width={480}
      >
        <FinalForm onSubmit={handleSubmit} initialValues={editing ?? {}}>
          {({ handleSubmit: submitForm }) => (
            <form onSubmit={submitForm} style={{ marginTop: 16 }}>
              <TextField
                name="name"
                label={intl.formatMessage(messages.DETAIL_CERTS_COL_NAME)}
                placeholder="AWS Solutions Architect"
                required
                validate={required()}
              />
              <TextField
                name="issuingBody"
                label={intl.formatMessage(messages.DETAIL_CERTS_COL_ISSUER)}
                placeholder="Amazon Web Services"
                required
                validate={required()}
              />
              <TextField
                name="credentialId"
                label={intl.formatMessage(messages.DETAIL_CERTS_CREDENTIAL_ID)}
                placeholder="Optional"
              />
              <DateField
                name="issueDate"
                label={intl.formatMessage(messages.DETAIL_CERTS_COL_ISSUE_DATE)}
                required
                validate={required()}
              />
              <DateField
                name="expiryDate"
                label={intl.formatMessage(messages.DETAIL_CERTS_COL_EXPIRY)}
                placeholder="Leave blank if no expiry"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <Button onClick={() => setOpen(false)}>
                  {intl.formatMessage(messages.DETAIL_DELETE_CANCEL)}
                </Button>
                <Button type="primary" htmlType="submit">
                  {editing
                    ? intl.formatMessage(messages.DETAIL_SUBMIT)
                    : intl.formatMessage(messages.DETAIL_CERTS_ADD)}
                </Button>
              </div>
            </form>
          )}
        </FinalForm>
      </Modal>
    </>
  );
};

export default CertificationsTab;
