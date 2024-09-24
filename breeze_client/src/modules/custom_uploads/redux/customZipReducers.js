import { createSlice } from '@reduxjs/toolkit';
import { uploadZipFileAction, fetchZipFilesAction, deleteZipFileAction } from './customZipActions';

const initialState = {
  zipFiles: [], // Stores list of zip files
  status: 'idle', // Tracks the overall status
  uploadStatus: 'idle', // Tracks upload status specifically
  deleteStatus: 'idle', // Tracks delete status specifically
  error: null, // General error
  uploadError: null, // Error for file upload
  deleteError: null, // Error for file deletion
  uploadMessage: null, // Success message for file upload
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
        state.uploadStatus = 'loading';
        state.uploadMessage = null;
        state.uploadError = null;
      })
      .addCase(uploadZipFileAction.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.uploadMessage = action.message; // Assuming the message is in action.payload
      })
      .addCase(uploadZipFileAction.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload;
      });

    // Delete zip file
    // builder
    //   .addCase(deleteZipFileAction.pending, (state) => {
    //     state.deleteStatus = 'loading';
    //     state.deleteError = null;
    //   })
    //   .addCase(deleteZipFileAction.fulfilled, (state, action) => {
    //     state.deleteStatus = 'succeeded';
    //     // Remove the deleted file from zipFiles list by filtering out the deleted file
    //     state.zipFiles = state.zipFiles.filter(
    //       (file) => file.name !== action.meta.arg.fileName
    //     );
    //   })
    //   .addCase(deleteZipFileAction.rejected, (state, action) => {
    //     state.deleteStatus = 'failed';
    //     state.deleteError = action.payload;
    //   });
  },
});

export default zipSlice.reducer;
