import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const dataTypes = ["string", "number", "boolean", "date", "array", "object"];

function VariableForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    type: "",
    body: {
      datatype: "",
      defaultValue: "",
      description: "",
    },
  });

  const [errors, setErrors] = useState({
    name: "",
    type: "",
    datatype: "",
  });

  useEffect(() => {
    if (isEditing && formData) {
      setFormState(formData);
    }
  }, [isEditing, formData]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value) {
        error = "required";
      } else if (value.includes(" ")) {
        error = "Cannot contain spaces";
      }
    } else if (name === "type" && !value) {
      error = "required";
    } else if (name === "datatype" && !value) {
      error = "required";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name in formState.body) {
      setFormState((prevState) => ({
        ...prevState,
        body: { ...prevState.body, [name]: value },
      }));
      error = validateField("datatype", value);
      setErrors((prevErrors) => ({ ...prevErrors, datatype: error }));
    } else {
      setFormState((prevState) => ({ ...prevState, [name]: value }));
      error = validateField(name, value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    newErrors.name = validateField("name", formState.name);
    newErrors.type = validateField("type", formState.type);
    newErrors.datatype = validateField("datatype", formState.body.datatype);

    if (newErrors.name || newErrors.type || newErrors.datatype) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formState);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ fontSize: "14px" }}
      className="h-100"
    >
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <Form.Group className="mb-2" controlId="formVariableName">
            <Form.Label>Variable Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="var"
              className="form-control form-control-sm"
            />
            {errors.name && (
              <p className="mb-0" style={{ color: "#EA868F" }}>
                {errors.name}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-2" controlId="formVariableType">
            <Form.Label>Variable Type</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={formState.type}
              onChange={handleChange}
              className="form-control form-control-sm"
            >
              <option value="">Select...</option>
              <option value="stateVars">State</option>
              <option value="otherVars">Other</option>
              <option value="refVars">Ref</option>
            </Form.Control>
            {errors.type && (
              <p className="mb-0" style={{ color: "#EA868F" }}>
                {errors.type}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-2" controlId="formDataType">
            <Form.Label>Data Type</Form.Label>
            <Form.Control
              as="select"
              name="datatype"
              value={formState.body.datatype}
              onChange={handleChange}
              className="form-control form-control-sm"
            >
              <option value="">Select a data type</option>
              {dataTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Control>
            {errors.datatype && (
              <p className="mb-0" style={{ color: "#EA868F" }}>
                {errors.datatype}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-2" controlId="formDefaultValue">
            <Form.Label>Default Value</Form.Label>
            <Form.Control
              type="text"
              name="defaultValue"
              value={formState.body.defaultValue}
              onChange={handleChange}
              placeholder="value"
              className="form-control form-control-sm"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formState.body.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="form-control form-control-sm"
            />
          </Form.Group>
        </div>
        <div className="d-flex">
          <Button variant="success" className="my-3 btn btn-sm" type="submit">
            {isEditing ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default VariableForm;
