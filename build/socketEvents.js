'use strict';

var clients = {};
exports = module.exports = function (io) {
  // Set socket.io listeners.


  io.on('connection', function (socket) {

    console.log('a user connected');

    socket.on('chat mounted', function () {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.userId);
    });
    /* SAVE USER DATA */
    socket.on('storeClientInfo', function (data) {
      clients[data.currentUser] = socket.id;
    });
    /* USER LEAVE SOCKET */
    socket.on('disconnected', function (data) {
      clients[data.current] = null;
      delete clients[data.currentUser];
      console.log('user disconnected');
    });
    /* USER LEAVE ROOM */
    socket.on('leave channel', function (channelID, participant) {
      var isLeave = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // 소켓만 나갈 때
      if (isLeave) {
        socket.broadcast.to(channelID).emit('receive new participant', channelID, participant, isLeave);

        socket.leave(channelID);
      }
    });
    /* USER JOIN ROOM */
    socket.on('join channel', function (channels, participant) {
      // 배열로 받은 channel에 한번에 join
      channels.map(function (channel) {
        var channelID = channel.id;
        socket.join(channelID); // 이미 들어왔다면 무시됨.
        if (io.nsps['/'].adapter.rooms[channelID] !== 'undefined') socket.broadcast.to(channelID).emit('receive new participant', channelID, participant, false);
      });
    });
    /* NEW MESSAGE */
    socket.on('new message', function (message) {
      socket.broadcast.to(message.channelID).emit('new bc message', message);
    });
    /* NEW CHANNEL */
    socket.on('new channel', function (channel) {
      socket.broadcast.emit('receive channel', channel);
    });
    /* NEW MENTION */
    socket.on('new mention', function (channel, username, participants) {
      participants.forEach(function (element) {
        socket.broadcast.to(clients[element]).emit('receive mention', channel, username);
      });
    });
    socket.on('typing', function (data) {
      socket.broadcast.to(data.channel).emit('typing bc', data.user);
    });
    socket.on('stop typing', function (data) {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user);
    });
    /* NEW PREIVATE CHANNEL(GROUP, DIRECT) */
    socket.on('new private channel', function (participants, channel) {
      participants.forEach(function (element) {
        socket.broadcast.to(clients[element]).emit('receive private channel', channel);
      });
    });
    /* USER SIGNUP */
    socket.on('signup participant', function (channels, userName) {
      socket.broadcast.emit('receive signup participant', channels, userName);
    });
  });
};