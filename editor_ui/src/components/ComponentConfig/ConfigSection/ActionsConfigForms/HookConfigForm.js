import React, { useState, useEffect, useContext, useRef } from "react";
import { Form, Button, Row, Col, Toast } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { useParams } from "react-router";
import MonacoEditor from "../../../common/MonacoEditor";
import { ComponentContext } from "../../ComponentConfigPage";
import { dataTypes } from "../../../../constants/datatype";
import FunctionParams from "./FunctionConfigForm/FunctionParams";
import FunctionConfigStack from "./FunctionConfigForm/FunctionConfigStack";
import { generatePreviewCode } from "../../../../services/ComponentConfigService";

const hookTypes = ["useCallback", "useMemo"];

function HookConfigForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    type: "hook",
    body: {
      type: "",
      dependentVars: [],
      hookBody: {
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
    type: "",
  });

  const [paramsConfigOpen, setParamsConfigOpen] = useState(true);
  const [hookBodyConfig, setHookBodyConfigOpen] = useState(true);
  const [previewCode, setPreviewCode] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [constants, setConstants] = useState([]);
  const [parameterDetails, setParameterDetails] = useState({
    name: "",
    type: "",
    value: "",
    description: "",
  });

  const { componentConfig } = useContext(ComponentContext);
  const { propsVars, resources } = componentConfig;
  const { projectName, componentName } = useParams();
  const debounceTimeout = useRef(null);

  const toggleParamConfigAccordion = () => {
    setParamsConfigOpen(!paramsConfigOpen);
  };
  const toggleFunctionConfigAccordion = () => {
    setHookBodyConfigOpen(!hookBodyConfig);
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
      generatePreview(formState.body.hookBody);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [formState]);

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

    if (key === "type") {
      setFormState((prevState) => {
        const state = {
          ...prevState,
          ...(key === "name" ? { name: value } : {}),
          body: {
            ...prevState.body,
            ...(key !== "name" ? { [key]: value } : {}),
          },
        };
        state.body.hookBody.parameters = [];
        return state;
      });
    } else {
      setFormState((prevState) => ({
        ...prevState,
        ...(key === "name" ? { name: value } : {}),
        body: {
          ...prevState.body,
          ...(key !== "name" ? { [key]: value } : {}),
        },
      }));
    }
  };

  const handleAddParameter = () => {
    if (parameterDetails.name.trim() !== "") {
      setFormState((prevState) => ({
        ...prevState,
        body: {
          ...prevState.body,
          hookBody: {
            ...prevState.body.hookBody,
            parameters: [
              ...prevState.body.hookBody.parameters,
              {
                name: parameterDetails.name.trim(),
                type: parameterDetails.type,
                value: parameterDetails.value,
                description: parameterDetails.description,
              },
            ],
          },
        },
      }));
      setParameterDetails({
        name: "",
        type: "",
        value: "",
        description: "",
      });
    }
  };

  const handleRemoveParameter = (index) => {
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        hookBody: {
          ...prevState.body.hookBody,
          parameters: prevState.body.hookBody.parameters.filter(
            (_, idx) => idx !== index
          ),
        },
      },
    }));
  };

  const updateParams = (param, index) => {
    setFormState((prevState) => {
      const updatedParams = [...prevState.body.hookBody.parameters];
      updatedParams[index] = param;
      return {
        ...prevState,
        body: {
          ...prevState.body,
          hookBody: {
            ...prevState.body.hookBody,
            parameters: updatedParams,
          },
        },
      };
    });
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

  const generatePreview = async (val) => {
    try {
      if (formState.name && formState.body.type) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formState);
    }
  };

  return (
    <>
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
                  <p className="mb-0 mx-1" style={{ color: "#EA868F" }}>
                    {errors.name}
                  </p>
                )}
              </Form.Group>
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
                  <p className="mb-0 mx-1" style={{ color: "#EA868F" }}>
                    {errors.type}
                  </p>
                )}
              </Form.Group>
            </Row>

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

            {formState.body.type === "useCallback" && (
              <div className="accordion mb-2">
                <div
                  className="accordion-header d-flex justify-content-between bg-secondary text-white p-1"
                  onClick={toggleParamConfigAccordion}
                >
                  <div>Params</div>
                  <div>
                    {paramsConfigOpen ? (
                      <i className="bi bi-dash"></i>
                    ) : (
                      <i className="bi bi-plus"></i>
                    )}
                  </div>
                </div>
                {paramsConfigOpen && (
                  <div className="accordion-content px-2 pt-2">
                    <Row className="mb-2">
                      <Form.Group as={Col} controlId="formParameters">
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            value={parameterDetails.name}
                            onChange={(e) => {
                              const updatedParam = {
                                ...parameterDetails,
                                name: e.target.value,
                              };
                              setParameterDetails(updatedParam);
                            }}
                            className="me-2 form-control-sm"
                          />
                          <Form.Control
                            className="me-2 form-control-sm"
                            as="select"
                            size="sm"
                            name="datatype"
                            value={parameterDetails.type}
                            onChange={(e) => {
                              const updatedParam = {
                                ...parameterDetails,
                                type: e.target.value,
                              };
                              setParameterDetails(updatedParam);
                            }}
                          >
                            <option value="">datatype</option>
                            {dataTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </Form.Control>
                          <Form.Control
                            type="text"
                            placeholder="default value"
                            value={parameterDetails.value}
                            onChange={(e) => {
                              const updatedParam = {
                                ...parameterDetails,
                                value: e.target.value,
                              };
                              setParameterDetails(updatedParam);
                            }}
                            className="me-2 form-control-sm"
                          />
                          <Form.Control
                            type="text"
                            placeholder="description"
                            value={parameterDetails.description}
                            onChange={(e) => {
                              const updatedParam = {
                                ...parameterDetails,
                                description: e.target.value,
                              };
                              setParameterDetails(updatedParam);
                            }}
                            className="me-2 form-control-sm"
                          />
                          <div
                            className="mt-1 d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={handleAddParameter}
                          >
                            <i className="bi bi-plus-circle"></i>
                          </div>
                        </div>
                        <div className="m-1">
                          <strong>Params List</strong>
                        </div>
                        {formState.body.hookBody.parameters.length > 0 ? (
                          <ul className="list-group">
                            {formState.body.hookBody.parameters.map(
                              (param, index) => (
                                <li
                                  key={index}
                                  className="list-group-item d-flex justify-content-between align-items-center p-0 py-1"
                                >
                                  <div className="flex-grow-1">
                                    <FunctionParams
                                      param={param}
                                      setParam={(updatedParam) =>
                                        updateParams(updatedParam, index)
                                      }
                                    />
                                  </div>
                                  <div className="text-end">
                                    <div
                                      className="mx-2"
                                      style={{
                                        cursor: "pointer",
                                        color: "red",
                                      }}
                                      onClick={() =>
                                        handleRemoveParameter(index)
                                      }
                                    >
                                      <i className="bi bi-trash"></i>
                                    </div>
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <div className="px-1">No params added</div>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                )}
              </div>
            )}

            <div className="accordion mb-2">
              <div
                className="accordion-header d-flex justify-content-between bg-secondary text-white p-1"
                onClick={toggleFunctionConfigAccordion}
              >
                <div>Function Body</div>
                <div>
                  {hookBodyConfig ? (
                    <i className="bi bi-dash"></i>
                  ) : (
                    <i className="bi bi-plus"></i>
                  )}
                </div>
              </div>
              {hookBodyConfig && (
                <div className="accordion-content px-2 pt-1">
                  <FunctionConfigStack
                    config={formState.body.hookBody.bodyConfig}
                    updateParent={(val) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        body: {
                          ...prevState.body,
                          hookBody: {
                            ...prevState.body.hookBody,
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
              <Form.Group as={Col} controlId="formGridHookBody">
                <Form.Label>Hook Body</Form.Label>
                <MonacoEditor
                  defaultValue={previewCode}
                  height="150px"
                  width="100%"
                  language="javascript"
                  id={isEditing ? `editor-${formState?.id}` : "hook-form"}
                  readOnlyMode={true}
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

export default HookConfigForm;
