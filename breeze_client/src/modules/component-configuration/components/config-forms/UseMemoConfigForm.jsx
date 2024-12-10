import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomTextInput, CustomMultiSelectField, CustomButtonField, CustomTextArea } from '../../../../common/fields';
import { availableDependentVars } from '../../constants/FormConstants';
import { initialUseMemoConfig } from '../../constants/ResourcesFormData';
import { validator } from '../../../../utils/Validator';

function UseMemoConfigForm({ getConfig, onSubmit, onCancel, editMode, onUpdate }) {
  const [formData, setFormData] = useState(initialUseMemoConfig);
  const [selectedDependencies, setSelectedDependencies] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchConfig = useCallback(async () => {
    const res = await getConfig();
    const config = res.config;
    const dependencyValues = config.dependencies.map((dep) => dep.value);
    setFormData(config);
    setSelectedDependencies(dependencyValues);
  }, [getConfig]);

  useEffect(() => {
    if (editMode) {
      fetchConfig();
    }
  }, [editMode, fetchConfig]);

  const handleChange = (field, value) => {
    let updatedData = { ...formData, [field]: value };

    if (field === 'dependencies') {
      const formattedDependencies = value.map((dep) => ({ type: 'TOKEN', value: dep }));
      updatedData = { ...updatedData, dependencies: formattedDependencies };
      setSelectedDependencies(value);
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isFormValid = [formData.varName].every(Boolean);
    if (!isFormValid) {
      return;
    }
    const formattedData = {
      ...formData,
      dependencies: formData.dependencies.map((dep) => ({
        type: 'TOKEN',
        value: dep.value,
      })),
    };

    if (editMode) {
      onUpdate(formattedData);
    } else {
      onSubmit(formattedData);
    }
    setFormData(initialUseMemoConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialUseMemoConfig);
    setIsSubmitted(false);
    onCancel();
  };

  return (
    <form className="use-memo-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="hookName"
            value={formData.varName || ''}
            onChange={(value) => handleChange('varName', value)}
            config={{ label: 'Hook Name', groupClass: 'form-group mb-2' }}
            customValidations={[validator.REQUIRED, validator.CANNOT_CONTAIN_SPACE]}
            isSubmitted={isSubmitted}
          />
          <CustomTextArea
            name="hookDescription"
            value={formData.description || ''}
            onChange={(value) => handleChange('description', value)}
            config={{ label: 'Hook Description', groupClass: 'form-group mb-2' }}
          />

          <CustomMultiSelectField
            name="dependencies"
            values={selectedDependencies || []}
            onChange={(value) => handleChange('dependencies', value)}
            options={availableDependentVars}
            config={{
              label: 'Dependent Variables',
              groupClass: 'form-group mb-3',
            }}
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

UseMemoConfigForm.propTypes = {
  getConfig: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export default UseMemoConfigForm;
