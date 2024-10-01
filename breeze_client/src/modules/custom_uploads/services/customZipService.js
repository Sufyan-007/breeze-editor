
const uploadZipFile = async (submitData, projectName) => {
    try {
 
      const response = await fetch(
        `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/custom-package-upload/${projectName}`,
        {
          method: 'POST',
          body: submitData,
        }
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("error uploading file:", error);
      throw error;
    }

};


const fetchZipFiles = async (projectName) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/custom-package/${projectName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

const deleteFile = async (file, projectName) => {
  const fileName = file;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/custom-package-delete/${projectName}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      }
    );

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
