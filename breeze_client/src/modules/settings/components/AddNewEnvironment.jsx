import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomButtonField, CustomTextInput } from '../../../common/fields';

const AddNewEnvironment = ({ envVariables, envNames, onSubmit, onClose }) => {
  const [tempEnvName, setTempEnvName] = useState('');
  const [tempEnvValues, setTempEnvValues] = useState({});
  const [validationMessage, setValidationMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleEnvNameChange = (value) => {
    const isValid = /^[a-zA-Z0-9]+$/.test(value);
    if (isValid || value === '') {
      setTempEnvName(value);
      if (envNames.some((variable) => variable === value)) {
        setValidationMessage('Environment name already exists.');
      } else {
        setValidationMessage('');
      }
    } else {
      setValidationMessage('Environment name cannot contain special characters or spaces.');
    }
  };

  const handleTempEnvValueChange = (id, value) => {
    setTempEnvValues({
      ...tempEnvValues,
      [id]: value,
    });
  };

  useEffect(() => {
    const allFieldsFilled = tempEnvName && tempEnvValues && Object.keys(tempEnvValues).length === envVariables.length;
    setIsFormValid(allFieldsFilled && !validationMessage);
  }, [tempEnvName, tempEnvValues, envVariables, validationMessage]);

  const handleFormSubmit = () => {
    if (isFormValid) {
      const trimmedEnvName = tempEnvName.trim();
      const trimmedEnvValues = Object.keys(tempEnvValues).reduce((acc, key) => {
        acc[key] = tempEnvValues[key].trim();
        return acc;
      }, {});

      onSubmit(trimmedEnvName, trimmedEnvValues);
      setTempEnvName('');
      setTempEnvValues({});
      setValidationMessage('');
    }
  };

  const handleClose = () => {
    setTempEnvName('');
    setTempEnvValues({});
    setValidationMessage('');
    onClose();
  };

  return (
    <div>
      <form>
        <CustomTextInput
          name="envName"
          value={tempEnvName}
          onChange={handleEnvNameChange}
          placeholder="Enter environment name"
          config={{
            label: (
              <>
                Environment Name <span className="text-danger">*</span>
              </>
            ),
          }}
        />
        {validationMessage && <p className="text-danger">{validationMessage}</p>}

        {envVariables.map((variable) => (
          <CustomTextInput
            key={variable.id}
            name={variable.name}
            value={tempEnvValues[variable.id] || ''}
            onChange={(value) => handleTempEnvValueChange(variable.id, value)}
            placeholder={`Enter value for ${variable.name}`}
            config={{
              label: (
                <>
                  {variable.name} <span className="text-danger">*</span>
                </>
              ),
            }}
          />
        ))}

        <div className="d-flex justify-content-end mt-3">
          <CustomButtonField label="Cancel" onClick={handleClose} className="me-2 btn btn-secondary" />
          <CustomButtonField
            label="Submit"
            onClick={handleFormSubmit}
            disabled={!isFormValid}
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

AddNewEnvironment.propTypes = {
  envVariables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  envNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddNewEnvironment;
