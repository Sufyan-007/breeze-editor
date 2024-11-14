import PropTypes from 'prop-types';

function CustomSelectField({ config, name, value, onChange, options, className, sendSelectedOption = false, ...rest }) {
  const availableOptions = options ? options : config.options;
  return (
    <div className={config ? config.groupClass : 'form-group'}>
      {config && config.label && (
        <label className={config.labelClass || 'form-label br-text-primary med-font fw-semibold'}>{config.label}</label>
      )}
      <select
        name={name}
        value={value}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (sendSelectedOption) {
            const selectedOption = availableOptions.find((option) => option.value === e.target.value);
            onChange(selectedOption);
          } else {
            onChange(e.target.value);
          }
        }}
        className={
          config ? (config.className ? config.className : 'form-select br-form-select form-select-sm') : className
        }
        {...rest}
      >
        {availableOptions ? (
          <>
            {/* <option value="">{'Select'}</option> */}
            {availableOptions.map((option, index) => (
              <option key={index} value={option.value} data-source={option.dataSource}>
                {option.label}
              </option>
            ))}
          </>
        ) : (
          <option value={''}>{'No Option Available'}</option>
        )}
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
  sendSelectedOption: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomSelectField;
