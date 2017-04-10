import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Segment, Dimmer, Loader} from 'semantic-ui-react';
import uuid from 'node-uuid';
import moment from 'moment';

import {receiveRawMessage, addMessage, listMessage, filterMessage, deleteReceiveMessage, deleteLastDateID} from '../actions/message';
import {addChannel,
        changeChannel,
        listChannel,
        searchChannel,
        joinChannel,
        leaveChannel,
        receiveRawChannel,
        receiveRawParticipant,
        receiveRawSignupParticipant} from '../actions/channel';
import {receiveSocket, signoutRequest, getStatusRequest} from '../actions/authentication';
import {addNotification} from '../actions/environment';
import {Sidebar, SearchModal} from '../components';
import {ChatView} from './';
import styles from '../Style.css';

class Chat extends React.Component {
  constructor(){
    super();
    this.state={
      searchModal: false,
    };

    this.handleSignout = this.handleSignout.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.handleFilterMessage = this.handleFilterMessage.bind(this);
    this.changeActiveChannel = this.changeActiveChannel.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleSearchClose = this.handleSearchClose.bind(this);
    this.handleJoinChannel = this.handleJoinChannel.bind(this);
    this.handleLeaveChannel = this.handleLeaveChannel.bind(this);
    this.handleAddChannel = this.handleAddChannel.bind(this);
    this.handleAddGroup = this.handleAddGroup.bind(this);
  }
  //App 에서의 getStatusRequest가 ComponentDidMount에서 실행이 되어야 여기서 sign data를 사용이 가능..

  onUnload = () => {
    localStorage.setItem('lastAccess',moment().format());
    this.props.socket.emit('disconnected',this.props.status);
  }
  componentWillUnmount() {
    this.props.socket.emit('disconnected',this.props.status);
    window.removeEventListener('beforeunload', this.onUnload);
  }

  componentDidMount() {
    /*direct connect without signin*/
    /* Get Singin Status First */
    /*
    function getCookie(name){
      var value = '; '+ document.cookie;
      var parts = value.split('; ' + name + '=');
      if (parts.length == 2) return parts.pop().split(';').shift();
    }
    let signinData = getCookie('key');

        // if loginData is undefined, do nothing
    if(typeof signinData === 'undefined'){
      browserHistory.push('/');
    }

        // decode base64 & parse json
    signinData = JSON.parse(atob(signinData));
        // if not logged in, do nothing
    if(!signinData.isSignedIn){
      browserHistory.push('/');
    }
    */
    let token = localStorage.getItem('token') || null;
    if(token === null){ // if localStorage doesn't have token.
      browserHistory.push('/');
    }
    this.props.getStatusRequest(token).then(()=>{
      if(!this.props.status.valid){

        browserHistory.push('/');
      }
      else{
        window.addEventListener('beforeunload', this.onUnload); // 브라우저 닫기 전에 실행할 것(lastAccess time저장)
        let lastAccess = localStorage.getItem('lastAccess') || -1;
        this.props.listChannel(this.props.status.currentUser)
          .then(()=>{
            var findChannel = this.props.channels.filter((channel) => {return channel.id === '1';});
            var publicChannel = findChannel[0];
            this.props.changeChannel(publicChannel);
            this.props.listMessage(this.props.activeChannel.id,true,lastAccess).then(()=>{
            this.props.socket.emit('chat mounted');
            this.props.socket.emit('storeClientInfo',this.props.status);
            this.props.socket.emit('join channel',this.props.channels, this.props.status.currentUser, this.props.activeChannel.participants);
            this.props.socket.on('receive signup participant', (channels, userName) => {
              this.props.receiveRawSignupParticipant(channels, userName);
            });
            this.props.socket.on('receive new participant', (channelID, participant, isLeave) =>
              this.props.receiveRawParticipant(channelID, participant, isLeave)
            );
            this.props.socket.on('new bc message', (message) =>{
              let isActive = false;
              if(this.props.activeChannel.id === message.channelID){
                isActive = true;
              }
              this.props.receiveRawMessage(message, isActive);
            });
            this.props.socket.on('receive private channel', (channel) =>{
              this.props.receiveRawChannel(channel);
              if(channel.type === 'GROUP'){ //초대 받으면 자동으로 Join
                this.props.socket.emit('join channel',[channel], this.props.status.currentUser);
                this.props.addNotification({message:'새로운 그룹이 생성되었습니다!', level:'info', position:'bl',uuid: `${Date.now()}${uuid.v4()}`});
              }else if(channel.type ==='DIRECT'){
                this.props.socket.emit('join channel',[channel], this.props.status.currentUser);
                this.props.addNotification({message:'1:1 채널이 추가되었습니다!', level:'info', position:'bl',uuid: `${Date.now()}${uuid.v4()}`});
              }
            });
            this.props.socket.on('receive socket', socketID =>
              this.props.receiveSocket(socketID)
            );
          });
        });
      }

    });

  }
  changeActiveChannel(channel) { // leave가 true라면 this.props.socket전송할 participants를 보내줌.
    this.props.socket.emit('join channel',[channel], this.props.status.currentUser);
    this.props.changeChannel(channel);
    this.props.deleteReceiveMessage(this.props.activeChannel.id);
    var result = channel.id in this.props.list; //현재 세션에서 들어갔던 채널인지 아닌지.(state에 저장되어있는지 아닌지)

    if(!result){
      let lastAccess = localStorage.getItem('lastAccess')|| '-1'; // get lass Accessed time
      this.props.listMessage(channel.id, true, lastAccess);
    }else{
      this.props.listMessage(channel.id, false, '-1');
    }
  }
  addMessage(message){
    let types = 'message';
    if(typeof message !== 'string'){
      types = message.type;
    }
    var newMessage = {
      id: `${Date.now()}${uuid.v4()}`,
      channelID: this.props.activeChannel.id,
      contents: message,
      userName: this.props.status.currentUser,
      created: moment().format(),
      types: types,
    };
    this.props.addMessage(newMessage)
      .then(() => {
        this.props.socket.emit('new message', this.props.messageAddMessage);
      })
      .catch(() => {
        console.log('failed to add Message');
      });

  }
  handleFilterMessage(channelID, types){
    this.props.filterMessage(channelID, types);
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
          this.props.socket.emit('new private channel', this.props.channelAdd.channel.participants, this.props.channelAdd.channel);
          this.changeActiveChannel(this.props.channelAdd.channel);
        }
        else if(this.props.channelAdd.status === 'FAILURE'){
          if(this.props.channelAdd.errCode === 2){ // 이미 있는 다이렉트메시지 채널을 만들때.
            var existChannel = this.props.channels.find((channel) => {
              return channel.name === group.name;
            });
            this.props.socket.emit('new private channel', existChannel.participants, existChannel);
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
    var activeChannel = this.props.activeChannel; // ui를 위해 먼저 채널을 이동.
    this.props.socket.emit('leave channel', this.props.activeChannel.id, this.props.status.currentUser, true);
    this.changeActiveChannel(this.props.channels[0], true);
    this.props.leaveChannel(activeChannel.id, this.props.status.currentUser)
      .then(()=>{
        if(this.props.channelLeave.status === 'SUCCESS'){
           //hard coding- need to fix!
        }
      });
  }
  handleSignout(){
    var status = this.props.status;

    this.props.signoutRequest();
    this.props.socket.emit('leave channel', this.props.activeChannel.id, status.currentUser);
    this.props.socket.emit('disconnected',this.props.status);
    Materialize.toast('Good Bye!', 2000);
    let signinData = {
      isSignedIn: false,
      id: '',
      nickname: '',
      isAdmin: false,
    };
    //document.cookie = 'key=' + btoa(JSON.stringify(signinData));

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
    const {status} = this.props;
    const {screenHeight, screenWidth} = this.props.environment;
    const isMobile = (screenWidth<600 && screenWidth>1)?true:false;
    const isLoading = <Segment basic className={styles.loadingView}>
                        <Dimmer active inverted>
                          <Loader indeterminate inline='centered' size='massive'>Authenticating User</Loader>
                        </Dimmer>
                      </Segment>;
    const layoutStyle = isMobile?styles.flexLayoutMobile:styles.flexLayout;
    const sidebarStyle = isMobile?styles.chatSidebarMobile:styles.chatSidebar;
    const chatViewStyle = isMobile?styles.chatViewMobile:styles.chatView;
    //style={{'height':{screenHeight}+'px', 'width':{screenWidth}+'px', 'overflowX':'hidden', 'overflowY':'hidden'}}
    return(
      <div style={{'height':screenHeight+'px', 'width':screenWidth+'px', 'overflowX':'hidden', 'overflowY':'hidden'}}>
      {status.valid?<div className={layoutStyle} style={{'height':screenHeight+'px', 'width':screenWidth+'px', 'overflowX':'hidden', 'overflowY':'hidden'}}>
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
                   listChannel={this.props.listChannel}
                   messageReceive={this.props.messageReceive}/>
        </div>
        <div className={chatViewStyle} >
            <ChatView isMobile={isMobile}
                      screenHeight={screenHeight}
                      activeChannel={this.props.activeChannel}
                      messageListStatus={this.props.messageListStatus}
                      messageAddStatus={this.props.messageAddStatus}
                      messageReceive={this.props.messageReceive}
                      deleteReceiveMessage={this.props.deleteReceiveMessage}
                      deleteLastDateID={this.props.deleteLastDateID}
                      listMessage={this.props.listMessage}
                      filterMessage={this.handleFilterMessage}
                      messages={this.props.messages}
                      messageFilter={this.props.messageFilter}
                      isLast={this.props.isLast}
                      addMessage={this.addMessage}
                      addGroup={this.handleAddGroup}
                      leaveChannel={this.handleLeaveChannel}
                      list={this.props.list}
                      currentUser={this.props.status.currentUser}/>
                  </div>
      </div>:isLoading}
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
    list: state.message.list,
    isLast: state.message.list.isLast,
    status: state.authentication.status,
    isAdmin : state.authentication.status.isAdmin,
    search : state.channel.search,
    join : state.channel.join,
    messageAddMessage : state.message.add.message,
    messageAddStatus : state.message.add.status,
    messageListStatus: state.message.list.status,
    messageReceive: state.message.receive,
    messageFilter : state.message.filter,
    environment: state.environment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    receiveSocket: (socketID) => {
      return dispatch(receiveSocket(socketID));
    },
    getStatusRequest: (token) => {
      return dispatch(getStatusRequest(token));
    },
    receiveRawMessage: (message, isActive) => {
      return dispatch(receiveRawMessage(message, isActive));
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
    filterMessage: (channelID, types, topMessageId) => {
      return dispatch(filterMessage(channelID, types, topMessageId));
    },
    deleteReceiveMessage: (channelID) => {
      return dispatch(deleteReceiveMessage(channelID));
    },
    deleteLastDateID: (channelID) =>{
      return dispatch(deleteLastDateID(channelID));
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
    receiveRawSignupParticipant: (channels, userName) => {
      return dispatch(receiveRawSignupParticipant(channels, userName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
