import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CustomTextInput,
  CustomRadioButtonField,
  CustomSelectField,
  CustomButtonField,
} from '../../../../common/fields';
import { initialImportConfig } from '../../constants/ResourcesFormData';
import { ImportCategories, ImportTypes } from '../../constants/FormConstants';

function ImportConfigForm({ onSubmit, onCancel, editMode = false }) {
  const [formData, setFormData] = useState(initialImportConfig);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialImportConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialImportConfig);
    onCancel();
  };

  return (
    <form className="import-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="importEntity"
            value={formData.importEntity || ''}
            onChange={(value) => handleChange('importEntity', value)}
            config={{
              label: 'Import Entity',
              groupClass: 'form-group mb-2',
            }}
          />
          <CustomTextInput
            name="importFrom"
            value={formData.importFrom || ''}
            onChange={(value) => handleChange('importFrom', value)}
            config={{
              label: 'Import From',
              groupClass: 'form-group mb-2',
            }}
          />
          <CustomRadioButtonField
            name="importType"
            value={formData.importType || 'full'}
            onChange={(value) => handleChange('importType', value)}
            options={ImportTypes}
            config={{
              label: 'Import Type',
              groupClass: 'form-group',
              className: 'form-check-input br-form-check-input me-1',
              labelClass: 'form-label br-text-primary med-font fw-semibold me-2',
            }}
          />
          <CustomSelectField
            name="category"
            value={formData.category || 'component'}
            onChange={(value) => handleChange('category', value)}
            options={ImportCategories}
            config={{
              label: 'Category',
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

ImportConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

export default ImportConfigForm;
