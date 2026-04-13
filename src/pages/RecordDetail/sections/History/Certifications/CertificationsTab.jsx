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

const certStatus = (expiryDate, intl) => {
  if (!expiryDate)
    return { label: intl.formatMessage(messages.DETAIL_CERTS_STATUS_NO_EXPIRY), color: 'blue' };
  return dayjs(expiryDate).isAfter(dayjs())
    ? { label: intl.formatMessage(messages.DETAIL_CERTS_STATUS_ACTIVE), color: 'green' }
    : { label: intl.formatMessage(messages.DETAIL_CERTS_STATUS_EXPIRED), color: 'red' };
};

const CertificationsTab = () => {
  const intl = useIntl();
  const form = useForm();
  const { values } = useFormState({ subscription: { values: true } });
  const certs = values.history?.certifications ?? [];
  const { required } = useValidators();

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openAdd = () => {
    setEditIndex(null);
    setOpen(true);
  };

  const openEdit = (index) => {
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = (index) =>
    form.change(
      'history.certifications',
      certs.filter((_, i) => i !== index),
    );

  const handleSubmit = (vals) => {
    if (editIndex !== null) {
      form.change(
        'history.certifications',
        certs.map((c, i) => (i === editIndex ? { ...c, ...vals } : c)),
      );
    } else {
      form.change('history.certifications', [...certs, { ...vals, id: null }]);
    }
    setOpen(false);
  };

  const columns = [
    {
      title: intl.formatMessage(messages.DETAIL_CERTS_COL_NAME),
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => {
        const { label } = certStatus(record.expiryDate, intl);
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
        const { label, color } = certStatus(record.expiryDate, intl);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: 72,
      render: (_, _record, index) => (
        <Space size={4}>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(index)} />
          <Popconfirm
            title={intl.formatMessage(messages.DETAIL_CERTS_DELETE_CONFIRM)}
            onConfirm={() => handleDelete(index)}
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
        rowKey={(record, index) => record.id ?? `new-${index}`}
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
          editIndex !== null ? messages.DETAIL_CERTS_EDIT_TITLE : messages.DETAIL_CERTS_ADD_TITLE,
        )}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
        width={480}
      >
        <FinalForm
          onSubmit={handleSubmit}
          initialValues={editIndex !== null ? certs[editIndex] : {}}
        >
          {({ handleSubmit: submitForm }) => (
            <form onSubmit={submitForm} style={{ marginTop: 16 }}>
              <TextField
                name="name"
                label={intl.formatMessage(messages.DETAIL_CERTS_COL_NAME)}
                placeholder={intl.formatMessage(messages.DETAIL_CERTS_PLACEHOLDER_NAME)}
                required
                validate={required()}
              />
              <TextField
                name="issuingBody"
                label={intl.formatMessage(messages.DETAIL_CERTS_COL_ISSUER)}
                placeholder={intl.formatMessage(messages.DETAIL_CERTS_PLACEHOLDER_ISSUER)}
                required
                validate={required()}
              />
              <TextField
                name="credentialId"
                label={intl.formatMessage(messages.DETAIL_CERTS_CREDENTIAL_ID)}
                placeholder={intl.formatMessage(messages.DETAIL_CERTS_PLACEHOLDER_CREDENTIAL_ID)}
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
                placeholder={intl.formatMessage(messages.DETAIL_CERTS_PLACEHOLDER_EXPIRY)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <Button onClick={() => setOpen(false)}>
                  {intl.formatMessage(messages.DETAIL_MODAL_CANCEL)}
                </Button>
                <Button type="primary" htmlType="submit">
                  {editIndex !== null
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
