import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, FormGroup } from "react-bootstrap";
import MonacoEditor from "../../../common/MonacoEditor";
import FunctionParams from "./FunctionParams";

const dataTypes = [
  "string",
  "number",
  "boolean",
  "callback",
  "array",
  "object",
];

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

  const [parameterDetails, setParameterDetails] = useState({
    name: "",
    dataType: "",
    defaultValue: "",
    description: "",
  });
  const [paramsConfigOpen, setParamsConfigOpen] = useState(true);
  const [functionConfigOpen, setFunctionConfigOpen] = useState(false);

  const toggleParamConfigAccordion = () => {
    setParamsConfigOpen(!paramsConfigOpen);
  };

  const toggleFunctionConfigAccordion = () => {
    setFunctionConfigOpen(!functionConfigOpen);
  };

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
    if (parameterDetails.name.trim() !== "") {
      setFormState((prevState) => ({
        ...prevState,
        body: {
          ...prevState.body,
          parameters: {
            list: [
              ...prevState.body.parameters.list,
              {
                name: parameterDetails.name.trim(),
                dataType: parameterDetails.dataType,
                defaultValue: parameterDetails.defaultValue,
                description: parameterDetails.description,
              },
            ],
          },
        },
      }));
      setParameterDetails({
        name: "",
        dataType: "",
        defaultValue: "",
        description: "",
      });
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
    console.log("formState::>>", formState);
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
                    checked={formState.body.isAsync}
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
                    checked={formState.body.isAnonymous}
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
                value={formState.body.description}
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
                        value={parameterDetails.dataType}
                        onChange={(e) => {
                          const updatedParam = {
                            ...parameterDetails,
                            dataType: e.target.value,
                          };
                          setParameterDetails(updatedParam);
                        }}
                      >
                        <option value="">Datatype</option>
                        {dataTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control
                        type="text"
                        placeholder="Value"
                        value={parameterDetails.defaultValue}
                        onChange={(e) => {
                          const updatedParam = {
                            ...parameterDetails,
                            defaultValue: e.target.value,
                          };
                          setParameterDetails(updatedParam);
                        }}
                        className="me-2 form-control-sm"
                      />
                      <Form.Control
                        type="text"
                        placeholder="Desc"
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
                    <ul className="list-group mt-2">
                      {formState.body.parameters.list?.map((param, index) => (
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
              <div className="accordion-content px-2 pt-2">function tree</div>
            )}
          </div>
          <Row className="mb-2">
            <Form.Group as={Col} controlId="formFunctionBody">
              <Form.Label>Function Body</Form.Label>
              <MonacoEditor
                defaultValue={formState.body.functionBody}
                onChange={(value) => handleFormChange("functionBody", value)}
                height="140px"
                width="100%"
                language="javascript"
                id={isEditing ? `editor-${formState?.id}` : "function-form"}
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

export default FunctionConfigForm;
