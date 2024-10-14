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

const deleteFile = async (file, projectName) => {
  const fileName = file;
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/custom-package-delete/${projectName}`;
  const payload = {
    fileName,
  };
  try {
    const response = await callApiClient(url, 'DELETE', payload);
    if (response.ok) {
      return { message: 'File deleted successfully' };
    } else {
      throw new Error(response.Error || 'Failed to delete the file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export { uploadZipFile, fetchZipFiles, deleteFile };
