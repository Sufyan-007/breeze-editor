import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserDetails } from '../../modules/user-management/services/UserManagementService';

export const fetchUserDetails = createAsyncThunk('user/fetchUserDetails', async () => {
  try {
    const response = await getUserDetails();
    return response.user_details;
  } catch (error) {
    return error.message || 'Failed to fetch details';
  }
});
