import { DASHBOARD_SET_ACTIVE_USERS, DASHBOARD_SET_GROUP_CALL_ROOMS, DASHBOARD_SET_USERNAME } from "../actionTypes/dashboardActionTypes";

export const setUsername = (username) => {
  return {
    type: DASHBOARD_SET_USERNAME,
    payload:username
  };
};

export const setActiveUsers = (activeUsers) => {
  return {
    type: DASHBOARD_SET_ACTIVE_USERS,
    payload:activeUsers
  };
};

export const setGroupCalls = (groupCallRooms) => {
  return {
    type: DASHBOARD_SET_GROUP_CALL_ROOMS,
    payload:groupCallRooms
  };
};