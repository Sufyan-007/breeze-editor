import { createSlice } from '@reduxjs/toolkit';
import { fetchProjectConfig } from './projectActions';

const initialState = {
  projectConfig: null,
  status: 'ready',
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
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
      });
  },
});

export default projectSlice.reducer;
