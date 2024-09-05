import PropTypes from 'prop-types';

function CustomRadioButtonField({ name, value, onChange, className, options, ...rest }) {
  return (
    <div className={className?.wrapper}>
      {options.map((option, index) => (
        <label key={index} className={className?.label}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className={className?.input}
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
