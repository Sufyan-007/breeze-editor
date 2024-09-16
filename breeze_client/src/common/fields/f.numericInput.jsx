import PropTypes from 'prop-types';
export const CustomNumberInput = ({ name, value, onChange, className, ...rest }) => (
  <input
    type="number"
    name={name}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={className}
    {...rest}
  />
);

CustomNumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.shape({
    input: PropTypes.string,
  }),
};
