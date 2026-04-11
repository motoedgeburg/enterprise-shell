/**
 * AntField (base adapter) tests.
 *
 * Covers:
 *   - Renders label
 *   - Shows required asterisk
 *   - Shows validation error after touch
 *   - Passes value/onChange/onBlur to children
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from 'antd';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import AntField from '../AntField.jsx';

function renderField(props = {}, initialValues = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => (
          <AntField name="test" label="Test Label" {...props}>
            {({ value, onChange, onBlur }) => (
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                data-testid="input"
              />
            )}
          </AntField>
        )}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('AntField', () => {
  it('renders the label', () => {
    renderField();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    renderField({ required: true });
    // Ant Design renders a required asterisk as part of the label wrapper
    const label = screen.getByText('Test Label');
    const formItemLabel = label.closest('.ant-form-item-label');
    expect(formItemLabel.querySelector('.ant-form-item-required')).toBeTruthy();
  });

  it('shows validation error after blur', async () => {
    const user = userEvent.setup();
    const alwaysFail = () => 'Field is required';
    renderField({ validate: alwaysFail });
    const input = screen.getByTestId('input');
    await user.click(input);
    await user.tab();
    await waitFor(() => expect(screen.getByText('Field is required')).toBeInTheDocument());
  });

  it('passes initial value to child', () => {
    renderField({}, { test: 'hello' });
    expect(screen.getByTestId('input')).toHaveValue('hello');
  });
});
