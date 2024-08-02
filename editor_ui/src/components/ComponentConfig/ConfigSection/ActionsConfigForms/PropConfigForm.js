import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { dataTypes } from "../../../../constants/datatype";
import MonacoEditor from "../../../common/MonacoEditor";

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

  const [errors, setErrors] = useState({
    name: "",
    datatype: "",
  });

  useEffect(() => {
    if (isEditing && formData) {
      formData.checkUsage = true;
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
    } else if (name === "datatype" && !value) {
      error = "required";
    }

    return error;
  };

  const handleFormChange = (key, value) => {
    if (key in formState.body) {
      setFormState((prevState) => ({
        ...prevState,
        body: { ...prevState.body, [key]: value },
      }));
      const error = validateField("datatype", value);
      setErrors((prevErrors) => ({ ...prevErrors, datatype: error }));
    } else {
      setFormState((prevState) => ({ ...prevState, [key]: value }));
      const error = validateField(key, value);
      setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));
    }
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    newErrors.name = validateField("name", formState.name);
    newErrors.datatype = validateField("datatype", formState.body.datatype);

    if (newErrors.name || newErrors.datatype) {
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
            <Form.Label>Prop Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formState.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="var"
              className="form-control form-control-sm"
            />
            {errors.name && (
              <p className="mb-0" style={{ color: "#EA868F" }}>
                {errors.name}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-2" controlId="formDataType">
            <Form.Label>Data Type</Form.Label>
            <Form.Control
              as="select"
              name="datatype"
              value={formState.body.datatype}
              onChange={(e) => handleFormChange("datatype", e.target.value)}
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
            <MonacoEditor
              defaultValue={formState.body.defaultValue}
              onChange={(value) => handleFormChange("defaultValue", value)}
              height="100px"
              width="100%"
              id={isEditing ? `editor-${formState?.id}` : "prop-value"}
              language="javascript"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formState.body.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
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
