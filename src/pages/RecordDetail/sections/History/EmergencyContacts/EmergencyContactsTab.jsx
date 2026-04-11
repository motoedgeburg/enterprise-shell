import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Empty, Modal, Popconfirm, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { Form as FinalForm, useForm, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import {
  EmailField,
  PhoneField,
  SelectField,
  TextField,
} from '../../../../../components/fields/index.js';
import { useLookups } from '../../../../../hooks/useLookups.js';
import { useValidators } from '../../../../../hooks/useValidators.js';

import messages from './messages.js';

const { Text } = Typography;

const EmergencyContactsTab = () => {
  const intl = useIntl();
  const form = useForm();
  const { values } = useFormState({ subscription: { values: true } });
  const contacts = values.history?.emergencyContacts ?? [];
  const { relationships } = useLookups();
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
      'history.emergencyContacts',
      contacts.filter((c) => c.id !== id),
    );

  const setPrimary = (id) =>
    form.change(
      'history.emergencyContacts',
      contacts.map((c) => ({ ...c, isPrimary: c.id === id })),
    );

  const handleSubmit = (vals) => {
    if (editing) {
      form.change(
        'history.emergencyContacts',
        contacts.map((c) => (c.id === editing.id ? { ...editing, ...vals } : c)),
      );
    } else {
      form.change('history.emergencyContacts', [
        ...contacts,
        { ...vals, id: `ec-${Date.now()}`, isPrimary: contacts.length === 0 },
      ]);
    }
    setOpen(false);
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
        footer={null}
        destroyOnHidden
        width={480}
      >
        <FinalForm onSubmit={handleSubmit} initialValues={editing ?? {}}>
          {({ handleSubmit: submitForm }) => (
            <form onSubmit={submitForm} style={{ marginTop: 16 }}>
              <TextField
                name="name"
                label={intl.formatMessage(messages.DETAIL_CONTACTS_COL_NAME)}
                placeholder="Jane Smith"
                required
                validate={required()}
              />
              <SelectField
                name="relationship"
                label={intl.formatMessage(messages.DETAIL_CONTACTS_COL_RELATIONSHIP)}
                placeholder="Select relationship"
                options={relationships}
                required
                validate={required()}
              />
              <PhoneField
                name="phone"
                label={intl.formatMessage(messages.DETAIL_CONTACTS_COL_PHONE)}
              />
              <EmailField
                name="email"
                label={intl.formatMessage(messages.DETAIL_CONTACTS_COL_EMAIL)}
                placeholder="jane@example.com"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <Button onClick={() => setOpen(false)}>
                  {intl.formatMessage(messages.DETAIL_DELETE_CANCEL)}
                </Button>
                <Button type="primary" htmlType="submit">
                  {editing
                    ? intl.formatMessage(messages.DETAIL_SUBMIT)
                    : intl.formatMessage(messages.DETAIL_CONTACTS_ADD)}
                </Button>
              </div>
            </form>
          )}
        </FinalForm>
      </Modal>
    </>
  );
};

export default EmergencyContactsTab;
