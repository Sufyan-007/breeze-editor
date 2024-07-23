import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import MonacoEditor from "../../../common/MonacoEditor";
import DeleteIcon from "../../../../assets/icons/delete-trash.svg";
import { ComponentContext } from "../../ComponentConfigPage";

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

  const [errors, setErrors] = useState({
    name: "",
    type: "",
  });

  const { componentConfig } = useContext(ComponentContext);
  const { propsVars, resources } = componentConfig;

  const [parameterInput, setParameterInput] = useState("");
  const [constants, setConstants] = useState([]);

  useEffect(() => {
    const filteredResources = resources.filter(
      (resource) => resource.type !== "lifecycle"
    );
    const combinedVariables = [...propsVars, ...filteredResources];
    const varList = combinedVariables.map((variable) => variable.name);
    setConstants(varList);
  }, [propsVars, resources]);

  useEffect(() => {
    if (isEditing && formData) {
      setFormState(formData);
    }
  }, [isEditing, formData]);

  const validateField = (name, value) => {
    let error = "";

    if ((name === "name" || name === "type") && !value) {
      error = "Required";
    }

    return error;
  };

  const handleFormChange = (key, value) => {
    let error = validateField(key, value);
    setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));

    setFormState((prevState) => ({
      ...prevState,
      ...(key === "name" ? { name: value } : {}),
      body: {
        ...prevState.body,
        ...(key !== "name" ? { [key]: value } : {}),
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

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    newErrors.name = validateField("name", formState.name);
    newErrors.type = validateField("type", formState.body.type);

    if (newErrors.name || newErrors.type) {
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
          <Row className="mb-2">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Control
                className="form-control form-control-sm"
                type="text"
                placeholder="Hook Name"
                value={formState.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
              {errors.name && (
                <p className="mb-0" style={{ color: "#EA868F" }}>
                  {errors.name}
                </p>
              )}
            </Form.Group>
          </Row>
          <Row className="mb-2">
            <Form.Group as={Col} controlId="formGridDescription">
              <Form.Control
                type="text"
                className="form-control form-control-sm"
                placeholder="Description"
                value={formState.body.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
              />
            </Form.Group>
          </Row>

          <Row className="mb-2">
            <Form.Group as={Col} controlId="formGridType">
              <Form.Select
                value={formState.body.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                className="form-select form-select-sm"
              >
                <option value="">Hook Type</option>
                {hookTypes.map((hookType) => (
                  <option key={hookType} value={hookType}>
                    {hookType}
                  </option>
                ))}
              </Form.Select>
              {errors.type && (
                <p className="mb-0" style={{ color: "#EA868F" }}>
                  {errors.type}
                </p>
              )}
            </Form.Group>
          </Row>

          {formState.body.type === "useCallback" && (
            <Row className="mb-2">
              <Form.Group as={Col} controlId="formHookParams">
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Parameter"
                    className="form-control form-control-sm me-2"
                    value={parameterInput}
                    onChange={(e) => setParameterInput(e.target.value)}
                  />
                  <div
                    className="mt-1 d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={handleAddParameter}
                  >
                    <i className="bi bi-plus-circle"></i>
                  </div>
                </div>
                <ul className="list-group mt-2 mx-2">
                  {formState.body.hookParams.map((param, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center px-2 py-0"
                    >
                      {param}
                      <Button
                        variant="dark"
                        onClick={() => handleRemoveParameter(index)}
                        title="Delete"
                        className="p-1"
                      >
                        <img src={DeleteIcon} alt="" height={20} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Form.Group>
            </Row>
          )}

          <Row className="mb-2">
            <Form.Group controlId="formGridDependentVars">
              <Multiselect
                placeholder="Dependent Variables"
                options={constants}
                selectedValues={formState.body.dependentVars}
                onSelect={handleSelect}
                onRemove={handleRemove}
                isObject={false}
                showCheckbox={true}
              />
            </Form.Group>
          </Row>

          <Row className="mb-2">
            <Form.Group as={Col} controlId="formGridHookBody">
              <Form.Label>Hook Body</Form.Label>
              <MonacoEditor
                defaultValue={formState.body.hookBody}
                onChange={(value) => handleFormChange("hookBody", value)}
                height="140px"
                width="100%"
                language="javascript"
                id={isEditing ? `editor-${formState?.id}` : "hook-form"}
              />
            </Form.Group>
          </Row>
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

export default HookConfigForm;
