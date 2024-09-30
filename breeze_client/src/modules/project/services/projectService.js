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
