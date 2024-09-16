import PropTypes from 'prop-types';

function CustomCheckBoxField({ name, onChange, className, value, config, ...rest }) {
  return (
    <div className={className ? className : config.className}>
      <label className={className ? className : config.className}>{name}</label>
      <input type="checkbox" name={name} checked={value} onChange={onChange} {...rest} />
    </div>
  );
}

CustomCheckBoxField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.shape({
    wrapper: PropTypes.string,
    label: PropTypes.string,
  }),
  value: PropTypes.bool.isRequired,
};

export default CustomCheckBoxField;
