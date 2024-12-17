import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { CustomButtonField, CustomCheckBoxField, CustomTextInput } from '../../../../common/fields';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { getEntityConfig } from '../../../project/services/projectService';
import { useParams } from 'react-router-dom';

function ServiceCall({ onSubmit, onCancel }) {
  const { projectName } = useParams();
  const initialConfig = JSON.parse(JSON.stringify(funcConfigTemplates['serviceCall']));
  const [formData, setFormData] = useState({ ...initialConfig });
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [checkedItems, setCheckedItems] = useState({
    thenCatch: false,
    declarationCall: false,
    awaitCall: false,
  });
  const [parameterValues, setParameterValues] = useState({});

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await getEntityConfig(projectName, { filters: { type: 'SERVICE' } });
        const services = Object.values(response?.data || []).map((service) => ({
          value: service.id,
          label: service.exportedAs,
          ...service,
        }));
        setAvailableServices(services);
      } catch (error) {
        console.error('Error fetching available services:', error.message);
      }
    }
    fetchServices();
  }, [projectName]);

  const handleSelectChange = (selectedOption) => {
    setSelectedService(selectedOption);
    setParameterValues({});
    setFormData((prev) => ({
      ...prev,
      $ref: selectedOption.id,
      functionName: selectedOption.exportedAs || '',
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

    if (checkedItems.awaitCall) {
      config.isAwaited = true;
    }
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
    console.log('finalData::>>', finalConfig);
    onSubmit(finalConfig);
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
            options={availableServices}
            value={selectedService}
            onChange={handleSelectChange}
            className="react-select-container br-background-secondary br-text-primary"
            classNamePrefix="react-select"
            placeholder="Search services..."
          />
          {selectedService && (
            <>
              <div className="br-text-primary large-font mb-1 mt-3">Configure your service call</div>
              <div className="small-font br-text-primary mb-2">Note : Async Function required for awaitCall.</div>
              <div className="d-flex">
                {['thenCatch', 'declarationCall', 'awaitCall'].map((field) => (
                  <CustomCheckBoxField
                    key={field}
                    name={field}
                    value={checkedItems[field]}
                    onChange={(value) => handleCheckboxChange(field, value)}
                    config={{ label: field === 'thenCatch' ? 'Then Catch' : field, groupClass: 'form-check me-2' }}
                  />
                ))}
              </div>
            </>
          )}
          {selectedService?.schema?.parameters?.length > 0 && (
            <div className="mt-1">
              <div className="br-text-primary large-font mb-2">Parameter Mapping</div>
              {selectedService.schema.parameters.map((param) => (
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
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ServiceCall;
