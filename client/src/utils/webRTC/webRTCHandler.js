import { useSelector } from "react-redux";
import { resetCallDataState, setCallerUsername, setCallingDialogVisible, setCallRejected, setScreenSharingActive } from "../../../store/actions/callActions";
import { setCallState, setLocalStream, setRemoteStream } from "../../store/actions/callActions";
import { callStates } from "../../store/actionTypes/callActionTypes";
import store from "../../store/store";

const preOfferAnswers = {
  CALL_ACCEPTED: 'CALL_ACCEPTED',
  CALL_REJECTED: 'CALL_REJECTED',
  CALL_NOT_AVAILABLE: 'CALL_NOT_AVAILABLE'
};

const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:13902'
  }]
};
const constraints = {audio: true, video: true};

let connectedUserSocketId;
let peerConnection;
let dataChannel;

export const getLocalStream = async() => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    store.dispatch(setLocalStream(stream));
    store.dispatch(setCallState(callStates.CALL_AVAILABLE));
    
    // This is the point where we connect the stream we receive from getUserMedia() to the RTCPeerConnection.  
    createPeerConnection();
  } catch (error) {
    console.log('error occured when trying to get an access to get local stream');
    console.log(error.message);
    
  }
  
}

// Once a RTCPeerConnection is connected to a remote peer, it is possible to stream audio and video between them
const createPeerConnection = () => {
  
  peerConnection = new RTCPeerConnection(configuration);
  
  const {localStream} = useSelector(state => state.call);

  //  A media stream consists of at least one media track, and these are individually added to the RTCPeerConnection when we want to transmit the media to the remote peer.
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track,localStream);
    
  });
  
  // After remote track media arrives, show it in remote video element.
  // To receive the remote tracks that were added by the other peer, we register a listener on the local RTCPeerConnection listening for the track event. 
  // The RTCTrackEvent contains an array of MediaStream objects
  peerConnection.ontrack = (event) => {
    const [remoteStream] = event.streams;
    store.dispatch(setRemoteStream(remoteStream));
  }

  // For incoming data channel messages
  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log('peer connection is ready to receive data channel messages');
    }
    dataChannel.onmessage = (event) => {
      const message = event.data;
      store.dispatch(setMessage(true, message));
    }

  }
  // for creating and sending its own data channel
  dataChannel = peerConnection.createDataChannel('chat');
  dataChannel.onopen = () => {
    console.log('chat data channel succesfully opened');
  };

  peerConnection.onconnectionstatechange = (event) => {
    if(peerConnection.connection === 'connected') {
      console.log('succesfully connected with other peer');
    }
  }
  
  peerConnection.onicecandidate = (event) => {
    if(event.candidate){
      return {
        candidate: event.candidate,
        connectedUserSocketId: connectedUserSocketId
      }

    }
  }

}

export const sendMessageUsingDataChannel = (message) => {
  dataChannel.send(message);
}

export const callToOtherUser = (calleeDetails) => {
  connectedUserSocketId = calleeDetails.socketId;
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS))
  store.dispatch(setCallingDialogVisible(true));
  return {
    callee: calleeDetails,
    caller:{
      username: useSelector(state => state.dashboard.username)
    }
  }
}

export const handlePreOffer = (data) => {
  if(checkIfCallIsPossible()){
    connectedUserSocketId = data.callerSocketId;
    store.dispatch(setCallerUsername(data.callerUsername));
    store.dispatch(setCallState(callStates.CALL_REQUESTED));

  }else{
    return{
      callerSocketId: data.callerSocketId,
      answer: preOfferAnswers.CALL_NOT_AVAILABLE
    }
  }

}

const checkIfCallIsPossible = () => {
  const {localStream} = useSelector(state => state.call);
  const {callState} = useSelector(state => state.call);
  if (localStream === null || callState !== callStates.CALL_AVAILABLE ) {
    return false;
  } else{
    return true;
  }

}

export const acceptIncomingCallRequest = () => {
  return {
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_ACCEPTED
  }
  
}
export const rejectIncomingCallRequest = () => {
  return {
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_REJECTED
  }
  
}

export const handlePreOfferAnswer = (data) => {
  store.dispatch(setCallingDialogVisible(false));

  if (data.answer === preOfferAnswers.CALL_ACCEPTED ) {
    // send webRTC offer
    return sendOffer();
  }
  else{
    let rejectionReason;
    if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
      rejectionReason = 'Callee is not able to pick up the call right now';
    } else {
      rejectionReason = 'Call rejected by the callee';
    }

    store.dispatch(setCallRejected({
      rejected: true,
      reason: rejectionReason
    }));

    resetCallData();
  }

}

const sendOffer = async() => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return {
    calleeSocketId: connectedUserSocketId,
    offer: offer
  }
}
export const handleOffer = async(data) => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return {
    callerSocketId: connectedUserSocketId,
    answer: answer
  }
}

export const handleAnswer = async(data) => {
  await peerConnection.setRemoteDescription(data.answer);
}

export const handleIceCandidate = async(data) => {
  try {
    console.log('adding ice candidates');
    await peerConnection.addIceCandidate(data.candidate);
  } catch (error) {
    console.error('error occured when trying to add received ice candidate', error);
  }

}

let screenSharingStream;

export const switchForScreenSharingStream = async() => {
  const {screenSharingActive} = useSelector(state => state.call);
  if (!screenSharingActive) {
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({video: true});
      store.dispatch(setScreenSharingActive(true));
      const senders = peerConnection.getSenders();
      const sender = senders.find(sender => sender.track.kind === screenSharingStream.getVideoTracks()[0].kind )
      sender.replaceTrack(screenSharingStream.getVideoTracks()[0])
    
    } catch (error) {
      console.log('error occured when trying to get screen sharing stream', err);  
    }
  }
  else{
    const {localStream} = useSelector(state => state.call);
    const senders = peerConnection.getSenders();
    const sender = senders.find(sender => sender.track.kind === localStream.getVideoTracks()[0].kind)
    sender.replaceTrack(localStream.getVideoTracks()[0]);
    store.dispatch(setScreenSharingActive(false));
    screenSharingStream.getTracks().forEach(track => track.stop());

  }
}

export const handleUserHangedUp = () => {
  resetCallDataAfterHangUp();
}
export const hangUp = () => {
  return {
    connectedUserSocketId: connectedUserSocketId
  }
  
}


export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
}

export const resetCallDataAfterHangUp = () => {
  peerConnection.close();
  peerConnection = null;

  createPeerConnection();
  resetCallData();

  const {localStream} = useSelector(state => state.call);
  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;

  const {screenSharingActive} = useSelector(state => state.call);
  if (screenSharingActive) {
    screenSharingStream.getTracks().forEach(track => track.stop());
  }

  store.dispatch(resetCallDataState());
}