import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import MonacoEditor from "../common/MonacoEditor";

function LifecycleForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    lifecycleType: "",
    dependentVars: [],
    body: "",
    returnBody: "",
  });
  const constantsList = ["var1", "var2", "var3", "var4"];

  useEffect(() => {
    if (isEditing && formData) {
      setFormState(formData);
    }
  }, [isEditing, formData]);

  const handleFormChange = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  const handleSelect = (selectedList, selectedItem) => {
    setFormState({ ...formState, dependentVars: selectedList });
  };

  const handleRemove = (selectedList, removedItem) => {
    setFormState({ ...formState, dependentVars: selectedList });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <Form>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridName">
          {/* <Form.Label>Name</Form.Label> */}
          <Form.Control
            type="text"
            placeholder="Lifecycle Name"
            value={formState.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
            required
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridType">
          {/* <Form.Label>Type</Form.Label> */}
          <Form.Select
            value={formState.lifecycleType}
            onChange={(e) => handleFormChange("lifecycleType", e.target.value)}
          >
            <option value="">Lifecycle Type</option>
            <option value="onEveryMount">onEveryMount</option>
            <option value="onComponentMount">onComponentMount</option>
            <option value="onMountAndUnmount">onMountAndUnmount</option>
            <option value="onUnmount">onUnmount</option>
          </Form.Select>
        </Form.Group>
      </Row>

      {(formState.lifecycleType === "onComponentMount" ||
        formState.lifecycleType === "onMountAndUnmount" ||
        formState.lifecycleType === "onUnmount") && (
        <Row className="mb-3">
          <Form.Group controlId="formGridDependentVars">
            {/* <Form.Label>Dependent Variables</Form.Label> */}
            <Multiselect
              placeholder="Dependent Variables"
              options={constantsList}
              selectedValues={formState.dependentVars}
              onSelect={handleSelect}
              onRemove={handleRemove}
              isObject={false}
              showCheckbox={true}
              style={{
                optionListContainer: {
                  background: "red",
                },
              }}
            />
          </Form.Group>
        </Row>
      )}

      <Row className="mb-3">
        {(formState.lifecycleType === "onEveryMount" ||
          formState.lifecycleType === "onComponentMount" ||
          formState.lifecycleType === "onMountAndUnmount") && (
          <Form.Group as={Col} controlId="formGridFunctionBody">
            <Form.Label>Function Body</Form.Label>
            <MonacoEditor
              defaultValue=""
              onChange={(value) => handleFormChange("body", value)}
              height="140px"
              width="410px"
              id="function-body-editor"
              language="javascript"
            />
          </Form.Group>
        )}
      </Row>
      <Row className="mb-3">
        {(formState.lifecycleType === "onUnmount" ||
          formState.lifecycleType === "onMountAndUnmount") && (
          <Form.Group as={Col} controlId="formGridReturnBody">
            <Form.Label>Return Body</Form.Label>
            <MonacoEditor
              defaultValue=""
              onChange={(value) => handleFormChange("returnBody", value)}
              height="140px"
              width="410px"
              id="return-body-editor"
              language="javascript"
            />
          </Form.Group>
        )}
      </Row>
      <div className="d-flex">
        <Button variant="secondary" className="me-3" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default LifecycleForm;
