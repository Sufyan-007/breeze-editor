import { createSlice } from '@reduxjs/toolkit';
import { uploadZipFileAction, fetchZipFilesAction, deleteZipFileAction } from './customZipActions';

const initialState = {
  zipFiles: [],
  status: 'idle',
  error: null,
  uploadMessage: null,
};

const zipSlice = createSlice({
  name: 'zip',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch zip files
    builder
      .addCase(fetchZipFilesAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchZipFilesAction.fulfilled, (state, action) => {
        console.log('fetched zip files payload', action.payload);
        state.status = 'succeeded';
        state.zipFiles = action.payload;
      })
      .addCase(fetchZipFilesAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Upload zip file
    builder
      .addCase(uploadZipFileAction.pending, (state) => {
        state.status = 'loading';
        state.uploadMessage = null;
        state.error = null;
      })
      .addCase(uploadZipFileAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.uploadMessage = action.message;
      })
      .addCase(uploadZipFileAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Delete zip file
    builder
      .addCase(deleteZipFileAction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteZipFileAction.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteZipFileAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default zipSlice.reducer;
