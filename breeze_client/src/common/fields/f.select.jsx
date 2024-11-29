import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { validator } from '../../utils/Validator';

function CustomSelectField({
  config,
  name,
  value,
  onChange,
  options,
  className,
  sendSelectedOption = false,
  isSubmitted = false,
  customValidations = [],
  ...rest
}) {
  const [hasTouched, setHasTouched] = useState(false);
  const hasRequiredValidation = customValidations.includes(validator.REQUIRED);
  const [error, setError] = useState('');
  const availableOptions = options ? options : config.options;

  const validateField = useCallback(
    (inputValue) => {
      for (let validate of customValidations) {
        const error = validate(inputValue);
        if (error) {
          return error;
        }
      }
      return '';
    },
    [customValidations]
  );

  useEffect(() => {
    if (hasTouched || isSubmitted) {
      const validationError = validateField(value);
      setError(validationError);
    }
  }, [value, hasTouched, isSubmitted, validateField]);

  const handleBlur = () => {
    setHasTouched(true);
    const validationError = validateField(value);
    setError(validationError);
  };

  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (sendSelectedOption) {
      const selectedOption = availableOptions.find((option) => option.value === e.target.value);
      onChange(selectedOption);
    } else {
      onChange(e.target.value);
    }
    const validationError = validateField(e.target.value);
    setError(validationError);
  };

  return (
    <div className={config ? config.groupClass : 'form-group'}>
      {config && config.label && (
        <label className={config.labelClass || 'form-label br-text-primary med-font fw-semibold'}>
          {config.label} {hasRequiredValidation && <span className="text-danger"> *</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          config ? (config.className ? config.className : 'form-select br-form-select form-select-sm') : className
        }
        {...rest}
      >
        {availableOptions ? (
          <>
            {/* <option value="">{'Select'}</option> */}
            {availableOptions.map((option, index) => (
              <option
                defaultValue={option.defaultValue}
                selected={option.selected}
                disabled={option.disabled}
                hidden={option.hidden}
                key={index}
                value={option.value}
                data-source={option.dataSource}
              >
                {option.label}
              </option>
            ))}
          </>
        ) : (
          <option value={''}>{'No Option Available'}</option>
        )}
      </select>
      {error && <p className="small-font text-danger mb-0">{error}</p>}
    </div>
  );
}

CustomSelectField.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  sendSelectedOption: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  customValidations: PropTypes.arrayOf(PropTypes.func),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
};

export default CustomSelectField;
