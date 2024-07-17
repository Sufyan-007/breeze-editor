const BASE_URL = process.env.REACT_APP_BREEZE_BACKEND_HOST;

const getAllUploadedFiles = async (projectName) => {
  try {
    const response = await fetch(`${BASE_URL}/editor/resource-config/${projectName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

const uploadFile = async (formData, projectName) => {
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    formData.projectId = projectName;
    formData.file = file;

    const submitData = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && key !== "file") {
        submitData.append(key, formData[key]);
      }
    }
    submitData.append("file", formData.file);

    try {
      const response = await fetch(`${BASE_URL}/editor/file-upload/${projectName}`, {
        method: "POST",
        body: submitData,
      });
      const result = await response.json();
      if (result.fileId) {
        const specificParams = {
          fileName: formData.filename,
          filePath: formData.file_path,
          description: formData.description,
          fileId: result.fileId,
        };
        console.log(specificParams,"see the file path");
        await fetch(`${BASE_URL}/editor/resource-config/${projectName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(specificParams),
        });
      }
      return result;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
};

const deleteFile = async (file, projectName) => {
  const file_id = file.id;
  try {
    const response = await fetch(`${BASE_URL}/editor/file-upload/${projectName}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_id }),
    });

    if (response.ok) {
      const deleteResourceResponse = await fetch(`${BASE_URL}/editor/resource-config/${projectName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(file),
      });

      if (deleteResourceResponse.ok) {
        return { message: "File deleted successfully!" };
      } else {
        const result = await deleteResourceResponse.json();
        throw new Error(result.error || "Failed to delete the resource configuration.");
      }
    } else {
      const result = await response.json();
      throw new Error(result.error || "Failed to delete the file.");
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export { getAllUploadedFiles, uploadFile, deleteFile };
