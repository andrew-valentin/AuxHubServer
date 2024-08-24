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

io.on('connection', function(socket){
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
    if(rooms.get(roomId) === undefined){ //someone is about to be added to users
        ackCallback([false, roomId])
    }
    
    socket.join(roomId); //add this socket to "game" room
    // event that runs on join that does init game stuff
    // make a playerConfig object - the data specific to this player that only the player needs to know

    rooms.set(roomId, rooms.get(roomId)+1) //server use only

    ackCallback([true, roomId]) // send bool and room id back as an ack function!
  })
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});