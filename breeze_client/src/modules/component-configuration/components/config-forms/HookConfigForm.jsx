import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CustomTextInput,
  CustomSelectField,
  CustomMultiSelectField,
  CustomButtonField,
} from '../../../../common/fields';
import FunctionParams from '../helper-components/FunctionParams';
import { availableDependentVars, hookTypes } from '../../constants/FormConstants';
import { initialHookConfig } from '../../constants/ResourcesFormData';

function HookConfigForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialHookConfig);

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
    setFormData(initialHookConfig);
  };

  return (
    <form className="hook-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div className="row">
            <div className="col-6">
              <CustomTextInput
                name="hookName"
                value={formData.hookName}
                onChange={(value) => handleChange('hookName', value)}
                config={{ label: 'Hook Name', groupClass: 'form-group mb-2' }}
              />
            </div>
            <div className="col-6">
              <CustomTextInput
                name="hookDescription"
                value={formData.hookDescription}
                onChange={(value) => handleChange('hookDescription', value)}
                config={{ label: 'Hook Description', groupClass: 'form-group mb-2' }}
              />
            </div>
          </div>

          <CustomSelectField
            name="hookType"
            value={formData.hookType}
            onChange={(value) => handleChange('hookType', value)}
            options={hookTypes}
            config={{ label: 'Hook Type', groupClass: 'form-group mb-2' }}
          />

          {formData.hookType === 'useCallback' && (
            <FunctionParams
              params={formData.functionParams}
              setParams={(params) => handleChange('functionParams', params)}
            />
          )}

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
        </div>

        <div className="d-flex justify-content-end">
          <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </form>
  );
}

HookConfigForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default HookConfigForm;
