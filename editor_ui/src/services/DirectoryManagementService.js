export const fetchFolderConfig = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/directory-management/folder-config");
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch folder config:", error);
    throw error;
  }
};
