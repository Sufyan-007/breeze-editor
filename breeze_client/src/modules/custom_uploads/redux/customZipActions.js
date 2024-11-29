import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  uploadZipFile,
  fetchZipFiles,
  deleteFile,
  fetchZipFileComponentsService,
  setPropConfigService,
  addPropConfigService,
  deletePropConfigService,
} from '../services/customZipService';

// Action to upload a zip file
export const uploadZipFileAction = createAsyncThunk(
  'zip/uploadZipFile',
  async ({ formData, projectName }, { rejectWithValue }) => {
    try {
      const result = await uploadZipFile(formData, projectName);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to fetch all zip files for a project
export const fetchZipFilesAction = createAsyncThunk('zip/fetchZipFiles', async (projectName, { rejectWithValue }) => {
  try {
    const files = await fetchZipFiles(projectName);
    return files;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Action to delete a zip file
export const deleteZipFileAction = createAsyncThunk(
  'zip/deleteZipFile',
  async ({ fileName, fileId, projectName }, { rejectWithValue }) => {
    try {
      const result = await deleteFile(fileName, fileId, projectName);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchZipFileComponentsAction = createAsyncThunk(
  'zip/fetchZipFileComponents',
  async ({ filename, projectName, payload = null }, { rejectWithValue }) => {
    try {
      const data = await fetchZipFileComponentsService(filename, projectName, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while fetching components');
    }
  }
);

export const updatePropConfigAction = createAsyncThunk(
  'zip/setPropConfig',
  async ({ projectName, formData }, { rejectWithValue }) => {
    try {
      const data = await setPropConfigService(projectName, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while updating props');
    }
  }
);

export const addPropConfigAction = createAsyncThunk(
  'zip/addPropConfig',
  async ({ projectName, formData }, { rejectWithValue }) => {
    try {
      const data = await addPropConfigService(projectName, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while adding props');
    }
  }
);

export const deletePropConfigAction = createAsyncThunk(
  'zip/deletePropConfig',
  async ({ projectName, propId, fileName, componentId }, { rejectWithValue }) => {
    try {
      const data = await deletePropConfigService(projectName, propId, fileName, componentId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while deleting props');
    }
  }
);
