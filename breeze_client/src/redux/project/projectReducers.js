import { createSlice } from '@reduxjs/toolkit';
import { fetchProjectConfig, fetchConfigVersion } from './projectActions';

const initialState = {
  projectConfig: {},
  selectedNodePayload: {},
  status: 'ready',
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
    clearSelectedNodePayload: (state) => {
      state.selectedNodePayload = {};
    },
    updateSelectedNodePayload: (state, action) => {
      state.selectedNodePayload = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projectConfig = action.payload;
      })
      .addCase(fetchProjectConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchConfigVersion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConfigVersion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedNodePayload = action.payload;
      })
      .addCase(fetchConfigVersion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { updateSelectedNodePayload } = projectSlice.actions;
export const { clearSelectedNodePayload } = projectSlice.actions;
export default projectSlice.reducer;
