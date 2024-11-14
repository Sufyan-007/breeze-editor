import { useEffect, useState } from 'react';
import ParameterSettings from './ParameterSettings';
import { CustomSelectField, CustomTextInput } from '../../../common/fields';
import PropTypes from 'prop-types';

function UrlSettings({ urlData, onChange, paramData, onAdd, method, envVars }) {
  const [url, setUrl] = useState(urlData);
  const [pathParams, setPathParams] = useState([]);
  const [queryParams, setQueryParams] = useState([]);
  const [pathInputValue, setPathInputValue] = useState('');
  const options = [
    { label: 'abc', value: '', dataSource: 'envVars' },
    { label: 'abc', value: 'dfsdf', dataSource: 'envVars' },
  ];

  useEffect(() => {
    setUrl(urlData);
    setPathInputValue(urlData?.path ? urlData.path.join('/') : '');
  }, [urlData]);

  useEffect(() => {
    if (paramData) {
      const pathParamsFiltered = paramData.filter((param) => param.param_in === 'PATH');
      const queryParamsFiltered = paramData.filter((param) => param.param_in !== 'PATH');
      setPathParams(pathParamsFiltered);
      setQueryParams(queryParamsFiltered);
    }
  }, [paramData]);

  const { baseurl, path, servers } = url ? url : {};

  if (servers) {
    servers.forEach((server) => {
      options.push({ value: server.url, label: server.url, dataSource: 'swagger' });
    });
  }
  if (envVars) {
    envVars.forEach(({ id, name }) => {
      options.push({ value: id, label: name, dataSource: 'envVars' });
    });
  }
  const handleChanges = (prop, newValue) => {
    const newUrlData = { ...url };

    if (prop === 'path') {
      setPathInputValue(newValue);
      newUrlData[prop] = newValue.split('/');
    } else {
      newUrlData[prop] = newValue;
      const selectedOption = options.find((option) => option.value === newValue);
      newUrlData['url_env'] = selectedOption?.dataSource === 'envVars' ? newValue : '';
    }
    onChange('url', newUrlData);
  };

  const handleMethodChange = (value) => {
    onChange('method', value);
  };

  const handlePathParsing = () => {
    if (path && Array.isArray(path)) {
      const updatedParamData = [];

      path.forEach((segment) => {
        if (typeof segment === 'string' && segment.startsWith('{') && segment.endsWith('}')) {
          const paramName = segment.substring(1, segment.length - 1);
          const existingParamIndex = pathParams.findIndex((para) => para.name === paramName);

          if (existingParamIndex !== -1) {
            updatedParamData.push({
              ...pathParams[existingParamIndex],
              description: '', // Update other fields as needed
            });
          } else {
            updatedParamData.push({
              param_in: 'PATH',
              name: paramName,
              type: 'STRING',
              required: true,
              description: '',
              param_type: 'STATIC',
              storage_key: '',
              value: '',
            });
          }
        }
      });

      const allParams = [...updatedParamData, ...queryParams];

      const remainingParamNames = updatedParamData.map((param) => param.name);
      const deletedParams = pathParams.filter((param) => !remainingParamNames.includes(param.name));

      if (deletedParams.length > 0) {
        console.log(
          'Deleted parameters:',
          deletedParams.map((param) => param.name)
        );
      }

      onChange('parameters', allParams);
      setPathParams(updatedParamData);
    }
  };

  const handleInputChange = (param_type, index, field, value) => {
    if (param_type === 'path') {
      if (index >= 0 && index < pathParams.length) {
        const updatedParams = [...pathParams];
        updatedParams[index] = { ...updatedParams[index], [field]: value };
        setPathParams(updatedParams);
        onChange('parameters', [...updatedParams, ...queryParams]);
      }
    } else {
      if (index >= 0 && index < queryParams.length) {
        const updatedParams = [...queryParams];
        updatedParams[index] = { ...updatedParams[index], [field]: value };
        setQueryParams(updatedParams);
        onChange('parameters', [...updatedParams, ...pathParams]);
      }
    }
  };

  const renderError = (errors) => {
    if (!errors) return null;
    return (
      <div className="text-danger mx-2 mb-1">
        {Object.entries(errors).map(([key, messages]) => (
          <div key={key}>
            {messages.map((message, idx) => (
              <div key={idx}>
                {key} : {message}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="rounded-0 br-text-primary br-background-secondary d-flex align-items-center justify-content-between">
        <CustomSelectField
          name="methodSelect"
          value={method}
          onChange={(e) => handleMethodChange(e)}
          options={[
            { label: 'Select', value: '' },
            { label: 'GET', value: 'GET' },
            { label: 'PUT', value: 'PUT' },
            { label: 'POST', value: 'POST' },
            { label: 'DELETE', value: 'DELETE' },
          ]}
          className="form-select br-form-select form-select-sm mt-3"
          config={{
            label: 'Method',
            groupClass: 'form-group mb-2 mx-2 w-50',
          }}
        />
        <CustomSelectField
          config={{
            label: 'Base Url',
            groupClass: 'form-group mb-2 mx-2 w-50',
          }}
          name="baseurl"
          value={baseurl}
          onChange={(newValue) => handleChanges('baseurl', newValue)}
          options={options}
          className="form-select br-form-select form-select-sm mt-3"
        />

        <CustomTextInput
          className=" form-control br-form-control form-control-sm"
          placeholder="Path"
          config={{
            label: 'Path',
            groupClass: 'form-group mb-2 mx-2 w-50',
          }}
          value={pathInputValue}
          onChange={(e) => handleChanges('path', e)}
          onBlur={handlePathParsing}
        />
      </div>
      <div className="br-text-primary mt-3" style={{ border: '1px solid rgba(128, 128, 128, 0.5)' }}>
        <div className="m-2">Path Parameter Details:</div>
        {pathParams && pathParams.length > 0 ? (
          pathParams.map((para, index) => (
            <div
              key={index}
              className="rounded-0 br-text-primary br-background-secondary d-flex align-items-center justify-content-between mb-2 mx-1"
            >
              <div className="d-flex align-items-center w-100">
                <CustomTextInput
                  className=" form-control br-form-control form-control-sm"
                  placeholder="Path"
                  config={{
                    label: 'Name',
                    groupClass: 'form-group mb-2 mx-2 w-50',
                  }}
                  value={para.name}
                  readOnly
                />
                <CustomSelectField
                  name="valueSelect"
                  value={para.param_type}
                  onChange={(e) => {
                    handleInputChange('path', index, 'param_type', e);
                  }}
                  options={[
                    { label: 'Select', value: '' },
                    // { label: 'STATIC', value: 'STATIC' }, remove static
                    { label: 'USER INPUT', value: 'USER_INPUT' },
                    { label: 'LOCALSTORAGE', value: 'LOCAL_STORAGE' },
                    { label: 'SESSION STORAGE', value: 'SESSION_STORAGE' },
                  ]}
                  className="form-select br-form-select form-select-sm mt-3"
                  config={{
                    label: 'Method',
                    groupClass: 'form-group mb-2 mx-2 w-50',
                  }}
                />

                <CustomSelectField
                  name="dataTypeSelect"
                  value={para.data_type || ''}
                  onChange={(e) => {
                    handleInputChange('path', index, 'data_type', e);
                  }}
                  options={[
                    { label: 'String', value: 'string' },
                    { label: 'Numeric', value: 'numeric' },
                    { label: 'Object', value: 'object' },
                    { label: 'Boolean', value: 'boolean' },
                  ]}
                  className="form-select br-form-select form-select-sm mt-3"
                  config={{
                    label: 'Data Type',
                    groupClass: 'form-group mb-2 mx-2 w-50',
                  }}
                />

                {para.param_type === 'LOCAL_STORAGE' || para.param_type === 'SESSION_STORAGE' ? (
                  <CustomTextInput
                    className=" form-control br-form-control form-control-sm"
                    placeholder="Key"
                    config={{
                      label: 'Storage Key',
                      groupClass: 'form-group mb-2 mx-2 w-50',
                    }}
                    value={para.storage_key}
                    onChange={(e) => {
                      handleInputChange('path', index, 'storage_key', e);
                    }}
                  />
                ) : null}
              </div>
              <div className="mx-1 mt-1 br-text-primary">{renderError(para.errors)}</div>
            </div>
          ))
        ) : (
          <div className="d-flex justify-content-center mb-1">-----Add {'{Path}'} Parameters in the Path-----</div>
        )}
      </div>

      <div className="br-text-primary mt-3" style={{ border: '1px solid rgba(128, 128, 128, 0.5)' }}>
        <div className="m-2">
          Query Parameter Details:
          <i
            className="bi bi-plus-circle mx-3 mb-1"
            width="25"
            height="25"
            onClick={() => onAdd(null, 'query parameters')}
          ></i>
        </div>

        <ParameterSettings paramData={paramData} onChange={onChange} renderError={renderError} />
      </div>
    </>
  );
}
UrlSettings.propTypes = {
  urlData: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  paramData: PropTypes.any,
  onAdd: PropTypes.func.isRequired,
  method: PropTypes.string.isRequired,
  envVars: PropTypes.object,
};
export default UrlSettings;
