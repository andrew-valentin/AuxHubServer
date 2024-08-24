const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

function getRoomId() {
    let roomId = '';

    for (let i = 0; i < 5; i++) 
    roomId += String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 26));

    return roomId;
}

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createRoom', (ackCallback) => {
    let roomId = undefined;
    
    while (rooms.get(roomId) !== undefined) roomId = getRoomId();

    console.log('creating room with room ID: ' + roomId);
    rooms.set(roomId, 1)
    socket.join(roomId);

    ackCallback([true, roomId]);
  });

  socket.on('joinRoom', (roomId, ackCallback) => {
    if(rooms.get(roomId) === undefined){
        ackCallback([false, roomId])
    }
    
    rooms.set(roomId, rooms.get(roomId)+1);

    ackCallback([true, roomId]);
  });

    server.listen(3000, () => {
    console.log('listening on *:3000');
    });
});