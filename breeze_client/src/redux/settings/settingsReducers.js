import { createSlice } from '@reduxjs/toolkit';
import {
  deleteEnvironmentConfig,
  editEnvironmentConfig,
  fetchEnvironmentConfig,
  saveEnvironmentConfig,
  setEnvironmentConfig,
} from './settingsActions';

const initialState = {
  environmentSettingsConfig: {
    envVars: [],
    envNames: [],
  },
  currentSetEnvironment: '',
  status: 'ready',
  error: null,
};

const environmentSettingsSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnvironmentConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEnvironmentConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const { envVars, environments } = action.payload.config;
        state.environmentSettingsConfig.envVars = Object.entries(envVars).map(([id, name]) => {
          const values = Object.entries(environments).reduce((acc, [envName, variables]) => {
            acc[envName] = variables[id] || '';
            return acc;
          }, {});
          return {
            id,
            name,
            values,
          };
        });

        state.environmentSettingsConfig.envNames = Object.keys(environments);
      })
      .addCase(fetchEnvironmentConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteEnvironmentConfig.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteEnvironmentConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(setEnvironmentConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSetEnvironment = action.payload.config.environmentName;
      })
      .addCase(setEnvironmentConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveEnvironmentConfig.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(saveEnvironmentConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(editEnvironmentConfig.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(editEnvironmentConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default environmentSettingsSlice.reducer;
