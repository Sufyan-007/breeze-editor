import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CustomTextInput,
  CustomSelectField,
  MonacoEditor,
  CustomTextArea,
  CustomButtonField,
} from '../../../../common/fields';
import { BreezeDatatypes } from '../../constants/FormConstants';
import { initialParamConfig } from '../../constants/ResourcesFormData';
import ThemeContext from '../../../../contexts/ThemeContext';
import { validator } from '../../../../utils/Validator';

function ParamForm({ param, onSubmit, onCancel, editMode }) {
  const [formData, setFormData] = useState(param || initialParamConfig);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormData(param);
  }, [param]);

  const handleParamChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isFormValid = [formData.name, formData.dataType].every(Boolean);
    if (!isFormValid) {
      return;
    }
    onSubmit(formData);
    if (!editMode) setFormData(initialParamConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialParamConfig);
    setIsSubmitted(false);
    onCancel();
  };

  return (
    <div className="param-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="name"
            value={formData.name || ''}
            onChange={(value) => handleParamChange('name', value)}
            config={{
              label: 'Param Name',
              groupClass: 'form-group mb-2',
            }}
            customValidations={[validator.REQUIRED, validator.CANNOT_CONTAIN_SPACE]}
            isSubmitted={isSubmitted}
          />
          <CustomSelectField
            name="dataType"
            value={formData.dataType || 'CUSTOM'}
            onChange={(value) => handleParamChange('dataType', value)}
            options={BreezeDatatypes}
            config={{
              label: 'Data Type',
              groupClass: 'form-group mb-2',
            }}
            customValidations={[validator.REQUIRED]}
            isSubmitted={isSubmitted}
          />
          <label className="form-label br-text-primary med-font fw-semibold">Default Value</label>
          <MonacoEditor
            defaultValue={formData.defaultValue || ''}
            onChange={(value) => handleParamChange('defaultValue', value)}
            language="javascript"
            height="100px"
            theme={projectTheme}
            config={{ label: 'Default Value' }}
          />
          <CustomTextArea
            name="description"
            value={formData.description || ''}
            onChange={(value) => handleParamChange('description', value)}
            config={{ label: 'Description', groupClass: 'form-group my-2' }}
          />
          <div className="d-flex justify-content-end">
            <CustomButtonField
              type="button"
              label={'Cancel'}
              className="btn br-secondary-button med-font mx-2"
              onClick={handleCancel}
            />
            <CustomButtonField
              type="button"
              label={editMode ? 'Update' : 'Add'}
              className="btn br-secondary-button med-font"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ParamForm.propTypes = {
  param: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

export default ParamForm;
