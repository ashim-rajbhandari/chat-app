const express = require('express');
const { bootstrap } = require('./loaders');
const http = require('http');


function createServer() {
  const app = express();
  const server = http.createServer(app);
  const io = require("socket.io")(3000 , {
    cors : {
      origin:['http://127.0.0.1:5555'],
      methods: ["GET", "POST"]
    }
  })

  io.on("connection" , socket =>{
    socket.on('message', (msg , room , userId , userName , type = null)=>{
      if(!room || room === '') {


        io.emit('message', msg , userId , userName , type);
      } else {
        console.log('in which room', room)
        io.to(room).emit('message', msg , userId , userName , type);
      }
    })

    socket.on('join-room', (room , oldRoom , userId , userName ,  type = null)=>{
      console.log(`leave room : ${oldRoom}` , `enter room: ${room}`)
      if(oldRoom){
        socket.to(oldRoom).emit('leave-room', `${userName} has leaved ${oldRoom} room.` ,userId , userName , 'leave-room');
        socket.leave(oldRoom);
      }
      if(room){
        socket.join(room);
        socket.to(room).emit('join-room', `${userName} has joined ${room} room.`, userId , userName , 'join-room');
      }
    })

    socket.on('disconnect', ()=>{
      console.log('disconnected from server')
    })
  })

  server.listen(() => {
    console.log('listening on *:3000');
  });

  bootstrap(app);
  return app;
}

module.exports = createServer;
