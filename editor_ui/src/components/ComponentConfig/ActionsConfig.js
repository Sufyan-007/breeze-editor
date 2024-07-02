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
import {
  updateComponentConfig,
  reorderComponentActions,
} from "../../services/ComponentConfigService";
import { Toast } from "react-bootstrap";

const menuItems = [
  { key: "imports", label: "Imports" },
  { key: "propsVars", label: "Props" },
  { key: "stateVars", label: "Variables" },
  { key: "function", label: "Functions" },
  { key: "lifecycle", label: "Lifecycle" },
  { key: "hook", label: "Hooks" },
];

const formTitles = {
  stateVars: "Variable Configuration",
  refVars: "Variable Configuration",
  otherVars: "Variable Configuration",
  function: "Function Configuration",
  lifecycle: "Lifecycle Configuration",
  hook: "Hook Configuration",
  imports: "Imports Configuration",
  propsVars: "Prop Configuration",
};

function ActionsConfig() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [formType, setFormType] = useState("Variables");
  const [formData, setFormData] = useState(null); // To hold data for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const { componentConfig, setComponentConfig } = useContext(ComponentContext);
  const { projectName, componentName } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  const handleDragStart = (type, index) => (event) => {
    event.dataTransfer.setData("dragIndex", index);
    event.dataTransfer.setData("type", type);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (type, index) => (event) => {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer.getData("dragIndex"), 10);
    const dragType = event.dataTransfer.getData("type");

    if (dragType !== type || dragIndex === index) return;

    const updatedItems = [...componentConfig[type]];
    const [movedItem] = updatedItems.splice(dragIndex, 1);
    updatedItems.splice(index, 0, movedItem);

    const payload = {
      projectId: projectName,
      componentId: componentName,
      body: {
        type: type,
        data: updatedItems,
      },
    };

    reorderComponentActions(payload)
      .then((response) => {
        setComponentConfig((prevConfig) => ({
          ...prevConfig,
          [type]: updatedItems,
        }));
        setToastMessage("Reordered Successfully");
        setShowToast(true);
      })
      .catch((error) => {
        console.error("Error updating order", error);
        setToastMessage("Error updating order");
        setShowToast(true);
      });
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
      console.log("Update successful:", response);
      setComponentConfig(response);
      setToastMessage("Action Successful");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating component config:", error);
      setToastMessage("Error updating component config");
      setShowToast(true);
    }

    handleClose();
  };

  const renderForm = () => {
    switch (formType) {
      case "stateVars":
      case "refVars":
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

  const renderDraggableList = (items, type) => (
    <div>
      {items.map((item, index) => (
        <div
          key={item.name}
          className="d-flex"
          style={{ marginBottom: "2px", cursor: "pointer" }}
          draggable
          onDragStart={handleDragStart(type, index)}
          onDragOver={handleDragOver}
          onDrop={handleDrop(type, index)}
          onClick={() => handleEdit(item)}
        >
          <strong>{item.name}</strong>
          <div className="ms-2 fst-italic fw-lighter">{item.type}</div>
        </div>
      ))}
    </div>
  );

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
            {renderDraggableList(componentConfig.propsVars, "propsVars")}
            {renderDraggableList(componentConfig.resources, "resources")}
          </div>
        </div>
      </div>

      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleClose}
        title={formTitles[formType] || "Action Configuration"}
        width="600px"
      >
        <div className="px-1">{renderForm()}</div>
      </Offcanvas>

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

export default ActionsConfig;
