import { createSlice } from '@reduxjs/toolkit';
import { fetchFolderConfig } from './directory_actions';

const initialState = {
  directoryConfig: {},
  status: 'ready',
  error: null,
};

const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolderConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFolderConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newData = action.payload;
        const configs = {};
        for (const node of newData.children) {
          configs[node.id] = node;
        }
        state.directoryConfig = {
          ...state.directoryConfig,
          ...configs,
        };
      })
      .addCase(fetchFolderConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default directorySlice.reducer;
