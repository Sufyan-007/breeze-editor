import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSchemas, editSchemaDetails, resolveSchema, deleteSchema } from '../services/SchemaService';

export const fetchSchemas = createAsyncThunk(
  'schema_configuration/fetchSchemas',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await getSchemas(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editSchema = createAsyncThunk(
  'schema_configuration/editSchema',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await editSchemaDetails(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const handleDeleteSchema = createAsyncThunk(
  'schema_configuration/deleteSchema',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await deleteSchema(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resolveSchemaProperties = createAsyncThunk(
  'schema_configuration/resolveSchemaProperties',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await resolveSchema(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
