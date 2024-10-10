import { callApiClient } from '../../../utils/breezeApiCall';

const BASE_URL = import.meta.env.VITE_BREEZE_BACKEND_HOST;

export async function generateService(type, projectName, payload) {
  let apiUrl = BASE_URL + `/api/code-gen/${projectName}/generate-react-api-client/${type}/`;
  const response = callApiClient(apiUrl, 'POST', payload, false, {}, true);
  return response;
}
