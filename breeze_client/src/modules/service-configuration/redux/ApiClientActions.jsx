import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  convertSwagger,
  editFunctionConfig,
  editModuleName,
  fetchIntermediates,
  getResponseTokens,
  transferToAuth,
  addNewModule,
  deleteModule,
} from '../services/IntermediateServices';
import { generateService } from '../services/GeneratedService';
import { getFiles, getFunctions, getModules } from '../services/CustomServiceServices';

export const fetchModules = createAsyncThunk(
  'service_configuration/fetchModules',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await getModules(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFiles = createAsyncThunk(
  'service_configuration/fetchFiles',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await getFiles(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFunctions = createAsyncThunk(
  'service_configuration/fetcherFunctions',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await getFunctions(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAuthFunctions = createAsyncThunk(
  'service_configuration/fetchAuthFunctions',
  async ({ projectName, payload, moduleId }, { rejectWithValue }) => {
    try {
      const response = await fetchIntermediates(projectName, payload);
      return { moduleId: moduleId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const convertFile = createAsyncThunk(
  'service_configuration/convertFile',
  async ({ projectName, collectionType, formData }, { rejectWithValue }) => {
    try {
      const response = await convertSwagger(projectName, collectionType, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editFunction = createAsyncThunk(
  'service_configuration/editFunction',
  async ({ projectName, operation, payload }, { rejectWithValue }) => {
    try {
      const response = await editFunctionConfig(projectName, operation, payload);
      return { type: payload.api_type, moduleId: payload.moduleId, api: payload.api_data, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editModule = createAsyncThunk(
  'service_configuration/editModuleName',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await editModuleName(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateServices = createAsyncThunk(
  'service_configuration/generateService',
  async ({ type, projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await generateService(type, projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const transferToAuthFile = createAsyncThunk(
  'service_configuration/transferToAuthFile',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await transferToAuth(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const retrieveResponseTokens = createAsyncThunk(
  'service_configuration/getResponseTokens',
  async ({ projectName, moduleId, apiId }, { rejectWithValue }) => {
    try {
      const response = await getResponseTokens(projectName, moduleId, apiId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addModule = createAsyncThunk(
  'service_configuration/add-module',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await addNewModule(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteModuleById = createAsyncThunk(
  'service_configuration/delete-module',
  async ({ projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await deleteModule(projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateServiceFile = createAsyncThunk(
  'service_configuration/generate-service',
  async ({ type, projectName, payload }, { rejectWithValue }) => {
    try {
      const response = await generateService(type, projectName, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
