import PropTypes from 'prop-types';

function CustomRadioButtonField({ name, value, onChange, options, config, className, ...rest }) {
  const availableOptions = options ? options : config.options;
  return (
    <div className={config.groupClass || 'form-group'}>
      {availableOptions.map((option, index) => (
        <label key={index} className={config.labelClass || 'form-label br-text-primary med-font fw-semibold'}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className={
              config ? (config.className ? config.className : 'form-check-input br-form-check-input') : className
            }
            {...rest}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

CustomRadioButtonField.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.shape({
    wrapper: PropTypes.string,
    label: PropTypes.string,
    input: PropTypes.string,
  }),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomRadioButtonField;
