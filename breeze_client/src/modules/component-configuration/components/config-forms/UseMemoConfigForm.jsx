import { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomTextInput, CustomMultiSelectField, CustomButtonField, CustomTextArea } from '../../../../common/fields';
import { availableDependentVars } from '../../constants/FormConstants';
import { initialUseMemoConfig } from '../../constants/ResourcesFormData';

function UseMemoConfigForm({ onSubmit, onCancel, editMode }) {
  const [formData, setFormData] = useState(initialUseMemoConfig);
  const [selectedDependencies, setSelectedDependencies] = useState([]);

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
    onSubmit(formData);
    if (!editMode) setFormData(initialUseMemoConfig);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialUseMemoConfig);
    onCancel();
  };

  return (
    <form className="use-memo-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="hookName"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            config={{ label: 'Hook Name', groupClass: 'form-group mb-2' }}
          />
          <CustomTextArea
            name="hookDescription"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            config={{ label: 'Hook Description', groupClass: 'form-group mb-2' }}
          />

          <CustomMultiSelectField
            name="dependencies"
            values={selectedDependencies}
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
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
};

export default UseMemoConfigForm;
