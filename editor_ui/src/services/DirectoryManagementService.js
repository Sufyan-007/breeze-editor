export const fetchFolderConfig = async (projectName) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/directory-management/folder-config/${projectName}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
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

export const onAddNode = async (parentId, type, lineage, tag, projectName, name) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/directory-management/add-node/${projectName}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId, type, lineage, tag, name }),
      }
    );
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("failed to add :", error);
    throw error;
  }
};


export const onRenameNode = async (id, name, projectName) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/directory-management/rename-node/${id}/${projectName}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_name: name }), // Wrap name in an object
      }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to rename node:", error);
    throw error;
  }
};

export const onMoveNode = async (dragIds, parentId, projectName) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/directory-management/move-node/${projectName}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dragId: dragIds[0], destinationId: parentId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to move node:", error);
    throw error;
  }
};

export const onDeleteNode = async (id, projectName) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/directory-management/delete-node/${id}/${projectName}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`);
    }

    return { status: "success" };
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};