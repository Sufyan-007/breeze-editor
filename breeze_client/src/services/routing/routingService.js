import { callApiClient } from '../../utils/breezeApiCall';

export async function getAllRoutesFullPath(projectName) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/get-full-paths/`;
  const response = await callApiClient(url, 'GET');
  return response;
}

export async function getRoutingConfig(projectName) {
  const payload = { category: 'routing' };
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/query_resource/${projectName}/`;
  const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
  return response;
}

export async function addRoute(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/add/`;
  const response = await callApiClient(url, 'POST', payload);
  return response;
}

export async function updateRoute(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/update/`;
  const response = await callApiClient(url, 'PUT', payload);
  return response;
}

export async function deleteRoute(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/routes/delete/`;
  const response = await callApiClient(url, 'DELETE', payload);
  return response;
}

export async function getRouteDetails(projectName, resource) {
  const payload = { category: 'routing', resource: resource };
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/query_resource/${projectName}/`;
  const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
  return response;
}
