import { combineReducers } from '@reduxjs/toolkit';
import projectReducer from '../modules/project/redux/projectReducers';

const rootReducer = combineReducers({
  project: projectReducer,
  // Add other module reducers here
});

export default rootReducer;
