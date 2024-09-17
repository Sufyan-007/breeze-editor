import PropTypes from 'prop-types';
export const CustomTextInput = ({ name, value, onChange, config, ...rest }) => {
  return (
    <div className={config.groupClass || 'form-group'}>
      {config.label && <label className={config.labelClass || 'form-label'}>{config.label}</label>}
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={config.className || 'form-control'}
        {...rest}
      />
    </div>
  );
};

CustomTextInput.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.shape({
    input: PropTypes.string,
  }),
};
