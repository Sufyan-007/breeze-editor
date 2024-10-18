import { createSlice } from '@reduxjs/toolkit';
import { fetchRoutingConfig, addRouteConfig, updateRouteConfig, deleteRouteConfig } from './routingActions';

const initialState = {
  routingConfig: {},
  status: 'ready',
  error: null,
};

const routingSlice = createSlice({
  name: 'routing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Routing Config
      .addCase(fetchRoutingConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoutingConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newData = action.payload;
        const configs = {};
        for (const node of newData.children) {
          configs[node.id] = node;
        }
        state.routingConfig = {
          ...state.routingConfig,
          ...configs,
        };
      })
      .addCase(fetchRoutingConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add Route
      .addCase(addRouteConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addRouteConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedConfig = action.payload;
        if (updatedConfig) {
          state.routingConfig = updatedConfig;
        }
      })
      .addCase(addRouteConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Route
      .addCase(updateRouteConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRouteConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedConfig = action.payload;
        if (updatedConfig) {
          state.routingConfig = updatedConfig;
        }
      })
      .addCase(updateRouteConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete Route
      .addCase(deleteRouteConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteRouteConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedConfig = action.payload;
        if (updatedConfig) {
          state.routingConfig = updatedConfig;
        }
      })
      .addCase(deleteRouteConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default routingSlice.reducer;
