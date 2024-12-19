import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { CustomButtonField, CustomCheckBoxField, CustomTextInput } from '../../../../common/fields';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { getEntityConfig } from '../../../project/services/projectService';
import { useParams } from 'react-router-dom';

function ServiceCall({ getConfig, onSubmit, onCancel, editMode, onUpdate, callType }) {
  const { projectName } = useParams();
  const initialConfig = JSON.parse(JSON.stringify(funcConfigTemplates[callType]));
  const [formData, setFormData] = useState({ ...initialConfig });
  const [availableFunctions, setAvailableFunctions] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [checkedItems, setCheckedItems] = useState({
    thenCatch: false,
    declarationCall: false,
    awaitCall: false,
  });
  const [parameterValues, setParameterValues] = useState({});

  useEffect(() => {
    async function fetchServices() {
      try {
        if (callType == 'serviceCall') {
          const response = await getEntityConfig(projectName, { filters: { type: 'SERVICE' } });
          const services = Object.values(response?.data || []).map((service) => ({
            value: service.id,
            label: service.exportedAs,
            ...service,
          }));
          setAvailableFunctions(services);
        } else if (callType == 'functionCall') {
          // call functions api
          const functions = [];
          setAvailableFunctions(functions);
        } else {
          console.log('Custom function');
        }
      } catch (error) {
        console.error('Error fetching available services:', error.message);
      }
    }
    fetchServices();
  }, [projectName]);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await getConfig();
      if (res?.config?.$ref) {
        const matchedService = availableFunctions.find((service) => service.id === res.config.$ref);
        if (matchedService) {
          setSelectedFunction(matchedService);
          setFormData((prev) => ({
            ...prev,
            ...res.config,
          }));
          setParameterValues(
            res.config.parameters?.reduce((acc, param) => {
              acc[param.name] = param.value;
              return acc;
            }, {}) || {}
          );
          setCheckedItems((prev) => ({
            ...prev,
            awaitCall: !!res.config.isAwaited,
            thenCatch: res.config.isAwaited ? false : prev.thenCatch,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  }, [getConfig, availableFunctions]);

  useEffect(() => {
    if (editMode) {
      fetchConfig();
    }
  }, [fetchConfig, editMode]);

  const handleSelectChange = (selectedOption) => {
    setSelectedFunction(selectedOption);
    setParameterValues({});
    setFormData((prev) => ({
      ...prev,
      $ref: selectedOption.id,
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === 'thenCatch' && value ? { awaitCall: false } : {}),
      ...(field === 'awaitCall' && value ? { thenCatch: false } : {}),
    }));
  };

  const handleParameterChange = (paramName, value) => {
    setParameterValues((prevState) => ({
      ...prevState,
      [paramName]: value,
    }));

    setFormData((prev) => ({
      ...prev,
      parameters: Object.entries({ ...parameterValues, [paramName]: value }).map(([name, value]) => ({
        name,
        type: 'CUSTOM',
        value,
      })),
    }));
  };

  const transformConfig = () => {
    let config = { ...formData };

    config.isAwaited = checkedItems.awaitCall;
    if (checkedItems.thenCatch) {
      config = {
        type: 'CHAINED_FUNCTIONS',
        functions: [
          config,
          {
            callType: 'functionCall',
            type: 'FUNCTION_CALL',
            functionName: 'then',
            parameters: [
              {
                type: 'FUNCTION',
                isAnonymous: true,
                schema: {
                  type: 'FUNCTION',
                  returnType: {
                    selection: 'anyOf',
                    types: [{ type: 'any' }],
                  },
                  parameters: [{ name: 'res', type: 'CUSTOM' }],
                },
                bodyConfig: { type: 'BLOCK', statements: [] },
              },
            ],
          },
          {
            callType: 'functionCall',
            type: 'FUNCTION_CALL',
            functionName: 'catch',
            parameters: [
              {
                type: 'FUNCTION',
                isAnonymous: true,
                schema: {
                  type: 'FUNCTION',
                  returnType: {
                    selection: 'anyOf',
                    types: [{ type: 'any' }],
                  },
                  parameters: [{ name: 'err', type: 'CUSTOM' }],
                },
                bodyConfig: { type: 'BLOCK', statements: [] },
              },
            ],
          },
        ],
      };
    }

    if (checkedItems.declarationCall) {
      config = {
        type: 'DECLARATION',
        varName: 'response',
        value: config,
        declarationType: 'const',
      };
    }

    return config;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalConfig = transformConfig();
    if (editMode) {
      onUpdate(finalConfig);
    } else {
      onSubmit(finalConfig);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <div className="service-call-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div className="br-text-primary large-font mb-2">Select a Service</div>
          <Select
            options={availableFunctions}
            value={selectedFunction}
            onChange={handleSelectChange}
            className="react-select-container br-background-secondary br-text-primary"
            classNamePrefix="react-select"
            placeholder="Search services..."
            isDisabled={editMode}
          />
          {selectedFunction && (
            <>
              <div className="br-text-primary large-font mb-1 mt-3">Configure your service call</div>
              <div className="small-font br-text-primary mb-2">Note : Async Function required for awaitCall.</div>
              <div className="d-flex">
                {(editMode ? ['awaitCall'] : ['thenCatch', 'declarationCall', 'awaitCall']).map((field) => (
                  <CustomCheckBoxField
                    key={field}
                    name={field}
                    value={checkedItems[field]}
                    onChange={(value) => handleCheckboxChange(field, value)}
                    config={{
                      label: field === 'thenCatch' ? 'Then Catch' : field,
                      groupClass: 'form-check me-2',
                    }}
                  />
                ))}
              </div>
            </>
          )}
          {selectedFunction?.schema?.parameters?.length > 0 && (
            <div className="mt-1">
              <div className="br-text-primary large-font mb-2">Parameter Mapping</div>
              {selectedFunction.schema.parameters.map((param) => (
                <div key={param.name} className="mb-2 px-1">
                  <CustomTextInput
                    name={param.name}
                    value={parameterValues[param.name] || ''}
                    onChange={(value) => handleParameterChange(param.name, value)}
                    config={{
                      label: param.name,
                      groupClass: 'form-group d-flex',
                      labelClass: 'me-3 br-text-primary med-font col-3 fw-semibold',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="d-flex justify-content-end">
          <CustomButtonField
            type="button"
            label="Cancel"
            className="btn br-secondary-button med-font mx-2"
            onClick={handleCancel}
          />
          <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

ServiceCall.propTypes = {
  getConfig: PropTypes.func,
  editMode: PropTypes.bool,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func,
  callType: PropTypes.string,
};

export default ServiceCall;
