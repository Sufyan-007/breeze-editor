import React, { useState, useEffect, useContext, useRef } from "react";
import { Form, Button, Row, Col, Toast } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import MonacoEditor from "../../../common/MonacoEditor";
import { ComponentContext } from "../../ComponentConfigPage";
import FunctionConfigStack from "./FunctionConfigForm/FunctionConfigStack";
import { useParams } from "react-router";
import { generatePreviewCode } from "../../../../services/ComponentConfigService";

function LifecycleForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    type: "lifecycle",
    body: {
      lifecycleType: "onInitialMount",
      dependentVars: [],
      lifecycleBody: {
        name: "",
        type: "function",
        parameters: [],
        isAnonymous: true,
        isAsync: false,
        bodyConfig: {
          type: "BLOCK",
          statements: [],
        },
      },
      description: "",
    },
  });

  const [errors, setErrors] = useState({
    name: "",
    lifecycleType: "",
  });
  const [lifecycleBodyConfig, setLifecycleBodyConfigOpen] = useState(true);

  const { componentConfig } = useContext(ComponentContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { propsVars, resources } = componentConfig;
  const { projectName, componentName } = useParams();
  const [constants, setConstants] = useState([]);
  const [previewCode, setPreviewCode] = useState("");
  const debounceTimeout = useRef(null);

  const toggleLifecycleConfigAccordion = () => {
    setLifecycleBodyConfigOpen(!lifecycleBodyConfig);
  };

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

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      generatePreview(formState.body.lifecycleBody);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [formState.body]);

  const generatePreview = async (val) => {
    try {
      if (formState.body.lifecycleType) {
        const payload = {
          project_id: projectName,
          component_id: componentName,
          config: val,
        };
        const response = await generatePreviewCode(payload);
        if (response.status === 200) {
          if (response.body.function === "{\n}\n") {
            setPreviewCode("");
          } else {
            setPreviewCode(response.body.function);
          }
        } else {
          setToastMessage("Error occurred while generating code.");
          setShowToast(true);
        }
      }
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  const handleFormChange = (key, value) => {
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        [key]: value,
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

    if (!formState.name) {
      newErrors.name = "required";
      isValid = false;
    }

    if (!formState.body.lifecycleType) {
      newErrors.lifecycleType = "required";
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
    <>
      <Form style={{ fontSize: "14px" }} className="h-100">
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <Row className="mb-2">
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  className="form-control-sm"
                  type="text"
                  placeholder="Lifecycle Name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                  required
                />
                {errors.name && (
                  <p className="mb-0" style={{ color: "#EA868F" }}>
                    {errors.name}
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="formGridDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  className="form-control-sm"
                  type="text"
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
                <div className="d-flex">
                  <Form.Check
                    type="radio"
                    id="onEveryMount"
                    label="onEveryMount"
                    value="onEveryMount"
                    checked={formState.body.lifecycleType === "onEveryMount"}
                    onChange={(e) =>
                      handleFormChange("lifecycleType", e.target.value)
                    }
                    className="me-2"
                  />
                  <Form.Check
                    type="radio"
                    id="onInitialMount"
                    label="onInitialMount"
                    value="onInitialMount"
                    checked={formState.body.lifecycleType === "onInitialMount"}
                    onChange={(e) =>
                      handleFormChange("lifecycleType", e.target.value)
                    }
                    className="me-2"
                  />
                  <Form.Check
                    type="radio"
                    id="onComponentMount"
                    label="onDependency"
                    value="onComponentMount"
                    checked={
                      formState.body.lifecycleType === "onComponentMount"
                    }
                    onChange={(e) =>
                      handleFormChange("lifecycleType", e.target.value)
                    }
                    className="me-2"
                  />
                </div>
                {errors.lifecycleType && (
                  <p className="mb-0" style={{ color: "#EA868F" }}>
                    {errors.lifecycleType}
                  </p>
                )}
              </Form.Group>
            </Row>

            {formState.body.lifecycleType === "onComponentMount" && (
              <Row className="mb-3">
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
            )}

            <div className="accordion mb-2">
              <div
                className="accordion-header d-flex justify-content-between bg-secondary text-white p-1"
                onClick={toggleLifecycleConfigAccordion}
              >
                <div>Lifecycle Body</div>
                <div>
                  {lifecycleBodyConfig ? (
                    <i className="bi bi-dash"></i>
                  ) : (
                    <i className="bi bi-plus"></i>
                  )}
                </div>
              </div>
              {lifecycleBodyConfig && (
                <div className="accordion-content px-2 pt-1">
                  <FunctionConfigStack
                    config={formState.body.lifecycleBody.bodyConfig}
                    updateParent={(val) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        body: {
                          ...prevState.body,
                          lifecycleBody: {
                            ...prevState.body.lifecycleBody,
                            bodyConfig: val,
                          },
                        },
                      }));
                    }}
                  />
                </div>
              )}
            </div>

            <Row className="mb-2">
              <Form.Group as={Col} controlId="formGridLifecycleBody">
                <Form.Label>Lifecycle Body</Form.Label>
                <MonacoEditor
                  defaultValue={previewCode}
                  height="150px"
                  width="100%"
                  language="javascript"
                  id={isEditing ? `editor-${formState?.id}` : "lifecycle-form"}
                  readOnlyMode={true}
                />
              </Form.Group>
            </Row>
          </div>
          <div className="d-flex">
            <Button
              variant="success"
              className="my-3 btn btn-sm"
              onClick={handleSubmit}
            >
              {isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </Form>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={4000}
        bg="danger"
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">{toastMessage}</strong>
        </Toast.Header>
      </Toast>
    </>
  );
}

export default LifecycleForm;
