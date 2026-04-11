import { ArrowLeftOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Badge,
  Button,
  Card,
  Collapse,
  Form,
  Popconfirm,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { FORM_ERROR } from 'final-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form as FinalForm, FormSpy, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { recordsService } from '../../api/recordsService';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import { useGuardedNavigate, useSetNavigationGuard } from '../../hooks/useNavigationGuard.jsx';
import useUnsavedChangesBlocker from '../../hooks/useUnsavedChangesBlocker.js';
import { createLogger } from '../../utils/logger.js';

import messages from './messages.js';
import CompensationSection from './sections/Compensation/CompensationSection.jsx';
import HistorySection from './sections/History/HistorySection.jsx';
import PersonalInfoSection from './sections/PersonalInfo/PersonalInfoSection.jsx';
import PreferencesSection from './sections/Preferences/PreferencesSection.jsx';
import SummarySection from './sections/Summary/SummarySection.jsx';
import WorkInfoSection from './sections/WorkInfo/WorkInfoSection.jsx';

const log = createLogger('RecordDetail');

const { Title, Text } = Typography;

/** Blocks browser tab close / refresh and registers with the navigation guard context. */
const UnsavedChangesGuard = ({ guardMessages }) => {
  const { dirty } = useFormState({ subscription: { dirty: true } });
  useUnsavedChangesBlocker(dirty);
  useSetNavigationGuard(dirty, guardMessages);
  return null;
};

/** Renders a section label with an error count badge derived from the field name prefix. */
const SectionLabel = ({ label, prefix }) => (
  <FormSpy subscription={{ errors: true, submitFailed: true, touched: true }}>
    {({ errors = {}, submitFailed, touched = {} }) => {
      const count = Object.keys(errors).filter(
        (key) => key.startsWith(`${prefix}.`) && (submitFailed || touched[key]),
      ).length;
      return (
        <span>
          {label}
          {count > 0 && (
            <Badge count={count} size="small" style={{ marginLeft: 8, boxShadow: 'none' }} />
          )}
        </span>
      );
    }}
  </FormSpy>
);

const RecordDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const intl = useIntl();

  const isNew = id === undefined; // mounted on /records/new (no :id param)

  const [record, setRecord] = useState(isNew ? {} : null);
  const [loading, setLoading] = useState(!isNew);

  const guardedNavigate = useGuardedNavigate();
  const backPath = `/results${location.state?.search ? `?${location.state.search}` : ''}`;

  const guardMessages = useMemo(
    () => ({
      title: intl.formatMessage(messages.DETAIL_UNSAVED_TITLE),
      content: intl.formatMessage(messages.DETAIL_UNSAVED_DESC),
      okText: intl.formatMessage(messages.DETAIL_UNSAVED_OK),
      cancelText: intl.formatMessage(messages.DETAIL_UNSAVED_CANCEL),
    }),
    [intl],
  );

  // ─── Load (edit mode only) ───────────────────────────────────────────────────

  const loadRecord = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recordsService.getById(id);
      setRecord(data);
    } catch (err) {
      log.error('Failed to load record', err);
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
        navigate(`/records/${created.uuid}`, { replace: true, state: location.state });
      } else {
        await recordsService.update(id, values);
        void message.success(intl.formatMessage(messages.DETAIL_SUCCESS));
        setRecord(values);
      }
    } catch (err) {
      log.error(isNew ? 'Failed to create record' : 'Failed to save record', err);
      return {
        [FORM_ERROR]: intl.formatMessage(
          isNew ? messages.DETAIL_CREATE_ERROR : messages.DETAIL_ERROR_SUBMIT,
        ),
      };
    }
  };

  const handleDelete = async () => {
    try {
      await recordsService.remove(id);
      void message.success(intl.formatMessage(messages.DETAIL_DELETE_SUCCESS));
      navigate(backPath);
    } catch (err) {
      log.error('Failed to delete record', err);
      void message.error(intl.formatMessage(messages.DETAIL_ERROR_DELETE));
    }
  };

  // ─── Loading / empty states ──────────────────────────────────────────────────

  if (loading) {
    return (
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Skeleton.Input active size="small" style={{ width: 260 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton.Button active size="medium" />
          <Skeleton.Input active style={{ width: 200 }} />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} size="small">
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
        ))}
      </Space>
    );
  }

  if (!isNew && !record) return null;

  // ─── Accordion items ─────────────────────────────────────────────────────────

  const collapseItems = [
    {
      key: 'personal',
      label: (
        <SectionLabel
          label={intl.formatMessage(messages.DETAIL_SECTION_PERSONAL)}
          prefix="personalInfo"
        />
      ),
      forceRender: true,
      children: <PersonalInfoSection />,
    },
    {
      key: 'work',
      label: (
        <SectionLabel label={intl.formatMessage(messages.DETAIL_SECTION_WORK)} prefix="workInfo" />
      ),
      forceRender: true,
      children: <WorkInfoSection />,
    },
    {
      key: 'preferences',
      label: (
        <SectionLabel
          label={intl.formatMessage(messages.DETAIL_SECTION_PREFERENCES)}
          prefix="preferences"
        />
      ),
      forceRender: true,
      children: <PreferencesSection />,
    },
    {
      key: 'compensation',
      label: (
        <SectionLabel
          label={intl.formatMessage(messages.DETAIL_SECTION_COMPENSATION)}
          prefix="compensation"
        />
      ),
      forceRender: true,
      children: <CompensationSection />,
    },
    {
      key: 'history',
      label: intl.formatMessage(messages.DETAIL_SECTION_HISTORY),
      forceRender: true,
      children: <HistorySection />,
    },
    {
      key: 'summary',
      label: intl.formatMessage(messages.DETAIL_SECTION_SUMMARY),
      forceRender: true,
      children: <SummarySection />,
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <FinalForm onSubmit={handleSubmit} initialValues={record}>
      {({ handleSubmit: submit, submitting, submitError, hasValidationErrors }) => (
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <UnsavedChangesGuard guardMessages={guardMessages} />
          {/* Breadcrumbs + Back */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Breadcrumbs
              items={[
                {
                  label: intl.formatMessage(messages.DETAIL_BREADCRUMB_DASHBOARD),
                  path: '/dashboard',
                },
                {
                  label: intl.formatMessage(messages.DETAIL_BREADCRUMB_SEARCH),
                  path: '/search',
                },
                {
                  label: intl.formatMessage(messages.DETAIL_BREADCRUMB_RESULTS),
                  path: backPath,
                },
                {
                  label: isNew
                    ? intl.formatMessage(messages.DETAIL_CREATE_TITLE)
                    : intl.formatMessage(messages.DETAIL_BREADCRUMB_RECORD),
                },
              ]}
              onNavigate={guardedNavigate}
            />
            <Button icon={<ArrowLeftOutlined />} onClick={() => guardedNavigate(backPath)}>
              {intl.formatMessage(messages.DETAIL_BACK)}
            </Button>
          </div>
          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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
              {isNew ? intl.formatMessage(messages.DETAIL_CREATE_TITLE) : record.personalInfo?.name}
            </Title>
            {!isNew && (
              <Popconfirm
                title={intl.formatMessage(messages.DETAIL_DELETE_CONFIRM_TITLE)}
                description={intl.formatMessage(messages.DETAIL_DELETE_CONFIRM_DESC, {
                  name: record.personalInfo?.name,
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
          {submitError && <Alert type="error" message={submitError} showIcon closable />}

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
              {intl.formatMessage(isNew ? messages.DETAIL_HINT_CREATE : messages.DETAIL_HINT_EDIT)}
            </Text>
          </Card>
        </Space>
      )}
    </FinalForm>
  );
};

export default RecordDetailPage;
