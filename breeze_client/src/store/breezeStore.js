import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const breezeStore = configureStore({
  reducer: rootReducer,
});

export default breezeStore;
