import PropTypes from 'prop-types';
import { validateField } from './utils/Validations';
import CustomButtonField from '../fields/f.button';
import CustomSelectField from '../fields/f.testSelect';
import CustomCheckBoxField from '../fields/f.checkbox';
import CustomRadioButtonField from '../fields/f.radio';
import CustomArrayBuilder from './CustomArrayBuilder';
import CustomObjectBuilder from './CustomObjectBuilder';
import { CustomTextInput } from '../fields/f.textInput';
import { CustomNumberInput } from '../fields/f.numericInput';
import { evaluateConditions } from './utils/HelperFunctions';
import CustomRecordBuilder from './CustomRecordBuilder';

const Components = {
  TEXT: CustomTextInput,
  NUMBER: CustomNumberInput,
  BUTTON: CustomButtonField,
  SELECT: CustomSelectField,
  CHECKBOX: CustomCheckBoxField,
  RADIO: CustomRadioButtonField,
  OBJECT: CustomObjectBuilder,
  ARRAY: CustomArrayBuilder,
  RECORD: CustomRecordBuilder,
};

function CustomFormBuilder({ config, value, onChange, styles, metaData, otherStates, ...rest }) {
  const type = config.type;
  const errors = config.validation ? validateField(value, config.validation) : [];

  const CustomComponent = Components[type] || Components.TEXT;
  const condition = config.condition;
  const shouldRender = condition
    ? evaluateConditions(config.condition.conditions, metaData, config.condition.operation, otherStates)
    : true;
  if (type === 'OBJECT') {
    {
      return (
        <>
          {((condition && shouldRender) || !condition) && (
            <div className={config.groupClass || 'form-group'}>
              {config.label && <label className={config.labelClass || 'form-label'}>{config.label}</label>}
              <CustomObjectBuilder
                styles={styles}
                config={config}
                value={value}
                onChange={onChange}
                metaData={metaData}
                otherStates={otherStates}
              />
            </div>
          )}
        </>
      );
    }
  } else if (type === 'ARRAY') {
    {
      return (
        <>
          {((condition && shouldRender) || !condition) && (
            <div className={config.groupClass || 'form-group'}>
              <label className={config.labelClass || 'form-label'}>{config.label}</label>
              <CustomArrayBuilder
                styles={styles}
                config={config}
                value={value}
                onChange={onChange}
                metaData={metaData}
                otherStates={otherStates}
              />
            </div>
          )}
        </>
      );
    }
  } else if (type === 'RECORD') {
    {
      return (
        <>
          {((condition && shouldRender) || !condition) && (
            <>
              <label>{config.label}</label>
              <CustomRecordBuilder
                styles={styles}
                config={config}
                value={value}
                onChange={onChange}
                metaData={metaData}
                otherStates={otherStates}
              />
            </>
          )}
        </>
      );
    }
  } else {
    return (
      <>
        {((condition && shouldRender) || !condition) && (
          <>
            <CustomComponent
              style={config.styles}
              config={config}
              value={value}
              defaultValue={value}
              onChange={onChange}
              metaData={metaData}
              otherStates={otherStates}
              {...rest}
            />

            {errors.length > 0 && (
              <div>
                <ul className="error-messages">
                  {errors.map((error, index) => (
                    <li key={index} className="text-danger">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </>
    );
  }
}

CustomFormBuilder.propTypes = {
  config: PropTypes.any,
  metaData: PropTypes.object,
  otherStates: PropTypes.object,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    form: PropTypes.string,
    fieldWrapper: PropTypes.object,
    label: PropTypes.object,
    input: PropTypes.object,
    text: PropTypes.object,
    button: PropTypes.object,
  }),
};

export default CustomFormBuilder;
