import React, { useState } from "react";
import Offcanvas from "../common/Offcanvas";
import VariableForm from "./VariablesConfigForm";
import FunctionConfigForm from "./FunctionConfigForm";
import LifecycleConfigForm from "./LifecycleConfigForm";

function ActionsConfig() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [formType, setFormType] = useState("Variables");
  const [formData, setFormData] = useState(null); // To hold data for edit mode
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = () => {
    setFormType("Variables");
    setIsOffcanvasOpen(true);
    setIsEditing(false);
    setFormData(null);
  };

  const handleClose = () => {
    setIsOffcanvasOpen(false);
    setFormType("");
    setFormData(null);
    setIsEditing(false);
  };

  const handleEdit = (data) => {
    setFormData(data);
    setIsEditing(true);
    setIsOffcanvasOpen(true);
  };

  const handleFormSubmit = (data) => {
    // Handle form submission for create or update
    console.log("Form submitted: ", data);
    handleClose();
  };

  const renderForm = () => {
    switch (formType) {
      case "Variables":
        return (
          <VariableForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "Functions":
        return (
          <FunctionConfigForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "Lifecycle":
        return (
          <LifecycleConfigForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <div className="text-end">
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={handleOpen}
          >
            + Add
          </button>
        </div>
        <div
          className=""
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#vars"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Variables
        </div>

        <div className="collapse mb-3" id="vars" data-bs-theme="dark">
        <div className="card card-body">list of vars</div>
        </div>
        <div
          className=""
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#functions"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Functions
        </div>

        <div className="collapse mb-3" id="functions" data-bs-theme="dark">
          <div className="card card-body">list of functions</div>
        </div>
        <div
          className=""
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#lifecycle"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          lifecycle
        </div>

        <div className="collapse" id="lifecycle" data-bs-theme="dark">
          <div className="card card-body">list of lifecycle</div>
        </div>
      </div>

      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleClose}
        title="Action Configuration"
        width="450px"
      >
        <div className="row">
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            <button
              type="button"
              className={`btn  ${
                formType === "Variables"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setFormType("Variables")}
            >
              Variables
            </button>
            <button
              type="button"
              className={`btn  ${
                formType === "Functions"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setFormType("Functions")}
            >
              Functions
            </button>
            <button
              type="button"
              className={`btn  ${
                formType === "Lifecycle"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setFormType("Lifecycle")}
            >
              Lifecycle
            </button>
          </div>
        </div>
        <div className="pt-3 px-1">{renderForm()}</div>
      </Offcanvas>
    </>
  );
}

export default ActionsConfig;
