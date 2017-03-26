var clients = {};
exports = module.exports = function (io) {
  // Set socket.io listeners.


  io.on('connection', (socket) => {
    socket.join('Lobby');

    console.log('a user connected');

    socket.on('chat mounted', function() {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.id);
    });
    socket.on('storeClientInfo', function (data) {
      clients[data.currentUser] = socket.id;
      console.log(clients);
    });
    socket.on('leave channel', function(channelID) {
      socket.leave(channelID);
    });
    socket.on('join channel', function(channelID, participant) {
      socket.join(channelID);
      socket.broadcast.to(channelID).emit('receive new participant', channelID, participant);
    });
    socket.on('new message', function(message) {
      socket.broadcast.to(message.channelID).emit('new bc message', message);
    });
    socket.on('new channel', function(channel) {
      socket.broadcast.emit('new channel', channel);
    });
    socket.on('typing', function (data) {
      socket.broadcast.to(data.channel).emit('typing bc', data.user);
    });
    socket.on('stop typing', function (data) {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user);
    });
    socket.on('new private channel', function(participants,channel) {
      participants.forEach(function(element){
        socket.broadcast.to(clients[element]).emit('receive private channel', channel);
      });
    });
  });
};
