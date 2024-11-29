import React, { useEffect, useState, useContext } from 'react';
import { CustomTextInput, CustomSelectField, MonacoEditor, CustomButtonField } from '../../../common/fields';
import { BreezeDatatypes } from '../../component-configuration/constants/FormConstants';
import ThemeContext from '../../../contexts/ThemeContext';

function ExternalCompPropEditForm({ onSubmit, onCancel, initialData, selectedProp, addNewProp, editMode = false }) {
  const [formData, setFormData] = useState({
    prop_name: '',
    type: '',
    default_value: '',
    ...initialData[selectedProp],
  });
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  //update formData when selectedProp or initialData changes
  useEffect(() => {
    if (selectedProp && initialData[selectedProp]) {
      setFormData({
        prop_name: '',
        type: '',
        default_value: '',
        ...initialData[selectedProp],
      });
    }
  }, [selectedProp, initialData]);

  useEffect(() => {
    if (editMode && initialData) {
      setFormData(initialData[selectedProp]);
    }
  }, [initialData, editMode, selectedProp]);

  useEffect(() => {
    if (addNewProp) {
      setFormData({
        prop_name: '',
        type: '',
        default_value: '',
      });
    }
  }, [addNewProp]);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editMode) setFormData(initialData); // Reset only in create mode
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData({
      prop_name: '',
      type: '',
      default_value: '',
      ...initialData[selectedProp],
    });
    onCancel();
  };

  return (
    <form className="h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomTextInput
            name="propName"
            value={formData.prop_name}
            onChange={(value) => handleChange('prop_name', value)}
            config={{
              label: 'Prop Name',
              groupClass: 'form-group mb-2',
            }}
          />
          <CustomSelectField
            name="dataType"
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
            options={BreezeDatatypes}
            config={{
              label: 'Data Type',
              groupClass: 'form-group mb-2',
            }}
          />
          <label className="form-label br-text-primary med-font fw-semibold">Default Value</label>
          <MonacoEditor
            defaultValue={formData.default_value}
            onChange={(value) => handleChange('default_value', value)}
            language="javascript"
            height="100px"
            theme={projectTheme}
            config={{ label: 'Default Value' }}
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
//add proptypes

export default ExternalCompPropEditForm;
