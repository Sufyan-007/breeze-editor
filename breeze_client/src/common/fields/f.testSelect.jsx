import PropTypes from 'prop-types';

function CustomSelectField({ config, name, value, onChange, options, ...rest }) {
  const availableOptions = options ? options : config.options;
  console.log(availableOptions, 'available options: ');

  return (
    <div className={config.groupClass || 'form-group m-1'}>
      {config.label && <label className={config.labelClass || 'form-label'}>{config.label}</label>}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={config.className || 'form-control m-1'}
        {...rest}
      >
        {availableOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

CustomSelectField.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomSelectField;
