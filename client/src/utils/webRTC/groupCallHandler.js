import { useSelector } from 'react-redux';
import { clearGroupCallData, setGroupCallIncomingStreams } from '../../../store/actions/callActions';

let myPeer;
let myPeerId;
let groupCallRoomId;
let groupCallHost = false;

const {groupCallStreams} = useSelector(state => state.call);
const {localStream} = useSelector(state => state.call);


export const connectWithMyPeerServer = () => {
  myPeer = new window.Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '5000'
  })
}

  myPeer.on('open',(id) => {
    console.log('succesfully connected with peer server');
    myPeerId = id;
  })

  myPeer.on('call',call => {
    
    // This is you accepting the call and passing your localstream.
    call.answer(localStream);
    
    // This is addressing the group calling streams
    // i.e either this peer is starting the stream and putting out its media
    // or is joing some prestablished stream or groupCall.
    call.on('stream',incomingStream => {
      const stream = groupCallStreams.find(stream => stream.id === incomingStream.id);
      
      if (!stream) {
        addVideoStream(incomingStream);
      }
    })
  
  });



export const createNewGroupCall = () => {
  groupCallHost = true;
  return {
    username: useSelector(state => state.dashboard.username),
    peerId: myPeerId
  };
}

export const joinGroupCall = (hostSocketId, roomId) => {
  groupCallRoomId = roomId;

  return {
    peerId: myPeerId,
    hostSocketId,
    roomId,
    localStreamId: localStream.id
  }

}

export const connectToNewUser = (data) => {
  const mediaConnection = myPeer.call(data.peerId,localStream);

  mediaConnection.on('stream',(incomingStream) => {
    const stream = groupCallStreams.find(stream => stream.id === incomingStream.id);

    if (!stream) {
      addVideoStream(incomingStream);
    }

  });

}

export const leaveGroupCall = () => {
  if (groupCallHost) {
    return {
      peerId: myPeerId
    }
  } 
  else{
    return {
      streamId: localStream.id,
      roomId: groupCallRoomId
    }
  }
}

export const clearGroupData = () => {
  groupCallRoomId = null;
  groupCallHost = null;
  store.dispatch(clearGroupCallData());
  myPeer.destroy();
  connectWithMyPeerServer();

  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;
}

export const removeInactiveStream = (data) => {
  groupCallStreams = groupCallStreams.filter(stream => stream.id !== data.streamId);
  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));

}

const addVideoStream = (incomingStream) => {

  const groupCallStreams = [
    ...groupCallStreams,
    incomingStream
  ];

  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));

}

export const checkActiveGroupCall = () => {
  const {groupCallActive} = useSelector(state => state.call);
  
  if (groupCallActive) {
    return groupCallRoomId;
  } else{
    return false;
  }
}