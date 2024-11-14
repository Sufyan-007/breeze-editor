import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRoutingConfig, addRoute, updateRoute, deleteRoute } from '../../services/routing/routingService';

// Fetch routing config
export const fetchRoutingConfig = createAsyncThunk('routing/fetchRoutingConfig', async ({ projectName }) => {
  const response = await getRoutingConfig(projectName);
  return response;
});

// Add new route
export const addRouteConfig = createAsyncThunk(
  'routing/addRouteConfig',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await addRoute(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update route
export const updateRouteConfig = createAsyncThunk(
  'routing/updateRouteConfig',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await updateRoute(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete route
export const deleteRouteConfig = createAsyncThunk(
  'routing/deleteRouteConfig',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await deleteRoute(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
