import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Form, Toast } from "react-bootstrap";
import { Pencil, Check, X, Trash } from "react-bootstrap-icons";
import Offcanvas from "../common/Offcanvas";
import AddNewEnvironment from "./AddNewEnvironment";
import {
  fetchEnvironmentSettings,
  saveEnvironmentSettings,
  setEnvirontment,
  deleteEnvironmentOrVariable,
  editEnvironmentSettings,
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
  const [showEnvironmentChangeModal, setShowEnvironmentChangeModal] = useState(
    false
  );
  const [showDeleteEnvironmentModal, setShowDeleteEnvironmentModal] = useState(
    false
  );
  const [environmentToDelete, setEnvironmentToDelete] = useState(null);
  const [envVariableToDelete, setEnvVariableToDelete] = useState(null);
  const [pendingEnvName, setPendingEnvName] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [shouldSave, setShouldSave] = useState(false);
  const [selectedEnvName, setSelectedEnvName] = useState(null);
  const [editEnvName, setEditEnvName] = useState(null); 
  const [tempEnvName, setTempEnvName] = useState(""); 
  const containerRef = useRef(null);
  const { projectName } = useParams();
  const defaultEnvName = "dev (default)";
  const prefix = 'VITE_'



  const handleEditEnvName = (envName) => {
    setEditEnvName(envName);
    setTempEnvName(envName); 
  };

  const handleCancelEnvName = () => {
    setEditEnvName(null);
    setTempEnvName("");
  };

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

      updatedEnvVars.reverse();

      setEnvVariables(updatedEnvVars);
      setEnvNames(envNames);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAppBasicConfig(projectName);
      setSelectedEnvName(data.current_environment || "dev (default)");
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

  const isUUID = (id) => {
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidPattern.test(id);
  };

  const handleSaveEdit = async (id) => {
    const allFieldsFilled = envNames.every(
      (envName) => editTempValues.values[envName]
    );
    if (!editTempValues.name || !allFieldsFilled) {
      setToastMessage("Please fill all fields before saving");
      setShowToast(true);
      return;
    }

    if (isUUID(id)) {
      try {
        const updatedVariables = envVariables.map((variable) =>
          variable.id === id
            ? {
                ...variable,
                name: editTempValues.name,
                values: { ...editTempValues.values },
              }
            : variable
        );

        // Find the updated variable
        const updatedVariable = updatedVariables.find(
          (variable) => variable.id === id
        );

        const result = await editEnvironmentSettings(
          projectName,
          id,
          updatedVariable,
          envNames
        );

        if (result.status === "success") {
          setEnvVariables(updatedVariables);
          setEditVariableId(null);
          setEditTempValues({});
          setToastMessage(result.message);
          setShowToast(true);
        } else {
          setToastMessage("Failed to update environment settings");
          setShowToast(true);
        }
      } catch (error) {
        console.error("Failed to edit environment settings:", error);
        setToastMessage("An error occurred while saving");
        setShowToast(true);
      }
      setShouldSave(true);
    } else {
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
      return;
    }
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
      envVars[`${variable.id}`] = variable.name;
    });

    const environments = {};
    envNames.forEach((envName) => {
      environments[envName] = {};
      envVariables.forEach((variable) => {
        environments[envName][`${variable.id}`] = variable.values[envName];
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

    fetchEnvironments();
  };

  const handleSaveEnvName = async () => {
    try {
      const result = await editEnvironmentSettings(
        projectName,
        null, // No variable ID, as we are editing the environment name
        null, // No envVars, as we're not editing the variables
        null, // No environments, as we're not editing the variables
        editEnvName, // The old environment name
        tempEnvName // The new environment name
      );

      if (result.status === "success") {
        // Update the state with the new environment name
        const updatedEnvNames = envNames.map((envName) =>
          envName === editEnvName ? tempEnvName : envName
        );
        setEnvNames(updatedEnvNames);
        setEditEnvName(null);
        setTempEnvName("");
        setToastMessage(result.message);
        setShowToast(true);
      } else {
        setToastMessage("Failed to update environment name");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Failed to edit environment name:", error);
      setToastMessage("An error occurred while saving");
      setShowToast(true);
    }
    setShouldSave(true);
  };

  const handleDelete = async ({ envName, envVariableId }) => {
    try {
      const response = await deleteEnvironmentOrVariable(
        projectName,
        envName,
        envVariableId
      );
      if (response.error) {
        setToastMessage(response.error);
        setShowToast(true);
        return;
      }
      setToastMessage(response.message);
      setShowToast(true);
      fetchEnvironments();
    } catch (error) {
      setToastMessage(error.message);
      setShowToast(true);
    }
  };

  // For deleting an environment
  const handleDeleteEnvironment = (envName) => {
    setEnvironmentToDelete(envName);
    setShowDeleteEnvironmentModal(true);
  };

  // For deleting an environment variable
  const handleDeleteEnvVariable = (envVariableId) => {
    setEnvVariableToDelete(envVariableId);
    setShowDeleteEnvironmentModal(true);
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
                  {editEnvName === envName ? (
                    <>
                      <Form.Control
                        className="bg-dark text-light me-2"
                        type="text"
                        value={tempEnvName}
                        onChange={(e) => setTempEnvName(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleSaveEnvName}
                        className="me-2"
                      >
                        <Check />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={handleCancelEnvName}
                      >
                        <X />
                      </Button>
                    </>
                  ) : (
                    <>
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
                          variant="outline-secondary"
                          size="sm"
                          className="custom-no-outline-button"
                          onClick={() => handleEditEnvName(envName)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="custom-no-outline-button"
                          onClick={() => handleDeleteEnvironment(envName)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </>
                  )}
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
                  <>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleSaveEdit(editVariableId)}
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
                  </>
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
                      onClick={() => handleDeleteEnvVariable(variable.id)}
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
        onClose={() => setIsOffcanvasOpen(false)}
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
        message={
          environmentToDelete
            ? `Are you sure you want to delete the environment "${environmentToDelete}"?`
            : `Are you sure you want to delete this environment variable?`
        }
        confirmButtonText={
          environmentToDelete ? "Delete Environment" : "Delete Variable"
        }
        onCancel={() => setShowDeleteEnvironmentModal(false)}
        onConfirm={async () => {
          if (environmentToDelete) {
            await handleDelete({ envName: environmentToDelete });
          } else if (envVariableToDelete) {
            await handleDelete({ envVariableId: envVariableToDelete });
          }
          setShowDeleteEnvironmentModal(false);
          setEnvironmentToDelete(null);
          setEnvVariableToDelete(null);
        }}
      />
    </div>
  );
};

export default EnvironmentSettings;
