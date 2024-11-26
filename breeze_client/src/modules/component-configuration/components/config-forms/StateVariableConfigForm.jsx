import PropTypes from 'prop-types';
import {
  CustomButtonField,
  CustomSelectField,
  CustomTextArea,
  CustomTextInput,
  MonacoEditor,
} from '../../../../common/fields';
import { BreezeDatatypes } from '../../constants/FormConstants';
import { useCallback, useContext, useState } from 'react';
import ThemeContext from '../../../../contexts/ThemeContext';
import { initialStateVarConfig } from '../../constants/ResourcesFormData';

function StateVariableConfigForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialStateVarConfig);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  const handleChange = useCallback((field, value) => {
    setFormData((formData) => {
      return { ...formData, [field]: value };
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialStateVarConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialStateVarConfig);
    onCancel();
  };

  return (
    <form className="state-variable-config-form h-100">
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
          <CustomButtonField
            type="button"
            label={'Cancel'}
            className="btn br-secondary-button med-font mx-2"
            onClick={handleCancel}
          />
          <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </form>
  );
}

StateVariableConfigForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default StateVariableConfigForm;
