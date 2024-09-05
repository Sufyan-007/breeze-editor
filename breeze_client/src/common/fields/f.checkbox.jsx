import PropTypes from 'prop-types';

function CustomCheckBoxField({ name, onChange, className, value, ...rest }) {
  return (
    <div className={className?.wrapper}>
      <label className={className?.label}>{name}</label>
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
