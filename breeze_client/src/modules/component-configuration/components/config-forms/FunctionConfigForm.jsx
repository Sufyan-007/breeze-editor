import { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomTextInput, CustomCheckBoxField, CustomButtonField } from '../../../../common/fields';
import FunctionParams from '../helper-components/FunctionParams';
import { initialFunctionConfig } from '../../constants/ResourcesFormData';

function FunctionConfigForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFunctionConfig);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('formData::>>', formData);
    onSubmit(formData);
    setFormData(initialFunctionConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialFunctionConfig);
    onCancel();
  };

  return (
    <form className="function-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="functionName"
            value={formData.functionName}
            onChange={(value) => handleChange('functionName', value)}
            config={{ label: 'Function Name', groupClass: 'form-group mb-2' }}
          />
          <div className="d-flex mt-3">
            <CustomCheckBoxField
              name="isAsync"
              value={formData.isAsync}
              onChange={(value) => handleChange('isAsync', value)}
              config={{ label: 'Is Async', groupClass: 'form-check me-2' }}
            />
            <CustomCheckBoxField
              name="isAnonymous"
              value={formData.isAnonymous}
              onChange={(value) => handleChange('isAnonymous', value)}
              config={{ label: 'Is Anonymous', groupClass: 'form-check mx-2' }}
            />
          </div>
          <CustomTextInput
            name="description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            config={{ label: 'Description', groupClass: 'form-group mb-2' }}
          />
          <FunctionParams params={formData.params} setParams={(params) => handleChange('params', params)} />
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

FunctionConfigForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default FunctionConfigForm;
