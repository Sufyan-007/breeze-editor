import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteFile, downloadFile, getAllUploadedFiles, uploadFile } from '../services/ResourcesService';

export const fetchFiles = createAsyncThunk('files/fetchFiles', async ({ projectName }, { rejectWithValue }) => {
  try {
    const response = await getAllUploadedFiles(projectName);
    return response.folders.map((file) => ({
      id: file.id,
      name: file.name,
      type: file.type,
    }));
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch files.');
  }
});

export const uploadFileAction = createAsyncThunk(
  'files/uploadFile',
  async ({ payload, projectName }, { rejectWithValue }) => {
    try {
      return await uploadFile(payload, projectName);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload file.');
    }
  }
);

export const deleteFileAction = createAsyncThunk(
  'files/deleteFile',
  async ({ fileId, projectName }, { rejectWithValue }) => {
    try {
      return await deleteFile(fileId, projectName);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete file.');
    }
  }
);

export const downloadFileAction = createAsyncThunk(
  'files/downloadFile',
  async ({ file, projectName }, { rejectWithValue }) => {
    try {
      return await downloadFile(file, projectName);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to download file.');
    }
  }
);
