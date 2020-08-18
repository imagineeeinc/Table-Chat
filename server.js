// require express first
var express = require("express");
var io = require('socket.io');
var app = express();

const hostname = '127.0.0.1';
const port = 3000;

//now create a server
//When the server starts listening on port 4000 then fire a callbak function
// The callback function will console.log a string 
var server = app.listen(3000, function(){
 console.log("Listening to requests on port 4000");
});
// serve a static file to the browser 
app.use(express.static("public"));

//declare var io which is a reference to a socket connection made on the server
var io = io(server);
var cache = [];
var nump = 0
//Then use the io.on method which looks for a connection
//upon a connection execute a callback function which will console.log something

//app.get('/', (req, res) => {
//  res.send('Hello World, from express');
//});
io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('new', cache);
    nump++;
    io.emit('numpeople', nump);
    socket.on('chat', (msg, name) => {
        //console.log('message: ' + msg);
        if (cache.length < 40){
            cache.push(msg)
        } else {
            cache.shift()
            cache.push(msg)
        }
        io.emit('chat message', msg, name);
      });
      socket.on('name', (name, oldname) => {
        io.emit('name set', name, oldname);
      });
      socket.on('styping', (name) => {
        io.emit('typing', name);
      });
    socket.on('disconnect', () => {
      console.log('user disconnected');
      nump--;
      io.emit('numpeople', nump);
    });
  });
//console.log(socket.connected);
//console.log(socket.id);
//console.log(socket.disconnected);