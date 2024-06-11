import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import MonacoEditor from "../../common/MonacoEditor";
import DeleteIcon from "../../../assets/icons/delete-trash.svg";
import FunctionParams from "./FunctionParams";

function FunctionConfigForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    type: "function",
    body: {
      parameters: { list: [] },
      isAnonymous: false,
      isAsync: false,
      helperData: [],
      functionBody: "",
      description: "",
    },
  });

  const [parameterInput, setParameterInput] = useState("");

  useEffect(() => {
    if (isEditing && formData) {
      setFormState(formData);
    }
  }, [isEditing, formData]);

  const handleFormChange = (key, value) => {
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        [key]: value,
      },
    }));
  };

  const handleAddParameter = () => {
    if (parameterInput.trim() !== "") {
      setFormState((prevState) => ({
        ...prevState,
        body: {
          ...prevState.body,
          parameters: {
            list: [
              ...prevState.body.parameters.list,
              { name: parameterInput.trim(), dataType: "", defaultValue: "", description: "" },
            ],
          },
        },
      }));
      setParameterInput("");
    }
  };

  const handleRemoveParameter = (index) => {
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        parameters: {
          list: prevState.body.parameters.list.filter(
            (_, idx) => idx !== index
          ),
        },
      },
    }));
  };

  const updateParams = (param, index) => {
    const updatedParams = [...formState.body.parameters.list];
    updatedParams[index] = param;
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        parameters: { list: updatedParams },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('formState::>>', formState);
    onSubmit(formState);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFunctionName">
          <Form.Control
            type="text"
            placeholder="Function Name"
            value={formState.name}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            required
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formDescription">
          <Form.Control
            type="text"
            placeholder="Description"
            value={formState.body.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formParameters">
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Add Param"
              value={parameterInput}
              onChange={(e) => setParameterInput(e.target.value)}
              className="me-2"
            />
            <Button variant="secondary" onClick={handleAddParameter}>
              Add
            </Button>
          </div>
          <ul className="list-group mt-2">
            {formState.body.parameters.list?.map((param, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center p-0 py-1"
              >
                <div className="flex-grow-1">
                  <FunctionParams
                    param={param}
                    setParam={(updatedParam) => updateParams(updatedParam, index)}
                  />
                </div>
                <div className="text-end">
                  <Button
                    variant="dark"
                    onClick={() => handleRemoveParameter(index)}
                    title="Delete"
                  >
                    <img src={DeleteIcon} alt="delete" height={22} />
                  </Button>
                </div>
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
            checked={formState.body.isAsync}
            onChange={(e) => handleFormChange("isAsync", e.target.checked)}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formAnonymous">
          <Form.Check
            type="checkbox"
            label="Anonymous"
            checked={formState.body.isAnonymous}
            onChange={(e) => handleFormChange("isAnonymous", e.target.checked)}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFunctionBody">
          <Form.Label>Function Body</Form.Label>
          <MonacoEditor
            defaultValue={formState.body.functionBody}
            onChange={(value) => handleFormChange("functionBody", value)}
            height="140px"
            width="400px"
            language="javascript"
            id={isEditing ? `editor-${formState?.id}` : "function-form"}
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
