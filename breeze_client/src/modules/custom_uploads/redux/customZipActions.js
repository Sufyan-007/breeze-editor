import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadZipFile, fetchZipFiles, deleteFile } from '../services/customZipService';

// Action to upload a zip file
export const uploadZipFileAction = createAsyncThunk(
  'zip/uploadZipFile',
  async ({ formData, projectName }, { rejectWithValue }) => {
    try {
      console.log(formData,projectName,"inside custom action");
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
    console.log(files,"files in custom actions");
    return files;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Action to delete a zip file
export const deleteZipFileAction = createAsyncThunk(
  'zip/deleteZipFile',
  async ({ file, projectName }, { rejectWithValue }) => {
    try {
      const result = await deleteFile(file, projectName);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
