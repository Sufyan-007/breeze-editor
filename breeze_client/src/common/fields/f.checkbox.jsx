import PropTypes from 'prop-types';

function CustomCheckBoxField({ name, onChange, value, config, className, ...rest }) {
  return (
    <div className={config.groupClass || 'form-check'}>
      {config.label && <label className={config.labelClass || 'form-check-label'}>{config.label}</label>}
      <input
        type="checkbox"
        name={name}
        checked={value}
        className={config ? (config.className ? config.className : 'form-check-input') : className}
        onChange={(e) => onChange(e.target.checked)}
        {...rest}
      />
    </div>
  );
}

CustomCheckBoxField.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default CustomCheckBoxField;
