var clients = {};
exports = module.exports = function (io) {
  // Set socket.io listeners.


  io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('chat mounted', function() {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.userId);
    });
    /* SAVE USER DATA */
    socket.on('storeClientInfo', function (data) {
      clients[data.currentUser] = socket.id;
    });
    /* USER LEAVE SOCKET */
    socket.on('disconnected', function(data){
      clients[data.current] = null;
      delete clients[data.currentUser];
      console.log('user disconnected');
    });
    /* USER LEAVE ROOM */
    socket.on('leave channel', function(channelID, participant, isLeave = false) {
      if(isLeave){ //isLeave가 true면 완전히 나가는 것.
        socket.broadcast.to(channelID).emit('receive new participant', channelID, participant, isLeave);

        socket.leave(channelID);
      }
    });
    /* USER JOIN ROOM */
    socket.on('join channel', function(channels, participant) { // 배열로 받은 channel에 한번에 join
      channels.map((channel) => {
        var channelID = channel.id;
        socket.join(channelID); // 이미 들어왔다면 무시됨.
        if(io.nsps['/'].adapter.rooms[channelID] !== 'undefined')
          socket.broadcast.to(channelID).emit('receive new participant', channelID, participant, false);
      });
    });
    socket.on('join channel invite', function(channelID) { // 배열로 받은 channel에 한번에 join
      socket.join(channelID);
    });
    /* EXIST PARTICIPANTS WHEN INVITE OCCUR */
    socket.on('invite participant', function(channel, participants){ // user name = sender name
      participants.forEach(function(participant){
        socket.broadcast.to(clients[participant]).emit('receive invite participant',channel);
      });
      socket.emit('receive invite participant', channel);
    });
    /* USER INVITED ROOM */
    socket.on('invite channel', function(channel, usernames){ // invite 받은 user가 channel을 바로 받을 수 있도록 함.
      usernames.forEach(function(username){
        socket.broadcast.to(clients[username]).emit('receive invite',channel);
      });
    });
    /* NEW MESSAGE */
    socket.on('new message', function(message) {
      socket.broadcast.to(message.channelID).emit('new bc message', message);
    });
    /* NEW CHANNEL */
    socket.on('new channel', function(channel) {
      socket.broadcast.emit('receive channel', channel);
    });
    /* NEW MENTION */
    socket.on('new mention', function(channel,username,participants) {
      participants.forEach(function(element){
        socket.broadcast.to(clients[element]).emit('receive mention',channel,username);
      });
    });
    socket.on('typing', function (data) {
      socket.broadcast.to(data.channel).emit('typing bc', data.user);
    });
    socket.on('stop typing', function (data) {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user);
    });
    /* NEW PREIVATE CHANNEL(GROUP, DIRECT) */
    socket.on('new private channel', function(participants,channel) {
      participants.forEach(function(element){
        socket.broadcast.to(clients[element]).emit('receive private channel', channel);
      });

    });
    /* USER SIGNUP */
    socket.on('signup participant', function(channels, userName){
      socket.broadcast.emit('receive signup participant',channels, userName);
    });
  });
};
