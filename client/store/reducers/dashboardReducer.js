const { DASHBOARD_SET_USERNAME, DASHBOARD_SET_ACTIVE_USERS, DASHBOARD_SET_GROUP_CALL_ROOMS } = require("../actionTypes/dashboardActionTypes");

const initialState = {
  username: '',
  activeUsers: [],
  groupCallRooms: []
};

export const dashboardReducer = (state = initialState,action) => {
  switch (action.type) {
    case DASHBOARD_SET_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    case DASHBOARD_SET_ACTIVE_USERS:
      return {
        ...state,
        activeUsers: action.payload
      };
    case DASHBOARD_SET_GROUP_CALL_ROOMS:
      return {
        ...state,
        groupCallRooms: action.payload
      };
  
    default:
      return state;
  }
}