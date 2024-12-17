import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import { CustomRadioButtonField, CustomButtonField, CustomTextInput } from '../../../../common/fields';
import { availableDependentVars, lifecycleTypes } from '../../constants/FormConstants';
import { initialLifecycleConfig } from '../../constants/ResourcesFormData';

function LifecycleConfigForm({ getConfig, onSubmit, onCancel, editMode, onUpdate }) {
  const [formData, setFormData] = useState(initialLifecycleConfig);
  const [selectedDependencies, setSelectedDependencies] = useState([]);

  const fetchConfig = useCallback(async () => {
    const res = await getConfig();
    const config = res.config;
    const dependencyValues =
      config.lifecycleType === 'onDependency'
        ? config.dependencies.map((dep) => ({ label: dep.value, value: dep.value }))
        : [];
    setFormData(config);
    setSelectedDependencies(dependencyValues);
  }, [getConfig]);

  // To change when var api available.
  // const fetchConfig = useCallback(async () => {
  //   const res = await getConfig();
  //   setFormData(res.config);
  //   if (res.config.lifecycleType === 'onDependency') {
  //     const dependencyValues = res.config.dependencies.map((dep) => dep.$ref);
  //     setSelectedDependencies(dependencyValues);
  //   }
  // }, [getConfig]);
  // Also modify at other places where 'TOKEN' used. { type: 'TOKEN', value: dep }

  useEffect(() => {
    if (editMode) {
      fetchConfig();
    }
  }, [editMode, fetchConfig]);

  const handleChange = (field, value) => {
    let updatedData = { ...formData, [field]: value };

    if (field === 'lifecycleType') {
      if (value === 'onInitialMount') {
        updatedData.dependencies = [];
        setSelectedDependencies([]);
      } else if (value === 'onEveryMount') {
        updatedData.dependencies = null;
        setSelectedDependencies([]);
      } else if (value === 'onDependency') {
        const dependencyRefs = selectedDependencies.map((dep) => ({
          type: 'TOKEN',
          value: dep.value,
        }));
        updatedData.dependencies = dependencyRefs;
      }
    }

    setFormData(updatedData);
  };

  const handleDependenciesChange = (options) => {
    setSelectedDependencies(options);
    const dependencyRefs = options.map((opt) => ({
      type: 'TOKEN',
      value: opt.value,
    }));

    setFormData((prevData) => ({
      ...prevData,
      dependencies: dependencyRefs,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalDependencies =
      formData.lifecycleType === 'onDependency'
        ? selectedDependencies.map((dep) => ({
            type: 'TOKEN',
            value: dep.value,
          }))
        : formData.lifecycleType === 'onInitialMount'
          ? []
          : null;

    const finalData = {
      ...formData,
      dependencies: finalDependencies,
    };

    if (editMode) {
      onUpdate(finalData);
    } else {
      onSubmit(finalData);
    }
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
            <div className="form-group mb-2">
              <label className="form-label br-text-primary med-font fw-semibold me-2">Dependent Variables</label>
              <CreatableSelect
                isMulti
                value={selectedDependencies}
                onChange={handleDependenciesChange}
                options={availableDependentVars}
                placeholder="Add dependent variables..."
                className="react-select-container br-background-secondary br-text-primary"
                classNamePrefix="react-select"
              />
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end">
          <CustomButtonField
            type="button"
            label="Cancel"
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
  getConfig: PropTypes.func,
  editMode: PropTypes.bool,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default LifecycleConfigForm;
