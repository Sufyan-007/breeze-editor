import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

const AddNewEnvironment = ({ envVariables, onSubmit, onClose }) => {
  const [tempEnvName, setTempEnvName] = useState("");
  const [tempEnvValues, setTempEnvValues] = useState({});
  const [validationMessage, setValidationMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleTempEnvValueChange = (id, value) => {
    setTempEnvValues({
      ...tempEnvValues,
      [id]: value,
    });
  };

  const handleEnvNameChange = (e) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9]+$/.test(value);
    if (isValid || value === '') {
      setTempEnvName(value);
      setValidationMessage('');
    } else {
      setValidationMessage('Environment name cannot contain special characters or spaces.');
    }
  };

  useEffect(() => {
    const allFieldsFilled = tempEnvName && envVariables.every(variable => tempEnvValues[variable.id]);
    setIsFormValid(allFieldsFilled);
  }, [tempEnvName, tempEnvValues, envVariables]);

  const handleFormSubmit = () => {
    const trimmedEnvName = tempEnvName.trim();
    const trimmedEnvValues = Object.keys(tempEnvValues).reduce((acc, key) => {
      acc[key] = tempEnvValues[key].trim();
      return acc;
    }, {});

    onSubmit(trimmedEnvName, trimmedEnvValues);
    setTempEnvName("");
    setTempEnvValues({});
  };

  return (
    <div>
      <Form>
      <Form.Group controlId="formEnvName">
        <Form.Label>Environment Name <span className="text-danger">*</span></Form.Label>
        <Form.Control
          type="text"
          value={tempEnvName}
          onChange={handleEnvNameChange}
          placeholder="Enter environment name"
        />
        {validationMessage && <p className="text-danger">{validationMessage}</p>}
      </Form.Group>
        {envVariables.map((variable) => (
          <Form.Group
            controlId={`formEnvValue-${variable.id}`}
            key={variable.id}
            className="mt-2"
          >
            <Form.Label>{variable.name} <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={tempEnvValues[variable.id] || ""}
              onChange={(e) =>
                handleTempEnvValueChange(variable.id, e.target.value)
              }
              placeholder={`Enter value for ${variable.name}`}
            />
          </Form.Group>
        ))}
        <div className="d-flex justify-content-end mt-3">
          <Button variant="secondary" onClick={onClose} className="me-2">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit} disabled={!isFormValid}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddNewEnvironment;
