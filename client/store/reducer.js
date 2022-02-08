import { combineReducers } from 'redux';
import { callReducer } from "./reducers/callReducers";
import { dashboardReducer } from "./reducers/dashboardReducer";

export default combineReducers({
  dashboard: dashboardReducer,
  call: callReducer
});