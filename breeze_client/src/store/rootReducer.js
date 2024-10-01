import { combineReducers } from '@reduxjs/toolkit';
import projectReducer from '../modules/project/redux/projectReducers';
import routingReducer from '../redux/routing/routingReducer';
import componentReducer from '../redux/components/componentReducer';
import directory_reducers from '../redux/directory_management/directory_reducers';

const rootReducer = combineReducers({
  project: projectReducer,
  routing: routingReducer,
  component: componentReducer,
  directory: directory_reducers,
  // Add other module reducers here
});

export default rootReducer;
