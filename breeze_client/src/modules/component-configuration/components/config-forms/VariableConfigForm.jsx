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
import { BreezeDatatypes, DeclarationTypes } from '../../constants/FormConstants';
import { initialVariableConfig } from '../../constants/ResourcesFormData';
import { validator } from '../../../../utils/Validator';

function VariableConfigForm({ onSubmit, onCancel, editMode }) {
  const [formData, setFormData] = useState(initialVariableConfig);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = useCallback((field, value) => {
    setFormData((formData) => {
      return { ...formData, [field]: value };
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isFormValid = [formData.varName, formData.declarationType, formData.dataType].every(Boolean);
    if (!isFormValid) {
      return;
    }
    const transformedData = {
      ...formData,
      value: {
        type: ['STRING', 'NUMBER', 'BOOLEAN'].includes(formData.dataType) ? formData.dataType : 'CUSTOM',
        value: formData.defaultValue,
      },
    };
    onSubmit(transformedData);
    setFormData(initialVariableConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialVariableConfig);
    setIsSubmitted(false);
    onCancel();
  };

  return (
    <form className="variable-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="varName"
            value={formData.varName || ''}
            onChange={(value) => handleChange('varName', value)}
            config={{
              label: 'Variable Name',
              groupClass: 'form-group mb-2',
            }}
            customValidations={[validator.REQUIRED, validator.CANNOT_CONTAIN_SPACE]}
            isSubmitted={isSubmitted}
          />
          <CustomSelectField
            name="declarationType"
            value={formData.declarationType || 'const'}
            onChange={(value) => handleChange('declarationType', value)}
            options={DeclarationTypes}
            config={{
              label: 'Declaration Type',
              groupClass: 'form-group mb-2',
            }}
            customValidations={[validator.REQUIRED]}
            isSubmitted={isSubmitted}
          />
          <CustomSelectField
            name="dataType"
            value={formData.dataType || 'CUSTOM'}
            onChange={(value) => handleChange('dataType', value)}
            options={BreezeDatatypes}
            config={{
              label: 'Data Type',
              groupClass: 'form-group mb-2',
            }}
            customValidations={[validator.REQUIRED]}
            isSubmitted={isSubmitted}
          />
          <label className="form-label br-text-primary med-font fw-semibold">Default Value</label>
          {formData.declarationType === 'const' && <span className="text-danger"> *</span>}
          <MonacoEditor
            defaultValue={formData.defaultValue || ''}
            onChange={(value) => handleChange('defaultValue', value)}
            language="javascript"
            height="100px"
            theme={projectTheme}
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
          <CustomButtonField
            type="button"
            label={editMode ? 'Update' : 'Submit'}
            className="btn btn-filled med-font"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </form>
  );
}

VariableConfigForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
};

export default VariableConfigForm;
