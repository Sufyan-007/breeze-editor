import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjectConfig = createAsyncThunk('project/fetchProjectConfig', async (_, { rejectWithValue }) => {
  try {
    //logic and service call goes here
    const response = { data: 'service_call' };
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
