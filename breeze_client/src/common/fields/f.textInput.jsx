import PropTypes from 'prop-types';
function CustomTextInput({ name, value, onChange, config, className, ...rest }) {
  return (
    <div className={config.groupClass || 'form-group'}>
      {config.label && <label className={config.labelClass || 'form-label'}>{config.label}</label>}
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={config ? (config.className ? config.className : 'form-control') : className}
        {...rest}
      />
    </div>
  );
}

CustomTextInput.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CustomTextInput;
