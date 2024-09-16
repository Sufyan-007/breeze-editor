import PropTypes from 'prop-types';

function CustomSelectField({ config, name, value, onChange, options, className, ...rest }) {
  const availableOptions = options ? options : config.options;
  console.log(availableOptions, 'available options: ');

  return (
    <select name={name} value={value} onChange={(e) => onChange(e.target.value)} className={className} {...rest}>
      {availableOptions.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

CustomSelectField.propTypes = {
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
