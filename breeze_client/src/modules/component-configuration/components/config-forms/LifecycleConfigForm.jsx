import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CustomRadioButtonField,
  CustomMultiSelectField,
  CustomButtonField,
  CustomTextInput,
} from '../../../../common/fields';
import { availableDependentVars, lifecycleTypes } from '../../constants/FormConstants';
import { initialLifecycleConfig } from '../../constants/ResourcesFormData';

function LifecycleConfigForm({ onSubmit, onCancel, editMode }) {
  const [formData, setFormData] = useState(initialLifecycleConfig);
  const [selectedDependencies, setSelectedDependencies] = useState([]);

  useEffect(() => {
    if (editMode) {
      // fetchConfig
      // setFormData(existingData);
      // if (existingData.lifecycleType === 'onDependency' && existingData.dependencies?.values) {
      //   setSelectedDependencies(existingData.dependencies.values.map((dep) => dep.value));
      // }
    }
  }, [editMode]);

  const handleChange = (field, value) => {
    let updatedData = { ...formData, [field]: value };

    if (field === 'lifecycleType') {
      if (value === 'onInitialMount') {
        updatedData.dependencies = { type: 'ARRAY', values: [] };
        setSelectedDependencies([]);
      } else if (value === 'onDependency') {
        updatedData.dependencies = { type: 'ARRAY', values: [{ type: 'TOKEN', value: '' }] };
        setSelectedDependencies([]);
      } else if (value === 'onEveryMount') {
        updatedData.dependencies = null;
        setSelectedDependencies([]);
      }
    } else if (field === 'dependencies') {
      setSelectedDependencies(value);
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let transformedDependencies;
    if (formData.lifecycleType === 'onDependency') {
      transformedDependencies = {
        type: 'ARRAY',
        values: selectedDependencies.map((dep) => ({ type: 'TOKEN', value: dep })),
      };
    } else if (formData.lifecycleType === 'onInitialMount') {
      transformedDependencies = { type: 'ARRAY', values: [] };
    } else {
      transformedDependencies = null;
    }

    const finalData = {
      ...formData,
      dependencies: transformedDependencies,
    };

    onSubmit(finalData);
    setFormData(initialLifecycleConfig);
    setSelectedDependencies([]);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialLifecycleConfig);
    setSelectedDependencies([]);
    onCancel();
  };

  return (
    <form className="lifecycle-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            config={{ label: 'Description', groupClass: 'form-group mb-2' }}
          />

          <CustomRadioButtonField
            name="lifecycleType"
            value={formData.lifecycleType}
            options={lifecycleTypes}
            onChange={(value) => handleChange('lifecycleType', value)}
            config={{
              label: 'Lifecycle Type',
              groupClass: 'form-group',
              className: 'form-check-input br-form-check-input me-1',
              labelClass: 'form-label br-text-primary med-font fw-semibold me-2',
            }}
          />

          {formData.lifecycleType === 'onDependency' && (
            <CustomMultiSelectField
              name="dependencies"
              values={selectedDependencies}
              onChange={(value) => handleChange('dependencies', value)}
              options={availableDependentVars}
              config={{
                label: 'Dependent Variables',
                groupClass: 'form-group mb-2',
              }}
            />
          )}
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

LifecycleConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

export default LifecycleConfigForm;
