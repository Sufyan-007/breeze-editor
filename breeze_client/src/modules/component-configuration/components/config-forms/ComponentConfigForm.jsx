import PropTypes from 'prop-types';
import { CustomButtonField, CustomTextInput } from '../../../../common/fields';
import { useState } from 'react';

function ComponentConfigForm({ onSubmit, onCancel, formData: initialData, editMode }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editMode) setFormData({});
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData({});
    onCancel();
  };

  return (
    <form className="prop-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="componentName"
            value={formData.componentName || 'Main'}
            onChange={(value) => handleChange('componentName', value)}
            config={{
              label: 'Component Name',
              groupClass: 'form-group mb-2',
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

ComponentConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  formData: PropTypes.object,
  editMode: PropTypes.bool,
};

export default ComponentConfigForm;
