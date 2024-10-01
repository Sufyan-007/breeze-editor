import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apiList: [],
  authApiList: [],
};

const testSlice = createSlice({
  name: 'apiClient',
  initialState,
  reducers: {
    setApiList(state, action) {
      state.apiList = action.payload;
    },
    setAuthApiList(state, action) {
      state.authApiList = action.payload;
    },
  },
});

export const { setApiList, setAuthApiList } = testSlice.actions;

export default testSlice.reducer;
