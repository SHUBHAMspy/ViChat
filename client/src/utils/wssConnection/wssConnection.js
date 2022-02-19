import socketClient from "socket.io-client";
import * as dashboardActions from '../../../store/actions/dashboardActions';
import store from "../../../store/store";
import * as groupCallHandler from '../webRTC/groupCallHandler';
import * as webRTCHandler from "../webRTC/webRTCHandler";

const SERVER =`http://localhost:5000`;

const broadcastEventTypes = {
  ACTIVE_USERS: 'ACTIVE_USERS',
  GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS'
};

let socket;
export const connecWithWebSocketServer = () => {

  socket = socketClient(SERVER);

  socket.on('connection',() => {
    console.log('successfully connected to wss server');
    console.log(socket.id);
  })

  socket.on('broadcast',(data) => {
    handleBroadcastEvents(data);
  })

  // listeners related with direct call
  socket.on('pre-offer',(payload) => {
    answer = webRTCHandler.handlePreOffer(payload);
    if (answer) {
      sendPreOfferAnswer(answer);
      
    }
  })
  socket.on('pre-offer-answer',(payload) => {
    answer = webRTCHandler.handlePreOfferAnswer(payload);
    if (answer) {
      sendWebRTCOffer(answer);
    }
  })
  socket.on('webRTC-offer',(payload) => {
    answer = webRTCHandler.handleOffer(payload);
    if (answer) {
      sendWebRTCAnswer(answer)
    }
  })
  socket.on('webRTC-answer',(payload) => {
    webRTCHandler.handleAnswer(payload);
    
  })
  socket.on('webRTC-candidate',(payload) => {
    webRTCHandler.handleIceCandidate(payload);
    
  })
  socket.on('user-hanged-up',() => {
    webRTCHandler.handleUserHangedUp();
  })

  // listeners related with group calls
  socket.on('group-call-join-request',(data) => {
    groupCallHandler.connectToNewUser(data);
  })

  socket.on('group-call-user-left',(data) => {
    groupCallHandler.removeInactiveStream(data)
  })
}

export const registerNewUser = (username) => {
  socket.emit('register-new-user',{
    username: username,
    socketId: socket.id
  })

}
const sendPreOfferAnswer = (payload) => {
  socket.emit('pre-offer-answer',payload)
}
const sendWebRTCOffer = (payload) => {
  socket.emit('webRTC-offer',payload)
}
const sendWebRTCAnswer = (payload) => {
  socket.emit('webRTC-answer',payload)
}
export const sendWebRTCCandidate = (payload) => {
  socket.emit('webRTC-candidate',payload)
}

export const sendUserHangedUp = (payload) => {
  socket.emit('user-hanged-up',payload);
}

// emitting events related with group calls
export const registerGroupCall = (payload) => {
  socket.emit('group-call-register',payload);
}

export const userWantsToJoinGroupCall = (payload) => {
  socket.emit('group-call-join-request', payload);
};

export const userLeftGroupCall = (payload) => {
  socket.emit('group-call-user-left', payload);
};
export const groupCallClosedByHost = (payload) => {
  socket.emit('group-call-closed-by-host', payload);
};

const handleBroadcastEvents = (data) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(activeUser => activeUser.socketId !== socket.id);
      store.dispatch(dashboardActions.setActiveUsers(activeUsers));
      break;
  
    case broadcastEventTypes.GROUP_CALL_ROOMS:
      const groupCallRooms = data.groupCallRooms.filter(room => room.socketId !== socket.id);
      
      const activeGroupCallRoomId = groupCallHandler.checkActiveGroupCall();
      if (activeGroupCallRoomId) {
        const room = groupCallRooms.find(room => room.roomId === activeGroupCallRoomId);
        if (!room) {
          console.log('clear group data');
          groupCallHandler.clearGroupData();
        }
      }
      store.dispatch(dashboardActions.setGroupCalls(groupCallRooms));
      break;
  
    default:
      break;
  }
}