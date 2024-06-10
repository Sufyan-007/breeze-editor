import React, { useState, useContext } from "react";
import Offcanvas from "../common/Offcanvas";
import VariableForm from "./ActionsConfigForms/VariablesConfigForm";
import FunctionConfigForm from "./ActionsConfigForms/FunctionConfigForm";
import LifecycleConfigForm from "./ActionsConfigForms/LifecycleConfigForm";
import HookConfigForm from "./ActionsConfigForms/HookConfigForm";
import ImportConfigForm from "./ActionsConfigForms/ImportConfigForm";
import PropConfigForm from "./ActionsConfigForms/PropConfigForm";
import { ComponentContext } from "./ComponentConfigPage";
import { useParams } from "react-router";
import { updateComponentConfig } from "../../services/ComponentConfigService";

function ActionsConfig() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [formType, setFormType] = useState("Variables");
  const [formData, setFormData] = useState(null); // To hold data for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const { componentConfig, setComponentConfig } = useContext(ComponentContext);
  const { projectName, componentName } = useParams();
  console.log("compo::>>", componentConfig);

  const handleOpen = (type) => {
    setFormType(type);
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
    setFormType(data.type);
    setFormData(data);
    setIsEditing(true);
    setIsOffcanvasOpen(true);
  };

  const handleFormSubmit = async (data) => {
    const payload = {
      projectId: projectName,
      componentId: componentName,
      body: data,
    };

    try {
      const response = await updateComponentConfig(payload);
      console.log('Update successful:', response);
      setComponentConfig(response);
    } catch (error) {
      console.error('Error updating component config:', error);
    }
    handleClose();
  };

  const renderForm = () => {
    switch (formType) {
      case "stateVars":
        return (
          <VariableForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "refVars":
        return (
          <VariableForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "otherVars":
        return (
          <VariableForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "function":
        return (
          <FunctionConfigForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "lifecycle":
        return (
          <LifecycleConfigForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "hook":
        return (
          <HookConfigForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "imports":
        return (
          <ImportConfigForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      case "propsVars":
        return (
          <PropConfigForm
            onSubmit={handleFormSubmit}
            formData={formData}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  const menuItems = [
    { key: "imports", label: "Imports" },
    { key: "propsVars", label: "Props" },
    { key: "stateVars", label: "Variables" },
    { key: "function", label: "Functions" },
    { key: "lifecycle", label: "Lifecycle" },
    { key: "hook", label: "Hooks" },
  ];

  return (
    <>
      <div>
        <div className="text-end">
          <div className="dropdown">
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Add
            </button>
            <ul
              className="dropdown-menu"
              aria-labelledby="dropdownMenuButton1"
              data-bs-theme="dark"
            >
              {menuItems.map((item) => (
                <li
                  key={item.key}
                  className="dropdown-item"
                  onClick={() => handleOpen(item.key)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="">
            {componentConfig.propsVars.map((prop, index) => (
              <div
                className="d-flex"
                style={{ marginBottom: "2px", cursor: "pointer" }}
                onClick={() => {
                  handleEdit(prop);
                }}
              >
                <strong> {prop.name}</strong>
                <div className="ms-2 fst-italic fw-lighter"> {prop.type}</div>
              </div>
            ))}
            {componentConfig.resources.map((res, index) => (
              <div
                className="d-flex"
                style={{ marginBottom: "2px", cursor: "pointer" }}
                onClick={() => {
                  handleEdit(res);
                }}
              >
                <strong> {res.name}</strong>
                <div className="ms-2 fst-italic fw-lighter"> {res.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleClose}
        title="Action Configuration"
        width="450px"
      >
        <div className="px-1">{renderForm()}</div>
      </Offcanvas>
    </>
  );
}

export default ActionsConfig;
