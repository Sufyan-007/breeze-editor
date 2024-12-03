import { useContext, useMemo, useState } from 'react';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField, MonacoEditor } from '../../../../common/fields';
import ThemeContext from '../../../../contexts/ThemeContext';
import PropTypes from 'prop-types';

function CustomCode({ onSubmit, onCancel, editMode }) {
  const initialCustomCodeConfig = JSON.parse(JSON.stringify(funcConfigTemplates['customCode']));
  const [formData, setFormData] = useState({ ...initialCustomCodeConfig });
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  const updateCode = (value) => {
    setFormData((state) => {
      state.body = value;
      return { ...state };
    });
  };

  const generateUniqueId = useMemo(() => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialCustomCodeConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialCustomCodeConfig);
    onCancel();
  };

  return (
    <form className="variable-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          {' '}
          <label className="form-label br-text-primary med-font fw-semibold">Default Value</label>
          <MonacoEditor
            defaultValue={formData.body || ''}
            onChange={(value) => {
              updateCode(value);
            }}
            id={generateUniqueId}
            language="javascript"
            height="300px"
            theme={projectTheme}
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

CustomCode.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
};

export default CustomCode;
