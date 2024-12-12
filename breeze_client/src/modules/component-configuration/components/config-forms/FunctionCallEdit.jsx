import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { CustomButtonField, CustomSelectField, CustomTextInput } from '../../../../common/fields';

function FunctionCallEdit({ onUpdate, onCancel, getConfig }) {
  const [formData, setFormData] = useState({});
  const [params, setParams] = useState([]);

  const fetchConfig = useCallback(async () => {
    const res = await getConfig();
    setFormData(res.config);
    setParams(res.config?.parameters || []);
  }, [getConfig]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleParamChange = (index, key, value) => {
    setParams((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleAddParam = () => {
    setParams((prev) => [...prev, { name: 'Param 1', type: 'CUSTOM', value: '' }]);
  };

  const handleDeleteParam = (index) => {
    setParams((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...formData, parameters: params });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData({});
    setParams([]);
    onCancel();
  };

  return (
    <div className="state-variable-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div className="d-flex justify-content-between">
            <div>
              <span className="fw-bold large-font br-text-primary">
                Function Name: {formData.functionName || 'N/A'}
              </span>
            </div>
            <div
              className="br-text-primary fw-semibold large-font br-cursor-pointer text-decoration-underline"
              onClick={handleAddParam}
            >
              <i className="bi bi-plus-circle br-text-primary"></i> Add Param
            </div>
          </div>
          {params.length > 0 ? (
            params.map((param, index) => (
              <div key={index} className="my-3 d-flex">
                <span className="col-4 br-text-primary med-font">{param?.name || `param-${index}`}</span>
                <CustomSelectField
                  name={`param-type-${index}`}
                  value={param.type}
                  options={[{ value: 'CUSTOM', label: 'Custom' }]}
                  config={{ label: '', groupClass: 'form-group me-2' }}
                  onChange={(value) => handleParamChange(index, 'type', value)}
                />
                <CustomTextInput
                  name={`param-value-${index}`}
                  value={param.value}
                  config={{ label: '' }}
                  onChange={(value) => handleParamChange(index, 'value', value)}
                />
                <div onClick={() => handleDeleteParam(index)} role="button" className="mx-2 mt-1">
                  <i className="bi bi-trash br-text-primary"></i>
                </div>
              </div>
            ))
          ) : (
            <p className="br-text-primary">No parameters available.</p>
          )}
        </div>
        <div className="d-flex justify-content-end mt-4">
          <CustomButtonField
            type="button"
            label="Cancel"
            className="btn br-secondary-button med-font mx-2"
            onClick={handleCancel}
          />
          <CustomButtonField type="button" label="Update" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

FunctionCallEdit.propTypes = {
  getConfig: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default FunctionCallEdit;
