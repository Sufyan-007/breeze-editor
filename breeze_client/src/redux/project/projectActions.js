import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAppBasicConfig } from '../../modules/project/services/projectService';
import { getConfigVersion } from '../../services/configs/configService';
import { clearSelectedNodePayload, updateSelectedNodePayload } from './projectReducers';

export const fetchProjectConfig = createAsyncThunk(
  'project/fetchProjectConfig',
  async ({ projectName }, { rejectWithValue }) => {
    try {
      const response = await getAppBasicConfig(projectName);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchConfigVersion = createAsyncThunk(
  'project/fetchConfigVersion',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await getConfigVersion(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export { clearSelectedNodePayload, updateSelectedNodePayload };
