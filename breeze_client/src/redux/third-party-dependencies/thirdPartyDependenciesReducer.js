import { createSlice } from '@reduxjs/toolkit';
import {
  fetchThirdPartyDependencies,
  addThirdPartyDependencies,
  updateThirdPartyDependencies,
  deleteThirdPartyDependencies,
} from './thirdPartyDependenciesActions';

const initialState = {
  thirdPartyDependencies: [],
  status: 'ready',
  error: null,
};

const thirdPartyDependencySlice = createSlice({
  name: 'thirdPartyDependencies',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThirdPartyDependencies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchThirdPartyDependencies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const data = action.payload;
        state.thirdPartyDependencies = Object.entries(data).map(([name, version]) => ({
          name,
          version,
        }));
      })
      .addCase(fetchThirdPartyDependencies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addThirdPartyDependencies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addThirdPartyDependencies.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addThirdPartyDependencies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateThirdPartyDependencies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateThirdPartyDependencies.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateThirdPartyDependencies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteThirdPartyDependencies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteThirdPartyDependencies.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteThirdPartyDependencies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default thirdPartyDependencySlice.reducer;
