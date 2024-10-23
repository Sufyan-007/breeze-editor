import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSchemas, editSchemaDetails } from '../services/SchemaService';

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
