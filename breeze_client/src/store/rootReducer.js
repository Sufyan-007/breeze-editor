import { combineReducers } from '@reduxjs/toolkit';
import projectReducer from '../modules/project/redux/projectReducers';
import routingReducer from '../modules/routing/redux/routingReducer';

const rootReducer = combineReducers({
  project: projectReducer,
  routing: routingReducer,
  // Add other module reducers here
});

export default rootReducer;
