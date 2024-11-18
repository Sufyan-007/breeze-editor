import PropTypes from 'prop-types';

function CustomCheckBoxField({ name, onChange, value, config, className, ...rest }) {
  return (
    <div className={config ? config.groupClass : 'form-check'}>
      {config && config.label && (
        <label className={config.labelClass || 'form-label br-text-primary med-font fw-semibold'}>{config.label}</label>
      )}
      <input
        type="checkbox"
        name={name}
        checked={value}
        className={config ? (config.className ? config.className : 'form-check-input br-form-check-input') : className}
        onChange={(e) => onChange(e.target.checked)}
        {...rest}
      />
    </div>
  );
}

CustomCheckBoxField.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  className: PropTypes.string,
};

export default CustomCheckBoxField;
