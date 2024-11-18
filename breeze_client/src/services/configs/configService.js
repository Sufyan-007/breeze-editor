import { callApiClient } from '../../utils/breezeApiCall';

export async function getConfigVersion(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/get-project-config-version/`;

  try {
    const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
    return response;
  } catch (error) {
    console.error('Error fetching config version:', error.message);
    throw error; // Rethrow the error for further handling
  }
}

export async function changeConfigAndCodeAsOfVersion(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/update-project-config/`;

  try {
    const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
    return response;
  } catch (error) {
    console.error('Error fetching config version:', error.message);
    throw error; // Rethrow the error for further handling
  }
}
