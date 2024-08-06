import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Form, Toast } from "react-bootstrap";
import {
  Pencil,
  Check,
  X,
  Trash,
} from "react-bootstrap-icons";
import Offcanvas from "../common/Offcanvas";
import AddNewEnvironment from "./AddNewEnvironment";
import {
  fetchEnvironmentSettings,
  saveEnvironmentSettings,
  deleteEnvironment,
  setEnvirontment,
} from "../../services/EnvironmentSettingsService";
import { useParams } from "react-router";
import { getAppBasicConfig } from "../../services/ConfigService";
import ConfirmationModal from "../common/ConfirmationModal";

const EnvironmentSettings = () => {
  const [envVariables, setEnvVariables] = useState([]);
  const [envNames, setEnvNames] = useState([]);
  const [editVariableId, setEditVariableId] = useState(null);
  const [editTempValues, setEditTempValues] = useState({});
  const [originalState, setOriginalState] = useState({
    envVariables: [],
    envNames: [],
    editTempValues: {},
    editVariableId: null,
  });
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showEnvironmentChangeModal, setShowEnvironmentChangeModal] = useState(false);
  const [showDeleteEnvironmentModal, setShowDeleteEnvironmentModal] = useState(false);
  const [environmentToDelete, setEnvironmentToDelete] = useState(null);
  const [pendingEnvName, setPendingEnvName] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [shouldSave, setShouldSave] = useState(false);
  const [selectedEnvName, setSelectedEnvName] = useState(null);
  const containerRef = useRef(null);
  const { projectName } = useParams();
  const defaultEnvName = "default (.env)";
  const prefix = 'REACT_APP_'
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (editVariableId !== null) {
          if (
            envVariables[0].id === editVariableId &&
            !editTempValues.name &&
            !Object.values(editTempValues.values).some((value) => value)
          ) {
            setEnvVariables(envVariables.slice(1));
            setEditVariableId(null);
            setEditTempValues({});
          } else {
            setShowWarningModal(true);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editVariableId, envVariables, editTempValues]);

  useEffect(() => {
    if (shouldSave) {
      handleSave();
      setShouldSave(false);
    }
  }, [shouldSave]);

  const fetchEnvironments = async () => {
    try {
      const data = await fetchEnvironmentSettings(projectName);
      const env = data.config;
      const envVars = Object.entries(env.envVars).map(([id, name]) => ({
        id,
        name,
        values: {},
      }));
      const envNames = Object.keys(env.environments);

      if (!envNames.includes(defaultEnvName)) {
        envNames.push(defaultEnvName);
        env.environments[defaultEnvName] = {};
      }

      const updatedEnvVars = envVars.map((variable) => {
        const values = {};
        envNames.forEach((envName) => {
          values[envName] = env.environments[envName][variable.id] || "";
        });
        return { ...variable, values };
      });

      setEnvVariables(updatedEnvVars);
      setEnvNames(envNames);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAppBasicConfig(projectName);
      setSelectedEnvName(data.current_environment || "default (.env)");
      fetchEnvironments();
    };

    fetchData();
  }, [projectName]);

  const handleAddVariable = () => {
    if (!envNames.includes(defaultEnvName)) {
      setEnvNames([...envNames, defaultEnvName]);
    }
    const newVariable = {
      id: envVariables.length + 1,  
      name: prefix,
      values: { [defaultEnvName]: "" },
    };
    setOriginalState({
      envVariables,
      envNames,
      editTempValues,
      editVariableId,
    });
    setEnvVariables([newVariable, ...envVariables]);
    setEditVariableId(newVariable.id);
    setEditTempValues({ name: prefix, values: { [defaultEnvName]: "" } });
  };

  const handleAddEnvironment = () => {
    setOriginalState({
      envVariables,
      envNames,
      editTempValues,
      editVariableId,
    });
    setIsOffcanvasOpen(true);
  };

  const handleSaveEdit = (id) => {
    const allFieldsFilled = envNames.every(
      (envName) => editTempValues.values[envName]
    );
    if (!editTempValues.name || !allFieldsFilled) {
      setToastMessage("Please fill all fields before saving");
      setShowToast(true);
      return;
    }

    setEnvVariables(
      envVariables.map((variable) =>
        variable.id === id
          ? {
              ...variable,
              name: editTempValues.name,
              values: { ...editTempValues.values },
            }
          : variable
      )
    );
    setEditVariableId(null);
    setEditTempValues({});
    setShouldSave(true);
  };

  const handleCancelEdit = (varId) => {
    if (editVariableId !== null) {
      if (
        envVariables[0].id === editVariableId &&
        !editTempValues.name &&
        !Object.values(editTempValues.values).some((value) => value)
      ) {
        setEnvVariables(envVariables.slice(1));
        setEditVariableId(null);
        setEditTempValues({});
      } else {
        setShowWarningModal(true);
      }
    }
  };

  const handleEditVariable = (id) => {
    setOriginalState({
      envVariables,
      envNames,
      editTempValues,
      editVariableId,
    });
    setEditVariableId(id);
    const variable = envVariables.find((v) => v.id === id);
    setEditTempValues({ name: variable.name, values: { ...variable.values } });
  };

  const handleVariableChange = (id, name, value) => {
    setEditTempValues({
      ...editTempValues,
      values: { ...editTempValues.values, [name]: value },
    });
  };

  const handleNameChange = (value) => {
    setEditTempValues({
      ...editTempValues,
      name: prefix + value,
    });
  };

  const handleModalOk = () => {
    setEnvVariables(originalState.envVariables);
    setEnvNames(originalState.envNames);
    setEditTempValues(originalState.editTempValues);
    setEditVariableId(originalState.editVariableId);
    setShowWarningModal(false);
  };

  const handleEnvironmentModalOk = async () => {
    setSelectedEnvName(pendingEnvName);
    const response = await setEnvirontment(projectName, pendingEnvName);
    setToastMessage(response.message);
    setShowToast(true);
    setShowEnvironmentChangeModal(false);
  };

  const handleOffcanvasSubmit = async (tempEnvName, tempEnvValues) => {
    const newEnvNames = [...envNames, tempEnvName];
    const newEnvVariables = envVariables.map((variable) => ({
      ...variable,
      values: {
        ...variable.values,
        [tempEnvName]: tempEnvValues[variable.id] || "",
      },
    }));
    setEnvNames(newEnvNames);
    setEnvVariables(newEnvVariables);
    setIsOffcanvasOpen(false);
    setShouldSave(true);
  };

  const handleSave = async () => {
    const envVars = {};
    envVariables.forEach((variable) => {
      envVars[`id${variable.id}`] = variable.name;
    });

    const environments = {};
    envNames.forEach((envName) => {
      environments[envName] = {};
      envVariables.forEach((variable) => {
        environments[envName][`id${variable.id}`] = variable.values[envName];
      });
    });

    try {
      const response = await saveEnvironmentSettings(
        projectName,
        envVars,
        environments
      );
      setToastMessage(response.message);
      setShowToast(true);
      console.log("Environment settings saved successfully");
    } catch (error) {
      console.error("Failed to save environment settings:", error);
    }
  };

  const handleDeleteVariable = (id) => {
    setEnvVariables(envVariables.filter((variable) => variable.id !== id));
    setShouldSave(true);
  };

  const handleDeleteEnvironment = (envName) => {
    setEnvironmentToDelete(envName);
    setShowDeleteEnvironmentModal(true);
  };

  const handleDeleteEnvironmentConfirm = async (envName) => {
    try {
      const response = await deleteEnvironment(projectName, envName);
      if (response.error) {
        setToastMessage(response.error);
        setShowToast(true);
        return;
      }
      const updatedEnvNames = envNames.filter((name) => name !== envName);
      const updatedEnvVariables = envVariables.map((variable) => {
        const { [envName]: _, ...remainingValues } = variable.values;
        return { ...variable, values: remainingValues };
      });
      setEnvNames(updatedEnvNames);
      setEnvVariables(updatedEnvVariables);
      setToastMessage(response.message);
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.message);
      setShowToast(true);
    }
  };

  const handleEnvironmentChange = (event) => {
    const newEnvName = event.target.value;
    setPendingEnvName(newEnvName);
    setShowEnvironmentChangeModal(true);
  };

  const isEditingOrAdding = editVariableId !== null || isOffcanvasOpen;

  return (
    <div ref={containerRef} className="position-relative">
      <h2>Environment Settings</h2>
      <div className="mb-2 d-flex justify-content-end">
        <Button
          className="btn-dark btn-sm me-2"
          onClick={handleAddVariable}
          disabled={isEditingOrAdding}
        >
          Add New Environment Variable
        </Button>
        <Button
          className="btn-dark btn-sm"
          onClick={handleAddEnvironment}
          disabled={isEditingOrAdding}
        >
          Add New Environment
        </Button>
      </div>
      <Table bordered variant="dark">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>Actions</th>
            <th>Environment Variable</th>
            {envNames.map((envName, index) => (
              <th key={index} style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{envName}</span>
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      value={envName}
                      checked={selectedEnvName === envName}
                      onChange={handleEnvironmentChange}
                      className="me-2"
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="custom-no-outline-button"
                      onClick={() => handleDeleteEnvironment(envName)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {envVariables.map((variable) => (
            <tr key={variable.id}>
              <td>
                {editVariableId === variable.id ? (
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleSaveEdit(variable.id)}
                      className="me-2"
                      disabled={
                        editTempValues.name === prefix ||
                        !envNames.every(
                          (envName) => editTempValues.values[envName]
                        )
                      }
                    >
                      <Check />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleCancelEdit(variable.id)}
                    >
                      <X />
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleEditVariable(variable.id)}
                      className="me-2"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleDeleteVariable(variable.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                )}
              </td>
              <td>
                {editVariableId === variable.id ? (
                  <div className="input-with-prefix">
                    <span>{prefix}</span>
                    <Form.Control
                      className="bg-dark text-light"
                      type="text"
                      value={editTempValues.name.replace(prefix, "")}
                      placeholder="Write some value here..."
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                ) : (
                  variable.name
                )}
              </td>
              {envNames.map((envName, index) => (
                <td key={index}>
                  {editVariableId === variable.id ? (
                    <Form.Control
                      className="bg-dark text-light"
                      type="text"
                      placeholder="Enter value"
                      value={editTempValues.values[envName] || ""}
                      onChange={(e) =>
                        handleVariableChange(
                          variable.id,
                          envName,
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    variable.values[envName] || ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Offcanvas
        isOpen={isOffcanvasOpen}
        title="Add New Environment"
        width="450px"
        onClose={()=>setIsOffcanvasOpen(false)}
      >
        <AddNewEnvironment
          envVariables={envVariables}
          envNames={envNames}
          onSubmit={handleOffcanvasSubmit}
          onClose={()=>setIsOffcanvasOpen(false)}
        />
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
      <ConfirmationModal
        show={showWarningModal}
        onHide={() => setShowWarningModal(false)}
        title="Warning"
        message="There are unsaved changes. Are you sure you want to discard them?"
        onCancel={() => setShowWarningModal(false)}
        onConfirm={handleModalOk}
      />
      <ConfirmationModal
        show={showEnvironmentChangeModal}
        onHide={() => setShowEnvironmentChangeModal(false)}
        title="Warning"
        message={`Are you sure you want to switch environment to ${
          pendingEnvName === defaultEnvName
            ? "'default'"
            : `'${pendingEnvName}'`
        } ?`}
        onCancel={() => setShowEnvironmentChangeModal(false)}
        onConfirm={handleEnvironmentModalOk}
      />
      <ConfirmationModal
        show={showDeleteEnvironmentModal}
        onHide={() => setShowDeleteEnvironmentModal(false)}
        title="Warning"
        message={`Are you sure you want to delete the environment "${environmentToDelete}"?`}
        confirmButtonText="Delete Environment"
        onCancel={() => setShowDeleteEnvironmentModal(false)}
        onConfirm={async () => {
          await handleDeleteEnvironmentConfirm(environmentToDelete);
          setShowDeleteEnvironmentModal(false);
        }}
      />
    </div>
  );
};

export default EnvironmentSettings;
