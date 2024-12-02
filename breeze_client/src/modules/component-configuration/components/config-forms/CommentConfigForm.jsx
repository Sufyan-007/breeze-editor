import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField, CustomTextArea } from '../../../../common/fields';
import PropTypes from 'prop-types';
import { useState } from 'react';

function CommentConfigForm({ onSubmit, onCancel, editMode }) {
  const initialCommentConfig = JSON.parse(JSON.stringify(funcConfigTemplates['comment']));
  const [formData, setFormData] = useState({ ...initialCommentConfig });

  const updateText = (value) => {
    setFormData((state) => {
      state.text = value;
      return { ...state };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialCommentConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialCommentConfig);
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
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
};

export default CommentConfigForm;
