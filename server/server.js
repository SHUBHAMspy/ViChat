const express = require('express');
const {Server} = require('socket.io');
const {v5:uuid} = require('uuid');
const {ExpressPeerServer} = require('peer');
const {broadcastEventTypes} = require('../store/actionTypes/broadcastEventTypes');
//const { io } = require('socket.io-client');
const PORT = 5000;

const app = express();
console.log(socket);				

//Created express server
const server = app.listen(PORT,() => console.log(`Server listening on port: ${PORT}`))

// Created Peer Server
const peerServer = ExpressPeerServer(server,{
  debug:true
});

app.use('/peerjs',peerServer);

// Now write code to connect to this peerServer
// This will be executed on every peer connection
peerServer.on('connection',(client) => {
  console.log('succesfully connected to peer js server');
  console.log(client.id);

})

//Enabling or establishing a websocket server
const wss =  new Server(server,{
  cors:{
    origin: '*',
    methods: ['GET','POST']
  }

});

let peers = [];  // for pushing new users or peers into 
let groupCallRooms = [];

wss.on('connection',(socket) => {
  console.log('Socket connection has been established');
  socket.emit('connection',null);
  console.log(socket.id);

  socket.on('register-new-user',(data) => {
    peers.push({
      username: data.username,
      socketId: data.socketId
    })

    console.log('Registerd a new user');
    console.log(`Peers: ${peers}`);

    /* Now we are into broadcsting */

    // Since people are joining we also have to make aware to the other eers or any group
    // that new people have joined
    // that means we have to braodcast the information of new joinees to other peers or group of peers
    wss.sockets.emit('broadcast',{
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers
    });

    wss.sockets.emit('broadcast',{
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms
    });
  });

  socket.on('disconnect',() => {
    console.log('user has disconnected');

    peers = peers.filter((peer) => peer.socketId !== socket.id);
    // again need of broacasting the current status information
    wss.sockets.emit('broadcast',{
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers
    })

    groupCallRooms = groupCallRooms.filter((room) => room.socketId !== socket.id);
    wss.sockets.emit('broadcast',{
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms
    })
  });

  // direct call listeners
  socket.on('call-pre-offer',({caller,callee}) => {
    wss.to(callee.socketId).emit(('call-pre-offer'),{
      callerUsername: caller.username,
      callerSocketId: socket.id
    });
  });

  socket.on('call-pre-offer-answer',(data) => {
    wss.to(data.callerSocketId).emit(('call-pre-offer-answer'),{
      answer: data.answer
    });
  });
  
  socket.on('webRTC-offer',(data) => {
    wss.to(data.callerSocketId).emit(('webRTC-offer'),{
      answer: data.answer
    });
  });
  
  socket.on('webRTC-answer',(data) => {
    wss.to(data.callerSocketId).emit(('webRTC-answer'),{
      answer: data.answer
    });
  });
  
  socket.on('webRTC-candidate',(data) => {
    console.log('handling ice candidate');
    wss.to(data.connectedUserSocketId).emit(('webRTC-candidate'),{
      candidate: data.candidate
    });
  });

  socket.on('user-hanged-up',(data) => {
    wss.to(data.connectedUserSocketId).emit('user-hanged-up');
  })

  // listeners related with group call
  socket.on('group-call-register',(data) => {
    const roomId = uuid();
    socket.join(roomId);

    const newGroupCallRoom = {
      peerId: data.peerId,
      hostname: data.username,
      socketId: socket.id,
      roomId: roomId
    }

    groupCallRooms.push(newGroupCallRoom);

    wss.sockets.emit('broadcast',{
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms
    });
  });

  socket.on('group-call-join-request', (data) => {
    wss.to(data.roomId).emit('group-call-join-request',{
      peerId: data.peerId,
      streamId: data.streamId
    });

    socket.join(data.roomId);
  });

  socket.on('group-call-user-left',(data) => {
    socket.leave(data.roomId);

    wss.to(data.roomId).emit('group-call-user-left',{
      streamId: data.streamId
    });
  });

  socket.on('group-call-closed-by-host',(data) => {
    groupCallRooms = groupCallRooms.filter(room => room.peerId !== data.peerId);

    wss.sockets.emit('broadcast',{
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms
    });
  });

});