import { createSlice } from '@reduxjs/toolkit';
import { fetchSchemas, editSchema, resolveSchemaProperties, handleDeleteSchema } from './schemaConfigActions';

const initialState = {
  schemaList: {},
  status: 'ready',
};

const schemaConfigSlice = createSlice({
  name: 'schemas',
  initialState,
  reducers: {
    deleteSchemaFromList: (state, action) => {
      const { schemaId, moduleId } = action.payload;
      if (state.schemaList[moduleId]) {
        delete state.schemaList[moduleId][schemaId];
      }
    },
  },
  extraReducers: (builder) => {
    const handleFetchSchemas = (builder) => {
      builder
        .addCase(fetchSchemas.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchSchemas.fulfilled, (state, action) => {
          const result = action.payload;
          state.schemaList = { ...state.schemaList, ...result };
          state.status = 'succeeded';
        })
        .addCase(fetchSchemas.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };

    const handleEditSchema = (builder) => {
      builder
        .addCase(editSchema.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(editSchema.fulfilled, (state) => {
          state.status = 'succeeded';
          state.error = null;
        })
        .addCase(editSchema.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };

    const handleDeleteschema = (builder) => {
      builder
        .addCase(handleDeleteSchema.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(handleDeleteSchema.fulfilled, (state) => {
          state.status = 'succeeded';
          state.error = null;
        })
        .addCase(handleDeleteSchema.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };

    const handleResolveSchema = (builder) => {
      builder
        .addCase(resolveSchemaProperties.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(resolveSchemaProperties.fulfilled, (state) => {
          state.status = 'succeeded';
          state.error = null;
        })
        .addCase(resolveSchemaProperties.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    };
    handleDeleteschema(builder);
    handleResolveSchema(builder);
    handleEditSchema(builder);
    handleFetchSchemas(builder);
  },
});
export const { deleteSchemaFromList } = schemaConfigSlice.actions;
export default schemaConfigSlice.reducer;
