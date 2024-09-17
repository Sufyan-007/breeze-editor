import PropTypes from 'prop-types';
export const CustomNumberInput = ({ name, value, onChange, config, ...rest }) => (
  <div className={config.groupClass || 'form-check'}>
    {config.label && <label className={config.labelClass || 'form-check-label'}>{config.label}</label>}
    <input
      type="number"
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={config.className || 'form-control'}
      {...rest}
    />
  </div>
);

CustomNumberInput.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.shape({
    input: PropTypes.string,
  }),
};
