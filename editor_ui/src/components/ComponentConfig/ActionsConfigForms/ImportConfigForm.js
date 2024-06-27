import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

function ImportConfigForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    type: 'imports',
    body: {
      import_entity: "",
      from: "",
      import_type: "SINGLE", // default to SINGLE if checkbox is not checked
      TYPE: "",
    },
  });

  useEffect(() => {
    if (isEditing && formData) {
      setFormState(formData);
    }
  }, [isEditing, formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        [name]: type === "checkbox" ? checked : value,
        ...(name === "full_import" && { import_type: checked ? "FULL" : "SINGLE" }),
      },
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        import_type: checked ? "FULL" : "SINGLE",
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formImportEntity">
        <Form.Label>Import Entity</Form.Label>
        <Form.Control
          type="text"
          name="import_entity"
          value={formState.body.import_entity}
          onChange={handleChange}
          placeholder="Enter import entity"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formFrom">
        <Form.Label>From</Form.Label>
        <Form.Control
          type="text"
          name="from"
          value={formState.body.from}
          onChange={handleChange}
          placeholder="Enter source"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formFullImport">
        <Form.Check
          type="checkbox"
          name="full_import"
          label="Full Import"
          checked={formState.body.import_type === "FULL"}
          onChange={handleCheckboxChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formType">
        <Form.Label>Type</Form.Label>
        <Form.Control
          as="select"
          name="TYPE"
          value={formState.body.TYPE}
          onChange={handleChange}
        >
          <option value="">Select a type</option>
          <option value="THIRD_PARTY">THIRD_PARTY</option>
          <option value="SERVICES">SERVICES</option>
        </Form.Control>
      </Form.Group>
      <div className="d-flex">
        <Button variant="secondary" className="me-3" type="submit">
          {isEditing ? "Update" : "Submit"}
        </Button>
      </div>
    </Form>
  );
}

export default ImportConfigForm;
