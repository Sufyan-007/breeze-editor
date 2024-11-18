import { callApiClient } from '../../../utils/breezeApiCall';

const getAllUploadedFiles = async (projectName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/get-uploaded-resource/${projectName}`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.log(error);
  }
};

const uploadFile = async (payload, projectName) => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/upload-file/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload, true, {}, false);
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const deleteFile = async (file, projectName) => {
  const file_id = file.id;
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/delete-file/${projectName}/`;
  try {
    const response = await callApiClient(url, 'DELETE', { file_id });
    return response;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

const downloadFile = async (file, projectName) => {
  const fileId = file.id;
  const fileName = file.name;
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/download-file/${projectName}/${fileId}/`;
  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  const accessToken = getAccessToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to download the file.');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    return { message: 'File downloaded successfully!' };
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export { getAllUploadedFiles, uploadFile, deleteFile, downloadFile };
