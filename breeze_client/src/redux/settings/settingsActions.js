import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteEnvironmentOrVariable,
  editEnvironmentSettings,
  fetchEnvironmentSettings,
  saveEnvironmentSettings,
  setEnvironment,
} from '../../modules/settings/services/EnvironmentSettingsService';

export const saveEnvironmentConfig = createAsyncThunk(
  'environment/saveEnvironmentConfig',
  async ({ projectName, envVars, environments }, { rejectWithValue }) => {
    try {
      const response = await saveEnvironmentSettings(projectName, envVars, environments);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEnvironmentConfig = createAsyncThunk(
  'environemnt/fetchEnvironmentConfig',
  async ({ projectName }, { rejectWithValue }) => {
    try {
      const response = await fetchEnvironmentSettings(projectName);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editEnvironmentConfig = createAsyncThunk(
  'environment/editEnvironmentConfig',
  async ({ projectName, editVariableId, envVars, environments, oldEnvName, newEnvName }, { rejectWithValue }) => {
    try {
      const response = await editEnvironmentSettings(
        projectName,
        editVariableId,
        envVars,
        environments,
        oldEnvName,
        newEnvName
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const setEnvironmentConfig = createAsyncThunk(
  'environment/setEnvironmentConfig',
  async ({ projectName, environmentName }, { rejectWithValue }) => {
    try {
      const response = await setEnvironment(projectName, environmentName);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEnvironmentConfig = createAsyncThunk(
  'environment/deleteEnvironmentConfig',
  async ({ projectName, envName, envVariableId }, { rejectWithValue }) => {
    try {
      const response = await deleteEnvironmentOrVariable(projectName, envName, envVariableId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
