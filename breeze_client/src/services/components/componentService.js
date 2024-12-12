import { callApiClient } from '../../utils/breezeApiCall';

export async function getComponents(projectName) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/query_resource/${projectName}/`;
  const payload = {
    category: 'components',
  };
  try {
    const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function getCodeDetails(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/code-gen/${projectName}/code-indexing/`;
  const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
  return response;
}

export async function addAstStatement(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/file/add-statement/`;
  const response = await callApiClient(url, 'POST', payload, false, {}, true, true);
  return response;
}

export async function updateAstStatement(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/file/update-statement/`;
  const response = await callApiClient(url, 'POST', payload, false, {}, true, true);
  return response;
}

export async function getAstStatement(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/file/get-statement/`;
  const response = await callApiClient(url, 'POST', payload, false, {}, true, false);
  return response;
}

export async function deleteAstStatement(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/file/delete-statement/`;
  const response = await callApiClient(url, 'POST', payload, false, {}, true, true);
  return response;
}
