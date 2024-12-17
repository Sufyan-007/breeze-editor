import PropTypes from 'prop-types';
import { CustomButtonField, CustomTextArea, CustomTextInput, MonacoEditor } from '../../../../common/fields';
import Select from 'react-select';
import { BreezeDatatypes } from '../../constants/FormConstants';
import { useCallback, useContext, useEffect, useState } from 'react';
import ThemeContext from '../../../../contexts/ThemeContext';
import { initialStateVarConfig } from '../../constants/ResourcesFormData';
import { validator } from '../../../../utils/Validator';

function StateVariableConfigForm({ getConfig, onSubmit, onCancel, editMode, onUpdate }) {
  const [formData, setFormData] = useState(initialStateVarConfig);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchConfig = useCallback(async () => {
    const res = await getConfig();
    setFormData(res.config);
  }, [getConfig]);

  useEffect(() => {
    if (editMode) {
      fetchConfig();
    }
  }, [fetchConfig, editMode]);

  const transformToReactSelectOptions = (data) => data.map((item) => ({ value: item.value, label: item.label }));

  const handleChange = useCallback((field, value) => {
    setFormData((formData) => {
      if (field === 'defaultValue') {
        return {
          ...formData,
          defaultValue: { type: 'CUSTOM', value },
        };
      }
      if (field === 'dataType') {
        return {
          ...formData,
          dataType: {
            ...formData.dataType,
            types: value.map((option) => ({ type: option.value })),
          },
        };
      }
      return { ...formData, [field]: value };
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isFormValid = [formData.varName].every(Boolean);
    if (!isFormValid) {
      return;
    }
    if (editMode) {
      onUpdate(formData);
    } else {
      onSubmit(formData);
    }
    setFormData(initialStateVarConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialStateVarConfig);
    setIsSubmitted(false);
    onCancel();
  };

  return (
    <form className="state-variable-config-form h-100">
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
          <label className="form-label br-text-primary med-font fw-semibold">Data Type</label>
          <span className="text-danger"> *</span>
          <Select
            isMulti
            name="dataType"
            value={transformToReactSelectOptions(BreezeDatatypes).filter((option) =>
              formData.dataType.types.map((type) => type.type).includes(option.value)
            )}
            onChange={(value) => handleChange('dataType', value)}
            options={transformToReactSelectOptions(BreezeDatatypes)}
            className="react-select-container mb-3"
            classNamePrefix="react-select"
          />
          <label className="form-label br-text-primary med-font fw-semibold">Default Value</label>
          <MonacoEditor
            defaultValue={formData.defaultValue.value || ''}
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

StateVariableConfigForm.propTypes = {
  getConfig: PropTypes.func,
  editMode: PropTypes.bool,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default StateVariableConfigForm;
