export const saveEnvironmentSettings = async (projectName, envVars, environments) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/environment-settings/${projectName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ envVars, environments }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to save environment settings:', error);
      throw error;
    }
  };
  
  export const fetchEnvironmentSettings = async (projectName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/environment-settings/${projectName}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Failed to fetch environment settings:', error);
      throw error;
    }
  }

  export const deleteEnvironment = async (projectName, environmentName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/environment-settings/${projectName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environmentName }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Failed to delete environment:', error);
      throw error;
    }
  }

  export const editEnvNameIndex = async (projectName, environmentName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/environment-settings/${projectName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environmentName }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Failed to edit environment name:', error);
      throw error;
    }
  }

  export const setEnvirontment = async (projectName, environmentName)=>{
    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/set-environment/${projectName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environmentName }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Failed to set environment:', error);
      throw error;
    }
  }