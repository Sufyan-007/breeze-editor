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

export const getFolderConfig = async (id = null, projectName, depth = 1) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/directory/${projectName}/get/?target_id=${id}&depth=${depth}`;
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
  try {
    const response = await callApiClient(url, 'POST', projectData, true, {}, false);
    return response;
  } catch (error) {
    console.error('Error creating project:', error.message);
    throw error;
  }
};

export async function getAppBasicConfig(projectName) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/get-metadata/${projectName}/`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function getFileCode(projectName, id) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/directory/${projectName}/get-code/${id}`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function getProjectPort(projectName) {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/get-port/${projectName}`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const deleteProject = async (projectName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/delete/${projectName}/`;
  try {
    const response = await callApiClient(url, 'DELETE');
    return response;
  } catch (error) {
    console.error('Error creating project:', error.message);
    throw error;
  }
};

export const getProjectLogo = async (projectName, logoId) => {
  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  const accessToken = getAccessToken();

  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/download-file/${projectName}/${logoId}/`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the logo');
    }

    return response;
  } catch (error) {
    console.error('Error fetching project logo:', error);
    throw error;
  }
};

export const addNodeApi = async (projectName, node) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/config-editor/${projectName}/file/add/`;
  const payload = {
    fileName: node.tempName,
    parentId: node.parentId,
    type: node.type,
  };
  try {
    const response = await callApiClient(url, 'POST', payload, false, {}, true, true);
    return response;
  } catch (error) {
    console.error('Error adding node:', error.message);
    throw error;
  }
};

export const renameNodeApi = async (projectName, nodeId, newName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/directory/${projectName}/rename-file/`;
  const payload = {
    file_id: nodeId,
    new_name: newName,
  };
  try {
    const response = await callApiClient(url, 'POST', payload);
    //update the open tab.
    return response;
  } catch (error) {
    console.error('Error renaming node:', error.message);
    throw error;
  }
};

export const deleteNodeApi = async (projectName, nodeId) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/directory/${projectName}/delete/`;
  const payload = {
    file_id: nodeId,
  };
  try {
    const response = await callApiClient(url, 'DELETE', payload);
    return response;
  } catch (error) {
    console.error('Error deleting node:', error.message);
    throw error;
  }
};

export const moveNodeApi = async (projectName, nodeId, targetId) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/directory/${projectName}/move-file/`;
  const payload = {
    file_id: nodeId,
    new_parent_id: targetId,
  };
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Error moving node:', error.message);
    throw error;
  }
};
