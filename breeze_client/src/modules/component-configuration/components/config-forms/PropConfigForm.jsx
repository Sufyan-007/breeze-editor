import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../../contexts/ThemeContext';
import {
  CustomCheckBoxField,
  CustomTextInput,
  CustomSelectField,
  CustomTextArea,
  MonacoEditor,
  CustomButtonField,
} from '../../../../common/fields';
import { BreezeDatatypes } from '../../constants/FormConstants';
import { initialPropConfig } from '../../constants/ResourcesFormData';
import { validator } from '../../../../utils/Validator';

function PropConfigForm({ onSubmit, onCancel, formData: initialData, editMode = false }) {
  const [formData, setFormData] = useState(initialData || initialPropConfig);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isFormValid = [formData.name].every(Boolean);
    if (!isFormValid) {
      return;
    }
    onSubmit(formData);
    setFormData(initialPropConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialPropConfig);
    setIsSubmitted(false);
    onCancel();
  };

  return (
    <div className="prop-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div className="row">
            <div className="col-8">
              <CustomTextInput
                name="name"
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                config={{
                  label: 'Prop Name',
                  groupClass: 'form-group mb-2',
                }}
                customValidations={[validator.REQUIRED, validator.CANNOT_CONTAIN_SPACE]}
                isSubmitted={isSubmitted}
              />
            </div>
            <div className="col-4 mt-3">
              <CustomCheckBoxField
                name="isRequired"
                value={formData.isRequired || false}
                onChange={(value) => handleChange('isRequired', value)}
                config={{ label: 'Is Required', groupClass: 'form-check mt-3' }}
              />
            </div>
          </div>
          <CustomSelectField
            name="dataType"
            value={formData.dataType || 'CUSTOM'}
            onChange={(value) => handleChange('dataType', value)}
            options={BreezeDatatypes}
            config={{
              label: 'Data Type',
              groupClass: 'form-group mb-2',
            }}
          />
          <label className="form-label br-text-primary med-font fw-semibold">Default Value</label>
          <MonacoEditor
            defaultValue={formData.defaultValue || ''}
            onChange={(value) => handleChange('defaultValue', value)}
            language="javascript"
            height="100px"
            theme={projectTheme}
            config={{ label: 'Default Value' }}
          />
          <CustomTextArea
            name="description"
            value={formData.description || ''}
            onChange={(value) => handleChange('description', value)}
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

PropConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string,
    isRequired: PropTypes.bool,
    dataType: PropTypes.string,
    defaultValue: PropTypes.string,
    description: PropTypes.string,
  }),
  editMode: PropTypes.bool,
};

export default PropConfigForm;
