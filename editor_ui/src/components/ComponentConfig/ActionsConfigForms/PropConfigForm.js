import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const dataTypes = ["string", "number", "boolean", "date", "array", "object", "function"];

function PropConfigForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    type: "propsVars",
    body: {
      datatype: "",
      defaultValue: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isEditing && formData) {
      setFormState(formData);
    }
  }, [isEditing, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formState.body) {
      setFormState((prevState) => ({
        ...prevState,
        body: { ...prevState.body, [name]: value },
      }));
    } else {
      setFormState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formVariableName">
        <Form.Label>Prop Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          placeholder="var"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDataType">
        <Form.Label>Data Type</Form.Label>
        <Form.Control
          as="select"
          name="datatype"
          value={formState.body.datatype}
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
          value={formState.body.defaultValue}
          onChange={handleChange}
          placeholder="value"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formState.body.description}
          onChange={handleChange}
          placeholder="Prop description"
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

export default PropConfigForm;
