import { combineReducers } from '@reduxjs/toolkit';
import projectReducer from '../modules/project/redux/projectReducers';
import routingReducer from '../redux/routing/routingReducer';
import componentReducer from '../redux/components/componentReducer';
import customZipReducers from '../modules/custom_uploads/redux/customZipReducers';


const rootReducer = combineReducers({
  project: projectReducer,
  routing: routingReducer,
  component: componentReducer,
  zip : customZipReducers,
  // Add other module reducers here
});

export default rootReducer;
