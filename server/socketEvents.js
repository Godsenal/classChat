var clients = {};
exports = module.exports = function (io) {
  // Set socket.io listeners.


  io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('chat mounted', function() {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.userId);
    });
    socket.on('storeClientInfo', function (data) {
      clients[data.currentUser] = socket.id;
    });
    socket.on('disconnected', function(data){
      clients[data.current] = null;
      delete clients[data.currentUser];
      console.log('user disconnected');
    });
    socket.on('leave channel', function(channelID, participant, isLeave = false) { // 소켓만 나갈 때
      if(isLeave){
        socket.broadcast.to(channelID).emit('receive new participant', channelID, participant, isLeave);
      }
      socket.leave(channelID);
    });
    socket.on('join channel', function(channelID, participant) {
      socket.join(channelID);
      socket.broadcast.to(channelID).emit('receive new participant', channelID, participant, false);
    });
    socket.on('new message', function(message) {
      socket.broadcast.to(message.channelID).emit('new bc message', message);
    });
    socket.on('new channel', function(channel) {
      socket.broadcast.emit('receive channel', channel);
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
