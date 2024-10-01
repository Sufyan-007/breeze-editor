const BASE_URL = import.meta.env.VITE_BREEZE_BACKEND_HOST;

export async function generateService(type, projectName, payload) {
  let apiUrl = BASE_URL + `/api/code-gen/${projectName}/generate-react-api-client/${type}/`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}
