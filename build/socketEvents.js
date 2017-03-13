'use strict';

exports = module.exports = function (io) {
  // Set socket.io listeners.
  io.on('connection', function (socket) {
    socket.join('Lobby');

    console.log('a user connected');

    socket.on('chat mounted', function () {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.id);
    });
    socket.on('leave channel', function (channel) {
      socket.leave(channel);
    });
    socket.on('join channel', function (channel) {
      socket.join(channel.id);
    });
    socket.on('new message', function (message) {
      socket.broadcast.to(message.channelID).emit('new bc message', message);
    });
    socket.on('new channel', function (channel) {
      socket.broadcast.emit('new channel', channel);
    });
    socket.on('typing', function (data) {
      socket.broadcast.to(data.channel).emit('typing bc', data.user);
    });
    socket.on('stop typing', function (data) {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user);
    });
    socket.on('new private channel', function (socketID, channel) {
      socket.broadcast.to(socketID).emit('receive private channel', channel);
    });
  });
};