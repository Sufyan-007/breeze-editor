import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField, CustomTextArea } from '../../../../common/fields';

function ReturnConfigForm({ getConfig, onSubmit, onCancel, editMode, onUpdate }) {
  const initialReturnConfig = JSON.parse(JSON.stringify(funcConfigTemplates['return']));
  const [formData, setFormData] = useState({ ...initialReturnConfig });

  const fetchConfig = useCallback(async () => {
    const res = await getConfig();
    setFormData(res.config);
  }, [getConfig]);

  useEffect(() => {
    if (editMode) {
      fetchConfig();
    }
  }, [fetchConfig, editMode]);

  function updateText(value) {
    setFormData((state) => {
      state.value = {
        type: 'TOKEN',
        value: value,
      };
      return { ...state };
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      onUpdate(formData);
    } else {
      onSubmit(formData);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <form className="console-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div>
            <CustomTextArea
              name="Return Value"
              value={formData?.value?.value || ''}
              onChange={(value) => updateText(value)}
              config={{
                label: 'Return content',
                groupClass: 'form-group mb-2',
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

ReturnConfigForm.propTypes = {
  getConfig: PropTypes.func,
  editMode: PropTypes.bool,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ReturnConfigForm;
