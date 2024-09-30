import { combineReducers } from '@reduxjs/toolkit';
import projectReducer from '../modules/project/redux/projectReducers';
import routingReducer from '../redux/routing/routingReducer';
import componentReducer from '../redux/components/componentReducer';

const rootReducer = combineReducers({
  project: projectReducer,
  routing: routingReducer,
  component: componentReducer,
  // Add other module reducers here
});

export default rootReducer;
