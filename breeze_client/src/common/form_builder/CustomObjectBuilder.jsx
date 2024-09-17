import CustomFormBuilder from './CustomFormBuilder';
import { evaluateConditions } from './utils/HelperFunctions';
import PropTypes from 'prop-types';
function CustomObjectBuilder({ config, value, onChange, styles, metaData, otherStates, ...rest }) {
  const internalChange = (key, updatedValue) => {
    const updatedItems = { ...value, [key]: updatedValue };
    onChange(updatedItems);
  };

  const shouldRenderObject = config.condition
    ? evaluateConditions(config.condition.conditions, metaData, config.condition.operation, otherStates)
    : true;

  return (
    <div className={config.groupClass || 'form-group'}>
      {shouldRenderObject && (
        <>
          {Object.entries(config.properties).map(([key, fieldConfig]) => {
            const shouldRenderField = fieldConfig.condition
              ? evaluateConditions(
                  fieldConfig.condition.conditions,
                  metaData,
                  fieldConfig.condition.operation,
                  otherStates
                )
              : true;

            return shouldRenderField ? (
              <CustomFormBuilder
                config={fieldConfig}
                value={value[key]}
                onChange={(updatedValue) => internalChange(key, updatedValue)}
                styles={styles}
                metaData={metaData}
                otherStates={otherStates}
                {...rest}
              />
            ) : null;
          })}
        </>
      )}
    </div>
  );
}
CustomObjectBuilder.propTypes = {
  config: PropTypes.any,
  value: PropTypes.objectOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object,
  metaData: PropTypes.object,
  otherStates: PropTypes.object,
};
export default CustomObjectBuilder;
