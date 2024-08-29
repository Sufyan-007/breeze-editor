export const saveEnvironmentSettings = async (projectName, envVars, environments) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/environment-settings/${projectName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ envVars, environments }),
      });
  
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
      
      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Failed to fetch environment settings:', error);
      throw error;
    }
  }

  export const editEnvironmentSettings = async (
    projectName, 
    editVariableId = null, 
    envVars = null, 
    environments = null, 
    oldEnvName = null, 
    newEnvName = null
  ) => {
    try {
      const body = {
        envVariableId: editVariableId, // Only include if editing env vars
        envVars,                       // Only include if editing env vars
        environments,                  // Only include if editing env vars
      };
  
      // Include the environment renaming data if provided
      if (oldEnvName && newEnvName) {
        body.oldEnvName = oldEnvName;
        body.envVars = { name: newEnvName };  // Assume envVars['name'] stores the new environment name
      }
  
      const response = await fetch(
        `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/environment-settings/${projectName}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to edit environment settings:', error);
      throw error;
    }
  };
  
  export const setEnvirontment = async (projectName, environmentName)=>{
    try {
      const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/set-environment/${projectName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environmentName }),
      });
     
      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Failed to set environment:', error);
      throw error;
    }
  }

  export const deleteEnvironmentOrVariable = async (projectName, envName = null, envVariableId = null) => {
  
    const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/environment-settings/${projectName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ envName, envVariableId })
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete");
    }
  
    return await response.json();
  };
  