import PropTypes from 'prop-types';
export const CustomTextInput = ({ name, value, onChange, className, ...rest }) => (
  <input type="text" name={name} value={value} onChange={onChange} className={className.input} {...rest} />
);
CustomTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.shape({
    input: PropTypes.string,
  }),
};
export const CustomNumberInput = ({ name, value, onChange, className, ...rest }) => (
  <input type="number" name={name} value={value} onChange={onChange} className={className.input} {...rest} />
);

CustomNumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.shape({
    input: PropTypes.string,
  }),
};
