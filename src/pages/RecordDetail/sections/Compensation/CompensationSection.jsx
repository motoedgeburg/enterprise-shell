import { Alert, Col, Row } from 'antd';
import { useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import {
  CurrencyField,
  DateField,
  NumberField,
  SelectField,
  SwitchField,
} from '../../../../components/fields/index.js';
import { useLookups } from '../../../../hooks/useLookups.js';
import { useValidators } from '../../../../hooks/useValidators.js';

import messages from './messages.js';

const CompensationSection = () => {
  const intl = useIntl();
  const { payFrequencies } = useLookups();
  const { required, min, max, composeValidators } = useValidators();

  const { values } = useFormState({ subscription: { values: true } });
  const isInactive = values.workInfo?.status === 'inactive';

  return (
    <Row gutter={[16, 0]}>
      {isInactive && (
        <Col xs={24} style={{ marginBottom: 8 }}>
          <Alert
            type="warning"
            showIcon
            message={intl.formatMessage(messages.DETAIL_CONSTRAINT_INACTIVE)}
          />
        </Col>
      )}

      <Col xs={24} sm={12}>
        <CurrencyField
          name="compensation.baseSalary"
          label={intl.formatMessage(messages.DETAIL_FIELD_BASE_SALARY)}
          placeholder={intl.formatMessage(messages.DETAIL_PLACEHOLDER_BASE_SALARY)}
          required
          validate={composeValidators(required(), min(0))}
          disabled={isInactive}
        />
      </Col>
      <Col xs={24} sm={12}>
        <SelectField
          name="compensation.payFrequency"
          label={intl.formatMessage(messages.DETAIL_FIELD_PAY_FREQUENCY)}
          options={payFrequencies}
          required
          validate={required()}
          disabled={isInactive}
        />
      </Col>
      <Col xs={24} sm={12}>
        <NumberField
          name="compensation.bonusTarget"
          label={intl.formatMessage(messages.DETAIL_FIELD_BONUS_TARGET)}
          placeholder={intl.formatMessage(messages.DETAIL_PLACEHOLDER_BONUS_TARGET)}
          min={0}
          max={100}
          precision={1}
          suffix="%"
          validate={composeValidators(min(0), max(100))}
          disabled={isInactive}
        />
      </Col>
      <Col xs={24} sm={12}>
        <NumberField
          name="compensation.stockOptions"
          label={intl.formatMessage(messages.DETAIL_FIELD_STOCK_OPTIONS)}
          placeholder={intl.formatMessage(messages.DETAIL_PLACEHOLDER_STOCK_OPTIONS)}
          min={0}
          precision={0}
          validate={min(0)}
          disabled={isInactive}
        />
      </Col>
      <Col xs={24} sm={12}>
        <DateField
          name="compensation.effectiveDate"
          label={intl.formatMessage(messages.DETAIL_FIELD_EFFECTIVE_DATE)}
          required
          validate={required()}
          disabled={isInactive}
        />
      </Col>
      <Col xs={24} sm={12}>
        <SwitchField
          name="compensation.overtimeEligible"
          label={intl.formatMessage(messages.DETAIL_FIELD_OVERTIME_ELIGIBLE)}
          checkedLabel={intl.formatMessage(messages.DETAIL_SWITCH_YES)}
          uncheckedLabel={intl.formatMessage(messages.DETAIL_SWITCH_NO)}
          disabled={isInactive}
        />
      </Col>
    </Row>
  );
};

export default CompensationSection;
