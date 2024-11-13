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
        state.routingConfig = newData.data;
      })
      .addCase(fetchRoutingConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add Route
      .addCase(addRouteConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addRouteConfig.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addRouteConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Route
      .addCase(updateRouteConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRouteConfig.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateRouteConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete Route
      .addCase(deleteRouteConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteRouteConfig.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteRouteConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default routingSlice.reducer;
