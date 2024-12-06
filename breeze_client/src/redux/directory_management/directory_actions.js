import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  addNodeApi,
  deleteNodeApi,
  getFolderConfig,
  moveNodeApi,
  renameNodeApi,
} from '../../modules/project/services/projectService';
import { uploadFile } from '../../modules/resource-configuration/services/ResourcesService';

export const fetchFolderConfig = createAsyncThunk(
  'directory_management/fetchFolderConfig',
  async ({ id = null, projectName, depth }, { rejectWithValue }) => {
    try {
      const response = await getFolderConfig(id, projectName, depth);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addNodeAsync = createAsyncThunk('directory/addNode', async ({ projectId, node }, { rejectWithValue }) => {
  try {
    const response = await addNodeApi(projectId, node);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to rename node');
  }
});

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

export const moveNodeAsync = createAsyncThunk(
  'directory/moveNode',
  async ({ projectName, nodeId, targetId }, { rejectWithValue }) => {
    try {
      await moveNodeApi(projectName, nodeId, targetId);
      return { nodeId, targetId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move node');
    }
  }
);

export const addCustomFile = createAsyncThunk(
  'directory/addCustomFile',
  async ({ payload, projectName }, { rejectWithValue }) => {
    try {
      return await uploadFile(payload, projectName);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload file.');
    }
  }
);
