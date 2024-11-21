import PropTypes from 'prop-types';
import { useState } from 'react';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField } from '../../../../common/fields';

function TryCatchConfigForm({ onSubmit, onCancel, formData: initialData, editMode }) {
  const initialTryCatchConfig = JSON.parse(JSON.stringify(funcConfigTemplates['tryCatch']));
  const [formData, setFormData] = useState(initialData || { ...initialTryCatchConfig });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editMode) setFormData(initialTryCatchConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialTryCatchConfig);
    onCancel();
  };

  return (
    <form className="doWhileBlock-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div>Add Try Catch</div>
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

TryCatchConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  formData: PropTypes.object,
  editMode: PropTypes.bool,
};

export default TryCatchConfigForm;
