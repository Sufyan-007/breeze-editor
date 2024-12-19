import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField, CustomTextArea } from '../../../../common/fields';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

function CommentConfigForm({ getConfig, onSubmit, onCancel, editMode, onUpdate }) {
  const initialCommentConfig = JSON.parse(JSON.stringify(funcConfigTemplates['comment']));
  const [formData, setFormData] = useState({ ...initialCommentConfig });

  const fetchConfig = useCallback(async () => {
    const res = await getConfig();
    setFormData(res.config);
  }, [getConfig]);

  useEffect(() => {
    if (editMode) {
      fetchConfig();
    }
  }, [fetchConfig, editMode]);

  const updateText = (value) => {
    setFormData((state) => {
      state.text = value;
      return { ...state };
    });
  };

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
    <form className="comment-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextArea
            name="statement"
            value={formData?.text}
            onChange={(value) => updateText(value)}
            config={{
              label: 'Write down the content.',
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

CommentConfigForm.propTypes = {
  getConfig: PropTypes.func,
  editMode: PropTypes.bool,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default CommentConfigForm;
