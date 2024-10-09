import { callApiClient } from '../../../utils/breezeApiCall';

export const fetchDependencySuggestions = async (query) => {
  const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}&size=10`);
  const data = await response.json();
  return data.objects.map((obj) => ({
    name: obj.package.name,
    version: obj.package.version,
  }));
};

export const fetchDependencyVersions = async (packageName) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const data = await response.json();
  return Object.keys(data.versions);
};

export async function getThirdPartyDependencies(projectName) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/get-third-party-dependency/${projectName}/`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function addThirdPartyDependency(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/add-third-party-dependency/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function updateThirdPartyDependency(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/update-third-party-dependency/${projectName}/`;
  try {
    const response = await callApiClient(url, 'PUT', payload);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteThirdPartyDependency(projectName, payload) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/delete-third-party-dependency/${projectName}/`;
  try {
    const response = await callApiClient(url, 'DELETE', payload);
    return response;
  } catch (error) {
    console.log(error);
  }
}
