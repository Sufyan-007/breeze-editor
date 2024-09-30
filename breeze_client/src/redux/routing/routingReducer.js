import { createSlice } from '@reduxjs/toolkit';
import { fetchRoutingConfig } from './routingActions';

const initialState = {
  routingConfig: {},
  status: 'ready',
  error: null,
};

const routingSlice = createSlice({
  name: 'routing',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutingConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoutingConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.routingConfig = action.payload;
      })
      .addCase(fetchRoutingConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default routingSlice.reducer;
