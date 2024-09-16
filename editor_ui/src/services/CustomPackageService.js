const BASE_URL = process.env.REACT_APP_BREEZE_BACKEND_HOST;

const uploadZipFile = async (formData, projectName) => {
  // console.log(projectName, "project name ");
  const fileInput = document.querySelector('input[type="file"]');
  // console.log(fileInput.files.length);
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    // console.log(file, formData);
    formData.projectId = projectName;
    formData.file = file;
    // console.log(formData);

    const submitData = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && key !== "file") {
        submitData.append(key, formData[key]);
      }
    }
    submitData.append("file", formData.file);

    
    try {
 
      const response = await fetch(
        `${BASE_URL}/editor/custom-package-upload/${projectName}`,
        {
          method: "POST",
          body: submitData,
        }
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("error uploading file:", error);
      throw error;
    }
  }
};

const fetchZipFiles = async (projectName) => {
  try {
    const response = await fetch(
      `${BASE_URL}/editor/custom-package-upload/${projectName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    // console.log(result, "result in service");
    return result;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

const deleteFile = async (file, projectName) => {
  const fileName = file;
  try {
    const response = await fetch(
      `${BASE_URL}/editor/custom-package-upload/${projectName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      }
    );

    if (response.ok) {
      return { message: "File deleted successfully" };
    } else {
      throw new Error(response.Error || "Failed to delete the file");
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export { uploadZipFile, fetchZipFiles, deleteFile };
