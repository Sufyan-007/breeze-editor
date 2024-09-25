import PropTypes from 'prop-types';

function CustomSwitchField({ name, checked, onChange, config, ...rest }) {
  return (
    <div className={config.groupClass || 'form-group form-switch'}>
      <label className={config.labelClass || 'form-label br-text-primary med-font fw-semibold'}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={config.className ? config.className : 'form-check-input br-form-switch-input'}
          role="switch"
          {...rest}
        />
        {config.label}
      </label>
    </div>
  );
}

CustomSwitchField.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  config: PropTypes.shape({
    label: PropTypes.string,
    groupClass: PropTypes.string,
    labelClass: PropTypes.string,
    className: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default CustomSwitchField;
