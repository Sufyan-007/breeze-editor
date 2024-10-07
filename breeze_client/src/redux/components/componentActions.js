import { createAsyncThunk } from '@reduxjs/toolkit';
import { getComponents } from '../../services/components/componentService';

export const fetchComponents = createAsyncThunk('components/getAll', async ({ projectName }, { rejectWithValue }) => {
  try {
    const response = await getComponents(projectName);
    return response;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch components');
  }
});
