import {
  ArrowLeftOutlined,
  DeleteOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Card,
  Collapse,
  Descriptions,
  Divider,
  Form,
  Popconfirm,
  Row,
  Col,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { FORM_ERROR } from 'final-form';
import { useCallback, useEffect, useState } from 'react';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { recordsService } from '../../api/recordsService';
import {
  CheckboxGroupField,
  DateField,
  EmailField,
  RadioGroupField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from '../../components/fields/index.js';

import messages from './messages.js';

const { Title, Text } = Typography;

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'HR'];

// ─── RecordDetailPage ──────────────────────────────────────────────────────────

const RecordDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const intl = useIntl();

  const [record, setRecord]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Navigate back to the results page that spawned this detail view,
  // preserving the search filters if they were passed via location state.
  const backPath = `/results${location.state?.search ? `?${location.state.search}` : ''}`;

  // ─── Load record ───────────────────────────────────────────────────────────

  const loadRecord = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recordsService.getById(parseInt(id, 10));
      setRecord(data);
    } catch {
      void message.error(intl.formatMessage(messages.DETAIL_ERROR_LOAD));
    } finally {
      setLoading(false);
    }
  }, [id, message, intl]);

  useEffect(() => { void loadRecord(); }, [loadRecord]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSubmit = async (values) => {
    try {
      await recordsService.update(parseInt(id, 10), values);
      void message.success(intl.formatMessage(messages.DETAIL_SUCCESS));
      setRecord(values);
    } catch {
      return { [FORM_ERROR]: intl.formatMessage(messages.DETAIL_ERROR_SUBMIT) };
    }
  };

  const handleDelete = async () => {
    try {
      await recordsService.remove(parseInt(id, 10));
      void message.success(intl.formatMessage(messages.DETAIL_DELETE_SUCCESS));
      navigate(backPath);
    } catch {
      void message.error(intl.formatMessage(messages.DETAIL_ERROR_DELETE));
    }
  };

  // ─── Option lists (built once per render) ──────────────────────────────────

  const employmentTypeOptions = [
    { value: 'full-time', label: intl.formatMessage(messages.DETAIL_EMPLOYMENT_FULL_TIME) },
    { value: 'part-time', label: intl.formatMessage(messages.DETAIL_EMPLOYMENT_PART_TIME) },
    { value: 'contract',  label: intl.formatMessage(messages.DETAIL_EMPLOYMENT_CONTRACT) },
    { value: 'intern',    label: intl.formatMessage(messages.DETAIL_EMPLOYMENT_INTERN) },
  ];

  const statusOptions = [
    { value: 'active',   label: intl.formatMessage(messages.DETAIL_STATUS_ACTIVE) },
    { value: 'inactive', label: intl.formatMessage(messages.DETAIL_STATUS_INACTIVE) },
  ];

  const channelOptions = [
    { value: 'email', label: intl.formatMessage(messages.DETAIL_CHANNEL_EMAIL) },
    { value: 'sms',   label: intl.formatMessage(messages.DETAIL_CHANNEL_SMS) },
    { value: 'slack', label: intl.formatMessage(messages.DETAIL_CHANNEL_SLACK) },
    { value: 'teams', label: intl.formatMessage(messages.DETAIL_CHANNEL_TEAMS) },
  ];

  const accessLevelOptions = [
    { value: 'read-only', label: intl.formatMessage(messages.DETAIL_ACCESS_READ_ONLY) },
    { value: 'standard',  label: intl.formatMessage(messages.DETAIL_ACCESS_STANDARD) },
    { value: 'admin',     label: intl.formatMessage(messages.DETAIL_ACCESS_ADMIN) },
  ];

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!record) return null;

  // ─── Accordion panel content helpers ───────────────────────────────────────

  const personalPanel = (
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <TextField
          name="name"
          label={intl.formatMessage(messages.DETAIL_FIELD_NAME)}
          placeholder="Jane Doe"
        />
      </Col>
      <Col xs={24} sm={12}>
        <EmailField
          name="email"
          label={intl.formatMessage(messages.DETAIL_FIELD_EMAIL)}
          placeholder="jane@company.com"
        />
      </Col>
      <Col xs={24} sm={12}>
        <TextField
          name="phone"
          label={intl.formatMessage(messages.DETAIL_FIELD_PHONE)}
          placeholder="(215) 555-0100"
        />
      </Col>
      <Col xs={24} sm={12}>
        <TextField
          name="address"
          label={intl.formatMessage(messages.DETAIL_FIELD_ADDRESS)}
          placeholder="123 Main St, Philadelphia, PA 19103"
        />
      </Col>
      <Col xs={24} sm={12}>
        <DateField
          name="dateOfBirth"
          label={intl.formatMessage(messages.DETAIL_FIELD_DOB)}
        />
      </Col>
      <Col xs={24}>
        <TextAreaField
          name="bio"
          label={intl.formatMessage(messages.DETAIL_FIELD_BIO)}
          placeholder="A short professional biography…"
          rows={3}
        />
      </Col>
    </Row>
  );

  const workPanel = (
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <TextField
          name="jobTitle"
          label={intl.formatMessage(messages.DETAIL_FIELD_JOB_TITLE)}
          placeholder="Software Engineer"
        />
      </Col>
      <Col xs={24} sm={12}>
        <TextField
          name="manager"
          label={intl.formatMessage(messages.DETAIL_FIELD_MANAGER)}
          placeholder="Manager name"
        />
      </Col>
      <Col xs={24} sm={12}>
        <SelectField
          name="department"
          label={intl.formatMessage(messages.DETAIL_FIELD_DEPARTMENT)}
          options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
        />
      </Col>
      <Col xs={24} sm={12}>
        <SelectField
          name="status"
          label={intl.formatMessage(messages.DETAIL_FIELD_STATUS)}
          options={statusOptions}
        />
      </Col>
      <Col xs={24} sm={12}>
        <DateField
          name="startDate"
          label={intl.formatMessage(messages.DETAIL_FIELD_START_DATE)}
        />
      </Col>
      <Col xs={24}>
        <RadioGroupField
          name="employmentType"
          label={intl.formatMessage(messages.DETAIL_FIELD_EMPLOYMENT_TYPE)}
          options={employmentTypeOptions}
          optionType="button"
          buttonStyle="solid"
        />
      </Col>
    </Row>
  );

  const preferencesPanel = (
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <SwitchField
          name="remoteEligible"
          label={intl.formatMessage(messages.DETAIL_FIELD_REMOTE_ELIGIBLE)}
          checkedLabel="Eligible"
          uncheckedLabel="Not eligible"
        />
      </Col>
      <Col xs={24} sm={12}>
        <SwitchField
          name="notificationsEnabled"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATIONS_ENABLED)}
          checkedLabel="On"
          uncheckedLabel="Off"
        />
      </Col>
      <Col xs={24}>
        <CheckboxGroupField
          name="notificationChannels"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATION_CHANNELS)}
          options={channelOptions}
        />
      </Col>
      <Col xs={24}>
        <Divider style={{ margin: '8px 0 16px' }} />
        <RadioGroupField
          name="accessLevel"
          label={intl.formatMessage(messages.DETAIL_FIELD_ACCESS_LEVEL)}
          options={accessLevelOptions}
          optionType="button"
          buttonStyle="solid"
        />
      </Col>
      <Col xs={24}>
        <TextAreaField
          name="notes"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTES)}
          placeholder="Internal notes visible to managers and HR only…"
          rows={4}
        />
      </Col>
    </Row>
  );

  const summaryPanel = (
    <FormSpy subscription={{ values: true }}>
      {({ values: v }) => (
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
          {/* Personal */}
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_NAME)} span={2}>
            {v.name || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_EMAIL)}>
            {v.email || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_PHONE)}>
            {v.phone || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_ADDRESS)} span={2}>
            {v.address || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_DOB)}>
            {v.dateOfBirth ? new Date(v.dateOfBirth).toLocaleDateString() : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_BIO)} span={2}>
            {v.bio || '—'}
          </Descriptions.Item>

          {/* Work */}
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_JOB_TITLE)}>
            {v.jobTitle || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_DEPARTMENT)}>
            {v.department || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_STATUS)}>
            {v.status
              ? <Tag color={v.status === 'active' ? 'green' : 'red'}>{v.status.toUpperCase()}</Tag>
              : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_EMPLOYMENT_TYPE)}>
            {employmentTypeOptions.find((o) => o.value === v.employmentType)?.label ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_START_DATE)}>
            {v.startDate ? new Date(v.startDate).toLocaleDateString() : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_MANAGER)}>
            {v.manager || '—'}
          </Descriptions.Item>

          {/* Preferences */}
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_REMOTE_ELIGIBLE)}>
            {v.remoteEligible ? 'Yes' : 'No'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATIONS_ENABLED)}>
            {v.notificationsEnabled ? 'On' : 'Off'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATION_CHANNELS)} span={2}>
            {v.notificationChannels?.length
              ? v.notificationChannels.map((c) => (
                  <Tag key={c}>{channelOptions.find((o) => o.value === c)?.label ?? c}</Tag>
                ))
              : intl.formatMessage(messages.DETAIL_SUMMARY_NONE)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_ACCESS_LEVEL)}>
            {accessLevelOptions.find((o) => o.value === v.accessLevel)?.label ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(messages.DETAIL_FIELD_NOTES)} span={2}>
            {v.notes || '—'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </FormSpy>
  );

  const collapseItems = [
    { key: 'personal',    label: intl.formatMessage(messages.DETAIL_SECTION_PERSONAL),    children: personalPanel },
    { key: 'work',        label: intl.formatMessage(messages.DETAIL_SECTION_WORK),        children: workPanel },
    { key: 'preferences', label: intl.formatMessage(messages.DETAIL_SECTION_PREFERENCES), children: preferencesPanel },
    { key: 'summary',     label: intl.formatMessage(messages.DETAIL_SECTION_SUMMARY),     children: summaryPanel },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <App>
      <FinalForm onSubmit={handleSubmit} initialValues={record}>
        {({ handleSubmit: submit, submitting, submitError }) => (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>

            {/* Page header */}
            <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
              <Space>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backPath)}>
                  {intl.formatMessage(messages.DETAIL_BACK)}
                </Button>
                <Title level={4} style={{ marginBottom: 0 }}>
                  {record.name}
                </Title>
              </Space>
              <Popconfirm
                title={intl.formatMessage(messages.DETAIL_DELETE_CONFIRM_TITLE)}
                description={intl.formatMessage(messages.DETAIL_DELETE_CONFIRM_DESC, { name: record.name })}
                onConfirm={handleDelete}
                okText={intl.formatMessage(messages.DETAIL_DELETE_OK)}
                okButtonProps={{ danger: true }}
                cancelText={intl.formatMessage(messages.DETAIL_DELETE_CANCEL)}
              >
                <Button danger icon={<DeleteOutlined />}>
                  {intl.formatMessage(messages.DETAIL_DELETE_OK)}
                </Button>
              </Popconfirm>
            </Space>

            {/* Form error banner */}
            {submitError && (
              <Alert type="error" message={submitError} showIcon />
            )}

            {/* Accordion */}
            <Form layout="vertical" component="div">
              <Collapse
                items={collapseItems}
                defaultActiveKey={['personal']}
                style={{ background: 'transparent' }}
              />
            </Form>

            {/* Submit */}
            <Card size="small">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={submitting}
                onClick={() => void submit()}
                size="large"
              >
                {intl.formatMessage(messages.DETAIL_SUBMIT)}
              </Button>
              <Text type="secondary" style={{ marginLeft: 16 }}>
                Changes are saved across all sections on a single submit.
              </Text>
            </Card>

          </Space>
        )}
      </FinalForm>
    </App>
  );
};

export default RecordDetailPage;
