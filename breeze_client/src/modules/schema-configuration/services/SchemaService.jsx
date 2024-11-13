import { callApiClient } from '../../../utils/breezeApiCall';

const BASE_URL = import.meta.env.VITE_BREEZE_BACKEND_HOST;

export async function getSchemas(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  const schemas = await callApiClient(apiUrl, 'POST', payload, false, {}, true, false);
  const response = {
    [payload.module]: schemas.data,
  };
  return response;
}

export async function editSchemaDetails(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/edit-schema/`;
  const response = callApiClient(apiUrl, 'POST', payload, false, {}, true);
  return response;
}

export async function resolveSchema(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/resolve-schema/`;
  const response = callApiClient(apiUrl, 'POST', payload, false, {}, true);
  return response;
}
