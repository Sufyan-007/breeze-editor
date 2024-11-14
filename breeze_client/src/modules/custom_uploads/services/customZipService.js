import { callApiClient } from '../../../utils/breezeApiCall';

const uploadZipFile = async (submitData, projectName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/custom-package-upload/${projectName}`;
  try {
    const response = await callApiClient(url, 'POST', submitData, true);
    return response;
  } catch (error) {
    console.error('error uploading file:', error);
    throw error;
  }
};

const fetchZipFiles = async (projectName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/custom-package/${projectName}`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

const deleteFile = async (fileName, fileId, projectName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/custom-package-delete/${projectName}`;
  const payload = {
    fileName,
    fileId,
  };
  try {
    const response = await callApiClient(url, 'DELETE', payload);
    if (response) {
      return { message: 'File deleted successfully' };
    } else {
      throw new Error(response.Error || 'Failed to delete the file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

const fetchZipFileComponentsService = async (selectedFilename, projectName, additionalPayload = null) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/query_resource/${projectName}/`;
  const payload = {
    category: 'external_components_config',
    libname: selectedFilename,
  };

  if (additionalPayload) {
    payload.resource = additionalPayload.resource;
    payload.select = additionalPayload.select;
  }
  try {
    const response = await callApiClient(url, 'POST', payload);

    return response;
  } catch (error) {
    console.error('Error fetching zip file components:', error);
    throw error;
  }
};

export { uploadZipFile, fetchZipFiles, deleteFile, fetchZipFileComponentsService };
