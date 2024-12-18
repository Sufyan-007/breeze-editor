import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField, CustomTextInput } from '../../../../common/fields';
import { validator } from '../../../../utils/Validator';

function WhileBlockConfigForm({ getConfig, onSubmit, onCancel, editMode, onUpdate }) {
  const initialWhileConfig = JSON.parse(JSON.stringify(funcConfigTemplates['whileBlock']));
  const [formData, setFormData] = useState({ ...initialWhileConfig });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchConfig = useCallback(async () => {
    const res = await getConfig();
    setFormData(res.config);
  }, [getConfig]);

  useEffect(() => {
    if (editMode) {
      fetchConfig();
    }
  }, [fetchConfig, editMode]);

  function updateCondition(value) {
    setFormData((state) => {
      state.condition.value = value;
      return { ...state };
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isFormValid = [formData.condition.value].every(Boolean);
    if (!isFormValid) {
      return;
    }
    if (editMode) {
      onUpdate(formData);
    } else {
      onSubmit(formData);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    onCancel();
  };

  return (
    <form className="whileBlock-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div>
            <CustomTextInput
              name="whileCondition"
              value={formData?.condition.value || ''}
              onChange={(value) => updateCondition(value)}
              config={{
                label: 'While Condition',
                groupClass: 'form-group mb-2',
              }}
              customValidations={[validator.REQUIRED]}
              isSubmitted={isSubmitted}
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

WhileBlockConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  getConfig: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default WhileBlockConfigForm;
