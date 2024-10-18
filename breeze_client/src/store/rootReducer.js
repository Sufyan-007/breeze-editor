import { combineReducers } from '@reduxjs/toolkit';
import projectReducer from '../redux/project/projectReducers';
import routingReducer from '../redux/routing/routingReducer';
import componentReducer from '../redux/components/componentReducer';
import customZipReducers from '../modules/custom_uploads/redux/customZipReducers';
import environmentReducer from '../redux/settings/settingsReducers';
import directory_reducers from '../redux/directory_management/directory_reducers';
import serviceConfigReducer from '../modules/service-configuration/redux/ApiClientReducers';import { RESET_STORE } from './actions';

const appReducer = combineReducers({
  project: projectReducer,
  routing: routingReducer,
  component: componentReducer,
  zip: customZipReducers,
  directory: directory_reducers,
  environment: environmentReducer,
  services: serviceConfigReducer,
  // Add other module reducers here`
});

const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
