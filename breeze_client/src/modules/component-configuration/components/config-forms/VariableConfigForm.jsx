import { useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../../contexts/ThemeContext';
import {
  CustomTextInput,
  CustomSelectField,
  CustomTextArea,
  MonacoEditor,
  CustomButtonField,
} from '../../../../common/fields';
import { BreezeDatatypes, VariableTypes, DeclarationTypes } from '../../constants/FormConstants';
import { initialVariableConfig } from '../../constants/ResourcesFormData';

function VariableConfigForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialVariableConfig);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  const handleChange = useCallback((field, value) => {
    setFormData((formData) => {
      return { ...formData, [field]: value };
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('formData::>>', formData);
    onSubmit(formData);
    setFormData(initialVariableConfig);
  };

  return (
    <form className="variable-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="varName"
            value={formData.varName}
            onChange={(value) => handleChange('varName', value)}
            config={{
              label: 'Variable Name',
              groupClass: 'form-group mb-2',
            }}
          />

          <CustomSelectField
            name="varType"
            value={formData.varType}
            onChange={(value) => handleChange('varType', value)}
            options={VariableTypes}
            config={{ label: 'Variable Type', groupClass: 'form-group mb-2' }}
          />

          {formData.varType === 'othervar' && (
            <CustomSelectField
              name="declarationType"
              value={formData.declarationType}
              onChange={(value) => handleChange('declarationType', value)}
              options={DeclarationTypes}
              config={{
                label: 'Declaration Type',
                groupClass: 'form-group mb-2',
              }}
            />
          )}
          <CustomSelectField
            name="dataType"
            value={formData.dataType}
            onChange={(value) => handleChange('dataType', value)}
            options={BreezeDatatypes}
            config={{
              label: 'Data Type',
              groupClass: 'form-group mb-2',
            }}
          />
          <label className="form-label br-text-primary med-font fw-semibold">Default Value</label>
          <MonacoEditor
            defaultValue={formData.defaultValue}
            onChange={(value) => handleChange('defaultValue', value)}
            language="javascript"
            height="100px"
            theme={projectTheme}
            config={{ label: 'Default Value' }}
          />
          <CustomTextArea
            name="description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            config={{ label: 'Description', groupClass: 'form-group my-2' }}
          />
        </div>
        <div className="d-flex justify-content-end">
          <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </form>
  );
}

VariableConfigForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default VariableConfigForm;
