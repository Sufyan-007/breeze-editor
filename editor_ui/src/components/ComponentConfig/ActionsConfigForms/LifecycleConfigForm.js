import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import MonacoEditor from "../../common/MonacoEditor";

function LifecycleForm({ onSubmit, formData, isEditing }) {
  const [formState, setFormState] = useState({
    name: "",
    type: "lifecycle",
    body: {
      lifecycleType: "",
      dependentVars: [],
      helperData: [],
      functionBody: "",
      returnBody: "",
      description: "",
    },
  });

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
    <Form>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridName">
          <Form.Control
            type="text"
            placeholder="Lifecycle Name"
            value={formState.name}
            onChange={(e) => setFormState((prevState) => ({
              ...prevState,
              name: e.target.value,
            }))}
            required
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridType">
          <Form.Select
            value={formState.body.lifecycleType}
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

      {(formState.body.lifecycleType === "onComponentMount" ||
        formState.body.lifecycleType === "onMountAndUnmount" ||
        formState.body.lifecycleType === "onUnmount") && (
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
      )}

      <Row className="mb-3">
        {(formState.body.lifecycleType === "onEveryMount" ||
          formState.body.lifecycleType === "onComponentMount" ||
          formState.body.lifecycleType === "onMountAndUnmount") && (
          <Form.Group as={Col} controlId="formGridFunctionBody">
            <Form.Label>Function Body</Form.Label>
            <MonacoEditor
              defaultValue={formState.body.functionBody}
              onChange={(value) => handleFormChange("functionBody", value)}
              height="140px"
              width="410px"
              id={isEditing ? `editor-${formState?.id}` : "lifecycle-form"}
              language="javascript"
            />
          </Form.Group>
        )}
      </Row>
      <Row className="mb-3">
        {(formState.body.lifecycleType === "onUnmount" ||
          formState.body.lifecycleType === "onMountAndUnmount") && (
          <Form.Group as={Col} controlId="formGridReturnBody">
            <Form.Label>Return Body</Form.Label>
            <MonacoEditor
              defaultValue={formState.body.returnBody}
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
