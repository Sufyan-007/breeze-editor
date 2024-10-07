import { callApiClient } from '../../utils/breezeApiCall';

export async function getAllRoutesFullPath(projectName) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/get-full-paths/`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function getRoutingConfig(projectName, parentId = null) {
  let url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/get-childs/`;
  if (parentId) {
    url += `?target_id=${parentId}`;
  }
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function addRoute(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/add/`;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function updateRoute(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/update/`;
  try {
    const response = await callApiClient(url, 'PUT', payload);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteRoute(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/delete/`;
  try {
    const response = await callApiClient(url, 'DELETE', payload);
    return response;
  } catch (error) {
    console.log(error);
  }
}
