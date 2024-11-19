import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteNodeApi, getFolderConfig, renameNodeApi } from '../../modules/project/services/projectService';

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

export const renameNodeAsync = createAsyncThunk(
  'directory/renameNode',
  async ({ projectId, nodeId, newName }, { rejectWithValue }) => {
    try {
      await renameNodeApi(projectId, nodeId, newName);
      return { nodeId, newName };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rename node');
    }
  }
);

export const deleteNodeAsync = createAsyncThunk(
  'directory/deleteNode',
  async ({ projectId, nodeId }, { rejectWithValue }) => {
    try {
      await deleteNodeApi(projectId, nodeId, '');
      return { nodeId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete node');
    }
  }
);
