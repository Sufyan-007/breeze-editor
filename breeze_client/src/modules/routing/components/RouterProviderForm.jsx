import { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomSelectField, CustomButtonField } from '../../../common/fields';

function RouterProviderForm({ onSubmit, initialData, availableComponents }) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialData);
  };

  return (
    <div>
      <h6>Router Provider Configuration</h6>
      <form>
        <CustomSelectField
          name="fallbackElement"
          options={availableComponents}
          config={{ label: 'Fallback Element', groupClass: 'form-group mb-2' }}
          onChange={(value) => handleChange('fallbackElement', value)}
          value={formData.fallbackElement}
        />
        <div className="d-flex justify-content-end">
          <CustomButtonField type="button" label="Submit" className="btn btn-filled" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
}

RouterProviderForm.propTypes = {
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  availableComponents: PropTypes.array,
};

export default RouterProviderForm;
