import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, FormGroup } from "react-bootstrap";
import MonacoEditor from "../../../common/MonacoEditor";
import FunctionParams from "./FunctionParams";
import FunctionTree from "./FunctionTree";
import TreeNodeEditor from "./TreeNodeEditor";
import AddTreeNode from "./AddTreeNode";

const fc = {
  id: 1,
  name: "Root",
};

function FunctionConfigForm({ onSubmit, formData, isEditing }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [initialFunctionConfig, setInitialFunctionConfig] = useState(fc);
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
  const [paramsConfigOpen, setParamsConfigOpen] = useState(false);
  const [functionConfigOpen, setFunctionConfigOpen] = useState(true);

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
    if (parameterInput.trim() !== "") {
      setFormState((prevState) => ({
        ...prevState,
        body: {
          ...prevState.body,
          parameters: {
            list: [
              ...prevState.body.parameters.list,
              {
                name: parameterInput.trim(),
                dataType: "",
                defaultValue: "",
                description: "",
              },
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
    console.log("formState::>>", formState);
    onSubmit(formState);
  };

  const [selectedNode, setSelectedNode] = useState(null); // Track selected node for editing

  const handleNodeEdit = (nodeId) => {
    setSelectedNode(nodeId);
    setCurrentStep(2);
  };

  const handleAddChild = (parentId) => {
    setSelectedNode(parentId);
    setCurrentStep(3);
  };

  const onSaveEdit = (nodeId, newName) => {
    setInitialFunctionConfig(
      updateNode(initialFunctionConfig, nodeId, newName)
    );
    setCurrentStep(1);
  };

  const onSaveAdd = (parentId, childName) => {
    setInitialFunctionConfig(
      addNode(initialFunctionConfig, parentId, childName)
    );
    setCurrentStep(1);
  };

  const onCancel = () => {
    setCurrentStep(1);
  };

  function updateNode(tree, nodeId, newName) {
    return traverseAndUpdate(tree, nodeId, newName);
  }

  function traverseAndUpdate(node, nodeId, newName) {
    if (node.id === nodeId) {
      return { ...node, name: newName };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) =>
          traverseAndUpdate(child, nodeId, newName)
        ),
      };
    }
    return node;
  }

  function addNode(tree, parentId, nodeName) {
    return traverseAndAdd(tree, parentId, nodeName);
  }

  function traverseAndAdd(node, parentId, nodeName) {
    if (node.id === parentId) {
      const newNode = { id: Date.now(), name: nodeName, children: [] };
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) =>
          traverseAndAdd(child, parentId, nodeName)
        ),
      };
    }
    return node;
  }

  function findNodeById(tree, nodeId) {
    return traverseAndFind(tree, nodeId);
  }

  function traverseAndFind(node, nodeId) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      for (let child of node.children) {
        const found = traverseAndFind(child, nodeId);
        if (found) return found;
      }
    }
    return null;
  }

  return (
    <Form onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <>
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
                        placeholder="Add Param"
                        value={parameterInput}
                        onChange={(e) => setParameterInput(e.target.value)}
                        className="me-2 form-control-sm"
                      />
                      <div
                        className="mt-1"
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
              <div className="accordion-content px-2 pt-2">
                <FunctionTree
                  initialBodyConfig={initialFunctionConfig}
                  onEditNode={handleNodeEdit}
                  onAddChild={handleAddChild}
                />
              </div>
            )}
          </div>
          <Row className="mb-2">
            <Form.Group as={Col} controlId="formFunctionBody">
              <Form.Label>Function Body</Form.Label>
              <MonacoEditor
                defaultValue={formState.body.functionBody}
                onChange={(value) => handleFormChange("functionBody", value)}
                height="140px"
                width="550px"
                language="javascript"
                id={isEditing ? `editor-${formState?.id}` : "function-form"}
              />
            </Form.Group>
          </Row>
          <div className="d-flex">
            <Button variant="secondary" className="me-3 btn-sm" type="submit">
              {isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </>
      )}
      {currentStep === 2 && (
        <TreeNodeEditor
          node={findNodeById(initialFunctionConfig, selectedNode)} // Pass selected node data to TreeNodeEditor
          onSave={onSaveEdit}
          onCancel={onCancel}
        />
      )}
      {currentStep === 3 && (
        <AddTreeNode
          parentNode={findNodeById(initialFunctionConfig, selectedNode)} // Pass parent node data to AddTreeNode
          onSave={onSaveAdd}
          onCancel={onCancel}
        />
      )}
    </Form>
  );
}

export default FunctionConfigForm;
