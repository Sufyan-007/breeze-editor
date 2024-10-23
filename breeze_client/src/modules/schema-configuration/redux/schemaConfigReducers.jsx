import { createSlice } from '@reduxjs/toolkit';
import { fetchSchemas, editSchema } from './schemaConfigActions';

const initialState = {
  schemaList: {},
};

const schemaConfigSlice = createSlice({
  name: 'schemas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleFetchSchemas = (builder) => {
      builder
        .addCase(fetchSchemas.pending, (state) => {
          state.error = null;
        })
        .addCase(fetchSchemas.fulfilled, (state, action) => {
          state.schemaList = action.payload.data;
        })
        .addCase(fetchSchemas.rejected, (state, action) => {
          state.error = action.payload;
        });
    };
    const handleEditSchema = (builder) => {
      builder
        .addCase(editSchema.pending, (state) => {
          state.error = null;
        })
        .addCase(editSchema.fulfilled, (state) => {
          state.error = null;
        })
        .addCase(editSchema.rejected, (state, action) => {
          state.error = action.payload;
        });
    };
    handleEditSchema(builder);
    handleFetchSchemas(builder);
  },
});

export default schemaConfigSlice.reducer;
