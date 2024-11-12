import { createSlice } from '@reduxjs/toolkit';
import {
  uploadZipFileAction,
  fetchZipFilesAction,
  deleteZipFileAction,
  fetchZipFileComponentsAction,
} from './customZipActions';

const initialState = {
  zipFiles: [],
  fileId: null,
  zipFiles: [],
  status: 'idle',
  error: null,
  components: { data: {} },
  props: null,
};

const zipSlice = createSlice({
  name: 'zip',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch zip files
    builder
      .addCase(fetchZipFilesAction.pending, () => {})
      .addCase(fetchZipFilesAction.fulfilled, (state, action) => {
        state.zipFiles = action.payload;
      })
      .addCase(fetchZipFilesAction.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Upload zip file
    builder
      .addCase(uploadZipFileAction.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadZipFileAction.fulfilled, (state, action) => {
        state.fileId = action.payload["file_id"];

      })
      .addCase(uploadZipFileAction.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete zip file
    builder
      .addCase(deleteZipFileAction.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteZipFileAction.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteZipFileAction.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(fetchZipFileComponentsAction.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchZipFileComponentsAction.fulfilled, (state, action) => {
        const { data } = action.payload;

        // Check if `props` exists in the response data
        if (data && data.props) {
          state.props = data.props; // Store the `props` in the state
        } else {
          state.components = { data }; // Store `data` as components if `props` doesn't exist
        }
      })
      .addCase(fetchZipFileComponentsAction.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default zipSlice.reducer;
