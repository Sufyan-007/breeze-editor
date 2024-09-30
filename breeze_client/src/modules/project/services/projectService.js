import { callApiClient } from '../../../utils/breezeApiCall';

export const getAllProjects = async () => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/get-all/`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    throw error;
  }
};

export const getFolderConfig = async (id = null, projectName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/directory/${projectName}/get/?target_id=${id}`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching project config:', error.message);
    throw error;
  }
};

export const createProject = async (projectData) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/add/`;
  const payload = projectData;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Error creating project:', error.message);
    throw error;
  }
};
