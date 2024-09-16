import PropTypes from 'prop-types';

function CustomRadioButtonField({ name, value, onChange, className, options, config, ...rest }) {
  const availableOptions = options ? options : config.options;
  return (
    <div className={className ? className : config.className}>
      {availableOptions.map((option, index) => (
        <label key={index} className={className ? className : config.className}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className={className ? className : config.className}
            {...rest}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

CustomRadioButtonField.propTypes = {
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
