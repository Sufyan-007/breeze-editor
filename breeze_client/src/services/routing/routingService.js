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

export async function getRoutingConfig(projectName) {
  const payload = { category: 'routing' };
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/query_resource/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
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

export async function getRouteDetails(projectName, resource) {
  const payload = { category: 'routing', resource: resource };
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/query_resource/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
    return response;
  } catch (error) {
    console.log(error);
  }
}
