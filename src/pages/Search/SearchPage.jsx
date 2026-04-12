import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Card, Button, Space, Form, Row, Col } from 'antd';
import { Form as FinalForm } from 'react-final-form';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import { ROUTES } from '../../constants/routes.js';
import { SelectField, TextField } from '../../components/fields/index.js';
import { useLookups } from '../../hooks/useLookups.js';
import { useValidators } from '../../hooks/useValidators.js';

import messages from './messages.js';

const SearchPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { departments, statuses } = useLookups();
  const { email, minLength } = useValidators();

  const handleSearch = (values) => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    navigate(`${ROUTES.RESULTS}?${params.toString()}`);
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Breadcrumbs
        items={[
          {
            label: intl.formatMessage(messages.SEARCH_BREADCRUMB_DASHBOARD),
            path: ROUTES.DASHBOARD,
          },
          { label: intl.formatMessage(messages.SEARCH_BREADCRUMB) },
        ]}
      />
      <Card>
        <FinalForm onSubmit={handleSearch}>
          {({ handleSubmit, form, hasValidationErrors }) => (
            <Form layout="vertical" component="div">
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <TextField
                    name="name"
                    label={intl.formatMessage(messages.SEARCH_FIELD_NAME)}
                    placeholder={intl.formatMessage(messages.SEARCH_FIELD_NAME_PLACEHOLDER)}
                    validate={minLength(2)}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <TextField
                    name="email"
                    label={intl.formatMessage(messages.SEARCH_FIELD_EMAIL)}
                    placeholder={intl.formatMessage(messages.SEARCH_FIELD_EMAIL_PLACEHOLDER)}
                    validate={email()}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <SelectField
                    name="department"
                    label={intl.formatMessage(messages.SEARCH_FIELD_DEPARTMENT)}
                    placeholder={intl.formatMessage(messages.SEARCH_FIELD_DEPARTMENT_PLACEHOLDER)}
                    options={departments}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <SelectField
                    name="status"
                    label={intl.formatMessage(messages.SEARCH_FIELD_STATUS)}
                    placeholder={intl.formatMessage(messages.SEARCH_FIELD_STATUS_PLACEHOLDER)}
                    options={statuses}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <TextField
                    name="address"
                    label={intl.formatMessage(messages.SEARCH_FIELD_ADDRESS)}
                    placeholder={intl.formatMessage(messages.SEARCH_FIELD_ADDRESS_PLACEHOLDER)}
                    validate={minLength(2)}
                  />
                </Col>
              </Row>

              <Space style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  disabled={hasValidationErrors}
                  onClick={() => void handleSubmit()}
                >
                  {intl.formatMessage(messages.SEARCH_SUBMIT)}
                </Button>
                <Button icon={<ClearOutlined />} onClick={() => form.reset()}>
                  {intl.formatMessage(messages.SEARCH_RESET)}
                </Button>
              </Space>
            </Form>
          )}
        </FinalForm>
      </Card>
    </Space>
  );
};

export default SearchPage;
