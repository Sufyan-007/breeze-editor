import PropTypes from 'prop-types';
import { useState } from 'react';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField, CustomTextInput } from '../../../../common/fields';

function DoWhileConfigForm({ onSubmit, formData: initialData, editMode }) {
  const initialDoWhileConfig = JSON.parse(JSON.stringify(funcConfigTemplates['doWhileBlock']));
  const [formData, setFormData] = useState(initialData || { ...initialDoWhileConfig });

  function updateCondition(value) {
    setFormData((state) => {
      state.condition.value = value;
      return { ...state };
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editMode) setFormData(initialDoWhileConfig);
  };
  return (
    <form className="doWhileBlock-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div>
            <CustomTextInput
              name="whileCondition"
              value={formData?.condition.value}
              onChange={(value) => updateCondition(value)}
              config={{
                label: 'While Condition',
                groupClass: 'form-group mb-2',
              }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end pb-3">
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

DoWhileConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.object,
  editMode: PropTypes.bool,
};

export default DoWhileConfigForm;
