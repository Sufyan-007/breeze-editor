import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { validator } from '../../utils/Validator';

function CustomTextInput({
  name,
  value,
  onChange,
  config,
  className,
  placeholder = '',
  isSubmitted = false,
  customValidations = [],
  ...rest
}) {
  const [hasTouched, setHasTouched] = useState(false);
  const hasRequiredValidation = customValidations.includes(validator.REQUIRED);
  const [error, setError] = useState('');

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
    onChange(e.target.value);
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
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          config ? (config.className ? config.className : 'form-control br-form-control form-control-sm') : className
        }
        placeholder={placeholder}
        disabled={config?.disabled || false}
        {...rest}
      />
      {error && <p className="small-font text-danger mb-0">{error}</p>}
    </div>
  );
}

CustomTextInput.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  isSubmitted: PropTypes.bool,
  customValidations: PropTypes.arrayOf(PropTypes.func),
};

export default CustomTextInput;
