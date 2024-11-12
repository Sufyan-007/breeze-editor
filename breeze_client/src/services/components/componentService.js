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
