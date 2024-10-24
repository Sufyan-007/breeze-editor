import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getThirdPartyDependencies,
  addThirdPartyDependency,
  updateThirdPartyDependency,
  deleteThirdPartyDependency,
} from '../../modules/third-party-dependencies/services/ThirdPartyDependenciesService';

export const fetchThirdPartyDependencies = createAsyncThunk(
  'thirdPartyDependencies/fetchThirdPartyDependencies',
  async ({ projectName }) => {
    const response = await getThirdPartyDependencies(projectName);
    return response;
  }
);

export const addThirdPartyDependencies = createAsyncThunk(
  'thirdPartyDependencies/addThirdPartyDependencies',
  async ({ projectName, payload }) => {
    const response = await addThirdPartyDependency(projectName, payload);
    return response;
  }
);

export const updateThirdPartyDependencies = createAsyncThunk(
  'thirdPartyDependencies/updateThirdPartyDependencies',
  async ({ projectName, payload }) => {
    const response = await updateThirdPartyDependency(projectName, payload);
    return response;
  }
);

export const deleteThirdPartyDependencies = createAsyncThunk(
  'thirdPartyDependencies/deleteThirdPartyDependencies',
  async ({ projectName, payload }) => {
    const response = await deleteThirdPartyDependency(projectName, payload);
    return response;
  }
);
