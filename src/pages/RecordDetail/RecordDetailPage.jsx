import { ArrowLeftOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Card,
  Collapse,
  Form,
  Popconfirm,
  Space,
  Spin,
  Typography,
} from 'antd';
import { FORM_ERROR } from 'final-form';
import { useCallback, useEffect, useState } from 'react';
import { Form as FinalForm } from 'react-final-form';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { recordsService } from '../../api/recordsService';

import messages from './messages.js';
import HistorySection from './sections/History/HistorySection.jsx';
import PersonalInfoSection from './sections/PersonalInfo/PersonalInfoSection.jsx';
import PreferencesSection from './sections/Preferences/PreferencesSection.jsx';
import SummarySection from './sections/Summary/SummarySection.jsx';
import WorkInfoSection from './sections/WorkInfo/WorkInfoSection.jsx';

const { Title, Text } = Typography;

const RecordDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const intl = useIntl();

  const isNew = id === undefined; // mounted on /records/new (no :id param)

  const [record, setRecord] = useState(isNew ? {} : null);
  const [loading, setLoading] = useState(!isNew);

  const backPath = `/results${location.state?.search ? `?${location.state.search}` : ''}`;

  // ─── Load (edit mode only) ───────────────────────────────────────────────────

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

  useEffect(() => {
    if (!isNew) void loadRecord();
  }, [isNew, loadRecord]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSubmit = async (values) => {
    try {
      if (isNew) {
        const created = await recordsService.create(values);
        void message.success(intl.formatMessage(messages.DETAIL_CREATE_SUCCESS));
        navigate(`/records/${created.id}`, { replace: true, state: location.state });
      } else {
        await recordsService.update(parseInt(id, 10), values);
        void message.success(intl.formatMessage(messages.DETAIL_SUCCESS));
        setRecord(values);
      }
    } catch {
      return {
        [FORM_ERROR]: intl.formatMessage(
          isNew ? messages.DETAIL_CREATE_ERROR : messages.DETAIL_ERROR_SUBMIT,
        ),
      };
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

  // ─── Loading / empty states ──────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isNew && !record) return null;

  // ─── Accordion items ─────────────────────────────────────────────────────────

  const collapseItems = [
    {
      key: 'personal',
      label: intl.formatMessage(messages.DETAIL_SECTION_PERSONAL),
      children: <PersonalInfoSection />,
    },
    {
      key: 'work',
      label: intl.formatMessage(messages.DETAIL_SECTION_WORK),
      children: <WorkInfoSection />,
    },
    {
      key: 'preferences',
      label: intl.formatMessage(messages.DETAIL_SECTION_PREFERENCES),
      children: <PreferencesSection />,
    },
    {
      key: 'history',
      label: intl.formatMessage(messages.DETAIL_SECTION_HISTORY),
      children: <HistorySection />,
    },
    {
      key: 'summary',
      label: intl.formatMessage(messages.DETAIL_SECTION_SUMMARY),
      children: <SummarySection />,
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <FinalForm onSubmit={handleSubmit} initialValues={record}>
      {({ handleSubmit: submit, submitting, submitError, hasValidationErrors }) => (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backPath)}>
              {intl.formatMessage(messages.DETAIL_BACK)}
            </Button>
            <Title
              level={4}
              style={{
                margin: 0,
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {isNew ? intl.formatMessage(messages.DETAIL_CREATE_TITLE) : record.name}
            </Title>
            {!isNew && (
              <Popconfirm
                title={intl.formatMessage(messages.DETAIL_DELETE_CONFIRM_TITLE)}
                description={intl.formatMessage(messages.DETAIL_DELETE_CONFIRM_DESC, {
                  name: record.name,
                })}
                onConfirm={handleDelete}
                okText={intl.formatMessage(messages.DETAIL_DELETE_OK)}
                okButtonProps={{ danger: true }}
                cancelText={intl.formatMessage(messages.DETAIL_DELETE_CANCEL)}
              >
                <Button danger icon={<DeleteOutlined />}>
                  {intl.formatMessage(messages.DETAIL_DELETE_OK)}
                </Button>
              </Popconfirm>
            )}
          </div>

          {/* Form error banner */}
          {submitError && <Alert type="error" message={submitError} showIcon />}

          {/* Accordion */}
          <Form layout="vertical" component="div">
            <Collapse
              items={collapseItems}
              defaultActiveKey={['personal']}
              style={{ background: 'transparent' }}
            />
          </Form>

          {/* Submit footer */}
          <Card size="small">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={submitting}
              disabled={hasValidationErrors}
              onClick={() => void submit()}
              size="large"
            >
              {intl.formatMessage(isNew ? messages.DETAIL_CREATE_SUBMIT : messages.DETAIL_SUBMIT)}
            </Button>
            <Text type="secondary" style={{ marginLeft: 16 }}>
              {isNew
                ? 'Fill in all sections then submit to create the record.'
                : 'Changes are saved across all sections on a single submit.'}
            </Text>
          </Card>
        </Space>
      )}
    </FinalForm>
  );
};

export default RecordDetailPage;
