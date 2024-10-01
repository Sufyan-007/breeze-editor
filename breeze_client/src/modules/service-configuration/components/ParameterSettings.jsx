import { useEffect, useState } from 'react';
import { CustomCheckBoxField, CustomSelectField, CustomTextInput } from '../../../common/fields';
import PropTypes from 'prop-types';
function ParameterSettings({ paramData, onChange, renderError }) {
  const [queryParameters, setQueryParameters] = useState([]);
  const [pathParameters, setPathParameters] = useState([]);

  useEffect(() => {
    if (paramData) {
      const pathParamsFiltered = paramData.filter((param) => param.param_in === 'PATH');
      const queryParamsFiltered = paramData.filter((param) => param.param_in === 'QUERY');
      setPathParameters(pathParamsFiltered);
      setQueryParameters(queryParamsFiltered);
    }
  }, [paramData]);

  const handleInputChange = (index, field, value) => {
    const updatedParams = [...queryParameters];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    const finalParams = [...updatedParams, ...pathParameters];
    setQueryParameters(updatedParams);
    onChange('parameters', finalParams);
  };

  const handleDelete = (index) => {
    const updatedParams = [...queryParameters];
    updatedParams.splice(index, 1);
    const finalParams = [...updatedParams, ...pathParameters];
    setQueryParameters(updatedParams);
    onChange('parameters', finalParams);
  };
  return (
    <>
      {queryParameters && queryParameters.length > 0 ? (
        queryParameters.map((param, index) => (
          <div
            key={index}
            className="rounded-0 br-text-primary br-background-secondary d-flex align-items-center justify-content-between mb-2 mx-1"
          >
            <div className="d-flex align-items-center w-100">
              <CustomTextInput
                className=" form-control br-form-control form-control-sm"
                placeholder="Name"
                config={{
                  label: 'Parameter Name',
                  groupClass: 'form-group mb-2 mx-2 w-50',
                }}
                value={param.name}
                onChange={(e) => handleInputChange(index, 'name', e)}
              />
              <CustomSelectField
                name="valueSelect"
                value={param.param_type}
                onChange={(e) => {
                  handleInputChange(index, 'param_type', e);
                }}
                options={[
                  { label: 'Select', value: '' },
                  { label: 'STATIC', value: 'STATIC' },
                  { label: 'USER INPUT', value: 'USER_INPUT' },
                  { label: 'LOCALSTORAGE', value: 'LOCAL_STORAGE' },
                  { label: 'SESSION STORAGE', value: 'SESSION_STORAGE' },
                ]}
                className="form-select br-form-select form-select-sm mt-3"
                config={{
                  label: 'Value Type',
                  groupClass: 'form-group mb-2 mx-2 w-50',
                }}
              />
              {param.param_type === 'STATIC' ? (
                <CustomTextInput
                  className=" form-control br-form-control form-control-sm"
                  placeholder="Value"
                  config={{
                    label: 'Value',
                    groupClass: 'form-group mb-2 mx-2 w-50',
                  }}
                  value={param.value}
                  onChange={(e) => {
                    handleInputChange(index, 'value', e);
                  }}
                />
              ) : param.param_type === 'LOCAL_STORAGE' || param.param_type === 'SESSION_STORAGE' ? (
                <CustomTextInput
                  className=" form-control br-form-control form-control-sm"
                  placeholder="Key"
                  config={{
                    label: 'Storage Key',
                    groupClass: 'form-group mb-2 mx-2 w-50',
                  }}
                  value={param.storage_key}
                  onChange={(e) => {
                    handleInputChange(index, 'storage_key', e);
                  }}
                />
              ) : null}
              <CustomCheckBoxField
                value={param.required}
                onChange={(e) => handleInputChange(index, 'required', e)}
                className="form-check-input br-form-check-input"
                config={{
                  label: 'Required',
                  groupClass: 'form-group mb-2 mx-2',
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <i
                className="bi bi-trash3 mt-4"
                alt="delete"
                height={25}
                width={25}
                onClick={() => handleDelete(index)}
              ></i>
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex justify-content-center">
          <span className=" br-text-primary mb-1">-----No Query Parameters Present-----</span>
        </div>
      )}
      {queryParameters.map((param, index) => (
        <div key={index} className="mx-1 mt-1 br-text-primary">
          {renderError(param.errors)}
        </div>
      ))}
    </>
  );
}
ParameterSettings.propTypes = {
  paramData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      param_in: PropTypes.oneOf(['PATH', 'QUERY']).isRequired,
      param_type: PropTypes.string,
      value: PropTypes.string,
      storage_key: PropTypes.string,
      required: PropTypes.bool,
      errors: PropTypes.array,
    })
  ),
  onChange: PropTypes.func.isRequired,
  renderError: PropTypes.func.isRequired,
};
export default ParameterSettings;
