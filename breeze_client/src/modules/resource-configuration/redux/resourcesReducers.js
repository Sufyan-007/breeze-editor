import { createSlice } from '@reduxjs/toolkit';
import { fetchFiles, uploadFileAction, deleteFileAction, downloadFileAction } from './resourcesActions';

const initialState = {
  files: [],
  status: 'idle',
  error: null,
};

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Upload file
      .addCase(uploadFileAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadFileAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.files.push(action.payload);
      })
      .addCase(uploadFileAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete file
      .addCase(deleteFileAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteFileAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.files = state.files.filter((file) => file.id !== action.meta.arg.fileId);
      })
      .addCase(deleteFileAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Download file
      .addCase(downloadFileAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(downloadFileAction.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(downloadFileAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default resourceSlice.reducer;
