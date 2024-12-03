import { callApiClient } from '../../../utils/breezeApiCall';

const BASE_URL = import.meta.env.VITE_BREEZE_BACKEND_HOST;

export async function convertSwagger(projectName, collectionType, formData) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/convert-standard-json/${collectionType}/`;
  const response = callApiClient(apiUrl, 'POST', formData, true, {}, true);
  return response;
}

export async function editFunctionConfig(projectName, operation, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/edit-function-config/${operation}/`;
  const response = callApiClient(apiUrl, 'POST', payload, false, {}, true);
  return response;
}

export async function fetchIntermediates(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  const response = callApiClient(apiUrl, 'POST', payload, false, {}, true, false);
  return response;
}

export async function transferToAuth(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/transfer-to-auth/`;
  const response = callApiClient(apiUrl, 'POST', payload, false, {}, true);
  return response;
}
export async function editModuleName(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/edit-module-title/`;
  const response = callApiClient(apiUrl, 'POST', payload, false, {}, true);
  return response;
}
export async function addNewModule(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/add-module/`;
  const response = callApiClient(apiUrl, 'POST', payload, false, {}, true);
  return response;
}

export async function deleteModule(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/delete/`;
  const response = callApiClient(apiUrl, 'DELETE', payload, false, {}, true);
  return response;
}
export async function getResponseTokens(projectName, moduleId, apiId) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/retrieve-response-tokens/${moduleId}/${apiId}/`;
  const response = callApiClient(apiUrl, 'GET', null, false, {}, true);
  return response;
}
