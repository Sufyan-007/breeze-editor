import { combineReducers } from '@reduxjs/toolkit';
import projectReducer from '../modules/project/redux/projectReducers';
import customZipReducers from '../modules/custom_uploads/redux/customZipReducers';


const rootReducer = combineReducers({
  project: projectReducer,
  zip : customZipReducers,
  // Add other module reducers here
});

export default rootReducer;
