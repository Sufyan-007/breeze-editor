import { useState, useEffect, useRef } from 'react';
import AddNewEnvironment from './AddNewEnvironment';
import {
  fetchEnvironmentSettings,
  saveEnvironmentSettings,
  setEnvironment,
  deleteEnvironmentOrVariable,
  editEnvironmentSettings,
} from '../services/EnvironmentSettingsService';
import { useParams } from 'react-router';
import CustomTable from '../../../common/display/datatable/BreezeCustomTable';
import { CustomButtonField, CustomCheckBoxField, CustomTextInput } from '../../../common/fields';
import CustomModal from '../../../common/display/modal/BreezeModal';
import { useSelector } from 'react-redux';
import BreezeOffCanvas from '../../../common/display/offcanvas/BreezeOffcanvas';

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
  const [envVariableToDelete, setEnvVariableToDelete] = useState(null);
  const [pendingEnvName, setPendingEnvName] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [shouldSave, setShouldSave] = useState(false);
  const [selectedEnvName, setSelectedEnvName] = useState(null);
  const [editEnvName, setEditEnvName] = useState(null);
  const [tempEnvName, setTempEnvName] = useState('');
  const containerRef = useRef(null);
  const { projectName } = useParams();
  const defaultEnvName = 'dev (default)';
  const { projectConfig } = useSelector((state) => state.project);
  let prefix;
  if (!projectConfig.buildTool || projectConfig.buildTool === 'Vite') {
    prefix = 'VITE_';
  } else {
    prefix = 'REACT_APP_';
  }

  const handleEditEnvName = (envName) => {
    setEditEnvName(envName);
    setTempEnvName(envName);
  };

  const handleCancelEnvName = () => {
    setEditEnvName(null);
    setTempEnvName('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
          values[envName] = env.environments[envName][variable.id] || '';
        });
        return { ...variable, values };
      });

      updatedEnvVars.reverse();

      setEnvVariables(updatedEnvVars);
      setEnvNames(envNames);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // const data = await getAppBasicConfig(projectName);
      setSelectedEnvName(projectConfig.current_environment || 'dev (default)');
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
      values: { [defaultEnvName]: '' },
    };
    setOriginalState({
      envVariables,
      envNames,
      editTempValues,
      editVariableId,
    });
    setEnvVariables([newVariable, ...envVariables]);
    setEditVariableId(newVariable.id);
    setEditTempValues({ name: prefix, values: { [defaultEnvName]: '' } });
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
    const allFieldsFilled = envNames.every((envName) => editTempValues.values[envName]);
    if (!editTempValues.name || !allFieldsFilled) {
      setToastMessage('Please fill all fields before saving');
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
        const updatedVariable = updatedVariables.find((variable) => variable.id === id);

        const result = await editEnvironmentSettings(projectName, id, updatedVariable, envNames);

        if (result.status === 'success') {
          setEnvVariables(updatedVariables);
          setEditVariableId(null);
          setEditTempValues({});
          setToastMessage(result.message);
          setShowToast(true);
        } else {
          setToastMessage('Failed to update environment settings');
          setShowToast(true);
        }
      } catch (error) {
        console.error('Failed to edit environment settings:', error);
        setToastMessage('An error occurred while saving');
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

  const handleCancelEdit = () => {
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
    const response = await setEnvironment(projectName, pendingEnvName);
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
        [tempEnvName]: tempEnvValues[variable.id] || '',
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
      const response = await saveEnvironmentSettings(projectName, envVars, environments);
      setToastMessage(response.message);
      setShowToast(true);
      console.log('Environment settings saved successfully');
    } catch (error) {
      console.error('Failed to save environment settings:', error);
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

      if (result.status === 'success') {
        // Update the state with the new environment name
        const updatedEnvNames = envNames.map((envName) => (envName === editEnvName ? tempEnvName : envName));
        setEnvNames(updatedEnvNames);
        setEditEnvName(null);
        setTempEnvName('');
        setToastMessage(result.message);
        setShowToast(true);
      } else {
        setToastMessage('Failed to update environment name');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Failed to edit environment name:', error);
      setToastMessage('An error occurred while saving');
      setShowToast(true);
    }
    setShouldSave(true);
  };

  const handleDelete = async ({ envName, envVariableId }) => {
    try {
      const response = await deleteEnvironmentOrVariable(projectName, envName, envVariableId);
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

  const handleEnvironmentChange = (envName) => {
    setPendingEnvName(envName);
    setShowEnvironmentChangeModal(true);
  };

  const isEditingOrAdding = editVariableId !== null || isOffcanvasOpen;

  const columns = [
    {
      header: 'Actions',
      accessor: 'actions',
      align: 'left',
      width: '10%',
      headerRenderer: () => <div style={{ display: 'flex', justifyContent: 'space-between' }}>Actions</div>,
    },
    {
      header: 'Environment Variable',
      accessor: 'variableName',
      align: 'left',
    },
    ...envNames.map((envName) => ({
      header: envName,
      accessor: envName,
      align: 'left',
      headerRenderer: () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editEnvName === envName ? (
            <>
              <CustomTextInput
                name="tempEnvName"
                value={tempEnvName}
                onChange={setTempEnvName}
                className="bg-dark text-light me-2"
                placeholder="Edit Environment Name"
              />
              <CustomButtonField
                label={<i className="bi bi-check2" />}
                onClick={handleSaveEnvName}
                className="btn toggle-btn br-text-primary"
              />
              <CustomButtonField
                label={<i className="bi bi-x" />}
                onClick={handleCancelEnvName}
                className="btn toggle-btn br-text-primary"
              />
            </>
          ) : (
            <>
              <span>{envName}</span>
              <div className="d-flex align-items-center">
                <CustomCheckBoxField
                  name={envName}
                  value={selectedEnvName === envName}
                  onChange={() => handleEnvironmentChange(envName)}
                  config={{
                    className: 'form-check-input me-2',
                  }}
                />
                <CustomButtonField
                  label={<i className="bi bi-pencil" />}
                  onClick={() => handleEditEnvName(envName)}
                  className="btn toggle-btn br-text-primary"
                />
                <CustomButtonField
                  label={<i className="bi bi-trash" />}
                  onClick={() => handleDeleteEnvironment(envName)}
                  className="btn btn-outline-danger btn-sm settings-no-outline-button"
                />
              </div>
            </>
          )}
        </div>
      ),
    })),
  ];

  const data = envVariables.map((variable) => ({
    id: variable.id,
    actions: (
      <div className="d-flex align-items-center">
        {editVariableId === variable.id ? (
          <>
            <CustomButtonField
              label={<i className="bi bi-check2" />}
              onClick={() => handleSaveEdit(editVariableId)}
              className="btn toggle-btn br-text-primary settings-no-outline-button"
              disabled={editTempValues.name === prefix || !envNames.every((envName) => editTempValues.values[envName])}
            />
            <CustomButtonField
              label={<i className="bi bi-x" />}
              onClick={() => handleCancelEdit(variable.id)}
              className="btn toggle-btn br-text-primary"
            />
          </>
        ) : (
          <>
            <CustomButtonField
              label={<i className="bi bi-pencil" />}
              onClick={() => handleEditVariable(variable.id)}
              className="btn toggle-btn br-text-primary"
            />
            <CustomButtonField
              label={<i className="bi bi-trash" />}
              onClick={() => handleDeleteEnvVariable(variable.id)}
              className="btn toggle-btn btn-outline-danger settings-no-outline-button"
            />
          </>
        )}
      </div>
    ),
    variableName:
      editVariableId === variable.id ? (
        <div className="settings-input-with-prefix">
          <span>{prefix}</span>
          <CustomTextInput
            name="editVariableName"
            value={editTempValues.name.replace(prefix, '')}
            onChange={handleNameChange}
            className={`br-form-control ${prefix === 'VITE_' ? 'settings-padding-vite' : 'settings-padding-react'}`}
            placeholder="Write some value here..."
          />
        </div>
      ) : (
        variable.name
      ),
    ...envNames.reduce(
      (acc, envName) => ({
        ...acc,
        [envName]:
          editVariableId === variable.id ? (
            <CustomTextInput
              name={`envValue_${envName}`}
              value={editTempValues.values[envName] || ''}
              onChange={(e) => handleVariableChange(variable.id, envName, e)}
              className="br-form-control"
              placeholder="Enter value"
            />
          ) : (
            variable.values[envName] || ''
          ),
      }),
      {}
    ),
  }));

  return (
    <div ref={containerRef} className="position-relative">
      <h2>Environment Settings</h2>
      <div className="mb-2 d-flex justify-content-end">
        <CustomButtonField
          label="Add New Environment Variable"
          onClick={handleAddVariable}
          className="btn br-background-secondary br-text-primary btn-sm me-2"
          disabled={isEditingOrAdding}
        />
        <CustomButtonField
          label="Add New Environment"
          onClick={handleAddEnvironment}
          className="btn br-background-secondary br-text-primary btn-sm"
          disabled={isEditingOrAdding}
        />
      </div>

      <CustomTable columns={columns} data={data} tableClass="table table-bordered table-dark table-responsive" />
      <BreezeOffCanvas
        show={isOffcanvasOpen}
        title="Add New Environment"
        placement="end"
        width="450px"
        onClose={() => setIsOffcanvasOpen(false)}
      >
        <AddNewEnvironment
          envVariables={envVariables}
          envNames={envNames}
          onSubmit={handleOffcanvasSubmit}
          onClose={() => setIsOffcanvasOpen(false)}
        />
      </BreezeOffCanvas>
      {/* <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">{toastMessage}</strong>
        </Toast.Header>
      </Toast> */}
      <CustomModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        header={{
          title: 'Warning',
        }}
        footer={{
          buttons: [
            {
              label: 'Cancel',
              onClick: () => setShowWarningModal(false),
              className: 'btn btn-secondary',
            },
            {
              label: 'OK',
              onClick: handleModalOk,
              className: 'btn btn-primary',
            },
          ],
        }}
      >
        <p>There are unsaved changes. Are you sure you want to discard them?</p>
      </CustomModal>
      <CustomModal
        isOpen={showEnvironmentChangeModal}
        onClose={() => setShowEnvironmentChangeModal(false)}
        header={{
          title: 'Warning',
        }}
        footer={{
          buttons: [
            {
              label: 'Cancel',
              onClick: () => setShowEnvironmentChangeModal(false),
              className: 'btn btn-secondary',
            },
            {
              label: 'OK',
              onClick: handleEnvironmentModalOk,
              className: 'btn btn-primary',
            },
          ],
        }}
      >
        <p>
          Are you sure you want to switch environment to{' '}
          {pendingEnvName === defaultEnvName ? "'default'" : `'${pendingEnvName}'`}?
        </p>
      </CustomModal>
      <CustomModal
        isOpen={showDeleteEnvironmentModal}
        onClose={() => setShowDeleteEnvironmentModal(false)}
        header={{
          title: 'Warning',
        }}
        footer={{
          buttons: [
            {
              label: 'Cancel',
              onClick: () => setShowDeleteEnvironmentModal(false),
              className: 'btn btn-secondary',
            },
            {
              label: environmentToDelete ? 'Delete Environment' : 'Delete Variable',
              onClick: async () => {
                if (environmentToDelete) {
                  await handleDelete({ envName: environmentToDelete });
                } else if (envVariableToDelete) {
                  await handleDelete({ envVariableId: envVariableToDelete });
                }
                setShowDeleteEnvironmentModal(false);
                setEnvironmentToDelete(null);
                setEnvVariableToDelete(null);
              },
              className: 'btn btn-danger',
            },
          ],
        }}
      >
        <p>
          {environmentToDelete
            ? `Are you sure you want to delete the environment "${environmentToDelete}"?`
            : `Are you sure you want to delete this environment variable?`}
        </p>
      </CustomModal>
    </div>
  );
};

export default EnvironmentSettings;
