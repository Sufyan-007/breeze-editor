import React, { useState } from "react";
import { Container, Button, Form, Row, Col, Toast } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import MonacoEditor from "../common/MonacoEditor";
import { useParams } from "react-router";
// import LifeCycleCard from "./LifeCycleCard";
import Offcanvas from "../common/Offcanvas";

function LifeCycleSection() {
  const { projectName, componentName } = useParams();
  const [lifecycle, setLifecycle] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    lifecycleType: "",
    dependentVars: [],
    body: "",
    returnBody: "",
  });
  const constantsList = ["var1", "var2", "var3", "var4"];
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleOpen = () => setIsOffcanvasOpen(true);
  const handleClose = () => setIsOffcanvasOpen(false);

  const fetchLifecycle = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/lifecycle/?project_id=${projectName}&comp_name=${componentName}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLifecycle(data);
    } catch (error) {
      console.error("Error fetching lifecycle:", error);
      setToastMessage("Error fetching lifecycle.");
      setShowToast(true);
    }
  };

  React.useEffect(() => {
    fetchLifecycle();
  }, []);

  const handleFormChange = (field, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSelect = (selectedList) => {
    setFormState((prevState) => ({
      ...prevState,
      dependentVars: selectedList,
    }));
  };

  const handleRemove = (selectedList) => {
    setFormState((prevState) => ({
      ...prevState,
      dependentVars: selectedList,
    }));
  };

  const handleEditLifecycle = async (index, value) => {
    console.log(index, value);
    const updatedHook = {
      project_id: projectName,
      comp_name: componentName,
      type: "USE_EFFECT",
      hook_name: value.name,
      lifecycleType: value.lifecycleType,
      dependentVars:
        value.lifecycleType === "onEveryMount" ? "null" : value.dependentVars,
      body: value.implementation.body,
      return_body: value.implementation.returnBody,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/lifecycle/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedHook),
      });
      const data = await response.json();
      console.log("data PUT response::>>", data);
      fetchLifecycle();
      setToastMessage("Lifecycle updated !");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating lifecycle:", error);
      setToastMessage("Error updating lifecycle.");
      setShowToast(true);
    }
  };

  const handleDelete = async (name) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/lifecycle/?project_id=${projectName}&comp_name=${componentName}&hook_name=${name}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setToastMessage("Lifecycle Deleted !");
      setShowToast(true);
      setLifecycle(lifecycle.filter((lifecycle) => lifecycle.name !== name));
    } catch (error) {
      console.error("Error deleting lifecycle:", error);
      setToastMessage("Error deleting lifecycle.");
      setShowToast(true);
    }
  };

  const handleSubmit = async () => {
    const newHook = {
      project_id: projectName,
      comp_name: componentName,
      type: "USE_EFFECT",
      hook_name: formState.name,
      lifecycleType: formState.lifecycleType,
      dependentVars:
        formState.lifecycleType === "onEveryMount"
          ? "null"
          : formState.dependentVars,
      body: formState.body,
      return_body: formState.returnBody,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/lifecycle/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newHook),
      });
      const data = await response.json();
      fetchLifecycle();
      if (data?.error) {
        setToastMessage(data.error);
      } else {
        setToastMessage("Lifecycle created !");
      }
      setShowToast(true);
    } catch (error) {
      console.error("Error saving lifecycle:", error);
      setToastMessage("Error saving lifecycle.");
      setShowToast(true);
    }

    handleCancel();
    handleClose();
  };

  const handleCancel = () => {
    setFormState({
      name: "",
      lifecycleType: "",
      dependentVars: [],
      body: "",
      returnBody: "",
    });
  };

  return (
    <>
      <div
        className="row flex-grow-1 h-100 p-2 text-white"
        style={{ backgroundColor: "#303033" }}
      >
        <Container>
          <div className="d-flex align-items-center justify-content-between my-2 mx-3">
            <div className="text-left mt-2">
              <h4>Lifecycle</h4>
            </div>
            <div>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleOpen}
              >
                Add Lifecycle
              </button>
            </div>
          </div>
          <Offcanvas
            isOpen={isOffcanvasOpen}
            onClose={handleClose}
            title="New Lifecycle"
            width="500px"
          >
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridName">
                  <Form.Label>Name</Form.Label>
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
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formState.lifecycleType}
                    onChange={(e) =>
                      handleFormChange("lifecycleType", e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
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
                    <Form.Label>Dependent Variables</Form.Label>
                    <Multiselect
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
                      width="450px"
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
                      onChange={(value) =>
                        handleFormChange("returnBody", value)
                      }
                      height="140px"
                      width="450px"
                      id="return-body-editor"
                      language="javascript"
                    />
                  </Form.Group>
                )}
              </Row>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  className="me-3"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Offcanvas>

          <div>
            {lifecycle.map((lifecycle, index) => (
              <div className="m-2">
                {/* <LifeCycleCard
                  lifeCycleObj={lifecycle}
                  onEdit={() => {}}
                  onDelete={() => {
                    handleDelete(lifecycle.name);
                  }}
                  constantsList={constantsList}
                  updateLifeCycle={(value) => handleEditLifecycle(index, value)}
                /> */}
              </div>
            ))}
          </div>
        </Container>
      </div>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
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

export default LifeCycleSection;
