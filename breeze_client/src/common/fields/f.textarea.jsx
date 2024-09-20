import PropTypes from 'prop-types';

function CustomTextArea({ name, value, onChange, config, className, ...rest }) {
  return (
    <div className={config.groupClass || 'form-group'}>
      {config.label && (
        <label className={config.labelClass || 'form-label br-text-primary med-font fw-semibold'}>{config.label}</label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={config ? (config.className ? config.className : 'form-control br-form-control') : className}
        {...rest}
      />
    </div>
  );
}

CustomTextArea.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CustomTextArea;
