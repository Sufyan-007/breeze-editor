import PropTypes from 'prop-types';
import { CustomButtonField, CustomTextArea, CustomTextInput } from '../../../../common/fields';
import { useEffect, useState } from 'react';
import { initialComponentConfig, initialPropConfig } from '../../constants/ResourcesFormData';
import PropConfigForm from './PropConfigForm';
import { useOffcanvas } from '../../../../contexts/OffcanvasContext';
import { validator } from '../../../../utils/Validator';

function ComponentConfigForm({ getConfig, onSubmit, onCancel, editMode, onUpdate }) {
  const [formData, setFormData] = useState(initialComponentConfig);
  const [isPropFormVisible, setIsPropFormVisible] = useState(false);
  const [editPropIndex, setPropEditIndex] = useState(null);
  const [propData, setPropData] = useState(initialPropConfig);
  const { setOffcanvasSize } = useOffcanvas();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // useEffect(() => {
  //   const config = getConfig();
  //   console.log(config);
  // }, [getConfig]);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleEditParam = (index, prop) => {
    setPropEditIndex(index);
    setPropData(prop);
    setIsPropFormVisible(true);
    setOffcanvasSize('60%');
  };

  const handleDeleteParam = (index) => {
    const updatedProps = formData.propVars.filter((_, i) => i !== index);
    setFormData({ ...formData, propVars: updatedProps });
    clearPropForm();
  };

  const handleAddClick = () => {
    setOffcanvasSize('60%');
    setPropEditIndex(null);
    setPropData(initialPropConfig);
    setIsPropFormVisible(true);
  };

  const addOrUpdateProp = (propData) => {
    const updatedProps = [...formData.propVars];
    if (editPropIndex !== null) {
      updatedProps[editPropIndex] = propData;
    } else {
      updatedProps.push(propData);
    }
    setFormData({ ...formData, propVars: updatedProps });
    clearPropForm();
  };

  const clearPropForm = () => {
    setIsPropFormVisible(false);
    setOffcanvasSize('40%');
    setPropData(initialPropConfig);
    setPropEditIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isFormValid = [formData.name].every(Boolean);
    if (!isFormValid) {
      return;
    }
    if (editMode) {
      onUpdate(formData);
    } else {
      onSubmit(formData);
    }
    setFormData(initialComponentConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialComponentConfig);
    setIsSubmitted(false);
    onCancel();
  };

  return (
    <form className="component-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div className={`d-flex  ${isPropFormVisible ? 'h-100 mb-2' : 'col-12'}`}>
          <div
            className={`p-2 me-2  ${isPropFormVisible ? 'col-4 br-background-secondary h-100' : 'col-12'}`}
            style={{ borderRadius: '0.375rem' }}
          >
            <div>
              <CustomTextInput
                name="name"
                value={formData.name || ''}
                onChange={(value) => handleChange('name', value)}
                config={{
                  label: 'Component Name',
                  groupClass: 'form-group mb-2',
                }}
                customValidations={[validator.REQUIRED, validator.CANNOT_CONTAIN_SPACE]}
                isSubmitted={isSubmitted}
              />
              <CustomTextArea
                name="description"
                value={formData.description || ''}
                onChange={(value) => handleChange('description', value)}
                config={{
                  label: 'Description',
                  groupClass: 'form-group mb-2',
                }}
              />
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="br-text-primary med-font fw-bold mb-0">Props</h6>
                  <div onClick={handleAddClick} role="button">
                    <i className="bi bi-plus-circle br-text-primary"></i>
                  </div>
                </div>
                {formData.propVars.length > 0 &&
                  formData.propVars.map((prop, index) => (
                    <div
                      key={index}
                      className="br-background-primary my-1 py-1 px-2 d-flex justify-content-between"
                      style={{ borderRadius: '0.275rem' }}
                    >
                      <div>
                        <span className="br-text-primary med-font">{prop.name}</span>
                      </div>
                      <div className="d-flex">
                        <div
                          className="mx-2"
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditParam(index, prop);
                          }}
                        >
                          <i className="bi bi-pencil-square br-text-primary med-font"></i>
                        </div>
                        <div
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteParam(index);
                          }}
                        >
                          <i className="bi bi-trash br-text-primary med-font"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                {formData.propVars.length === 0 && <span className="med-font br-text-primary">No Props Present</span>}
              </div>
            </div>
          </div>
          {isPropFormVisible && (
            <div
              className="p-2 br-background-secondary col-8 h-100"
              style={{ borderRadius: '0.375rem', transition: 'width 0.3s ease' }}
            >
              <PropConfigForm
                onSubmit={addOrUpdateProp}
                onCancel={clearPropForm}
                formData={propData}
                editMode={editPropIndex !== null}
              />
            </div>
          )}
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

ComponentConfigForm.propTypes = {
  getConfig: PropTypes.func,
  editMode: PropTypes.bool,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ComponentConfigForm;
