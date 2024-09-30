import { createSlice } from '@reduxjs/toolkit';
import { fetchComponents } from './componentActions';

const initialState = {
  components: {},
  status: 'ready',
  error: null,
};

const componentSlice = createSlice({
  name: 'component',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.components = action.payload;
      })
      .addCase(fetchComponents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default componentSlice.reducer;
