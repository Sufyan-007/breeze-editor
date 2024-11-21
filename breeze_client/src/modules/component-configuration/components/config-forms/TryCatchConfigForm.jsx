import PropTypes from 'prop-types';
import { useState } from 'react';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField, CustomSwitchField } from '../../../../common/fields';

function TryCatchConfigForm({ onSubmit, onCancel, formData: initialData, editMode }) {
  const initialTryCatchConfig = JSON.parse(JSON.stringify(funcConfigTemplates['tryCatch']));
  const [formData, setFormData] = useState(initialData || { ...initialTryCatchConfig });

  const toggleFinallyBody = () => {
    setFormData((state) => ({
      ...state,
      finallyBody: state.finallyBody ? null : { type: 'BLOCK', statements: [] },
    }));
  };

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
          <div>Add Try Catch Block</div>
          <div>
            <CustomSwitchField
              name="finally"
              checked={!!formData.finallyBody || false}
              onChange={() => toggleFinallyBody()}
              config={{
                label: 'Include Finally Block',
                groupClass: 'form-group form-switch my-2',
                className: 'form-check-input br-form-switch-input me-2',
              }}
            />
          </div>
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
