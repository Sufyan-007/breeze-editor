import { createSlice } from '@reduxjs/toolkit';
import {
  fetchModules,
  fetchFiles,
  fetchAuthFunctions,
  fetchFunctions,
  convertFile,
  editFunction,
  editModule,
  generateServices,
  transferToAuthFile,
  retrieveResponseTokens,
  addModule,
  generateServiceFile,
  deleteModuleById,
} from './ApiClientActions';

const initialState = {
  moduleList: {},
  transformedOptions: [],
  functionsList: {},
  authFunctionsList: {},
  filesList: {},
  login_apis: [],
  status: 'ready',
  message: '',
  error: null,
};

const serviceConfigSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    deleteFileFromList: (state, action) => {
      const { fileId } = action.payload;
      delete state.filesList[fileId];
      Object.values(state.moduleList).forEach((module) => {
        if (module.files && Array.isArray(module.files)) {
          module.files = module.files.filter((file) => file !== fileId);
        }
      });
    },
    deleteFunctionFromList: (state, action) => {
      const { functionId } = action.payload;
      delete state.functionsList[functionId];
      Object.values(state.filesList).forEach((file) => {
        if (file.functions && Array.isArray(file.functions)) {
          file.functions = file.functions.filter((func) => func !== functionId);
        }
      });
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    const handleFetchModules = (builder) => {
      builder
        .addCase(fetchModules.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchModules.fulfilled, (state, action) => {
          state.status = 'succeeded';
          // const res = Object.entries(action.payload.data).map(([key, value]) => ({
          //   id: key,
          //   title: value.title,
          // }));
          const options = Object.entries(action.payload.data).map(([key, value]) => ({
            label: value.title,
            value: value.title,
            moduleId: key,
          }));
          options.push({ label: 'select', value: '', moduleId: '', hidden: true, selected: true });
          state.transformedOptions = options;
          state.moduleList = action.payload.data;
        })
        .addCase(fetchModules.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };

    const handleConvertFile = (builder) => {
      builder
        .addCase(convertFile.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(convertFile.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.message = action.payload;
        })
        .addCase(convertFile.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    const handleEditFunction = (builder) => {
      builder
        .addCase(editFunction.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(editFunction.fulfilled, (state, action) => {
          const { type, moduleId, api } = action.payload;
          if (type.toLowerCase() === 'auth') {
            state.authFunctionsList[moduleId] = api;
          } else {
            state.functionsList[moduleId] = api;
          }
          state.status = 'succeeded';
          state.message = action.payload;
        })
        .addCase(editFunction.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    const handleEditModule = (builder) => {
      builder
        .addCase(editModule.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(editModule.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.message = action.payload;
        })
        .addCase(editModule.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    const handleServiceGeneration = (builder) => {
      builder
        .addCase(generateServices.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(generateServices.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.message = action.payload;
        })
        .addCase(generateServices.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };

    const handleFetchFiles = (builder) => {
      builder
        .addCase(fetchFiles.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchFiles.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const newFiles = action.payload.data;
          state.filesList = { ...state.filesList, ...newFiles };
        })
        .addCase(fetchFiles.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    const handleFetchFunctions = (builder) => {
      builder
        .addCase(fetchFunctions.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchFunctions.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.functionsList = { ...state.functionsList, ...action.payload };
        })
        .addCase(fetchFunctions.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    const handleFetchAuthFunctions = (builder) => {
      builder
        .addCase(fetchAuthFunctions.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchAuthFunctions.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const { moduleId, data } = action.payload;
          if (!state.authFunctionsList[moduleId]) {
            state.authFunctionsList[moduleId] = [];
          }
          const authApis = Object.entries(data)
            .filter(([key, value]) => key === moduleId)
            .flatMap(([key, value]) => (value.auth_apis ? Object.values(value.auth_apis) : []));
          state.authFunctionsList[moduleId] = authApis;
        })
        .addCase(fetchAuthFunctions.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    const handleAuthTransfer = (builder) => {
      builder
        .addCase(transferToAuthFile.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(transferToAuthFile.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.message = action.payload.data;
        })
        .addCase(transferToAuthFile.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    const handleResponseTokens = (builder) => {
      builder
        .addCase(retrieveResponseTokens.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(retrieveResponseTokens.fulfilled, (state, action) => {
          state.status = 'succeeded';
          let login_api = [];
          for (let api of action.payload.data) {
            if (api.response_tokens) {
              for (const [key, config] of Object.entries(api.response_tokens)) {
                login_api.push({
                  id: api.id,
                  operation_id: api.operation_id,
                  tokenKey: `${api.operation_id}-${key}`,
                  tokenConfig: config,
                  type: api.type,
                });
              }
            }
          }
          state.login_apis = login_api;
        })
        .addCase(retrieveResponseTokens.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };

    const handleAddModule = (builder) => {
      builder
        .addCase(addModule.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(addModule.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.message = action.payload;
        })
        .addCase(addModule.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };

    const handleGenerateService = (builder) => {
      builder
        .addCase(generateServiceFile.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(generateServiceFile.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.message = action.payload;
        })
        .addCase(generateServiceFile.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    const handleDeleteModule = (builder) => {
      builder
        .addCase(deleteModuleById.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(deleteModuleById.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.message = action.payload;
        })
        .addCase(deleteModuleById.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };

    handleDeleteModule(builder);
    handleGenerateService(builder);
    handleAddModule(builder);
    handleFetchModules(builder);
    handleConvertFile(builder);
    handleEditFunction(builder);
    handleEditModule(builder);
    handleServiceGeneration(builder);
    handleFetchAuthFunctions(builder);
    handleFetchFiles(builder);
    handleFetchFunctions(builder);
    handleAuthTransfer(builder);
    handleResponseTokens(builder);
  },
});

export const { resetState, deleteFileFromList, deleteFunctionFromList } = serviceConfigSlice.actions;
export default serviceConfigSlice.reducer;
