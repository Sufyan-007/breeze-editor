import { callApiClient } from '../../../utils/breezeApiCall';

export const saveEnvironmentSettings = async (projectName, envVars, environments) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/add-env-settings/${projectName}/`;
  const payload = { envVars, environments };

  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Failed to save environment settings:', error);
    throw error;
  }
};

export const fetchEnvironmentSettings = async (projectName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/get-env-settings/${projectName}/`;

  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.error('Failed to fetch environment settings:', error);
    throw error;
  }
};

export const editEnvironmentSettings = async (
  projectName,
  editVariableId = null,
  envVars = null,
  environments = null,
  oldEnvName = null,
  newEnvName = null
) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/update-env-settings/${projectName}/`;
  const body = {
    envVariableId: editVariableId,
    envVars,
    environments,
    ...(oldEnvName && newEnvName ? { oldEnvName, envVars: { name: newEnvName } } : {}),
  };

  try {
    const response = await callApiClient(url, 'PUT', body);
    return response;
  } catch (error) {
    console.error('Failed to edit environment settings:', error);
    throw error;
  }
};

export const setEnvironment = async (projectName, environmentName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/set-proj-env/${projectName}/`;
  const payload = { environmentName };

  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Failed to set environment:', error);
    throw error;
  }
};

export const deleteEnvironmentOrVariable = async (projectName, envName = null, envVariableId = null) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/delete-env-settings/${projectName}/`;
  const payload = { envName, envVariableId };

  try {
    const response = await callApiClient(url, 'DELETE', payload);
    return response;
  } catch (error) {
    console.error('Failed to delete:', error);
    throw error;
  }
};
