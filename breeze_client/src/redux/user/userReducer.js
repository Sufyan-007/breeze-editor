import { createSlice } from '@reduxjs/toolkit';
import { fetchUserDetails } from './userActions';

const initialState = {
  userDetails: {},
  status: 'ready',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
