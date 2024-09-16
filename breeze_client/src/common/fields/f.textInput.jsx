import PropTypes from 'prop-types';
export const CustomTextInput = ({ name, value, onChange, config, ...rest }) => {
  console.log('input ==>>', config, value);
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={config.className}
      {...rest}
    />
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
