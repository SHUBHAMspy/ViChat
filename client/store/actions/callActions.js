import { CLEAR_GROUP_CALL_DATA, RESET_CALL_STATE, SET_CALLER_USERNAME, SET_CALLING_DIALOG_VISIBLE, SET_CALL_REJECTED, SET_GROUP_CALL_ACTIVE, SET_GROUP_CALL_STREAMS, SET_LOCAL_CAMERA_ENABLED, SET_LOCAL_MICROPHONE_ENABLED, SET_LOCAL_STREAM, SET_REMOTE_STREAM, SET_SCREEN_SHARING_ACTIVE } from "../actionTypes/callActionTypes"

export const setLocalStream = (localStream) => {
  return{
    type: SET_LOCAL_STREAM,
    payload: localStream
  }
}
export const setRemoteStream = (remoteStream) => {
  return{
    type: SET_REMOTE_STREAM,
    payload: remoteStream
  }
}
export const setCallState = (callState) => {
  return{
    type: SET_LOCAL_STREAM,
    payload: callState
  }
}

export const setCallingDialogVisible = (visible) => {
  return{
    type: SET_CALLING_DIALOG_VISIBLE,
    payload: visible
  }
}
export const setCallerUsername = (callerUsername) => {
  return{
    type: SET_CALLER_USERNAME,
    payload: callerUsername
  }
}
export const setCallRejected = (callRejectedDetails) => {
  return{
    type: SET_CALL_REJECTED,
    payload: {
      rejected:callRejectedDetails.rejected,
      reason: callRejectedDetails.reason
    }
  }
}

export const resetCallDataState = () => {
  return {
    type: RESET_CALL_STATE
  };
}


export const setLocalMicrophoneEnabled = (enabled) => {
  return {
    type: SET_LOCAL_MICROPHONE_ENABLED,
    payload:enabled
  };
};

export const setLocalCameraEnabled = (enabled) => {
  return {
    type: SET_LOCAL_CAMERA_ENABLED,
    payload:enabled
  };
};

export const setScreenSharingActive = (active) => {
  return {
    type: SET_SCREEN_SHARING_ACTIVE,
    payload:active
  };
};

export const setMessage = (messageReceived, messageContent) => {
  return{
    type: SET_CALLER_USERNAME,
    payload: {
      received:messageReceived,
      content: messageContent
    }
  }
}

export const setGroupCallActive = (active) => {
  return {
    type: SET_GROUP_CALL_ACTIVE,
    payload:active
  };
};

export const setGroupCallIncomingStreams = (groupCallStreams) => {
  return {
    type: SET_GROUP_CALL_STREAMS,
    payload:groupCallStreams
  };
};

export const clearGroupCallData = () => {
  return {
    type: CLEAR_GROUP_CALL_DATA
  };
};