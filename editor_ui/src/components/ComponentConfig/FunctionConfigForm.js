import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import MonacoEditor from "../common/MonacoEditor";
import DeleteIcon from "../../assets/icons/delete-trash.svg"

function FunctionConfigForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    functionName: "",
    description: "",
    parameters: [],
    isAsync: false,
    isAnonymous: false,
    body: "",
  });

  const [parameterInput, setParameterInput] = useState("");

  useEffect(() => {
    if (isEditing && formData) {
      setFormState(formData);
    }
  }, [isEditing, formData]);

  const handleFormChange = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  const handleAddParameter = () => {
    if (parameterInput.trim() !== "") {
      setFormState({
        ...formState,
        parameters: [...formState.parameters, parameterInput.trim()],
      });
      setParameterInput("");
    }
  };

  const handleRemoveParameter = (index) => {
    const updatedParameters = formState.parameters.filter(
      (param, idx) => idx !== index
    );
    setFormState({ ...formState, parameters: updatedParameters });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFunctionName">
          {/* <Form.Label>Function Name</Form.Label> */}
          <Form.Control
            type="text"
            placeholder="Function Name"
            value={formState.functionName}
            onChange={(e) => handleFormChange("functionName", e.target.value)}
            required
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formDescription">
          {/* <Form.Label>Description</Form.Label> */}
          <Form.Control
            type="text"
            placeholder="Description"
            value={formState.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formParameters">
          {/* <Form.Label>Parameters</Form.Label> */}
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Parameters"
              value={parameterInput}
              onChange={(e) => setParameterInput(e.target.value)}
              className="me-2"
            />
            <Button variant="secondary" onClick={handleAddParameter}>
              Add
            </Button>
          </div>
          <ul className="list-group mt-2">
            {formState.parameters.map((param, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-2 py-1">
                {param}
                <Button variant="dark" onClick={() => handleRemoveParameter(index)} title="Delete">
                <img src={DeleteIcon} alt="" height={22} />
              </Button>
              </li>
            ))}
          </ul>
        </Form.Group>
      </Row>
      <Row className="mb-3 px-1">
        <Form.Group as={Col} controlId="formAsync">
          <Form.Check
            type="checkbox"
            label="Async"
            checked={formState.isAsync}
            onChange={(e) => handleFormChange("isAsync", e.target.checked)}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formAnonymous">
          <Form.Check
            type="checkbox"
            label="Anonymous"
            checked={formState.isAnonymous}
            onChange={(e) => handleFormChange("isAnonymous", e.target.checked)}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFunctionBody">
          <Form.Label>Function Body</Form.Label>
          <MonacoEditor
            defaultValue={formState.body}
            onChange={(value) => handleFormChange("body", value)}
            height="140px"
            width="400px"
            language="javascript"
          />
        </Form.Group>
      </Row>
      <div className="d-flex">
        <Button variant="secondary" className="me-3" type="submit">
          {isEditing ? "Update" : "Submit"}
        </Button>
      </div>
    </Form>
  );
}

export default FunctionConfigForm;
