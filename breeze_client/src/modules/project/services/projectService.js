export const getAllProjects = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/project/get-all/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    throw error;
  }
};

export const getFolderConfig = async (id = null, projectName) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/directory/${projectName}/get/?target_id=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const projectConfig = await response.json();
    return projectConfig;
  } catch (error) {
    console.error('Error fetching project config:', error.message);
    throw error;
  }
};
