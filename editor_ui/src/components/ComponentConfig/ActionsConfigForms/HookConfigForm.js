import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import MonacoEditor from "../../common/MonacoEditor";
import DeleteIcon from "../../../assets/icons/delete-trash.svg";

const hookTypes = ["useCallback", "useMemo"];

function HookConfigForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    type: "hook",
    body: {
      type: "",
      dependentVars: [],
      hookParams: [],
      hookBody: "",
      description: "",
    },
  });

  const [parameterInput, setParameterInput] = useState("");
  const constantsList = ["var1", "var2", "var3", "var4"];

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
          hookParams: [...prevState.body.hookParams, parameterInput.trim()],
        },
      }));
      setParameterInput("");
    }
  };

  const handleRemoveParameter = (index) => {
    const updatedParams = formState.body.hookParams.filter(
      (param, idx) => idx !== index
    );
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        hookParams: updatedParams,
      },
    }));
  };

  const handleSelect = (selectedList) => {
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        dependentVars: selectedList,
      },
    }));
  };

  const handleRemove = (selectedList) => {
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        dependentVars: selectedList,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridName">
          <Form.Control
            type="text"
            placeholder="Hook Name"
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
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridDescription">
          <Form.Control
            type="text"
            placeholder="Description"
            value={formState.body.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridType">
          <Form.Select
            value={formState.body.type}
            onChange={(e) => handleFormChange("type", e.target.value)}
          >
            <option value="">Hook Type</option>
            {hookTypes.map((hookType) => (
              <option key={hookType} value={hookType}>
                {hookType}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>

      {formState.body.type === "useCallback" && (
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formHookParams">
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Parameter"
                value={parameterInput}
                onChange={(e) => setParameterInput(e.target.value)}
                className="me-2"
              />
              <Button variant="secondary" onClick={handleAddParameter}>
                Add
              </Button>
            </div>
            <ul className="list-group mt-2">
              {formState.body.hookParams.map((param, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center px-2 py-1"
                >
                  {param}
                  <Button
                    variant="dark"
                    onClick={() => handleRemoveParameter(index)}
                    title="Delete"
                  >
                    <img src={DeleteIcon} alt="" height={22} />
                  </Button>
                </li>
              ))}
            </ul>
          </Form.Group>
        </Row>
      )}

      <Row className="mb-3">
        <Form.Group controlId="formGridDependentVars">
          <Multiselect
            placeholder="Dependent Variables"
            options={constantsList}
            selectedValues={formState.body.dependentVars}
            onSelect={handleSelect}
            onRemove={handleRemove}
            isObject={false}
            showCheckbox={true}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridHookBody">
          <Form.Label>Hook Body</Form.Label>
          <MonacoEditor
            defaultValue={formState.body.hookBody}
            onChange={(value) => handleFormChange("hookBody", value)}
            height="140px"
            width="410px"
            language="javascript"
            id={isEditing ? `editor-${formState?.id}` : "hook-form"}
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

export default HookConfigForm;
