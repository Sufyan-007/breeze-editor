import React from 'react';
import PropTypes from 'prop-types';
import { validateField } from './utils/Validations';
import CustomButtonField from '../fields/f.button';
import { CustomNumberInput, CustomTextInput } from './utils/NormalFields';
import CustomSelectField from '../fields/f.testSelect';
import CustomCheckBoxField from '../fields/f.checkbox';
import CustomRadioButtonField from '../fields/f.radio';

const Components = {
  TEXT: CustomTextInput,
  NUMBER: CustomNumberInput,
  BUTTON: CustomButtonField,
  SELECT: CustomSelectField,
  CHECKBOX: CustomCheckBoxField,
  RADIO: CustomRadioButtonField,
};

function CustomFormBuilder({ config, formValues, onFormValueChange, styles }) {
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldConfig = config.find((field) => field.name === name);
    const fieldValue = type === 'checkbox' ? checked : value;
    const error = fieldConfig ? validateField(fieldValue, fieldConfig.validation) : null;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (onFormValueChange) onFormValueChange({ name, value: fieldValue });
  };

  return (
    <form className={styles?.form}>
      {config.map((field) => {
        const { order, name, type, label, ...rest } = field;
        const CustomComponent = Components[type] || Components.TEXT;
        const errorMessage = errors[name];
        const componentStyle = styles?.[type.toLowerCase()] || styles?.input;
        const fieldValue =
          type === 'CHECKBOX'
            ? formValues[name] || false
            : type === 'RADIO'
              ? formValues[name] || ''
              : formValues[name] || '';
        return (
          <div key={order} className={styles?.fieldWrapper}>
            {type !== 'BUTTON' && <label className={styles?.label}>{label}</label>}
            <CustomComponent
              name={name}
              value={fieldValue}
              checked={type === 'CHECKBOX' ? fieldValue : undefined}
              onChange={handleChange}
              className={componentStyle}
              {...rest}
            />
            {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
          </div>
        );
      })}
    </form>
  );
}

CustomFormBuilder.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      order: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['TEXT', 'NUMBER', 'BUTTON', 'SELECT', 'CHECKBOX', 'RADIO']).isRequired,
      label: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      validation: PropTypes.shape({
        required: PropTypes.bool,
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
        pattern: PropTypes.instanceOf(RegExp),
        min: PropTypes.number,
        max: PropTypes.number,
        noSpaces: PropTypes.bool,
        requireSpaces: PropTypes.bool,
      }),
      onBlur: PropTypes.func,
      onClick: PropTypes.func,
      placeholder: PropTypes.string,
      style: PropTypes.object,
    })
  ).isRequired,
  formValues: PropTypes.object.isRequired,
  onFormValueChange: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    form: PropTypes.object,
    fieldWrapper: PropTypes.object,
    label: PropTypes.object,
    input: PropTypes.object,
    button: PropTypes.object,
  }),
};

export default CustomFormBuilder;
