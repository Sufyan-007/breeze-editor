import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomTextInput, CustomButtonField, CustomTextArea, CustomCheckBoxField } from '../../../../common/fields';
import CreatableSelect from 'react-select/creatable';
import { availableDependentVars } from '../../constants/FormConstants';
import { initialUseCallbackConfig, initialParamConfig } from '../../constants/ResourcesFormData';
import { useOffcanvas } from '../../../../contexts/OffcanvasContext';
import ParamForm from './ParamForm';
import { validator } from '../../../../utils/Validator';

function UseCallbackConfigForm({ getConfig, onSubmit, onCancel, editMode, onUpdate }) {
  const [formData, setFormData] = useState(initialUseCallbackConfig);
  const [isParamFormVisible, setIsParamFormVisible] = useState(false);
  const [editParamIndex, setParamEditIndex] = useState(null);
  const [paramData, setParamData] = useState(initialParamConfig);
  const { setOffcanvasSize } = useOffcanvas();
  const [selectedDependencies, setSelectedDependencies] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchConfig = useCallback(async () => {
    const res = await getConfig();
    const config = res.config;
    const dependencyValues = config.dependencies.map((dep) => ({
      label: dep.value,
      value: dep.value,
    }));
    setFormData(config);
    setSelectedDependencies(dependencyValues);
  }, [getConfig]);

  useEffect(() => {
    if (editMode) {
      fetchConfig();
    }
  }, [editMode, fetchConfig]);

  const handleChange = (field, value) => {
    let updatedData = { ...formData };

    if (field === 'isAsync') {
      updatedData.callback.isAsync = value;
    } else {
      updatedData[field] = value;
    }

    setFormData(updatedData);
  };

  const handleDependenciesChange = (options) => {
    setSelectedDependencies(options);
    const dependencyRefs = options.map((opt) => ({
      type: 'TOKEN',
      value: opt.value,
    }));

    setFormData((prevData) => ({
      ...prevData,
      dependencies: dependencyRefs,
    }));
  };

  const handleAddClick = () => {
    setOffcanvasSize('60%');
    setParamEditIndex(null);
    setParamData(initialParamConfig);
    setIsParamFormVisible(true);
  };

  const handleEditParam = (index, param) => {
    setParamEditIndex(index);
    setParamData(param);
    setIsParamFormVisible(true);
    setOffcanvasSize('60%');
  };

  const clearParamForm = () => {
    setIsParamFormVisible(false);
    setOffcanvasSize('40%');
    setParamData(initialParamConfig);
    setParamEditIndex(null);
  };

  const handleDeleteParam = (index) => {
    const updatedParams = formData.callback.schema.parameters.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      callback: {
        ...formData.callback,
        schema: {
          ...formData.callback.schema,
          parameters: updatedParams,
        },
      },
    });
    clearParamForm();
  };

  const addOrUpdateParam = (paramData) => {
    const updatedParams = [...formData.callback.schema.parameters];
    if (editParamIndex !== null) {
      updatedParams[editParamIndex] = paramData;
    } else {
      updatedParams.push(paramData);
    }
    setFormData({
      ...formData,
      callback: {
        ...formData.callback,
        schema: {
          ...formData.callback.schema,
          parameters: updatedParams,
        },
      },
    });
    clearParamForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isFormValid = [formData.varName].every(Boolean);
    if (!isFormValid) {
      return;
    }
    const formattedData = {
      ...formData,
      dependencies: formData.dependencies.map((dep) => ({
        type: 'TOKEN',
        value: dep.value,
      })),
    };

    if (editMode) {
      onUpdate(formattedData);
    } else {
      onSubmit(formattedData);
    }
    setFormData(initialUseCallbackConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialUseCallbackConfig);
    setIsSubmitted(false);
    onCancel();
  };

  return (
    <form className="hook-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div className={`d-flex  ${isParamFormVisible ? 'h-100 mb-2' : 'col-12'}`}>
          <div
            className={`p-2 me-2  ${isParamFormVisible ? 'col-4 br-background-secondary h-100' : 'col-12'}`}
            style={{ borderRadius: '0.375rem' }}
          >
            <div>
              <CustomTextInput
                name="varName"
                value={formData.varName || ''}
                onChange={(value) => handleChange('varName', value)}
                config={{ label: 'Hook Name', groupClass: 'form-group mb-2' }}
                customValidations={[validator.REQUIRED, validator.CANNOT_CONTAIN_SPACE]}
                isSubmitted={isSubmitted}
              />
              <CustomTextArea
                name="hookDescription"
                value={formData.description || ''}
                onChange={(value) => handleChange('description', value)}
                config={{ label: 'Hook Description', groupClass: 'form-group mb-2' }}
              />
              <div className="form-group mb-3">
                <label className="form-label br-text-primary med-font fw-semibold me-2">Dependent Variables</label>
                <CreatableSelect
                  isMulti
                  value={selectedDependencies}
                  onChange={handleDependenciesChange}
                  options={availableDependentVars}
                  placeholder="Add dependent variables..."
                  className="react-select-container br-background-secondary br-text-primary"
                  classNamePrefix="react-select"
                />
              </div>
              <div>
                <CustomCheckBoxField
                  name="isAsync"
                  value={formData.callback.isAsync || false}
                  onChange={(value) => handleChange('isAsync', value)}
                  config={{ label: 'Is Async', groupClass: 'form-check me-2' }}
                />
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="br-text-primary med-font fw-bold mb-0">Params</h6>
                  <div onClick={handleAddClick} role="button">
                    <i className="bi bi-plus-circle br-text-primary"></i>
                  </div>
                </div>
                {formData.callback.schema.parameters.length > 0 &&
                  formData.callback.schema.parameters.map((param, index) => (
                    <div
                      key={index}
                      className="br-background-primary my-1 py-1 px-2 d-flex justify-content-between"
                      style={{ borderRadius: '0.275rem' }}
                    >
                      <div>
                        <span className="br-text-primary med-font">{param.name || ''}</span>
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
                {formData.callback.schema.parameters.length === 0 && (
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

UseCallbackConfigForm.propTypes = {
  getConfig: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export default UseCallbackConfigForm;
