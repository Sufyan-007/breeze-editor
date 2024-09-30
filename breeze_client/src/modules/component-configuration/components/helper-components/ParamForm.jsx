import { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomTextInput, CustomSelectField } from '../../../../common/fields';
import { BreezeDatatypes } from '../../constants/FormConstants';

function ParamForm({ param, onSubmit, onCancel }) {
  const [paramData, setParamData] = useState({
    paramName: param?.paramName || 'param1',
    paramDataType: param?.paramDataType || 'string',
    defaultValue: param?.defaultValue || '',
    description: param?.description || '',
  });

  const handleParamChange = (field, value) => {
    setParamData({
      ...paramData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    onSubmit(paramData);
  };

  return (
    <div className="param-form">
      <div className="row mx-0">
        <div className="col-3 px-0">
          <CustomTextInput
            name="paramName"
            value={paramData.paramName}
            onChange={(value) => handleParamChange('paramName', value)}
            config={{ label: 'Name', groupClass: 'form-group mb-2 me-2' }}
          />
        </div>
        <div className="col-3 px-0">
          <CustomSelectField
            name="paramDataType"
            value={paramData.paramDataType}
            onChange={(value) => handleParamChange('paramDataType', value)}
            options={BreezeDatatypes}
            config={{ label: 'Data Type', groupClass: 'form-group mb-2 me-2' }}
          />
        </div>
        <div className="col-3 px-0">
          <CustomTextInput
            name="defaultValue"
            value={paramData.defaultValue}
            onChange={(value) => handleParamChange('defaultValue', value)}
            config={{ label: 'Default Value', groupClass: 'form-group mb-2 me-2' }}
          />
        </div>
        <div className="col-3 px-0">
          <CustomTextInput
            name="description"
            value={paramData.description}
            onChange={(value) => handleParamChange('description', value)}
            config={{ label: 'Description', groupClass: 'form-group mb-2' }}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <div className="mx-2" role="button" onClick={onCancel}>
          <i className="bi bi-x"></i>
        </div>
        <div role="button" onClick={handleSubmit}>
          <i className="bi bi-check2"></i>
        </div>
      </div>
    </div>
  );
}

ParamForm.propTypes = {
  param: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ParamForm;
