import { createSlice } from '@reduxjs/toolkit';
import { deleteNodeAsync, fetchFolderConfig, renameNodeAsync } from './directory_actions';
import breezeConfigData from '../../modules/project/constants/DirectoryStructure';

const initialState = {
  directoryConfig: {},
  status: 'ready',
  error: null,
};

const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    updateNodeEditing: (state, action) => {
      const { nodeId, isEditing, tempName } = action.payload;
      if (state.directoryConfig[nodeId]) {
        state.directoryConfig[nodeId].isEditing = isEditing;
        state.directoryConfig[nodeId].tempName = tempName || '';
      }
    },
    updateNodeTempName: (state, action) => {
      const { nodeId, tempName } = action.payload;
      if (state.directoryConfig[nodeId]) {
        state.directoryConfig[nodeId].tempName = tempName;
      }
    },
    cancelRename: (state, action) => {
      const { nodeId } = action.payload;
      if (state.directoryConfig[nodeId]) {
        delete state.directoryConfig[nodeId].tempName;
        state.directoryConfig[nodeId].isEditing = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolderConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFolderConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newData = action.payload;
        const configs = {};
        for (const node of newData.children) {
          configs[node.id] = node;
        }
        state.directoryConfig = {
          ...state.directoryConfig,
          ...configs,
          ...breezeConfigData,
        };
      })
      .addCase(fetchFolderConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // rename node
      .addCase(renameNodeAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(renameNodeAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { nodeId, newName } = action.payload;
        if (state.directoryConfig[nodeId]) {
          state.directoryConfig[nodeId].name = newName;
          delete state.directoryConfig[nodeId].tempName;
          state.directoryConfig[nodeId].isEditing = false;
        }
      })
      .addCase(renameNodeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // delete node
      .addCase(deleteNodeAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteNodeAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { nodeId, parentId } = action.payload;
        if (state.directoryConfig[nodeId]) {
          delete state.directoryConfig[nodeId];
          if (parentId && state.directoryConfig[parentId]?.children) {
            state.directoryConfig[parentId].children = state.directoryConfig[parentId].children.filter(
              (childId) => childId !== nodeId
            );
          }
        }
      })
      .addCase(deleteNodeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { updateNodeEditing, updateNodeTempName, cancelRename } = directorySlice.actions;

export default directorySlice.reducer;
