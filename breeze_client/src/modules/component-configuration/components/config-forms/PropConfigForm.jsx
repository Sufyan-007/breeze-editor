import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../../contexts/ThemeContext';
import {
  CustomCheckBoxField,
  CustomTextInput,
  CustomSelectField,
  CustomTextArea,
  MonacoEditor,
  CustomButtonField,
} from '../../../../common/fields';
import { BreezeDatatypes } from '../../constants/FormConstants';
import { initialPropConfig } from '../../constants/ResourcesFormData';

function PropConfigForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialPropConfig);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';

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
    setFormData(initialPropConfig);
  };

  return (
    <form className="prop-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div className="row">
            <div className="col-8">
              <CustomTextInput
                name="propName"
                value={formData.propName}
                onChange={(value) => handleChange('propName', value)}
                config={{
                  label: 'Prop Name',
                  groupClass: 'form-group mb-2',
                }}
              />
            </div>
            <div className="col-4 mt-3">
              <CustomCheckBoxField
                name="isRequired"
                value={formData.isRequired}
                onChange={(value) => handleChange('isRequired', value)}
                config={{ label: 'Is Required', groupClass: 'form-check mt-3' }}
              />
            </div>
          </div>
          <CustomSelectField
            name="dataType"
            value={formData.dataType}
            onChange={(value) => handleChange('dataType', value)}
            options={BreezeDatatypes}
            config={{
              label: 'Data Type',
              groupClass: 'form-group mb-2',
            }}
          />
          <label className="form-label br-text-primary med-font fw-semibold">Default Value</label>
          <MonacoEditor
            defaultValue={formData.defaultValue}
            onChange={(value) => handleChange('defaultValue', value)}
            language="javascript"
            height="100px"
            theme={projectTheme}
            config={{ label: 'Default Value' }}
          />
          <CustomTextArea
            name="description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            config={{ label: 'Description', groupClass: 'form-group my-2' }}
          />
        </div>
        <div className="d-flex justify-content-end">
          <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </form>
  );
}

PropConfigForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default PropConfigForm;
