import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {} from 'semantic-ui-react';
import io from 'socket.io-client';
import uuid from 'node-uuid';
import NotificationSystem from 'react-notification-system';

import {receiveRawMessage, addMessage, listMessage} from '../actions/message';
import {addChannel, changeChannel, listChannel, searchChannel, joinChannel, leaveChannel, receiveRawChannel, receiveRawParticipant} from '../actions/channel';
import {receiveSocket, signoutRequest, getStatusRequest} from '../actions/authentication';
import {addNotification} from '../actions/environment';
import {Sidebar, SearchModal} from '../components';
import {ChatView} from './';
import styles from '../Style.css';

const socket = io.connect();

class Chat extends React.Component {
  constructor(){
    super();
    this.state={
      searchModal: false,
    };

    this.handleSignout = this.handleSignout.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.changeActiveChannel = this.changeActiveChannel.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleSearchClose = this.handleSearchClose.bind(this);
    this.handleJoinChannel = this.handleJoinChannel.bind(this);
    this.handleLeaveChannel = this.handleLeaveChannel.bind(this);
    this.handleAddChannel = this.handleAddChannel.bind(this);
    this.handleAddGroup = this.handleAddGroup.bind(this);
  }
  //App 에서의 getStatusRequest가 ComponentDidMount에서 실행이 되어야 여기서 sign data를 사용이 가능..
  componentWillMount(){

  }


  componentDidMount() {
    /*direct connect without signin*/
    /* Get Singin Status First */
    this.props.getStatusRequest().then(()=>{
      if(!this.props.status.isSignedIn){

        browserHistory.push('/');
      }
      this.props.listChannel(this.props.status.currentUser)
        .then(() => {
          var publicChannel = this.props.channels.find((channel) => {return channel.id === '1';});
          this.props.changeChannel(publicChannel);

          this.props.listMessage(this.props.activeChannel.id,true,-1)
            .then(()=>{
              socket.emit('chat mounted');
              socket.emit('join channel',this.props.activeChannel.id, this.props.status.currentUser);
              socket.emit('storeClientInfo',this.props.status);
              socket.on('receive new participant', (channelID, participant, isLeave) =>
                this.props.receiveRawParticipant(channelID, participant, isLeave)
              );
              socket.on('new bc message', (message) =>{
                this.props.receiveRawMessage(message);
              });
              socket.on('receive private channel', (channel) =>{
                this.props.receiveRawChannel(channel);
                if(channel.type === 'GROUP'){
                  this.props.addNotification({message:'새로운 그룹이 생성되었습니다!', level:'info', position:'bl',uuid: `${Date.now()}${uuid.v4()}`});
                }else if(channel.type ==='DIRECT'){
                  this.props.addNotification({message:'1:1 채널이 추가되었습니다!', level:'info', position:'bl',uuid: `${Date.now()}${uuid.v4()}`});
                }
              });
              socket.on('receive socket', socketID =>
                this.props.receiveSocket(socketID)
              );
            });

        });

    });

  }
  changeActiveChannel(channel, isLeave = false) {
    socket.emit('leave channel', this.props.activeChannel.id, this.props.status.currentUser, isLeave);
    socket.emit('join channel',channel.id, this.props.status.currentUser);
    this.props.changeChannel(channel);
    this.props.listMessage(channel.id, true, -1);
  }
  addMessage(message){
    var newMessage = {
      id: `${Date.now()}${uuid.v4()}`,
      channelID: this.props.activeChannel.id,
      contents: message,
      userName: this.props.status.currentUser,
    };
    this.props.addMessage(newMessage)
      .then(() => {
        socket.emit('new message', this.props.messageAddMessage);
      })
      .catch(() => {
        console.log('failed to add Message');
      });
  }
  handleAddChannel(channel){
    channel.channelID = this.props.activeChannel.id;
    this.props.addChannel(channel).then(()=>{
      this.changeActiveChannel(channel);
    });
  }
  handleAddGroup(group){
    var newChannel = {
      name : group.name,
      id: `${Date.now()}${uuid.v4()}`,
      private: true,
      participants : group.participants,
      type : group.type,
      channelID : this.props.activeChannel.id,
    };
    this.props.addChannel(newChannel)
      .then(()=> {
        if(this.props.channelAdd.status === 'SUCCESS'){
          socket.emit('new private channel', this.props.channelAdd.channel.participants, this.props.channelAdd.channel);
          this.changeActiveChannel(this.props.channelAdd.channel);
        }
        else if(this.props.channelAdd.status === 'FAILURE'){
          if(this.props.channelAdd.errCode === 2){ // 이미 있는 다이렉트메시지 채널을 만들때.
            var existChannel = this.props.channels.find((channel) => {
              return channel.name === group.name;
            });
            socket.emit('new private channel', existChannel.participants, existChannel);
            this.changeActiveChannel(existChannel);
          }else{
            this.props.addNotification({message:`에러가 발생했습니다. code=${this.props.channelAdd.errCode}`, level:'error', position:'bc',uuid: `${Date.now()}${uuid.v4()}`});
          }
        }
      });
  }
  handleJoinChannel(channel){
    let channels = [channel];
    this.props.joinChannel(channels, this.props.status.currentUser).then(()=>{
      this.props.listChannel(this.props.status.currentUser).then(()=>{
        this.changeActiveChannel(channel);
        this.handleSearchClose();
      });

    });
  }
  handleLeaveChannel(){
    this.props.leaveChannel(this.props.activeChannel.id, this.props.status.currentUser)
      .then(()=>{
        if(this.props.channelLeave.status === 'SUCCESS'){
          this.changeActiveChannel(this.props.channels[0], true); //hard coding- need to fix!
        }
      });
  }
  handleSignout(){
    var status = this.props.status;

    this.props.signoutRequest().then(
      () => {
        socket.emit('leave channel', this.props.activeChannel.id, status.currentUser);
        socket.emit('disconnected',this.props.status);
        Materialize.toast('Good Bye!', 2000);
        let signinData = {
          isSignedIn: false,
          id: '',
          nickname: '',
          isAdmin: false,
        };
        document.cookie = 'key=' + btoa(JSON.stringify(signinData));
      }
    );
  }
  handleSearchClick(){
    this.props.searchChannel('*').then(() => {
      this.setState({
        searchModal: true,
      });
    });
  }
  handleSearchClose(){
    this.setState({
      searchModal: false,
    });
  }
  render () {
    const {screenHeight, screenWidth} = this.props.environment;
    const isMobile = (screenWidth<600 && screenWidth>1)?true:false;
    const layoutStyle = isMobile?styles.flexLayoutMobile:styles.flexLayout;
    const sidebarStyle = isMobile?styles.chatSidebarMobile:styles.chatSidebar;

    return(
      <div className={layoutStyle} style={{'height':{screenHeight}}}>
        <SearchModal isOpen={this.state.searchModal}
                     results={this.props.search.results}
                     handleJoinChannel = {this.handleJoinChannel}
                     changeActiveChannel={this.changeActiveChannel}
                     handleSearchClose={this.handleSearchClose}/>
        <div className={sidebarStyle}>
          <Sidebar channels={this.props.channels}
                   changeActiveChannel={this.changeActiveChannel}
                   activeChannel={this.props.activeChannel}
                   status={this.props.status}
                   channelListStatus={this.props.channelListStatus}
                   handleSignout={this.handleSignout}
                   handleSearchClick={this.handleSearchClick}
                   isMobile={isMobile}
                   listChannel={this.props.listChannel}/>
        </div>
        <div className={styles.chatView}>
            <ChatView isMobile={isMobile}
                      activeChannel={this.props.activeChannel}
                      messageListStatus={this.props.messageListStatus}
                      messageAddStatus={this.props.messageAddStatus}
                      messageReceive={this.props.messageReceive}
                      listMessage={this.props.listMessage}
                      messages={this.props.messages}
                      isLast={this.props.isLast}
                      addMessage={this.addMessage}
                      addGroup={this.handleAddGroup}
                      leaveChannel={this.handleLeaveChannel}
                      currentUser={this.props.status.currentUser}/>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    activeChannel: state.channel.activeChannel,
    channelAdd : state.channel.add,
    channels: state.channel.list.channels,
    channelListStatus: state.channel.list.status,
    channelLeave : state.channel.leave,
    messages: state.message.list.messages,
    isLast: state.message.list.isLast,
    status: state.authentication.status,
    isAdmin : state.authentication.status.isAdmin,
    search : state.channel.search,
    join : state.channel.join,
    messageAddMessage : state.message.add.message,
    messageAddStatus : state.message.add.status,
    messageListStatus: state.message.list.status,
    messageReceive: state.message.receive,
    environment: state.environment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    receiveSocket: (socketID) => {
      return dispatch(receiveSocket(socketID));
    },
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
    receiveRawMessage: (message) => {
      return dispatch(receiveRawMessage(message));
    },
    receiveRawChannel: (channel) => {
      return dispatch(receiveRawChannel(channel));
    },
    receiveRawParticipant: (channelID, participant, isLeave) => {
      return dispatch(receiveRawParticipant(channelID, participant, isLeave));
    },
    addMessage: (message) => {
      return dispatch(addMessage(message));
    },
    listMessage: (channelID, isInitial, topMessageId) => {
      return dispatch(listMessage(channelID, isInitial, topMessageId));
    },
    changeChannel: (channel) => {
      return dispatch(changeChannel(channel));
    },
    addChannel: (channel) => {
      return dispatch(addChannel(channel));
    },
    listChannel: (userName) => {
      return dispatch(listChannel(userName));
    },
    joinChannel: (channelName, userName) => {
      return dispatch(joinChannel(channelName, userName));
    },
    leaveChannel: (channelID, userName) => {
      return dispatch(leaveChannel(channelID, userName));
    },
    searchChannel: (channelName) => {
      return dispatch(searchChannel(channelName));
    },
    signoutRequest: () => {
      return dispatch(signoutRequest());
    },
    addNotification: (notification) => {
      return dispatch(addNotification(notification));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
