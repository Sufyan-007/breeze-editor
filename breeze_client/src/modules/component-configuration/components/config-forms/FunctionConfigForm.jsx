import { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomTextInput, CustomCheckBoxField, CustomButtonField, CustomTextArea } from '../../../../common/fields';
import { initialFunctionConfig, initialParamConfig } from '../../constants/ResourcesFormData';
import { useOffcanvas } from '../../../../contexts/OffcanvasContext';
import ParamForm from '../helper-components/ParamForm';

function FunctionConfigForm({ onSubmit, onCancel, formData: initialData, editMode }) {
  const [formData, setFormData] = useState(initialData || initialFunctionConfig);
  const [isParamFormVisible, setIsParamFormVisible] = useState(false);
  const [editParamIndex, setParamEditIndex] = useState(null);
  const [paramData, setParamData] = useState(initialParamConfig);
  const { setOffcanvasSize } = useOffcanvas();

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddClick = () => {
    setOffcanvasSize('60%');
    setParamEditIndex(null);
    setParamData(initialParamConfig);
    setIsParamFormVisible(true);
  };

  const handleEditParam = (index, param) => {
    console.log('1::>>', 1);
    setParamEditIndex(index);
    setParamData(param);
    setIsParamFormVisible(true);
    setOffcanvasSize('60%');
  };

  console.log('paramData::>>', paramData);

  const handleDeleteParam = (index) => {
    const updatedParams = formData.parameters.filter((_, i) => i !== index);
    setFormData({ ...formData, parameters: updatedParams });
    clearParamForm();
  };

  const addOrUpdateParam = (paramData) => {
    const updatedParams = [...formData.parameters];
    if (editParamIndex !== null) {
      updatedParams[editParamIndex] = paramData;
    } else {
      updatedParams.push(paramData);
    }
    setFormData({ ...formData, parameters: updatedParams });
    clearParamForm();
  };

  const clearParamForm = () => {
    setIsParamFormVisible(false);
    setOffcanvasSize('40%');
    setParamData(initialParamConfig);
    setParamEditIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editMode) setFormData(initialFunctionConfig);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialFunctionConfig);
    onCancel();
  };

  return (
    <form className="component-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div className={`d-flex  ${isParamFormVisible ? 'h-100 mb-2' : 'col-12'}`}>
          <div
            className={`p-2 me-2  ${isParamFormVisible ? 'col-4 br-background-secondary h-100' : 'col-12'}`}
            style={{ borderRadius: '0.375rem' }}
          >
            <div>
              <CustomTextInput
                name="name"
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                config={{ label: 'Function Name', groupClass: 'form-group mb-2' }}
              />
              <div className="d-flex mt-3">
                <CustomCheckBoxField
                  name="isAsync"
                  value={formData.isAsync}
                  onChange={(value) => handleChange('isAsync', value)}
                  config={{ label: 'Is Async', groupClass: 'form-check me-2' }}
                />
                <CustomCheckBoxField
                  name="isAnonymous"
                  value={formData.isAnonymous}
                  onChange={(value) => handleChange('isAnonymous', value)}
                  config={{ label: 'Is Anonymous', groupClass: 'form-check mx-2' }}
                />
              </div>
              <CustomTextArea
                name="description"
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                config={{ label: 'Description', groupClass: 'form-group mb-2' }}
              />
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="br-text-primary med-font fw-bold mb-0">Params</h6>
                  <div onClick={handleAddClick} role="button">
                    <i className="bi bi-plus-circle br-text-primary"></i>
                  </div>
                </div>
                {formData.parameters.length > 0 &&
                  formData.parameters.map((param, index) => (
                    <div
                      key={index}
                      className="br-background-primary my-1 py-1 px-2 d-flex justify-content-between"
                      style={{ borderRadius: '0.275rem' }}
                    >
                      <div>
                        <span className="br-text-primary med-font">{param.name}</span>
                      </div>
                      <div className="d-flex">
                        <div
                          className="mx-2"
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditParam(index, param);
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
                {formData.parameters.length === 0 && (
                  <span className="med-font br-text-primary">No Params Present</span>
                )}
              </div>
            </div>
          </div>
          {isParamFormVisible && (
            <div
              className="p-2 br-background-secondary col-8 h-100"
              style={{ borderRadius: '0.375rem', transition: 'width 0.3s ease' }}
            >
              <ParamForm
                onSubmit={addOrUpdateParam}
                onCancel={clearParamForm}
                param={paramData}
                editMode={editParamIndex !== null}
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
          <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </form>
  );
}

FunctionConfigForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  formData: PropTypes.object,
  editMode: PropTypes.bool,
};

export default FunctionConfigForm;
