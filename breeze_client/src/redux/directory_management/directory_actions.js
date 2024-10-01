import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFolderConfig } from '../../modules/project/services/projectService';

export const fetchFolderConfig = createAsyncThunk(
  'directory_management/fetchFolderConfig',
  async ({ id = null, projectName }, { rejectWithValue }) => {
    try {
      const response = await getFolderConfig(id, projectName);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
