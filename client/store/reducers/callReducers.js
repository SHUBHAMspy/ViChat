const { callStates, SET_LOCAL_STREAM, SET_CALL_STATE, SET_CALLING_DIALOG_VISIBLE, SET_CALLER_USERNAME, SET_CALL_REJECTED, SET_REMOTE_STREAM, SET_LOCAL_CAMERA_ENABLED, SET_LOCAL_MICROPHONE_ENABLED, SET_SCREEN_SHARING_ACTIVE, RESET_CALL_STATE, SET_GROUP_CALL_ACTIVE, SET_GROUP_CALL_STREAMS, CLEAR_GROUP_CALL_DATA, SET_CHAT_MESSAGE } = require("../actionTypes/callActionTypes");

const initState = {
  localStream: null,
  remoteStream: null,
  callState: callStates.CALL_UNAVAILABLE,
  callingDialogVisible: false,
  callerUsername: '',
  callRejected: {
    rejected: false,
    reason: ''
  },
  localCameraEnabled: true,
  localMicrophoneEnabled: true,
  screenSharingActive: false,
  groupCallActive: false,
  groupCallStreams: [],
  message: {
    received: false,
    content: ''
  }
};

export const callReducer = (state = initState,action) => {
  switch (action.type) {
    case SET_LOCAL_STREAM:
      return{
        ...state,
        localStream: action.payload
      }
    case SET_CALL_STATE:
      return{
        ...state,
        callState: action.payload
      }
    case SET_CALLING_DIALOG_VISIBLE:
      return{
        ...state,
        callingDialogVisible: action.payload
      }
    case SET_CALLER_USERNAME:
      return{
        ...state,
        callerUsername: action.payload
      }

    case SET_CALL_REJECTED:
      return{
        ...state,
        callRejected: action.payload
      }

    case SET_REMOTE_STREAM:
      return{
        ...state,
        remoteStream: action.payload
      }
      
    case SET_LOCAL_CAMERA_ENABLED:
      return{
        ...state,
        localCameraEnabled: action.payload
      }
    case SET_LOCAL_MICROPHONE_ENABLED:
      return{
        ...state,
        localMicrophoneEnabled: action.payload
      }
    case SET_SCREEN_SHARING_ACTIVE:
      return{
        ...state,
        screenSharingActive: action.payload
      }
    case RESET_CALL_STATE:
      return{
        ...state,
        remoteStream: null,
        screenSharingActive: false,
        callerUsername: '',
        localMicrophoneEnabled: true,
        localCameraEnabled: true,
        callingDialogVisible: false
      }

    case SET_GROUP_CALL_ACTIVE:
      return{
        ...state,
        groupCallActive: action.payload
      }
    case SET_GROUP_CALL_STREAMS:
      return{
        ...state,
        groupCallStreams: action.payload
      }
    case CLEAR_GROUP_CALL_DATA:
      return{
        ...state,
        groupCallActive: false,
        groupCallStreams: [],
        callState: callActions.callStates.CALL_AVAILABLE,
        localMicrophoneEnabled: true,
        localCameraEnabled: true
      }

    case SET_CHAT_MESSAGE:
      return{
        ...state,
        message: action.payload
      }

      
    default:
      return state;
  }

}