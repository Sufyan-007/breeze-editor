import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const dataTypes = ["string", "number", "boolean", "date", "array", "object"];

function VariableForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    type: "",
    datatype: "",
    defaultValue: "",
    description: "",
  });

  useEffect(() => {
    if (isEditing && formData) {
      setFormState(formData);
    }
  }, [isEditing, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formVariableName">
        <Form.Label>Variable Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          placeholder="var"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formVariableType">
        <Form.Label>Variable Type</Form.Label>
        <Form.Control
          as="select"
          name="type"
          value={formState.type}
          onChange={handleChange}
        >
          <option value="">Select...</option>
          <option value="stateVars">State</option>
          <option value="propsVars">Prop</option>
          <option value="otherVars">Other</option>
          <option value="refVars">Ref</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDataType">
        <Form.Label>Data Type</Form.Label>
        <Form.Control
          as="select"
          name="datatype"
          value={formState.datatype}
          onChange={handleChange}
        >
          <option value="">Select a data type</option>
          {dataTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDefaultValue">
        <Form.Label>Default Value</Form.Label>
        <Form.Control
          type="text"
          name="defaultValue"
          value={formState.defaultValue}
          onChange={handleChange}
          placeholder="value"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Enter description"
        />
      </Form.Group>
      <div className="d-flex">
        <Button variant="secondary" className="me-3" type="submit">
          {isEditing ? "Update" : "Submit"}
        </Button>
      </div>
    </Form>
  );
}

export default VariableForm;
