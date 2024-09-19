import PropTypes from 'prop-types';

function CustomSelectField({ config, name, value, onChange, options, className, ...rest }) {
  const availableOptions = options ? options : config.options;
  return (
    <div className={config.groupClass || 'form-group'}>
      {config.label && <label className={config.labelClass || 'form-label'}>{config.label}</label>}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={config ? (config.className ? config.className : 'form-control') : className}
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
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomSelectField;
