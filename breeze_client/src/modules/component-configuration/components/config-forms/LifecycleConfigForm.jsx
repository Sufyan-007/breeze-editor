import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CustomRadioButtonField,
  CustomMultiSelectField,
  CustomButtonField,
  CustomTextInput,
} from '../../../../common/fields';
import { availableDependentVars, lifecycleTypes } from '../../constants/FormConstants';
import { initialLifecycleConfig } from '../../constants/ResourcesFormData';

function LifecycleConfigForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialLifecycleConfig);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialLifecycleConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialLifecycleConfig);
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
              name="dependentVars"
              values={formData.dependentVars}
              onChange={(value) => handleChange('dependentVars', value)}
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
          <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </form>
  );
}

LifecycleConfigForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default LifecycleConfigForm;
