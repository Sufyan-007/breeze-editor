const BASE_URL = import.meta.env.VITE_BREEZE_BACKEND_HOST;

export async function convertSwagger(projectName, collectionType, formData) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/convert-standard-json/${collectionType}/`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

export async function editFunctionConfig(projectName, operation, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/edit-function-config/${operation}/`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

export async function fetchIntermediates(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

export async function transferToAuth(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/transfer-to-auth/`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}
export async function editModuleName(projectName, payload) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/edit-module-title/`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

export async function getResponseTokens(projectName, moduleId, apiId) {
  const apiUrl = `${BASE_URL}/api/config-editor/${projectName}/manage-api-client/retrieve-response-tokens/${moduleId}/${apiId}/`;
  const response = await fetch(apiUrl, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}
