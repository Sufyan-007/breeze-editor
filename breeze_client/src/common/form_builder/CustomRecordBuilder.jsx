import PropTypes from 'prop-types';
import CustomFormBuilder from './CustomFormBuilder';
import { evaluateConditions } from './utils/HelperFunctions';

function CustomRecordBuilder({ config, value, metaData, otherStates, onChange, styles, ...rest }) {
  const internalChange = (key, updatedValue) => {
    const updatedItems = { ...value };
    updatedItems[key] = updatedValue;
    onChange(updatedItems);
  };
  const shouldRenderObject = config.condition
    ? evaluateConditions(config.condition.conditions, metaData, config.condition.operation, otherStates)
    : true;
  return (
    <div className={config.groupClass || 'form-group'}>
      {shouldRenderObject &&
        Object.entries(value).map(([key, value]) => {
          return (
            <>
              <CustomFormBuilder
                key={key}
                config={config.itemType}
                value={value}
                onChange={(updatedValue) => internalChange(key, updatedValue)}
                styles={styles}
                otherStates={otherStates}
                metaData={metaData}
                {...rest}
              />
            </>
          );
        })}
    </div>
  );
}
CustomRecordBuilder.propTypes = {
  config: PropTypes.any,
  value: PropTypes.objectOf(PropTypes.any).isRequired,
  metaData: PropTypes.object,
  otherStates: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object,
};
export default CustomRecordBuilder;
