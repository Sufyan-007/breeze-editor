import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAppBasicConfig } from '../../modules/project/services/projectService';

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
