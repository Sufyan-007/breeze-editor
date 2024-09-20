import PropTypes from 'prop-types';
import CustomFormBuilder from './CustomFormBuilder';
import { evaluateConditions } from './utils/HelperFunctions';

function CustomArrayBuilder({ config, value, onChange, styles, metaData, otherStates, ...rest }) {
  const internalChange = (index, updatedValue) => {
    const updatedItems = [...value];
    updatedItems[index] = updatedValue;
    onChange(updatedItems);
    // value[index] = updatedValue;
    // console.log(value)
    // onChange(value);
  };

  const shouldRenderArray = config.condition
    ? evaluateConditions(config.condition.conditions, metaData, config.condition.operation, otherStates)
    : true;
  return (
    shouldRenderArray && (
      <div className={config.className}>
        {value.map((item, index) => {
          return (
            <CustomFormBuilder
              key={index}
              config={config.itemType}
              value={item}
              onChange={(updatedValue) => internalChange(index, updatedValue)}
              metaData={metaData}
              styles={styles}
              otherStates={otherStates}
              {...rest}
            />
          );
        })}
      </div>
    )
  );
}
CustomArrayBuilder.propTypes = {
  config: PropTypes.shape({
    condition: PropTypes.shape({
      conditions: PropTypes.arrayOf(PropTypes.object),
      operation: PropTypes.string,
    }),
    className: PropTypes.string,
    itemType: PropTypes.object,
  }).isRequired,
  value: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object,
  metaData: PropTypes.object,
  otherStates: PropTypes.object,
};

export default CustomArrayBuilder;
