import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, FormGroup, Toast } from "react-bootstrap";
import MonacoEditor from "../../../../common/MonacoEditor";
import FunctionParams from "./FunctionParams";
import FunctionConfigStack from "./FunctionConfigStack";
import { generatePreviewCode } from "../../../../../services/ComponentConfigService";
import dataTypes from "../../../../../constants/datatype";

const formTemplate = {
  name: "",
  type: "function",
  parameters: [],
  isAnonymous: false,
  isAsync: false,
  bodyConfig: {
    type: "BLOCK",
    statements: [],
  },
  description: "",
};
function FunctionConfigForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState(
    isEditing ? formData : formTemplate
  );
  const [previewCode, setPreviewCode] = useState("");
  const [parameterDetails, setParameterDetails] = useState({
    name: "",
    type: "",
    value: "",
    description: "",
  });
  const [paramsConfigOpen, setParamsConfigOpen] = useState(true);
  const [functionConfigOpen, setFunctionConfigOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toggleParamConfigAccordion = () => {
    setParamsConfigOpen(!paramsConfigOpen);
  };

  const toggleFunctionConfigAccordion = () => {
    setFunctionConfigOpen(!functionConfigOpen);
  };

  useEffect(() => {
    generatePreview(formState.bodyConfig);
  }, [formState.bodyConfig]);

  const handleFormChange = (key, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleAddParameter = () => {
    if (parameterDetails.name.trim() !== "") {
      setFormState((prevState) => ({
        ...prevState,
        parameters: [
          ...prevState.parameters,
          {
            name: parameterDetails.name.trim(),
            type: parameterDetails.type,
            value: parameterDetails.value,
            description: parameterDetails.description,
          },
        ],
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
      parameters: prevState.parameters.filter((_, idx) => idx !== index),
    }));
  };

  const updateParams = (param, index) => {
    const updatedParams = [...formState.parameters];
    updatedParams[index] = param;
    setFormState((prevState) => ({
      ...prevState,
      parameters: updatedParams,
    }));
  };

  const handleSubmit = (e) => {
    console.log("formState::>>", formState);
    onSubmit(formState);
  };

  const generatePreview = async (val) => {
    try {
      console.log("val-------------------------::>>", val);
      const response = await generatePreviewCode(val);
      console.log("response::>>", response);
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
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  return (
    <>
      <Form
        onSubmit={(e) => e.preventDefault()}
        style={{ fontSize: "14px" }}
        className="h-100"
      >
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <Row className="mb-2">
              <Form.Group as={Col} controlId="formFunctionName">
                <Form.Control
                  className="form-control-sm"
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
              <FormGroup as={Col}>
                <div className="d-flex mt-1" style={{ fontSize: "14px" }}>
                  <Form.Group controlId="formAsync">
                    <Form.Check
                      type="checkbox"
                      label="Async"
                      checked={formState.isAsync}
                      onChange={(e) =>
                        handleFormChange("isAsync", e.target.checked)
                      }
                      className="me-3"
                    />
                  </Form.Group>
                  <Form.Group controlId="formAnonymous">
                    <Form.Check
                      type="checkbox"
                      label="Anonymous"
                      checked={formState.isAnonymous}
                      onChange={(e) =>
                        handleFormChange("isAnonymous", e.target.checked)
                      }
                    />
                  </Form.Group>
                </div>
              </FormGroup>
            </Row>
            <Row className="mb-2">
              <Form.Group controlId="formDescription">
                <Form.Control
                  className="form-control-sm"
                  type="text"
                  placeholder="Description"
                  value={formState.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                />
              </Form.Group>
            </Row>
            <div className="accordion mb-2">
              <div
                className="accordion-header d-flex justify-content-between bg-secondary text-white p-1"
                onClick={toggleParamConfigAccordion}
              >
                <div>Function Params</div>
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
                      {formState.parameters.length > 0 ? (
                        <ul className="list-group">
                          {formState.parameters.map((param, index) => (
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
                                  style={{ cursor: "pointer", color: "red" }}
                                  onClick={() => handleRemoveParameter(index)}
                                >
                                  <i className="bi bi-trash"></i>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-1">No params added</div>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              )}
            </div>
            <div className="accordion mb-2">
              <div
                className="accordion-header d-flex justify-content-between bg-secondary text-white p-1"
                onClick={toggleFunctionConfigAccordion}
              >
                <div>Function Stack</div>
                <div>
                  {functionConfigOpen ? (
                    <i className="bi bi-dash"></i>
                  ) : (
                    <i className="bi bi-plus"></i>
                  )}
                </div>
              </div>
              {functionConfigOpen && (
                <div className="accordion-content px-2 pt-1">
                  <FunctionConfigStack
                    config={formState.bodyConfig}
                    updateParent={(val) => generatePreview(val)}
                  />
                </div>
              )}
            </div>
            <Row className="mb-2">
              <Form.Group as={Col} controlId="formFunctionBody">
                <Form.Label>Function Preview</Form.Label>
                <MonacoEditor
                  defaultValue={previewCode}
                  // onChange={(value) => handleFormChange("functionBody", value)}
                  height="140px"
                  width="100%"
                  language="javascript"
                  id={isEditing ? `editor-${formState?.id}` : "function-form"}
                  readOnlyMode={true}
                />
              </Form.Group>
            </Row>
          </div>
          <div className="d-flex">
            <Button
              variant="success"
              className="my-3 btn btn-sm"
              type="submit"
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
        delay={3000}
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

export default FunctionConfigForm;
