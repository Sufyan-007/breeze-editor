import PropTypes from 'prop-types';
import { inputTypeMapping } from '../../constants/FormConstants';

const getAllQuotedStringsContent = (typeString) => {
  const regex = /"([^"]*)"/g;
  const matches = typeString.match(regex)?.map((str) => str.replace(/"/g, ''));
  return matches || [];
};
const determineInputType = (typeString) => {
  const typeCounts = {
    // boolean: typeString.includes('boolean') ? 1 : 0,
    number: typeString.includes('number') ? 1 : 0,
    string: typeString.includes('string') ? 1 : 0,
  };

  const validTypeCount = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);

  if (validTypeCount > 1) {
    return 'text';
  }

  // if (typeCounts.booean === 1) return 'checkbox';
  if (typeCounts.number === 1) return 'number';
  if (typeCounts.string === 1) return 'text';

  return 'text';
};

const PropsDynamicInput = ({ property, handlePropChange, configuredPropsList }) => {
  const { prop_name, default_value, type } = property;
  const options = getAllQuotedStringsContent(type);
  const inputType = determineInputType(type);

  const value =
    configuredPropsList && configuredPropsList[prop_name] ? configuredPropsList[prop_name]?.value : default_value;
  console.log('value', configuredPropsList);

  return (
    <span style={{ width: '40%' }}>
      {options.length > 0 ? (
        <select
          className="form-control-sm w-100 br-background-secondary br-text-primary border-0 removeFocusedBorder"
          defaultValue={default_value}
          onChange={(e) => handlePropChange(e, prop_name, inputTypeMapping[inputType])}
        >
          <option value="">Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="form-control-sm w-100 br-background-secondary br-text-primary border-0 removeFocusedBorder"
          type={inputType}
          value={
            configuredPropsList &&
            (configuredPropsList[property.prop_name]
              ? configuredPropsList[property.prop_name]?.value
              : property.default_value)
          }
          onChange={(e) => handlePropChange(e, prop_name, inputTypeMapping[inputType])}
        />
      )}
    </span>
  );
};
PropsDynamicInput.propTypes = {
  property: PropTypes.shape({
    prop_name: PropTypes.string.isRequired,
    default_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
  }).isRequired,
  handlePropChange: PropTypes.func.isRequired,
  configuredPropsList: PropTypes.object.isRequired,
};

export default PropsDynamicInput;
