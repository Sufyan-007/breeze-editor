import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const dataTypes = [
  "string",
  "number",
  "boolean",
  "date",
  "array",
  "object",
  "function",
];

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
    <Form
      onSubmit={handleSubmit}
      style={{ fontSize: "14px" }}
      className="h-100"
    >
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <Form.Group className="mb-2" controlId="formVariableName">
            <Form.Label>Prop Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="var"
              className="form-control form-control-sm"
            />
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
              placeholder="Prop description"
              className="form-control form-control-sm"
            />
          </Form.Group>
        </div>
        <div className="d-flex justify-content-between">
          <Button variant="success" className="my-2 btn btn-sm" type="submit">
            {isEditing ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default PropConfigForm;
